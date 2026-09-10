// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Keyboard and pointing-device detection.
//!
//! Linux reads `/proc/bus/input/devices`, a single file listing every evdev node with its
//! handlers and capability bitmaps. Classification is deliberately **exclusive**: a device is
//! reported as a keyboard or a mouse or neither, never both.
//!
//! ## Why a device can be unclassifiable
//!
//! A peripheral paired through a Logitech Unifying/Bolt receiver is presented by the kernel
//! with a *merged* capability set — the receiver synthesizes one descriptor covering every
//! device class it can carry. Measured on a Bolt receiver carrying an MX Keys keyboard and an
//! MX Master 3 mouse, **every** kernel-visible signal is identical for the two:
//!
//! | source | MX Keys (keyboard) | MX Master 3 (mouse) |
//! |---|---|---|
//! | `/proc/bus/input/devices` handlers | `sysrq kbd leds mouse6 event26` | `sysrq kbd leds mouse5 event25` |
//! | `capabilities/rel` | `0x1943` | `0x1943` |
//! | `capabilities/key` (alphabet block) | present | present |
//! | udev `ID_INPUT_*` | `POINTINGSTICK` | `POINTINGSTICK` |
//! | USB HID `bInterfaceProtocol` | `00` | `00` |
//! | HID report descriptor prologue | `05 01 09 06 a1 01` | `05 01 09 06 a1 01` |
//!
//! So capability inspection alone *cannot* separate them, and a classifier that guesses gets
//! it wrong in both directions (fastfetch 2.66 reports the MX Master 3 as a keyboard and the
//! MX Keys as a mouse on this hardware). The one place the truth survives is the HID++
//! driver's battery `model_name` (`"MX Keys Wireless Keyboard"` / `"Wireless Mouse MX Master
//! 3"`), so that is consulted as a tiebreak — and when it is absent too, the device is
//! reported in **neither** field rather than asserted into the wrong one.

/// What a device was classified as.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DeviceKind {
    /// A key-entry device: `kbd` handler plus the full alphabetic key block.
    Keyboard,
    /// A pointing device: exposes a `mouseN` handler.
    Mouse,
}

/// One record from `/proc/bus/input/devices`.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct InputDevice {
    /// Device name from the `N: Name="…"` line.
    pub name: String,
    /// Handler tokens from the `H: Handlers=…` line (e.g. `kbd`, `mouse0`, `event3`).
    pub handlers: Vec<String>,
    /// Sysfs path from the `S: Sysfs=…` line, relative to `/sys`.
    pub sysfs: String,
    /// `B: KEY=…` bitmap, **low word first** (see [`parse_bitmap`]).
    pub key_bits: Vec<u64>,
}

/// Linux key codes for the alphabetic block, from `include/uapi/linux/input-event-codes.h`.
///
/// A device claiming all of these is offering real text entry rather than the handful of
/// consumer-control or power-button keys that also register a `kbd` handler.
const ALPHA_KEYS: &[u32] = &[
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, // Q W E R T Y U I O P
    30, 31, 32, 33, 34, 35, 36, 37, 38, // A S D F G H J K L
    44, 45, 46, 47, 48, 49, 50, // Z X C V B N M
];

/// Parses a `B: …=` capability bitmap into 64-bit words, **least-significant word first**.
///
/// The kernel prints these words most-significant first (the last word covers bits 0–63), so
/// the order is reversed here. Getting this backwards silently inverts every capability test,
/// which is why it is a separate, directly-tested function.
pub fn parse_bitmap(value: &str) -> Vec<u64> {
    let mut words: Vec<u64> = value
        .split_whitespace()
        .filter_map(|w| u64::from_str_radix(w, 16).ok())
        .collect();
    words.reverse();
    words
}

/// Returns whether `bit` is set in a low-word-first bitmap.
fn bit_set(bits: &[u64], bit: u32) -> bool {
    let word = (bit / 64) as usize;
    let offset = bit % 64;
    bits.get(word).is_some_and(|w| (w >> offset) & 1 == 1)
}

/// Returns whether a key bitmap covers the whole alphabetic block ([`ALPHA_KEYS`]).
pub fn has_alpha_block(key_bits: &[u64]) -> bool {
    ALPHA_KEYS.iter().all(|&k| bit_set(key_bits, k))
}

/// Parses the whole of `/proc/bus/input/devices` into records.
///
/// Records are separated by blank lines; unrecognised lines are ignored, and a record with no
/// name is dropped (it cannot be displayed anyway). Pure, so it is tested against a fixture
/// rather than the host's real hardware.
pub fn parse_input_devices(content: &str) -> Vec<InputDevice> {
    let mut out = Vec::new();
    let mut cur = InputDevice::default();

    let flush = |cur: &mut InputDevice, out: &mut Vec<InputDevice>| {
        if !cur.name.is_empty() {
            out.push(std::mem::take(cur));
        } else {
            *cur = InputDevice::default();
        }
    };

    for line in content.lines() {
        let line = line.trim_end();
        if line.is_empty() {
            flush(&mut cur, &mut out);
            continue;
        }
        if let Some(rest) = line.strip_prefix("N: Name=") {
            cur.name = rest.trim().trim_matches('"').to_string();
        } else if let Some(rest) = line.strip_prefix("H: Handlers=") {
            cur.handlers = rest.split_whitespace().map(|s| s.to_string()).collect();
        } else if let Some(rest) = line.strip_prefix("S: Sysfs=") {
            cur.sysfs = rest.trim().to_string();
        } else if let Some(rest) = line.strip_prefix("B: KEY=") {
            cur.key_bits = parse_bitmap(rest);
        }
    }
    flush(&mut cur, &mut out);
    out
}

/// Classifies one device, consulting `model_name` only when the capabilities are ambiguous.
///
/// `model_name` receives the device's sysfs path and returns the HID++ battery model string
/// when one exists. It is injected rather than read directly so this stays a pure function —
/// the same parameterised-resolver pattern `display::parse_xrandr_displays_with` uses, and for
/// the same reason: a test must not depend on what is plugged into the machine running it.
///
/// Returns `None` for a device that is neither (a power button, a consumer-control endpoint)
/// **and** for one that claims both capabilities with no model string to break the tie.
pub fn classify_device<F>(dev: &InputDevice, model_name: F) -> Option<DeviceKind>
where
    F: Fn(&str) -> Option<String>,
{
    let has_kbd = dev.handlers.iter().any(|h| h == "kbd") && has_alpha_block(&dev.key_bits);
    let has_ptr = dev.handlers.iter().any(|h| h.starts_with("mouse"));

    match (has_kbd, has_ptr) {
        (true, false) => Some(DeviceKind::Keyboard),
        (false, true) => Some(DeviceKind::Mouse),
        (false, false) => None,
        // Ambiguous: a merged HID++ endpoint. Physical devices are not both, so trust the
        // manufacturer's own description when the driver exposes one, and omit otherwise.
        (true, true) => {
            let model = model_name(&dev.sysfs)?.to_lowercase();
            if model.contains("keyboard") {
                Some(DeviceKind::Keyboard)
            } else if model.contains("mouse") || model.contains("trackball") {
                Some(DeviceKind::Mouse)
            } else {
                None
            }
        }
    }
}

/// Classifies a whole device list into `(keyboards, mice)`, de-duplicated by name.
///
/// De-duplication matters on real hardware: one physical peripheral routinely registers
/// several evdev nodes under the same name (a receiver exposing separate endpoints), and
/// listing it repeatedly is noise rather than information.
pub fn classify_input_devices_with<F>(
    devices: &[InputDevice],
    model_name: F,
) -> (Vec<String>, Vec<String>)
where
    F: Fn(&str) -> Option<String>,
{
    let mut keyboards: Vec<String> = Vec::new();
    let mut mice: Vec<String> = Vec::new();

    for dev in devices {
        let target = match classify_device(dev, &model_name) {
            Some(DeviceKind::Keyboard) => &mut keyboards,
            Some(DeviceKind::Mouse) => &mut mice,
            None => continue,
        };
        if !target.contains(&dev.name) {
            target.push(dev.name.clone());
        }
    }
    (keyboards, mice)
}

/// Reads a device's HID++ battery `model_name`, if the driver exposes one.
///
/// `sysfs` is the `S: Sysfs=` value, e.g. `/devices/…/0003:046D:408A.000F/input/input53`; the
/// owning HID device is two levels up, and `hid-logitech-hidpp` hangs a `power_supply` node
/// there whose `model_name` carries the manufacturer's description of the device.
#[cfg(target_os = "linux")]
fn hidpp_model_name(sysfs: &str) -> Option<String> {
    use std::path::Path;
    let hid_dir = Path::new("/sys")
        .join(sysfs.trim_start_matches('/'))
        .parent()?
        .parent()?
        .to_path_buf();
    for entry in std::fs::read_dir(hid_dir.join("power_supply"))
        .ok()?
        .flatten()
    {
        if let Ok(model) = std::fs::read_to_string(entry.path().join("model_name")) {
            let model = model.trim();
            if !model.is_empty() {
                return Some(model.to_string());
            }
        }
    }
    None
}

/// HID usage page 1, "Generic Desktop" — the page that carries keyboards and pointers.
///
/// Vendor-defined pages (`0xFF00` and up) dominate a real Mac's HID list: of the 27
/// interfaces on the development machine, 20 sat on vendor pages carrying backlight,
/// sensor and management endpoints. Filtering to page 1 is what separates input devices
/// from everything else the HID stack exposes.
pub const HID_PAGE_GENERIC_DESKTOP: i64 = 1;
/// HID usage 6 on page 1 — Keyboard.
pub const HID_USAGE_KEYBOARD: i64 = 6;
/// HID usage 2 on page 1 — Mouse.
pub const HID_USAGE_MOUSE: i64 = 2;

/// Classifies macOS HID interfaces into `(keyboards, mice)`, de-duplicated by name.
///
/// **This is deliberately simpler than the Linux classifier, because macOS gives better
/// data.** The v0.7.0 Linux finding still holds — on a Logitech unifying receiver no
/// kernel-visible capability separates a keyboard from a mouse, and fastfetch gets it
/// wrong in both directions there — but macOS does not present the problem in that form:
/// it publishes **one `IOHIDDevice` per HID interface**, each with its own `PrimaryUsage`,
/// so the role is stated rather than inferred. There is no ambiguous case to resolve and
/// so no need for the HID++ `model_name` tiebreak or the "report neither" fallback.
///
/// A composite device therefore appears in **both** lists, and that is correct rather than
/// a bug: `Apple Internal Keyboard / Trackpad` genuinely is a keyboard and a pointing
/// device, and it publishes an interface for each. Verified against fastfetch on the same
/// machine, which lists exactly the same two names under both fields.
///
/// Pure and injectable for the usual reason — the test feeds it a verbatim fixture from a
/// real machine rather than consulting whatever is plugged into the one running it.
pub fn classify_hid_interfaces(interfaces: &[(String, i64, i64)]) -> (Vec<String>, Vec<String>) {
    let mut keyboards: Vec<String> = Vec::new();
    let mut mice: Vec<String> = Vec::new();

    for (name, page, usage) in interfaces {
        if *page != HID_PAGE_GENERIC_DESKTOP {
            continue;
        }
        let name = name.trim();
        if name.is_empty() {
            continue;
        }
        let target = match *usage {
            HID_USAGE_KEYBOARD => &mut keyboards,
            HID_USAGE_MOUSE => &mut mice,
            _ => continue,
        };
        // One physical peripheral can publish several interfaces with the same role and
        // the same product string; listing it repeatedly is noise, matching the Linux
        // arm's de-duplication.
        if !target.iter().any(|n| n == name) {
            target.push(name.to_string());
        }
    }
    (keyboards, mice)
}

/// Detects connected keyboards and pointing devices as `(keyboards, mice)`.
///
/// Linux reads `/proc/bus/input/devices` plus, only for ambiguous devices, a small sysfs
/// lookup. macOS enumerates IOKit `IOHIDDevice` interfaces and reads their primary usage.
/// Returns two empty vectors elsewhere, so both fields simply do not render. No subprocess
/// and no elevation on either platform.
pub fn detect_input_devices() -> (Vec<String>, Vec<String>) {
    #[cfg(target_os = "linux")]
    {
        let Ok(content) = std::fs::read_to_string("/proc/bus/input/devices") else {
            return (Vec::new(), Vec::new());
        };
        let devices = parse_input_devices(&content);
        classify_input_devices_with(&devices, hidpp_model_name)
    }
    #[cfg(target_os = "macos")]
    {
        classify_hid_interfaces(&crate::macos_ffi::get_hid_interfaces())
    }
    #[cfg(not(any(target_os = "linux", target_os = "macos")))]
    {
        (Vec::new(), Vec::new())
    }
}

#[cfg(test)]
mod macos_tests {
    use super::*;

    /// Verbatim `(Product, PrimaryUsagePage, PrimaryUsage)` triples read from an M3 Pro
    /// MacBook Pro, trimmed to the interfaces that matter plus a representative sample of
    /// the vendor-page noise. The real machine reported 27 interfaces, 20 of them on
    /// vendor-defined pages.
    ///
    /// A fixture rather than a live enumeration for the #155/v0.6.2 reason: a test must not
    /// depend on what is plugged into the machine running it.
    fn fixture() -> Vec<(String, i64, i64)> {
        [
            // Vendor-defined pages (0xFF00 = 65280, 0xFF0C = 65292) — must all be ignored.
            ("Apple Internal Keyboard / Trackpad", 65280, 3),
            ("Apple Internal Keyboard / Trackpad", 65280, 13),
            ("Keyboard Backlight", 65280, 15),
            ("BTM", 65280, 72),
            ("ktobias's Magic Keyboard", 65280, 75),
            ("USB Receiver", 65280, 1),
            // Consumer page (12) — a headset and a webcam, neither an input device here.
            ("Headset", 12, 1),
            ("Logitech BRIO", 12, 1),
            // Generic Desktop (1): the ones that count.
            ("Apple Internal Keyboard / Trackpad", 1, 6), // keyboard interface
            ("Apple Internal Keyboard / Trackpad", 1, 2), // trackpad interface
            ("ktobias's Magic Keyboard", 1, 6),
            ("USB Receiver", 1, 2),
            ("USB Receiver", 1, 6),
        ]
        .into_iter()
        .map(|(n, p, u)| (n.to_string(), p, u))
        .collect()
    }

    #[test]
    fn test_classify_hid_interfaces_matches_the_real_machine() {
        let (keyboards, mice) = classify_hid_interfaces(&fixture());
        assert_eq!(
            keyboards,
            vec![
                "Apple Internal Keyboard / Trackpad",
                "ktobias's Magic Keyboard",
                "USB Receiver",
            ]
        );
        assert_eq!(
            mice,
            vec!["Apple Internal Keyboard / Trackpad", "USB Receiver"]
        );
    }

    /// A composite device belongs in **both** lists, and this pins that as intended.
    ///
    /// The Linux arm deliberately reports such a device in *neither* list, because there a
    /// merged receiver endpoint is genuinely ambiguous (v0.7.0). macOS is not the same
    /// case: it publishes one interface per role, so `Apple Internal Keyboard / Trackpad`
    /// appearing under both is the kernel stating a fact, not a guess.
    #[test]
    fn test_composite_device_is_listed_under_both_roles() {
        let (keyboards, mice) = classify_hid_interfaces(&fixture());
        let composite = "Apple Internal Keyboard / Trackpad";
        assert!(keyboards.iter().any(|n| n == composite));
        assert!(mice.iter().any(|n| n == composite));
    }

    /// Vendor pages carry backlight, sensor and management endpoints that share their
    /// product name with a real input device, and none of them may be reported.
    ///
    /// **This assertion alone does NOT prove the page filter is load-bearing**, and that is
    /// worth stating because the first version of this test was exactly that and could not
    /// fail: every vendor-page entry in the fixture happens to carry a usage the *usage*
    /// filter already rejects, so deleting the page check left the result unchanged. The
    /// synthetic test below is what actually pins it.
    #[test]
    fn test_vendor_page_devices_are_not_reported() {
        let (keyboards, mice) = classify_hid_interfaces(&fixture());
        for list in [&keyboards, &mice] {
            assert!(!list.iter().any(|n| n == "Keyboard Backlight"));
            assert!(!list.iter().any(|n| n == "BTM"));
            assert!(!list.iter().any(|n| n == "Headset"));
            assert!(!list.iter().any(|n| n == "Logitech BRIO"));
        }
    }

    /// Pins the page filter with a case only it can reject.
    ///
    /// **Synthetic, and labelled as such** — no interface on the development machine
    /// paired a vendor page with usage 2 or 6. It is nonetheless the case that matters:
    /// HID usage numbers are **page-relative**, so usage 6 on a vendor-defined page means
    /// whatever that vendor decided, not "keyboard". Without the page check such an
    /// interface is reported as input hardware.
    ///
    /// **Watched failing**: removing the page filter makes this report
    /// `["Vendor Widget"]` for both fields.
    #[test]
    fn test_page_filter_rejects_a_vendor_usage_that_collides_with_keyboard() {
        let interfaces = vec![
            ("Vendor Widget".to_string(), 65280, HID_USAGE_KEYBOARD),
            ("Vendor Widget".to_string(), 65280, HID_USAGE_MOUSE),
            (
                "Real Keyboard".to_string(),
                HID_PAGE_GENERIC_DESKTOP,
                HID_USAGE_KEYBOARD,
            ),
        ];
        let (keyboards, mice) = classify_hid_interfaces(&interfaces);
        assert_eq!(keyboards, vec!["Real Keyboard"]);
        assert!(mice.is_empty());
    }

    #[test]
    fn test_names_are_deduplicated_and_blanks_dropped() {
        let interfaces = vec![
            ("Dup".to_string(), 1, 6),
            ("Dup".to_string(), 1, 6),
            ("  ".to_string(), 1, 6),
            ("Trimmed  ".to_string(), 1, 2),
            ("Trimmed".to_string(), 1, 2),
        ];
        let (keyboards, mice) = classify_hid_interfaces(&interfaces);
        assert_eq!(keyboards, vec!["Dup"]);
        assert_eq!(mice, vec!["Trimmed"]);
    }

    /// Usages other than Keyboard(6)/Mouse(2) on page 1 — Pointer(1), Joystick(4),
    /// Gamepad(5), Keypad(7) — are not reported by either field. Gamepads have their own
    /// field, and reporting a joystick as a mouse would be wrong.
    #[test]
    fn test_other_generic_desktop_usages_are_not_input_devices() {
        let interfaces = vec![
            ("Joystick".to_string(), 1, 4),
            ("Gamepad".to_string(), 1, 5),
            ("Pointer".to_string(), 1, 1),
            ("Keypad".to_string(), 1, 7),
        ];
        let (keyboards, mice) = classify_hid_interfaces(&interfaces);
        assert!(keyboards.is_empty());
        assert!(mice.is_empty());
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Verbatim excerpt of `/proc/bus/input/devices` from a Fedora 44 laptop with a Bolt
    /// receiver, trimmed to the interesting records. Covers every classification branch:
    /// a plain keyboard, a plain mouse, a touchpad, a `kbd`-handler non-keyboard, and two
    /// merged HID++ endpoints that are indistinguishable by capability alone.
    const FIXTURE: &str = r#"I: Bus=0019 Vendor=0000 Product=0001 Version=0000
N: Name="Power Button"
P: Phys=PNP0C0C/button/input0
S: Sysfs=/devices/platform/PNP0C0C:00/input/input1
U: Uniq=
H: Handlers=kbd event1
B: PROP=0
B: EV=3
B: KEY=8000 10000000000000 0

I: Bus=0011 Vendor=0001 Product=0001 Version=ab83
N: Name="AT Translated Set 2 keyboard"
P: Phys=isa0060/serio0/input0
S: Sysfs=/devices/platform/i8042/serio0/input/input3
U: Uniq=
H: Handlers=sysrq kbd leds event3
B: PROP=0
B: EV=120013
B: KEY=2000000000000000 0 40000 0 0 0 0 11100f02902007 f780307cfb10f001 feffffdfffcfffff fffffffffffffffe

I: Bus=0011 Vendor=0002 Product=0001 Version=0000
N: Name="PS/2 Generic Mouse"
P: Phys=isa0060/serio1/input0
S: Sysfs=/devices/platform/i8042/serio1/input/input5
U: Uniq=
H: Handlers=mouse0 event4
B: PROP=0
B: EV=7
B: KEY=70000 0 0 0 0

I: Bus=0018 Vendor=06cb Product=cf06 Version=0100
N: Name="VEN_06CB:00 06CB:CF06 Touchpad"
P: Phys=i2c-VEN_06CB:00
S: Sysfs=/devices/pci0000:00/0000:00:15.0/i2c_designware.0/i2c-1/i2c-VEN_06CB:00/0018:06CB:CF06.0001/input/input8
U: Uniq=
H: Handlers=mouse2 event6
B: PROP=5
B: EV=1b
B: KEY=e520 10000 0 0 0 0

I: Bus=0003 Vendor=046d Product=408a Version=0111
N: Name="Logitech MX Keys"
P: Phys=usb-0000:00:14.0-2/input2:1
S: Sysfs=/devices/pci0000:00/0000:00:14.0/usb3/3-2/3-2.4/0003:046D:C52B.000D/0003:046D:408A.000F/input/input53
U: Uniq=
H: Handlers=sysrq kbd leds mouse6 event26
B: PROP=0
B: EV=12001f
B: KEY=3f00733fff 0 0 483ffff17aff32d bfd4444600000000 ffff0001 130ff38b17d007 ffff7bfad941dfff ffbeffdfffefffff fffffffffffffffe

I: Bus=0003 Vendor=046d Product=4082 Version=0111
N: Name="Logitech MX Master 3"
P: Phys=usb-0000:00:14.0-2/input2:2
S: Sysfs=/devices/pci0000:00/0000:00:14.0/usb3/3-2/3-2.4/0003:046D:C52B.000D/0003:046D:4082.0011/input/input51
U: Uniq=
H: Handlers=sysrq kbd leds mouse5 event25
B: PROP=0
B: EV=12001f
B: KEY=3f00733fff 0 0 483ffff17aff32d bfd4444600000000 ffff0001 130ff38b17d007 ffff7bfad9415fff ffbeffdfffefffff fffffffffffffffe
"#;

    /// Resolver standing in for the real HID++ lookup, keyed on the fixture's sysfs paths.
    fn fixture_model_name(sysfs: &str) -> Option<String> {
        if sysfs.contains("408A") {
            Some("MX Keys Wireless Keyboard".to_string())
        } else if sysfs.contains("4082") {
            Some("Wireless Mouse MX Master 3".to_string())
        } else {
            None
        }
    }

    #[test]
    fn test_parse_bitmap_is_low_word_first() {
        // The kernel prints the highest word first, so the LAST printed word holds bits 0-63.
        assert_eq!(parse_bitmap("2 1"), vec![1, 2]);
        assert_eq!(parse_bitmap("ff"), vec![0xff]);
        assert_eq!(parse_bitmap(""), Vec::<u64>::new());
        // Junk words are skipped rather than panicking.
        assert_eq!(parse_bitmap("zz 3"), vec![3]);
    }

    #[test]
    fn test_bit_set_across_word_boundary() {
        let bits = parse_bitmap("1 8000000000000000");
        assert!(bit_set(&bits, 63), "bit 63 is the top of the low word");
        assert!(bit_set(&bits, 64), "bit 64 is the bottom of the high word");
        assert!(!bit_set(&bits, 62));
        assert!(!bit_set(&bits, 65));
        // Out-of-range reads are false, never a panic.
        assert!(!bit_set(&bits, 4096));
    }

    #[test]
    fn test_has_alpha_block() {
        let devices = parse_input_devices(FIXTURE);
        let by_name = |n: &str| devices.iter().find(|d| d.name == n).unwrap().clone();
        assert!(has_alpha_block(
            &by_name("AT Translated Set 2 keyboard").key_bits
        ));
        assert!(
            !has_alpha_block(&by_name("Power Button").key_bits),
            "a power button registers `kbd` but offers no text entry"
        );
        assert!(!has_alpha_block(&by_name("PS/2 Generic Mouse").key_bits));
    }

    #[test]
    fn test_parse_input_devices_fields() {
        let devices = parse_input_devices(FIXTURE);
        assert_eq!(
            devices.len(),
            6,
            "one record per blank-line-separated block"
        );
        let kb = devices
            .iter()
            .find(|d| d.name == "AT Translated Set 2 keyboard")
            .unwrap();
        assert_eq!(kb.handlers, vec!["sysrq", "kbd", "leds", "event3"]);
        assert_eq!(kb.sysfs, "/devices/platform/i8042/serio0/input/input3");
        assert_eq!(*kb.key_bits.first().unwrap(), 0xfffffffffffffffe);
    }

    #[test]
    fn test_classify_unambiguous_devices() {
        let devices = parse_input_devices(FIXTURE);
        let find = |n: &str| devices.iter().find(|d| d.name == n).unwrap();

        assert_eq!(
            classify_device(find("AT Translated Set 2 keyboard"), fixture_model_name),
            Some(DeviceKind::Keyboard)
        );
        assert_eq!(
            classify_device(find("PS/2 Generic Mouse"), fixture_model_name),
            Some(DeviceKind::Mouse)
        );
        assert_eq!(
            classify_device(find("VEN_06CB:00 06CB:CF06 Touchpad"), fixture_model_name),
            Some(DeviceKind::Mouse),
            "a touchpad is a pointing device"
        );
        assert_eq!(
            classify_device(find("Power Button"), fixture_model_name),
            None,
            "`kbd` handler without the alphabet block is neither"
        );
    }

    #[test]
    fn test_merged_hidpp_endpoints_use_the_model_name_tiebreak() {
        let devices = parse_input_devices(FIXTURE);
        let find = |n: &str| devices.iter().find(|d| d.name == n).unwrap();

        // These two records are identical in every capability field; only the model name
        // separates them. This is the case fastfetch gets wrong in both directions.
        let keys = find("Logitech MX Keys");
        let master = find("Logitech MX Master 3");
        assert_eq!(keys.key_bits.len(), master.key_bits.len());
        assert!(has_alpha_block(&keys.key_bits) && has_alpha_block(&master.key_bits));

        assert_eq!(
            classify_device(keys, fixture_model_name),
            Some(DeviceKind::Keyboard)
        );
        assert_eq!(
            classify_device(master, fixture_model_name),
            Some(DeviceKind::Mouse)
        );
    }

    #[test]
    fn test_ambiguous_device_without_model_name_is_omitted() {
        let devices = parse_input_devices(FIXTURE);
        let keys = devices
            .iter()
            .find(|d| d.name == "Logitech MX Keys")
            .unwrap();
        // A paired-but-idle device exposes no battery node, so no model name resolves. It must
        // be reported in neither field rather than guessed into one.
        assert_eq!(classify_device(keys, |_| None), None);
    }

    #[test]
    fn test_classify_input_devices_with_end_to_end() {
        let devices = parse_input_devices(FIXTURE);
        let (keyboards, mice) = classify_input_devices_with(&devices, fixture_model_name);
        assert_eq!(
            keyboards,
            vec!["AT Translated Set 2 keyboard", "Logitech MX Keys"]
        );
        assert_eq!(
            mice,
            vec![
                "PS/2 Generic Mouse",
                "VEN_06CB:00 06CB:CF06 Touchpad",
                "Logitech MX Master 3"
            ]
        );
    }

    #[test]
    fn test_duplicate_names_are_collapsed() {
        // One physical peripheral commonly registers several endpoints under one name.
        let doubled = format!("{}\n{}", FIXTURE, FIXTURE);
        let devices = parse_input_devices(&doubled);
        let (keyboards, mice) = classify_input_devices_with(&devices, fixture_model_name);
        assert_eq!(keyboards.len(), 2, "names must not repeat");
        assert_eq!(mice.len(), 3);
    }

    #[test]
    fn test_empty_and_malformed_input() {
        assert!(parse_input_devices("").is_empty());
        assert!(parse_input_devices("garbage\nlines\nwith no records").is_empty());
        // A record with handlers but no name is unusable and is dropped.
        assert!(parse_input_devices("H: Handlers=kbd event0\nB: EV=3\n").is_empty());
        let (k, m) = classify_input_devices_with(&[], fixture_model_name);
        assert!(k.is_empty() && m.is_empty());
    }
}

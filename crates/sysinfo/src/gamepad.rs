// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Gamepad and joystick controller detection.

#[cfg(target_os = "macos")]
pub fn parse_macos_gamepad(usb_stdout: &str, bt_stdout: &str) -> Vec<String> {
    let mut gamepads = Vec::new();
    let keywords = [
        "controller",
        "gamepad",
        "joystick",
        "xbox",
        "playstation",
        "dualshock",
        "dualsense",
        "nintendo",
        "joy-con",
        "joycon",
    ];

    let is_gamepad = |name: &str| -> bool {
        let name_lower = name.to_lowercase();
        keywords.iter().any(|&kw| name_lower.contains(kw))
    };

    // Parse USB
    for line in usb_stdout.lines() {
        let trimmed = line.trim();
        let indent = line.len() - line.trim_start().len();
        if (indent == 4 || indent == 6 || indent == 8) && trimmed.ends_with(':') {
            let name = trimmed.trim_end_matches(':').trim().to_string();
            if is_gamepad(&name) && !gamepads.contains(&name) {
                gamepads.push(name);
            }
        }
    }

    // Parse Bluetooth
    let mut current_device = None;
    for line in bt_stdout.lines() {
        let trimmed = line.trim();
        let indent = line.len() - line.trim_start().len();
        if indent >= 8 && trimmed.ends_with(':') {
            current_device = Some(trimmed.trim_end_matches(':').trim().to_string());
        } else if trimmed.starts_with("Connected: Yes") || trimmed.starts_with("Connection: Yes") {
            if let Some(ref dev) = current_device {
                if is_gamepad(dev) && !gamepads.contains(dev) {
                    gamepads.push(dev.clone());
                }
            }
        }
    }

    gamepads
}

pub(crate) fn detect_gamepad() -> Vec<String> {
    #[cfg(target_os = "linux")]
    {
        let mut gamepads = Vec::new();
        if let Ok(entries) = std::fs::read_dir("/sys/class/input") {
            for entry in entries.filter_map(|e| e.ok()) {
                let name = entry.file_name().to_string_lossy().to_string();
                if name.starts_with("js") {
                    let path = entry.path().join("device/name");
                    if path.exists() {
                        if let Ok(dev_name) = std::fs::read_to_string(path) {
                            let trimmed = dev_name.trim().to_string();
                            if !trimmed.is_empty() && !gamepads.contains(&trimmed) {
                                gamepads.push(trimmed);
                            }
                        }
                    }
                }
            }
        }
        gamepads
    }

    #[cfg(target_os = "macos")]
    {
        crate::macos_ffi::get_hid_gamepads()
    }

    // Native SetupAPI rather than the `Get-PnpDevice` pipeline this replaced: that spawn
    // cost ~2.5 s and was the whole of `--full`'s deficit against fastfetch. One
    // all-classes enumeration reads the same three properties the pipeline filtered on.
    #[cfg(target_os = "windows")]
    {
        use crate::win_setupapi::{present_devices_all_classes, GUID_DEVCLASS_HIDCLASS};

        let mut gamepads: Vec<String> = Vec::new();
        for device in present_devices_all_classes() {
            let Some(name) = device.name.as_deref() else {
                continue;
            };
            let is_hid = device.in_class(&GUID_DEVCLASS_HIDCLASS);
            if is_windows_gamepad(is_hid, &device.hardware_ids, name)
                && !gamepads.iter().any(|g| g == name)
            {
                gamepads.push(name.to_string());
            }
        }
        gamepads
    }

    #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
    {
        Vec::new()
    }
}

/// Whether a present Windows device node is a game controller.
///
/// This is the predicate of the `Get-PnpDevice` pipeline the Windows arm replaced, kept
/// exactly so the field's output does not change:
///
/// - a **HIDClass** node whose hardware IDs include `HID_DEVICE_SYSTEM_GAME` (a Generic
///   Desktop joystick or gamepad collection) or `HID_DEVICE_GAME`; or
/// - a node in **any** class whose name contains `Xbox Controller`, `Gamepad` or
///   `Joystick`.
///
/// Both matches are case-insensitive substring tests, as PowerShell's `-match` is. The
/// hardware-ID test deliberately does not widen to the neighbouring HID special IDs: a
/// laptop's `HID_DEVICE_SYSTEM_CONTROL` collection (power and sleep buttons) and a
/// `UP:0001_U:000E` multi-axis collection are both HIDClass nodes named "…controller",
/// and neither is a gamepad.
#[cfg(any(target_os = "windows", test))]
pub(crate) fn is_windows_gamepad(is_hid_class: bool, hardware_ids: &[String], name: &str) -> bool {
    let has_game_id = hardware_ids.iter().any(|id| {
        let id = id.to_ascii_uppercase();
        id.contains("HID_DEVICE_SYSTEM_GAME") || id.contains("HID_DEVICE_GAME")
    });
    let name = name.to_lowercase();
    let named = ["xbox controller", "gamepad", "joystick"]
        .iter()
        .any(|kw| name.contains(kw));
    (is_hid_class && has_game_id) || named
}

#[cfg(test)]
mod windows_predicate_tests {
    use super::is_windows_gamepad;

    fn ids(list: &[&str]) -> Vec<String> {
        list.iter().map(|s| s.to_string()).collect()
    }

    #[test]
    fn rejects_the_hid_controllers_that_are_not_gamepads() {
        // Verbatim from arrakis (ASUS ProArt PX13, Windows 11): both are HIDClass nodes
        // with "controller" in the name, and the machine has no gamepad attached.
        let multi_axis = ids(&[
            r"HID\VEN_ASUS&DEV_2020&Col01",
            r"HID\ASUS2020&Col01",
            r"HID\*ASUS2020&Col01",
            r"HID\VID_0B05&UP:0001_U:000E",
            "HID_DEVICE_UP:0001_U:000E",
            "HID_DEVICE",
        ]);
        let system_control = ids(&[
            r"HID\ConvertedDevice&Col03",
            r"HID\VID_045E&UP:0001_U:0080",
            "HID_DEVICE_SYSTEM_CONTROL",
            "HID_DEVICE_UP:0001_U:0080",
            "HID_DEVICE",
        ]);
        assert!(!is_windows_gamepad(
            true,
            &multi_axis,
            "HID-compliant system multi-axis controller"
        ));
        assert!(!is_windows_gamepad(
            true,
            &system_control,
            "HID-compliant system controller"
        ));
    }

    #[test]
    fn accepts_a_hid_game_collection() {
        // Synthetic, following the documented HID hardware-ID shape for a Generic Desktop
        // gamepad (usage page 1, usage 5): no gamepad was attached to the machine the other
        // fixtures came from.
        let gamepad = ids(&[
            r"HID\VID_054C&PID_0CE6&MI_03",
            r"HID\VID_054C&UP:0001_U:0005",
            "HID_DEVICE_SYSTEM_GAME",
            "HID_DEVICE_UP:0001_U:0005",
            "HID_DEVICE",
        ]);
        assert!(is_windows_gamepad(
            true,
            &gamepad,
            "HID-compliant game controller"
        ));
        // Matching is case-insensitive, as PowerShell's `-match` was.
        assert!(is_windows_gamepad(
            true,
            &ids(&["hid_device_system_game"]),
            "HID-compliant game controller"
        ));
    }

    #[test]
    fn the_hardware_id_match_requires_hidclass() {
        // The replaced query scoped the hardware-ID test to HIDClass; a node in another
        // class carrying the ID is not reported unless its name says so.
        assert!(!is_windows_gamepad(
            false,
            &ids(&["HID_DEVICE_SYSTEM_GAME"]),
            "Some Composite Device"
        ));
    }

    #[test]
    fn names_match_in_any_class_case_insensitively() {
        assert!(is_windows_gamepad(false, &[], "Xbox Controller"));
        assert!(is_windows_gamepad(false, &[], "Generic USB GAMEPAD"));
        assert!(is_windows_gamepad(false, &[], "Thrustmaster Joystick"));
        assert!(!is_windows_gamepad(false, &[], "USB Input Device"));
    }
}

#[cfg(all(test, target_os = "macos"))]
mod tests {
    use super::*;

    #[test]
    fn test_parse_macos_gamepad() {
        let usb_sample = "USB 3.1 Bus:\n\n    Xbox Wireless Controller:\n\n      Product ID: 0x02e0\n      Vendor ID: 0x045e\n";
        let bt_sample = "Bluetooth:\n\n      Devices (Connected):\n          DualSense Wireless Controller:\n              Address: AA-BB-CC\n              Connected: Yes\n";
        let parsed = parse_macos_gamepad(usb_sample, bt_sample);
        assert_eq!(
            parsed,
            vec![
                "Xbox Wireless Controller".to_string(),
                "DualSense Wireless Controller".to_string()
            ]
        );
    }
}

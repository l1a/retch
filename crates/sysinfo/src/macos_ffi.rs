// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! macOS framework FFI helpers shared across detection modules.
//!
//! Wraps CoreFoundation, IOKit, CoreAudio, and CoreGraphics C APIs into safe
//! Rust functions. Mirrors the `win_reg` pattern: raw `extern "C"` blocks at
//! module level, followed by safe public wrappers.
//!
//! Memory rules:
//! - CF objects from "Create" / "Copy" functions are owned; drop via `CFRelease`.
//! - CF objects from "Get" functions are borrowed; do NOT release.
//! - IOKit service/iterator ports must be released with `IOObjectRelease`.
//! - `IOServiceGetMatchingServices` consumes the matching dict (do not CFRelease).

use std::ffi::{c_void, CString};
use std::ptr;

// ─── CoreFoundation types ────────────────────────────────────────────────────

pub type CFTypeRef = *const c_void;
pub type CFStringRef = *const c_void;
pub type CFMutableDictionaryRef = *mut c_void;
pub type CFDictionaryRef = *const c_void;
pub type CFAllocatorRef = *const c_void;
pub type CFDataRef = *const c_void;
pub type CFBooleanRef = *const c_void;
pub type CFNumberRef = *const c_void;
#[allow(non_upper_case_globals)]
pub const kCFNumberSInt32Type: i32 = 3;
#[allow(non_upper_case_globals)]
pub const kCFStringEncodingUTF8: u32 = 0x08000100;

#[link(name = "CoreFoundation", kind = "framework")]
extern "C" {
    pub static kCFAllocatorDefault: CFAllocatorRef;

    pub fn CFStringCreateWithCString(
        alloc: CFAllocatorRef,
        c_str: *const i8,
        encoding: u32,
    ) -> CFStringRef;
    pub fn CFStringGetCString(
        the_string: CFStringRef,
        buffer: *mut i8,
        buffer_size: isize,
        encoding: u32,
    ) -> bool;
    pub fn CFStringGetLength(the_string: CFStringRef) -> isize;
    pub fn CFDataGetBytePtr(the_data: CFDataRef) -> *const u8;
    pub fn CFDataGetLength(the_data: CFDataRef) -> isize;
    pub fn CFGetTypeID(cf: CFTypeRef) -> usize;
    pub fn CFStringGetTypeID() -> usize;
    pub fn CFDataGetTypeID() -> usize;
    pub fn CFBooleanGetTypeID() -> usize;
    pub fn CFNumberGetTypeID() -> usize;
    pub fn CFDictionaryGetTypeID() -> usize;
    pub fn CFDictionaryGetValue(the_dict: CFDictionaryRef, key: *const c_void) -> *const c_void;
    pub fn CFBooleanGetValue(boolean: CFBooleanRef) -> bool;
    pub fn CFNumberGetValue(number: CFNumberRef, the_type: i32, value_ptr: *mut c_void) -> bool;
    pub fn CFNumberCreate(
        alloc: CFAllocatorRef,
        the_type: i32,
        value_ptr: *const c_void,
    ) -> CFNumberRef;
    pub fn CFDictionarySetValue(the_dict: CFMutableDictionaryRef, key: CFTypeRef, value: CFTypeRef);
    pub fn CFRelease(cf: CFTypeRef);

    pub static kCFPreferencesAnyApplication: CFStringRef;
    pub static kCFPreferencesCurrentUser: CFStringRef;
    pub static kCFPreferencesAnyHost: CFStringRef;
    pub fn CFPreferencesCopyValue(
        key: CFStringRef,
        application_id: CFStringRef,
        user_name: CFStringRef,
        host_name: CFStringRef,
    ) -> CFTypeRef;
}

// ─── CoreFoundation safe helpers ─────────────────────────────────────────────

/// RAII wrapper for a CF object that must be released with `CFRelease`.
pub struct OwnedCF(pub CFTypeRef);
impl Drop for OwnedCF {
    fn drop(&mut self) {
        if !self.0.is_null() {
            unsafe { CFRelease(self.0) };
        }
    }
}

/// Convert a `CFStringRef` to a Rust `String`. Does not release the ref.
pub unsafe fn cf_string_to_rust(s: CFStringRef) -> Option<String> {
    if s.is_null() {
        return None;
    }
    let len = CFStringGetLength(s);
    if len <= 0 {
        return None;
    }
    // Each UTF-8 char can be up to 4 bytes; add room for null terminator.
    let buf_size = (len * 4 + 1) as usize;
    let mut buf = vec![0i8; buf_size];
    let ok = CFStringGetCString(
        s,
        buf.as_mut_ptr(),
        buf_size as isize,
        kCFStringEncodingUTF8,
    );
    if !ok {
        return None;
    }
    let end = buf.iter().position(|&c| c == 0).unwrap_or(buf.len());
    let bytes = unsafe { std::slice::from_raw_parts(buf.as_ptr() as *const u8, end) };
    String::from_utf8(bytes.to_vec()).ok()
}

/// Convert a `CFDataRef` of ASCII bytes to a Rust `String`. Does not release.
pub unsafe fn cf_data_to_string(d: CFDataRef) -> Option<String> {
    if d.is_null() {
        return None;
    }
    let len = CFDataGetLength(d) as usize;
    if len == 0 {
        return None;
    }
    let ptr = CFDataGetBytePtr(d);
    let bytes = unsafe { std::slice::from_raw_parts(ptr, len) };
    // Strip null terminators and non-printable bytes
    let s = String::from_utf8_lossy(bytes);
    let trimmed = s.trim_matches(|c: char| c == '\0' || !c.is_ascii_graphic() && c != ' ');
    if trimmed.is_empty() {
        None
    } else {
        Some(trimmed.to_string())
    }
}

/// Create a temporary CFStringRef from a Rust &str, call `f`, then release it.
unsafe fn with_cfstring<F, R>(s: &str, f: F) -> R
where
    F: FnOnce(CFStringRef) -> R,
{
    let cs = CString::new(s).unwrap_or_default();
    let cf = CFStringCreateWithCString(kCFAllocatorDefault, cs.as_ptr(), kCFStringEncodingUTF8);
    let result = f(cf);
    if !cf.is_null() {
        CFRelease(cf as CFTypeRef);
    }
    result
}

// ─── IOKit types ─────────────────────────────────────────────────────────────

pub type IOService = u32;
pub type IOIterator = u32;
pub const MACH_PORT_NULL: u32 = 0;
// IOKIT_MAIN_PORT == kIOMasterPortDefault == 0 on all macOS versions.
// IOKIT_MAIN_PORT was introduced as an exported symbol in macOS 12; using the
// literal avoids a link error when the SDK deployment target is macOS 11.
const IOKIT_MAIN_PORT: u32 = 0;

#[link(name = "IOKit", kind = "framework")]
extern "C" {
    pub fn IOServiceMatching(name: *const i8) -> CFMutableDictionaryRef;
    pub fn IOServiceGetMatchingService(main_port: u32, matching: CFDictionaryRef) -> IOService;
    pub fn IOServiceGetMatchingServices(
        main_port: u32,
        matching: CFDictionaryRef,
        existing: *mut IOIterator,
    ) -> i32;
    pub fn IOIteratorNext(iter: IOIterator) -> IOService;
    pub fn IOObjectRelease(obj: u32) -> i32;
    pub fn IORegistryEntryCreateCFProperty(
        entry: IOService,
        key: CFStringRef,
        allocator: CFAllocatorRef,
        options: u32,
    ) -> CFTypeRef;
    pub fn IORegistryEntryFromPath(main_port: u32, path: *const i8) -> IOService;
    pub fn IORegistryEntryGetChildIterator(
        entry: IOService,
        plane: *const i8,
        iter: *mut IOIterator,
    ) -> i32;
}

/// Read an IOKit registry property as a Rust String (handles CFString and CFData).
pub unsafe fn iokit_property_as_string(entry: IOService, key: &str) -> Option<String> {
    if entry == MACH_PORT_NULL {
        return None;
    }
    let val = with_cfstring(key, |k| {
        IORegistryEntryCreateCFProperty(entry, k, kCFAllocatorDefault, 0)
    });
    if val.is_null() {
        return None;
    }
    let _owned = OwnedCF(val);
    let type_id = CFGetTypeID(val);
    if type_id == CFStringGetTypeID() {
        cf_string_to_rust(val as CFStringRef)
    } else if type_id == CFDataGetTypeID() {
        cf_data_to_string(val as CFDataRef)
    } else {
        None
    }
}

/// Read an IOKit registry property as a u64 (handles CFData bytes and CFNumber).
pub unsafe fn iokit_property_as_u64(entry: IOService, key: &str) -> Option<u64> {
    if entry == MACH_PORT_NULL {
        return None;
    }
    let val = with_cfstring(key, |k| {
        IORegistryEntryCreateCFProperty(entry, k, kCFAllocatorDefault, 0)
    });
    if val.is_null() {
        return None;
    }
    let _owned = OwnedCF(val);
    let type_id = CFGetTypeID(val);
    if type_id == CFDataGetTypeID() {
        let len = CFDataGetLength(val as CFDataRef) as usize;
        let ptr = CFDataGetBytePtr(val as CFDataRef);
        match len {
            8 => {
                let mut arr = [0u8; 8];
                ptr::copy_nonoverlapping(ptr, arr.as_mut_ptr(), 8);
                Some(u64::from_le_bytes(arr))
            }
            4 => {
                let mut arr = [0u8; 4];
                ptr::copy_nonoverlapping(ptr, arr.as_mut_ptr(), 4);
                Some(u32::from_le_bytes(arr) as u64)
            }
            _ => None,
        }
    } else if type_id == CFNumberGetTypeID() {
        let mut v: i64 = 0;
        CFNumberGetValue(
            val as CFNumberRef,
            4, /* kCFNumberSInt64Type */
            &mut v as *mut i64 as *mut c_void,
        );
        if v > 0 {
            Some(v as u64)
        } else {
            None
        }
    } else {
        None
    }
}

/// Read an IOKit registry property as bool (handles CFBoolean).
pub unsafe fn iokit_property_as_bool(entry: IOService, key: &str) -> Option<bool> {
    if entry == MACH_PORT_NULL {
        return None;
    }
    let val = with_cfstring(key, |k| {
        IORegistryEntryCreateCFProperty(entry, k, kCFAllocatorDefault, 0)
    });
    if val.is_null() {
        return None;
    }
    let _owned = OwnedCF(val);
    if CFGetTypeID(val) == CFBooleanGetTypeID() {
        Some(CFBooleanGetValue(val as CFBooleanRef))
    } else {
        None
    }
}

// ─── BIOS — IODeviceTree:/rom ─────────────────────────────────────────────────

/// Read the system firmware version from IODeviceTree:/rom.
pub fn get_firmware_version() -> Option<String> {
    unsafe {
        let path = b"IODeviceTree:/rom\0";
        let entry = IORegistryEntryFromPath(IOKIT_MAIN_PORT, path.as_ptr() as *const i8);
        if entry == MACH_PORT_NULL {
            return None;
        }
        let result = iokit_property_as_string(entry, "version");
        IOObjectRelease(entry);
        result
    }
}

// ─── GPU — IOPCIDevice + AGXAccelerator ──────────────────────────────────────

/// Enumerate GPUs. Returns `(name, vram_bytes)` pairs.
/// Covers discrete/Intel GPUs (IOPCIDevice, PCI class 0x03) and Apple Silicon (AGXAccelerator).
pub fn get_gpus() -> Vec<(String, Option<u64>)> {
    let mut gpus = Vec::new();
    unsafe {
        // Apple Silicon: AGXAccelerator services
        let agx_name = CString::new("AGXAccelerator").unwrap();
        let matching = IOServiceMatching(agx_name.as_ptr());
        if !matching.is_null() {
            let mut iter: IOIterator = MACH_PORT_NULL;
            if IOServiceGetMatchingServices(IOKIT_MAIN_PORT, matching as CFDictionaryRef, &mut iter)
                == 0
            {
                loop {
                    let service = IOIteratorNext(iter);
                    if service == MACH_PORT_NULL {
                        break;
                    }
                    if let Some(name) = iokit_property_as_string(service, "model") {
                        gpus.push((name, None)); // Unified memory; no discrete VRAM
                    }
                    IOObjectRelease(service);
                }
                IOObjectRelease(iter);
            }
        }

        // Discrete / Intel GPUs: IOPCIDevice with PCI class 0x03 (display controller)
        let pci_name = CString::new("IOPCIDevice").unwrap();
        let matching = IOServiceMatching(pci_name.as_ptr());
        if !matching.is_null() {
            let mut iter: IOIterator = MACH_PORT_NULL;
            if IOServiceGetMatchingServices(IOKIT_MAIN_PORT, matching as CFDictionaryRef, &mut iter)
                == 0
            {
                loop {
                    let service = IOIteratorNext(iter);
                    if service == MACH_PORT_NULL {
                        break;
                    }

                    // Check PCI class code: 4-byte big-endian; byte[0] == 0x03 → display
                    let is_display = with_cfstring("class-code", |k| {
                        let v = IORegistryEntryCreateCFProperty(service, k, kCFAllocatorDefault, 0);
                        if v.is_null() {
                            return false;
                        }
                        let _owned = OwnedCF(v);
                        if CFGetTypeID(v) != CFDataGetTypeID() {
                            return false;
                        }
                        let len = CFDataGetLength(v as CFDataRef);
                        if len < 1 {
                            return false;
                        }
                        let ptr = CFDataGetBytePtr(v as CFDataRef);
                        // PCI class stored little-endian: byte[3] is class
                        *ptr.add((len - 1) as usize) == 0x03
                    });

                    if is_display {
                        if let Some(name) = iokit_property_as_string(service, "model") {
                            // Try VRAM properties (discrete GPUs only)
                            let vram =
                                iokit_property_as_u64(service, "VRAM,totalsize").or_else(|| {
                                    iokit_property_as_u64(service, "VRAM,totalMB")
                                        .map(|mb| mb * 1024 * 1024)
                                });
                            gpus.push((name, vram));
                        }
                    }
                    IOObjectRelease(service);
                }
                IOObjectRelease(iter);
            }
        }
    }
    gpus
}

// ─── Block storage I/O — IOBlockStorageDriver ────────────────────────────────

/// IOKit key for the driver's cumulative statistics dictionary.
const IO_BLOCK_STATISTICS: &str = "Statistics";
/// Key for cumulative bytes read, inside the statistics dictionary.
const IO_BLOCK_BYTES_READ: &str = "Bytes (Read)";
/// Key for cumulative bytes written, inside the statistics dictionary.
const IO_BLOCK_BYTES_WRITTEN: &str = "Bytes (Write)";

/// Read a `u64` out of a CFDictionary by string key.
///
/// Separate from [`iokit_property_as_u64`], which reads a property off a registry *entry*;
/// this reads a value out of a dictionary that is already in hand. The statistics live one
/// level down, so both are needed.
unsafe fn cf_dict_u64(dict: CFDictionaryRef, key: &str) -> Option<u64> {
    if dict.is_null() {
        return None;
    }
    let value = with_cfstring(key, |k| CFDictionaryGetValue(dict, k));
    // Borrowed from the dictionary ("Get" rule) — must NOT be released.
    if value.is_null() || CFGetTypeID(value) != CFNumberGetTypeID() {
        return None;
    }
    let mut out: i64 = 0;
    CFNumberGetValue(
        value as CFNumberRef,
        4, /* kCFNumberSInt64Type */
        &mut out as *mut i64 as *mut c_void,
    );
    // A negative counter is not a small number, it is a broken read; reject rather than
    // wrap it into an enormous u64.
    if out >= 0 {
        Some(out as u64)
    } else {
        None
    }
}

/// Find the BSD device name (`disk0`) for an `IOBlockStorageDriver` service.
///
/// **The name is not on the driver — it is on its child `IOMedia`**, which is why this
/// walks the IOService plane rather than reading a property directly. The first child
/// carrying a `BSD Name` wins; that is the whole-disk media, and its partitions are
/// deeper in the tree, so this cannot accidentally return a partition name.
unsafe fn block_driver_bsd_name(driver: IOService) -> Option<String> {
    let plane = b"IOService\0";
    let mut iter: IOIterator = MACH_PORT_NULL;
    if IORegistryEntryGetChildIterator(driver, plane.as_ptr() as *const i8, &mut iter) != 0 {
        return None;
    }
    let mut found = None;
    loop {
        let child = IOIteratorNext(iter);
        if child == MACH_PORT_NULL {
            break;
        }
        if found.is_none() {
            found = iokit_property_as_string(child, "BSD Name");
        }
        IOObjectRelease(child);
        if found.is_some() {
            break;
        }
    }
    IOObjectRelease(iter);
    found
}

/// Cumulative per-disk byte counters, as `(bsd_name, bytes_read, bytes_written)`.
///
/// Enumerates `IOBlockStorageDriver` services and reads their `Statistics` dictionary.
/// This is the same source `iostat` reports from; verified against it under a sustained
/// 900 MB/s write (IOKit 947 MB/s vs iostat 896/895/898 MB/s over overlapping windows,
/// both 0 B/s idle).
///
/// **Only drivers with a resolvable BSD name are returned.** A Mac carries several
/// `IOBlockStorageDriver` instances with no attached media — measured here: 4 services,
/// of which 3 had no BSD name and all-zero counters. Reporting those would invent devices
/// that do not exist; skipping them is the `Users: 0` call (v0.6.1) applied again.
///
/// Partitions cannot appear: the counters live on the *driver*, which sits above the
/// whole-disk `IOMedia`, so the double-counting the Linux arm filters for is structurally
/// impossible here rather than merely filtered.
pub fn get_block_storage_io() -> Vec<(String, u64, u64)> {
    let mut out = Vec::new();
    unsafe {
        let class = CString::new("IOBlockStorageDriver").unwrap();
        let matching = IOServiceMatching(class.as_ptr());
        if matching.is_null() {
            return out;
        }
        let mut iter: IOIterator = MACH_PORT_NULL;
        // IOServiceGetMatchingServices consumes `matching`; do not release it.
        if IOServiceGetMatchingServices(IOKIT_MAIN_PORT, matching as CFDictionaryRef, &mut iter)
            != 0
        {
            return out;
        }
        loop {
            let service = IOIteratorNext(iter);
            if service == MACH_PORT_NULL {
                break;
            }
            if let Some(name) = block_driver_bsd_name(service) {
                let stats = with_cfstring(IO_BLOCK_STATISTICS, |k| {
                    IORegistryEntryCreateCFProperty(service, k, kCFAllocatorDefault, 0)
                });
                if !stats.is_null() {
                    let _owned = OwnedCF(stats);
                    if CFGetTypeID(stats) == CFDictionaryGetTypeID() {
                        let dict = stats as CFDictionaryRef;
                        // Absent counters read as 0 rather than dropping the device: a
                        // disk that has genuinely never been written to is a real state.
                        let read = cf_dict_u64(dict, IO_BLOCK_BYTES_READ).unwrap_or(0);
                        let written = cf_dict_u64(dict, IO_BLOCK_BYTES_WRITTEN).unwrap_or(0);
                        out.push((name, read, written));
                    }
                }
            }
            IOObjectRelease(service);
        }
        IOObjectRelease(iter);
    }
    out.sort_by(|a, b| a.0.cmp(&b.0));
    out
}

// ─── HID input devices — IOHIDDevice ─────────────────────────────────────────

/// One HID interface as IOKit reports it: `(product, usage_page, usage)`.
///
/// Returned as raw numbers rather than a classified kind so the classification stays a
/// **pure function** in `input.rs` that a unit test can exercise against a fixture — the
/// `parse_xrandr_displays_with` pattern, and for the same reason: a test must not depend
/// on what happens to be plugged into the machine running it.
pub type HidInterface = (String, i64, i64);

/// Enumerate HID interfaces, as `(product, PrimaryUsagePage, PrimaryUsage)`.
///
/// **macOS exposes one `IOHIDDevice` per HID *interface*, not per physical device**, and
/// that is what makes the macOS classification simpler than the Linux one. A composite
/// peripheral publishes a separate interface for each role it implements, each carrying
/// its own `PrimaryUsage`, so the kernel states the role directly instead of leaving it to
/// be inferred from capability bitmaps.
///
/// Interfaces with no `Product` string are skipped — several Apple internal SPU/SPMI
/// endpoints expose none, and a device that cannot be named cannot usefully be listed.
pub fn get_hid_interfaces() -> Vec<HidInterface> {
    let mut out = Vec::new();
    unsafe {
        let class = CString::new("IOHIDDevice").unwrap();
        let matching = IOServiceMatching(class.as_ptr());
        if matching.is_null() {
            return out;
        }
        let mut iter: IOIterator = MACH_PORT_NULL;
        // IOServiceGetMatchingServices consumes `matching`; do not release it.
        if IOServiceGetMatchingServices(IOKIT_MAIN_PORT, matching as CFDictionaryRef, &mut iter)
            != 0
        {
            return out;
        }
        loop {
            let service = IOIteratorNext(iter);
            if service == MACH_PORT_NULL {
                break;
            }
            if let Some(product) = iokit_property_as_string(service, "Product") {
                let page = iokit_property_as_i64(service, "PrimaryUsagePage");
                let usage = iokit_property_as_i64(service, "PrimaryUsage");
                if let (Some(page), Some(usage)) = (page, usage) {
                    out.push((product, page, usage));
                }
            }
            IOObjectRelease(service);
        }
        IOObjectRelease(iter);
    }
    out
}

/// Read an IOKit registry property as a signed integer.
///
/// Distinct from [`iokit_property_as_u64`], which rejects zero and negative values because
/// its callers treat those as "absent". A HID usage of `0` is a legitimate reading, so this
/// preserves it.
unsafe fn iokit_property_as_i64(entry: IOService, key: &str) -> Option<i64> {
    if entry == MACH_PORT_NULL {
        return None;
    }
    let val = with_cfstring(key, |k| {
        IORegistryEntryCreateCFProperty(entry, k, kCFAllocatorDefault, 0)
    });
    if val.is_null() {
        return None;
    }
    let _owned = OwnedCF(val);
    if CFGetTypeID(val) != CFNumberGetTypeID() {
        return None;
    }
    let mut out: i64 = 0;
    CFNumberGetValue(
        val as CFNumberRef,
        4, /* kCFNumberSInt64Type */
        &mut out as *mut i64 as *mut c_void,
    )
    .then_some(out)
}

// ─── Backlight brightness — AppleARMBacklight ────────────────────────────────

/// Read the internal display's backlight level as `(value, min, max)`.
///
/// **The classic `IODisplayConnect` / `IODisplayParameters` path does not exist on Apple
/// Silicon** — probed here, along with `AppleBacklightDisplay`, `AppleCLCD2` and
/// `IOMobileFramebufferShim`, and all four returned nothing. The service that does carry
/// it is **`AppleARMBacklight`**, whose `IODisplayParameters` dictionary holds a nested
/// `brightness` sub-dictionary with `value`, `min` and `max` keys.
///
/// Returned as the raw triple rather than a percentage so the arithmetic stays in a pure,
/// unit-tested helper rather than being buried in FFI. Measured on an M3 Pro:
/// `value = 32768, min = 0, max = 65536`.
///
/// An external display has no `AppleARMBacklight` service, so this reports the internal
/// panel only — which is the same scope as the Linux arm's first `/sys/class/backlight`
/// device.
pub fn get_backlight_brightness() -> Option<(i64, i64, i64)> {
    unsafe {
        let class = CString::new("AppleARMBacklight").unwrap();
        let matching = IOServiceMatching(class.as_ptr());
        if matching.is_null() {
            return None;
        }
        let mut iter: IOIterator = MACH_PORT_NULL;
        if IOServiceGetMatchingServices(IOKIT_MAIN_PORT, matching as CFDictionaryRef, &mut iter)
            != 0
        {
            return None;
        }
        let mut found = None;
        loop {
            let service = IOIteratorNext(iter);
            if service == MACH_PORT_NULL {
                break;
            }
            if found.is_none() {
                let params = with_cfstring("IODisplayParameters", |k| {
                    IORegistryEntryCreateCFProperty(service, k, kCFAllocatorDefault, 0)
                });
                if !params.is_null() {
                    let _owned = OwnedCF(params);
                    if CFGetTypeID(params) == CFDictionaryGetTypeID() {
                        // `brightness` is a sub-dictionary, borrowed from its parent —
                        // "Get" semantics, so it must not be released.
                        let brightness = with_cfstring("brightness", |k| {
                            CFDictionaryGetValue(params as CFDictionaryRef, k)
                        });
                        if !brightness.is_null()
                            && CFGetTypeID(brightness) == CFDictionaryGetTypeID()
                        {
                            let dict = brightness as CFDictionaryRef;
                            if let (Some(value), Some(min), Some(max)) = (
                                cf_dict_i64(dict, "value"),
                                cf_dict_i64(dict, "min"),
                                cf_dict_i64(dict, "max"),
                            ) {
                                found = Some((value, min, max));
                            }
                        }
                    }
                }
            }
            IOObjectRelease(service);
            if found.is_some() {
                break;
            }
        }
        IOObjectRelease(iter);
        found
    }
}

/// Read a signed integer out of a CFDictionary by string key.
///
/// Sibling of [`cf_dict_u64`]; separate because a brightness `min` of `0` is meaningful
/// and must not be conflated with "absent".
unsafe fn cf_dict_i64(dict: CFDictionaryRef, key: &str) -> Option<i64> {
    if dict.is_null() {
        return None;
    }
    let value = with_cfstring(key, |k| CFDictionaryGetValue(dict, k));
    if value.is_null() || CFGetTypeID(value) != CFNumberGetTypeID() {
        return None;
    }
    let mut out: i64 = 0;
    CFNumberGetValue(
        value as CFNumberRef,
        4, /* kCFNumberSInt64Type */
        &mut out as *mut i64 as *mut c_void,
    )
    .then_some(out)
}

// ─── Power adapter — IOPowerSources ──────────────────────────────────────────

#[link(name = "IOKit", kind = "framework")]
extern "C" {
    fn IOPSCopyExternalPowerAdapterDetails() -> CFDictionaryRef;
}

/// Wattage of the attached external power adapter, or `None` when nothing is attached.
///
/// `IOPSCopyExternalPowerAdapterDetails` returns NULL when the machine is on battery, so
/// absence *is* the "unplugged" signal — there is no separate connected flag to read, and
/// no adapter name to report either. Measured on an M3 Pro on mains: `Watts = 96`,
/// `Current = 4800`, `FamilyCode` — and **no `Name` key at all**, which is why the macOS
/// arm reports wattage where the Linux arm reports a name.
///
/// fastfetch reports `96W` on the same machine, agreeing with this reading.
pub fn get_power_adapter_watts() -> Option<i64> {
    unsafe {
        let details = IOPSCopyExternalPowerAdapterDetails();
        if details.is_null() {
            return None;
        }
        let _owned = OwnedCF(details as CFTypeRef);
        cf_dict_i64(details, "Watts")
    }
}

// ─── DNS — SystemConfiguration dynamic store ─────────────────────────────────

#[link(name = "CoreFoundation", kind = "framework")]
extern "C" {
    fn CFArrayGetTypeID() -> usize;
    fn CFArrayGetCount(array: CFArrayRef) -> isize;
    fn CFArrayGetValueAtIndex(array: CFArrayRef, index: isize) -> *const c_void;
}

/// Opaque `CFArrayRef`.
pub type CFArrayRef = *const c_void;

#[link(name = "SystemConfiguration", kind = "framework")]
extern "C" {
    fn SCDynamicStoreCreate(
        allocator: CFAllocatorRef,
        name: CFStringRef,
        callout: *const c_void,
        context: *const c_void,
    ) -> *const c_void;
    fn SCDynamicStoreCopyValue(store: *const c_void, key: CFStringRef) -> CFTypeRef;
}

/// The DNS configuration belonging to one network service.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct ScDnsConfig {
    /// Nameserver addresses, in configd's own order.
    pub servers: Vec<String>,
    /// Search domain list, if the service defines one.
    pub search: Vec<String>,
    /// The service's own domain name.
    pub domain: Option<String>,
}

/// Read the **default route's own** DNS configuration from the dynamic store.
///
/// **This is the whole point of the module: `/etc/resolv.conf` on macOS is not this.**
/// That file is configd's legacy compatibility view and mirrors
/// `State:/Network/Global/DNS`, the *merged* resolver — which on a machine with a
/// split-tunnel VPN names the VPN's server and domain even though the VPN is not the
/// default route. Measured on a host whose default route is `en9`:
///
/// | source | servers | domain |
/// |---|---|---|
/// | `State:/Network/Global/DNS` (≡ resolv.conf) | `100.101.255.254` (VPN) | search `netbird.cloud, lan` |
/// | the primary service (`en9`) | `10.10.1.1` | `lan` |
///
/// So this resolves `State:/Network/Global/IPv4` → `PrimaryService`, then reads that
/// service's own `.../DNS` dictionary. `State:` is consulted before `Setup:` because the
/// former carries what DHCP actually supplied while the latter holds only manual
/// overrides (measured: `Setup:` is null on a DHCP service).
///
/// Returns `None` when there is no default route at all — an offline machine — so the
/// caller can fall back to `resolv.conf` rather than reporting nothing.
pub fn get_primary_service_dns() -> Option<ScDnsConfig> {
    unsafe {
        let name = with_cfstring_owned("retch");
        let store = SCDynamicStoreCreate(
            kCFAllocatorDefault,
            name.0 as CFStringRef,
            ptr::null(),
            ptr::null(),
        );
        drop(name);
        if store.is_null() {
            return None;
        }
        let _store = OwnedCF(store);

        let service = {
            let global = copy_store_value(store, "State:/Network/Global/IPv4")?;
            cf_dict_string(global.0 as CFDictionaryRef, "PrimaryService")?
        };

        // `State:` first: it is what DHCP supplied. `Setup:` holds manual overrides only.
        for prefix in ["State:", "Setup:"] {
            let key = format!("{prefix}/Network/Service/{service}/DNS");
            let Some(dns) = copy_store_value(store, &key) else {
                continue;
            };
            let dict = dns.0 as CFDictionaryRef;
            let config = ScDnsConfig {
                servers: cf_dict_string_array(dict, "ServerAddresses"),
                search: cf_dict_string_array(dict, "SearchDomains"),
                domain: cf_dict_string(dict, "DomainName"),
            };
            if !config.servers.is_empty() || !config.search.is_empty() || config.domain.is_some() {
                return Some(config);
            }
        }
        // A resolvable primary service with no DNS of its own is a real state, and it is
        // reported as such (an empty config) rather than by falling back to the merged
        // view — falling back is exactly what would resurrect the VPN's values. Same call
        // as the Linux `DefaultRouteDomain::Managed(None)` case in v0.6.11.
        Some(ScDnsConfig::default())
    }
}

/// `SCDynamicStoreCopyValue` wrapped so the result is released on every path.
unsafe fn copy_store_value(store: *const c_void, key: &str) -> Option<OwnedCF> {
    let value = with_cfstring(key, |k| SCDynamicStoreCopyValue(store, k));
    (!value.is_null()).then_some(OwnedCF(value))
}

/// Build a CFString the caller owns, for the cases where a borrow will not do.
unsafe fn with_cfstring_owned(s: &str) -> OwnedCF {
    let cs = CString::new(s).unwrap_or_default();
    OwnedCF(
        CFStringCreateWithCString(kCFAllocatorDefault, cs.as_ptr(), kCFStringEncodingUTF8)
            as CFTypeRef,
    )
}

/// Read a string out of a CFDictionary.
unsafe fn cf_dict_string(dict: CFDictionaryRef, key: &str) -> Option<String> {
    if dict.is_null() {
        return None;
    }
    let value = with_cfstring(key, |k| CFDictionaryGetValue(dict, k));
    if value.is_null() || CFGetTypeID(value) != CFStringGetTypeID() {
        return None;
    }
    cf_string_to_rust(value as CFStringRef).filter(|s| !s.trim().is_empty())
}

/// Read an array of strings out of a CFDictionary, skipping non-string members.
unsafe fn cf_dict_string_array(dict: CFDictionaryRef, key: &str) -> Vec<String> {
    let mut out = Vec::new();
    if dict.is_null() {
        return out;
    }
    let value = with_cfstring(key, |k| CFDictionaryGetValue(dict, k));
    if value.is_null() || CFGetTypeID(value) != CFArrayGetTypeID() {
        return out;
    }
    let array = value as CFArrayRef;
    for i in 0..CFArrayGetCount(array) {
        let item = CFArrayGetValueAtIndex(array, i);
        if !item.is_null() && CFGetTypeID(item) == CFStringGetTypeID() {
            if let Some(s) = cf_string_to_rust(item as CFStringRef) {
                let s = s.trim().to_string();
                if !s.is_empty() {
                    out.push(s);
                }
            }
        }
    }
    out
}

// ─── CoreAudio ───────────────────────────────────────────────────────────────

#[repr(C)]
struct AudioObjectPropertyAddress {
    selector: u32,
    scope: u32,
    element: u32,
}

// AudioObject constants (4-char codes as big-endian u32)
const K_AUDIO_OBJECT_SYSTEM_OBJECT: u32 = 1;
const K_AUDIO_HARDWARE_PROPERTY_DEVICES: u32 = 0x6465_7623; // 'dev#'
const K_AUDIO_OBJECT_PROPERTY_NAME: u32 = 0x6c6e_616d; // 'lnam'
const K_AUDIO_OBJECT_PROPERTY_SCOPE_GLOBAL: u32 = 0x676c_6f62; // 'glob'
const K_AUDIO_OBJECT_PROPERTY_ELEMENT_MAIN: u32 = 0;

#[link(name = "CoreAudio", kind = "framework")]
extern "C" {
    fn AudioObjectGetPropertyDataSize(
        object_id: u32,
        address: *const AudioObjectPropertyAddress,
        qualifier_data_size: u32,
        qualifier_data: *const c_void,
        out_data_size: *mut u32,
    ) -> i32;

    fn AudioObjectGetPropertyData(
        object_id: u32,
        address: *const AudioObjectPropertyAddress,
        qualifier_data_size: u32,
        qualifier_data: *const c_void,
        io_data_size: *mut u32,
        out_data: *mut c_void,
    ) -> i32;
}

/// Enumerate CoreAudio device names.
pub fn get_audio_device_names() -> Vec<String> {
    let mut names = Vec::new();
    unsafe {
        let devices_addr = AudioObjectPropertyAddress {
            selector: K_AUDIO_HARDWARE_PROPERTY_DEVICES,
            scope: K_AUDIO_OBJECT_PROPERTY_SCOPE_GLOBAL,
            element: K_AUDIO_OBJECT_PROPERTY_ELEMENT_MAIN,
        };

        let mut data_size: u32 = 0;
        if AudioObjectGetPropertyDataSize(
            K_AUDIO_OBJECT_SYSTEM_OBJECT,
            &devices_addr,
            0,
            ptr::null(),
            &mut data_size,
        ) != 0
            || data_size == 0
        {
            return names;
        }

        let count = (data_size / 4) as usize; // AudioDeviceID is u32
        let mut device_ids = vec![0u32; count];
        if AudioObjectGetPropertyData(
            K_AUDIO_OBJECT_SYSTEM_OBJECT,
            &devices_addr,
            0,
            ptr::null(),
            &mut data_size,
            device_ids.as_mut_ptr() as *mut c_void,
        ) != 0
        {
            return names;
        }

        let name_addr = AudioObjectPropertyAddress {
            selector: K_AUDIO_OBJECT_PROPERTY_NAME,
            scope: K_AUDIO_OBJECT_PROPERTY_SCOPE_GLOBAL,
            element: K_AUDIO_OBJECT_PROPERTY_ELEMENT_MAIN,
        };

        for &device_id in &device_ids {
            let mut name_ref: CFStringRef = ptr::null();
            let mut name_size = std::mem::size_of::<CFStringRef>() as u32;
            if AudioObjectGetPropertyData(
                device_id,
                &name_addr,
                0,
                ptr::null(),
                &mut name_size,
                &mut name_ref as *mut CFStringRef as *mut c_void,
            ) == 0
                && !name_ref.is_null()
            {
                if let Some(name) = cf_string_to_rust(name_ref) {
                    if !name.is_empty() && !names.contains(&name) {
                        names.push(name);
                    }
                }
                CFRelease(name_ref as CFTypeRef);
            }
        }
    }
    names
}

// ─── CoreGraphics — Displays ──────────────────────────────────────────────────

#[link(name = "CoreGraphics", kind = "framework")]
extern "C" {
    fn CGGetActiveDisplayList(
        max_displays: u32,
        active_displays: *mut u32,
        display_count: *mut u32,
    ) -> i32;
    fn CGDisplayPixelsWide(display: u32) -> usize;
    fn CGDisplayPixelsHigh(display: u32) -> usize;
    fn CGDisplayCopyDisplayMode(display: u32) -> *mut c_void;
    fn CGDisplayModeGetRefreshRate(mode: *mut c_void) -> f64;
    fn CGDisplayModeRelease(mode: *mut c_void);
    fn CGDisplayVendorNumber(display: u32) -> u32;
    fn CGDisplayModelNumber(display: u32) -> u32;
}

/// Return a list of active displays as `(width_px, height_px, refresh_hz, vendor, model)`.
fn get_active_displays() -> Vec<(usize, usize, f64, u32, u32)> {
    let mut displays = Vec::new();
    unsafe {
        let mut count: u32 = 0;
        if CGGetActiveDisplayList(0, ptr::null_mut(), &mut count) != 0 || count == 0 {
            return displays;
        }
        let mut ids = vec![0u32; count as usize];
        if CGGetActiveDisplayList(count, ids.as_mut_ptr(), &mut count) != 0 {
            return displays;
        }
        for id in ids {
            let w = CGDisplayPixelsWide(id);
            let h = CGDisplayPixelsHigh(id);
            let mode = CGDisplayCopyDisplayMode(id);
            let refresh = if mode.is_null() {
                0.0
            } else {
                let r = CGDisplayModeGetRefreshRate(mode);
                CGDisplayModeRelease(mode);
                r
            };
            let vendor = CGDisplayVendorNumber(id);
            let model = CGDisplayModelNumber(id);
            displays.push((w, h, refresh, vendor, model));
        }
    }
    displays
}

/// Try to find a display name via IODisplayConnect by matching vendor+model numbers.
unsafe fn iokit_display_name(vendor: u32, model: u32) -> Option<String> {
    let matching_name = CString::new("IODisplayConnect").unwrap();
    let matching = IOServiceMatching(matching_name.as_ptr());
    if matching.is_null() {
        return None;
    }
    let mut iter: IOIterator = MACH_PORT_NULL;
    if IOServiceGetMatchingServices(IOKIT_MAIN_PORT, matching as CFDictionaryRef, &mut iter) != 0 {
        return None;
    }
    let mut result = None;
    loop {
        let service = IOIteratorNext(iter);
        if service == MACH_PORT_NULL {
            break;
        }
        // Read DisplayVendorID and DisplayProductID
        let v = iokit_property_as_u64(service, "DisplayVendorID").unwrap_or(0) as u32;
        let m = iokit_property_as_u64(service, "DisplayProductID").unwrap_or(0) as u32;
        if v == vendor && m == model {
            // DisplayProductName may be a CFString directly (on some macOS versions)
            result = iokit_property_as_string(service, "DisplayProductName");
            IOObjectRelease(service);
            break;
        }
        IOObjectRelease(service);
    }
    IOObjectRelease(iter);
    result
}

/// Return human-readable display descriptions: `"Name (WxH @ RRHz)"` or `"Display N (WxH @ RRHz)"`.
pub fn get_displays() -> Vec<String> {
    let raw = get_active_displays();
    raw.into_iter()
        .enumerate()
        .map(|(i, (w, h, refresh, vendor, model))| {
            let name = unsafe { iokit_display_name(vendor, model) }
                .unwrap_or_else(|| format!("Display {}", i + 1));
            let res = format!("{}x{}", w, h);
            if refresh > 0.0 {
                let rr = crate::display::format_refresh_rate(refresh);
                format!("{} ({} @ {}Hz)", name, res, rr)
            } else {
                format!("{} ({})", name, res)
            }
        })
        .collect()
}

// ─── IOKit — USB Cameras ──────────────────────────────────────────────────────

const USB_VIDEO_CLASS: u64 = 0x0E; // bInterfaceClass for UVC webcams

/// Enumerate USB cameras by finding IOUSBDevice children with bInterfaceClass = 0x0E.
pub fn get_usb_cameras() -> Vec<String> {
    let mut cameras = Vec::new();
    unsafe {
        let usb_name = CString::new("IOUSBDevice").unwrap();
        let matching = IOServiceMatching(usb_name.as_ptr());
        if matching.is_null() {
            return cameras;
        }
        let mut iter: IOIterator = MACH_PORT_NULL;
        if IOServiceGetMatchingServices(IOKIT_MAIN_PORT, matching as CFDictionaryRef, &mut iter)
            != 0
        {
            return cameras;
        }
        loop {
            let service = IOIteratorNext(iter);
            if service == MACH_PORT_NULL {
                break;
            }

            // Check if any child interface has bInterfaceClass == 0x0E (Video)
            let has_video = has_video_interface(service);
            if has_video {
                // Prefer "USB Product Name", fall back to "idProduct" numeric
                if let Some(name) = iokit_property_as_string(service, "USB Product Name") {
                    if !name.is_empty() && !cameras.contains(&name) {
                        cameras.push(name);
                    }
                }
            }
            IOObjectRelease(service);
        }
        IOObjectRelease(iter);
    }
    cameras
}

unsafe fn has_video_interface(device: IOService) -> bool {
    let mut child_iter: IOIterator = MACH_PORT_NULL;
    let plane = b"IOService\0";
    if IORegistryEntryGetChildIterator(device, plane.as_ptr() as *const i8, &mut child_iter) != 0 {
        return false;
    }
    let mut found = false;
    loop {
        let child = IOIteratorNext(child_iter);
        if child == MACH_PORT_NULL {
            break;
        }
        if let Some(class) = iokit_property_as_u64(child, "bInterfaceClass") {
            if class == USB_VIDEO_CLASS {
                found = true;
                IOObjectRelease(child);
                break;
            }
        }
        IOObjectRelease(child);
    }
    IOObjectRelease(child_iter);
    found
}

// ─── IOKit — HID Gamepads ─────────────────────────────────────────────────────

/// Enumerate HID gamepads and joysticks (covers USB and Bluetooth).
/// Matches usage page 0x01 (Generic Desktop) with usages 0x04 (Joystick) and 0x05 (Gamepad).
pub fn get_hid_gamepads() -> Vec<String> {
    let mut gamepads = Vec::new();
    for usage in [0x04u32, 0x05u32] {
        // Enumerate separately for joystick and gamepad usages
        let mut found = unsafe { enumerate_hid_usage(0x01, usage) };
        for name in found.drain(..) {
            if !gamepads.contains(&name) {
                gamepads.push(name);
            }
        }
    }
    gamepads
}

unsafe fn enumerate_hid_usage(page: u32, usage: u32) -> Vec<String> {
    let mut results = Vec::new();

    let hid_name = CString::new("IOHIDDevice").unwrap();
    let matching = IOServiceMatching(hid_name.as_ptr());
    if matching.is_null() {
        return results;
    }

    // Add usage page and usage filters to the matching dict
    let page_key = CString::new("DeviceUsagePage").unwrap();
    let usage_key = CString::new("DeviceUsage").unwrap();
    let page_cf_key = CFStringCreateWithCString(
        kCFAllocatorDefault,
        page_key.as_ptr(),
        kCFStringEncodingUTF8,
    );
    let usage_cf_key = CFStringCreateWithCString(
        kCFAllocatorDefault,
        usage_key.as_ptr(),
        kCFStringEncodingUTF8,
    );
    let page_val = CFNumberCreate(
        kCFAllocatorDefault,
        kCFNumberSInt32Type,
        &(page as i32) as *const i32 as *const c_void,
    );
    let usage_val = CFNumberCreate(
        kCFAllocatorDefault,
        kCFNumberSInt32Type,
        &(usage as i32) as *const i32 as *const c_void,
    );

    CFDictionarySetValue(matching, page_cf_key as CFTypeRef, page_val as CFTypeRef);
    CFDictionarySetValue(matching, usage_cf_key as CFTypeRef, usage_val as CFTypeRef);

    // Release the key/value CF objects (dict has retained them)
    CFRelease(page_cf_key as CFTypeRef);
    CFRelease(usage_cf_key as CFTypeRef);
    CFRelease(page_val as CFTypeRef);
    CFRelease(usage_val as CFTypeRef);

    let mut iter: IOIterator = MACH_PORT_NULL;
    // matching dict is consumed by IOServiceGetMatchingServices
    if IOServiceGetMatchingServices(IOKIT_MAIN_PORT, matching as CFDictionaryRef, &mut iter) != 0 {
        return results;
    }

    loop {
        let service = IOIteratorNext(iter);
        if service == MACH_PORT_NULL {
            break;
        }
        if let Some(name) = iokit_property_as_string(service, "Product") {
            if !name.is_empty() {
                results.push(name);
            }
        }
        IOObjectRelease(service);
    }
    IOObjectRelease(iter);
    results
}

// ─── IOKit — Bluetooth state ──────────────────────────────────────────────────

/// Return `(power_on, chipset_name)` from the IOBluetoothHCIController IOKit service.
/// Connected device names are NOT available via pure-C IOKit (requires Obj-C IOBluetooth).
pub fn get_bluetooth_state() -> Option<(bool, Option<String>)> {
    unsafe {
        let svc_name = CString::new("IOBluetoothHCIController").unwrap();
        let matching = IOServiceMatching(svc_name.as_ptr());
        if matching.is_null() {
            return None;
        }
        let service = IOServiceGetMatchingService(IOKIT_MAIN_PORT, matching as CFDictionaryRef);
        if service == MACH_PORT_NULL {
            return None;
        }
        let power =
            iokit_property_as_bool(service, "BluetoothControllerPowerIsOn").unwrap_or(false);
        // Try several property names for chipset/product string
        let chipset = iokit_property_as_string(service, "HardwareTransportCurrentSetting")
            .or_else(|| iokit_property_as_string(service, "ProductName"))
            .or_else(|| iokit_property_as_string(service, "ChipsetString"));
        IOObjectRelease(service);
        Some((power, chipset))
    }
}

// ─── IOKit — Battery (AppleSmartBattery) ─────────────────────────────────────

/// Raw battery data read directly from the AppleSmartBattery IOKit service.
pub struct MacBatteryRaw {
    pub current_mah: Option<u64>,
    pub max_mah: Option<u64>,
    pub raw_max_mah: Option<u64>,
    pub design_mah: Option<u64>,
    pub is_charging: bool,
    pub fully_charged: bool,
    /// Minutes remaining; None if unknown (65535) or unavailable.
    pub time_remaining_mins: Option<u64>,
    pub vendor: Option<String>,
    pub model: Option<String>,
}

/// Read battery data from the AppleSmartBattery IOKit service.
pub fn get_battery_raw() -> Option<MacBatteryRaw> {
    unsafe {
        let svc_name = CString::new("AppleSmartBattery").unwrap();
        let matching = IOServiceMatching(svc_name.as_ptr());
        if matching.is_null() {
            return None;
        }
        let service = IOServiceGetMatchingService(IOKIT_MAIN_PORT, matching as CFDictionaryRef);
        if service == MACH_PORT_NULL {
            return None;
        }

        let current_mah = iokit_property_as_u64(service, "CurrentCapacity");
        let max_mah = iokit_property_as_u64(service, "MaxCapacity");
        let raw_max_mah = iokit_property_as_u64(service, "AppleRawMaxCapacity");
        let design_mah = iokit_property_as_u64(service, "DesignCapacity");
        let is_charging = iokit_property_as_bool(service, "IsCharging").unwrap_or(false);
        let fully_charged = iokit_property_as_bool(service, "FullyCharged").unwrap_or(false);
        // 65535 means unknown/unlimited (AC connected with no estimate); filter it out.
        let time_remaining_mins =
            iokit_property_as_u64(service, "TimeRemaining").filter(|&m| m < 65535);
        let vendor = iokit_property_as_string(service, "Manufacturer");
        let model = iokit_property_as_string(service, "DeviceName");

        IOObjectRelease(service);

        if current_mah.is_none() && max_mah.is_none() {
            return None;
        }

        Some(MacBatteryRaw {
            current_mah,
            max_mah,
            raw_max_mah,
            design_mah,
            is_charging,
            fully_charged,
            time_remaining_mins,
            vendor,
            model,
        })
    }
}

// ─── CoreFoundation — Preferences (theme) ────────────────────────────────────

/// Read the macOS appearance preference ("Dark" or nil for Light) from the global domain.
/// Equivalent to `defaults read -g AppleInterfaceStyle`.
pub fn get_macos_appearance() -> Option<String> {
    unsafe {
        with_cfstring("AppleInterfaceStyle", |key| {
            let val = CFPreferencesCopyValue(
                key,
                kCFPreferencesAnyApplication,
                kCFPreferencesCurrentUser,
                kCFPreferencesAnyHost,
            );
            if val.is_null() {
                return None;
            }
            let _owned = OwnedCF(val);
            if CFGetTypeID(val) == CFStringGetTypeID() {
                cf_string_to_rust(val as CFStringRef)
            } else {
                None
            }
        })
    }
}

// ─── AppKit — Wallpaper ──────────────────────────────────────────────────────

#[link(name = "AppKit", kind = "framework")]
extern "C" {}

/// Read the current desktop wallpaper image path via NSWorkspace / AppKit.
pub fn get_macos_wallpaper() -> Option<String> {
    unsafe {
        let ws_cls = objc_getClass(CString::new("NSWorkspace").unwrap().as_ptr());
        let screen_cls = objc_getClass(CString::new("NSScreen").unwrap().as_ptr());
        if ws_cls.is_null() || screen_cls.is_null() {
            return None;
        }
        let shared_sel = sel_registerName(CString::new("sharedWorkspace").unwrap().as_ptr());
        let ws = objc_msgSend(ws_cls, shared_sel);
        if ws.is_null() {
            return None;
        }
        let main_sel = sel_registerName(CString::new("mainScreen").unwrap().as_ptr());
        let screen = objc_msgSend(screen_cls, main_sel);
        if screen.is_null() {
            return None;
        }
        let wp_sel = sel_registerName(CString::new("desktopImageURLForScreen:").unwrap().as_ptr());
        let url = objc_msgSend_id_id(ws, wp_sel, screen);
        if url.is_null() {
            return None;
        }
        let path_sel = sel_registerName(CString::new("path").unwrap().as_ptr());
        let path_ns = objc_msgSend(url, path_sel) as CFStringRef;
        if let Some(path) = cf_string_to_rust(path_ns) {
            if !path.is_empty() {
                return Some(path);
            }
        }
        None
    }
}

// ─── CoreWLAN — Wi-Fi SSID and link rate ─────────────────────────────────────
//
// The SystemConfiguration dynamic store key `State:/Network/Interface/*/AirPort`
// is not populated on macOS 15 Sequoia, so we use CoreWLAN for both SSID and
// transmit rate. `NSString` is toll-free bridged with `CFStringRef`.

#[link(name = "CoreWLAN", kind = "framework")]
extern "C" {}

#[link(name = "objc")]
extern "C" {
    fn objc_getClass(name: *const i8) -> *mut c_void;
    fn sel_registerName(str: *const i8) -> *mut c_void;
    fn objc_msgSend(self_: *mut c_void, op: *mut c_void, ...) -> *mut c_void;
}

#[allow(clashing_extern_declarations)]
extern "C" {
    #[link_name = "objc_msgSend"]
    fn objc_msgSend_id_id(self_: *mut c_void, op: *mut c_void, arg: *mut c_void) -> *mut c_void;
    #[link_name = "objc_msgSend"]
    fn objc_msgSend_f64(self_: *mut c_void, op: *mut c_void) -> f64;
}

/// Return `(ssid, rate_mbps)` for the connected Wi-Fi network via CoreWLAN.
///
/// macOS 10.15+ restricts SSID access to processes with Location Services
/// authorization. `CWInterface.ssid` returns nil and `ipconfig getsummary`
/// returns the literal string `<redacted>` when authorization is absent.
/// When the SSID is genuinely unavailable but `transmitRate > 0` confirms an
/// active association, we return `"Connected"` as the display name so the
/// Wi-Fi line still appears with the rate.
pub fn get_wifi_info() -> Option<(String, Option<u64>)> {
    unsafe {
        let cls_name = CString::new("CWWiFiClient").unwrap();
        let cls = objc_getClass(cls_name.as_ptr());
        if cls.is_null() {
            return None;
        }
        let shared_sel = sel_registerName(CString::new("sharedWiFiClient").unwrap().as_ptr());
        let client = objc_msgSend(cls, shared_sel);
        if client.is_null() {
            return None;
        }
        let iface_sel = sel_registerName(CString::new("interface").unwrap().as_ptr());
        let iface = objc_msgSend(client, iface_sel);
        if iface.is_null() {
            return None;
        }

        // transmitRate does not require Location Services.
        let rate_sel = sel_registerName(CString::new("transmitRate").unwrap().as_ptr());
        let rate_f = objc_msgSend_f64(iface, rate_sel);
        let rate = if rate_f > 0.0 {
            Some(rate_f as u64)
        } else {
            None
        };

        // SSID: NSString is toll-free bridged with CFString.
        // Returns nil when Location Services is not granted.
        let ssid_sel = sel_registerName(CString::new("ssid").unwrap().as_ptr());
        let ssid_ns = objc_msgSend(iface, ssid_sel) as CFStringRef;
        if let Some(ssid) = cf_string_to_rust(ssid_ns) {
            return Some((ssid, rate));
        }

        // Fallback: read SSID from configd via ipconfig getsummary <iface>.
        // On macOS 10.15+ without Location Services, ipconfig returns the
        // literal string "<redacted>" — filter that out.
        let iface_name_sel = sel_registerName(CString::new("interfaceName").unwrap().as_ptr());
        let iface_name_ns = objc_msgSend(iface, iface_name_sel) as CFStringRef;
        let iface_bsd = cf_string_to_rust(iface_name_ns).unwrap_or_else(|| "en0".to_string());

        if let Ok(out) = std::process::Command::new("/usr/sbin/ipconfig")
            .args(["getsummary", &iface_bsd])
            .output()
        {
            let text = String::from_utf8_lossy(&out.stdout);
            if let Some(ssid) = parse_ipconfig_ssid(&text) {
                return Some((ssid, rate));
            }
        }

        // SSID unavailable (Location Services not granted). If the rate
        // confirms an active association, surface that rather than hiding
        // the Wi-Fi line entirely.
        rate.map(|r| ("Connected".to_string(), Some(r)))
    }
}

/// Parse the SSID from `ipconfig getsummary <iface>` output.
///
/// Returns `None` when the SSID line is absent, empty, or the literal string
/// `<redacted>` (which macOS substitutes when Location Services is not
/// granted to the calling process).
pub fn parse_ipconfig_ssid(output: &str) -> Option<String> {
    output
        .lines()
        .find_map(|l| {
            l.trim()
                .strip_prefix("SSID :")
                .map(|s| s.trim().to_string())
        })
        .filter(|s| !s.is_empty() && s != "<redacted>")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_ipconfig_ssid() {
        let normal = "  SSID : MyNetwork\n  BSSID : aa:bb:cc:dd:ee:ff\n";
        assert_eq!(parse_ipconfig_ssid(normal), Some("MyNetwork".to_string()));

        // macOS 10.15+ redacts SSID when Location Services is not granted
        let redacted = "  BSSID : <redacted>\n  SSID : <redacted>\n";
        assert_eq!(parse_ipconfig_ssid(redacted), None);

        // SSID with spaces must be preserved
        let spaces = "  SSID : My Home Network\n";
        assert_eq!(
            parse_ipconfig_ssid(spaces),
            Some("My Home Network".to_string())
        );

        let empty_value = "  SSID : \n";
        assert_eq!(parse_ipconfig_ssid(empty_value), None);

        let no_ssid = "  BSSID : aa:bb:cc:dd:ee:ff\n  Channel : 149\n";
        assert_eq!(parse_ipconfig_ssid(no_ssid), None);
    }
}

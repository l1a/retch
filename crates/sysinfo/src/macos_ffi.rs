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
    pub fn CFBooleanGetValue(boolean: CFBooleanRef) -> bool;
    pub fn CFNumberGetValue(number: CFNumberRef, the_type: i32, value_ptr: *mut c_void) -> bool;
    pub fn CFNumberCreate(
        alloc: CFAllocatorRef,
        the_type: i32,
        value_ptr: *const c_void,
    ) -> CFNumberRef;
    pub fn CFDictionarySetValue(the_dict: CFMutableDictionaryRef, key: CFTypeRef, value: CFTypeRef);
    pub fn CFRelease(cf: CFTypeRef);
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

#[link(name = "IOKit", kind = "framework")]
extern "C" {
    pub static IOMainPortDefault: u32;

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
        let entry = IORegistryEntryFromPath(IOMainPortDefault, path.as_ptr() as *const i8);
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
            if IOServiceGetMatchingServices(
                IOMainPortDefault,
                matching as CFDictionaryRef,
                &mut iter,
            ) == 0
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
            if IOServiceGetMatchingServices(
                IOMainPortDefault,
                matching as CFDictionaryRef,
                &mut iter,
            ) == 0
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
    if IOServiceGetMatchingServices(IOMainPortDefault, matching as CFDictionaryRef, &mut iter) != 0
    {
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
        if IOServiceGetMatchingServices(IOMainPortDefault, matching as CFDictionaryRef, &mut iter)
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
    if IOServiceGetMatchingServices(IOMainPortDefault, matching as CFDictionaryRef, &mut iter) != 0
    {
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
        let service = IOServiceGetMatchingService(IOMainPortDefault, matching as CFDictionaryRef);
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

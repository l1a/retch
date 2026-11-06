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
pub const kCFNumberSInt64Type: i32 = 4;
#[allow(non_upper_case_globals)]
pub const kCFNumberFloat64Type: i32 = 6;
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
    pub fn IORegistryEntryGetParentEntry(
        entry: IOService,
        plane: *const i8,
        parent: *mut IOService,
    ) -> i32;
    /// `name` must point to an `io_name_t`, i.e. a 128-byte buffer.
    pub fn IORegistryEntryGetName(entry: IOService, name: *mut i8) -> i32;
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

// ─── BIOS & Platform — IODeviceTree ──────────────────────────────────────────

/// Split an Apple Silicon `system-firmware-version` string (e.g. `"mBoot-20457.41.3"` or
/// `"iBoot-10151.140.19"`) into `(bios_display, bootmgr_display)`.
///
/// Pure helper so the Apple Silicon firmware/bootmgr parsing is unit-tested on all platforms.
pub fn parse_apple_silicon_firmware(raw: &str) -> (Option<String>, Option<String>) {
    let trimmed = raw.trim();
    if trimmed.is_empty() {
        return (None, None);
    }
    if let Some((prefix, ver)) = trimmed.split_once('-') {
        let prefix = prefix.trim();
        let ver = ver.trim();
        if !prefix.is_empty() && !ver.is_empty() {
            return (Some(format!("{prefix} {ver}")), Some(prefix.to_string()));
        }
    }
    (Some(trimmed.to_string()), None)
}

/// Read the system firmware version from `IODeviceTree:/rom` (Intel Macs) or
/// `IODeviceTree:/chosen`'s `system-firmware-version` (Apple Silicon Macs, e.g.
/// `"mBoot 20457.41.3"`).
pub fn get_firmware_version() -> Option<String> {
    // SAFETY: `path` byte literals are NUL-terminated; registry entries are checked against
    // `MACH_PORT_NULL` and released via `IOObjectRelease` before returning.
    unsafe {
        let rom_path = b"IODeviceTree:/rom\0";
        let rom_entry = IORegistryEntryFromPath(IOKIT_MAIN_PORT, rom_path.as_ptr() as *const i8);
        if rom_entry != MACH_PORT_NULL {
            let ver = iokit_property_as_string(rom_entry, "version");
            IOObjectRelease(rom_entry);
            if ver.is_some() {
                return ver;
            }
        }

        let chosen_path = b"IODeviceTree:/chosen\0";
        let chosen_entry =
            IORegistryEntryFromPath(IOKIT_MAIN_PORT, chosen_path.as_ptr() as *const i8);
        if chosen_entry == MACH_PORT_NULL {
            return None;
        }
        let raw = iokit_property_as_string(chosen_entry, "system-firmware-version")
            .or_else(|| iokit_property_as_string(chosen_entry, "iboot-version"));
        IOObjectRelease(chosen_entry);
        raw.and_then(|s| parse_apple_silicon_firmware(&s).0)
    }
}

/// Read the boot manager name on macOS (`"mBoot"` or `"iBoot"` on Apple Silicon from
/// `IODeviceTree:/chosen`'s `system-firmware-version`, falling back to `"Apple Boot ROM"`).
pub fn get_macos_bootmgr() -> String {
    // SAFETY: `chosen_path` is NUL-terminated; entry is checked and released via `IOObjectRelease`.
    unsafe {
        let chosen_path = b"IODeviceTree:/chosen\0";
        let chosen_entry =
            IORegistryEntryFromPath(IOKIT_MAIN_PORT, chosen_path.as_ptr() as *const i8);
        if chosen_entry != MACH_PORT_NULL {
            let raw = iokit_property_as_string(chosen_entry, "system-firmware-version");
            IOObjectRelease(chosen_entry);
            if let Some(s) = raw {
                if let Some(mgr) = parse_apple_silicon_firmware(&s).1 {
                    return mgr;
                }
            }
        }
    }
    "Apple Boot ROM".to_string()
}

/// Hardware model, marketing product description, board identifier, and battery flag read
/// from `IODeviceTree:/` and `IODeviceTree:/product`.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct MacPlatformInfo {
    /// Model identifier, e.g. `"Mac15,6"` or `"MacBookPro18,3"`.
    pub model: Option<String>,
    /// Marketing product description, e.g. `"MacBook Pro (14-inch, Nov 2023)"`.
    pub product_name: Option<String>,
    /// Board / target sub-type identifier, e.g. `"J514sAP"`.
    pub board_id: Option<String>,
    /// Whether `IODeviceTree:/product` reports `"builtin-battery" = 1`.
    pub builtin_battery: bool,
}

/// Read [`MacPlatformInfo`] from `IODeviceTree:/` and `IODeviceTree:/product` without
/// spawning a `sysctl` subprocess.
pub fn get_macos_platform_info() -> MacPlatformInfo {
    let mut info = MacPlatformInfo::default();
    // SAFETY: Paths are NUL-terminated literals; each non-null registry entry is released.
    unsafe {
        let root_path = b"IODeviceTree:/\0";
        let root = IORegistryEntryFromPath(IOKIT_MAIN_PORT, root_path.as_ptr() as *const i8);
        if root != MACH_PORT_NULL {
            info.model = iokit_property_as_string(root, "model");
            info.board_id = iokit_property_as_string(root, "target-sub-type")
                .or_else(|| iokit_property_as_string(root, "board-id"));
            IOObjectRelease(root);
        }

        let prod_path = b"IODeviceTree:/product\0";
        let prod = IORegistryEntryFromPath(IOKIT_MAIN_PORT, prod_path.as_ptr() as *const i8);
        if prod != MACH_PORT_NULL {
            info.product_name = iokit_property_as_string(prod, "product-description")
                .or_else(|| iokit_property_as_string(prod, "product-name"));
            if info.board_id.is_none() {
                info.board_id = iokit_property_as_string(prod, "unique-model");
            }
            if info.model.is_none() {
                info.model = iokit_property_as_string(prod, "fdr-product-type");
            }
            info.builtin_battery = iokit_property_as_u64(prod, "builtin-battery") == Some(1);
            IOObjectRelease(prod);
        }
    }
    info
}

/// Detect Apple's hardware security module (Secure Enclave Processor / T2) for the `TPM`
/// field on macOS.
///
/// Matches `fastfetch`'s macOS TPM detection: checks for the `AppleSEPManager` IOKit
/// service, reporting `"Apple Silicon Security"` on `aarch64` and `"Apple T2 Security"`
/// on `x86_64`.
pub fn get_macos_tpm() -> Option<String> {
    // SAFETY: `IOServiceMatching` creates a dictionary consumed by `IOServiceGetMatchingService`;
    // a non-null service port is immediately released via `IOObjectRelease`.
    unsafe {
        let name = b"AppleSEPManager\0";
        let matching = IOServiceMatching(name.as_ptr() as *const i8);
        if matching.is_null() {
            return None;
        }
        let service = IOServiceGetMatchingService(IOKIT_MAIN_PORT, matching as CFDictionaryRef);
        if service == MACH_PORT_NULL {
            return None;
        }
        IOObjectRelease(service);
        #[cfg(target_arch = "aarch64")]
        {
            Some("Apple Silicon Security".to_string())
        }
        #[cfg(not(target_arch = "aarch64"))]
        {
            Some("Apple T2 Security".to_string())
        }
    }
}

/// Read the macOS build version (e.g. `"26B123"`) via `sysctlbyname("kern.osversion")`.
pub fn get_macos_os_build() -> Option<String> {
    extern "C" {
        fn sysctlbyname(
            name: *const i8,
            oldp: *mut c_void,
            oldlenp: *mut usize,
            newp: *mut c_void,
            newlen: usize,
        ) -> i32;
    }
    let mut buf = [0u8; 64];
    let mut len = buf.len();
    // SAFETY: `name` is NUL-terminated and `buf` is a writable 64-byte stack buffer.
    let rc = unsafe {
        sysctlbyname(
            c"kern.osversion".as_ptr(),
            buf.as_mut_ptr() as *mut c_void,
            &mut len,
            ptr::null_mut(),
            0,
        )
    };
    if rc != 0 || len == 0 {
        return None;
    }
    let end = buf[..len].iter().position(|&b| b == 0).unwrap_or(len);
    let s = std::str::from_utf8(&buf[..end]).ok()?.trim();
    (!s.is_empty()).then(|| s.to_string())
}

// ─── Unified memory — IODeviceTree:/chosen ───────────────────────────────────

/// Read Apple Silicon's unified-memory size in bytes, its type (e.g. `LPDDR5`), and optional
/// DRAM manufacturer (e.g. `Hynix`) from `IODeviceTree:/chosen`'s `dram-size`, `dram-type`,
/// and `dram-vendor`. Intel Macs publish none of these, so this returns `None` there.
pub fn get_dram_size_and_type() -> Option<(u64, String, Option<String>)> {
    // SAFETY: `path` is a NUL-terminated byte string that outlives the call; the entry is
    // checked against MACH_PORT_NULL before use and released exactly once; the property
    // helpers check the CF type and length before reading and release what they copy.
    unsafe {
        let path = b"IODeviceTree:/chosen\0";
        let entry = IORegistryEntryFromPath(IOKIT_MAIN_PORT, path.as_ptr() as *const i8);
        if entry == MACH_PORT_NULL {
            return None;
        }
        let size = iokit_property_as_u64(entry, "dram-size");
        let mem_type = iokit_property_as_string(entry, "dram-type");
        let vendor = iokit_property_as_string(entry, "dram-vendor");
        IOObjectRelease(entry);
        Some((size?, mem_type?, vendor))
    }
}

// ─── GPU — IOPCIDevice + AGXAccelerator ──────────────────────────────────────

/// Parse the maximum GPU clock frequency in MHz from `IODeviceTree:/arm-io/sgx`'s
/// `perf-states` (M3/M4) or `voltage-states9` (M1/M2) byte buffer.
///
/// Each state is an 8-byte `(freq_hz: u32, millivolts: u32)` little-endian pair. Returns
/// the highest valid frequency in MHz (`100..=10_000` MHz).
pub fn parse_sgx_max_freq_mhz(bytes: &[u8]) -> Option<u64> {
    let mut max_hz: u64 = 0;
    for chunk in bytes.as_chunks::<8>().0 {
        let hz = u32::from_le_bytes([chunk[0], chunk[1], chunk[2], chunk[3]]) as u64;
        if (100_000_000..=10_000_000_000).contains(&hz) && hz > max_hz {
            max_hz = hz;
        }
    }
    (max_hz > 0).then_some(max_hz / 1_000_000)
}

/// Format an Apple Silicon GPU description with optional core count, max clock in MHz,
/// and `[Integrated]` tag.
pub fn format_apple_silicon_gpu(model: &str, cores: Option<u64>, max_mhz: Option<u64>) -> String {
    let freq_str = max_mhz.filter(|&m| m > 0).map(|mhz| {
        if mhz >= 1000 {
            format!("{:.2} GHz", mhz as f64 / 1000.0)
        } else {
            format!("{mhz} MHz")
        }
    });
    let detail = match (cores.filter(|&c| c > 0), freq_str) {
        (Some(c), Some(f)) => format!(" ({c} cores @ {f})"),
        (Some(c), None) => format!(" ({c} cores)"),
        (None, Some(f)) => format!(" (@ {f})"),
        (None, None) => String::new(),
    };
    format!("{model}{detail} [Integrated]")
}

/// Read the maximum GPU clock frequency in MHz from `IODeviceTree:/arm-io/sgx`.
unsafe fn get_sgx_max_freq_mhz() -> Option<u64> {
    let path = b"IODeviceTree:/arm-io/sgx\0";
    let entry = IORegistryEntryFromPath(IOKIT_MAIN_PORT, path.as_ptr() as *const i8);
    if entry == MACH_PORT_NULL {
        return None;
    }
    let mut max_mhz = None;
    for key in ["perf-states", "voltage-states9"] {
        let val = with_cfstring(key, |k| {
            IORegistryEntryCreateCFProperty(entry, k, kCFAllocatorDefault, 0)
        });
        if !val.is_null() {
            let _owned = OwnedCF(val);
            if CFGetTypeID(val) == CFDataGetTypeID() {
                let len = CFDataGetLength(val as CFDataRef) as usize;
                let ptr = CFDataGetBytePtr(val as CFDataRef);
                if len >= 8 && !ptr.is_null() {
                    let bytes = std::slice::from_raw_parts(ptr, len);
                    if let Some(mhz) = parse_sgx_max_freq_mhz(bytes) {
                        max_mhz = Some(mhz);
                        break;
                    }
                }
            }
        }
    }
    IOObjectRelease(entry);
    max_mhz
}

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
                let sgx_mhz = get_sgx_max_freq_mhz();
                loop {
                    let service = IOIteratorNext(iter);
                    if service == MACH_PORT_NULL {
                        break;
                    }
                    if let Some(name) = iokit_property_as_string(service, "model") {
                        let cores = iokit_property_as_u64(service, "gpu-core-count");
                        let formatted = format_apple_silicon_gpu(&name, cores, sgx_mhz);
                        gpus.push((formatted, None)); // Unified memory; no discrete VRAM
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

// ─── Physical disks — IOBlockStorageDriver → IOMedia / IOBlockStorageDevice ──

/// One whole disk as IOKit describes it, before `disk.rs` formats or filters it.
///
/// Each field is the IOKit property `diskutil info -plist` reports under the name in
/// brackets, which is what lets the native reader keep the old output exactly:
/// `model` [`MediaName`], `size_bytes` [`TotalSize`], `solid_state` [`SolidState`],
/// `interconnect` [`BusProtocol`, except that disk images read `Virtual Interface` here
/// where diskutil prints `Disk Image`].
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MacDiskRaw {
    /// Whole-disk BSD name (`disk0`); the sort key, so the order matches diskutil's.
    pub bsd_name: String,
    /// `Device Characteristics` → `Product Name`, else the `IOMedia` entry name.
    pub model: String,
    /// The whole-disk `IOMedia`'s `Size`.
    pub size_bytes: Option<u64>,
    /// `Device Characteristics` → `Medium Type` is `Solid State`.
    pub solid_state: bool,
    /// `Protocol Characteristics` → `Physical Interconnect` (`Apple Fabric`, `USB`, …).
    pub interconnect: String,
}

/// Read one string from a dictionary-valued registry property, e.g.
/// `Device Characteristics` → `Product Name`.
unsafe fn iokit_dict_property_string(
    entry: IOService,
    property: &str,
    key: &str,
) -> Option<String> {
    let dict = with_cfstring(property, |k| {
        IORegistryEntryCreateCFProperty(entry, k, kCFAllocatorDefault, 0)
    });
    if dict.is_null() {
        return None;
    }
    let _owned = OwnedCF(dict);
    if CFGetTypeID(dict) != CFDictionaryGetTypeID() {
        return None;
    }
    cf_dict_string(dict as CFDictionaryRef, key)
}

/// The registry entry's own name (`APPLE SSD AP1024Z Media` for a whole-disk `IOMedia`).
unsafe fn iokit_entry_name(entry: IOService) -> Option<String> {
    // io_name_t is char[128]; IORegistryEntryGetName NUL-terminates within it.
    let mut buf = [0i8; 128];
    if IORegistryEntryGetName(entry, buf.as_mut_ptr()) != 0 {
        return None;
    }
    let bytes: Vec<u8> = buf
        .iter()
        .take_while(|&&c| c != 0)
        .map(|&c| c as u8)
        .collect();
    String::from_utf8(bytes).ok().filter(|s| !s.is_empty())
}

/// The first child of `driver` that is a whole-disk `IOMedia` with a BSD name.
/// The caller owns the returned entry and must `IOObjectRelease` it.
unsafe fn block_driver_whole_media(driver: IOService) -> Option<(IOService, String)> {
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
        if found.is_none() && iokit_property_as_bool(child, "Whole") == Some(true) {
            if let Some(name) = iokit_property_as_string(child, "BSD Name") {
                found = Some((child, name));
                continue; // keep `child` alive for the caller
            }
        }
        IOObjectRelease(child);
    }
    IOObjectRelease(iter);
    found
}

/// Enumerate whole disks natively, replacing `diskutil list` + one `diskutil info` per disk.
///
/// **Why:** those were N+1 serial process spawns, each a round trip to `diskarbitrationd`,
/// ~0.2 s apiece — 0.97–1.04 s for four whole disks on an M-series Mac, which made
/// `phys-disk` the entire critical path of the default mode. This reads the same
/// properties straight from the registry.
///
/// Walks every `IOBlockStorageDriver` (as [`get_block_storage_io`] does): the whole-disk
/// `IOMedia` is its child and the `IOBlockStorageDevice` carrying the model and bus is its
/// parent. Synthesized APFS container disks are not backed by a driver at all, so they never
/// appear here — the case diskutil marks `VirtualOrPhysical = Virtual`. A driver with no media
/// (an empty SD reader) has no whole-disk child and is skipped, as diskutil skips it. Disk
/// images *are* driver-backed and are returned; `disk.rs` drops them by their interconnect.
pub fn get_physical_disks() -> Vec<MacDiskRaw> {
    let mut out = Vec::new();
    // SAFETY: every IOKit object obtained here (iterator, driver, media, device) is
    // released exactly once on every path; CF values are wrapped in `OwnedCF` or are
    // borrowed from a dictionary that outlives the read, per the module's memory rules.
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
        let plane = b"IOService\0";
        loop {
            let driver = IOIteratorNext(iter);
            if driver == MACH_PORT_NULL {
                break;
            }
            if let Some((media, bsd_name)) = block_driver_whole_media(driver) {
                let size_bytes = iokit_property_as_u64(media, "Size");
                let media_name = iokit_entry_name(media);
                IOObjectRelease(media);

                let mut device: IOService = MACH_PORT_NULL;
                let (product, medium, interconnect) = if IORegistryEntryGetParentEntry(
                    driver,
                    plane.as_ptr() as *const i8,
                    &mut device,
                ) == 0
                {
                    let r = (
                        iokit_dict_property_string(
                            device,
                            "Device Characteristics",
                            "Product Name",
                        ),
                        iokit_dict_property_string(device, "Device Characteristics", "Medium Type"),
                        iokit_dict_property_string(
                            device,
                            "Protocol Characteristics",
                            "Physical Interconnect",
                        ),
                    );
                    IOObjectRelease(device);
                    r
                } else {
                    (None, None, None)
                };

                out.push(MacDiskRaw {
                    bsd_name,
                    model: product
                        .filter(|p| !p.trim().is_empty())
                        .or(media_name)
                        .unwrap_or_default(),
                    size_bytes,
                    solid_state: medium.as_deref() == Some("Solid State"),
                    interconnect: interconnect.unwrap_or_default(),
                });
            }
            IOObjectRelease(driver);
        }
        IOObjectRelease(iter);
    }
    out.sort_by_key(|d| bsd_disk_sort_key(&d.bsd_name));
    out
}

/// Sort key putting `disk2` before `disk10`, as diskutil lists them.
pub fn bsd_disk_sort_key(name: &str) -> (u64, String) {
    let n = name
        .strip_prefix("disk")
        .and_then(|d| d.parse::<u64>().ok())
        .unwrap_or(u64::MAX);
    (n, name.to_string())
}

// ─── Mounted volumes — getfsstat + CFURL browsable/local flags ───────────────

pub type CFURLRef = *const c_void;

#[link(name = "CoreFoundation", kind = "framework")]
extern "C" {
    static kCFURLVolumeIsBrowsableKey: CFStringRef;
    static kCFURLVolumeIsLocalKey: CFStringRef;
    fn CFArrayCreate(
        alloc: CFAllocatorRef,
        values: *const *const c_void,
        num_values: isize,
        callbacks: *const c_void,
    ) -> CFArrayRef;
    fn CFURLCreateFromFileSystemRepresentation(
        alloc: CFAllocatorRef,
        buffer: *const u8,
        buf_len: isize,
        is_directory: u8,
    ) -> CFURLRef;
    fn CFURLCopyResourcePropertiesForKeys(
        url: CFURLRef,
        keys: CFArrayRef,
        error: *mut *const c_void,
    ) -> CFDictionaryRef;
}

/// One mounted filesystem, as `getfsstat`/`statfs` and CoreFoundation describe it.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MacMount {
    pub mount_point: String,
    /// `f_fstypename` (`apfs`, `msdos`, …).
    pub fs_type: String,
    /// `f_blocks * f_bsize` from a fresh `statfs`.
    pub total_bytes: u64,
    /// `f_bavail * f_bsize`: what a non-root user can write, as `df` and fastfetch report it.
    /// Unlike sysinfo's figure this does not count purgeable space.
    pub avail_bytes: u64,
    /// `kCFURLVolumeIsBrowsableKey` (false when absent).
    pub browsable: bool,
    /// `kCFURLVolumeIsLocalKey` (true when absent).
    pub local: bool,
}

/// Read a `CFBoolean` out of a CFDictionary by key. The value is borrowed ("Get" rule).
unsafe fn cf_dict_bool_by_cfkey(dict: CFDictionaryRef, key: CFStringRef) -> Option<bool> {
    let value = CFDictionaryGetValue(dict, key);
    if value.is_null() || CFGetTypeID(value) != CFBooleanGetTypeID() {
        return None;
    }
    Some(CFBooleanGetValue(value as CFBooleanRef))
}

/// `(browsable, local)` for a mount point, from the same two CFURL resource keys sysinfo
/// filtered on. `None` when CoreFoundation cannot describe the volume (sysinfo skipped those).
///
/// **Only these two keys are requested.** sysinfo also asked for
/// `kCFURLVolumeAvailableCapacityForImportantUsageKey`, which costs ~9 ms per volume on first
/// query; that one key was the whole of macOS `--short`'s gap to fastfetch. These two cost
/// ~2 ms for all 13 mounts of an M-series Mac.
unsafe fn volume_browsable_local(mount_point: &[u8], keys: CFArrayRef) -> Option<(bool, bool)> {
    let url = CFURLCreateFromFileSystemRepresentation(
        kCFAllocatorDefault,
        mount_point.as_ptr(),
        mount_point.len() as isize,
        1,
    );
    if url.is_null() {
        return None;
    }
    let _url = OwnedCF(url);
    let props = CFURLCopyResourcePropertiesForKeys(url, keys, ptr::null_mut());
    if props.is_null() {
        return None;
    }
    let _props = OwnedCF(props);
    Some((
        cf_dict_bool_by_cfkey(props, kCFURLVolumeIsBrowsableKey).unwrap_or(false),
        cf_dict_bool_by_cfkey(props, kCFURLVolumeIsLocalKey).unwrap_or(true),
    ))
}

/// Mounted filesystems with fresh sizes and the browsable/local flags `disk.rs` filters on.
///
/// Replaces `sysinfo::Disks` on macOS, which listed the same mounts (`getfsstat`) but asked
/// CoreFoundation for capacity too. Listing uses `MNT_NOWAIT`, so a hung network or FUSE
/// mount cannot block it; sizes come from a separate `statfs` only for mounts that are local
/// and browsable, because `MNT_NOWAIT`'s cached figures may be stale.
pub fn get_mounts() -> Vec<MacMount> {
    let mut out = Vec::new();
    // SAFETY: `getfsstat` writes at most `bufsize` bytes into a buffer sized for `count`
    // entries, and only the `n` it reports are read. The CF array borrows two global
    // constants (NULL callbacks: nothing to retain), and every CF object created here is
    // released through `OwnedCF`.
    unsafe {
        let count = libc::getfsstat(ptr::null_mut(), 0, libc::MNT_NOWAIT);
        if count < 1 {
            return out;
        }
        let mut buf: Vec<libc::statfs> = Vec::with_capacity(count as usize);
        let bufsize = count * std::mem::size_of::<libc::statfs>() as libc::c_int;
        let n = libc::getfsstat(buf.as_mut_ptr(), bufsize, libc::MNT_NOWAIT);
        if n < 1 {
            return out;
        }
        buf.set_len(n.min(count) as usize);

        let key_values = [kCFURLVolumeIsBrowsableKey, kCFURLVolumeIsLocalKey];
        let keys = CFArrayCreate(
            kCFAllocatorDefault,
            key_values.as_ptr(),
            key_values.len() as isize,
            ptr::null(),
        );
        if keys.is_null() {
            return out;
        }
        let _keys = OwnedCF(keys);

        for entry in &buf {
            let mount = std::ffi::CStr::from_ptr(entry.f_mntonname.as_ptr());
            let Some((browsable, local)) = volume_browsable_local(mount.to_bytes(), keys) else {
                continue;
            };
            let fs_type = std::ffi::CStr::from_ptr(entry.f_fstypename.as_ptr())
                .to_string_lossy()
                .into_owned();
            let (mut total_bytes, mut avail_bytes) = (0, 0);
            if browsable && local {
                let mut st: libc::statfs = std::mem::zeroed();
                if libc::statfs(mount.as_ptr(), &mut st) == 0 {
                    let bsize = st.f_bsize as u64;
                    total_bytes = st.f_blocks.saturating_mul(bsize);
                    avail_bytes = st.f_bavail.saturating_mul(bsize);
                }
            }
            out.push(MacMount {
                mount_point: mount.to_string_lossy().into_owned(),
                fs_type,
                total_bytes,
                avail_bytes,
                browsable,
                local,
            });
        }
    }
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
const K_AUDIO_HARDWARE_PROPERTY_DEFAULT_OUTPUT_DEVICE: u32 = 0x644f_7574; // 'dOut'
const K_AUDIO_DEVICE_PROPERTY_STREAMS: u32 = 0x7374_6d23; // 'stm#'
const K_AUDIO_DEVICE_PROPERTY_VOLUME_SCALAR: u32 = 0x766f_6c6d; // 'volm'
const K_AUDIO_HARDWARE_SERVICE_DEVICE_PROPERTY_VIRTUAL_MAIN_VOLUME: u32 = 0x766d_7663; // 'vmvc'
const K_AUDIO_OBJECT_PROPERTY_NAME: u32 = 0x6c6e_616d; // 'lnam'
const K_AUDIO_OBJECT_PROPERTY_SCOPE_GLOBAL: u32 = 0x676c_6f62; // 'glob'
const K_AUDIO_OBJECT_PROPERTY_SCOPE_OUTPUT: u32 = 0x6f75_7470; // 'outp'
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

/// Read the scalar output volume (`0.0..=1.0`) for a CoreAudio output device, rounded to an
/// integer percentage (`0..=100`).
unsafe fn get_audio_device_volume_pct(device_id: u32) -> Option<u32> {
    for (selector, element) in [
        (
            K_AUDIO_HARDWARE_SERVICE_DEVICE_PROPERTY_VIRTUAL_MAIN_VOLUME,
            0,
        ),
        (K_AUDIO_DEVICE_PROPERTY_VOLUME_SCALAR, 0),
        (K_AUDIO_DEVICE_PROPERTY_VOLUME_SCALAR, 1),
        (K_AUDIO_DEVICE_PROPERTY_VOLUME_SCALAR, 2),
    ] {
        let addr = AudioObjectPropertyAddress {
            selector,
            scope: K_AUDIO_OBJECT_PROPERTY_SCOPE_OUTPUT,
            element,
        };
        let mut vol: f32 = 0.0;
        let mut size = std::mem::size_of::<f32>() as u32;
        if AudioObjectGetPropertyData(
            device_id,
            &addr,
            0,
            ptr::null(),
            &mut size,
            &mut vol as *mut f32 as *mut c_void,
        ) == 0
            && (0.0..=1.0).contains(&vol)
        {
            return Some((vol * 100.0).round() as u32);
        }
    }
    None
}

/// Enumerate CoreAudio output device names, excluding input-only microphones, and place the
/// active default output device first with its volume percentage (e.g.
/// `"Realtek USB2.0 Audio (25%) *"`).
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

        // Query the active default output device ID (`'dOut'`).
        let default_out_addr = AudioObjectPropertyAddress {
            selector: K_AUDIO_HARDWARE_PROPERTY_DEFAULT_OUTPUT_DEVICE,
            scope: K_AUDIO_OBJECT_PROPERTY_SCOPE_GLOBAL,
            element: K_AUDIO_OBJECT_PROPERTY_ELEMENT_MAIN,
        };
        let mut default_out_id: u32 = 0;
        let mut out_id_size = std::mem::size_of::<u32>() as u32;
        let _ = AudioObjectGetPropertyData(
            K_AUDIO_OBJECT_SYSTEM_OBJECT,
            &default_out_addr,
            0,
            ptr::null(),
            &mut out_id_size,
            &mut default_out_id as *mut u32 as *mut c_void,
        );

        let name_addr = AudioObjectPropertyAddress {
            selector: K_AUDIO_OBJECT_PROPERTY_NAME,
            scope: K_AUDIO_OBJECT_PROPERTY_SCOPE_GLOBAL,
            element: K_AUDIO_OBJECT_PROPERTY_ELEMENT_MAIN,
        };
        let out_streams_addr = AudioObjectPropertyAddress {
            selector: K_AUDIO_DEVICE_PROPERTY_STREAMS,
            scope: K_AUDIO_OBJECT_PROPERTY_SCOPE_OUTPUT,
            element: K_AUDIO_OBJECT_PROPERTY_ELEMENT_MAIN,
        };

        let mut default_entry: Option<String> = None;

        for &device_id in &device_ids {
            // Skip input-only devices (microphones, webcam mics) that have 0 output streams.
            let mut stream_size: u32 = 0;
            if AudioObjectGetPropertyDataSize(
                device_id,
                &out_streams_addr,
                0,
                ptr::null(),
                &mut stream_size,
            ) == 0
                && stream_size == 0
                && device_id != default_out_id
            {
                continue;
            }

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
                    if !name.is_empty() {
                        if device_id == default_out_id && default_out_id != 0 {
                            let formatted = match get_audio_device_volume_pct(device_id) {
                                Some(pct) => format!("{name} ({pct}%) *"),
                                None => format!("{name} *"),
                            };
                            default_entry = Some(formatted);
                        } else if !names.contains(&name) {
                            names.push(name);
                        }
                    }
                }
                CFRelease(name_ref as CFTypeRef);
            }
        }

        if let Some(def) = default_entry {
            names.insert(0, def);
        }
    }
    names
}

// ─── CoreGraphics & IOMobileFramebuffer — Displays & Brightness ───────────────

#[repr(C)]
#[derive(Clone, Copy)]
struct CGSize {
    width: f64,
    height: f64,
}

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
    fn CGDisplayModeGetWidth(mode: *mut c_void) -> usize;
    fn CGDisplayModeGetHeight(mode: *mut c_void) -> usize;
    fn CGDisplayModeGetPixelWidth(mode: *mut c_void) -> usize;
    fn CGDisplayModeGetPixelHeight(mode: *mut c_void) -> usize;
    fn CGDisplayModeGetRefreshRate(mode: *mut c_void) -> f64;
    fn CGDisplayModeRelease(mode: *mut c_void);
    fn CGDisplayVendorNumber(display: u32) -> u32;
    fn CGDisplayModelNumber(display: u32) -> u32;
    fn CGDisplaySerialNumber(display: u32) -> u32;
    fn CGDisplayIsBuiltin(display: u32) -> i32;
    fn CGDisplayIsMain(display: u32) -> i32;
    fn CGDisplayScreenSize(display: u32) -> CGSize;
}

/// Display metadata read from an `IOMobileFramebuffer` service in IOKit on Apple Silicon.
#[derive(Debug, Clone, Default)]
struct IoMfbDisplay {
    product_name: Option<String>,
    product_id: Option<u32>,
    serial_number: Option<u32>,
    external: bool,
    hdr: bool,
    brightness_cur: Option<u64>,
    brightness_max: Option<u64>,
}

/// Read a boolean out of a `CFDictionary` by string key.
unsafe fn cf_dict_bool(dict: CFDictionaryRef, key: &str) -> Option<bool> {
    if dict.is_null() {
        return None;
    }
    let val = with_cfstring(key, |k| CFDictionaryGetValue(dict, k));
    if val.is_null() {
        return None;
    }
    let tid = CFGetTypeID(val);
    if tid == CFBooleanGetTypeID() {
        Some(CFBooleanGetValue(val as CFBooleanRef))
    } else if tid == CFNumberGetTypeID() {
        let mut n: i64 = 0;
        CFNumberGetValue(
            val as CFNumberRef,
            kCFNumberSInt64Type,
            &mut n as *mut i64 as *mut c_void,
        )
        .then_some(n != 0)
    } else {
        None
    }
}

/// Enumerate `IOMobileFramebuffer` IOKit services to retrieve product names, HDR support,
/// and framebuffer brightness levels on Apple Silicon Macs (where `IODisplayConnect` does
/// not exist).
unsafe fn enumerate_iomfb_displays() -> Vec<IoMfbDisplay> {
    let mut out = Vec::new();
    let cls = CString::new("IOMobileFramebuffer").unwrap();
    let matching = IOServiceMatching(cls.as_ptr());
    if matching.is_null() {
        return out;
    }
    let mut iter: IOIterator = MACH_PORT_NULL;
    if IOServiceGetMatchingServices(IOKIT_MAIN_PORT, matching as CFDictionaryRef, &mut iter) != 0 {
        return out;
    }
    loop {
        let service = IOIteratorNext(iter);
        if service == MACH_PORT_NULL {
            break;
        }
        let external = iokit_property_as_bool(service, "external").unwrap_or(false);
        let brightness_cur = iokit_property_as_u64(service, "IOMFBBrightnessLevel");
        let brightness_max = iokit_property_as_u64(service, "BLNitsCap");
        let mut entry = IoMfbDisplay {
            external,
            brightness_cur,
            brightness_max,
            ..Default::default()
        };

        let attrs = with_cfstring("DisplayAttributes", |k| {
            IORegistryEntryCreateCFProperty(service, k, kCFAllocatorDefault, 0)
        });
        if !attrs.is_null() {
            let _owned = OwnedCF(attrs);
            if CFGetTypeID(attrs) == CFDictionaryGetTypeID() {
                let dict = attrs as CFDictionaryRef;
                entry.hdr = cf_dict_bool(dict, "SupportsHDRStaticMetadataType1") == Some(true)
                    || cf_dict_bool(dict, "SupportsPQEOTF") == Some(true)
                    || cf_dict_bool(dict, "SupportsHLGEOTF") == Some(true);

                let prod = with_cfstring("ProductAttributes", |k| CFDictionaryGetValue(dict, k));
                if !prod.is_null() && CFGetTypeID(prod) == CFDictionaryGetTypeID() {
                    let pdict = prod as CFDictionaryRef;
                    entry.product_name = cf_dict_string(pdict, "ProductName");
                    entry.product_id = cf_dict_u64(pdict, "ProductID").map(|v| v as u32);
                    entry.serial_number = cf_dict_u64(pdict, "SerialNumber").map(|v| v as u32);
                }
            }
        }
        IOObjectRelease(service);
        out.push(entry);
    }
    IOObjectRelease(iter);
    out
}

/// Format a macOS display entry with physical pixel dimensions, optional integer/fractional
/// UI scale factor (`@ 2x`), diagonal screen size in inches (`in 32"`), refresh rate,
/// `[Built-in]` / `[External]` + `HDR` tags, and primary display marker `*`.
#[allow(clippy::too_many_arguments)]
pub fn format_macos_display(
    name: &str,
    px_w: usize,
    px_h: usize,
    ui_w: usize,
    ui_h: usize,
    diagonal_in: Option<u32>,
    refresh_hz: f64,
    builtin: bool,
    hdr: bool,
    is_main: bool,
    multi_display: bool,
) -> String {
    let scale_str = if ui_w > 0 && px_w > ui_w {
        let ratio = px_w as f64 / ui_w as f64;
        if (ratio - ratio.round()).abs() < 0.05 {
            format!(" @ {}x", ratio.round() as u32)
        } else {
            let _ = ui_h;
            format!(" @ {ratio:.2}x")
        }
    } else {
        String::new()
    };

    let size_str = match diagonal_in.filter(|&d| (5..=120).contains(&d)) {
        Some(d) => format!(" in {d}\""),
        None => String::new(),
    };

    let rr_str = if refresh_hz > 0.0 {
        let rr = crate::display::format_refresh_rate(refresh_hz);
        if !scale_str.is_empty() || !size_str.is_empty() {
            format!(", {rr}Hz")
        } else {
            format!(" @ {rr}Hz")
        }
    } else {
        String::new()
    };

    let loc = if builtin { "Built-in" } else { "External" };
    let tags = if hdr {
        format!("[{loc}, HDR]")
    } else {
        format!("[{loc}]")
    };

    let main_suffix = if is_main && multi_display { " *" } else { "" };

    format!("{name} ({px_w}x{px_h}{scale_str}{size_str}{rr_str}) {tags}{main_suffix}")
}

/// Try to find a display name via IODisplayConnect by matching vendor+model numbers (Intel Macs).
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
        let v = iokit_property_as_u64(service, "DisplayVendorID").unwrap_or(0) as u32;
        let m = iokit_property_as_u64(service, "DisplayProductID").unwrap_or(0) as u32;
        if v == vendor && m == model {
            result = iokit_property_as_string(service, "DisplayProductName");
            IOObjectRelease(service);
            break;
        }
        IOObjectRelease(service);
    }
    IOObjectRelease(iter);
    result
}

/// Return human-readable display descriptions on macOS, combining CoreGraphics mode metrics
/// with `IOMobileFramebuffer` (Apple Silicon) or `IODisplayConnect` (Intel) attributes.
pub fn get_displays() -> Vec<String> {
    let mut out = Vec::new();
    unsafe {
        let mut count: u32 = 0;
        if CGGetActiveDisplayList(0, ptr::null_mut(), &mut count) != 0 || count == 0 {
            return out;
        }
        let mut ids = vec![0u32; count as usize];
        if CGGetActiveDisplayList(count, ids.as_mut_ptr(), &mut count) != 0 {
            return out;
        }
        let multi = ids.len() > 1;
        let mut mfb_list = enumerate_iomfb_displays();

        for (i, &id) in ids.iter().enumerate() {
            let fallback_w = CGDisplayPixelsWide(id);
            let fallback_h = CGDisplayPixelsHigh(id);
            let mode = CGDisplayCopyDisplayMode(id);
            let (px_w, px_h, ui_w, ui_h, refresh) = if mode.is_null() {
                (fallback_w, fallback_h, fallback_w, fallback_h, 0.0)
            } else {
                let pw = CGDisplayModeGetPixelWidth(mode);
                let ph = CGDisplayModeGetPixelHeight(mode);
                let uw = CGDisplayModeGetWidth(mode);
                let uh = CGDisplayModeGetHeight(mode);
                let r = CGDisplayModeGetRefreshRate(mode);
                CGDisplayModeRelease(mode);
                (
                    if pw > 0 { pw } else { fallback_w },
                    if ph > 0 { ph } else { fallback_h },
                    if uw > 0 { uw } else { fallback_w },
                    if uh > 0 { uh } else { fallback_h },
                    r,
                )
            };

            let vendor = CGDisplayVendorNumber(id);
            let model = CGDisplayModelNumber(id);
            let serial = CGDisplaySerialNumber(id);
            let builtin = CGDisplayIsBuiltin(id) != 0;
            let is_main = CGDisplayIsMain(id) != 0;
            let size_mm = CGDisplayScreenSize(id);
            let diagonal_in = if size_mm.width > 0.0 && size_mm.height > 0.0 {
                Some((size_mm.width.hypot(size_mm.height) / 25.4).round() as u32)
            } else {
                None
            };

            // Match against IOMobileFramebuffer entries by (serial, product_id, external).
            let mfb_idx = mfb_list
                .iter()
                .position(|m| {
                    m.external == !builtin && serial != 0 && m.serial_number == Some(serial)
                })
                .or_else(|| {
                    mfb_list.iter().position(|m| {
                        m.external == !builtin && model != 0 && m.product_id == Some(model)
                    })
                })
                .or_else(|| mfb_list.iter().position(|m| m.external == !builtin));

            let mfb = mfb_idx.map(|idx| mfb_list.remove(idx));
            let hdr = mfb.as_ref().is_some_and(|m| m.hdr);
            let name = mfb
                .and_then(|m| m.product_name)
                .or_else(|| iokit_display_name(vendor, model))
                .unwrap_or_else(|| {
                    if builtin {
                        "Color LCD".to_string()
                    } else {
                        format!("Display {}", i + 1)
                    }
                });

            out.push(format_macos_display(
                &name,
                px_w,
                px_h,
                ui_w,
                ui_h,
                diagonal_in,
                refresh,
                builtin,
                hdr,
                is_main,
                multi,
            ));
        }
    }
    out
}

/// Detect display brightness on macOS, accounting for clamshell mode (lid closed with only
/// external displays active).
///
/// - When an active built-in display is present in `CGGetActiveDisplayList`, reads
///   `AppleARMBacklight` (`(value, min, max)`).
/// - When no built-in display is active (e.g. a MacBook in clamshell mode or a desktop Mac),
///   `AppleARMBacklight` still exists in IOKit with a stale slider reading (e.g. `50%`) for
///   the sleeping internal panel; instead, reads `IOMobileFramebuffer`'s
///   `IOMFBBrightnessLevel` / `BLNitsCap` for the active external display.
pub fn get_macos_brightness() -> Option<String> {
    unsafe {
        let mut count: u32 = 0;
        let has_active_list =
            CGGetActiveDisplayList(0, ptr::null_mut(), &mut count) == 0 && count > 0;
        let mut any_builtin_active = true;
        if has_active_list {
            let mut ids = vec![0u32; count as usize];
            if CGGetActiveDisplayList(count, ids.as_mut_ptr(), &mut count) == 0 {
                any_builtin_active = ids.iter().any(|&id| CGDisplayIsBuiltin(id) != 0);
            }
        }

        if any_builtin_active {
            if let Some((value, min, max)) = get_backlight_brightness() {
                let span = max.checked_sub(min)?;
                let level = value.checked_sub(min)?;
                if span > 0 && level >= 0 {
                    let pct = (level as f64 / span as f64 * 100.0).round() as u64;
                    return Some(format!("{pct}%"));
                }
            }
        }

        // Clamshell mode or external-only display: inspect active IOMobileFramebuffer nodes.
        for mfb in enumerate_iomfb_displays() {
            if mfb.external != !any_builtin_active {
                continue;
            }
            if let (Some(cur), Some(max)) = (mfb.brightness_cur, mfb.brightness_max) {
                if max > 0 && cur > 0 {
                    let pct = ((cur as f64 / max as f64) * 100.0)
                        .round()
                        .clamp(0.0, 100.0) as u64;
                    let loc = if mfb.external { "External" } else { "Built-in" };
                    return match mfb.product_name {
                        Some(name) => Some(format!("{pct}% ({name}) [{loc}]")),
                        None => Some(format!("{pct}% [{loc}]")),
                    };
                }
            }
        }
        None
    }
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

// ─── IOKit & IOBluetooth — Bluetooth state & connected devices ───────────────

#[link(name = "IOBluetooth", kind = "framework")]
extern "C" {}

/// Return `(power_on, chipset, connected_devices)` from `IOBluetoothHCIController`,
/// `IODeviceTree:/product` (`bluetooth-lea2` / `bluetooth-le`), and `IOBluetoothDevice`
/// (`pairedDevices`).
///
/// The power state is `None` when the controller does not publish
/// `BluetoothControllerPowerIsOn`, which is the case on macOS 26 and later (the service there
/// carries only `BluetoothTransportConnected`). Unknown is reported as unknown: until v0.20.16
/// it was folded into `false`, so a Mac with Bluetooth on and devices connected read `Off`.
pub fn get_bluetooth_state() -> Option<(Option<bool>, Option<String>, Vec<String>)> {
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
        let power = iokit_property_as_bool(service, "BluetoothControllerPowerIsOn");
        let mut chipset = iokit_property_as_string(service, "HardwareTransportCurrentSetting")
            .or_else(|| iokit_property_as_string(service, "ProductName"))
            .or_else(|| iokit_property_as_string(service, "ChipsetString"));
        IOObjectRelease(service);

        if chipset.is_none() {
            let prod_path = b"IODeviceTree:/product\0";
            let prod = IORegistryEntryFromPath(IOKIT_MAIN_PORT, prod_path.as_ptr() as *const i8);
            if prod != MACH_PORT_NULL {
                if iokit_property_as_u64(prod, "bluetooth-lea2") == Some(1) {
                    chipset = Some("Bluetooth 5.2+".to_string());
                } else if iokit_property_as_u64(prod, "bluetooth-le") == Some(1) {
                    chipset = Some("Bluetooth 4.0+".to_string());
                }
                IOObjectRelease(prod);
            }
        }

        // Enumerate connected Bluetooth devices via `[IOBluetoothDevice pairedDevices]`.
        let mut connected = Vec::new();
        let dev_cls = objc_getClass(c"IOBluetoothDevice".as_ptr());
        if !dev_cls.is_null() {
            let responds_sel = sel_registerName(c"respondsToSelector:".as_ptr());
            let paired_sel = sel_registerName(c"pairedDevices".as_ptr());
            if objc_msg_send_bool_sel(dev_cls, responds_sel, paired_sel) {
                let devices_arr = objc_msg_send_id(dev_cls, paired_sel) as CFArrayRef;
                if !devices_arr.is_null() {
                    let is_conn_sel = sel_registerName(c"isConnected".as_ptr());
                    let name_sel = sel_registerName(c"name".as_ptr());
                    let bat_sel = sel_registerName(c"batteryPercentSingle".as_ptr());
                    let count = CFArrayGetCount(devices_arr);
                    for i in 0..count {
                        let dev = CFArrayGetValueAtIndex(devices_arr, i) as *mut c_void;
                        if dev.is_null() {
                            continue;
                        }
                        if objc_msg_send_bool_sel(dev, responds_sel, is_conn_sel)
                            && objc_msg_send_bool(dev, is_conn_sel)
                            && objc_msg_send_bool_sel(dev, responds_sel, name_sel)
                        {
                            let name_ns = objc_msg_send_id(dev, name_sel) as CFStringRef;
                            if let Some(name) = cf_string_to_rust(name_ns) {
                                // `batteryPercentSingle` is a private IOBluetoothDevice selector;
                                // guard with `respondsToSelector:` so devices or OS releases that
                                // lack it never raise `NSInvalidArgumentException`.
                                let bat = if objc_msg_send_bool_sel(dev, responds_sel, bat_sel) {
                                    objc_msg_send_u8(dev, bat_sel)
                                } else {
                                    0
                                };
                                let entry = if (1..=100).contains(&bat) {
                                    format!("{name} ({bat}%)")
                                } else {
                                    name
                                };
                                if !connected.contains(&entry) {
                                    connected.push(entry);
                                }
                            }
                        }
                    }
                }
            }
        }

        Some((power, chipset, connected))
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
    /// Whether a power adapter is connected; None if the property is absent.
    pub external_connected: Option<bool>,
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
        let external_connected = iokit_property_as_bool(service, "ExternalConnected");
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
            external_connected,
            time_remaining_mins,
            vendor,
            model,
        })
    }
}

// ─── CoreFoundation — Preferences (theme, accent, cursor, fonts) ─────────────

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

/// Read the macOS window accent color (`AppleAccentColor`) from the global domain.
pub fn get_macos_accent_color() -> Option<i64> {
    unsafe {
        with_cfstring("AppleAccentColor", |key| {
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
            if CFGetTypeID(val) == CFNumberGetTypeID() {
                let mut out: i64 = 0;
                CFNumberGetValue(
                    val as CFNumberRef,
                    kCFNumberSInt64Type,
                    &mut out as *mut i64 as *mut c_void,
                )
                .then_some(out)
            } else if CFGetTypeID(val) == CFStringGetTypeID() {
                cf_string_to_rust(val as CFStringRef)?
                    .trim()
                    .parse::<i64>()
                    .ok()
            } else {
                None
            }
        })
    }
}

/// Read a `f64` out of a `CFDictionary` by string key.
unsafe fn cf_dict_f64(dict: CFDictionaryRef, key: &str) -> Option<f64> {
    if dict.is_null() {
        return None;
    }
    let val = with_cfstring(key, |k| CFDictionaryGetValue(dict, k));
    if val.is_null() || CFGetTypeID(val) != CFNumberGetTypeID() {
        return None;
    }
    let mut out: f64 = 0.0;
    CFNumberGetValue(
        val as CFNumberRef,
        kCFNumberFloat64Type,
        &mut out as *mut f64 as *mut c_void,
    )
    .then_some(out)
}

/// Classify a normalized `(r, g, b)` color triple (`0.0..=1.0`) into a human-readable color
/// name or `#RRGGBB` hex string.
pub fn classify_cursor_rgb(r: f64, g: f64, b: f64) -> String {
    let ri = (r.clamp(0.0, 1.0) * 255.0).round() as u8;
    let gi = (g.clamp(0.0, 1.0) * 255.0).round() as u8;
    let bi = (b.clamp(0.0, 1.0) * 255.0).round() as u8;
    match (ri, gi, bi) {
        (0..=15, 0..=15, 0..=15) => "Black".to_string(),
        (240..=255, 240..=255, 240..=255) => "White".to_string(),
        _ => format!("#{ri:02X}{gi:02X}{bi:02X}"),
    }
}

/// Pure helper: format macOS cursor fill, outline, and size multiplier (`1.0` = `32px`).
pub fn format_macos_cursor(
    fill_rgb: Option<(f64, f64, f64)>,
    outline_rgb: Option<(f64, f64, f64)>,
    size_mult: Option<f64>,
) -> String {
    let fill = fill_rgb
        .map(|(r, g, b)| classify_cursor_rgb(r, g, b))
        .unwrap_or_else(|| "Black".to_string());
    let outline = outline_rgb
        .map(|(r, g, b)| classify_cursor_rgb(r, g, b))
        .unwrap_or_else(|| "White".to_string());
    let px = (size_mult.unwrap_or(1.0).clamp(0.5, 16.0) * 32.0).round() as u32;
    format!("Fill - {fill}, Outline - {outline} ({px}px)")
}

/// Read macOS cursor customization from `com.apple.universalaccess` preferences (`cursorFill`,
/// `cursorOutline`, `mouseDriverCursorSize`), defaulting to `Fill - Black, Outline - White (32px)`.
pub fn get_macos_cursor() -> String {
    unsafe {
        let domain = with_cfstring_owned("com.apple.universalaccess");
        let app_id = domain.0 as CFStringRef;

        let read_rgb = |key_name: &str| -> Option<(f64, f64, f64)> {
            with_cfstring(key_name, |k| {
                let val = CFPreferencesCopyValue(
                    k,
                    app_id,
                    kCFPreferencesCurrentUser,
                    kCFPreferencesAnyHost,
                );
                if val.is_null() {
                    return None;
                }
                let _owned = OwnedCF(val);
                if CFGetTypeID(val) != CFDictionaryGetTypeID() {
                    return None;
                }
                let d = val as CFDictionaryRef;
                Some((
                    cf_dict_f64(d, "red")?,
                    cf_dict_f64(d, "green")?,
                    cf_dict_f64(d, "blue")?,
                ))
            })
        };

        let size_mult = with_cfstring("mouseDriverCursorSize", |k| {
            let val =
                CFPreferencesCopyValue(k, app_id, kCFPreferencesCurrentUser, kCFPreferencesAnyHost);
            if val.is_null() {
                return None;
            }
            let _owned = OwnedCF(val);
            if CFGetTypeID(val) != CFNumberGetTypeID() {
                return None;
            }
            let mut out: f64 = 1.0;
            CFNumberGetValue(
                val as CFNumberRef,
                kCFNumberFloat64Type,
                &mut out as *mut f64 as *mut c_void,
            )
            .then_some(out)
        });

        format_macos_cursor(read_rgb("cursorFill"), read_rgb("cursorOutline"), size_mult)
    }
}

/// Pure helper: format the macOS system and user font family names.
pub fn format_macos_fonts(sys_font: Option<&str>, user_font: Option<&str>) -> String {
    let clean_sys = sys_font.map(str::trim).filter(|s| !s.is_empty());
    let clean_usr = user_font.map(str::trim).filter(|s| !s.is_empty());
    match (clean_sys, clean_usr) {
        (Some(s), Some(u)) => format!("{s} [System], {u} [User]"),
        (Some(s), None) => s.to_string(),
        (None, Some(u)) => u.to_string(),
        (None, None) => "San Francisco".to_string(),
    }
}

/// Query macOS system UI font and user font via `NSFont`.
pub fn get_macos_fonts() -> String {
    unsafe {
        let cls = objc_getClass(c"NSFont".as_ptr());
        if cls.is_null() {
            return "San Francisco".to_string();
        }
        let sys_sel = sel_registerName(c"systemFontOfSize:".as_ptr());
        let usr_sel = sel_registerName(c"userFontOfSize:".as_ptr());
        let fam_sel = sel_registerName(c"familyName".as_ptr());

        let sys_font_obj = objc_msg_send_id_f64(cls, sys_sel, 0.0);
        let sys_name = if !sys_font_obj.is_null() {
            cf_string_to_rust(objc_msg_send_id(sys_font_obj, fam_sel) as CFStringRef)
        } else {
            None
        };

        let usr_font_obj = objc_msg_send_id_f64(cls, usr_sel, 0.0);
        let usr_name = if !usr_font_obj.is_null() {
            cf_string_to_rust(objc_msg_send_id(usr_font_obj, fam_sel) as CFStringRef)
        } else {
            None
        };

        format_macos_fonts(sys_name.as_deref(), usr_name.as_deref())
    }
}

/// Resolve the executable path of a running process by PID via `proc_pidpath` (`libSystem`).
pub fn get_proc_pidpath(pid: i32) -> Option<String> {
    extern "C" {
        fn proc_pidpath(pid: i32, buffer: *mut c_void, buffersize: u32) -> i32;
    }
    if pid <= 0 {
        return None;
    }
    let mut buf = [0u8; 4096];
    // SAFETY: `buf` is a writable 4096-byte (`PROC_PIDPATHINFO_MAXSIZE`) buffer.
    let len = unsafe { proc_pidpath(pid, buf.as_mut_ptr() as *mut c_void, buf.len() as u32) };
    if len <= 0 {
        return None;
    }
    let slice = &buf[..(len as usize).min(buf.len())];
    std::str::from_utf8(slice)
        .ok()
        .map(|s| s.trim_end_matches('\0').to_string())
        .filter(|s| !s.is_empty())
}

// ─── AppKit — Wallpaper ──────────────────────────────────────────────────────

#[link(name = "AppKit", kind = "framework")]
extern "C" {}

/// Read the current desktop wallpaper image path via NSWorkspace / AppKit.
pub fn get_macos_wallpaper() -> Option<String> {
    // SAFETY: Each selector is invoked through a non-variadic function pointer matching
    // its exact Objective-C signature (`id (*)(id, SEL)` or `id (*)(id, SEL, id)`).
    unsafe {
        let ws_cls = objc_getClass(CString::new("NSWorkspace").unwrap().as_ptr());
        let screen_cls = objc_getClass(CString::new("NSScreen").unwrap().as_ptr());
        if ws_cls.is_null() || screen_cls.is_null() {
            return None;
        }
        let shared_sel = sel_registerName(CString::new("sharedWorkspace").unwrap().as_ptr());
        let ws = objc_msg_send_id(ws_cls, shared_sel);
        if ws.is_null() {
            return None;
        }
        let main_sel = sel_registerName(CString::new("mainScreen").unwrap().as_ptr());
        let screen = objc_msg_send_id(screen_cls, main_sel);
        if screen.is_null() {
            return None;
        }
        let wp_sel = sel_registerName(CString::new("desktopImageURLForScreen:").unwrap().as_ptr());
        let url = objc_msg_send_id_id(ws, wp_sel, screen);
        if url.is_null() {
            return None;
        }
        let path_sel = sel_registerName(CString::new("path").unwrap().as_ptr());
        let path_ns = objc_msg_send_id(url, path_sel) as CFStringRef;
        if let Some(path) = cf_string_to_rust(path_ns) {
            if !path.is_empty() {
                return Some(path);
            }
        }
        None
    }
}

// ─── CoreWLAN — Wi-Fi SSID, PHY mode, band, security, RSSI, and link rate ────
//
// The SystemConfiguration dynamic store key `State:/Network/Interface/*/AirPort`
// is not populated on macOS 15 Sequoia, so we use CoreWLAN for SSID, PHY mode,
// channel band, security, RSSI, and transmit rate. `NSString` is toll-free bridged
// with `CFStringRef`.

#[link(name = "CoreWLAN", kind = "framework")]
extern "C" {}

#[link(name = "objc")]
extern "C" {
    fn objc_getClass(name: *const i8) -> *mut c_void;
    fn sel_registerName(str: *const i8) -> *mut c_void;
    fn objc_msgSend();
}

/// Invoke a zero-argument Objective-C selector returning an object pointer (`id`).
///
/// # Safety
/// `self_` must be a valid Objective-C object or class pointer and `op` must be a valid
/// selector with signature `id (*)(id, SEL)`. Never call `objc_msgSend` through a C
/// variadic prototype: on `aarch64-apple-darwin` variadic arguments are placed on the
/// stack instead of registers, and redeclaring `objc_msgSend` with multiple clashing
/// `#[link_name]` signatures is unsound in Rust/LLVM.
unsafe fn objc_msg_send_id(self_: *mut c_void, op: *mut c_void) -> *mut c_void {
    type FnType = unsafe extern "C" fn(*mut c_void, *mut c_void) -> *mut c_void;
    // SAFETY: `objc_msgSend` is cast to the exact non-variadic ABI expected by the
    // Objective-C runtime for `(id, SEL) -> id`.
    let f: FnType = unsafe { std::mem::transmute(objc_msgSend as *const ()) };
    unsafe { f(self_, op) }
}

/// Invoke a one-object-argument Objective-C selector returning an object pointer (`id`).
///
/// # Safety
/// `self_` and `arg` must be valid Objective-C pointers and `op` must have signature
/// `id (*)(id, SEL, id)`.
unsafe fn objc_msg_send_id_id(
    self_: *mut c_void,
    op: *mut c_void,
    arg: *mut c_void,
) -> *mut c_void {
    type FnType = unsafe extern "C" fn(*mut c_void, *mut c_void, *mut c_void) -> *mut c_void;
    // SAFETY: `objc_msgSend` is cast to the exact non-variadic ABI for `(id, SEL, id) -> id`.
    let f: FnType = unsafe { std::mem::transmute(objc_msgSend as *const ()) };
    unsafe { f(self_, op, arg) }
}

/// Invoke a one-`CGFloat` (`f64`) Objective-C selector returning an object pointer (`id`).
///
/// # Safety
/// `self_` must be a valid Objective-C pointer and `op` must have signature
/// `id (*)(id, SEL, CGFloat)`.
unsafe fn objc_msg_send_id_f64(self_: *mut c_void, op: *mut c_void, arg: f64) -> *mut c_void {
    type FnType = unsafe extern "C" fn(*mut c_void, *mut c_void, f64) -> *mut c_void;
    // SAFETY: `objc_msgSend` is cast to the exact non-variadic ABI for `(id, SEL, f64) -> id`.
    let f: FnType = unsafe { std::mem::transmute(objc_msgSend as *const ()) };
    unsafe { f(self_, op, arg) }
}

/// Invoke a zero-argument Objective-C selector returning `double` (`f64`).
///
/// # Safety
/// `self_` must be a valid Objective-C object pointer and `op` must have signature
/// `double (*)(id, SEL)` (valid on both `aarch64` and `x86_64`, where `objc_msgSend_fpret`
/// is only for `long double`).
unsafe fn objc_msg_send_f64(self_: *mut c_void, op: *mut c_void) -> f64 {
    type FnType = unsafe extern "C" fn(*mut c_void, *mut c_void) -> f64;
    // SAFETY: `objc_msgSend` is cast to the exact non-variadic ABI for `(id, SEL) -> f64`.
    let f: FnType = unsafe { std::mem::transmute(objc_msgSend as *const ()) };
    unsafe { f(self_, op) }
}

/// Invoke a zero-argument Objective-C selector returning `NSInteger` (`isize`).
///
/// # Safety
/// `self_` must be a valid Objective-C object pointer and `op` must have signature
/// `NSInteger (*)(id, SEL)`.
unsafe fn objc_msg_send_isize(self_: *mut c_void, op: *mut c_void) -> isize {
    type FnType = unsafe extern "C" fn(*mut c_void, *mut c_void) -> isize;
    // SAFETY: `objc_msgSend` is cast to the exact non-variadic ABI for `(id, SEL) -> isize`.
    let f: FnType = unsafe { std::mem::transmute(objc_msgSend as *const ()) };
    unsafe { f(self_, op) }
}

/// Invoke a zero-argument Objective-C selector returning `BOOL` (`u8` / `bool`).
///
/// # Safety
/// `self_` must be a valid Objective-C object pointer and `op` must have signature
/// `BOOL (*)(id, SEL)`.
unsafe fn objc_msg_send_bool(self_: *mut c_void, op: *mut c_void) -> bool {
    type FnType = unsafe extern "C" fn(*mut c_void, *mut c_void) -> u8;
    // SAFETY: `objc_msgSend` is cast to the exact non-variadic ABI for `(id, SEL) -> u8`.
    let f: FnType = unsafe { std::mem::transmute(objc_msgSend as *const ()) };
    unsafe { f(self_, op) != 0 }
}

/// Invoke a one-selector Objective-C method returning `BOOL` (`u8` / `bool`), e.g.
/// `[obj respondsToSelector:sel]`.
///
/// # Safety
/// `self_` must be a valid Objective-C object or class pointer, `op` must have signature
/// `BOOL (*)(id, SEL, SEL)`, and `sel` must be a valid `SEL`.
unsafe fn objc_msg_send_bool_sel(self_: *mut c_void, op: *mut c_void, sel: *mut c_void) -> bool {
    type FnType = unsafe extern "C" fn(*mut c_void, *mut c_void, *mut c_void) -> u8;
    // SAFETY: `objc_msgSend` is cast to the exact non-variadic ABI for `(id, SEL, SEL) -> u8`.
    let f: FnType = unsafe { std::mem::transmute(objc_msgSend as *const ()) };
    unsafe { f(self_, op, sel) != 0 }
}

/// Invoke a zero-argument Objective-C selector returning `uint8_t` (`u8`).
///
/// # Safety
/// `self_` must be a valid Objective-C object pointer and `op` must have signature
/// `uint8_t (*)(id, SEL)`.
unsafe fn objc_msg_send_u8(self_: *mut c_void, op: *mut c_void) -> u8 {
    type FnType = unsafe extern "C" fn(*mut c_void, *mut c_void) -> u8;
    // SAFETY: `objc_msgSend` is cast to the exact non-variadic ABI for `(id, SEL) -> u8`.
    let f: FnType = unsafe { std::mem::transmute(objc_msgSend as *const ()) };
    unsafe { f(self_, op) }
}

/// Map a CoreWLAN `CWPHYMode` enum value to a display string.
pub fn cw_phy_mode_label(phy: isize) -> Option<&'static str> {
    match phy {
        1 => Some("802.11a"),
        2 => Some("802.11b"),
        3 => Some("802.11g"),
        4 => Some("802.11n (Wi-Fi 4)"),
        5 => Some("802.11ac (Wi-Fi 5)"),
        6 => Some("802.11ax (Wi-Fi 6)"),
        7 => Some("802.11be (Wi-Fi 7)"),
        _ => None,
    }
}

/// Map a CoreWLAN `CWChannelBand` enum value to a frequency band string.
pub fn cw_channel_band_label(band: isize) -> Option<&'static str> {
    match band {
        1 => Some("2.4 GHz"),
        2 => Some("5 GHz"),
        3 => Some("6 GHz"),
        _ => None,
    }
}

/// Map a CoreWLAN `CWSecurity` enum value to a security mode display string.
pub fn cw_security_label(sec: isize) -> Option<&'static str> {
    match sec {
        0 => Some("Open"),
        1 => Some("WEP"),
        2 => Some("WPA Personal"),
        3 => Some("WPA/WPA2 Personal"),
        4 => Some("WPA2 Personal"),
        5 => Some("Personal"),
        6 => Some("Dynamic WEP"),
        7 => Some("WPA Enterprise"),
        8 => Some("WPA/WPA2 Enterprise"),
        9 => Some("WPA2 Enterprise"),
        10 => Some("Enterprise"),
        11 => Some("WPA3 Personal"),
        12 => Some("WPA3 Enterprise"),
        13 => Some("WPA2/WPA3 Personal"),
        14 => Some("OWE"),
        15 => Some("OWE Transition"),
        _ => None,
    }
}

/// Convert a Wi-Fi RSSI value in dBm (`-100..=-1`) to a signal quality percentage (`0..=100`).
pub fn rssi_to_signal_percent(rssi: isize) -> Option<u8> {
    if (-100..0).contains(&rssi) {
        Some(((rssi + 100) * 2).clamp(0, 100) as u8)
    } else {
        None
    }
}

/// Pure helper: format macOS CoreWLAN association details into a single display string.
///
/// Avoids `" - "` inside the connection summary so `split_wifi_line` in `src/display.rs`
/// does not mistake connection attributes for an adapter-hardware / link split.
pub fn format_macos_wifi(
    ssid: Option<&str>,
    phy_mode: isize,
    channel_band: isize,
    channel_num: isize,
    security: isize,
    rssi: isize,
    rate_mbps: Option<u64>,
) -> Option<String> {
    let head = ssid
        .map(str::trim)
        .filter(|s| !s.is_empty() && *s != "<redacted>")
        .unwrap_or("Connected");

    let mut attrs: Vec<String> = Vec::new();
    if let Some(phy) = cw_phy_mode_label(phy_mode) {
        attrs.push(phy.to_string());
    }
    match (cw_channel_band_label(channel_band), channel_num > 0) {
        (Some(band), true) => attrs.push(format!("{band} ch {channel_num}")),
        (Some(band), false) => attrs.push(band.to_string()),
        _ => {}
    }
    if let Some(sec) = cw_security_label(security) {
        attrs.push(sec.to_string());
    }
    if let Some(pct) = rssi_to_signal_percent(rssi) {
        attrs.push(format!("{pct}%"));
    }
    if let Some(rate) = rate_mbps.filter(|&r| r > 0) {
        attrs.push(format!("↑{rate} Mbps"));
    }

    if head == "Connected" && attrs.is_empty() {
        return None;
    }
    if attrs.is_empty() {
        Some(head.to_string())
    } else {
        Some(format!("{head} ({})", attrs.join(", ")))
    }
}

/// Return a formatted Wi-Fi connection summary for the active interface via CoreWLAN.
///
/// macOS 10.15+ restricts SSID access to processes with Location Services authorization
/// (`CWInterface.ssid` returns nil). Even without Location Services, `activePHYMode`,
/// `wlanChannel` (`channelBand`, `channelNumber`), `security`, `rssiValue`, and
/// `transmitRate` are all readable without spawning any subprocesses.
pub fn get_wifi_info() -> Option<String> {
    // SAFETY: Each selector is invoked through the non-variadic `objc_msg_send_*` helper
    // matching its exact Objective-C return and argument types.
    unsafe {
        let cls_name = CString::new("CWWiFiClient").unwrap();
        let cls = objc_getClass(cls_name.as_ptr());
        if cls.is_null() {
            return None;
        }
        let shared_sel = sel_registerName(CString::new("sharedWiFiClient").unwrap().as_ptr());
        let client = objc_msg_send_id(cls, shared_sel);
        if client.is_null() {
            return None;
        }
        let iface_sel = sel_registerName(CString::new("interface").unwrap().as_ptr());
        let iface = objc_msg_send_id(client, iface_sel);
        if iface.is_null() {
            return None;
        }

        let rate_sel = sel_registerName(CString::new("transmitRate").unwrap().as_ptr());
        let rate_f = objc_msg_send_f64(iface, rate_sel);
        let rate = (rate_f > 0.0).then_some(rate_f as u64);

        let phy_sel = sel_registerName(CString::new("activePHYMode").unwrap().as_ptr());
        let phy_mode = objc_msg_send_isize(iface, phy_sel);

        let ch_sel = sel_registerName(CString::new("wlanChannel").unwrap().as_ptr());
        let ch_obj = objc_msg_send_id(iface, ch_sel);
        let (channel_band, channel_num) = if !ch_obj.is_null() {
            let band_sel = sel_registerName(CString::new("channelBand").unwrap().as_ptr());
            let num_sel = sel_registerName(CString::new("channelNumber").unwrap().as_ptr());
            (
                objc_msg_send_isize(ch_obj, band_sel),
                objc_msg_send_isize(ch_obj, num_sel),
            )
        } else {
            (0, 0)
        };

        let sec_sel = sel_registerName(CString::new("security").unwrap().as_ptr());
        let security = objc_msg_send_isize(iface, sec_sel);

        let rssi_sel = sel_registerName(CString::new("rssiValue").unwrap().as_ptr());
        let rssi = objc_msg_send_isize(iface, rssi_sel);

        let ssid_sel = sel_registerName(CString::new("ssid").unwrap().as_ptr());
        let ssid_ns = objc_msg_send_id(iface, ssid_sel) as CFStringRef;
        let ssid = cf_string_to_rust(ssid_ns);

        format_macos_wifi(
            ssid.as_deref(),
            phy_mode,
            channel_band,
            channel_num,
            security,
            rssi,
            rate,
        )
    }
}

/// Parse the SSID from `ipconfig getsummary <iface>` output.
///
/// Returns `None` when the SSID line is absent, empty, or the literal string
/// `<redacted>` (which macOS substitutes when Location Services is not
/// granted to the calling process).
#[cfg(test)]
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

    #[test]
    fn test_parse_apple_silicon_firmware() {
        // Verbatim from chani (Apple M3 Pro, macOS 27.2): IODeviceTree:/chosen
        assert_eq!(
            parse_apple_silicon_firmware("mBoot-20457.41.3"),
            (
                Some("mBoot 20457.41.3".to_string()),
                Some("mBoot".to_string())
            )
        );
        assert_eq!(
            parse_apple_silicon_firmware("iBoot-10151.140.19"),
            (
                Some("iBoot 10151.140.19".to_string()),
                Some("iBoot".to_string())
            )
        );
        assert_eq!(parse_apple_silicon_firmware("  "), (None, None));
    }

    #[test]
    fn test_parse_sgx_max_freq_mhz_and_format_gpu() {
        // Last two 8-byte entries from chani's IODeviceTree:/arm-io/sgx `perf-states`:
        // 0x4a076a80 = 1_242_000_000 Hz (1242 MHz), 0x52412100 = 1_380_000_000 Hz (1380 MHz).
        let bytes: [u8; 16] = [
            0x80, 0x6a, 0x07, 0x4a, 0xc0, 0x03, 0x00, 0x00, 0x00, 0x21, 0x41, 0x52, 0xc0, 0x03,
            0x00, 0x00,
        ];
        let mhz = parse_sgx_max_freq_mhz(&bytes);
        assert_eq!(mhz, Some(1380));
        assert_eq!(
            format_apple_silicon_gpu("Apple M3 Pro", Some(18), mhz),
            "Apple M3 Pro (18 cores @ 1.38 GHz) [Integrated]"
        );
        assert_eq!(
            format_apple_silicon_gpu("Apple M3 Pro", None, None),
            "Apple M3 Pro [Integrated]"
        );
    }

    #[test]
    fn test_format_macos_display() {
        // Primary external 4K monitor scaled 2x (UI 1920x1080) on chani
        assert_eq!(
            format_macos_display(
                "LG HDR 4K",
                3840,
                2160,
                1920,
                1080,
                Some(32),
                60.0,
                false,
                true,
                true,
                true,
            ),
            "LG HDR 4K (3840x2160 @ 2x in 32\", 60Hz) [External, HDR] *"
        );
        // Single built-in Retina display
        assert_eq!(
            format_macos_display(
                "Color LCD",
                3024,
                1964,
                1512,
                982,
                Some(14),
                120.0,
                true,
                true,
                true,
                false,
            ),
            "Color LCD (3024x1964 @ 2x in 14\", 120Hz) [Built-in, HDR]"
        );
    }

    #[test]
    fn test_format_macos_cursor_and_fonts() {
        assert_eq!(
            format_macos_cursor(None, None, None),
            "Fill - Black, Outline - White (32px)"
        );
        assert_eq!(
            format_macos_cursor(Some((1.0, 0.0, 0.0)), Some((0.0, 0.0, 0.0)), Some(2.0)),
            "Fill - #FF0000, Outline - Black (64px)"
        );
        assert_eq!(
            format_macos_fonts(Some(".AppleSystemUIFont"), Some("Helvetica")),
            ".AppleSystemUIFont [System], Helvetica [User]"
        );
    }

    #[test]
    fn test_format_macos_wifi() {
        // Redacted SSID on chani: 802.11ax (6), 5 GHz (2) ch 149, WPA3 Personal (11), -58 dBm (84%), 576 Mbps
        assert_eq!(
            format_macos_wifi(None, 6, 2, 149, 11, -58, Some(576)),
            Some(
                "Connected (802.11ax (Wi-Fi 6), 5 GHz ch 149, WPA3 Personal, 84%, ↑576 Mbps)"
                    .to_string()
            )
        );
        // With known SSID
        assert_eq!(
            format_macos_wifi(Some("HomeNet"), 6, 2, 36, 11, -50, Some(1200)),
            Some(
                "HomeNet (802.11ax (Wi-Fi 6), 5 GHz ch 36, WPA3 Personal, 100%, ↑1200 Mbps)"
                    .to_string()
            )
        );
        // Disconnected
        assert_eq!(format_macos_wifi(None, 0, 0, 0, -1, 0, None), None);
    }
}

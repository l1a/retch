// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Shared SetupAPI (`setupapi.dll`) device-enumeration helper for Windows detection.
//!
//! Enumerates present devices in a setup class and returns their friendly names — the
//! native equivalent of `Get-PnpDevice -Class <class> -PresentOnly`. Used by the
//! `bluetooth` (adapter name) and `camera` detection modules. Hand-written
//! `extern "system"` FFI matching the crate's Windows style (see `win_reg.rs`).

use std::ffi::c_void;
use std::mem::size_of;
use std::ptr;

type Handle = *mut c_void;
const INVALID_HANDLE_VALUE: Handle = -1isize as Handle;
const DIGCF_PRESENT: u32 = 0x0000_0002;
const DIGCF_DEVICEINTERFACE: u32 = 0x0000_0010;
const SPDRP_DEVICEDESC: u32 = 0x0000_0000;
const SPDRP_FRIENDLYNAME: u32 = 0x0000_000C;

/// A Win32/COM `GUID`.
#[repr(C)]
pub struct Guid {
    pub data1: u32,
    pub data2: u16,
    pub data3: u16,
    pub data4: [u8; 8],
}

/// `GUID_DEVCLASS_BLUETOOTH` = {e0cbf06c-cd8b-4647-bb8a-263b43f0f974}
pub const GUID_DEVCLASS_BLUETOOTH: Guid = Guid {
    data1: 0xe0cb_f06c,
    data2: 0xcd8b,
    data3: 0x4647,
    data4: [0xbb, 0x8a, 0x26, 0x3b, 0x43, 0xf0, 0xf9, 0x74],
};

/// `KSCATEGORY_VIDEO_CAMERA` device *interface* class =
/// {e5323777-f976-4f5b-9b55-b94699c46e44}.
///
/// Real video-capture cameras register this interface; scanners/printers in the Image
/// (WIA) setup class do **not**. Enumerating by this interface (rather than the Camera +
/// Image setup classes) therefore returns webcams while excluding scanners/MFPs — a
/// scanner and a webcam can share the Image setup class, so only the interface reliably
/// distinguishes them.
pub const KSCATEGORY_VIDEO_CAMERA: Guid = Guid {
    data1: 0xe532_3777,
    data2: 0xf976,
    data3: 0x4f5b,
    data4: [0x9b, 0x55, 0xb9, 0x46, 0x99, 0xc4, 0x6e, 0x44],
};

#[repr(C)]
struct SpDevinfoData {
    cb_size: u32,
    class_guid: Guid,
    dev_inst: u32,
    reserved: usize,
}

#[link(name = "setupapi")]
extern "system" {
    fn SetupDiGetClassDevsW(
        class_guid: *const Guid,
        enumerator: *const u16,
        hwnd_parent: Handle,
        flags: u32,
    ) -> Handle;
    fn SetupDiEnumDeviceInfo(dev_info: Handle, index: u32, data: *mut SpDevinfoData) -> i32;
    fn SetupDiGetDeviceRegistryPropertyW(
        dev_info: Handle,
        data: *const SpDevinfoData,
        property: u32,
        property_reg_data_type: *mut u32,
        property_buffer: *mut u8,
        property_buffer_size: u32,
        required_size: *mut u32,
    ) -> i32;
    fn SetupDiDestroyDeviceInfoList(dev_info: Handle) -> i32;
}

/// Converts a null-terminated wide buffer to a trimmed `String`; `None` if empty.
fn wide_to_string(buf: &[u16]) -> Option<String> {
    let len = buf.iter().position(|&c| c == 0).unwrap_or(buf.len());
    let s = String::from_utf16_lossy(&buf[..len]).trim().to_string();
    if s.is_empty() {
        None
    } else {
        Some(s)
    }
}

/// Reads a device's friendly name, falling back to its device description.
fn device_name(dev_info: Handle, data: &SpDevinfoData) -> Option<String> {
    for prop in [SPDRP_FRIENDLYNAME, SPDRP_DEVICEDESC] {
        let mut buf = [0u16; 512];
        let mut required = 0u32;
        // SAFETY: buf is writable with its byte length passed; data is a valid SP_DEVINFO_DATA.
        let ok = unsafe {
            SetupDiGetDeviceRegistryPropertyW(
                dev_info,
                data,
                prop,
                ptr::null_mut(),
                buf.as_mut_ptr() as *mut u8,
                (buf.len() * 2) as u32,
                &mut required,
            )
        };
        if ok != 0 {
            if let Some(name) = wide_to_string(&buf) {
                return Some(name);
            }
        }
    }
    None
}

/// Friendly names of present devices selected by `class_guid` interpreted per `flags`.
///
/// With `DIGCF_PRESENT` alone, `class_guid` is a *setup* class; adding
/// `DIGCF_DEVICEINTERFACE` interprets it as a device *interface* class. Either way the
/// underlying devnodes are enumerated via `SetupDiEnumDeviceInfo` and their friendly
/// names read.
fn enumerate_names(class_guid: &Guid, flags: u32) -> Vec<String> {
    let mut names = Vec::new();
    // SAFETY: the device-info set is created and destroyed in-scope.
    unsafe {
        let dev_info = SetupDiGetClassDevsW(class_guid, ptr::null(), ptr::null_mut(), flags);
        if dev_info == INVALID_HANDLE_VALUE {
            return names;
        }
        let mut index = 0u32;
        loop {
            let mut data: SpDevinfoData = std::mem::zeroed();
            data.cb_size = size_of::<SpDevinfoData>() as u32;
            if SetupDiEnumDeviceInfo(dev_info, index, &mut data) == 0 {
                break;
            }
            index += 1;
            if let Some(name) = device_name(dev_info, &data) {
                names.push(name);
            }
        }
        SetupDiDestroyDeviceInfoList(dev_info);
    }
    names
}

/// Friendly names of all *present* devices in the given setup class (the native
/// equivalent of `Get-PnpDevice -Class <class> -PresentOnly`).
pub fn present_device_names(class_guid: &Guid) -> Vec<String> {
    enumerate_names(class_guid, DIGCF_PRESENT)
}

/// Friendly names of all *present* devices exposing the given device *interface* class.
///
/// Use this when the setup class is ambiguous — e.g. cameras and scanners share the Image
/// setup class, but only cameras expose [`KSCATEGORY_VIDEO_CAMERA`].
pub fn present_interface_device_names(interface_guid: &Guid) -> Vec<String> {
    enumerate_names(interface_guid, DIGCF_PRESENT | DIGCF_DEVICEINTERFACE)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sp_devinfo_data_layout() {
        // SetupDiEnumDeviceInfo rejects the struct unless cb_size matches the OS's
        // sizeof(SP_DEVINFO_DATA): 4 (cbSize) + 16 (GUID) + 4 (DevInst) + 8 (Reserved,
        // ULONG_PTR) = 32 on 64-bit Windows. A padding/field-order regression would break
        // every enumeration silently, so pin the size.
        assert_eq!(size_of::<SpDevinfoData>(), 32);
        assert_eq!(size_of::<Guid>(), 16);
    }
}

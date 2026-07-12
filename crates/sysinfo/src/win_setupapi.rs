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

/// `GUID_DEVCLASS_CAMERA` = {ca3e7ab9-b4c3-4ae6-8251-579ef933890f}
pub const GUID_DEVCLASS_CAMERA: Guid = Guid {
    data1: 0xca3e_7ab9,
    data2: 0xb4c3,
    data3: 0x4ae6,
    data4: [0x82, 0x51, 0x57, 0x9e, 0xf9, 0x33, 0x89, 0x0f],
};

/// `GUID_DEVCLASS_IMAGE` = {6bdd1fc6-810f-11d0-bec7-08002be2092f}
pub const GUID_DEVCLASS_IMAGE: Guid = Guid {
    data1: 0x6bdd_1fc6,
    data2: 0x810f,
    data3: 0x11d0,
    data4: [0xbe, 0xc7, 0x08, 0x00, 0x2b, 0xe2, 0x09, 0x2f],
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

/// Friendly names of all *present* devices in the given setup class (the native
/// equivalent of `Get-PnpDevice -Class <class> -PresentOnly`).
pub fn present_device_names(class_guid: &Guid) -> Vec<String> {
    let mut names = Vec::new();
    // SAFETY: the device-info set is created and destroyed in-scope.
    unsafe {
        let dev_info =
            SetupDiGetClassDevsW(class_guid, ptr::null(), ptr::null_mut(), DIGCF_PRESENT);
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

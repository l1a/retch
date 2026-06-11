// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Windows registry helpers shared across detection modules.

use std::ffi::OsStr;
use std::os::windows::ffi::OsStrExt;
use std::ptr;

#[allow(clippy::upper_case_acronyms)]
type HKEY = *mut std::ffi::c_void;
pub const HKEY_LOCAL_MACHINE: HKEY = 0x80000002 as HKEY;
pub const HKEY_CURRENT_USER: HKEY = 0x80000001 as HKEY;
const KEY_READ: u32 = 0x20019;
const ERROR_NO_MORE_ITEMS: i32 = 259;

extern "system" {
    fn RegOpenKeyExW(
        hKey: HKEY,
        lpSubKey: *const u16,
        ulOptions: u32,
        samDesired: u32,
        phkResult: *mut HKEY,
    ) -> i32;

    fn RegQueryValueExW(
        hKey: HKEY,
        lpValueName: *const u16,
        lpReserved: *mut u32,
        lpType: *mut u32,
        lpData: *mut u8,
        lpcbData: *mut u32,
    ) -> i32;

    fn RegEnumKeyExW(
        hKey: HKEY,
        dwIndex: u32,
        lpName: *mut u16,
        lpcchName: *mut u32,
        lpReserved: *mut u32,
        lpClass: *mut u16,
        lpcchClass: *mut u32,
        lpftLastWriteTime: *mut u64,
    ) -> i32;

    fn RegCloseKey(hKey: HKEY) -> i32;
}

pub fn get_reg_string(hkey: HKEY, subkey: &str, value: &str) -> Option<String> {
    let subkey_w: Vec<u16> = OsStr::new(subkey).encode_wide().chain(Some(0)).collect();
    let value_w: Vec<u16> = OsStr::new(value).encode_wide().chain(Some(0)).collect();
    let mut hk: HKEY = ptr::null_mut();

    let res = unsafe { RegOpenKeyExW(hkey, subkey_w.as_ptr(), 0, KEY_READ, &mut hk) };
    if res != 0 {
        return None;
    }

    let mut size: u32 = 0;
    let mut ty: u32 = 0;
    unsafe {
        RegQueryValueExW(
            hk,
            value_w.as_ptr(),
            ptr::null_mut(),
            &mut ty,
            ptr::null_mut(),
            &mut size,
        );
    }

    if size == 0 {
        unsafe {
            RegCloseKey(hk);
        }
        return None;
    }

    let mut buf = vec![0u8; size as usize];
    let res = unsafe {
        RegQueryValueExW(
            hk,
            value_w.as_ptr(),
            ptr::null_mut(),
            &mut ty,
            buf.as_mut_ptr(),
            &mut size,
        )
    };
    unsafe {
        RegCloseKey(hk);
    }

    if res == 0 {
        if ty == 1 || ty == 2 {
            // REG_SZ or REG_EXPAND_SZ
            let words =
                unsafe { std::slice::from_raw_parts(buf.as_ptr() as *const u16, buf.len() / 2) };
            let len = words.iter().position(|&x| x == 0).unwrap_or(words.len());
            String::from_utf16(&words[..len]).ok()
        } else {
            None
        }
    } else {
        None
    }
}

pub fn get_reg_u32(hkey: HKEY, subkey: &str, value: &str) -> Option<u32> {
    let subkey_w: Vec<u16> = OsStr::new(subkey).encode_wide().chain(Some(0)).collect();
    let value_w: Vec<u16> = OsStr::new(value).encode_wide().chain(Some(0)).collect();
    let mut hk: HKEY = ptr::null_mut();

    let res = unsafe { RegOpenKeyExW(hkey, subkey_w.as_ptr(), 0, KEY_READ, &mut hk) };
    if res != 0 {
        return None;
    }

    let mut size: u32 = 4;
    let mut ty: u32 = 0;
    let mut val: u32 = 0;
    let res = unsafe {
        RegQueryValueExW(
            hk,
            value_w.as_ptr(),
            ptr::null_mut(),
            &mut ty,
            &mut val as *mut u32 as *mut u8,
            &mut size,
        )
    };
    unsafe {
        RegCloseKey(hk);
    }

    if res == 0 && ty == 4 {
        // REG_DWORD
        Some(val)
    } else {
        None
    }
}

/// Read a binary (REG_BINARY) value as raw bytes.
pub fn get_reg_binary(hkey: HKEY, subkey: &str, value: &str) -> Option<Vec<u8>> {
    let subkey_w: Vec<u16> = OsStr::new(subkey).encode_wide().chain(Some(0)).collect();
    let value_w: Vec<u16> = OsStr::new(value).encode_wide().chain(Some(0)).collect();
    let mut hk: HKEY = ptr::null_mut();

    let res = unsafe { RegOpenKeyExW(hkey, subkey_w.as_ptr(), 0, KEY_READ, &mut hk) };
    if res != 0 {
        return None;
    }

    let mut size: u32 = 0;
    let mut ty: u32 = 0;
    unsafe {
        RegQueryValueExW(
            hk,
            value_w.as_ptr(),
            ptr::null_mut(),
            &mut ty,
            ptr::null_mut(),
            &mut size,
        );
    }

    if size == 0 {
        unsafe {
            RegCloseKey(hk);
        }
        return None;
    }

    let mut buf = vec![0u8; size as usize];
    let res = unsafe {
        RegQueryValueExW(
            hk,
            value_w.as_ptr(),
            ptr::null_mut(),
            &mut ty,
            buf.as_mut_ptr(),
            &mut size,
        )
    };
    unsafe {
        RegCloseKey(hk);
    }

    if res == 0 && ty == 3 {
        // REG_BINARY
        Some(buf)
    } else {
        None
    }
}

/// Enumerate immediate subkey names under the given path.
pub fn enum_reg_subkeys(hkey: HKEY, subkey: &str) -> Vec<String> {
    let subkey_w: Vec<u16> = OsStr::new(subkey).encode_wide().chain(Some(0)).collect();
    let mut hk: HKEY = ptr::null_mut();

    let res = unsafe { RegOpenKeyExW(hkey, subkey_w.as_ptr(), 0, KEY_READ, &mut hk) };
    if res != 0 {
        return Vec::new();
    }

    let mut results = Vec::new();
    let mut index = 0u32;
    loop {
        let mut name_buf = vec![0u16; 256];
        let mut name_len = name_buf.len() as u32;
        let res = unsafe {
            RegEnumKeyExW(
                hk,
                index,
                name_buf.as_mut_ptr(),
                &mut name_len,
                ptr::null_mut(),
                ptr::null_mut(),
                ptr::null_mut(),
                ptr::null_mut(),
            )
        };
        if res == ERROR_NO_MORE_ITEMS {
            break;
        }
        if res == 0 {
            if let Ok(name) = String::from_utf16(&name_buf[..name_len as usize]) {
                results.push(name);
            }
        }
        index += 1;
    }

    unsafe {
        RegCloseKey(hk);
    }
    results
}

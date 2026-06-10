// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 l1a

//! Windows registry helpers shared across detection modules.

use std::ffi::OsStr;
use std::os::windows::ffi::OsStrExt;
use std::ptr;

type HKEY = *mut std::ffi::c_void;
pub const HKEY_LOCAL_MACHINE: HKEY = 0x80000002 as HKEY;
pub const HKEY_CURRENT_USER: HKEY = 0x80000001 as HKEY;
const KEY_READ: u32 = 0x20019;

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

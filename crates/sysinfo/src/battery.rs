// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

#[cfg(target_os = "linux")]
use std::fs;
#[cfg(target_os = "linux")]
use std::path::Path;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BatteryState {
    Charging,
    Discharging,
    Full,
    Unknown,
}

#[derive(Debug, Clone)]
pub struct BatteryInfo {
    pub percentage: f32,
    pub health: Option<f32>,
    pub state: BatteryState,
    pub time_remaining: Option<std::time::Duration>,
    pub vendor: Option<String>,
    pub model: Option<String>,
}

#[cfg(target_os = "linux")]
pub fn get_battery_info() -> Option<BatteryInfo> {
    let power_supply = Path::new("/sys/class/power_supply");
    if !power_supply.exists() {
        return None;
    }

    let entries = fs::read_dir(power_supply).ok()?;
    for entry in entries.flatten() {
        let path = entry.path();
        let name = path.file_name()?.to_string_lossy();
        if name.starts_with("BAT") || name.starts_with("sb-") {
            // Read type to confirm it's a battery
            if let Some(supply_type) = read_file_to_string(path.join("type")) {
                if supply_type != "Battery" {
                    continue;
                }
            }

            // Read capacity
            let percentage = read_file_to_num::<f32, _>(path.join("capacity"))?;

            // Read status
            let state_str = read_file_to_string(path.join("status")).unwrap_or_default();
            let state = match state_str.as_str() {
                "Charging" => BatteryState::Charging,
                "Discharging" => BatteryState::Discharging,
                "Full" => BatteryState::Full,
                _ => BatteryState::Unknown,
            };

            // Read vendor & model
            let vendor = read_file_to_string(path.join("manufacturer"))
                .or_else(|| read_file_to_string(path.join("vendor")));
            let model = read_file_to_string(path.join("model_name"))
                .or_else(|| read_file_to_string(path.join("model")));

            // Compute health
            let mut health = None;
            if let (Some(full), Some(design)) = (
                read_file_to_num::<f32, _>(path.join("energy_full")),
                read_file_to_num::<f32, _>(path.join("energy_full_design")),
            ) {
                if design > 0.0 {
                    health = Some((full / design) * 100.0);
                }
            } else if let (Some(full), Some(design)) = (
                read_file_to_num::<f32, _>(path.join("charge_full")),
                read_file_to_num::<f32, _>(path.join("charge_full_design")),
            ) {
                if design > 0.0 {
                    health = Some((full / design) * 100.0);
                }
            }

            // Compute time remaining
            let mut time_remaining = None;
            if state == BatteryState::Charging || state == BatteryState::Discharging {
                if let (Some(power), Some(energy_now)) = (
                    read_file_to_num::<f64, _>(path.join("power_now")),
                    read_file_to_num::<f64, _>(path.join("energy_now")),
                ) {
                    if power > 0.0 {
                        let hours = match state {
                            BatteryState::Discharging => energy_now / power,
                            BatteryState::Charging => {
                                let energy_full =
                                    read_file_to_num::<f64, _>(path.join("energy_full"))
                                        .unwrap_or(energy_now);
                                (energy_full - energy_now).max(0.0) / power
                            }
                            _ => 0.0,
                        };
                        time_remaining = Some(std::time::Duration::from_secs_f64(hours * 3600.0));
                    }
                } else if let (Some(current), Some(charge_now)) = (
                    read_file_to_num::<f64, _>(path.join("current_now")),
                    read_file_to_num::<f64, _>(path.join("charge_now")),
                ) {
                    if current > 0.0 {
                        let hours = match state {
                            BatteryState::Discharging => charge_now / current,
                            BatteryState::Charging => {
                                let charge_full =
                                    read_file_to_num::<f64, _>(path.join("charge_full"))
                                        .unwrap_or(charge_now);
                                (charge_full - charge_now).max(0.0) / current
                            }
                            _ => 0.0,
                        };
                        time_remaining = Some(std::time::Duration::from_secs_f64(hours * 3600.0));
                    }
                }
            }

            return Some(BatteryInfo {
                percentage,
                health,
                state,
                time_remaining,
                vendor,
                model,
            });
        }
    }

    None
}

#[cfg(target_os = "macos")]
pub fn get_battery_info() -> Option<BatteryInfo> {
    let raw = crate::macos_ffi::get_battery_raw()?;

    let max_cap = raw.max_mah? as f32;
    let cur_cap = raw.current_mah? as f32;

    let percentage = if max_cap > 0.0 {
        (cur_cap / max_cap) * 100.0
    } else {
        0.0
    };

    let health = raw.design_mah.and_then(|design| {
        if design == 0 {
            return None;
        }
        let h_max = raw.raw_max_mah.or(raw.max_mah)? as f32;
        Some((h_max / design as f32) * 100.0)
    });

    let state = if raw.fully_charged {
        BatteryState::Full
    } else if raw.is_charging {
        BatteryState::Charging
    } else {
        BatteryState::Discharging
    };

    let time_remaining = raw
        .time_remaining_mins
        .map(|m| std::time::Duration::from_secs(m * 60));

    Some(BatteryInfo {
        percentage,
        health,
        state,
        time_remaining,
        vendor: raw.vendor,
        model: raw.model,
    })
}

#[cfg(target_os = "windows")]
mod win32 {
    #[repr(C)]
    pub struct SYSTEM_POWER_STATUS {
        pub ac_line_status: u8,
        pub battery_flag: u8,
        pub battery_life_percent: u8,
        pub system_status: u8,
        pub battery_life_time: u32,
        pub battery_full_life_time: u32,
    }

    #[link(name = "kernel32")]
    extern "system" {
        pub fn GetSystemPowerStatus(lpSystemPowerStatus: *mut SYSTEM_POWER_STATUS) -> i32;
    }
}

#[cfg(target_os = "windows")]
pub fn get_battery_info() -> Option<BatteryInfo> {
    let mut status = win32::SYSTEM_POWER_STATUS {
        ac_line_status: 255,
        battery_flag: 255,
        battery_life_percent: 255,
        system_status: 0,
        battery_life_time: 0xffffffff,
        battery_full_life_time: 0xffffffff,
    };

    let res = unsafe { win32::GetSystemPowerStatus(&mut status) };
    if res == 0 || status.battery_life_percent == 255 {
        return None;
    }

    let percentage = status.battery_life_percent as f32;
    let state = match status.ac_line_status {
        1 => {
            if percentage >= 100.0 {
                BatteryState::Full
            } else {
                BatteryState::Charging
            }
        }
        0 => BatteryState::Discharging,
        _ => BatteryState::Unknown,
    };

    let time_remaining = if status.battery_life_time != 0xffffffff {
        Some(std::time::Duration::from_secs(
            status.battery_life_time as u64,
        ))
    } else {
        None
    };

    let mut info = BatteryInfo {
        percentage,
        health: None,
        state,
        time_remaining,
        vendor: None,
        model: None,
    };

    // Health, vendor and model come from the battery device itself. This used to spawn
    // `powershell -Command "Get-CimInstance Win32_Battery ..."`, which a per-field sweep
    // measured at ~2531 ms against a ~322 ms process-startup floor - the slowest remaining
    // field on Windows once `dns` went native in v0.11.2. It also returned *less*: on the
    // machine this was written against, Win32_Battery reported DesignCapacity,
    // FullChargeCapacity and Manufacturer as EMPTY, so the whole spawn bought a model name
    // and nothing else.
    if let Some(device) = win_battery::first_battery() {
        if let (Some(design), Some(full)) = (device.designed_capacity, device.full_charged_capacity)
        {
            if design > 0 {
                info.health = Some((full as f32 / design as f32) * 100.0);
            }
        }
        info.vendor = device.manufacturer;
        info.model = device.device_name;
    }

    Some(info)
}

/// Battery details read straight from the device via `IOCTL_BATTERY_QUERY_INFORMATION`.
///
/// Every field is optional because a battery miniport may answer some queries and not
/// others; a partial answer is reported as such rather than discarded.
#[cfg(target_os = "windows")]
#[derive(Default)]
struct WinBattery {
    designed_capacity: Option<u32>,
    full_charged_capacity: Option<u32>,
    manufacturer: Option<String>,
    device_name: Option<String>,
}

/// Native battery interrogation over the `GUID_DEVICE_BATTERY` device interface.
///
/// **Access rights were established by measurement, not copied from the MSDN sample.**
/// The battery IOCTLs are `FILE_READ_ACCESS`, and a handle opened with **zero** desired
/// access fails them with `ERROR_ACCESS_DENIED` (5) - unlike the storage IOCTLs in
/// `disk.rs`, which are `FILE_ANY_ACCESS` and work on a zero-access handle. `GENERIC_READ`
/// alone is sufficient and is what this uses; the common sample code asks for
/// `GENERIC_READ | GENERIC_WRITE`, which is more than the work requires. No elevation is
/// needed either way - confirmed from an unelevated shell.
#[cfg(target_os = "windows")]
mod win_battery {
    use super::WinBattery;
    use crate::win_setupapi::Guid;
    use std::ffi::{c_void, OsStr};
    use std::mem::size_of;
    use std::os::windows::ffi::OsStrExt;
    use std::ptr;

    type Handle = *mut c_void;
    const INVALID_HANDLE_VALUE: Handle = -1isize as Handle;
    const GENERIC_READ: u32 = 0x8000_0000;
    const FILE_SHARE_READ: u32 = 0x0000_0001;
    const FILE_SHARE_WRITE: u32 = 0x0000_0002;
    const OPEN_EXISTING: u32 = 3;

    /// `GUID_DEVICE_BATTERY` = {72631e54-78A4-11d0-bcf7-00aa00b7b32a}.
    const GUID_DEVICE_BATTERY: Guid = Guid {
        data1: 0x7263_1e54,
        data2: 0x78A4,
        data3: 0x11d0,
        data4: [0xbc, 0xf7, 0x00, 0xaa, 0x00, 0xb7, 0xb3, 0x2a],
    };

    // CTL_CODE(FILE_DEVICE_BATTERY = 0x29, function, METHOD_BUFFERED, FILE_READ_ACCESS).
    const IOCTL_BATTERY_QUERY_TAG: u32 = 0x0029_4040;
    const IOCTL_BATTERY_QUERY_INFORMATION: u32 = 0x0029_4044;

    // BATTERY_QUERY_INFORMATION_LEVEL values.
    const BATTERY_INFORMATION_LEVEL: u32 = 0;
    const BATTERY_DEVICE_NAME: u32 = 4;
    const BATTERY_MANUFACTURE_NAME: u32 = 6;

    /// `BATTERY_QUERY_INFORMATION` - the input every information query takes.
    #[repr(C)]
    struct BatteryQueryInformation {
        battery_tag: u32,
        information_level: u32,
        at_rate: i32,
    }

    /// `BATTERY_INFORMATION`.
    ///
    /// **36 bytes, not 32** - `Technology` plus its 3 reserved bytes and the 4-byte
    /// `Chemistry` array fill two words before the six `ULONG`s. A probe written against a
    /// predicted 32 printed the correct capacities anyway, which is the useful part: the
    /// values validated the layout, the prediction did not.
    #[repr(C)]
    #[derive(Default)]
    struct BatteryInformation {
        capabilities: u32,
        technology: u8,
        reserved: [u8; 3],
        chemistry: [u8; 4],
        designed_capacity: u32,
        full_charged_capacity: u32,
        default_alert1: u32,
        default_alert2: u32,
        critical_bias: u32,
        cycle_count: u32,
    }

    extern "system" {
        fn CreateFileW(
            lp_file_name: *const u16,
            dw_desired_access: u32,
            dw_share_mode: u32,
            lp_security_attributes: *mut c_void,
            dw_creation_disposition: u32,
            dw_flags_and_attributes: u32,
            h_template_file: Handle,
        ) -> Handle;
        fn DeviceIoControl(
            h_device: Handle,
            dw_io_control_code: u32,
            lp_in_buffer: *const c_void,
            n_in_buffer_size: u32,
            lp_out_buffer: *mut c_void,
            n_out_buffer_size: u32,
            lp_bytes_returned: *mut u32,
            lp_overlapped: *mut c_void,
        ) -> i32;
        fn CloseHandle(h_object: Handle) -> i32;
    }

    /// The first battery that answers, or `None` on a machine with none.
    ///
    /// A desktop reports no battery interfaces at all, which is a normal answer rather
    /// than a failure - the field is simply absent, as it was before.
    pub fn first_battery() -> Option<WinBattery> {
        crate::win_setupapi::present_interface_device_paths(&GUID_DEVICE_BATTERY)
            .into_iter()
            .find_map(|path| read_battery(&path))
    }

    fn read_battery(path: &str) -> Option<WinBattery> {
        let wide: Vec<u16> = OsStr::new(path).encode_wide().chain(Some(0)).collect();
        // SAFETY: `wide` is a valid NUL-terminated wide string; the handle is checked
        // before use and closed on every path below.
        let handle = unsafe {
            CreateFileW(
                wide.as_ptr(),
                GENERIC_READ,
                FILE_SHARE_READ | FILE_SHARE_WRITE,
                ptr::null_mut(),
                OPEN_EXISTING,
                0,
                ptr::null_mut(),
            )
        };
        if handle == INVALID_HANDLE_VALUE || handle.is_null() {
            return None;
        }
        let out = read_with_handle(handle);
        // SAFETY: `handle` came from a successful CreateFileW and is closed exactly once.
        unsafe {
            CloseHandle(handle);
        }
        out
    }

    fn read_with_handle(handle: Handle) -> Option<WinBattery> {
        // Every information query is keyed by the battery tag, which changes when the
        // battery is swapped - so it must be fetched first and cannot be cached.
        let mut tag: u32 = 0;
        let mut returned: u32 = 0;
        let wait: u32 = 0;
        // SAFETY: both buffers are locals of the sizes declared to the call.
        let ok = unsafe {
            DeviceIoControl(
                handle,
                IOCTL_BATTERY_QUERY_TAG,
                &wait as *const u32 as *const c_void,
                size_of::<u32>() as u32,
                &mut tag as *mut u32 as *mut c_void,
                size_of::<u32>() as u32,
                &mut returned,
                ptr::null_mut(),
            )
        };
        if ok == 0 || tag == 0 {
            return None;
        }

        let mut battery = WinBattery {
            manufacturer: query_string(handle, tag, BATTERY_MANUFACTURE_NAME),
            device_name: query_string(handle, tag, BATTERY_DEVICE_NAME),
            ..Default::default()
        };

        let query = BatteryQueryInformation {
            battery_tag: tag,
            information_level: BATTERY_INFORMATION_LEVEL,
            at_rate: 0,
        };
        let mut info = BatteryInformation::default();
        // SAFETY: `query` is a fully initialised input of the declared size and `info` a
        // writable output of its own size.
        let ok = unsafe {
            DeviceIoControl(
                handle,
                IOCTL_BATTERY_QUERY_INFORMATION,
                &query as *const _ as *const c_void,
                size_of::<BatteryQueryInformation>() as u32,
                &mut info as *mut _ as *mut c_void,
                size_of::<BatteryInformation>() as u32,
                &mut returned,
                ptr::null_mut(),
            )
        };
        if ok != 0 {
            // Zero means "not reported" for these, and a zero design capacity would make
            // the health calculation a division by zero rather than a useful number.
            battery.designed_capacity =
                (info.designed_capacity > 0).then_some(info.designed_capacity);
            battery.full_charged_capacity =
                (info.full_charged_capacity > 0).then_some(info.full_charged_capacity);
        }
        Some(battery)
    }

    /// Read one of the string information levels, or `None` when unreported.
    fn query_string(handle: Handle, tag: u32, level: u32) -> Option<String> {
        let query = BatteryQueryInformation {
            battery_tag: tag,
            information_level: level,
            at_rate: 0,
        };
        let mut buf = [0u16; 128];
        let mut returned: u32 = 0;
        // SAFETY: `query` is a valid input of the declared size; `buf` is written with its
        // own byte length as the bound.
        let ok = unsafe {
            DeviceIoControl(
                handle,
                IOCTL_BATTERY_QUERY_INFORMATION,
                &query as *const _ as *const c_void,
                size_of::<BatteryQueryInformation>() as u32,
                buf.as_mut_ptr() as *mut c_void,
                std::mem::size_of_val(&buf) as u32,
                &mut returned,
                ptr::null_mut(),
            )
        };
        if ok == 0 || returned == 0 {
            return None;
        }
        let end = buf.iter().position(|&c| c == 0).unwrap_or(buf.len());
        let s = String::from_utf16_lossy(&buf[..end]).trim().to_string();
        (!s.is_empty()).then_some(s)
    }

    #[cfg(test)]
    mod layout {
        use std::mem::{offset_of, size_of};

        // These are passed to a driver by pointer and read by offset. The capacities sit
        // at 12 and 16 only because Technology + Reserved + Chemistry fill exactly two
        // words ahead of them, which is the part that is easy to get wrong.
        #[test]
        fn ffi_struct_layout() {
            assert_eq!(size_of::<super::BatteryQueryInformation>(), 12);
            assert_eq!(size_of::<super::BatteryInformation>(), 36);
            assert_eq!(offset_of!(super::BatteryInformation, chemistry), 8);
            assert_eq!(offset_of!(super::BatteryInformation, designed_capacity), 12);
            assert_eq!(
                offset_of!(super::BatteryInformation, full_charged_capacity),
                16
            );
        }
    }
}

#[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
pub fn get_battery_info() -> Option<BatteryInfo> {
    None
}

// Helpers
#[cfg(target_os = "linux")]
fn read_file_to_string<P: AsRef<Path>>(path: P) -> Option<String> {
    fs::read_to_string(path).ok().map(|s| s.trim().to_string())
}

#[cfg(target_os = "linux")]
fn read_file_to_num<T: std::str::FromStr, P: AsRef<Path>>(path: P) -> Option<T> {
    read_file_to_string(path).and_then(|s| s.parse().ok())
}

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

    if let Ok(output) = std::process::Command::new("powershell")
        .args([
            "-Command",
            "Get-CimInstance Win32_Battery | Select-Object DesignCapacity,FullChargeCapacity,Manufacturer,Name | Format-List",
        ])
        .output()
    {
        if let Ok(stdout) = String::from_utf8(output.stdout) {
            let mut design_capacity: Option<f32> = None;
            let mut full_charge_capacity: Option<f32> = None;

            for line in stdout.lines() {
                let line = line.trim();
                if let Some(pos) = line.find(':') {
                    let key = line[..pos].trim();
                    let val = line[pos + 1..].trim();
                    if !val.is_empty() {
                        match key {
                            "DesignCapacity" => design_capacity = val.parse().ok(),
                            "FullChargeCapacity" => full_charge_capacity = val.parse().ok(),
                            "Manufacturer" => info.vendor = Some(val.to_string()),
                            "Name" => info.model = Some(val.to_string()),
                            _ => {}
                        }
                    }
                }
            }

            if let (Some(full), Some(design)) = (full_charge_capacity, design_capacity) {
                if design > 0.0 {
                    info.health = Some((full / design) * 100.0);
                }
            }
        }
    }

    Some(info)
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

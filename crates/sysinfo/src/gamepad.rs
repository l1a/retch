// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 l1a

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
        let usb_stdout = std::process::Command::new("system_profiler")
            .arg("SPUSBDataType")
            .output()
            .ok()
            .and_then(|o| String::from_utf8(o.stdout).ok())
            .unwrap_or_default();

        let bt_stdout = std::process::Command::new("system_profiler")
            .arg("SPBluetoothDataType")
            .output()
            .ok()
            .and_then(|o| String::from_utf8(o.stdout).ok())
            .unwrap_or_default();

        parse_macos_gamepad(&usb_stdout, &bt_stdout)
    }

    #[cfg(target_os = "windows")]
    {
        let cmd = "Get-PnpDevice -PresentOnly -ErrorAction SilentlyContinue | Where-Object { $_.Class -eq 'HIDClass' -and ($_.HardwareID -match 'HID_DEVICE_SYSTEM_GAME' -or $_.HardwareID -match 'HID_DEVICE_GAME') -or $_.FriendlyName -match 'Xbox Controller|Gamepad|Joystick' } | Select-Object -ExpandProperty FriendlyName";
        if let Ok(output) = std::process::Command::new("powershell")
            .args(["-Command", cmd])
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                let mut gamepads = Vec::new();
                for line in stdout.lines() {
                    let trimmed = line.trim().to_string();
                    if !trimmed.is_empty() && !gamepads.contains(&trimmed) {
                        gamepads.push(trimmed);
                    }
                }
                return gamepads;
            }
        }
        Vec::new()
    }

    #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
    {
        Vec::new()
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

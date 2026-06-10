// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 l1a

//! Bluetooth controller state and connected device detection.

/// Detects Bluetooth power state, adapter hardware, and connected devices.
pub fn detect_bluetooth() -> Option<String> {
    #[cfg(target_os = "linux")]
    {
        if let Ok(entries) = std::fs::read_dir("/sys/class/bluetooth") {
            let mut hcis = Vec::new();
            for entry in entries.filter_map(|e| e.ok()) {
                let name = entry.file_name().to_string_lossy().to_string();
                if name.starts_with("hci") {
                    hcis.push(name);
                }
            }
            hcis.sort();

            if !hcis.is_empty() {
                let hci = &hcis[0];
                let mut state = "Off";
                if let Ok(subdirs) = std::fs::read_dir(format!("/sys/class/bluetooth/{}", hci)) {
                    for sub in subdirs.filter_map(|e| e.ok()) {
                        let sub_name = sub.file_name().to_string_lossy().to_string();
                        if sub_name.starts_with("rfkill") {
                            if let Ok(st) = std::fs::read_to_string(sub.path().join("state")) {
                                if st.trim() == "1" || st.trim() == "3" {
                                    state = "On";
                                }
                            }
                        }
                    }
                }

                let mut hw_info = None;
                if let Ok(canonical_device) =
                    std::fs::canonicalize(format!("/sys/class/bluetooth/{}/device", hci))
                {
                    let mut current = Some(canonical_device);
                    while let Some(path) = current {
                        let id_vendor = path.join("idVendor");
                        let id_product = path.join("idProduct");
                        let pci_vendor = path.join("vendor");
                        let pci_device = path.join("device");

                        if id_vendor.exists() && id_product.exists() {
                            if let (Ok(v), Ok(p)) = (
                                std::fs::read_to_string(id_vendor),
                                std::fs::read_to_string(id_product),
                            ) {
                                let v_clean = v.trim();
                                let p_clean = p.trim();
                                let vendor_name = lookup_usb_vendor(v_clean);
                                let product_name = lookup_usb_device(v_clean, p_clean);
                                match (vendor_name, product_name) {
                                    (Some(v_name), Some(p_name)) => {
                                        let v_disp = v_name
                                            .replace(", Inc.", "")
                                            .replace(" Corporation", "")
                                            .replace(" Co., Ltd.", "")
                                            .replace(" Co., Ltd", "");
                                        hw_info = Some(format!("{} {}", v_disp, p_name));
                                    }
                                    (Some(v_name), None) => {
                                        let v_disp = v_name
                                            .replace(", Inc.", "")
                                            .replace(" Corporation", "")
                                            .replace(" Co., Ltd.", "")
                                            .replace(" Co., Ltd", "");
                                        hw_info = Some(v_disp);
                                    }
                                    _ => {}
                                }
                                break;
                            }
                        } else if pci_vendor.exists()
                            && pci_device.exists()
                            && !pci_vendor.is_dir()
                            && !pci_device.is_dir()
                        {
                            if let (Ok(v), Ok(d)) = (
                                std::fs::read_to_string(pci_vendor),
                                std::fs::read_to_string(pci_device),
                            ) {
                                let v_clean = v.trim().trim_start_matches("0x").to_lowercase();
                                let d_clean = d.trim().trim_start_matches("0x").to_lowercase();
                                let vendor_name = crate::network::lookup_pci_vendor(&v_clean);
                                let product_name =
                                    crate::gpu::lookup_pci_device(&v_clean, &d_clean);
                                match (vendor_name, product_name) {
                                    (Some(v_name), Some(p_name)) => {
                                        let v_disp = v_name
                                            .replace(", Inc.", "")
                                            .replace(" Corporation", "")
                                            .replace(" Co., Ltd.", "")
                                            .replace(" Co., Ltd", "");
                                        hw_info = Some(format!("{} {}", v_disp, p_name));
                                    }
                                    (Some(v_name), None) => {
                                        let v_disp = v_name
                                            .replace(", Inc.", "")
                                            .replace(" Corporation", "")
                                            .replace(" Co., Ltd.", "")
                                            .replace(" Co., Ltd", "");
                                        hw_info = Some(v_disp);
                                    }
                                    _ => {}
                                }
                                break;
                            }
                        }
                        current = path.parent().map(|p| p.to_path_buf());
                    }
                }

                let mut connected_names = Vec::new();
                if let Ok(output) = std::process::Command::new("bluetoothctl")
                    .args(["devices", "Connected"])
                    .output()
                {
                    if let Ok(stdout) = String::from_utf8(output.stdout) {
                        for line in stdout.lines() {
                            let trimmed = line.trim();
                            if trimmed.starts_with("Device ") {
                                let parts: Vec<&str> = trimmed.split_whitespace().collect();
                                if parts.len() >= 3 {
                                    let name = parts[2..].join(" ");
                                    connected_names.push(name);
                                }
                            }
                        }
                    }
                }
                let mut info_str = state.to_string();
                info_str.push_str(&format!(" [{}]", hci));
                if let Some(hw) = hw_info {
                    info_str.push_str(&format!(" ({})", hw));
                }

                if state == "On" {
                    info_str.push_str(&format!(" - {} connected", connected_names.len()));
                    if !connected_names.is_empty() {
                        info_str.push_str(&format!(" ({})", connected_names.join(", ")));
                    }
                }

                return Some(info_str);
            }
        }
        None
    }

    #[cfg(target_os = "macos")]
    {
        if let Ok(output) = std::process::Command::new("system_profiler")
            .arg("SPBluetoothDataType")
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                return parse_macos_bluetooth(&stdout);
            }
        }
        None
    }

    #[cfg(target_os = "windows")]
    {
        let cmd = "$state = (Get-Service -Name bthserv -ErrorAction SilentlyContinue).Status; \
                   $adapter = (Get-PnpDevice -Class Bluetooth -ErrorAction SilentlyContinue | Where-Object {$_.FriendlyName -match 'Adapter|Controller|Radio|Intel|Realtek|Broadcom'} | Select-Object -First 1 -ExpandProperty FriendlyName); \
                   $devices = (Get-PnpDevice -Class Bluetooth -Status OK -ErrorAction SilentlyContinue | Where-Object {$_.FriendlyName -notmatch 'Adapter|Enumerator|Controller|LE Device|RFCOMM|Module|Service|Generic|Computer|Protocol|Phone|Device'} | Select-Object -ExpandProperty FriendlyName); \
                   Write-Output \"$state|$adapter|($($devices -join ','))\"";

        if let Ok(output) = std::process::Command::new("powershell")
            .args(["-Command", cmd])
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                return parse_windows_bluetooth_output(&stdout);
            }
        }
        None
    }

    #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
    {
        None
    }
}

#[cfg(target_os = "linux")]
fn lookup_usb_vendor(vendor_id: &str) -> Option<String> {
    let vendor_id = vendor_id.trim_start_matches("0x").to_lowercase();
    let paths = ["/usr/share/hwdata/usb.ids", "/usr/share/misc/usb.ids"];
    for path in &paths {
        if let Ok(content) = std::fs::read_to_string(path) {
            for line in content.lines() {
                if line.starts_with('#') || line.is_empty() {
                    continue;
                }
                if !line.starts_with('\t') {
                    let parts: Vec<&str> = line.split_whitespace().collect();
                    if parts.len() >= 2 && parts[0].to_lowercase() == vendor_id {
                        let name = line.strip_prefix(parts[0]).unwrap().trim();
                        return Some(name.to_string());
                    }
                }
            }
        }
    }
    None
}

#[cfg(target_os = "linux")]
fn lookup_usb_device(vendor_id: &str, product_id: &str) -> Option<String> {
    let vendor_id = vendor_id.trim_start_matches("0x").to_lowercase();
    let product_id = product_id.trim_start_matches("0x").to_lowercase();
    let paths = ["/usr/share/hwdata/usb.ids", "/usr/share/misc/usb.ids"];
    for path in &paths {
        if let Ok(content) = std::fs::read_to_string(path) {
            let mut in_vendor = false;
            for line in content.lines() {
                if line.starts_with('#') || line.is_empty() {
                    continue;
                }
                if !line.starts_with('\t') {
                    let parts: Vec<&str> = line.split_whitespace().collect();
                    in_vendor = parts.len() >= 2 && parts[0].to_lowercase() == vendor_id;
                } else if in_vendor && line.starts_with('\t') && !line.starts_with("\t\t") {
                    let trimmed = line.trim_start();
                    if let Some(stripped) = trimmed.strip_prefix(&product_id) {
                        let name = stripped.trim();
                        return Some(name.to_string());
                    }
                }
            }
        }
    }
    None
}

#[allow(dead_code)]
fn parse_macos_bluetooth(stdout: &str) -> Option<String> {
    let mut state = "Off";
    let mut connected_names = Vec::new();
    let mut chipset = None;
    let mut current_device = None;

    for line in stdout.lines() {
        let trimmed = line.trim();
        if trimmed.starts_with("Bluetooth Power:") || trimmed.starts_with("State:") {
            if trimmed.contains("On") {
                state = "On";
            }
        } else if trimmed.starts_with("Chipset:") {
            chipset = Some(trimmed.strip_prefix("Chipset:").unwrap().trim().to_string());
        } else if line.starts_with("          ") && !trimmed.is_empty() && trimmed.ends_with(':') {
            current_device = Some(trimmed.trim_end_matches(':').trim().to_string());
        } else if (trimmed.starts_with("Connected:") || trimmed.starts_with("Connection:"))
            && trimmed.contains("Yes")
        {
            if let Some(ref dev) = current_device {
                connected_names.push(dev.clone());
            }
        }
    }

    let mut info_str = state.to_string();
    if let Some(ch) = chipset {
        info_str.push_str(&format!(" (Apple {})", ch));
    } else {
        info_str.push_str(" (Apple Bluetooth)");
    }

    if state == "On" {
        info_str.push_str(&format!(" - {} connected", connected_names.len()));
        if !connected_names.is_empty() {
            info_str.push_str(&format!(" ({})", connected_names.join(", ")));
        }
    }
    Some(info_str)
}

#[allow(dead_code)]
fn parse_windows_bluetooth_output(stdout: &str) -> Option<String> {
    let parts: Vec<&str> = stdout.trim().split('|').collect();
    if parts.len() < 3 {
        return None;
    }
    let status_str = parts[0].trim();
    let adapter_str = parts[1].trim();
    let devices_str = parts[2]
        .trim()
        .trim_start_matches('(')
        .trim_end_matches(')');

    let state = if status_str.eq_ignore_ascii_case("running") {
        "On"
    } else {
        "Off"
    };

    let mut info_str = state.to_string();
    if !adapter_str.is_empty() {
        info_str.push_str(&format!(" ({})", adapter_str));
    }

    if state == "On" {
        let connected_names: Vec<String> = if devices_str.is_empty() {
            Vec::new()
        } else {
            devices_str
                .split(',')
                .map(|s| s.trim().to_string())
                .filter(|s| !s.is_empty())
                .collect()
        };

        info_str.push_str(&format!(" - {} connected", connected_names.len()));
        if !connected_names.is_empty() {
            info_str.push_str(&format!(" ({})", connected_names.join(", ")));
        }
    }
    Some(info_str)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_macos_bluetooth() {
        let sample = "Bluetooth:\n\n      Bluetooth Power: On\n      Chipset: BCM4350\n      Devices (Connected):\n          Sony WH-1000XM4:\n              Address: AA-BB-CC\n              Connected: Yes\n          Logitech MX Master:\n              Address: DD-EE-FF\n              Connected: Yes\n";
        assert_eq!(
            parse_macos_bluetooth(sample),
            Some(
                "On (Apple BCM4350) - 2 connected (Sony WH-1000XM4, Logitech MX Master)"
                    .to_string()
            )
        );

        let sample_off = "Bluetooth:\n\n      Bluetooth Power: Off\n";
        assert_eq!(
            parse_macos_bluetooth(sample_off),
            Some("Off (Apple Bluetooth)".to_string())
        );

        let sample_state_on = "Bluetooth:\n\n      State: On\n      Chipset: BCM_4388\n";
        assert_eq!(
            parse_macos_bluetooth(sample_state_on),
            Some("On (Apple BCM_4388) - 0 connected".to_string())
        );
    }

    #[test]
    fn test_parse_windows_bluetooth_output() {
        let sample =
            "Running | Intel(R) Wireless Bluetooth(R) | (Sony WH-1000XM4,Logitech MX Master)\n";
        assert_eq!(
            parse_windows_bluetooth_output(sample),
            Some("On (Intel(R) Wireless Bluetooth(R)) - 2 connected (Sony WH-1000XM4, Logitech MX Master)".to_string())
        );

        let sample_off = "Stopped | | ()\n";
        assert_eq!(
            parse_windows_bluetooth_output(sample_off),
            Some("Off".to_string())
        );
    }
}

// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 l1a

//! GPU detection and identification.
//!
//! Handles parsing PCI IDs and querying the system for graphics card
//! vendor and model information.

#[cfg(not(any(target_os = "macos", target_os = "windows")))]
use std::collections::HashSet;
use std::fs;

/// Information about a detected GPU.
#[derive(Debug, Clone, Default)]
pub struct GpuInfo {
    /// The marketing or model name of the GPU.
    pub name: String,
    /// Total VRAM in bytes, if detected.
    pub vram_bytes: Option<u64>,
}

impl GpuInfo {
    /// Formats the GPU name and VRAM into a human-readable string.
    pub fn format(&self) -> String {
        if let Some(vram) = self.vram_bytes {
            let vram_gb = vram as f64 / 1024.0 / 1024.0 / 1024.0;
            if vram_gb >= 1.0 {
                format!("{} ({:.0} GB)", self.name, vram_gb)
            } else {
                let vram_mb = vram / 1024 / 1024;
                format!("{} ({} MB)", self.name, vram_mb)
            }
        } else {
            self.name.clone()
        }
    }
}

/// Refines AMD GPU names by mapping codenames to marketing names.
pub fn improve_amd_gpu_name(name: &str) -> String {
    let codenames = [
        ("Phoenix1", "Radeon 780M"),
        ("Phoenix2", "Radeon 740M / 760M"),
        ("Renoir", "Radeon Graphics (Renoir)"),
        ("Lucienne", "Radeon Graphics (Lucienne)"),
        ("Cezanne", "Radeon Graphics (Cezanne)"),
        ("Barcelo", "Radeon Graphics (Barcelo)"),
        ("Rembrandt", "Radeon 680M"),
        ("Raphael", "Radeon Graphics (Raphael)"),
        ("Mendocino", "Radeon 610M"),
        ("Strix", "Radeon 880M / 890M"),
    ];

    for (codename, marketing) in codenames {
        if name.contains(codename) {
            return marketing.to_string();
        }
    }

    name.to_string()
}

/// Helper to lookup PCI device name in standard system pci.ids files.
pub fn lookup_pci_device(vendor_id: &str, device_id: &str) -> Option<String> {
    let vendor_id = vendor_id.trim_start_matches("0x").to_lowercase();
    let device_id = device_id.trim_start_matches("0x").to_lowercase();

    let paths = ["/usr/share/hwdata/pci.ids", "/usr/share/misc/pci.ids"];

    for path in &paths {
        if let Ok(content) = fs::read_to_string(path) {
            let mut in_vendor = false;
            for line in content.lines() {
                if line.starts_with('#') || line.is_empty() {
                    continue;
                }

                if !line.starts_with('\t') {
                    // Vendor line: "vendor_id  Vendor Name"
                    in_vendor = line.starts_with(&vendor_id);
                } else if in_vendor && line.starts_with('\t') && !line.starts_with("\t\t") {
                    // Device line: "\tdevice_id  Device Name"
                    let trimmed = line.trim_start();
                    if let Some(stripped) = trimmed.strip_prefix(&device_id) {
                        let name = stripped.trim();
                        return Some(name.to_string());
                    }
                }
            }
        }
    }
    None
}

/// Parses VRAM string (e.g. "8 GB", "1536 MB") into bytes.
pub fn parse_vram_str(s: &str) -> Option<u64> {
    let parts: Vec<&str> = s.split_whitespace().collect();
    if parts.len() >= 2 {
        if let Ok(val) = parts[0].parse::<f64>() {
            let unit = parts[1].to_uppercase();
            if unit.starts_with("GB") {
                return Some((val * 1024.0 * 1024.0 * 1024.0) as u64);
            } else if unit.starts_with("MB") {
                return Some((val * 1024.0 * 1024.0) as u64);
            } else if unit.starts_with("KB") {
                return Some((val * 1024.0) as u64);
            }
        }
    }
    None
}

/// Parses the output of `system_profiler SPDisplaysDataType` on macOS.
pub fn parse_system_profiler_displays(stdout: &str) -> Vec<GpuInfo> {
    let mut gpus = Vec::new();
    let mut current_gpu = None;
    for line in stdout.lines() {
        let trimmed = line.trim();
        if let Some(stripped) = trimmed.strip_prefix("Chipset Model:") {
            if let Some(gpu) = current_gpu.take() {
                gpus.push(gpu);
            }
            let name = stripped.trim().to_string();
            current_gpu = Some(GpuInfo {
                name,
                vram_bytes: None,
            });
        } else if let Some(stripped) = trimmed.strip_prefix("VRAM (Total):") {
            if let Some(ref mut gpu) = current_gpu {
                let vram_str = stripped.trim();
                gpu.vram_bytes = parse_vram_str(vram_str);
            }
        } else if let Some(stripped) = trimmed.strip_prefix("VRAM (Dynamic, Max):") {
            if let Some(ref mut gpu) = current_gpu {
                let vram_str = stripped.trim();
                gpu.vram_bytes = parse_vram_str(vram_str);
            }
        } else if trimmed.starts_with("Displays:") {
            if let Some(gpu) = current_gpu.take() {
                gpus.push(gpu);
            }
        }
    }
    if let Some(gpu) = current_gpu {
        gpus.push(gpu);
    }
    gpus
}

/// Parses the output of `wmic path win32_VideoController` or PowerShell CIM query for GPU information.
pub fn parse_wmi_videocontroller(output: &str) -> Vec<GpuInfo> {
    let mut gpus = Vec::new();
    let mut name = String::new();
    let mut vram = None;

    for line in output.lines() {
        let trimmed = line.trim();
        let parts: Vec<&str> = if trimmed.contains('=') {
            trimmed.splitn(2, '=').collect()
        } else if trimmed.contains(':') {
            trimmed.splitn(2, ':').collect()
        } else {
            continue;
        };

        if parts.len() == 2 {
            let key = parts[0].trim().to_lowercase();
            let val = parts[1].trim();

            if key == "name" {
                if !name.is_empty() {
                    gpus.push(GpuInfo {
                        name: name.clone(),
                        vram_bytes: vram,
                    });
                    vram = None;
                }
                name = val.to_string();
            } else if key == "adapterram" {
                if vram.is_some() && !name.is_empty() {
                    gpus.push(GpuInfo {
                        name: name.clone(),
                        vram_bytes: vram,
                    });
                    name = String::new();
                    vram = None;
                }
                if let Ok(bytes) = val.parse::<u64>() {
                    vram = Some(bytes);
                }
            }
        }
    }

    if !name.is_empty() {
        gpus.push(GpuInfo {
            name,
            vram_bytes: vram,
        });
    }

    gpus
}

/// Detects GPUs using system APIs or profiles.
pub fn detect_gpus() -> Vec<GpuInfo> {
    #[cfg(target_os = "macos")]
    {
        match std::process::Command::new("system_profiler")
            .arg("SPDisplaysDataType")
            .output()
        {
            Ok(output) => {
                if let Ok(stdout) = String::from_utf8(output.stdout) {
                    return parse_system_profiler_displays(&stdout);
                } else {
                    eprintln!("warning: system_profiler output was not valid UTF-8");
                }
            }
            Err(e) => {
                eprintln!("warning: failed to run system_profiler SPDisplaysDataType: {} (GPU detection skipped)", e);
            }
        }
        Vec::new()
    }

    #[cfg(target_os = "windows")]
    {
        // Try WMIC first
        let mut wmic_ok = false;
        match std::process::Command::new("wmic")
            .args([
                "path",
                "win32_VideoController",
                "get",
                "Name,AdapterRAM",
                "/value",
            ])
            .output()
        {
            Ok(output) => {
                if let Ok(stdout) = String::from_utf8(output.stdout) {
                    let gpus = parse_wmi_videocontroller(&stdout);
                    if !gpus.is_empty() {
                        return gpus;
                    }
                    wmic_ok = true;
                }
            }
            Err(e) => {
                eprintln!("warning: wmic failed: {} (trying PowerShell fallback)", e);
            }
        }

        // Fallback to PowerShell
        if !wmic_ok {
            match std::process::Command::new("powershell")
                .args(["-Command", "Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM | Format-List"])
                .output()
            {
                Ok(output) => {
                    if let Ok(stdout) = String::from_utf8(output.stdout) {
                        return parse_wmi_videocontroller(&stdout);
                    } else {
                        eprintln!("warning: powershell output was not valid UTF-8");
                    }
                }
                Err(e) => {
                    eprintln!("warning: powershell failed: {} (GPU detection skipped)", e);
                }
            }
        }

        Vec::new()
    }

    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    {
        let mut gpus = Vec::new();
        let mut seen_devices = HashSet::new();

        // Scan /sys/class/drm for all card* and renderD* entries
        if let Ok(entries) = std::fs::read_dir("/sys/class/drm") {
            for entry in entries.flatten() {
                let name = entry.file_name().into_string().unwrap_or_default();
                if !name.starts_with("card") && !name.starts_with("renderD") {
                    continue;
                }

                let device_path = entry.path().join("device");
                if let Ok(real_path) = std::fs::canonicalize(&device_path) {
                    if !seen_devices.insert(real_path) {
                        continue;
                    }

                    // Try to identify vendor and model
                    let vendor_id = fs::read_to_string(device_path.join("vendor"))
                        .unwrap_or_default()
                        .trim()
                        .to_string();
                    let device_id = fs::read_to_string(device_path.join("device"))
                        .unwrap_or_default()
                        .trim()
                        .to_string();

                    if vendor_id.is_empty() || device_id.is_empty() {
                        continue;
                    }

                    let mut gpu_name =
                        lookup_pci_device(&vendor_id, &device_id).unwrap_or_else(|| {
                            if vendor_id.contains("10de") {
                                "NVIDIA GPU".to_string()
                            } else if vendor_id.contains("1002") {
                                "AMD GPU".to_string()
                            } else if vendor_id.contains("8086") {
                                "Intel GPU".to_string()
                            } else {
                                "Unknown GPU".to_string()
                            }
                        });

                    // Refine AMD GPU names
                    if vendor_id.contains("1002") {
                        gpu_name = improve_amd_gpu_name(&gpu_name);
                    }

                    // NVIDIA special case: try /proc for even better name
                    if vendor_id.contains("10de") {
                        if let Ok(pci_slot_path) = fs::read_link(&device_path) {
                            if let Some(slot_name) = pci_slot_path.file_name() {
                                let proc_info_path = format!(
                                    "/proc/driver/nvidia/gpus/{}/information",
                                    slot_name.to_string_lossy()
                                );
                                if let Ok(info) = fs::read_to_string(proc_info_path) {
                                    for line in info.lines() {
                                        if line.starts_with("Model:") {
                                            gpu_name =
                                                line.replace("Model:", "").trim().to_string();
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    let mut vram_bytes = None;
                    // Try to get VRAM from common sysfs locations (mainly AMD)
                    let vram_path = device_path.join("mem_info_vram_total");
                    if let Ok(vram_str) = fs::read_to_string(vram_path) {
                        if let Ok(v) = vram_str.trim().parse::<u64>() {
                            vram_bytes = Some(v);
                        }
                    }

                    gpus.push(GpuInfo {
                        name: gpu_name,
                        vram_bytes,
                    });
                }
            }
        }

        if gpus.is_empty() {
            // Fallback for non-standard setups or if /sys/class/drm is empty
            if let Ok(model) = fs::read_to_string("/sys/class/drm/card0/device/model") {
                let model = model.trim();
                if !model.is_empty() {
                    gpus.push(GpuInfo {
                        name: model.to_string(),
                        vram_bytes: None,
                    });
                }
            }
        }

        gpus
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_gpu_info_format() {
        let info = GpuInfo {
            name: "NVIDIA GeForce RTX 4090".to_string(),
            vram_bytes: Some(24 * 1024 * 1024 * 1024),
        };
        assert_eq!(info.format(), "NVIDIA GeForce RTX 4090 (24 GB)");

        let info = GpuInfo {
            name: "Intel Arc A770".to_string(),
            vram_bytes: Some(16 * 1024 * 1024 * 1024),
        };
        assert_eq!(info.format(), "Intel Arc A770 (16 GB)");

        let info = GpuInfo {
            name: "Radeon 780M".to_string(),
            vram_bytes: Some(512 * 1024 * 1024),
        };
        assert_eq!(info.format(), "Radeon 780M (512 MB)");

        let info = GpuInfo {
            name: "Generic GPU".to_string(),
            vram_bytes: None,
        };
        assert_eq!(info.format(), "Generic GPU");
    }

    #[test]
    fn test_improve_amd_gpu_name() {
        assert_eq!(
            improve_amd_gpu_name("AMD Radeon Phoenix1 Graphics"),
            "Radeon 780M"
        );
        assert_eq!(improve_amd_gpu_name("AMD Rembrandt"), "Radeon 680M");
        assert_eq!(improve_amd_gpu_name("Unknown GPU"), "Unknown GPU");
    }

    #[test]
    fn test_parse_vram_str() {
        assert_eq!(parse_vram_str("8 GB"), Some(8 * 1024 * 1024 * 1024));
        assert_eq!(parse_vram_str("1536 MB"), Some(1536 * 1024 * 1024));
        assert_eq!(parse_vram_str("512 MB"), Some(512 * 1024 * 1024));
        assert_eq!(parse_vram_str("1024 KB"), Some(1024 * 1024));
        assert_eq!(parse_vram_str("invalid"), None);
        assert_eq!(parse_vram_str("8"), None);
    }

    #[test]
    fn test_parse_system_profiler_displays() {
        let mock_output = r#"
Graphics/Displays:

    Apple M1 Max:

      Chipset Model: Apple M1 Max
      Type: GPU
      Bus: Built-In
      Total Number of Cores: 32
      Vendor: Apple (0x106b)
      Metal Support: Metal 3
      VRAM (Dynamic, Max): 8192 MB
      Displays:
        Color LCD:
          Display Type: Built-In Retina LCD

    Intel UHD Graphics 630:

      Chipset Model: Intel UHD Graphics 630
      Type: GPU
      Bus: Built-In
      VRAM (Total): 1536 MB
      Vendor: Intel (0x8086)
"#;
        let gpus = parse_system_profiler_displays(mock_output);
        assert_eq!(gpus.len(), 2);
        assert_eq!(gpus[0].name, "Apple M1 Max");
        assert_eq!(gpus[0].vram_bytes, Some(8192 * 1024 * 1024));
        assert_eq!(gpus[1].name, "Intel UHD Graphics 630");
        assert_eq!(gpus[1].vram_bytes, Some(1536 * 1024 * 1024));
    }

    #[test]
    fn test_parse_wmi_videocontroller() {
        let wmic_output = r#"
AdapterRAM=4294967296
Name=NVIDIA GeForce RTX 4090

AdapterRAM=2147483648
Name=Intel(R) UHD Graphics 770
"#;
        let gpus = parse_wmi_videocontroller(wmic_output);
        assert_eq!(gpus.len(), 2);
        assert_eq!(gpus[0].name, "NVIDIA GeForce RTX 4090");
        assert_eq!(gpus[0].vram_bytes, Some(4294967296));
        assert_eq!(gpus[1].name, "Intel(R) UHD Graphics 770");
        assert_eq!(gpus[1].vram_bytes, Some(2147483648));

        let powershell_output = r#"
Name       : NVIDIA GeForce RTX 4090
AdapterRAM : 4294967296

Name       : Intel(R) UHD Graphics 770
AdapterRAM : 2147483648
"#;
        let gpus = parse_wmi_videocontroller(powershell_output);
        assert_eq!(gpus.len(), 2);
        assert_eq!(gpus[0].name, "NVIDIA GeForce RTX 4090");
        assert_eq!(gpus[0].vram_bytes, Some(4294967296));
        assert_eq!(gpus[1].name, "Intel(R) UHD Graphics 770");
        assert_eq!(gpus[1].vram_bytes, Some(2147483648));
    }
}

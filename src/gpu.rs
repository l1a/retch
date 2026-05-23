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
                    if trimmed.starts_with(&device_id) {
                        let name = trimmed[device_id.len()..].trim();
                        return Some(name.to_string());
                    }
                }
            }
        }
    }
    None
}

/// Detects GPUs using sysfs and PCI database lookups.
pub fn detect_gpus() -> Vec<GpuInfo> {
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

                let mut gpu_name = lookup_pci_device(&vendor_id, &device_id).unwrap_or_else(|| {
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
                                        gpu_name = line.replace("Model:", "").trim().to_string();
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
        assert_eq!(improve_amd_gpu_name("AMD Radeon Phoenix1 Graphics"), "Radeon 780M");
        assert_eq!(improve_amd_gpu_name("AMD Rembrandt"), "Radeon 680M");
        assert_eq!(improve_amd_gpu_name("Unknown GPU"), "Unknown GPU");
    }
}

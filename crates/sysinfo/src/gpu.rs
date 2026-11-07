// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! GPU detection and identification.
//!
//! Handles parsing PCI IDs and querying the system for graphics card
//! vendor and model information.

#[cfg(not(any(target_os = "macos", target_os = "windows")))]
use std::collections::HashSet;
use std::fs;

/// Information about a detected GPU.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct GpuInfo {
    /// The marketing or model name of the GPU.
    pub name: String,
    /// Total VRAM in bytes, if detected.
    pub vram_bytes: Option<u64>,
    /// Compute Unit / GPU core count, if detected.
    pub cores: Option<u32>,
    /// Maximum GPU engine clock in MHz, if detected.
    pub clock_mhz: Option<u32>,
    /// `"Integrated"` or `"Discrete"`, if detected.
    pub gpu_type: Option<String>,
}

impl GpuInfo {
    /// Formats the GPU name, cores, clock, VRAM, and type into a human-readable string.
    pub fn format(&self) -> String {
        let mut details = Vec::new();
        if let Some(cores) = self.cores.filter(|&c| c > 0) {
            details.push(format!("{cores} cores"));
        }
        if let Some(mhz) = self.clock_mhz.filter(|&m| m > 0) {
            if mhz >= 1000 {
                details.push(format!("{:.2} GHz", mhz as f64 / 1000.0));
            } else {
                details.push(format!("{mhz} MHz"));
            }
        }
        if let Some(vram) = self.vram_bytes {
            let vram_gb = vram as f64 / 1024.0 / 1024.0 / 1024.0;
            if vram_gb >= 1.0 {
                details.push(format!("{:.0} GB", vram_gb));
            } else {
                let vram_mb = vram / 1024 / 1024;
                details.push(format!("{} MB", vram_mb));
            }
        }
        let detail_str = if details.is_empty() {
            String::new()
        } else {
            format!(" ({})", details.join(", "))
        };
        let type_str = match self.gpu_type.as_deref() {
            Some(t) if !t.is_empty() => format!(" [{t}]"),
            _ => String::new(),
        };
        format!("{}{}{}", self.name, detail_str, type_str)
    }
}

/// Refines AMD GPU names by mapping codenames to marketing names.
///
/// Fallback only: on Linux, [`lookup_amdgpu_ids`] is consulted first — it resolves the
/// exact marketing name from the device *and revision*, which this table cannot (e.g.
/// Strix Halo `1586` is an 8040S, 8050S, or 8060S depending on revision).
///
/// Matching is first-substring-wins, so more specific codenames MUST come before their
/// prefixes: "Strix Halo" before "Strix" (a `1586` "Strix Halo [...]" pci.ids name once
/// matched the "Strix" entry and was mislabeled as the Strix Point 880M/890M).
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
        ("Strix Halo", "Radeon 8050S / 8060S"),
        ("Strix", "Radeon 880M / 890M"),
        ("Krackan", "Radeon 840M / 860M"),
    ];

    for (codename, marketing) in codenames {
        if name.contains(codename) {
            return marketing.to_string();
        }
    }

    name.to_string()
}

/// Looks up an AMD GPU's exact marketing name in libdrm's `amdgpu.ids` database content.
///
/// The database is keyed by *(device id, revision id)*, which is what disambiguates
/// same-device variants that pci.ids lumps together (Strix Halo `1586` rev `C1` is the
/// "AMD Radeon 8060S Graphics", rev `C2` the 8050S, rev `D5` the 8040S). This mirrors how
/// fastfetch resolves AMD names on Linux.
///
/// Format (after `#` comments and a bare version line): `device_id,\trevision_id,\tname`.
/// IDs are bare uppercase hex; sysfs-style `0x`-prefixed lowercase input is accepted.
/// Malformed lines are skipped. The name is the remainder after the second comma, so
/// commas in product names are safe.
pub fn lookup_amdgpu_ids_in(content: &str, device_id: &str, revision_id: &str) -> Option<String> {
    let device_id = device_id.trim().trim_start_matches("0x");
    let revision_id = revision_id.trim().trim_start_matches("0x");

    for line in content.lines() {
        let line = line.trim();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        let mut parts = line.splitn(3, ',');
        let (Some(dev), Some(rev), Some(name)) = (parts.next(), parts.next(), parts.next()) else {
            continue; // version line or malformed
        };
        if dev.trim().eq_ignore_ascii_case(device_id)
            && rev.trim().eq_ignore_ascii_case(revision_id)
        {
            let name = name.trim();
            if !name.is_empty() {
                return Some(name.to_string());
            }
        }
    }
    None
}

/// Reads libdrm's `amdgpu.ids` and resolves the exact AMD marketing name, if present.
#[cfg(not(any(target_os = "macos", target_os = "windows")))]
fn lookup_amdgpu_ids(device_id: &str, revision_id: &str) -> Option<String> {
    let content = fs::read_to_string("/usr/share/libdrm/amdgpu.ids").ok()?;
    lookup_amdgpu_ids_in(&content, device_id, revision_id)
}

/// Extracts the device name udev resolved from its hardware database, from the content of
/// a udev device data file (`/run/udev/data/+pci:<slot>`).
///
/// udev resolves every PCI device's name at boot and stores it as
/// `E:ID_MODEL_FROM_DATABASE=<name>`, in the same form pci.ids gives (e.g.
/// `Raptor Lake-P [Iris Xe Graphics]`). Reading that ~300-byte file costs microseconds, while
/// walking the ~1.6 MB pci.ids costs milliseconds per device: 4 ms for an Intel iGPU near the
/// end of the file, cold. Returns `None` if the key is missing or empty, so the caller can
/// fall back to pci.ids.
pub fn parse_udev_pci_model(data: &str) -> Option<String> {
    data.lines()
        .find_map(|line| line.strip_prefix("E:ID_MODEL_FROM_DATABASE="))
        .map(str::trim)
        .filter(|name| !name.is_empty())
        .map(str::to_string)
}

/// Extracts the marketing name from the NVIDIA driver's
/// `/proc/driver/nvidia/gpus/<slot>/information` content (`Model: \t\t NVIDIA GeForce MX550`).
///
/// Returns `None` if there is no `Model:` line or its value is empty.
pub fn parse_nvidia_proc_model(info: &str) -> Option<String> {
    info.lines()
        .find_map(|line| line.strip_prefix("Model:"))
        .map(str::trim)
        .filter(|name| !name.is_empty())
        .map(str::to_string)
}

/// Picks a GPU's display name from the available sources, querying each only if needed.
///
/// Order, first hit wins:
/// 1. **NVIDIA**: the proprietary driver's own model name (`nvidia_driver_model`). It is the
///    most specific source and has always won, so nothing else is looked up for it.
/// 2. **AMD**: libdrm's `amdgpu.ids` (`amdgpu_ids`), the only source keyed by revision.
/// 3. udev's resolved name (`udev_model`), then pci.ids (`pci_ids`), then a generic vendor
///    name. AMD names from this step still go through [`improve_amd_gpu_name`].
///
/// Each source is a closure so that the expensive ones are never run when a cheaper one has
/// already answered. That laziness is the point: the pci.ids walk used to be the whole
/// critical path of `retch --short` on a two-GPU laptop.
pub fn resolve_gpu_name(
    vendor_id: &str,
    nvidia_driver_model: impl FnOnce() -> Option<String>,
    amdgpu_ids: impl FnOnce() -> Option<String>,
    udev_model: impl FnOnce() -> Option<String>,
    pci_ids: impl FnOnce() -> Option<String>,
) -> String {
    let is_nvidia = vendor_id.contains("10de");
    let is_amd = vendor_id.contains("1002");

    if is_nvidia {
        if let Some(name) = nvidia_driver_model() {
            return name;
        }
    }
    if is_amd {
        if let Some(name) = amdgpu_ids() {
            return name;
        }
    }

    let name = udev_model().or_else(pci_ids).unwrap_or_else(|| {
        if is_nvidia {
            "NVIDIA GPU".to_string()
        } else if is_amd {
            "AMD GPU".to_string()
        } else if vendor_id.contains("8086") {
            "Intel GPU".to_string()
        } else {
            "Unknown GPU".to_string()
        }
    });
    if is_amd {
        improve_amd_gpu_name(&name)
    } else {
        name
    }
}

/// Reads udev's resolved name for the PCI device in `slot` (e.g. `0000:00:02.0`).
#[cfg(not(any(target_os = "macos", target_os = "windows")))]
fn read_udev_pci_model(slot: &str) -> Option<String> {
    let data = fs::read_to_string(format!("/run/udev/data/+pci:{slot}")).ok()?;
    parse_udev_pci_model(&data)
}

/// Reads the NVIDIA proprietary driver's model name for the GPU in `slot`, if it is loaded.
#[cfg(not(any(target_os = "macos", target_os = "windows")))]
fn read_nvidia_proc_model(slot: &str) -> Option<String> {
    let info = fs::read_to_string(format!("/proc/driver/nvidia/gpus/{slot}/information")).ok()?;
    parse_nvidia_proc_model(&info)
}

/// Helper to lookup PCI device name in standard system pci.ids files.
///
/// Slow: it reads and walks the whole ~1.6 MB file on every call. Prefer
/// [`resolve_gpu_name`], which only falls back to this when udev has no name.
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
                ..Default::default()
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
                        ..Default::default()
                    });
                    vram = None;
                }
                name = val.to_string();
            } else if key == "adapterram" {
                if vram.is_some() && !name.is_empty() {
                    gpus.push(GpuInfo {
                        name: name.clone(),
                        vram_bytes: vram,
                        ..Default::default()
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
            ..Default::default()
        });
    }

    gpus
}

/// Parsed AMD KFD (`amdkfd`) topology node properties from
/// `/sys/devices/virtual/kfd/kfd/topology/nodes/*/properties`.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct KfdGpuProperties {
    /// PCI vendor ID in decimal (`4098` = `0x1002`).
    pub vendor_id: u32,
    /// PCI device ID in decimal (`5510` = `0x1586`).
    pub device_id: u32,
    /// Compute Unit count (`simd_count / simd_per_cu`).
    pub compute_units: Option<u32>,
    /// Maximum GPU engine clock in MHz (`max_engine_clk_fcompute`).
    pub max_clock_mhz: Option<u32>,
    /// `Some(true)` when `local_mem_size == 0` (integrated APU), `Some(false)` when `> 0`.
    pub is_integrated: Option<bool>,
}

/// Parses a single `/sys/devices/virtual/kfd/kfd/topology/nodes/<N>/properties` file.
/// Returns `None` for CPU-only KFD nodes (`simd_count == 0` or `device_id == 0`).
pub fn parse_kfd_gpu_properties(content: &str) -> Option<KfdGpuProperties> {
    let mut vendor_id: u32 = 0;
    let mut device_id: u32 = 0;
    let mut simd_count: u32 = 0;
    let mut simd_per_cu: u32 = 0;
    let mut max_clock_mhz: Option<u32> = None;
    let mut local_mem_size: Option<u64> = None;

    for line in content.lines() {
        let mut parts = line.split_whitespace();
        let (Some(key), Some(val)) = (parts.next(), parts.next()) else {
            continue;
        };
        match key {
            "vendor_id" => vendor_id = val.parse().unwrap_or(0),
            "device_id" => device_id = val.parse().unwrap_or(0),
            "simd_count" => simd_count = val.parse().unwrap_or(0),
            "simd_per_cu" => simd_per_cu = val.parse().unwrap_or(0),
            "max_engine_clk_fcompute" => {
                max_clock_mhz = val.parse::<u32>().ok().filter(|&v| v > 0);
            }
            "local_mem_size" => {
                local_mem_size = val.parse::<u64>().ok();
            }
            _ => {}
        }
    }

    if vendor_id == 0 || device_id == 0 || simd_count == 0 {
        return None;
    }

    let compute_units = simd_count.checked_div(simd_per_cu);

    Some(KfdGpuProperties {
        vendor_id,
        device_id,
        compute_units,
        max_clock_mhz,
        is_integrated: local_mem_size.map(|sz| sz == 0),
    })
}

/// Parses the highest clock frequency in MHz from AMD's `/sys/class/drm/cardN/device/pp_dpm_sclk`
/// (e.g. `"0: 600Mhz *\n1: 1100Mhz \n2: 2900Mhz \n"` -> `Some(2900)`).
pub fn parse_pp_dpm_sclk_max_mhz(content: &str) -> Option<u32> {
    content
        .lines()
        .filter_map(|line| {
            let token = line.split_whitespace().nth(1)?;
            let num = token
                .strip_suffix("Mhz")
                .or_else(|| token.strip_suffix("MHz"))
                .or_else(|| token.strip_suffix("mhz"))?;
            num.parse::<u32>().ok()
        })
        .max()
        .filter(|&v| v > 0)
}

#[cfg(not(any(target_os = "macos", target_os = "windows")))]
fn read_kfd_gpu_nodes() -> Vec<KfdGpuProperties> {
    let Ok(entries) = fs::read_dir("/sys/devices/virtual/kfd/kfd/topology/nodes") else {
        return Vec::new();
    };
    entries
        .flatten()
        .filter_map(|e| {
            let content = fs::read_to_string(e.path().join("properties")).ok()?;
            parse_kfd_gpu_properties(&content)
        })
        .collect()
}

/// Detects GPUs using system APIs or profiles.
pub fn detect_gpus() -> Vec<GpuInfo> {
    #[cfg(target_os = "macos")]
    {
        crate::macos_ffi::get_gpus()
            .into_iter()
            .map(|(name, vram_bytes)| GpuInfo {
                name,
                vram_bytes,
                ..Default::default()
            })
            .collect()
    }

    #[cfg(target_os = "windows")]
    {
        // Read GPU info from the display adapter device class in the registry.
        // HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\<NNNN>
        // Each numbered subkey represents one adapter.
        use crate::win_reg;
        const ADAPTER_CLASS: &str =
            "SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}";

        let mut gpus = Vec::new();
        for subkey_name in win_reg::enum_reg_subkeys(win_reg::HKEY_LOCAL_MACHINE, ADAPTER_CLASS) {
            // Skip the "Properties" subkey and any non-numeric entries
            if subkey_name.eq_ignore_ascii_case("Properties") {
                continue;
            }
            let subkey = format!("{}\\{}", ADAPTER_CLASS, subkey_name);
            let name = win_reg::get_reg_string(win_reg::HKEY_LOCAL_MACHINE, &subkey, "DriverDesc")
                .unwrap_or_default();
            if name.is_empty() {
                continue;
            }
            // VRAM is stored as REG_BINARY (little-endian u64) in HardwareInformation.MemorySize
            let vram_bytes = win_reg::get_reg_binary(
                win_reg::HKEY_LOCAL_MACHINE,
                &subkey,
                "HardwareInformation.MemorySize",
            )
            .and_then(|b| {
                if b.len() >= 8 {
                    Some(u64::from_le_bytes(b[..8].try_into().ok()?))
                } else if b.len() >= 4 {
                    Some(u32::from_le_bytes(b[..4].try_into().ok()?) as u64)
                } else {
                    None
                }
            })
            .filter(|&v| v > 0);
            gpus.push(GpuInfo {
                name: name.clone(),
                vram_bytes,
                ..Default::default()
            });
        }

        if gpus.is_empty() {
            eprintln!("warning: GPU detection failed on Windows (registry adapter class returned no results)");
        }

        gpus
    }

    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    {
        let mut gpus = Vec::new();
        let mut seen_devices = HashSet::new();
        let kfd_nodes = read_kfd_gpu_nodes();

        // Scan /sys/class/drm for all card* and renderD* entries
        if let Ok(entries) = std::fs::read_dir("/sys/class/drm") {
            for entry in entries.flatten() {
                let name = entry.file_name().into_string().unwrap_or_default();
                if !name.starts_with("card") && !name.starts_with("renderD") {
                    continue;
                }
                if name.contains('-') {
                    // Connector entry like `card1-DP-4`
                    continue;
                }

                let device_path = entry.path().join("device");
                if let Ok(real_path) = std::fs::canonicalize(&device_path) {
                    // The canonical device directory is named after its PCI slot
                    // (`0000:01:00.0`), which keys both udev's data and NVIDIA's /proc entry.
                    let slot = real_path
                        .file_name()
                        .map(|s| s.to_string_lossy().into_owned())
                        .unwrap_or_default();
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

                    // AMD: libdrm's amdgpu.ids is keyed by device + revision — the only
                    // source that separates same-device variants (8040S/8050S/8060S).
                    let gpu_name = resolve_gpu_name(
                        &vendor_id,
                        || read_nvidia_proc_model(&slot),
                        || {
                            fs::read_to_string(device_path.join("revision"))
                                .ok()
                                .and_then(|rev| lookup_amdgpu_ids(&device_id, rev.trim()))
                        },
                        || read_udev_pci_model(&slot),
                        || lookup_pci_device(&vendor_id, &device_id),
                    );

                    let mut vram_bytes = None;
                    // Try to get VRAM from common sysfs locations (mainly AMD)
                    let vram_path = device_path.join("mem_info_vram_total");
                    if let Ok(vram_str) = fs::read_to_string(vram_path) {
                        if let Ok(v) = vram_str.trim().parse::<u64>() {
                            vram_bytes = Some(v);
                        }
                    }

                    let vendor_num =
                        u32::from_str_radix(vendor_id.trim_start_matches("0x"), 16).unwrap_or(0);
                    let device_num =
                        u32::from_str_radix(device_id.trim_start_matches("0x"), 16).unwrap_or(0);
                    let kfd = kfd_nodes
                        .iter()
                        .find(|n| n.vendor_id == vendor_num && n.device_id == device_num);

                    let cores = kfd.and_then(|n| n.compute_units);
                    let clock_mhz = kfd
                        .and_then(|n| n.max_clock_mhz)
                        .or_else(|| {
                            fs::read_to_string(device_path.join("pp_dpm_sclk"))
                                .ok()
                                .and_then(|s| parse_pp_dpm_sclk_max_mhz(&s))
                        })
                        .or_else(|| {
                            fs::read_to_string(entry.path().join("gt_max_freq_mhz"))
                                .or_else(|_| {
                                    fs::read_to_string(entry.path().join("gt/gt0/rps_max_freq_mhz"))
                                })
                                .ok()
                                .and_then(|s| s.trim().parse::<u32>().ok())
                                .filter(|&v| v > 0)
                        });

                    let pci_class = fs::read_to_string(device_path.join("class"))
                        .unwrap_or_default()
                        .trim()
                        .to_ascii_lowercase();
                    let gpu_type = match kfd.and_then(|n| n.is_integrated) {
                        Some(true) => Some("Integrated".to_string()),
                        Some(false) => Some("Discrete".to_string()),
                        None if vendor_num == 0x10de => Some("Discrete".to_string()),
                        None if vendor_num == 0x8086 => {
                            if slot.ends_with("00:02.0") {
                                Some("Integrated".to_string())
                            } else {
                                Some("Discrete".to_string())
                            }
                        }
                        None if vendor_num == 0x1002 && pci_class.starts_with("0x0380") => {
                            Some("Integrated".to_string())
                        }
                        None => None,
                    };

                    gpus.push(GpuInfo {
                        name: gpu_name,
                        vram_bytes,
                        cores,
                        clock_mhz,
                        gpu_type,
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
                        ..Default::default()
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
            ..Default::default()
        };
        assert_eq!(info.format(), "NVIDIA GeForce RTX 4090 (24 GB)");

        let info = GpuInfo {
            name: "Intel Arc A770".to_string(),
            vram_bytes: Some(16 * 1024 * 1024 * 1024),
            ..Default::default()
        };
        assert_eq!(info.format(), "Intel Arc A770 (16 GB)");

        let info = GpuInfo {
            name: "Radeon 780M".to_string(),
            vram_bytes: Some(512 * 1024 * 1024),
            ..Default::default()
        };
        assert_eq!(info.format(), "Radeon 780M (512 MB)");

        let info = GpuInfo {
            name: "Generic GPU".to_string(),
            vram_bytes: None,
            ..Default::default()
        };
        assert_eq!(info.format(), "Generic GPU");

        let info = GpuInfo {
            name: "AMD Radeon 890M Graphics".to_string(),
            vram_bytes: Some(512 * 1024 * 1024),
            cores: Some(16),
            clock_mhz: Some(2900),
            gpu_type: Some("Integrated".to_string()),
        };
        assert_eq!(
            info.format(),
            "AMD Radeon 890M Graphics (16 cores, 2.90 GHz, 512 MB) [Integrated]"
        );
    }

    #[test]
    fn test_parse_kfd_gpu_properties() {
        let props = "\
cpu_cores_count 0
simd_count 64
mem_banks_count 1
caches_count 106
io_links_count 1
p2p_links_count 0
cpu_core_id_base 0
simd_id_base 2147487744
max_waves_per_simd 16
lds_size_in_kb 64
gds_size_in_kb 0
num_gws 64
wave_front_size 32
array_count 2
simd_arrays_per_engine 2
cu_per_simd_array 8
simd_per_cu 4
max_slots_scratch_cu 32
gfx_target_version 110500
vendor_id 4098
device_id 5390
location_id 50176
domain 0
drm_render_minor 128
hive_id 0
num_sdma_engines 1
num_sdma_xgmi_engines 0
num_sdma_queues_per_engine 8
num_cp_queues 8
max_engine_clk_fcompute 2900
local_mem_size 0
";
        let parsed = parse_kfd_gpu_properties(props).expect("should parse valid KFD GPU node");
        assert_eq!(parsed.vendor_id, 0x1002);
        assert_eq!(parsed.device_id, 0x150e);
        assert_eq!(parsed.compute_units, Some(16));
        assert_eq!(parsed.max_clock_mhz, Some(2900));
        assert_eq!(parsed.is_integrated, Some(true));

        // CPU-only node (simd_count 0) should return None.
        let cpu_props = "cpu_cores_count 24\nsimd_count 0\ndrm_render_minor 0\n";
        assert!(parse_kfd_gpu_properties(cpu_props).is_none());
    }

    #[test]
    fn test_parse_pp_dpm_sclk_max_mhz() {
        let dpm = "\
0: 600Mhz *
1: 1110Mhz
2: 2900Mhz
";
        assert_eq!(parse_pp_dpm_sclk_max_mhz(dpm), Some(2900));
        assert_eq!(parse_pp_dpm_sclk_max_mhz(""), None);
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
    fn test_improve_amd_gpu_name_strix_halo_before_strix() {
        // Regression: "Strix Halo" (8050S/8060S) must not be swallowed by the "Strix"
        // (Strix Point, 880M/890M) substring — first-substring-wins makes order load-bearing.
        assert_eq!(
            improve_amd_gpu_name(
                "Strix Halo [Radeon Graphics / Radeon 8050S Graphics / Radeon 8060S Graphics]"
            ),
            "Radeon 8050S / 8060S"
        );
        assert_eq!(
            improve_amd_gpu_name("Strix [Radeon 880M / 890M]"),
            "Radeon 880M / 890M"
        );
        assert_eq!(
            improve_amd_gpu_name("Krackan [Radeon 840M / 860M Graphics]"),
            "Radeon 840M / 860M"
        );
    }

    // Shape of /usr/share/libdrm/amdgpu.ids: comments, a bare version line, then
    // "device_id,\trevision_id,\tname" rows (bare uppercase hex ids).
    const AMDGPU_IDS_FIXTURE: &str = "\
# List of AMDGPU IDs
#
# Syntax:
# device_id,\trevision_id,\tproduct_name        <-- single tab after comma

1.0.0
1114,\tC2,\tAMD Radeon 860M Graphics
1586,\tC1,\tAMD Radeon 8060S Graphics
1586,\tC2,\tAMD Radeon 8050S Graphics
1586,\tD5,\tAMD Radeon 8040S Graphics
15DD,\tC3,\tAMD Radeon(TM) Vega 8 Graphics
garbage line without commas
731F,\tC1,\tAMD Radeon RX 5700 XT
";

    #[test]
    fn test_lookup_amdgpu_ids_revision_disambiguates() {
        // The same device id resolves to different products by revision — the reason this
        // source is preferred over pci.ids (which lumps all 1586 variants together).
        assert_eq!(
            lookup_amdgpu_ids_in(AMDGPU_IDS_FIXTURE, "1586", "C1"),
            Some("AMD Radeon 8060S Graphics".to_string())
        );
        assert_eq!(
            lookup_amdgpu_ids_in(AMDGPU_IDS_FIXTURE, "1586", "C2"),
            Some("AMD Radeon 8050S Graphics".to_string())
        );
        assert_eq!(
            lookup_amdgpu_ids_in(AMDGPU_IDS_FIXTURE, "1586", "D5"),
            Some("AMD Radeon 8040S Graphics".to_string())
        );
    }

    #[test]
    fn test_lookup_amdgpu_ids_accepts_sysfs_style_ids() {
        // sysfs reports "0x1586" / "0xc1"; the database stores "1586" / "C1".
        assert_eq!(
            lookup_amdgpu_ids_in(AMDGPU_IDS_FIXTURE, "0x1586", "0xc1"),
            Some("AMD Radeon 8060S Graphics".to_string())
        );
    }

    #[test]
    fn test_lookup_amdgpu_ids_no_match_and_junk_lines() {
        // Unknown device or revision → None (caller falls back to pci.ids); comments,
        // the version line, and malformed rows must not match or panic.
        assert_eq!(lookup_amdgpu_ids_in(AMDGPU_IDS_FIXTURE, "9999", "C1"), None);
        assert_eq!(lookup_amdgpu_ids_in(AMDGPU_IDS_FIXTURE, "1586", "FF"), None);
        assert_eq!(lookup_amdgpu_ids_in("", "1586", "C1"), None);
    }

    // Verbatim /run/udev/data/+pci:0000:01:00.0 from corrino (Fedora 44, NVIDIA MX550).
    const UDEV_PCI_NVIDIA: &str = "\
I:8821999
E:SYSTEMD_WANTS=nvidia-fallback.service
E:ID_PCI_CLASS_FROM_DATABASE=Display controller
E:ID_PCI_SUBCLASS_FROM_DATABASE=3D controller
E:ID_VENDOR_FROM_DATABASE=NVIDIA Corporation
E:ID_MODEL_FROM_DATABASE=TU117M [GeForce MX550]
E:ID_PATH=pci-0000:01:00.0
E:ID_PATH_TAG=pci-0000_01_00_0
G:systemd
Q:systemd
V:1
";

    #[test]
    fn test_parse_udev_pci_model() {
        assert_eq!(
            parse_udev_pci_model(UDEV_PCI_NVIDIA),
            Some("TU117M [GeForce MX550]".to_string())
        );
        // The vendor, class and subclass keys share the suffix and must not match.
        let no_model = UDEV_PCI_NVIDIA.replace("E:ID_MODEL_FROM_DATABASE=", "E:ID_OTHER=");
        assert_eq!(parse_udev_pci_model(&no_model), None);
        // A device hwdb does not know has no model key; an empty value is not a name.
        assert_eq!(
            parse_udev_pci_model("I:1\nE:ID_MODEL_FROM_DATABASE=\nV:1\n"),
            None
        );
        assert_eq!(parse_udev_pci_model(""), None);
    }

    // Verbatim head of /proc/driver/nvidia/gpus/0000:01:00.0/information from corrino.
    const NVIDIA_PROC_INFO: &str = "\
Model: \t\t NVIDIA GeForce MX550
IRQ:   \t\t 234
Bus Type: \t PCIe
Bus Location: \t 0000:01:00.0
";

    #[test]
    fn test_parse_nvidia_proc_model() {
        assert_eq!(
            parse_nvidia_proc_model(NVIDIA_PROC_INFO),
            Some("NVIDIA GeForce MX550".to_string())
        );
        assert_eq!(parse_nvidia_proc_model("Model: \t\t \nIRQ: 1\n"), None);
        assert_eq!(parse_nvidia_proc_model("IRQ: 1\n"), None);
    }

    /// A source that must not be consulted: calling it fails the test.
    fn never() -> Option<String> {
        panic!("a later, more expensive GPU name source was consulted")
    }

    fn some(name: &str) -> impl FnOnce() -> Option<String> + '_ {
        move || Some(name.to_string())
    }

    #[test]
    fn test_resolve_gpu_name_udev_skips_pci_ids() {
        // The performance fix: when udev has the name, pci.ids is never read.
        assert_eq!(
            resolve_gpu_name(
                "0x8086",
                never,
                never,
                some("Raptor Lake-P [Iris Xe Graphics]"),
                never
            ),
            "Raptor Lake-P [Iris Xe Graphics]"
        );
    }

    #[test]
    fn test_resolve_gpu_name_nvidia_driver_skips_everything() {
        // The driver's name has always won for NVIDIA, so nothing else is looked up.
        assert_eq!(
            resolve_gpu_name("0x10de", some("NVIDIA GeForce MX550"), never, never, never),
            "NVIDIA GeForce MX550"
        );
        // Without the proprietary driver (nouveau), the normal chain applies.
        assert_eq!(
            resolve_gpu_name(
                "0x10de",
                || None,
                never,
                some("TU117M [GeForce MX550]"),
                never
            ),
            "TU117M [GeForce MX550]"
        );
    }

    #[test]
    fn test_resolve_gpu_name_amd_order() {
        // amdgpu.ids wins and is used verbatim (no codename rewrite).
        assert_eq!(
            resolve_gpu_name(
                "0x1002",
                never,
                some("AMD Radeon 8060S Graphics"),
                never,
                never
            ),
            "AMD Radeon 8060S Graphics"
        );
        // Not in amdgpu.ids: udev's pci.ids-style name still gets the codename table.
        assert_eq!(
            resolve_gpu_name(
                "0x1002",
                never,
                || None,
                some("Rembrandt [Radeon 680M]"),
                never
            ),
            "Radeon 680M"
        );
    }

    #[test]
    fn test_resolve_gpu_name_falls_back_in_order() {
        // No udev data (container, non-udev system): pci.ids as before.
        assert_eq!(
            resolve_gpu_name("0x8086", never, never, || None, some("Alder Lake-P GT2")),
            "Alder Lake-P GT2"
        );
        // Nothing knows the device: generic vendor name. The non-NVIDIA/AMD vendors never
        // consult the driver or amdgpu.ids sources.
        assert_eq!(
            resolve_gpu_name("0x8086", never, never, || None, || None),
            "Intel GPU"
        );
        assert_eq!(
            resolve_gpu_name("0x10de", || None, never, || None, || None),
            "NVIDIA GPU"
        );
        assert_eq!(
            resolve_gpu_name("0x1002", never, || None, || None, || None),
            "AMD GPU"
        );
        assert_eq!(
            resolve_gpu_name("0x1af4", never, never, || None, || None),
            "Unknown GPU"
        );
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

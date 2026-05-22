use crate::cli::Cli;
use crate::config::Config;
use chrono::TimeZone;
use owo_colors::OwoColorize;
use std::collections::HashSet;
use std::fs;
use sysinfo::{Components, Disks, Networks, System, Users};

/// Comprehensive system information data structure.
///
/// This struct holds all the metrics collected from the system,
/// ranging from OS details to hardware specs and network status.
#[derive(Debug)]
pub struct SystemInfo {
    /// Operating system name and version.
    pub os: String,
    /// Kernel version.
    pub kernel: Option<String>,
    /// System hostname.
    pub hostname: Option<String>,
    /// CPU architecture (e.g., x86_64).
    pub arch: String,
    /// CPU model brand string.
    pub cpu: String,
    /// Total number of logical CPU cores.
    pub cpu_cores: usize,
    /// Formatted memory usage (Used / Total).
    pub memory: String,
    /// Formatted swap usage (Used / Total).
    pub swap: String,
    /// System uptime formatted as a duration.
    pub uptime: String,
    /// Number of currently running processes.
    pub processes: usize,
    /// Load average (1, 5, 15 minutes).
    pub load_avg: Option<String>,
    /// List of mounted disks with usage information.
    pub disks: Vec<String>,
    /// Hardware component temperatures.
    pub temps: Vec<String>,
    /// Network interface statistics and status.
    pub networks: Vec<String>,
    /// System boot time in ISO 8601 format.
    pub boot_time: String,
    /// Battery status (currently placeholder for future feature).
    pub battery: Option<String>,
    /// Path to the current user's shell.
    pub shell: Option<String>,
    /// Name of the terminal emulator in use.
    pub terminal: Option<String>,
    /// Detected desktop environment or window manager.
    pub desktop: Option<String>,
    /// Current CPU frequency (formatted).
    pub cpu_freq: Option<String>,
    /// Number of interactive users (UID >= 1000).
    pub users: usize,
    /// List of detected GPUs with model names.
    pub gpu: Vec<String>,
    /// Total count of installed packages across supported managers.
    pub packages: Option<usize>,
    /// Name of the user running the process.
    pub current_user: Option<String>,
}

/// Helper to lookup PCI device name in standard system pci.ids files.
///
/// Searches `/usr/share/hwdata/pci.ids` or `/usr/share/misc/pci.ids`.
fn lookup_pci_device(vendor_id: &str, device_id: &str) -> Option<String> {
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

impl SystemInfo {
    /// Collects system information using sysinfo and environment probes.
    ///
    /// This method aggregates data from the operating system, hardware,
    /// and current user environment into a `SystemInfo` struct.
    pub fn collect(_cli: &Cli, _config: &Config) -> anyhow::Result<Self> {
        let mut sys = System::new_all();
        sys.refresh_all();

        let os = System::long_os_version()
            .or_else(System::name)
            .unwrap_or_else(|| "Unknown".to_string());

        let kernel = System::kernel_version();
        let hostname = System::host_name();

        let cpu = sys
            .cpus()
            .first()
            .map(|c| c.brand().to_string())
            .unwrap_or_else(|| "Unknown CPU".to_string());

        let cpu_cores = sys.cpus().len();

        let total_mem = sys.total_memory() as f64 / 1024.0 / 1024.0;
        let used_mem = sys.used_memory() as f64 / 1024.0 / 1024.0;
        let memory = format!("{:.1} / {:.1} GB", used_mem, total_mem);

        let total_swap = sys.total_swap() as f64 / 1024.0 / 1024.0;
        let used_swap = sys.used_swap() as f64 / 1024.0 / 1024.0;
        let swap = if total_swap > 0.0 {
            format!("{:.1} / {:.1} GB", used_swap, total_swap)
        } else {
            "No swap".to_string()
        };

        let uptime = format!("{}s", System::uptime());

        let disks = Disks::new_with_refreshed_list()
            .iter()
            .map(|d| {
                let total = d.total_space() as f64 / 1024.0 / 1024.0 / 1024.0;
                let avail = d.available_space() as f64 / 1024.0 / 1024.0 / 1024.0;
                let fs = d.file_system().to_string_lossy();
                format!(
                    "{} ({}): {:.1} GB free / {:.1} GB",
                    d.mount_point().display(),
                    fs,
                    avail,
                    total
                )
            })
            .collect();

        let battery: Option<String> = None; // Requires sysinfo "battery" feature

        let arch = System::cpu_arch();

        let processes = sys.processes().len();

        let load_avg = {
            let avg = System::load_average();
            if avg.one > 0.0 || avg.five > 0.0 {
                Some(format!(
                    "{:.2}, {:.2}, {:.2}",
                    avg.one, avg.five, avg.fifteen
                ))
            } else {
                None
            }
        };

        let temps = Components::new_with_refreshed_list()
            .iter()
            .filter_map(|c| {
                c.temperature().and_then(|t| {
                    if t > 0.0 {
                        Some(format!("{}: {:.1}°C", c.label(), t))
                    } else {
                        None
                    }
                })
            })
            .collect();

        let networks = Networks::new_with_refreshed_list()
            .iter()
            .map(|(name, data)| {
                let rx = format_bytes(data.total_received());
                let tx = format_bytes(data.total_transmitted());
                let status = if data.total_received() > 0 || data.total_transmitted() > 0 {
                    "Up".green().to_string()
                } else {
                    "Down".red().to_string()
                };
                format!("{} [{}] RX: {} TX: {}", name, status, rx, tx)
            })
            .collect();

        let boot_timestamp = System::boot_time();
        let boot_dt = chrono::Local
            .timestamp_opt(boot_timestamp as i64, 0)
            .single()
            .map(|dt| dt.format("%Y-%m-%dT%H:%M:%S%:z").to_string())
            .unwrap_or_else(|| boot_timestamp.to_string());
        let boot_time = boot_dt;

        // Environment-based info
        let shell = std::env::var("SHELL").ok();
        let terminal = std::env::var("TERM").ok();
        let desktop = std::env::var("XDG_CURRENT_DESKTOP")
            .or_else(|_| std::env::var("DESKTOP_SESSION"))
            .ok();

        // CPU frequency (first CPU)
        let cpu_freq = sys
            .cpus()
            .first()
            .map(|c| format!("{:.2} GHz", c.frequency() as f64 / 1000.0));

        // Current logged in user
        let current_user = std::env::var("USER").ok();

        // Number of interactive users (UID >= 1000, excluding system accounts)
        let users = Users::new_with_refreshed_list()
            .iter()
            .filter(|user| {
                // UID is exposed via Display
                let uid_str = user.id().to_string();
                if let Ok(uid) = uid_str.parse::<u32>() {
                    uid >= 1000
                } else {
                    false
                }
            })
            .count();

        Ok(Self {
            os,
            kernel,
            hostname,
            arch,
            cpu,
            cpu_cores,
            memory,
            swap,
            uptime,
            processes,
            load_avg,
            disks,
            temps,
            networks,
            boot_time,
            battery,
            shell,
            terminal,
            desktop,
            cpu_freq,
            users,
            gpu: detect_gpu(),
            packages: detect_packages(),
            current_user,
        })
    }
}

/// Refines AMD GPU names by mapping codenames to marketing names.
fn improve_amd_gpu_name(name: &str) -> String {
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

/// Detects GPUs using sysfs and PCI database lookups.
///
/// Scans `/sys/class/drm` for graphics devices and attempts to extract
/// model names and VRAM info (where supported).
fn detect_gpu() -> Vec<String> {
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

                // Refine AMD GPU names (codenames -> marketing names)
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

                // Try to get VRAM from common sysfs locations (mainly AMD)
                let vram_path = device_path.join("mem_info_vram_total");
                if let Ok(vram_str) = fs::read_to_string(vram_path) {
                    if let Ok(vram_bytes) = vram_str.trim().parse::<u64>() {
                        let vram_gb = vram_bytes as f64 / 1024.0 / 1024.0 / 1024.0;
                        if vram_gb >= 1.0 {
                            gpu_name = format!("{} ({:.0} GB)", gpu_name, vram_gb);
                        } else {
                            let vram_mb = vram_bytes / 1024 / 1024;
                            gpu_name = format!("{} ({} MB)", gpu_name, vram_mb);
                        }
                    }
                }

                gpus.push(gpu_name);
            }
        }
    }

    if gpus.is_empty() {
        // Fallback for non-standard setups or if /sys/class/drm is empty
        if let Ok(model) = fs::read_to_string("/sys/class/drm/card0/device/model") {
            let model = model.trim();
            if !model.is_empty() {
                gpus.push(model.to_string());
            }
        }
    }

    gpus
}

/// Count installed packages by inspecting package manager databases directly.
///
/// Supports Pacman (Arch), Dpkg (Debian), XBPS (Void), and RPM (Fedora/RHEL).
fn detect_packages() -> Option<usize> {
    // Arch / Manjaro
    if let Ok(entries) = std::fs::read_dir("/var/lib/pacman/local") {
        let count = entries.filter_map(|e| e.ok()).count();
        if count > 0 {
            return Some(count);
        }
    }

    // Debian / Ubuntu
    if let Ok(entries) = std::fs::read_dir("/var/lib/dpkg/info") {
        let count = entries
            .filter_map(|e| e.ok())
            .filter(|e| e.path().extension().is_some_and(|ext| ext == "list"))
            .count();
        if count > 0 {
            return Some(count);
        }
    }

    // Gentoo
    if let Ok(entries) = std::fs::read_dir("/var/db/pkg") {
        let count: usize = entries
            .filter_map(|e| e.ok())
            .map(|e| {
                std::fs::read_dir(e.path())
                    .map(|d| d.filter(|_| true).count())
                    .unwrap_or(0)
            })
            .sum();
        if count > 0 {
            return Some(count);
        }
    }

    // Void Linux
    if let Ok(entries) = std::fs::read_dir("/var/db/xbps") {
        let count = entries
            .filter_map(|e| e.ok())
            .filter(|e| e.path().extension().is_some_and(|ext| ext == "plist"))
            .count();
        if count > 0 {
            return Some(count);
        }
    }

    // Fedora / RHEL / openSUSE - read from RPM SQLite database
    let rpm_db = "/var/lib/rpm/rpmdb.sqlite";
    if std::path::Path::new(rpm_db).exists() {
        if let Ok(conn) = rusqlite::Connection::open(rpm_db) {
            if let Ok(count) = conn.query_row("SELECT COUNT(*) FROM Packages", [], |row| {
                row.get::<_, i64>(0)
            }) {
                if count > 0 {
                    return Some(count as usize);
                }
            }
        }
    }

    None
}

/// Format bytes into human-readable form (KB, MB, GB, etc.)
fn format_bytes(bytes: u64) -> String {
    const KB: u64 = 1024;
    const MB: u64 = KB * 1024;
    const GB: u64 = MB * 1024;

    if bytes >= GB {
        format!("{:.1} GB", bytes as f64 / GB as f64)
    } else if bytes >= MB {
        format!("{:.1} MB", bytes as f64 / MB as f64)
    } else if bytes >= KB {
        format!("{:.1} KB", bytes as f64 / KB as f64)
    } else {
        format!("{} B", bytes)
    }
}

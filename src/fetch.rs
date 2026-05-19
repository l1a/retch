use crate::cli::Cli;
use crate::config::Config;
use chrono::TimeZone;
use owo_colors::OwoColorize;
use sysinfo::{Components, Disks, Networks, System, Users};

#[derive(Debug)]
pub struct SystemInfo {
    pub os: String,
    pub kernel: Option<String>,
    pub hostname: Option<String>,
    pub arch: String,
    pub cpu: String,
    pub cpu_cores: usize,
    pub memory: String,
    pub swap: String,
    pub uptime: String,
    pub processes: usize,
    pub load_avg: Option<String>,
    pub disks: Vec<String>,
    pub temps: Vec<String>,
    pub networks: Vec<String>,
    pub boot_time: String,
    pub battery: Option<String>,
    pub shell: Option<String>,
    pub terminal: Option<String>,
    pub desktop: Option<String>,
    pub cpu_freq: Option<String>,
    pub users: usize,
    pub gpu: Option<String>,
    pub packages: Option<usize>,
    pub current_user: Option<String>,
}

impl SystemInfo {
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

/// Basic GPU detection (Linux-focused for now)
fn detect_gpu() -> Option<String> {
    // Try common locations for GPU info
    let paths = [
        "/sys/class/drm/card0/device/vendor",
        "/sys/class/drm/renderD128/device/vendor",
    ];

    for path in &paths {
        if let Ok(vendor) = std::fs::read_to_string(path) {
            if vendor.contains("0x10de") {
                // NVIDIA
                return Some("NVIDIA GPU".to_string());
            } else if vendor.contains("0x1002") {
                // AMD
                return Some("AMD GPU".to_string());
            } else if vendor.contains("0x8086") {
                // Intel
                return Some("Intel GPU".to_string());
            }
        }
    }

    // Fallback: try to read model name if available
    if let Ok(model) = std::fs::read_to_string("/sys/class/drm/card0/device/model") {
        let model = model.trim();
        if !model.is_empty() {
            return Some(model.to_string());
        }
    }

    None
}

/// Count installed packages by inspecting package manager databases.
/// Avoids calling any external tools.
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

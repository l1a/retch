// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 l1a

//! System information gathering.
//!
//! Uses the `sysinfo` crate and other heuristics to collect details
//! about the OS, hardware, and environment.

use crate::cli::Cli;
use crate::config::Config;
use crate::gpu;
use chrono::TimeZone;
use owo_colors::OwoColorize;

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
    /// Primary local IP address.
    pub local_ip: Option<String>,
    /// Public IP address (best effort).
    pub public_ip: Option<String>,
    /// Name of the active/default network interface.
    pub active_interface: Option<String>,
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

        let battery = battery::Manager::new()
            .ok()
            .and_then(|manager| manager.batteries().ok())
            .and_then(|mut batteries| batteries.next())
            .and_then(|result| result.ok())
            .map(|bat| {
                let pct = bat.state_of_charge().value * 100.0;
                let health = bat.state_of_health().value * 100.0;
                let state = match bat.state() {
                    battery::State::Charging => "charging",
                    battery::State::Discharging => "discharging",
                    battery::State::Full => "full",
                    _ => "not charging",
                };
                let vendor = bat.vendor().map(|s| s.to_string());
                let model = bat.model().map(|s| s.to_string());

                // Format time remaining as "Xh Ym" or "Xd Yh"
                let time_str = match bat.state() {
                    battery::State::Charging => bat.time_to_full().map(|d| {
                        let total_mins = (d.value / 60.0) as u32;
                        let hours = total_mins / 60;
                        let mins = total_mins % 60;
                        if hours >= 24 {
                            let days = hours / 24;
                            let rem_hours = hours % 24;
                            format!("{}d {}h until full", days, rem_hours)
                        } else if hours > 0 {
                            format!("{}h {}m until full", hours, mins)
                        } else {
                            format!("{}m until full", mins)
                        }
                    }),
                    battery::State::Discharging => bat.time_to_empty().map(|d| {
                        let total_mins = (d.value / 60.0) as u32;
                        let hours = total_mins / 60;
                        let mins = total_mins % 60;
                        if hours >= 24 {
                            let days = hours / 24;
                            let rem_hours = hours % 24;
                            format!("{}d {}h remaining", days, rem_hours)
                        } else if hours > 0 {
                            format!("{}h {}m remaining", hours, mins)
                        } else {
                            format!("{}m remaining", mins)
                        }
                    }),
                    _ => None,
                };

                let mut parts = vec![state.to_string()];
                if let Some(t) = time_str {
                    parts.insert(0, t);
                }
                if health < 99.0 {
                    parts.push(format!("{:.0}% health", health));
                }

                let base = format!("{:.0}% ({})", pct, parts.join(", "));

                match (vendor, model) {
                    (Some(v), Some(m)) => format!("{} [{} {}]", base, v, m),
                    (Some(v), None) => format!("{} [{}]", base, v),
                    _ => base,
                }
            });

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

        // Compute slow system queries concurrently in parallel threads
        let (gpu, packages, public_ip, (local_ip, active_interface)) = std::thread::scope(|s| {
            let gpu_handle = s.spawn(|| {
                gpu::detect_gpus()
                    .into_iter()
                    .map(|g| g.format())
                    .collect::<Vec<String>>()
            });
            let packages_handle = s.spawn(detect_packages);
            let public_ip_handle = s.spawn(|| {
                std::process::Command::new("curl")
                    .args(["-s", "--max-time", "2", "https://api.ipify.org"])
                    .output()
                    .ok()
                    .and_then(|o| String::from_utf8(o.stdout).ok())
                    .map(|s| s.trim().to_string())
                    .filter(|s| !s.is_empty())
            });
            let network_ips_handle = s.spawn(|| {
                let local_ip = std::net::UdpSocket::bind("0.0.0.0:0")
                    .ok()
                    .and_then(|socket| {
                        socket.connect("8.8.8.8:53").ok()?;
                        socket.local_addr().ok().map(|addr| addr.ip().to_string())
                    });

                let active_interface = {
                    #[cfg(target_os = "linux")]
                    {
                        std::process::Command::new("ip")
                            .args(["route", "show", "default"])
                            .output()
                            .ok()
                            .and_then(|o| String::from_utf8(o.stdout).ok())
                            .and_then(|s| {
                                s.split_whitespace()
                                    .position(|w| w == "dev")
                                    .and_then(|i| s.split_whitespace().nth(i + 1))
                                    .map(|s| s.to_string())
                            })
                    }
                    #[cfg(target_os = "macos")]
                    {
                        std::process::Command::new("route")
                            .args(["-n", "get", "default"])
                            .output()
                            .ok()
                            .and_then(|o| String::from_utf8(o.stdout).ok())
                            .and_then(|s| {
                                s.lines()
                                    .find(|l| l.contains("interface:"))
                                    .and_then(|l| l.split_whitespace().last())
                                    .map(|s| s.to_string())
                            })
                    }
                    #[cfg(target_os = "windows")]
                    {
                        std::process::Command::new("powershell")
                            .args(["-Command", "Get-NetRoute -DestinationPrefix 0.0.0.0/0 | Select-Object -First 1 -ExpandProperty InterfaceAlias"])
                            .output()
                            .ok()
                            .and_then(|o| String::from_utf8(o.stdout).ok())
                            .map(|s| s.trim().to_string())
                            .filter(|s| !s.is_empty())
                    }
                    #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
                    {
                        None
                    }
                };

                (local_ip, active_interface)
            });

            (
                gpu_handle.join().unwrap_or_default(),
                packages_handle.join().ok().flatten(),
                public_ip_handle.join().ok().flatten(),
                network_ips_handle.join().unwrap_or((None, None)),
            )
        });

        let mut temps: Vec<String> = Components::new_with_refreshed_list()
            .iter()
            .filter_map(|c| {
                c.temperature().and_then(|t| {
                    if t > 0.0 {
                        Some(format!("{}: {:.0}°C", c.label(), t))
                    } else {
                        None
                    }
                })
            })
            .collect();

        // Sort so CPU temperatures appear first
        temps.sort_by(|a, b| {
            let a_cpu = a.to_lowercase().contains("cpu") || a.to_lowercase().contains("core");
            let b_cpu = b.to_lowercase().contains("cpu") || b.to_lowercase().contains("core");
            b_cpu.cmp(&a_cpu)
        });

        let networks = Networks::new_with_refreshed_list()
            .iter()
            .map(|(name, data)| {
                let rx = format_bytes(data.total_received());
                let tx = format_bytes(data.total_transmitted());
                let is_up = data.operational_state() == sysinfo::InterfaceOperationalState::Up
                    || data.total_received() > 0
                    || data.total_transmitted() > 0;
                let status = if is_up {
                    "Up".green().to_string()
                } else {
                    "Down".red().to_string()
                };

                let mut ipv4_addresses = Vec::new();
                let mut ipv6_addresses = Vec::new();

                if is_up {
                    for ip_net in data.ip_networks() {
                        let ip = ip_net.addr;
                        let name_lower = name.to_lowercase();
                        let is_loopback_iface =
                            name_lower.starts_with("lo") || name_lower.contains("loopback");
                        if ip.is_loopback() && !is_loopback_iface {
                            continue;
                        }
                        match ip {
                            std::net::IpAddr::V4(v4) => {
                                ipv4_addresses.push(v4.to_string());
                            }
                            std::net::IpAddr::V6(v6) => {
                                if !v6.is_unicast_link_local() {
                                    ipv6_addresses.push(v6.to_string());
                                }
                            }
                        }
                    }

                    // Fallback to active interface UDP-resolved local IP if no IPs detected by sysinfo
                    if ipv4_addresses.is_empty() && ipv6_addresses.is_empty() {
                        if let (Some(ref active), Some(ref ip)) = (&active_interface, &local_ip) {
                            if name == active {
                                ipv4_addresses.push(ip.clone());
                            }
                        }
                    }
                }

                let ip_str = if !ipv4_addresses.is_empty() || !ipv6_addresses.is_empty() {
                    let mut combined = Vec::new();
                    if !ipv4_addresses.is_empty() {
                        combined.push(ipv4_addresses.join(", "));
                    }
                    if !ipv6_addresses.is_empty() {
                        combined.push(ipv6_addresses.join(", "));
                    }
                    format!(" ({})", combined.join(", "))
                } else {
                    String::new()
                };

                format!("{}{} [{}] RX: {} TX: {}", name, ip_str, status, rx, tx)
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
            gpu,
            packages,
            current_user,
            local_ip,
            public_ip,
            active_interface,
        })
    }
}

/// Count installed packages by inspecting package manager databases directly.
///
/// Supports Pacman (Arch), Dpkg (Debian), XBPS (Void), RPM (Fedora/RHEL) on Linux,
/// and Homebrew (Formulae and Casks) and MacPorts on macOS.
fn detect_packages() -> Option<usize> {
    #[cfg(target_os = "macos")]
    {
        let mut count = 0;

        // Homebrew Cellar (Formulae)
        for cellar_path in &["/opt/homebrew/Cellar", "/usr/local/Cellar"] {
            if let Ok(entries) = std::fs::read_dir(cellar_path) {
                count += entries.filter_map(|e| e.ok()).count();
            }
        }

        // Homebrew Caskroom (Casks)
        for cask_path in &["/opt/homebrew/Caskroom", "/usr/local/Caskroom"] {
            if let Ok(entries) = std::fs::read_dir(cask_path) {
                count += entries.filter_map(|e| e.ok()).count();
            }
        }

        // MacPorts
        if let Ok(entries) = std::fs::read_dir("/opt/local/var/macports/software") {
            count += entries.filter_map(|e| e.ok()).count();
        }

        if count > 0 {
            Some(count)
        } else {
            None
        }
    }

    #[cfg(target_os = "windows")]
    {
        let mut count = 0;

        // Scoop
        if let Some(home) = dirs::home_dir() {
            let scoop_dir = std::env::var("SCOOP")
                .map(std::path::PathBuf::from)
                .unwrap_or_else(|_| home.join("scoop"));
            let scoop_apps = scoop_dir.join("apps");
            if let Ok(entries) = std::fs::read_dir(scoop_apps) {
                count += entries.filter_map(|e| e.ok()).count();
            }
        }

        // Chocolatey
        let choco_install = std::env::var("ChocolateyInstall")
            .unwrap_or_else(|_| "C:\\ProgramData\\chocolatey".to_string());
        let choco_lib = std::path::Path::new(&choco_install).join("lib");
        if let Ok(entries) = std::fs::read_dir(choco_lib) {
            count += entries.filter_map(|e| e.ok()).count();
        }

        if count > 0 {
            Some(count)
        } else {
            None
        }
    }

    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    {
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
            match rusqlite::Connection::open(rpm_db) {
                Ok(conn) => {
                    if let Ok(count) = conn.query_row("SELECT COUNT(*) FROM Packages", [], |row| {
                        row.get::<_, i64>(0)
                    }) {
                        if count > 0 {
                            return Some(count as usize);
                        }
                    }
                }
                Err(e) => {
                    eprintln!("warning: failed to open RPM database at {}: {}", rpm_db, e);
                }
            }
        }

        None
    }
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_format_bytes() {
        assert_eq!(format_bytes(500), "500 B");
        assert_eq!(format_bytes(1024), "1.0 KB");
        assert_eq!(format_bytes(1024 * 1024), "1.0 MB");
        assert_eq!(format_bytes(1024 * 1024 * 1024), "1.0 GB");
        assert_eq!(format_bytes(1536), "1.5 KB");
    }
}

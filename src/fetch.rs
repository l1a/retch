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
    /// Detected motherboard name and manufacturer.
    pub motherboard: Option<String>,
    /// Detected BIOS details.
    pub bios: Option<String>,
    /// List of connected display resolutions and refresh rates.
    pub displays: Vec<String>,
    /// Detected active audio driver/server and devices.
    pub audio: Option<String>,
    /// Connected Wi-Fi SSID and speed.
    pub wifi: Option<String>,
    /// Bluetooth power status.
    pub bluetooth: Option<String>,
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

        let disks_list = Disks::new_with_refreshed_list();
        let disks: Vec<String> = if !_cli.long {
            let home = dirs::home_dir().unwrap_or_else(|| std::path::PathBuf::from("/"));
            let mut best_match: Option<&sysinfo::Disk> = None;
            for disk in disks_list.iter() {
                if home.starts_with(disk.mount_point()) {
                    if let Some(best) = best_match {
                        if disk.mount_point().components().count()
                            > best.mount_point().components().count()
                        {
                            best_match = Some(disk);
                        }
                    } else {
                        best_match = Some(disk);
                    }
                }
            }
            let selected_disks = if let Some(best) = best_match {
                vec![best]
            } else {
                disks_list.iter().collect::<Vec<_>>()
            };

            selected_disks
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
                .collect()
        } else {
            disks_list
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
                .collect()
        };

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
        let (
            gpu,
            packages,
            public_ip,
            (local_ip, active_interface),
            motherboard,
            bios,
            displays,
            audio,
            wifi,
            bluetooth,
        ) = std::thread::scope(|s| {
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
            let motherboard_handle = s.spawn(detect_motherboard);
            let bios_handle = s.spawn(detect_bios);
            let displays_handle = s.spawn(detect_displays);
            let audio_handle = s.spawn(|| detect_audio(&sys));
            let wifi_handle = s.spawn(detect_wifi);
            let bluetooth_handle = s.spawn(detect_bluetooth);

            (
                gpu_handle.join().unwrap_or_default(),
                packages_handle.join().ok().flatten(),
                public_ip_handle.join().ok().flatten(),
                network_ips_handle.join().unwrap_or((None, None)),
                motherboard_handle.join().ok().flatten(),
                bios_handle.join().ok().flatten(),
                displays_handle.join().unwrap_or_default(),
                audio_handle.join().ok().flatten(),
                wifi_handle.join().ok().flatten(),
                bluetooth_handle.join().ok().flatten(),
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
            motherboard,
            bios,
            displays,
            audio,
            wifi,
            bluetooth,
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

fn detect_wifi() -> Option<String> {
    #[cfg(target_os = "linux")]
    {
        let mut wifi_interface = None;
        if let Ok(entries) = std::fs::read_dir("/sys/class/net") {
            for entry in entries.filter_map(|e| e.ok()) {
                let path = entry.path();
                if path.join("wireless").exists() || path.join("phy80211").exists() {
                    wifi_interface = Some(entry.file_name().to_string_lossy().to_string());
                    break;
                }
            }
        }

        if let Some(ref iface) = wifi_interface {
            if let Ok(output) = std::process::Command::new("iw")
                .args(["dev", iface, "link"])
                .output()
            {
                if let Ok(stdout) = String::from_utf8(output.stdout) {
                    let (ssid, links) = parse_iw_link_output(&stdout);
                    if let Some(s) = ssid {
                        let card_model = get_wifi_card_model(iface);
                        let prefix = if let Some(m) = card_model {
                            format!("{} [{}] - ", m, iface)
                        } else {
                            format!("[{}] - ", iface)
                        };

                        if !links.is_empty() {
                            let mut link_strs = Vec::new();
                            for link in links {
                                let freq_str = link.freq.map(|f| {
                                    let ghz_mhz = if f >= 1000.0 {
                                        format!("{:.1} GHz", f / 1000.0)
                                    } else {
                                        format!("{} MHz", f)
                                    };
                                    if let Some(ch) = freq_to_channel(f) {
                                        format!("{} ch{}", ghz_mhz, ch)
                                    } else {
                                        ghz_mhz
                                    }
                                });

                                let mut rx_tx = Vec::new();
                                if let Some(rx) = link.rx_rate {
                                    if rx != "0"
                                        && !rx.starts_with("0 ")
                                        && rx != "0 Mbps"
                                        && rx != "0 MBit/s"
                                    {
                                        rx_tx.push(format!("↓{}", clean_rate(&rx)));
                                    }
                                }
                                if let Some(tx) = link.tx_rate {
                                    if tx != "0"
                                        && !tx.starts_with("0 ")
                                        && tx != "0 Mbps"
                                        && tx != "0 MBit/s"
                                    {
                                        rx_tx.push(format!("↑{}", clean_rate(&tx)));
                                    }
                                }

                                match (freq_str, rx_tx.is_empty()) {
                                    (Some(f), false) => {
                                        link_strs.push(format!("{} [{}]", f, rx_tx.join(" ")))
                                    }
                                    (Some(f), true) => link_strs.push(f),
                                    (None, false) => link_strs.push(rx_tx.join(" ")),
                                    _ => {}
                                }
                            }
                            if !link_strs.is_empty() {
                                return Some(format!(
                                    "{}{}{} ({})",
                                    prefix,
                                    s,
                                    "",
                                    link_strs.join(", ")
                                ));
                            } else {
                                return Some(format!("{}{}", prefix, s));
                            }
                        }
                        return Some(format!("{}{}", prefix, s));
                    }
                }
            }
        }

        // Fallback to nmcli
        if let Ok(output) = std::process::Command::new("nmcli")
            .args(["-t", "-f", "active,ssid,rate", "dev", "wifi"])
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                for line in stdout.lines() {
                    let line = line.trim();
                    if let Some(rest) = line.strip_prefix("yes:") {
                        if let Some(colon_idx) = rest.rfind(':') {
                            let ssid = &rest[..colon_idx];
                            let rate = rest[colon_idx + 1..].trim();
                            if !ssid.is_empty() {
                                if !rate.is_empty()
                                    && rate != "0"
                                    && !rate.starts_with("0 ")
                                    && rate != "0 Mbit/s"
                                    && rate != "0 Mbps"
                                {
                                    return Some(format!("{} ({})", ssid, clean_rate(rate)));
                                } else {
                                    return Some(ssid.to_string());
                                }
                            }
                        } else if !rest.is_empty() {
                            return Some(rest.to_string());
                        }
                    }
                }
            }
        }

        // Fallback to iwgetid
        if let Ok(output) = std::process::Command::new("iwgetid").arg("-r").output() {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                let ssid = stdout.trim();
                if !ssid.is_empty() {
                    return Some(ssid.to_string());
                }
            }
        }
        None
    }

    #[cfg(target_os = "macos")]
    {
        if let Ok(output) = std::process::Command::new("/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport")
            .arg("-I")
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                return parse_airport_output(&stdout);
            }
        }
        None
    }

    #[cfg(target_os = "windows")]
    {
        if let Ok(output) = std::process::Command::new("netsh")
            .args(["wlan", "show", "interfaces"])
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                return parse_netsh_output(&stdout);
            }
        }
        None
    }

    #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
    {
        None
    }
}

#[allow(clippy::manual_is_multiple_of, clippy::manual_range_contains)]
fn freq_to_channel(freq_mhz: f64) -> Option<u32> {
    let freq = freq_mhz.round() as u32;
    if freq >= 2412 && freq <= 2472 {
        Some((freq - 2407) / 5)
    } else if freq == 2484 {
        Some(14)
    } else if freq >= 5160 && freq <= 5885 {
        if (freq - 5000) % 5 == 0 {
            Some((freq - 5000) / 5)
        } else {
            None
        }
    } else if freq >= 5955 && freq <= 7115 {
        if (freq - 5950) % 5 == 0 {
            Some((freq - 5950) / 5)
        } else {
            None
        }
    } else {
        None
    }
}

#[allow(dead_code)]
fn lookup_pci_vendor(vendor_id: &str) -> Option<String> {
    let vendor_id = vendor_id.trim_start_matches("0x").to_lowercase();
    let paths = ["/usr/share/hwdata/pci.ids", "/usr/share/misc/pci.ids"];
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

#[allow(dead_code)]
fn get_wifi_card_model(iface: &str) -> Option<String> {
    let vendor = std::fs::read_to_string(format!("/sys/class/net/{}/device/vendor", iface)).ok()?;
    let device = std::fs::read_to_string(format!("/sys/class/net/{}/device/device", iface)).ok()?;
    let vendor_clean = vendor.trim().trim_start_matches("0x").to_lowercase();
    let device_clean = device.trim().trim_start_matches("0x").to_lowercase();

    let vendor_name = lookup_pci_vendor(&vendor_clean);
    let model_name = crate::gpu::lookup_pci_device(&vendor_clean, &device_clean);

    match (vendor_name, model_name) {
        (Some(v), Some(m)) => {
            let v_clean = v.replace(", Inc.", "").replace(" Corporation", "");
            if m.to_lowercase().contains(&v_clean.to_lowercase())
                || m.to_lowercase().contains(
                    &v_clean
                        .split_whitespace()
                        .next()
                        .unwrap_or("")
                        .to_lowercase(),
                )
            {
                Some(m)
            } else {
                Some(format!("{} {}", v_clean, m))
            }
        }
        (None, Some(m)) => Some(m),
        _ => None,
    }
}

#[allow(dead_code)]
fn clean_rate(rate: &str) -> String {
    rate.replace("MBit/s", "Mbps")
        .replace("GBit/s", "Gbps")
        .replace("Bit/s", "bps")
}

#[derive(Debug, Clone)]
struct WifiLink {
    freq: Option<f64>,
    rx_rate: Option<String>,
    tx_rate: Option<String>,
}

#[allow(dead_code)]
fn parse_iw_link_output(stdout: &str) -> (Option<String>, Vec<WifiLink>) {
    let mut ssid = None;
    let mut links = Vec::new();
    let mut current_link = None;

    for line in stdout.lines() {
        let trimmed = line.trim();
        if trimmed.starts_with("Connected to") || trimmed.starts_with("link") {
            if let Some(link) = current_link.take() {
                links.push(link);
            }
            current_link = Some(WifiLink {
                freq: None,
                rx_rate: None,
                tx_rate: None,
            });
        } else if trimmed.starts_with("SSID:") {
            ssid = Some(trimmed.strip_prefix("SSID:").unwrap().trim().to_string());
        } else if trimmed.starts_with("freq:") {
            if let Some(ref mut link) = current_link {
                let freq_str = trimmed.strip_prefix("freq:").unwrap().trim();
                link.freq = freq_str.parse::<f64>().ok();
            }
        } else if trimmed.starts_with("rx bitrate:") {
            if let Some(ref mut link) = current_link {
                let rx_str = trimmed.strip_prefix("rx bitrate:").unwrap().trim();
                let rate = rx_str
                    .split_whitespace()
                    .take(2)
                    .collect::<Vec<&str>>()
                    .join(" ");
                link.rx_rate = Some(rate);
            }
        } else if trimmed.starts_with("tx bitrate:") {
            if let Some(ref mut link) = current_link {
                let tx_str = trimmed.strip_prefix("tx bitrate:").unwrap().trim();
                let rate = tx_str
                    .split_whitespace()
                    .take(2)
                    .collect::<Vec<&str>>()
                    .join(" ");
                link.tx_rate = Some(rate);
            }
        }
    }
    if let Some(link) = current_link {
        links.push(link);
    }
    (ssid, links)
}

#[allow(dead_code)]
fn parse_airport_output(stdout: &str) -> Option<String> {
    let mut ssid = None;
    let mut rate = None;
    for line in stdout.lines() {
        let trimmed = line.trim();
        if trimmed.starts_with("SSID:") {
            let val = trimmed.strip_prefix("SSID:").unwrap().trim().to_string();
            if !val.is_empty() {
                ssid = Some(val);
            }
        } else if trimmed.starts_with("lastTxRate:") {
            let val = trimmed
                .strip_prefix("lastTxRate:")
                .unwrap()
                .trim()
                .to_string();
            if !val.is_empty() {
                rate = Some(val);
            }
        }
    }
    match (ssid, rate) {
        (Some(s), Some(r)) => {
            if r != "0" && !r.starts_with("0 ") && r != "0 Mbps" && r != "0 Mbit/s" {
                Some(format!("{} (↑{} Mbps)", s, r))
            } else {
                Some(s)
            }
        }
        (Some(s), None) => Some(s),
        _ => None,
    }
}

#[allow(dead_code)]
fn parse_netsh_output(stdout: &str) -> Option<String> {
    let mut ssid = None;
    let mut rx = None;
    let mut tx = None;
    let mut band = None;
    for line in stdout.lines() {
        let trimmed = line.trim();
        if trimmed.starts_with("SSID") {
            if let Some(idx) = trimmed.find(':') {
                let val = trimmed[idx + 1..].trim().to_string();
                if !val.is_empty() {
                    ssid = Some(val);
                }
            }
        } else if trimmed.starts_with("Receive rate (Mbps)") {
            if let Some(idx) = trimmed.find(':') {
                let val = trimmed[idx + 1..].trim().to_string();
                if !val.is_empty() {
                    rx = Some(val);
                }
            }
        } else if trimmed.starts_with("Transmit rate (Mbps)") {
            if let Some(idx) = trimmed.find(':') {
                let val = trimmed[idx + 1..].trim().to_string();
                if !val.is_empty() {
                    tx = Some(val);
                }
            }
        } else if trimmed.starts_with("Band") {
            if let Some(idx) = trimmed.find(':') {
                let val = trimmed[idx + 1..].trim().to_string();
                if !val.is_empty() {
                    band = Some(val);
                }
            }
        }
    }
    if let Some(s) = ssid {
        let mut rate_strs = Vec::new();
        if let Some(rx_val) = rx {
            if rx_val != "0" {
                rate_strs.push(format!("↓{} Mbps", rx_val));
            }
        }
        if let Some(tx_val) = tx {
            if tx_val != "0" {
                rate_strs.push(format!("↑{} Mbps", tx_val));
            }
        }
        let info = match (band, rate_strs.is_empty()) {
            (Some(b), false) => format!("{} [{}]", b, rate_strs.join(" ")),
            (Some(b), true) => b,
            (None, false) => rate_strs.join(" "),
            _ => String::new(),
        };
        if !info.is_empty() {
            Some(format!("{} ({})", s, info))
        } else {
            Some(s)
        }
    } else {
        None
    }
}

#[allow(dead_code)]
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

#[allow(dead_code)]
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
        if trimmed.starts_with("Bluetooth Power:") {
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

fn detect_bluetooth() -> Option<String> {
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
                                let vendor_name = lookup_pci_vendor(&v_clean);
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

fn detect_audio(_sys: &sysinfo::System) -> Option<String> {
    #[cfg(target_os = "linux")]
    {
        // 1. Detect audio server
        let mut server = None;
        for process in _sys.processes().values() {
            let name = process.name().to_string_lossy().to_lowercase();
            if name.contains("pipewire") {
                server = Some("PipeWire");
                break;
            } else if name.contains("pulseaudio") {
                server = Some("PulseAudio");
            }
        }
        let server_str = server.unwrap_or("ALSA");

        // 2. Detect hardware cards
        let mut devices = Vec::new();
        if let Ok(content) = std::fs::read_to_string("/proc/asound/cards") {
            devices = parse_asound_cards(&content, "/proc/asound");
        }

        if !devices.is_empty() {
            Some(format!("{} ({})", server_str, devices.join(", ")))
        } else {
            Some(server_str.to_string())
        }
    }

    #[cfg(target_os = "macos")]
    {
        let mut devices = Vec::new();
        if let Ok(output) = std::process::Command::new("system_profiler")
            .arg("SPAudioDataType")
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                let mut in_devices = false;
                for line in stdout.lines() {
                    let trimmed = line.trim();
                    let indent = line.len() - line.trim_start().len();
                    if trimmed.starts_with("Devices:") {
                        in_devices = true;
                        continue;
                    }
                    if in_devices {
                        if indent <= 4 && !trimmed.is_empty() && !trimmed.starts_with("Devices:") {
                            in_devices = false;
                            continue;
                        }
                        if indent == 8 && trimmed.ends_with(':') {
                            let name = trimmed.trim_end_matches(':').trim().to_string();
                            if !name.is_empty() && !devices.contains(&name) {
                                devices.push(name);
                            }
                        }
                    }
                }
            }
        }

        if !devices.is_empty() {
            Some(format!("CoreAudio ({})", devices.join(", ")))
        } else {
            Some("CoreAudio".to_string())
        }
    }

    #[cfg(target_os = "windows")]
    {
        let mut devices = Vec::new();
        if let Ok(output) = std::process::Command::new("wmic")
            .args(["path", "Win32_SoundDevice", "get", "Name", "/value"])
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                for line in stdout.lines() {
                    let line = line.trim();
                    if line.starts_with("Name=") {
                        let name = line.strip_prefix("Name=").unwrap_or("").trim().to_string();
                        if !name.is_empty() && !devices.contains(&name) {
                            devices.push(name);
                        }
                    }
                }
            }
        }

        if !devices.is_empty() {
            Some(format!("Windows Audio ({})", devices.join(", ")))
        } else {
            Some("Windows Audio".to_string())
        }
    }

    #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
    {
        None
    }
}

#[allow(dead_code)]
fn parse_asound_cards(content: &str, asound_dir: &str) -> Vec<String> {
    let mut devices = Vec::new();
    if let Ok(entries) = std::fs::read_dir(asound_dir) {
        for entry in entries.filter_map(|e| e.ok()) {
            let path = entry.path();
            if path.is_dir() {
                let name = entry.file_name().to_string_lossy().to_string();
                if name.starts_with("card") {
                    if let Ok(sub_entries) = std::fs::read_dir(&path) {
                        for sub_entry in sub_entries.filter_map(|se| se.ok()) {
                            let sub_path = sub_entry.path();
                            let sub_name = sub_entry.file_name().to_string_lossy().to_string();
                            if sub_name.starts_with("codec#") {
                                if let Ok(codec_content) = std::fs::read_to_string(&sub_path) {
                                    for line in codec_content.lines() {
                                        if let Some(stripped) = line.strip_prefix("Codec: ") {
                                            let codec_name = stripped.trim().to_string();
                                            if !codec_name.is_empty()
                                                && !devices.contains(&codec_name)
                                            {
                                                devices.push(codec_name);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if devices.is_empty() {
        for line in content.lines() {
            if let Some(idx) = line.find("]: ") {
                let desc = line[idx + 3..].trim();
                let device_name = if let Some(dash_idx) = desc.find(" - ") {
                    desc[dash_idx + 3..].trim()
                } else {
                    desc
                };
                if !device_name.is_empty() && !devices.contains(&device_name.to_string()) {
                    devices.push(device_name.to_string());
                }
            }
        }
    }
    devices
}

fn detect_motherboard() -> Option<String> {
    #[cfg(target_os = "macos")]
    {
        if let Ok(output) = std::process::Command::new("sysctl")
            .args(["-n", "hw.model"])
            .output()
        {
            if let Ok(model) = String::from_utf8(output.stdout) {
                let trimmed = model.trim();
                if !trimmed.is_empty() {
                    return Some(trimmed.to_string());
                }
            }
        }
        None
    }

    #[cfg(target_os = "windows")]
    {
        if let Ok(output) = std::process::Command::new("wmic")
            .args(["baseboard", "get", "manufacturer,product", "/value"])
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                let mut manufacturer = String::new();
                let mut product = String::new();
                for line in stdout.lines() {
                    let line = line.trim();
                    if line.starts_with("Manufacturer=") {
                        manufacturer = line
                            .strip_prefix("Manufacturer=")
                            .unwrap_or("")
                            .trim()
                            .to_string();
                    } else if line.starts_with("Product=") {
                        product = line
                            .strip_prefix("Product=")
                            .unwrap_or("")
                            .trim()
                            .to_string();
                    }
                }
                if !manufacturer.is_empty() && !product.is_empty() {
                    return Some(format!("{} {}", manufacturer, product));
                } else if !product.is_empty() {
                    return Some(product);
                } else if !manufacturer.is_empty() {
                    return Some(manufacturer);
                }
            }
        }
        None
    }

    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    {
        let vendor = std::fs::read_to_string("/sys/class/dmi/id/board_vendor")
            .map(|s| s.trim().to_string())
            .ok();
        let name = std::fs::read_to_string("/sys/class/dmi/id/board_name")
            .map(|s| s.trim().to_string())
            .ok();

        match (vendor, name) {
            (Some(v), Some(n)) if !v.is_empty() && !n.is_empty() => {
                if n.starts_with(&v) {
                    Some(n)
                } else {
                    Some(format!("{} {}", v, n))
                }
            }
            (Some(v), _) if !v.is_empty() => Some(v),
            (_, Some(n)) if !n.is_empty() => Some(n),
            _ => None,
        }
    }
}

fn detect_bios() -> Option<String> {
    #[cfg(target_os = "macos")]
    {
        if let Ok(output) = std::process::Command::new("system_profiler")
            .arg("SPHardwareDataType")
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                for line in stdout.lines() {
                    let line = line.trim();
                    if line.starts_with("System Firmware Version:")
                        || line.starts_with("Boot ROM Version:")
                    {
                        if let Some(val) = line.split(':').nth(1) {
                            return Some(val.trim().to_string());
                        }
                    }
                }
            }
        }
        None
    }

    #[cfg(target_os = "windows")]
    {
        if let Ok(output) = std::process::Command::new("wmic")
            .args([
                "bios",
                "get",
                "manufacturer,smbiosbiosversion,releasedate",
                "/value",
            ])
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                let mut manufacturer = String::new();
                let mut version = String::new();
                let mut date = String::new();
                for line in stdout.lines() {
                    let line = line.trim();
                    if line.starts_with("Manufacturer=") {
                        manufacturer = line
                            .strip_prefix("Manufacturer=")
                            .unwrap_or("")
                            .trim()
                            .to_string();
                    } else if line.starts_with("SMBIOSBIOSVersion=") {
                        version = line
                            .strip_prefix("SMBIOSBIOSVersion=")
                            .unwrap_or("")
                            .trim()
                            .to_string();
                    } else if line.starts_with("ReleaseDate=") {
                        let raw_date = line.strip_prefix("ReleaseDate=").unwrap_or("").trim();
                        if raw_date.len() >= 8 {
                            let year = &raw_date[0..4];
                            let month = &raw_date[4..6];
                            let day = &raw_date[6..8];
                            date = format!("{}/{}/{}", month, day, year);
                        } else {
                            date = raw_date.to_string();
                        }
                    }
                }

                let mut parts = Vec::new();
                if !manufacturer.is_empty() {
                    parts.push(manufacturer);
                }
                if !version.is_empty() {
                    parts.push(version);
                }
                let mut res = parts.join(" ");
                if !date.is_empty() {
                    if res.is_empty() {
                        res = date;
                    } else {
                        res = format!("{} ({})", res, date);
                    }
                }
                if !res.is_empty() {
                    return Some(res);
                }
            }
        }
        None
    }

    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    {
        let vendor = std::fs::read_to_string("/sys/class/dmi/id/bios_vendor")
            .map(|s| s.trim().to_string())
            .ok();
        let version = std::fs::read_to_string("/sys/class/dmi/id/bios_version")
            .map(|s| s.trim().to_string())
            .ok();
        let date = std::fs::read_to_string("/sys/class/dmi/id/bios_date")
            .map(|s| s.trim().to_string())
            .ok();

        let mut parts = Vec::new();
        if let Some(v) = vendor {
            if !v.is_empty() {
                parts.push(v);
            }
        }
        if let Some(ver) = version {
            let mut ver_cleaned = ver;
            while ver_cleaned.contains(" )") {
                ver_cleaned = ver_cleaned.replace(" )", ")");
            }
            let ver_cleaned = ver_cleaned.trim().to_string();
            if !ver_cleaned.is_empty() {
                parts.push(ver_cleaned);
            }
        }
        let mut res = parts.join(" ");
        if let Some(d) = date {
            if !d.is_empty() {
                if res.is_empty() {
                    res = d;
                } else {
                    res = format!("{} ({})", res, d);
                }
            }
        }
        if !res.is_empty() {
            Some(res)
        } else {
            None
        }
    }
}

#[allow(dead_code)]
fn parse_monitor_name_from_edid(edid: &[u8]) -> Option<String> {
    if edid.len() < 128 {
        return None;
    }
    let offsets = [54, 72, 90, 108];
    for &offset in &offsets {
        if offset + 18 <= edid.len() {
            let block = &edid[offset..offset + 18];
            if block[0] == 0x00 && block[1] == 0x00 && block[2] == 0x00 && block[3] == 0xFC {
                let name_bytes = &block[4..17];
                let name = String::from_utf8_lossy(name_bytes);
                let cleaned = name.trim().replace('\0', "").to_string();
                if !cleaned.is_empty() {
                    return Some(cleaned);
                }
            }
        }
    }
    None
}

#[allow(dead_code)]
fn parse_refresh_rate_from_edid(edid: &[u8]) -> Option<f64> {
    if edid.len() < 72 {
        return None;
    }
    let block = &edid[54..72];
    let pixel_clock = ((block[1] as u32) << 8) | (block[0] as u32);
    if pixel_clock == 0 {
        return None;
    }
    let pixel_clock_hz = pixel_clock * 10_000;
    let h_active = (block[2] as u32) | (((block[4] as u32) & 0xF0) << 4);
    let h_blanking = (block[3] as u32) | (((block[4] as u32) & 0x0F) << 8);
    let v_active = (block[5] as u32) | (((block[7] as u32) & 0xF0) << 4);
    let v_blanking = (block[6] as u32) | (((block[7] as u32) & 0x0F) << 8);

    let h_total = h_active + h_blanking;
    let v_total = v_active + v_blanking;
    if h_total == 0 || v_total == 0 {
        return None;
    }

    let refresh = (pixel_clock_hz as f64) / ((h_total * v_total) as f64);
    Some((refresh * 100.0).round() / 100.0)
}

#[allow(dead_code)]
fn format_refresh_rate(refresh: f64) -> String {
    if (refresh - refresh.round()).abs() < 0.01 {
        format!("{:.0}", refresh)
    } else {
        format!("{:.2}", refresh)
    }
}

#[allow(dead_code)]
fn parse_serial_number_from_edid(edid: &[u8]) -> Option<String> {
    if edid.len() < 128 {
        return None;
    }
    // 1. Try finding ASCII Serial Number descriptor block (tag 0xFF)
    let offsets = [54, 72, 90, 108];
    for &offset in &offsets {
        if offset + 18 <= edid.len() {
            let block = &edid[offset..offset + 18];
            if block[0] == 0x00 && block[1] == 0x00 && block[2] == 0x00 && block[3] == 0xFF {
                let serial_bytes = &block[4..17];
                let serial = String::from_utf8_lossy(serial_bytes);
                let cleaned = serial.trim().replace('\0', "").to_string();
                if !cleaned.is_empty() {
                    return Some(cleaned);
                }
            }
        }
    }

    // 2. Fallback to the 32-bit numeric serial number at offset 12-15
    let serial_num = ((edid[15] as u32) << 24)
        | ((edid[14] as u32) << 16)
        | ((edid[13] as u32) << 8)
        | (edid[12] as u32);
    if serial_num != 0 && serial_num != 0xFFFFFFFF {
        return Some(serial_num.to_string());
    }

    None
}

#[allow(dead_code)]
fn get_monitor_name_for_port(port: &str) -> Option<String> {
    if let Ok(entries) = std::fs::read_dir("/sys/class/drm") {
        for entry in entries.filter_map(|e| e.ok()) {
            let name = entry.file_name().to_string_lossy().to_string();
            if name.ends_with(port) {
                let edid_path = entry.path().join("edid");
                if edid_path.exists() {
                    if let Ok(edid_bytes) = std::fs::read(&edid_path) {
                        if let Some(monitor_name) = parse_monitor_name_from_edid(&edid_bytes) {
                            return Some(monitor_name);
                        }
                    }
                }
            }
        }
    }
    None
}

fn detect_displays() -> Vec<String> {
    #[cfg(target_os = "macos")]
    {
        if let Ok(output) = std::process::Command::new("system_profiler")
            .arg("SPDisplaysDataType")
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                return parse_macos_displays(&stdout);
            }
        }
        Vec::new()
    }

    #[cfg(target_os = "windows")]
    {
        let mut displays = Vec::new();
        if let Ok(output) = std::process::Command::new("wmic")
            .args([
                "path",
                "Win32_VideoController",
                "get",
                "Name,CurrentHorizontalResolution,CurrentVerticalResolution,CurrentRefreshRate",
                "/value",
            ])
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                let mut name = String::new();
                let mut width = String::new();
                let mut height = String::new();
                let mut refresh = String::new();
                for line in stdout.lines() {
                    let line = line.trim();
                    if line.starts_with("Name=") {
                        name = line.strip_prefix("Name=").unwrap_or("").trim().to_string();
                    } else if line.starts_with("CurrentHorizontalResolution=") {
                        width = line
                            .strip_prefix("CurrentHorizontalResolution=")
                            .unwrap_or("")
                            .trim()
                            .to_string();
                    } else if line.starts_with("CurrentVerticalResolution=") {
                        height = line
                            .strip_prefix("CurrentVerticalResolution=")
                            .unwrap_or("")
                            .trim()
                            .to_string();
                    } else if line.starts_with("CurrentRefreshRate=") {
                        refresh = line
                            .strip_prefix("CurrentRefreshRate=")
                            .unwrap_or("")
                            .trim()
                            .to_string();
                    }

                    if !name.is_empty()
                        && !width.is_empty()
                        && !height.is_empty()
                        && !refresh.is_empty()
                    {
                        displays.push(format!("{} ({}x{} @ {}Hz)", name, width, height, refresh));
                        name.clear();
                        width.clear();
                        height.clear();
                        refresh.clear();
                    }
                }
                if !name.is_empty() && !width.is_empty() && !height.is_empty() {
                    displays.push(format!("{} ({}x{})", name, width, height));
                }
            }
        }
        displays
    }

    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    {
        let mut displays = Vec::new();

        if let Ok(output) = std::process::Command::new("xrandr")
            .arg("--current")
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                displays = parse_xrandr_displays(&stdout);
            }
        }

        if displays.is_empty() {
            if let Ok(entries) = std::fs::read_dir("/sys/class/drm") {
                for entry in entries.filter_map(|e| e.ok()) {
                    let path = entry.path();
                    let status_path = path.join("status");
                    let modes_path = path.join("modes");
                    let edid_path = path.join("edid");
                    if status_path.exists() && modes_path.exists() {
                        if let Ok(status) = std::fs::read_to_string(&status_path) {
                            if status.trim() == "connected" {
                                if let Ok(modes) = std::fs::read_to_string(&modes_path) {
                                    if let Some(first_mode) = modes.lines().next() {
                                        let res = first_mode.trim().to_string();
                                        let port = entry.file_name().to_string_lossy().to_string();
                                        let clean_port = if let Some(idx) = port.find('-') {
                                            port[idx + 1..].to_string()
                                        } else {
                                            port
                                        };

                                        let edid_bytes = if edid_path.exists() {
                                            std::fs::read(&edid_path).ok()
                                        } else {
                                            None
                                        };

                                        let name = edid_bytes
                                            .as_ref()
                                            .and_then(|bytes| parse_monitor_name_from_edid(bytes))
                                            .unwrap_or(clean_port);

                                        let refresh = edid_bytes
                                            .as_ref()
                                            .and_then(|bytes| parse_refresh_rate_from_edid(bytes));

                                        let serial = edid_bytes
                                            .as_ref()
                                            .and_then(|bytes| parse_serial_number_from_edid(bytes));

                                        let display_name = if let Some(ref s) = serial {
                                            format!("{} #{}", name, s)
                                        } else {
                                            name
                                        };

                                        if let Some(r) = refresh {
                                            displays.push(format!(
                                                "{} ({} @ {}Hz)",
                                                display_name,
                                                res,
                                                format_refresh_rate(r)
                                            ));
                                        } else {
                                            displays.push(format!("{} ({})", display_name, res));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        displays
    }
}

#[cfg(target_os = "macos")]
fn parse_macos_displays(stdout: &str) -> Vec<String> {
    let mut displays = Vec::new();
    let mut current_name = None;
    let mut current_res = None;
    let mut in_displays = false;

    for line in stdout.lines() {
        let trimmed = line.trim();
        let indent = line.len() - line.trim_start().len();

        if trimmed.starts_with("Displays:") {
            in_displays = true;
            continue;
        }

        if in_displays {
            if indent < 8 && !trimmed.is_empty() && !trimmed.starts_with("Displays:") {
                in_displays = false;
                continue;
            }

            if trimmed.ends_with(':') && !trimmed.starts_with("UI Looks like:") {
                let name = trimmed.trim_end_matches(':').trim().to_string();
                current_name = Some(name);
            } else if trimmed.starts_with("Resolution:") {
                let res = trimmed.strip_prefix("Resolution:").unwrap_or("").trim();
                let cleaned = res.replace(" ", "");
                current_res = Some(cleaned);
            } else if trimmed.starts_with("UI Looks like:") {
                if let Some(res) = current_res.take() {
                    let name_str = current_name.take().unwrap_or_else(|| "Display".to_string());
                    if let Some(idx) = trimmed.find('@') {
                        let freq = trimmed[idx..].trim();
                        let freq_clean = freq.replace(" ", "").replace(".00", "");
                        displays.push(format!(
                            "{} ({} @ {})",
                            name_str,
                            res,
                            freq_clean.trim_start_matches('@')
                        ));
                    } else {
                        displays.push(format!("{} ({})", name_str, res));
                    }
                }
            }
        }
    }
    if let Some(res) = current_res {
        let name_str = current_name.unwrap_or_else(|| "Display".to_string());
        displays.push(format!("{} ({})", name_str, res));
    }
    displays
}

#[cfg(not(any(target_os = "macos", target_os = "windows")))]
fn parse_xrandr_displays(stdout: &str) -> Vec<String> {
    let mut displays = Vec::new();
    let mut current_display = None;
    let mut current_port = None;
    for line in stdout.lines() {
        let line = line.trim();
        if line.contains(" connected ") {
            let parts: Vec<&str> = line.split_whitespace().collect();
            if let Some(&port) = parts.first() {
                current_port = Some(port.to_string());
            }
            for part in parts {
                if part.contains('x') && part.contains('+') {
                    if let Some(res) = part.split('+').next() {
                        current_display = Some(res.to_string());
                    }
                }
            }
        } else if line.contains('*') {
            if let Some(res) = current_display.take() {
                let port = current_port.take().unwrap_or_default();
                let name = get_monitor_name_for_port(&port).unwrap_or_else(|| port.clone());
                let parts: Vec<&str> = line.split_whitespace().collect();
                let mut added = false;
                for part in parts {
                    if part.contains('*') {
                        let freq = part.trim_end_matches(['*', '+']);
                        displays.push(format!("{} ({} @ {}Hz)", name, res, freq));
                        added = true;
                        break;
                    }
                }
                if !added {
                    displays.push(format!("{} ({})", name, res));
                }
            }
        }
    }
    displays
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

    #[test]
    fn test_system_info_collect() {
        use clap::Parser;
        let cli = Cli::try_parse_from(["retch"]).unwrap();
        let config = Config::default();
        let res = SystemInfo::collect(&cli, &config);
        assert!(res.is_ok());
        let info = res.unwrap();
        assert!(!info.os.is_empty());
        assert!(info.cpu_cores > 0);
    }

    #[cfg(target_os = "macos")]
    #[test]
    fn test_parse_macos_displays() {
        let sample = "Graphics/Displays:\n\n    Apple M2:\n\n      Chipset Model: Apple M2\n      Displays:\n        Color LCD:\n          Resolution: 3024 x 1964\n          UI Looks like: 1512 x 982 @ 60.00Hz\n";
        let parsed = parse_macos_displays(sample);
        assert_eq!(parsed, vec!["Color LCD (3024x1964 @ 60Hz)".to_string()]);
    }

    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    #[test]
    fn test_parse_xrandr_displays() {
        let sample = "Screen 0: minimum 320 x 200, current 2560 x 1440\nDP-1 connected primary 2560x1440+0+0\n   2560x1440     143.97*+\n   1920x1080     60.00\n";
        let parsed = parse_xrandr_displays(sample);
        assert_eq!(parsed, vec!["DP-1 (2560x1440 @ 143.97Hz)".to_string()]);
    }

    #[test]
    fn test_parse_refresh_rate_from_edid() {
        // Construct a mock EDID block with a DTD at byte 54
        let mut edid = vec![0u8; 128];
        // Pixel clock = 14850 -> 0x3A02 (in 10 kHz units -> 148.5 MHz)
        edid[54] = 0x02;
        edid[55] = 0x3A;
        // H Active = 1920 (0x780), H Blanking = 280 (0x118)
        edid[56] = 0x80; // Low 8 bits of H Active
        edid[57] = 0x18; // Low 8 bits of H Blanking
        edid[58] = 0x71; // High 4 bits: H Active (7), H Blanking (1)
                         // V Active = 1080 (0x438), V Blanking = 45 (0x2D)
        edid[59] = 0x38; // Low 8 bits of V Active
        edid[60] = 0x2D; // Low 8 bits of V Blanking
        edid[61] = 0x40; // High 4 bits: V Active (4), V Blanking (0)

        let refresh = parse_refresh_rate_from_edid(&edid);
        assert!(refresh.is_some());
        // 148,500,000 / ((1920 + 280) * (1080 + 45)) = 60 Hz
        assert_eq!(refresh.unwrap(), 60.0);
    }

    #[test]
    fn test_format_refresh_rate() {
        assert_eq!(format_refresh_rate(60.0), "60");
        assert_eq!(format_refresh_rate(59.94), "59.94");
        assert_eq!(format_refresh_rate(143.971), "143.97");
    }

    #[test]
    fn test_parse_serial_number_from_edid() {
        let mut edid = vec![0u8; 128];
        // 1. Test fallback 32-bit numeric serial
        edid[12] = 0x78;
        edid[13] = 0x56;
        edid[14] = 0x34;
        edid[15] = 0x12; // 0x12345678 = 305419896
        assert_eq!(
            parse_serial_number_from_edid(&edid),
            Some("305419896".to_string())
        );

        // 2. Test ASCII Monitor Serial Number descriptor block (tag 0xFF) at offset 72
        edid[72] = 0x00;
        edid[73] = 0x00;
        edid[74] = 0x00;
        edid[75] = 0xFF; // ASCII Serial Number descriptor tag
        let serial_str = b"CN0123456789\n";
        for i in 0..serial_str.len() {
            edid[76 + i] = serial_str[i];
        }
        assert_eq!(
            parse_serial_number_from_edid(&edid),
            Some("CN0123456789".to_string())
        );
    }

    #[test]
    fn test_parse_asound_cards() {
        let sample = " 0 [PCH            ]: HDA-Intel - HDA Intel PCH\n 1 [NVidia         ]: HDA-Intel - HDA NVIDIA HDMI\n 2 [sofhdadsp      ]: sof-hda-dsp - sof-hda-dsp\n                      DellInc.-Inspiron1676302_in_1-0DR8JD\n";
        let parsed = parse_asound_cards(sample, "/nonexistent");
        assert_eq!(
            parsed,
            vec![
                "HDA Intel PCH".to_string(),
                "HDA NVIDIA HDMI".to_string(),
                "sof-hda-dsp".to_string()
            ]
        );
    }

    #[test]
    fn test_parse_airport_output() {
        let sample = "     agrCtlRSSI: -45\n     lastTxRate: 866\n           SSID: MyHomeWiFi\n";
        assert_eq!(
            parse_airport_output(sample),
            Some("MyHomeWiFi (↑866 Mbps)".to_string())
        );

        let sample_no_rate = "     agrCtlRSSI: -45\n           SSID: GuestNetwork\n";
        assert_eq!(
            parse_airport_output(sample_no_rate),
            Some("GuestNetwork".to_string())
        );
    }

    #[test]
    fn test_parse_netsh_output() {
        let sample = "    Name                   : Wi-Fi\n    State                  : connected\n    SSID                   : Office_Wi-Fi\n    Receive rate (Mbps)    : 433\n    Transmit rate (Mbps)   : 866\n    Band                   : 5 GHz\n";
        assert_eq!(
            parse_netsh_output(sample),
            Some("Office_Wi-Fi (5 GHz [↓433 Mbps ↑866 Mbps])".to_string())
        );
    }

    #[test]
    fn test_parse_iw_link_output() {
        let sample = "Connected to 84:78:48:dc:97:23 (on wlp2s0)\n        SSID: OfficeNet\n        freq: 6135.0\n        rx bitrate: 6.0 MBit/s\n        tx bitrate: 864.6 MBit/s 160MHz HE-MCS 4\n";
        let (ssid, links) = parse_iw_link_output(sample);
        assert_eq!(ssid, Some("OfficeNet".to_string()));
        assert_eq!(links.len(), 1);
        assert_eq!(links[0].freq, Some(6135.0));
        assert_eq!(links[0].rx_rate, Some("6.0 MBit/s".to_string()));
        assert_eq!(links[0].tx_rate, Some("864.6 MBit/s".to_string()));

        // MLO multi-link mock output
        let sample_mlo = "Connected to aa:bb:cc:dd:ee:ff (on wlan0)\n        SSID: HomeWiFi\n        freq: 5180.0\n        rx bitrate: 866.0 MBit/s\n        tx bitrate: 866.0 MBit/s\nConnected to aa:bb:cc:dd:ee:01 (on wlan0)\n        freq: 6135.0\n        rx bitrate: 1200.0 MBit/s\n        tx bitrate: 1200.0 MBit/s\n";
        let (ssid_mlo, links_mlo) = parse_iw_link_output(sample_mlo);
        assert_eq!(ssid_mlo, Some("HomeWiFi".to_string()));
        assert_eq!(links_mlo.len(), 2);
        assert_eq!(links_mlo[0].freq, Some(5180.0));
        assert_eq!(links_mlo[1].freq, Some(6135.0));
    }

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

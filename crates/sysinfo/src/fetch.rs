// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 l1a

//! System information gathering.
//!
//! Uses the `sysinfo` crate and other heuristics to collect details
//! about the OS, hardware, and environment.

use crate::gpu;
use chrono::TimeZone;
use sysinfo::{Components, Disks, System, Users};

/// Options for controlling what system information is gathered.
///
/// This decouples the collection logic from the CLI argument parser,
/// allowing `retch-sysinfo` to be used as a standalone library.
#[derive(Debug, Default, Clone)]
pub struct CollectOptions {
    /// Whether to collect all fields (long mode) or only the primary/default ones.
    pub long: bool,
}

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
    /// UI Theme (GTK, Qt, macOS, Windows).
    pub ui_theme: Option<String>,
    /// Icon theme (GTK/Qt).
    pub icons: Option<String>,
    /// Cursor theme (GTK/Qt).
    pub cursor: Option<String>,
    /// System Font.
    pub font: Option<String>,
    /// Terminal Font (configured in terminal emulator).
    pub terminal_font: Option<String>,
    /// Connected camera/webcam names.
    pub camera: Vec<String>,
    /// Connected gamepad/controller names.
    pub gamepad: Vec<String>,
}

impl SystemInfo {
    /// Collects system information using sysinfo and environment probes.
    ///
    /// This method aggregates data from the operating system, hardware,
    /// and current user environment into a `SystemInfo` struct.
    pub fn collect(opts: CollectOptions) -> anyhow::Result<Self> {
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

        let total_mem = sys.total_memory() as f64 / 1024.0 / 1024.0 / 1024.0;
        let used_mem = sys.used_memory() as f64 / 1024.0 / 1024.0 / 1024.0;
        let memory = format!("{:.1} / {:.1} GB", used_mem, total_mem);

        let total_swap = sys.total_swap() as f64 / 1024.0 / 1024.0 / 1024.0;
        let used_swap = sys.used_swap() as f64 / 1024.0 / 1024.0 / 1024.0;
        let swap = if total_swap > 0.0 {
            format!("{:.1} / {:.1} GB", used_swap, total_swap)
        } else {
            "No swap".to_string()
        };

        let uptime = format!("{}s", System::uptime());

        let disks_list = Disks::new_with_refreshed_list();
        let disks: Vec<String> = if !opts.long {
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

        let battery = crate::battery::get_battery_info().map(|bat| {
            let pct = bat.percentage;
            let state = match bat.state {
                crate::battery::BatteryState::Charging => "charging",
                crate::battery::BatteryState::Discharging => "discharging",
                crate::battery::BatteryState::Full => "full",
                _ => "not charging",
            };
            let vendor = bat.vendor;
            let model = bat.model;

            // Format time remaining as "Xh Ym" or "Xd Yh"
            let time_str = match bat.state {
                crate::battery::BatteryState::Charging => bat.time_remaining.map(|d| {
                    let total_mins = d.as_secs() / 60;
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
                crate::battery::BatteryState::Discharging => bat.time_remaining.map(|d| {
                    let total_mins = d.as_secs() / 60;
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
            if let Some(health) = bat.health {
                if health < 99.0 {
                    parts.push(format!("{:.0}% health", health));
                }
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
            (ui_theme, icons, cursor, font),
            camera,
            gamepad,
        ) = std::thread::scope(|s| {
            let gpu_handle = s.spawn(|| {
                gpu::detect_gpus()
                    .into_iter()
                    .map(|g| g.format())
                    .collect::<Vec<String>>()
            });
            let packages_handle = s.spawn(crate::packages::detect_packages);
            let public_ip_handle = s.spawn(crate::network::detect_public_ip);
            let network_ips_handle = s.spawn(crate::network::detect_active_interface_and_local_ip);
            let motherboard_handle = s.spawn(crate::motherboard::detect_motherboard);
            let bios_handle = s.spawn(crate::bios::detect_bios);
            let displays_handle = s.spawn(crate::display::detect_displays);
            let audio_handle = s.spawn(|| crate::audio::detect_audio(&sys));
            let wifi_handle = s.spawn(crate::network::detect_wifi);
            let bluetooth_handle = s.spawn(crate::bluetooth::detect_bluetooth);
            let ui_theme_and_fonts_handle = s.spawn(crate::theme::detect_ui_theme_and_fonts);
            let camera_handle = s.spawn(crate::camera::detect_camera);
            let gamepad_handle = s.spawn(crate::gamepad::detect_gamepad);

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
                ui_theme_and_fonts_handle
                    .join()
                    .unwrap_or((None, None, None, None)),
                camera_handle.join().unwrap_or_default(),
                gamepad_handle.join().unwrap_or_default(),
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

        let networks =
            crate::network::detect_networks(active_interface.as_deref(), local_ip.as_deref());

        let boot_timestamp = System::boot_time();
        let boot_dt = chrono::Local
            .timestamp_opt(boot_timestamp as i64, 0)
            .single()
            .map(|dt| dt.format("%Y-%m-%dT%H:%M:%S%:z").to_string())
            .unwrap_or_else(|| boot_timestamp.to_string());
        let boot_time = boot_dt;

        // Environment-based info
        let shell = crate::shell::detect_shell(&sys);
        let terminal = crate::terminal::detect_terminal(&sys);
        let terminal_font = crate::terminal::detect_terminal_font(terminal.as_deref());
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
            ui_theme,
            icons,
            cursor,
            font,
            terminal_font,
            camera,
            gamepad,
        })
    }
}

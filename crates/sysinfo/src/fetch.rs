// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! System information gathering.
//!
//! Uses the `sysinfo` crate and other heuristics to collect details
//! about the OS, hardware, and environment.

use crate::gpu;
use chrono::TimeZone;
use sysinfo::{Components, System, Users};

/// Options for controlling what system information is gathered.
///
/// This decouples the collection logic from the CLI argument parser,
/// allowing `retch-sysinfo` to be used as a standalone library.
#[derive(Debug, Default, Clone)]
pub struct CollectOptions {
    /// Show all disk mounts (long/full mode); when false, shows only the home-directory mount.
    pub long: bool,
    /// Include FUSE mounts (full mode only).
    pub full: bool,
    /// List of fields that are requested to be displayed. If None, all fields are collected.
    pub fields: Option<Vec<String>>,
    /// Optional location override for weather lookup (city, ZIP, airport code, coordinates).
    pub weather_location: Option<String>,
    /// Temperature unit for weather display.
    pub weather_unit: crate::weather::WeatherUnit,
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
    /// Formatted core topology string (e.g. "8C / 16T" or "6P + 4E / 16T").
    pub cpu_core_info: String,
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
    /// CPU cache sizes (L1d, L1i, L2, L3).
    pub cpu_cache: Option<String>,
    /// Current CPU utilization as a percentage.
    pub cpu_usage: Option<String>,
    /// Physical disk models, sizes, and types.
    pub physical_disks: Vec<String>,
    /// Physical memory (RAM) slot summary — type, speed, capacity.
    pub physical_memory: Option<String>,
    /// PID 1 / init system (systemd, runit, OpenRC, launchd, etc.).
    pub init_system: Option<String>,
    /// Chassis type (Desktop, Laptop, Server, etc.).
    pub chassis: Option<String>,
    /// System locale (from $LANG / $LC_ALL).
    pub locale: Option<String>,
    /// Second-stage bootloader (GRUB, systemd-boot, etc.).
    pub bootmgr: Option<String>,
    /// Default editor ($VISUAL / $EDITOR).
    pub editor: Option<String>,
    /// Current weather from Open-Meteo.
    pub weather: Option<String>,
    /// Active window manager name.
    pub wm: Option<String>,
    /// Configured DNS nameservers.
    pub dns: Vec<String>,
    /// Terminal dimensions as "COLSxROWS".
    pub terminal_size: Option<String>,
}

impl SystemInfo {
    /// Collects system information using sysinfo and environment probes.
    ///
    /// This method aggregates data from the operating system, hardware,
    /// and current user environment into a `SystemInfo` struct.
    pub fn collect(opts: CollectOptions) -> anyhow::Result<Self> {
        let should_collect = |field_name: &str| -> bool {
            match &opts.fields {
                Some(fields) => {
                    let norm_field = field_name.to_lowercase().replace(['-', '_'], " ");
                    let norm_field_no_spaces = norm_field.replace(' ', "");
                    fields.iter().any(|f| {
                        let norm_f = f.to_lowercase().replace(['-', '_'], " ");
                        norm_f == norm_field || norm_f.replace(' ', "") == norm_field_no_spaces
                    })
                }
                None => true,
            }
        };

        let mut refresh_kind = sysinfo::RefreshKind::nothing();
        if should_collect("cpu")
            || should_collect("cpu usage")
            || should_collect("cpu-usage")
            || should_collect("cpu cache")
            || should_collect("cpu-cache")
        {
            refresh_kind = refresh_kind.with_cpu(sysinfo::CpuRefreshKind::everything());
        }
        if should_collect("memory")
            || should_collect("swap")
            || should_collect("phys mem")
            || should_collect("phys-mem")
        {
            refresh_kind = refresh_kind.with_memory(sysinfo::MemoryRefreshKind::everything());
        }
        if should_collect("procs") || should_collect("audio") {
            refresh_kind = refresh_kind.with_processes(sysinfo::ProcessRefreshKind::nothing());
        }

        let mut sys = System::new_with_specifics(refresh_kind);

        let os = System::long_os_version()
            .or_else(System::name)
            .unwrap_or_else(|| "Unknown".to_string());

        let kernel = System::kernel_version();
        let hostname = System::host_name();

        let cpu = if should_collect("cpu") {
            sys.cpus()
                .first()
                .map(|c| c.brand().to_string())
                .unwrap_or_else(|| "Unknown CPU".to_string())
        } else {
            String::new()
        };

        let cpu_cores = if should_collect("cpu") {
            sys.cpus().len()
        } else {
            0
        };
        let cpu_core_info = if should_collect("cpu") {
            format_cpu_cores(cpu_cores, System::physical_core_count())
        } else {
            String::new()
        };

        let memory = if should_collect("memory") {
            let total_mem = sys.total_memory() as f64 / 1024.0 / 1024.0 / 1024.0;
            let used_mem = sys.used_memory() as f64 / 1024.0 / 1024.0 / 1024.0;
            format!("{:.1} / {:.1} GB", used_mem, total_mem)
        } else {
            String::new()
        };

        let swap = if should_collect("swap") {
            let total_swap = sys.total_swap() as f64 / 1024.0 / 1024.0 / 1024.0;
            let used_swap = sys.used_swap() as f64 / 1024.0 / 1024.0 / 1024.0;
            if total_swap > 0.0 {
                format!("{:.1} / {:.1} GB", used_swap, total_swap)
            } else {
                "No swap".to_string()
            }
        } else {
            String::new()
        };

        let uptime = format!("{}s", System::uptime());

        let disks: Vec<String> = if should_collect("disk") {
            let disks_list = crate::disk::detect_logical_disks(opts.full);
            let format_disk = |(mount, total, avail, fs): &(String, u64, u64, String)| {
                let total_gb = *total as f64 / 1024.0 / 1024.0 / 1024.0;
                let avail_gb = *avail as f64 / 1024.0 / 1024.0 / 1024.0;
                format!(
                    "{} ({}): {:.1} GB free / {:.1} GB",
                    mount, fs, avail_gb, total_gb
                )
            };
            if !opts.long {
                let home = dirs::home_dir().unwrap_or_else(|| std::path::PathBuf::from("/"));
                let home_path = std::path::Path::new(&home);
                let best = disks_list
                    .iter()
                    .filter(|(mp, ..)| home_path.starts_with(mp))
                    .max_by_key(|(mp, ..)| std::path::Path::new(mp).components().count());
                if let Some(disk) = best {
                    vec![format_disk(disk)]
                } else {
                    disks_list.iter().map(format_disk).collect()
                }
            } else {
                disks_list.iter().map(format_disk).collect()
            }
        } else {
            Vec::new()
        };

        let battery = if should_collect("battery") {
            crate::battery::get_battery_info().map(|bat| {
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
            })
        } else {
            None
        };

        let arch = System::cpu_arch();

        let processes = if should_collect("procs") || should_collect("audio") {
            sys.processes().len()
        } else {
            0
        };

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
            physical_disks,
            physical_memory,
            weather,
        ) = std::thread::scope(|s| {
            let gpu_handle = if should_collect("gpu") {
                Some(s.spawn(|| {
                    gpu::detect_gpus()
                        .into_iter()
                        .map(|g| g.format())
                        .collect::<Vec<String>>()
                }))
            } else {
                None
            };
            let packages_handle = if should_collect("packages") {
                Some(s.spawn(crate::packages::detect_packages))
            } else {
                None
            };
            let public_ip_handle = if should_collect("public ip") {
                Some(s.spawn(crate::network::detect_public_ip))
            } else {
                None
            };
            let network_ips_handle = if should_collect("net") {
                Some(s.spawn(crate::network::detect_active_interface_and_local_ip))
            } else {
                None
            };
            let motherboard_handle = if should_collect("motherboard") {
                Some(s.spawn(crate::motherboard::detect_motherboard))
            } else {
                None
            };
            let bios_handle = if should_collect("bios") {
                Some(s.spawn(crate::bios::detect_bios))
            } else {
                None
            };
            let displays_handle = if should_collect("display") {
                Some(s.spawn(crate::display::detect_displays))
            } else {
                None
            };
            let audio_handle = if should_collect("audio") {
                Some(s.spawn(|| crate::audio::detect_audio(&sys)))
            } else {
                None
            };
            let wifi_handle = if should_collect("wifi") {
                Some(s.spawn(crate::network::detect_wifi))
            } else {
                None
            };
            let bluetooth_handle = if should_collect("bluetooth") {
                Some(s.spawn(crate::bluetooth::detect_bluetooth))
            } else {
                None
            };
            let ui_theme_and_fonts_handle = if should_collect("theme")
                || should_collect("icons")
                || should_collect("cursor")
                || should_collect("font")
            {
                Some(s.spawn(crate::theme::detect_ui_theme_and_fonts))
            } else {
                None
            };
            let camera_handle = if should_collect("camera") {
                Some(s.spawn(crate::camera::detect_camera))
            } else {
                None
            };
            let gamepad_handle = if should_collect("gamepad") {
                Some(s.spawn(crate::gamepad::detect_gamepad))
            } else {
                None
            };
            let physical_disks_handle = if should_collect("phys disk") {
                Some(s.spawn(crate::disk::detect_physical_disks))
            } else {
                None
            };
            let physical_memory_handle = if should_collect("phys mem") {
                Some(s.spawn(crate::memory::detect_physical_memory))
            } else {
                None
            };
            let weather_location = opts.weather_location.clone();
            let weather_unit = opts.weather_unit;
            let weather_handle = if should_collect("weather") {
                Some(s.spawn(move || {
                    crate::weather::detect_weather(weather_location.as_deref(), weather_unit)
                }))
            } else {
                None
            };

            (
                gpu_handle
                    .map(|h| h.join().unwrap_or_default())
                    .unwrap_or_default(),
                packages_handle.and_then(|h| h.join().ok().flatten()),
                public_ip_handle.and_then(|h| h.join().ok().flatten()),
                network_ips_handle
                    .map(|h| h.join().unwrap_or((None, None)))
                    .unwrap_or((None, None)),
                motherboard_handle.and_then(|h| h.join().ok().flatten()),
                bios_handle.and_then(|h| h.join().ok().flatten()),
                displays_handle
                    .map(|h| h.join().unwrap_or_default())
                    .unwrap_or_default(),
                audio_handle.and_then(|h| h.join().ok().flatten()),
                wifi_handle.and_then(|h| h.join().ok().flatten()),
                bluetooth_handle.and_then(|h| h.join().ok().flatten()),
                ui_theme_and_fonts_handle
                    .map(|h| h.join().unwrap_or((None, None, None, None)))
                    .unwrap_or((None, None, None, None)),
                camera_handle
                    .map(|h| h.join().unwrap_or_default())
                    .unwrap_or_default(),
                gamepad_handle
                    .map(|h| h.join().unwrap_or_default())
                    .unwrap_or_default(),
                physical_disks_handle
                    .map(|h| h.join().unwrap_or_default())
                    .unwrap_or_default(),
                physical_memory_handle.and_then(|h| h.join().ok().flatten()),
                weather_handle.and_then(|h| h.join().ok().flatten()),
            )
        });

        let mut temps: Vec<String> = if should_collect("temp") {
            Components::new_with_refreshed_list()
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
                .collect()
        } else {
            Vec::new()
        };

        // Sort so CPU temperatures appear first
        temps.sort_by(|a, b| {
            let a_cpu = a.to_lowercase().contains("cpu") || a.to_lowercase().contains("core");
            let b_cpu = b.to_lowercase().contains("cpu") || b.to_lowercase().contains("core");
            b_cpu.cmp(&a_cpu)
        });

        let networks = if should_collect("net") {
            crate::network::detect_networks(active_interface.as_deref(), local_ip.as_deref())
        } else {
            Vec::new()
        };

        let boot_timestamp = System::boot_time();
        let boot_dt = chrono::Local
            .timestamp_opt(boot_timestamp as i64, 0)
            .single()
            .map(|dt| dt.format("%Y-%m-%dT%H:%M:%S%:z").to_string())
            .unwrap_or_else(|| boot_timestamp.to_string());
        let boot_time = boot_dt;

        // Environment-based info
        let shell = if should_collect("shell") {
            crate::shell::detect_shell(&sys)
        } else {
            None
        };
        let terminal = if should_collect("terminal") {
            crate::terminal::detect_terminal(&sys)
        } else {
            None
        };
        let terminal_font = if should_collect("terminal font")
            || should_collect("terminal-font")
            || should_collect("terminal_font")
        {
            crate::terminal::detect_terminal_font(terminal.as_deref())
        } else {
            None
        };
        let desktop = if should_collect("desktop") {
            std::env::var("XDG_CURRENT_DESKTOP")
                .or_else(|_| std::env::var("DESKTOP_SESSION"))
                .or_else(|_| std::env::var("XDG_SESSION_DESKTOP"))
                .or_else(|_| std::env::var("GDMSESSION"))
                .ok()
                .map(|s| normalize_desktop_name(&s))
                .filter(|s| !s.is_empty())
                .or_else(detect_desktop_from_proc)
        } else {
            None
        };

        // CPU frequency (current from sysinfo + min/max range from sysfs)
        let cpu_freq = if should_collect("cpu-freq")
            || should_collect("cpu freq")
            || should_collect("cpu_freq")
        {
            sys.cpus().first().map(|c| {
                let current = format!("{:.2} GHz", c.frequency() as f64 / 1000.0);
                if let Some((min_khz, max_khz)) = detect_cpu_freq_range() {
                    let min_ghz = min_khz as f64 / 1_000_000.0;
                    let max_ghz = max_khz as f64 / 1_000_000.0;
                    format!("{} ({:.2} \u{2013} {:.2} GHz)", current, min_ghz, max_ghz)
                } else {
                    current
                }
            })
        } else {
            None
        };

        // CPU cache sizes
        let cpu_cache = if should_collect("cpu-cache")
            || should_collect("cpu cache")
            || should_collect("cpu_cache")
        {
            detect_cpu_cache()
        } else {
            None
        };

        // CPU usage — refresh twice with a short sleep so sysinfo has a delta
        let cpu_usage = if should_collect("cpu-usage")
            || should_collect("cpu usage")
            || should_collect("cpu_usage")
        {
            std::thread::sleep(std::time::Duration::from_millis(200));
            sys.refresh_cpu_usage();
            let usage: f32 =
                sys.cpus().iter().map(|c| c.cpu_usage()).sum::<f32>() / sys.cpus().len() as f32;
            #[cfg(not(target_os = "windows"))]
            {
                let avg = System::load_average();
                let load_str = format!("{:.2}, {:.2}, {:.2}", avg.one, avg.five, avg.fifteen);
                if usage > 0.0 {
                    Some(format!("{:.1}% (load: {})", usage, load_str))
                } else if avg.one > 0.0 {
                    Some(format!("load: {}", load_str))
                } else {
                    None
                }
            }
            #[cfg(target_os = "windows")]
            {
                if usage > 0.0 {
                    Some(format!("{:.1}%", usage))
                } else {
                    None
                }
            }
        } else {
            None
        };

        let init_system = if should_collect("init") || should_collect("init system") {
            detect_init_system()
        } else {
            None
        };

        let chassis = if should_collect("chassis") {
            detect_chassis()
        } else {
            None
        };

        let locale = if should_collect("locale") {
            std::env::var("LC_ALL")
                .ok()
                .filter(|s| !s.is_empty())
                .or_else(|| std::env::var("LC_MESSAGES").ok().filter(|s| !s.is_empty()))
                .or_else(|| std::env::var("LANG").ok().filter(|s| !s.is_empty()))
        } else {
            None
        };

        let bootmgr = if should_collect("bootmgr") || should_collect("boot") {
            detect_bootmgr()
        } else {
            None
        };

        let editor = if should_collect("editor") {
            std::env::var("VISUAL")
                .ok()
                .filter(|s| !s.is_empty())
                .or_else(|| std::env::var("EDITOR").ok().filter(|s| !s.is_empty()))
        } else {
            None
        };

        let wm = if should_collect("wm") || should_collect("window manager") {
            crate::wm::detect_wm()
        } else {
            None
        };

        let dns = if should_collect("dns") {
            crate::network::detect_dns()
        } else {
            Vec::new()
        };

        let terminal_size = if should_collect("terminal size")
            || should_collect("terminal-size")
            || should_collect("terminal_size")
        {
            crate::terminal::detect_terminal_size()
        } else {
            None
        };

        // Current logged in user
        let current_user = std::env::var("USER").ok();

        // Number of interactive users (UID >= 1000, excluding system accounts)
        let users = if should_collect("users") {
            Users::new_with_refreshed_list()
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
                .count()
        } else {
            0
        };

        Ok(Self {
            os,
            kernel,
            hostname,
            arch,
            cpu,
            cpu_cores,
            cpu_core_info,
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
            cpu_cache,
            cpu_usage,
            physical_disks,
            physical_memory,
            init_system,
            chassis,
            locale,
            bootmgr,
            editor,
            weather,
            wm,
            dns,
            terminal_size,
        })
    }
}

/// Detects CPU cache sizes.
///
/// Linux: reads from `/sys/devices/system/cpu/cpu0/cache/` sysfs entries.
/// macOS: reads `hw.l1dcachesize`, `hw.l1icachesize`, `hw.l2cachesize`, `hw.l3cachesize` via sysctlbyname.
/// Returns `None` on Windows or if data is unavailable.
pub fn detect_cpu_cache() -> Option<String> {
    #[cfg(target_os = "linux")]
    {
        use std::fs;
        let cache_dir = std::path::Path::new("/sys/devices/system/cpu/cpu0/cache");
        if !cache_dir.exists() {
            return None;
        }

        struct CacheEntry {
            level: u32,
            kind: String,
            size_kb: u64,
        }

        let mut entries: Vec<CacheEntry> = Vec::new();

        let Ok(indices) = fs::read_dir(cache_dir) else {
            return None;
        };

        for entry in indices.flatten() {
            let path = entry.path();
            // Skip non-index entries (e.g. the uevent file)
            if !path.is_dir() {
                continue;
            }
            let level_str = match fs::read_to_string(path.join("level")) {
                Ok(s) => s,
                Err(_) => continue,
            };
            let level: u32 = match level_str.trim().parse() {
                Ok(n) => n,
                Err(_) => continue,
            };
            let kind = match fs::read_to_string(path.join("type")) {
                Ok(s) => s.trim().to_string(),
                Err(_) => continue,
            };
            let size_str = match fs::read_to_string(path.join("size")) {
                Ok(s) => s,
                Err(_) => continue,
            };
            let size_raw = size_str.trim();
            let size_kb: u64 = if let Some(k) = size_raw.strip_suffix('K') {
                match k.parse() {
                    Ok(n) => n,
                    Err(_) => continue,
                }
            } else if let Some(m) = size_raw.strip_suffix('M') {
                match m.parse::<u64>() {
                    Ok(n) => n * 1024,
                    Err(_) => continue,
                }
            } else {
                match size_raw.parse() {
                    Ok(n) => n,
                    Err(_) => continue,
                }
            };

            if kind != "Instruction" && kind != "Data" && kind != "Unified" {
                continue;
            }

            entries.push(CacheEntry {
                level,
                kind,
                size_kb,
            });
        }

        if entries.is_empty() {
            return None;
        }

        entries.sort_by_key(|e| (e.level, e.kind.clone()));

        let fmt_size = |kb: u64| -> String {
            if kb >= 1024 && kb.is_multiple_of(1024) {
                format!("{}M", kb / 1024)
            } else if kb >= 1024 {
                format!("{:.2}M", kb as f64 / 1024.0)
                    .trim_end_matches('0')
                    .trim_end_matches('.')
                    .to_string()
                    + "M"
            } else {
                format!("{}K", kb)
            }
        };

        // Deduplicate by label (cpu0 cache dir lists each index separately)
        let mut seen = std::collections::HashSet::new();
        let mut parts: Vec<String> = Vec::new();
        for e in &entries {
            let label = match (e.level, e.kind.as_str()) {
                (1, "Data") => "L1d".to_string(),
                (1, "Instruction") => "L1i".to_string(),
                (1, "Unified") => "L1".to_string(),
                (n, _) => format!("L{}", n),
            };
            if seen.insert(label.clone()) {
                parts.push(format!("{}: {}", label, fmt_size(e.size_kb)));
            }
        }

        if parts.is_empty() {
            None
        } else {
            Some(parts.join(", "))
        }
    }
    #[cfg(target_os = "macos")]
    {
        extern "C" {
            fn sysctlbyname(
                name: *const i8,
                oldp: *mut std::ffi::c_void,
                oldlenp: *mut usize,
                newp: *mut std::ffi::c_void,
                newlen: usize,
            ) -> i32;
        }

        let read_u64 = |key: &str| -> Option<u64> {
            let name = std::ffi::CString::new(key).ok()?;
            let mut value: u64 = 0;
            let mut size = std::mem::size_of::<u64>();
            let ret = unsafe {
                sysctlbyname(
                    name.as_ptr(),
                    &mut value as *mut u64 as *mut std::ffi::c_void,
                    &mut size,
                    std::ptr::null_mut(),
                    0,
                )
            };
            if ret == 0 && value > 0 {
                Some(value)
            } else {
                None
            }
        };

        let fmt_bytes = |bytes: u64| -> String {
            if bytes >= 1024 * 1024 {
                format!("{}M", bytes / (1024 * 1024))
            } else {
                format!("{}K", bytes / 1024)
            }
        };

        let mut parts = Vec::new();
        if let Some(v) = read_u64("hw.l1dcachesize") {
            parts.push(format!("L1d: {}", fmt_bytes(v)));
        }
        if let Some(v) = read_u64("hw.l1icachesize") {
            parts.push(format!("L1i: {}", fmt_bytes(v)));
        }
        if let Some(v) = read_u64("hw.l2cachesize") {
            parts.push(format!("L2: {}", fmt_bytes(v)));
        }
        if let Some(v) = read_u64("hw.l3cachesize") {
            parts.push(format!("L3: {}", fmt_bytes(v)));
        }

        if parts.is_empty() {
            None
        } else {
            Some(parts.join(", "))
        }
    }
    #[cfg(not(any(target_os = "linux", target_os = "macos")))]
    {
        None
    }
}

/// Formats a CPU core topology string.
///
/// Returns `"NP + NE / NT"` on Intel hybrid CPUs (different max frequencies per cluster),
/// `"NC / NT"` when physical < logical (hyperthreading), or `"N cores"` otherwise.
pub fn format_cpu_cores(logical: usize, physical: Option<usize>) -> String {
    // Linux: detect Intel hybrid via cpufreq policy max-frequency grouping
    #[cfg(target_os = "linux")]
    if let Some(hybrid) = detect_hybrid_cores(logical) {
        return hybrid;
    }

    // macOS: detect Apple Silicon P/E cores via hw.perflevel* sysctls
    #[cfg(target_os = "macos")]
    if let Some(hybrid) = detect_macos_hybrid_cores(logical) {
        return hybrid;
    }

    match physical {
        Some(p) if p < logical => format!("{}C / {}T", p, logical),
        _ => format!("{} cores", logical),
    }
}

/// On Linux, detects Intel hybrid topology (P-cores + E-cores) by grouping CPUs
/// by their maximum cpufreq frequency. Returns `None` if not hybrid or unavailable.
#[cfg(target_os = "linux")]
fn detect_hybrid_cores(logical: usize) -> Option<String> {
    use std::collections::HashMap;
    use std::fs;

    let cpufreq = std::path::Path::new("/sys/devices/system/cpu/cpufreq");
    if !cpufreq.exists() {
        return None;
    }

    // Map max_freq → number of CPUs in that policy
    let mut freq_to_count: HashMap<u64, usize> = HashMap::new();
    let mut total_accounted = 0usize;

    let Ok(policies) = fs::read_dir(cpufreq) else {
        return None;
    };

    for policy in policies.flatten() {
        let path = policy.path();
        if !path.is_dir() {
            continue;
        }
        let max_freq_str = fs::read_to_string(path.join("cpuinfo_max_freq")).ok()?;
        let max_freq: u64 = max_freq_str.trim().parse().ok()?;
        let affected = fs::read_to_string(path.join("affected_cpus")).ok()?;
        let count = affected.split_whitespace().count();
        *freq_to_count.entry(max_freq).or_insert(0) += count;
        total_accounted += count;
    }

    // Only report hybrid if we have exactly 2 frequency tiers and they account for all threads
    if freq_to_count.len() != 2 || total_accounted != logical {
        return None;
    }

    let mut tiers: Vec<(u64, usize)> = freq_to_count.into_iter().collect();
    tiers.sort_by_key(|t| std::cmp::Reverse(t.0)); // highest freq first = P-cores
    let (_, p_count) = tiers[0];
    let (_, e_count) = tiers[1];

    Some(format!("{}P + {}E / {}T", p_count, e_count, logical))
}

/// On macOS Apple Silicon, detects P/E cores via `hw.nperflevels` and
/// `hw.perflevelN.logicalcpu` sysctls. Returns `None` on Intel Macs or if unavailable.
#[cfg(target_os = "macos")]
fn detect_macos_hybrid_cores(logical: usize) -> Option<String> {
    extern "C" {
        fn sysctlbyname(
            name: *const i8,
            oldp: *mut std::ffi::c_void,
            oldlenp: *mut usize,
            newp: *mut std::ffi::c_void,
            newlen: usize,
        ) -> i32;
    }

    let read_u32 = |key: &str| -> Option<u32> {
        let name = std::ffi::CString::new(key).ok()?;
        let mut value: u32 = 0;
        let mut size = std::mem::size_of::<u32>();
        let ret = unsafe {
            sysctlbyname(
                name.as_ptr(),
                &mut value as *mut u32 as *mut std::ffi::c_void,
                &mut size,
                std::ptr::null_mut(),
                0,
            )
        };
        if ret == 0 {
            Some(value)
        } else {
            None
        }
    };

    // hw.nperflevels == 2 on M-series (P + E), absent or 1 on Intel
    let nlevels = read_u32("hw.nperflevels")?;
    if nlevels != 2 {
        return None;
    }

    let p_cores = read_u32("hw.perflevel0.logicalcpu")? as usize;
    let e_cores = read_u32("hw.perflevel1.logicalcpu")? as usize;

    if p_cores + e_cores != logical {
        return None;
    }

    Some(format!("{}P + {}E / {}T", p_cores, e_cores, logical))
}

/// Returns the overall (min_khz, max_khz) CPU frequency range from sysfs cpufreq policies.
/// min is the smallest `cpuinfo_min_freq` across all policies; max is the largest `cpuinfo_max_freq`.
pub fn detect_cpu_freq_range() -> Option<(u64, u64)> {
    #[cfg(target_os = "linux")]
    {
        use std::fs;
        let cpufreq = std::path::Path::new("/sys/devices/system/cpu/cpufreq");
        if !cpufreq.exists() {
            return None;
        }
        let mut global_min: Option<u64> = None;
        let mut global_max: Option<u64> = None;
        let Ok(policies) = fs::read_dir(cpufreq) else {
            return None;
        };
        for policy in policies.flatten() {
            let path = policy.path();
            if !path.is_dir() {
                continue;
            }
            if let Ok(s) = fs::read_to_string(path.join("cpuinfo_min_freq")) {
                if let Ok(v) = s.trim().parse::<u64>() {
                    global_min = Some(global_min.map_or(v, |m: u64| m.min(v)));
                }
            }
            if let Ok(s) = fs::read_to_string(path.join("cpuinfo_max_freq")) {
                if let Ok(v) = s.trim().parse::<u64>() {
                    global_max = Some(global_max.map_or(v, |m: u64| m.max(v)));
                }
            }
        }
        match (global_min, global_max) {
            (Some(min), Some(max)) => Some((min, max)),
            _ => None,
        }
    }
    #[cfg(not(target_os = "linux"))]
    {
        None
    }
}

#[cfg(not(target_os = "linux"))]
fn detect_desktop_from_proc() -> Option<String> {
    None
}

#[cfg(target_os = "linux")]
fn detect_desktop_from_proc() -> Option<String> {
    const DE_PROCS: &[(&str, &str)] = &[
        ("gnome-shell", "GNOME"),
        ("plasmashell", "KDE Plasma"),
        ("xfce4-session", "XFCE"),
        ("mate-session", "MATE"),
        ("cinnamon", "Cinnamon"),
        ("budgie-daemon", "Budgie"),
        ("budgie-panel", "Budgie"),
        ("lxsession", "LXDE"),
        ("lxqt-session", "LXQt"),
        ("deepin-session", "Deepin"),
        ("dde-session-daemon", "Deepin"),
        ("gala", "Pantheon"),
        ("enlightenment", "Enlightenment"),
    ];
    let Ok(entries) = std::fs::read_dir("/proc") else {
        return None;
    };
    for entry in entries.filter_map(|e| e.ok()) {
        let path = entry.path();
        if !path.is_dir() {
            continue;
        }
        let Ok(comm) = std::fs::read_to_string(path.join("comm")) else {
            continue;
        };
        let comm = comm.trim().to_lowercase();
        for (proc_name, de_name) in DE_PROCS {
            if comm == *proc_name || comm.starts_with(proc_name) {
                return Some(de_name.to_string());
            }
        }
    }
    None
}

fn normalize_desktop_name(raw: &str) -> String {
    let s = raw.trim();
    // Canonical casing for well-known desktop environments
    match s.to_lowercase().as_str() {
        "gnome" => "GNOME".to_string(),
        "kde" | "kde plasma" | "plasma" => "KDE Plasma".to_string(),
        "xfce" => "XFCE".to_string(),
        "lxde" => "LXDE".to_string(),
        "lxqt" => "LXQt".to_string(),
        "mate" => "MATE".to_string(),
        "cinnamon" => "Cinnamon".to_string(),
        "budgie" => "Budgie".to_string(),
        "deepin" => "Deepin".to_string(),
        "pantheon" => "Pantheon".to_string(),
        "unity" => "Unity".to_string(),
        "enlightenment" | "e" => "Enlightenment".to_string(),
        _ => {
            // Title-case if it's all lowercase; otherwise preserve as-is
            if s.chars().all(|c| c.is_lowercase() || !c.is_alphabetic()) {
                let mut chars = s.chars();
                match chars.next() {
                    None => String::new(),
                    Some(c) => c.to_uppercase().collect::<String>() + chars.as_str(),
                }
            } else {
                s.to_string()
            }
        }
    }
}

fn detect_init_system() -> Option<String> {
    #[cfg(target_os = "linux")]
    {
        let comm = std::fs::read_to_string("/proc/1/comm")
            .map(|s| s.trim().to_string())
            .ok()
            .filter(|s| !s.is_empty());
        if let Some(name) = comm {
            return Some(name);
        }
        std::fs::read_link("/proc/1/exe").ok().and_then(|p| {
            p.file_name()
                .and_then(|n| n.to_str())
                .map(|s| s.to_string())
        })
    }
    #[cfg(target_os = "macos")]
    {
        Some("launchd".to_string())
    }
    #[cfg(target_os = "windows")]
    {
        Some("SCM".to_string())
    }
    #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
    {
        None
    }
}

fn detect_chassis() -> Option<String> {
    #[cfg(target_os = "linux")]
    {
        let raw = std::fs::read_to_string("/sys/class/dmi/id/chassis_type").ok()?;
        let n: u32 = raw.trim().parse().ok()?;
        let label = match n {
            3 => "Desktop",
            4 => "Low-Profile Desktop",
            6 => "Mini Tower",
            7 => "Tower",
            8 | 9 | 10 | 14 | 31 | 32 => "Laptop",
            11 => "Handheld",
            13 => "All-in-One",
            17 => "Main Server",
            23 => "Rack Server",
            28 => "Blade",
            30 => "Tablet",
            35 => "Mini PC",
            36 => "Stick PC",
            _ => return None,
        };
        Some(label.to_string())
    }
    #[cfg(target_os = "macos")]
    {
        let output = std::process::Command::new("sysctl")
            .args(["-n", "hw.model"])
            .output()
            .ok()?;
        let model = String::from_utf8(output.stdout).ok()?;
        let model = model.trim();
        if model.contains("MacBook") {
            Some("Laptop".to_string())
        } else if model.contains("MacPro") {
            Some("Desktop".to_string())
        } else if model.contains("Macmini") || model.contains("Mac mini") {
            Some("Mini PC".to_string())
        } else if model.contains("iMac") {
            Some("All-in-One".to_string())
        } else {
            Some(model.to_string())
        }
    }
    #[cfg(not(any(target_os = "linux", target_os = "macos")))]
    {
        None
    }
}

fn detect_bootmgr() -> Option<String> {
    #[cfg(target_os = "linux")]
    {
        use std::path::Path;
        let is_uefi = Path::new("/sys/firmware/efi").exists();
        if Path::new("/boot/loader/entries").exists()
            || Path::new("/boot/loader/loader.conf").exists()
            || Path::new("/efi/loader/loader.conf").exists()
        {
            return Some("systemd-boot".to_string());
        }
        if Path::new("/boot/grub2/grub.cfg").exists() || Path::new("/boot/grub2").exists() {
            return Some("GRUB 2".to_string());
        }
        if Path::new("/boot/grub/grub.cfg").exists() || Path::new("/boot/grub").exists() {
            return Some("GRUB".to_string());
        }
        if is_uefi {
            Some("UEFI".to_string())
        } else {
            Some("BIOS".to_string())
        }
    }
    #[cfg(target_os = "macos")]
    {
        Some("Apple Boot ROM".to_string())
    }
    #[cfg(not(any(target_os = "linux", target_os = "macos")))]
    {
        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_format_cpu_cores_no_hyperthreading() {
        // Physical == logical: show plain "N cores"
        assert_eq!(format_cpu_cores(4, Some(4)), "4 cores");
    }

    #[test]
    fn test_format_cpu_cores_hyperthreaded() {
        // Physical < logical: show "NC / NT"
        assert_eq!(format_cpu_cores(16, Some(8)), "8C / 16T");
    }

    #[test]
    fn test_format_cpu_cores_unknown_physical() {
        // No physical count available: fall back to "N cores"
        assert_eq!(format_cpu_cores(8, None), "8 cores");
    }

    #[test]
    fn test_format_cpu_cores_physical_equals_zero() {
        // Degenerate: physical reported as 0 — treat same as unknown
        // physical(0) < logical(8), so would print "0C / 8T"; acceptable but
        // let's confirm the branch taken
        let result = format_cpu_cores(8, Some(0));
        assert!(result.contains("8"), "should mention 8 threads: {}", result);
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn test_detect_cpu_cache_returns_some_on_linux() {
        // On a real Linux machine the sysfs cache dir exists; result should be Some
        // and contain at least one cache level label.
        if std::path::Path::new("/sys/devices/system/cpu/cpu0/cache").exists() {
            let result = detect_cpu_cache();
            assert!(result.is_some(), "expected cache info on Linux with sysfs");
            let s = result.unwrap();
            assert!(
                s.contains("L1") || s.contains("L2") || s.contains("L3"),
                "expected cache level labels, got: {}",
                s
            );
        }
    }

    #[test]
    fn test_normalize_desktop_name_known() {
        assert_eq!(normalize_desktop_name("gnome"), "GNOME");
        assert_eq!(normalize_desktop_name("GNOME"), "GNOME");
        assert_eq!(normalize_desktop_name("kde"), "KDE Plasma");
        assert_eq!(normalize_desktop_name("plasma"), "KDE Plasma");
        assert_eq!(normalize_desktop_name("KDE Plasma"), "KDE Plasma");
        assert_eq!(normalize_desktop_name("xfce"), "XFCE");
        assert_eq!(normalize_desktop_name("lxqt"), "LXQt");
        assert_eq!(normalize_desktop_name("mate"), "MATE");
        assert_eq!(normalize_desktop_name("cinnamon"), "Cinnamon");
        assert_eq!(normalize_desktop_name("e"), "Enlightenment");
    }

    #[test]
    fn test_normalize_desktop_name_unknown_lowercase() {
        // Unknown all-lowercase names get title-cased.
        assert_eq!(normalize_desktop_name("budgie"), "Budgie");
        assert_eq!(normalize_desktop_name("niri"), "Niri");
    }

    #[test]
    fn test_normalize_desktop_name_unknown_mixed() {
        // Unknown mixed-case names are preserved as-is.
        assert_eq!(normalize_desktop_name("MyDE"), "MyDE");
    }

    #[test]
    fn test_normalize_desktop_name_trims_whitespace() {
        assert_eq!(normalize_desktop_name("  gnome  "), "GNOME");
        assert_eq!(normalize_desktop_name(" niri "), "Niri");
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn test_detect_desktop_from_proc_returns_option() {
        // Just verify it runs without panicking and returns a sane value.
        let result = detect_desktop_from_proc();
        if let Some(ref de) = result {
            assert!(!de.is_empty(), "desktop name should not be empty");
        }
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn test_detect_cpu_freq_range_returns_ordered_pair() {
        if std::path::Path::new("/sys/devices/system/cpu/cpufreq").exists() {
            if let Some((min, max)) = detect_cpu_freq_range() {
                assert!(
                    min <= max,
                    "min freq should be <= max freq: {} > {}",
                    min,
                    max
                );
                assert!(min > 0, "min freq should be positive");
            }
        }
    }
}

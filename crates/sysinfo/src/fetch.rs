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
            let packages_handle = s.spawn(detect_packages);
            let public_ip_handle = s.spawn(crate::network::detect_public_ip);
            let network_ips_handle = s.spawn(crate::network::detect_active_interface_and_local_ip);
            let motherboard_handle = s.spawn(detect_motherboard);
            let bios_handle = s.spawn(detect_bios);
            let displays_handle = s.spawn(crate::display::detect_displays);
            let audio_handle = s.spawn(|| crate::audio::detect_audio(&sys));
            let wifi_handle = s.spawn(crate::network::detect_wifi);
            let bluetooth_handle = s.spawn(crate::bluetooth::detect_bluetooth);
            let ui_theme_and_fonts_handle = s.spawn(detect_ui_theme_and_fonts);
            let camera_handle = s.spawn(detect_camera);
            let gamepad_handle = s.spawn(detect_gamepad);

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
        let shell = detect_shell(&sys);
        let terminal = detect_terminal(&sys);
        let terminal_font = detect_terminal_font(terminal.as_deref());
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

#[allow(dead_code)]
pub fn is_real_camera(name: &str) -> bool {
    let name_lower = name.to_lowercase();
    !name_lower.contains("infrared")
        && !name_lower.contains("ir camera")
        && !name_lower.contains("integrated i")
        && !name_lower.contains("integrated ir")
        && !name_lower.contains("depth camera")
}

#[allow(dead_code)]
pub fn clean_camera_name(name: &str) -> String {
    let trimmed = name.trim();
    if trimmed.starts_with("Integrated Camera:") {
        return "Integrated Camera".to_string();
    }
    if trimmed.starts_with("Integrated Webcam:") {
        return "Integrated Webcam".to_string();
    }
    trimmed.to_string()
}

#[allow(dead_code)]
pub fn parse_macos_camera(stdout: &str) -> Vec<String> {
    let mut devices = Vec::new();
    let mut in_cameras = false;
    for line in stdout.lines() {
        let trimmed = line.trim();
        let indent = line.len() - line.trim_start().len();
        if trimmed.starts_with("Video Support:")
            || trimmed.starts_with("Camera:")
            || trimmed.starts_with("Cameras:")
        {
            in_cameras = true;
            continue;
        }
        if in_cameras {
            if indent < 4
                && !trimmed.is_empty()
                && !trimmed.starts_with("Camera")
                && !trimmed.starts_with("Video Support")
            {
                in_cameras = false;
                continue;
            }
            if (indent == 4 || indent == 6 || indent == 8) && trimmed.ends_with(':') {
                let name = trimmed.trim_end_matches(':').trim().to_string();
                if !name.is_empty() && is_real_camera(&name) {
                    let cleaned = clean_camera_name(&name);
                    if !devices.contains(&cleaned) {
                        devices.push(cleaned);
                    }
                }
            }
        }
    }
    devices
}

#[allow(dead_code)]
pub fn parse_macos_gamepad(usb_stdout: &str, bt_stdout: &str) -> Vec<String> {
    let mut gamepads = Vec::new();
    let keywords = [
        "controller",
        "gamepad",
        "joystick",
        "xbox",
        "playstation",
        "dualshock",
        "dualsense",
        "nintendo",
        "joy-con",
        "joycon",
    ];

    let is_gamepad = |name: &str| -> bool {
        let name_lower = name.to_lowercase();
        keywords.iter().any(|&kw| name_lower.contains(kw))
    };

    // Parse USB
    for line in usb_stdout.lines() {
        let trimmed = line.trim();
        let indent = line.len() - line.trim_start().len();
        if (indent == 4 || indent == 6 || indent == 8) && trimmed.ends_with(':') {
            let name = trimmed.trim_end_matches(':').trim().to_string();
            if is_gamepad(&name) && !gamepads.contains(&name) {
                gamepads.push(name);
            }
        }
    }

    // Parse Bluetooth
    let mut current_device = None;
    for line in bt_stdout.lines() {
        let trimmed = line.trim();
        let indent = line.len() - line.trim_start().len();
        if indent >= 8 && trimmed.ends_with(':') {
            current_device = Some(trimmed.trim_end_matches(':').trim().to_string());
        } else if trimmed.starts_with("Connected: Yes") || trimmed.starts_with("Connection: Yes") {
            if let Some(ref dev) = current_device {
                if is_gamepad(dev) && !gamepads.contains(dev) {
                    gamepads.push(dev.clone());
                }
            }
        }
    }

    gamepads
}

fn detect_camera() -> Vec<String> {
    #[cfg(target_os = "linux")]
    {
        let mut cameras = Vec::new();
        if let Ok(entries) = std::fs::read_dir("/sys/class/video4linux") {
            for entry in entries.filter_map(|e| e.ok()) {
                let path = entry.path().join("name");
                if path.exists() {
                    if let Ok(name) = std::fs::read_to_string(path) {
                        let trimmed = name.trim().to_string();
                        if !trimmed.is_empty() && is_real_camera(&trimmed) {
                            let cleaned = clean_camera_name(&trimmed);
                            if !cameras.contains(&cleaned) {
                                cameras.push(cleaned);
                            }
                        }
                    }
                }
            }
        }
        cameras
    }

    #[cfg(target_os = "macos")]
    {
        if let Ok(output) = std::process::Command::new("system_profiler")
            .arg("SPCameraDataType")
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                return parse_macos_camera(&stdout);
            }
        }
        Vec::new()
    }

    #[cfg(target_os = "windows")]
    {
        let cmd = "Get-PnpDevice -Class Camera,Image -PresentOnly -ErrorAction SilentlyContinue | Where-Object { $_.Status -eq 'OK' } | Select-Object -ExpandProperty FriendlyName";
        if let Ok(output) = std::process::Command::new("powershell")
            .args(["-Command", cmd])
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                let mut cameras = Vec::new();
                for line in stdout.lines() {
                    let trimmed = line.trim().to_string();
                    if !trimmed.is_empty() && is_real_camera(&trimmed) {
                        let cleaned = clean_camera_name(&trimmed);
                        if !cameras.contains(&cleaned) {
                            cameras.push(cleaned);
                        }
                    }
                }
                return cameras;
            }
        }
        Vec::new()
    }

    #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
    {
        Vec::new()
    }
}

fn detect_gamepad() -> Vec<String> {
    #[cfg(target_os = "linux")]
    {
        let mut gamepads = Vec::new();
        if let Ok(entries) = std::fs::read_dir("/sys/class/input") {
            for entry in entries.filter_map(|e| e.ok()) {
                let name = entry.file_name().to_string_lossy().to_string();
                if name.starts_with("js") {
                    let path = entry.path().join("device/name");
                    if path.exists() {
                        if let Ok(dev_name) = std::fs::read_to_string(path) {
                            let trimmed = dev_name.trim().to_string();
                            if !trimmed.is_empty() && !gamepads.contains(&trimmed) {
                                gamepads.push(trimmed);
                            }
                        }
                    }
                }
            }
        }
        gamepads
    }

    #[cfg(target_os = "macos")]
    {
        let usb_stdout = std::process::Command::new("system_profiler")
            .arg("SPUSBDataType")
            .output()
            .ok()
            .and_then(|o| String::from_utf8(o.stdout).ok())
            .unwrap_or_default();

        let bt_stdout = std::process::Command::new("system_profiler")
            .arg("SPBluetoothDataType")
            .output()
            .ok()
            .and_then(|o| String::from_utf8(o.stdout).ok())
            .unwrap_or_default();

        parse_macos_gamepad(&usb_stdout, &bt_stdout)
    }

    #[cfg(target_os = "windows")]
    {
        let cmd = "Get-PnpDevice -PresentOnly -ErrorAction SilentlyContinue | Where-Object { $_.Class -eq 'HIDClass' -and ($_.HardwareID -match 'HID_DEVICE_SYSTEM_GAME' -or $_.HardwareID -match 'HID_DEVICE_GAME') -or $_.FriendlyName -match 'Xbox Controller|Gamepad|Joystick' } | Select-Object -ExpandProperty FriendlyName";
        if let Ok(output) = std::process::Command::new("powershell")
            .args(["-Command", cmd])
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                let mut gamepads = Vec::new();
                for line in stdout.lines() {
                    let trimmed = line.trim().to_string();
                    if !trimmed.is_empty() && !gamepads.contains(&trimmed) {
                        gamepads.push(trimmed);
                    }
                }
                return gamepads;
            }
        }
        Vec::new()
    }

    #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
    {
        Vec::new()
    }
}

fn detect_motherboard() -> Option<String> {
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

        let name_c = std::ffi::CString::new("hw.model").ok();
        let mut model_str = None;

        if let Some(name) = name_c {
            let mut size: usize = 0;
            unsafe {
                sysctlbyname(
                    name.as_ptr(),
                    std::ptr::null_mut(),
                    &mut size,
                    std::ptr::null_mut(),
                    0,
                );
            }
            if size > 0 {
                let mut buf = vec![0u8; size];
                let res = unsafe {
                    sysctlbyname(
                        name.as_ptr(),
                        buf.as_mut_ptr() as *mut std::ffi::c_void,
                        &mut size,
                        std::ptr::null_mut(),
                        0,
                    )
                };
                if res == 0 {
                    if let Some(pos) = buf.iter().position(|&x| x == 0) {
                        buf.truncate(pos);
                    }
                    if let Ok(model) = String::from_utf8(buf) {
                        let trimmed = model.trim();
                        if !trimmed.is_empty() {
                            model_str = Some(trimmed.to_string());
                        }
                    }
                }
            }
        }

        if model_str.is_some() {
            return model_str;
        }

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
        let manufacturer = win_reg::get_reg_string(
            win_reg::HKEY_LOCAL_MACHINE,
            "HARDWARE\\DESCRIPTION\\System\\BIOS",
            "BaseBoardManufacturer",
        )
        .unwrap_or_default();
        let product = win_reg::get_reg_string(
            win_reg::HKEY_LOCAL_MACHINE,
            "HARDWARE\\DESCRIPTION\\System\\BIOS",
            "BaseBoardProduct",
        )
        .unwrap_or_default();

        let manufacturer = manufacturer.trim();
        let product = product.trim();

        if !manufacturer.is_empty() && !product.is_empty() {
            return Some(format!("{} {}", manufacturer, product));
        } else if !product.is_empty() {
            return Some(product.to_string());
        } else if !manufacturer.is_empty() {
            return Some(manufacturer.to_string());
        }

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
        let manufacturer = win_reg::get_reg_string(
            win_reg::HKEY_LOCAL_MACHINE,
            "HARDWARE\\DESCRIPTION\\System\\BIOS",
            "BIOSVendor",
        )
        .unwrap_or_default();
        let version = win_reg::get_reg_string(
            win_reg::HKEY_LOCAL_MACHINE,
            "HARDWARE\\DESCRIPTION\\System\\BIOS",
            "BIOSVersion",
        )
        .unwrap_or_default();
        let raw_date = win_reg::get_reg_string(
            win_reg::HKEY_LOCAL_MACHINE,
            "HARDWARE\\DESCRIPTION\\System\\BIOS",
            "BIOSReleaseDate",
        )
        .unwrap_or_default();

        let manufacturer = manufacturer.trim();
        let version = version.trim();
        let raw_date = raw_date.trim();

        let date = if raw_date.len() >= 8 {
            let year = &raw_date[0..4];
            let month = &raw_date[4..6];
            let day = &raw_date[6..8];
            format!("{}/{}/{}", month, day, year)
        } else {
            raw_date.to_string()
        };

        let mut parts = Vec::new();
        if !manufacturer.is_empty() {
            parts.push(manufacturer.to_string());
        }
        if !version.is_empty() {
            parts.push(version.to_string());
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

// Display detection logic has been extracted to `crate::display`.

/// Detects the active shell and retrieves its version.
fn detect_shell(sys: &sysinfo::System) -> Option<String> {
    // 1. Try to get shell from the SHELL env var
    let shell_env = std::env::var("SHELL").ok();

    // Extract shell path and basename
    let (shell_path, shell_name) = if let Some(ref path_str) = shell_env {
        let path = std::path::Path::new(path_str);
        let name = path
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or(path_str)
            .to_string();
        (path_str.clone(), name)
    } else {
        // 2. Fallback to process tree climbing
        let mut current_pid = sysinfo::get_current_pid().ok();
        let mut detected: Option<(String, String)> = None;
        let known_shells = [
            "bash",
            "zsh",
            "fish",
            "sh",
            "dash",
            "nu",
            "elvish",
            "tcsh",
            "csh",
            "ksh",
            "powershell",
            "pwsh",
            "cmd",
        ];

        while let Some(pid) = current_pid {
            if let Some(process) = sys.process(pid) {
                let proc_name = process.name().to_string_lossy().to_string();
                let proc_name_lower = proc_name.to_lowercase();

                // On Windows, the process name might be "powershell.exe" or "pwsh.exe"
                let clean_name = proc_name_lower
                    .strip_suffix(".exe")
                    .unwrap_or(&proc_name_lower)
                    .to_string();

                if known_shells.contains(&clean_name.as_str()) {
                    detected = Some((proc_name.clone(), clean_name));
                    break;
                }
                current_pid = process.parent();
            } else {
                break;
            }
        }

        if let Some((orig_name, clean_name)) = detected {
            (orig_name, clean_name)
        } else {
            // Default fallbacks
            #[cfg(target_os = "windows")]
            {
                if std::env::var("PSModulePath").is_ok() {
                    ("powershell.exe".to_string(), "powershell".to_string())
                } else {
                    ("cmd.exe".to_string(), "cmd".to_string())
                }
            }
            #[cfg(not(target_os = "windows"))]
            {
                ("sh".to_string(), "sh".to_string())
            }
        }
    };

    // Now that we have the shell_path and shell_name, query its version
    let shell_name_lower = shell_name.to_lowercase();
    let shell_name_clean = shell_name_lower
        .strip_suffix(".exe")
        .unwrap_or(&shell_name_lower);

    let version = detect_shell_version(&shell_path, shell_name_clean);

    if let Some(ver) = version {
        Some(format!("{} {}", shell_name_clean, ver))
    } else {
        Some(shell_name_clean.to_string())
    }
}

/// Helper to query standard shell executables for their versions.
fn detect_shell_version(shell_path: &str, shell_name: &str) -> Option<String> {
    // Select arguments based on shell
    let args = match shell_name {
        "powershell" => vec![
            "-NoProfile",
            "-Command",
            "$PSVersionTable.PSVersion.ToString()",
        ],
        "elvish" => vec!["-version"],
        _ => vec!["--version"],
    };

    let output = std::process::Command::new(shell_path)
        .args(&args)
        .output()
        .or_else(|_| {
            // If the full path failed (e.g. SHELL was set to an invalid path),
            // try running by the shell name (searching the system PATH)
            std::process::Command::new(shell_name).args(&args).output()
        })
        .ok()?;

    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();

    // Some shells or errors might output to stderr
    let full_output = format!("{}\n{}", stdout, stderr);

    parse_shell_version(shell_name, &full_output)
}

/// Parses the output of a shell's version flag to find the version string.
fn parse_shell_version(shell_name: &str, output: &str) -> Option<String> {
    let output_trimmed = output.trim();
    if output_trimmed.is_empty() {
        return None;
    }

    match shell_name {
        "bash" => {
            if let Some(pos) = output.find("version ") {
                let rest = &output[pos + 8..];
                let ver = rest
                    .split(|c: char| c.is_whitespace() || c == '(' || c == ',' || c == '-')
                    .next()
                    .unwrap_or("");
                if !ver.is_empty() {
                    return Some(ver.to_string());
                }
            }
        }
        "zsh" => {
            if let Some(pos) = output.find("zsh ") {
                let rest = &output[pos + 4..];
                let ver = rest
                    .split(|c: char| c.is_whitespace() || c == '(')
                    .next()
                    .unwrap_or("");
                if !ver.is_empty() {
                    return Some(ver.to_string());
                }
            }
        }
        "fish" => {
            if let Some(pos) = output.find("version ") {
                let rest = &output[pos + 8..];
                let ver = rest
                    .split(|c: char| c.is_whitespace() || c == '(' || c == ',')
                    .next()
                    .unwrap_or("");
                if !ver.is_empty() {
                    return Some(ver.to_string());
                }
            }
        }
        "nu" => {
            let ver = output_trimmed.split_whitespace().next().unwrap_or("");
            if !ver.is_empty() {
                return Some(ver.to_string());
            }
        }
        "pwsh" => {
            if let Some(pos) = output.find("PowerShell ") {
                let rest = &output[pos + 11..];
                let ver = rest.split_whitespace().next().unwrap_or("");
                if !ver.is_empty() {
                    return Some(ver.to_string());
                }
            }
        }
        "powershell" => {
            let ver = output_trimmed.split_whitespace().next().unwrap_or("");
            if !ver.is_empty() {
                return Some(ver.to_string());
            }
        }
        "elvish" => {
            let ver = output_trimmed.split_whitespace().next().unwrap_or("");
            if !ver.is_empty() {
                return Some(ver.to_string());
            }
        }
        "tcsh" => {
            if let Some(pos) = output.find("tcsh ") {
                let rest = &output[pos + 5..];
                let ver = rest.split_whitespace().next().unwrap_or("");
                if !ver.is_empty() {
                    return Some(ver.to_string());
                }
            }
        }
        _ => {
            // General generic version finder for "version " or any number pattern
            if let Some(pos) = output.to_lowercase().find("version ") {
                let rest = &output[pos + 8..];
                let ver = rest
                    .split(|c: char| c.is_whitespace() || c == '(' || c == ',' || c == '-')
                    .next()
                    .unwrap_or("");
                if !ver.is_empty() {
                    return Some(ver.to_string());
                }
            }
        }
    }

    None
}

#[allow(dead_code)]
fn parse_ini_key(content: &str, key: &str) -> Option<String> {
    for line in content.lines() {
        let line = line.trim();
        if line.starts_with('#') || line.starts_with(';') {
            continue;
        }
        if let Some(pos) = line.find('=') {
            let k = line[..pos].trim();
            if k == key {
                let v = line[pos + 1..].trim();
                let v = if (v.starts_with('"') && v.ends_with('"'))
                    || (v.starts_with('\'') && v.ends_with('\''))
                {
                    if v.len() >= 2 {
                        v[1..v.len() - 1].to_string()
                    } else {
                        v.to_string()
                    }
                } else {
                    v.to_string()
                };
                if !v.is_empty() {
                    return Some(v);
                }
            }
        }
    }
    None
}

#[cfg(target_os = "linux")]
fn get_gtk_setting(key: &str) -> Option<String> {
    let home = dirs::home_dir()?;
    let paths = [
        home.join(".config/gtk-4.0/settings.ini"),
        home.join(".config/gtk-3.0/settings.ini"),
        home.join(".config/gtk-2.0/settings.ini"),
        home.join(".gtkrc-2.0"),
    ];

    for path in &paths {
        if path.exists() {
            if let Ok(contents) = std::fs::read_to_string(path) {
                if let Some(val) = parse_ini_key(&contents, key) {
                    return Some(val);
                }
            }
        }
    }
    None
}

#[cfg(target_os = "linux")]
fn query_gsettings(schema: &str, key: &str) -> Option<String> {
    let output = std::process::Command::new("gsettings")
        .args(["get", schema, key])
        .output()
        .ok()?;
    if output.status.success() {
        let val = String::from_utf8_lossy(&output.stdout).trim().to_string();
        let val = val.trim_matches('\'').trim_matches('"').to_string();
        if !val.is_empty() && val != "''" && val != "\"\"" {
            return Some(val);
        }
    }
    None
}

#[cfg(target_os = "linux")]
fn get_kde_setting(key: &str) -> Option<String> {
    let home = dirs::home_dir()?;
    let path = home.join(".config/kdeglobals");
    if path.exists() {
        if let Ok(contents) = std::fs::read_to_string(path) {
            return parse_ini_key(&contents, key);
        }
    }
    None
}

#[cfg(target_os = "linux")]
fn detect_ui_theme_and_fonts() -> (
    Option<String>,
    Option<String>,
    Option<String>,
    Option<String>,
) {
    // GTK Settings
    let gtk_theme = get_gtk_setting("gtk-theme-name")
        .or_else(|| query_gsettings("org.gnome.desktop.interface", "gtk-theme"));
    let gtk_icons = get_gtk_setting("gtk-icon-theme-name")
        .or_else(|| query_gsettings("org.gnome.desktop.interface", "icon-theme"));
    let gtk_cursor = get_gtk_setting("gtk-cursor-theme-name")
        .or_else(|| query_gsettings("org.gnome.desktop.interface", "cursor-theme"));
    let gtk_font = get_gtk_setting("gtk-font-name")
        .or_else(|| query_gsettings("org.gnome.desktop.interface", "font-name"));

    // KDE/Qt Settings
    let qt_theme = get_kde_setting("widgetStyle").or_else(|| get_kde_setting("ColorScheme"));
    let qt_icons = get_kde_setting("iconTheme");
    let qt_cursor = {
        let home = dirs::home_dir();
        home.and_then(|h| {
            let path = h.join(".config/kcminputrc");
            if path.exists() {
                std::fs::read_to_string(path)
                    .ok()
                    .and_then(|contents| parse_ini_key(&contents, "theme"))
            } else {
                None
            }
        })
    };
    let qt_font = get_kde_setting("font").map(|f| {
        let parts: Vec<&str> = f.split(',').collect();
        if parts.len() >= 2 {
            let name = parts[0].trim();
            let size = parts[1].trim();
            format!("{} ({}pt)", name, size)
        } else {
            f
        }
    });

    // Check which desktop environment is in use to prioritize formatting
    let de = std::env::var("XDG_CURRENT_DESKTOP")
        .or_else(|_| std::env::var("DESKTOP_SESSION"))
        .unwrap_or_default()
        .to_lowercase();

    let is_kde = de.contains("kde") || de.contains("plasma");

    let theme = if is_kde {
        match (qt_theme, gtk_theme) {
            (Some(qt), Some(gt)) => Some(format!("{} [Qt], {} [GTK]", qt, gt)),
            (Some(qt), None) => Some(format!("{} [Qt]", qt)),
            (None, Some(gt)) => Some(format!("{} [GTK]", gt)),
            (None, None) => None,
        }
    } else {
        match (gtk_theme, qt_theme) {
            (Some(gt), Some(qt)) => Some(format!("{} [GTK], {} [Qt]", gt, qt)),
            (Some(gt), None) => Some(format!("{} [GTK]", gt)),
            (None, Some(qt)) => Some(format!("{} [Qt]", qt)),
            (None, None) => None,
        }
    };

    let icons = if is_kde {
        match (qt_icons, gtk_icons) {
            (Some(qi), Some(gi)) => Some(format!("{} [Qt], {} [GTK]", qi, gi)),
            (Some(qi), None) => Some(format!("{} [Qt]", qi)),
            (None, Some(gi)) => Some(format!("{} [GTK]", gi)),
            (None, None) => None,
        }
    } else {
        match (gtk_icons, qt_icons) {
            (Some(gi), Some(qi)) => Some(format!("{} [GTK], {} [Qt]", gi, qi)),
            (Some(gi), None) => Some(format!("{} [GTK]", gi)),
            (None, Some(qi)) => Some(format!("{} [Qt]", qi)),
            (None, None) => None,
        }
    };

    let cursor = if is_kde {
        match (qt_cursor, gtk_cursor) {
            (Some(qc), Some(gc)) => Some(format!("{} [Qt], {} [GTK]", qc, gc)),
            (Some(qc), None) => Some(format!("{} [Qt]", qc)),
            (None, Some(gc)) => Some(format!("{} [GTK]", gc)),
            (None, None) => None,
        }
    } else {
        match (gtk_cursor, qt_cursor) {
            (Some(gc), Some(qc)) => Some(format!("{} [GTK], {} [Qt]", gc, qc)),
            (Some(gc), None) => Some(format!("{} [GTK]", gc)),
            (None, Some(qc)) => Some(format!("{} [Qt]", qc)),
            (None, None) => None,
        }
    };

    let font = if is_kde {
        match (qt_font, gtk_font) {
            (Some(qf), Some(gf)) => Some(format!("{} [Qt], {} [GTK]", qf, gf)),
            (Some(qf), None) => Some(format!("{} [Qt]", qf)),
            (None, Some(gf)) => Some(format!("{} [GTK]", gf)),
            (None, None) => None,
        }
    } else {
        match (gtk_font, qt_font) {
            (Some(gf), Some(qf)) => Some(format!("{} [GTK], {} [Qt]", gf, qf)),
            (Some(gf), None) => Some(format!("{} [GTK]", gf)),
            (None, Some(qf)) => Some(format!("{} [Qt]", qf)),
            (None, None) => None,
        }
    };

    (theme, icons, cursor, font)
}

#[cfg(target_os = "macos")]
fn detect_ui_theme_and_fonts() -> (
    Option<String>,
    Option<String>,
    Option<String>,
    Option<String>,
) {
    let interface_style = std::process::Command::new("defaults")
        .args(["read", "-g", "AppleInterfaceStyle"])
        .output()
        .ok()
        .and_then(|o| {
            if o.status.success() {
                Some(String::from_utf8_lossy(&o.stdout).trim().to_string())
            } else {
                None
            }
        });

    let theme = match interface_style {
        Some(style) => Some(format!("Aqua ({})", style)),
        None => Some("Aqua (Light)".to_string()),
    };

    (theme, None, None, Some("San Francisco".to_string()))
}

#[cfg(target_os = "windows")]
fn detect_ui_theme_and_fonts() -> (
    Option<String>,
    Option<String>,
    Option<String>,
    Option<String>,
) {
    let theme = {
        let apps_light = win_reg::get_reg_u32(
            win_reg::HKEY_CURRENT_USER,
            "Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize",
            "AppsUseLightTheme",
        );

        let apps_dark = apps_light.map(|val| val == 0);

        match apps_dark {
            Some(true) => Some("Dark".to_string()),
            Some(false) => Some("Light".to_string()),
            None => {
                let output = std::process::Command::new("reg")
                    .args([
                        "query",
                        r"HKCU\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize",
                        "/v",
                        "AppsUseLightTheme",
                    ])
                    .output()
                    .ok();

                let cmd_dark = output.and_then(|o| {
                    if o.status.success() {
                        let s = String::from_utf8_lossy(&o.stdout);
                        if s.contains("0x0") {
                            Some(true)
                        } else if s.contains("0x1") {
                            Some(false)
                        } else {
                            None
                        }
                    } else {
                        None
                    }
                });

                match cmd_dark {
                    Some(true) => Some("Dark".to_string()),
                    Some(false) => Some("Light".to_string()),
                    None => Some("Unknown".to_string()),
                }
            }
        }
    };

    (theme, None, None, Some("Segoe UI".to_string()))
}

#[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
fn detect_ui_theme_and_fonts() -> (
    Option<String>,
    Option<String>,
    Option<String>,
    Option<String>,
) {
    (None, None, None, None)
}

fn detect_terminal(sys: &System) -> Option<String> {
    if let Ok(prog) = std::env::var("TERM_PROGRAM") {
        if !prog.is_empty() {
            return Some(prog);
        }
    }
    if let Ok(prog) = std::env::var("TERMINAL_EMULATOR") {
        if !prog.is_empty() {
            return Some(prog);
        }
    }
    if std::env::var("ALACRITTY_LOG").is_ok() || std::env::var("ALACRITTY_WINDOW_ID").is_ok() {
        return Some("alacritty".to_string());
    }

    let current_pid = sysinfo::Pid::from_u32(std::process::id());
    let mut current_proc = sys.process(current_pid);

    let known_terms = [
        "kitty",
        "alacritty",
        "wezterm",
        "gnome-terminal",
        "konsole",
        "iterm2",
        "Terminal",
        "rio",
        "foot",
        "tilix",
        "xfce4-terminal",
        "terminator",
        "st",
        "urxvt",
        "ptyxis",
    ];

    let mut depth = 0;
    while let Some(proc) = current_proc {
        if depth > 5 {
            break;
        }
        let name = proc.name().to_string_lossy().to_lowercase();

        for term in &known_terms {
            if name == *term || name.ends_with(term) || (name.contains(term) && term.len() > 3) {
                return Some(term.to_string());
            }
        }

        if let Some(parent_pid) = proc.parent() {
            current_proc = sys.process(parent_pid);
        } else {
            break;
        }
        depth += 1;
    }

    if let Ok(term) = std::env::var("TERM") {
        if term != "xterm-256color" && term != "xterm" && term != "linux" && term != "cygwin" {
            if let Some(stripped) = term.strip_prefix("xterm-") {
                return Some(stripped.to_string());
            }
            return Some(term);
        }
    }

    None
}

fn get_default_monospace_font() -> Option<String> {
    #[cfg(target_os = "linux")]
    {
        if let Ok(output) = std::process::Command::new("fc-match")
            .arg("monospace")
            .output()
        {
            if output.status.success() {
                let s = String::from_utf8_lossy(&output.stdout);
                if let Some(start) = s.find('"') {
                    if let Some(end) = s[start + 1..].find('"') {
                        return Some(s[start + 1..start + 1 + end].to_string());
                    }
                }
            }
        }
        return None;
    }

    #[cfg(target_os = "macos")]
    {
        return Some("SF Mono".to_string());
    }

    #[cfg(target_os = "windows")]
    {
        return Some("Consolas".to_string());
    }

    #[allow(unreachable_code)]
    None
}

fn detect_terminal_font(terminal: Option<&str>) -> Option<String> {
    let term = terminal?;
    let term_lower = term.to_lowercase();
    let home = dirs::home_dir()?;

    if term_lower.contains("kitty") {
        let conf_path = home.join(".config/kitty/kitty.conf");
        if let Ok(content) = std::fs::read_to_string(&conf_path) {
            let mut family = None;
            let mut size = None;
            for line in content.lines() {
                let line = line.trim();
                if line.starts_with("font_family") {
                    let parts: Vec<&str> = line.split_whitespace().collect();
                    if parts.len() >= 2 {
                        family = Some(parts[1..].join(" "));
                    }
                } else if line.starts_with("font_size") {
                    let parts: Vec<&str> = line.split_whitespace().collect();
                    if parts.len() >= 2 {
                        size = Some(parts[1].to_string());
                    }
                }
            }
            match (family, size) {
                (Some(f), Some(s)) => return Some(format!("{} ({})", f, s)),
                (Some(f), None) => return Some(f),
                (None, Some(s)) => {
                    let fallback =
                        get_default_monospace_font().unwrap_or_else(|| "Default".to_string());
                    return Some(format!("{} ({})", fallback, s));
                }
                (None, None) => {}
            }
        }
    } else if term_lower.contains("alacritty") {
        let paths = [
            home.join(".config/alacritty/alacritty.toml"),
            home.join(".config/alacritty/alacritty.yml"),
            home.join(".alacritty.toml"),
            home.join(".alacritty.yml"),
        ];
        for path in paths {
            if let Ok(content) = std::fs::read_to_string(&path) {
                let mut family = None;
                let mut size = None;
                for line in content.lines() {
                    let line = line.trim();
                    if line.starts_with("family") {
                        if let Some(idx) = line.find('=') {
                            let val = line[idx + 1..].trim().trim_matches('"').trim_matches('\'');
                            family = Some(val.to_string());
                        } else if let Some(idx) = line.find(':') {
                            let val = line[idx + 1..].trim().trim_matches('"').trim_matches('\'');
                            family = Some(val.to_string());
                        }
                    } else if line.starts_with("size") {
                        if let Some(idx) = line.find('=') {
                            size = Some(line[idx + 1..].trim().to_string());
                        } else if let Some(idx) = line.find(':') {
                            size = Some(line[idx + 1..].trim().to_string());
                        }
                    }
                }
                match (family, size) {
                    (Some(f), Some(s)) => return Some(format!("{} ({})", f, s)),
                    (Some(f), None) => return Some(f),
                    (None, Some(s)) => {
                        let fallback =
                            get_default_monospace_font().unwrap_or_else(|| "Default".to_string());
                        return Some(format!("{} ({})", fallback, s));
                    }
                    (None, None) => {}
                }
            }
        }
    } else if term_lower.contains("wezterm") {
        let paths = [
            home.join(".wezterm.lua"),
            home.join(".config/wezterm/wezterm.lua"),
        ];
        for path in paths {
            if let Ok(content) = std::fs::read_to_string(&path) {
                let mut family = None;
                let mut size = None;
                for line in content.lines() {
                    if line.contains("wezterm.font") {
                        if let Some(start) = line.find("wezterm.font") {
                            let rest = &line[start..];
                            if let Some(quote1) = rest.find('\'').or(rest.find('"')) {
                                let quote_char = rest.chars().nth(quote1).unwrap();
                                if let Some(quote2) = rest[quote1 + 1..].find(quote_char) {
                                    family =
                                        Some(rest[quote1 + 1..quote1 + 1 + quote2].to_string());
                                }
                            }
                        }
                    }
                    if line.contains("font_size") {
                        if let Some(idx) = line.find('=') {
                            let val = line[idx + 1..].trim().trim_end_matches(',');
                            size = Some(val.to_string());
                        }
                    }
                }
                match (family, size) {
                    (Some(f), Some(s)) => return Some(format!("{} ({})", f, s)),
                    (Some(f), None) => return Some(f),
                    (None, Some(s)) => {
                        let fallback =
                            get_default_monospace_font().unwrap_or_else(|| "Default".to_string());
                        return Some(format!("{} ({})", fallback, s));
                    }
                    (None, None) => {}
                }
            }
        }
    } else if term_lower.contains("foot") {
        let conf_path = home.join(".config/foot/foot.ini");
        if let Ok(content) = std::fs::read_to_string(&conf_path) {
            for line in content.lines() {
                let line = line.trim();
                if line.starts_with("font=") {
                    let val = line.trim_start_matches("font=");
                    let parts: Vec<&str> = val.split(':').collect();
                    let family = parts[0].trim();
                    let mut size = None;
                    for part in &parts[1..] {
                        if part.starts_with("size=") {
                            size = Some(part.trim_start_matches("size=").trim());
                        }
                    }
                    if let Some(s) = size {
                        return Some(format!("{} ({})", family, s));
                    } else {
                        return Some(family.to_string());
                    }
                }
            }
        }
    } else if term_lower.contains("ptyxis") {
        #[cfg(target_os = "linux")]
        if let Ok(output) = std::process::Command::new("gsettings")
            .args(["get", "org.gnome.Ptyxis", "use-system-font"])
            .output()
        {
            if output.status.success() {
                let s = String::from_utf8_lossy(&output.stdout).trim().to_string();
                if s == "false" {
                    if let Ok(font_out) = std::process::Command::new("gsettings")
                        .args(["get", "org.gnome.Ptyxis", "font-name"])
                        .output()
                    {
                        if font_out.status.success() {
                            let mut font_str =
                                String::from_utf8_lossy(&font_out.stdout).trim().to_string();
                            font_str = font_str.trim_matches('\'').to_string();
                            if !font_str.is_empty() {
                                if let Some(last_space) = font_str.rfind(' ') {
                                    let family = &font_str[..last_space];
                                    let size = &font_str[last_space + 1..];
                                    if size.chars().all(|c| c.is_ascii_digit() || c == '.') {
                                        return Some(format!("{} ({})", family, size));
                                    }
                                }
                                return Some(font_str);
                            }
                        }
                    }
                } else {
                    if let Ok(font_out) = std::process::Command::new("gsettings")
                        .args(["get", "org.gnome.desktop.interface", "monospace-font-name"])
                        .output()
                    {
                        if font_out.status.success() {
                            let mut font_str =
                                String::from_utf8_lossy(&font_out.stdout).trim().to_string();
                            font_str = font_str.trim_matches('\'').to_string();
                            if !font_str.is_empty() {
                                if let Some(last_space) = font_str.rfind(' ') {
                                    let family = &font_str[..last_space];
                                    let size = &font_str[last_space + 1..];
                                    if size.chars().all(|c| c.is_ascii_digit() || c == '.') {
                                        return Some(format!("{} ({})", family, size));
                                    }
                                }
                                return Some(font_str);
                            }
                        }
                    }
                    return get_default_monospace_font();
                }
            }
        }
    } else if term_lower.contains("konsole") {
        let rc_path = home.join(".config/konsolerc");
        let mut profile_name = "Default.profile".to_string();
        if let Ok(content) = std::fs::read_to_string(&rc_path) {
            for line in content.lines() {
                let line = line.trim();
                if line.starts_with("DefaultProfile=") {
                    profile_name = line.trim_start_matches("DefaultProfile=").to_string();
                    break;
                }
            }
        }
        let profile_path = home.join(".local/share/konsole").join(profile_name);
        if let Ok(content) = std::fs::read_to_string(&profile_path) {
            for line in content.lines() {
                let line = line.trim();
                if line.starts_with("Font=") {
                    let val = line.trim_start_matches("Font=");
                    let parts: Vec<&str> = val.split(',').collect();
                    if !parts.is_empty() {
                        let family = parts[0];
                        if parts.len() > 1 {
                            let size = parts[1];
                            return Some(format!("{} ({})", family, size));
                        }
                        return Some(family.to_string());
                    }
                }
            }
        }
        return get_default_monospace_font();
    }

    #[cfg(target_os = "macos")]
    if term_lower == "iterm.app" || term_lower.contains("iterm2") {
        if let Ok(output) = std::process::Command::new("defaults")
            .args(["read", "com.googlecode.iterm2", "Normal Font"])
            .output()
        {
            if let Ok(s) = String::from_utf8(output.stdout) {
                let font = s.trim();
                if !font.is_empty() {
                    return Some(font.to_string());
                }
            }
        }
    }

    None
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_shell_version() {
        // Bash
        let bash_out = "GNU bash, version 5.2.15(1)-release (x86_64-pc-linux-gnu)\nCopyright (C) 2022 Free Software Foundation, Inc.";
        assert_eq!(
            parse_shell_version("bash", bash_out),
            Some("5.2.15".to_string())
        );

        // Zsh
        let zsh_out = "zsh 5.9 (x86_64-pc-linux-gnu)";
        assert_eq!(parse_shell_version("zsh", zsh_out), Some("5.9".to_string()));

        // Fish
        let fish_out = "fish, version 3.6.0";
        assert_eq!(
            parse_shell_version("fish", fish_out),
            Some("3.6.0".to_string())
        );

        // Nushell
        let nu_out = "0.93.0";
        assert_eq!(
            parse_shell_version("nu", nu_out),
            Some("0.93.0".to_string())
        );

        // PowerShell Core
        let pwsh_out = "PowerShell 7.4.1";
        assert_eq!(
            parse_shell_version("pwsh", pwsh_out),
            Some("7.4.1".to_string())
        );

        // Windows PowerShell
        let powershell_out = "5.1.22621.2428";
        assert_eq!(
            parse_shell_version("powershell", powershell_out),
            Some("5.1.22621.2428".to_string())
        );

        // Elvish
        let elvish_out = "0.20.1";
        assert_eq!(
            parse_shell_version("elvish", elvish_out),
            Some("0.20.1".to_string())
        );

        // Tcsh
        let tcsh_out = "tcsh 6.24.10 (Astron) 2023-04-20 (x86_64-amd-linux) options wide,nls,dl,al,kan,sm,color,filec";
        assert_eq!(
            parse_shell_version("tcsh", tcsh_out),
            Some("6.24.10".to_string())
        );

        // Generic fallback
        let custom_out = "CustomShell version 1.2.3-patch4";
        assert_eq!(
            parse_shell_version("custom", custom_out),
            Some("1.2.3".to_string())
        );
    }

    #[test]
    fn test_is_real_camera() {
        assert!(!is_real_camera("Infrared Camera"));
        assert!(!is_real_camera("IR Camera"));
        assert!(!is_real_camera("Integrated IR Camera"));
        assert!(!is_real_camera("Depth Camera"));
        assert!(is_real_camera("FaceTime HD Camera"));
        assert!(is_real_camera("Integrated Camera"));
        assert!(is_real_camera("HD Webcam C920"));
    }

    #[test]
    fn test_clean_camera_name() {
        assert_eq!(
            clean_camera_name("Integrated Camera: Real"),
            "Integrated Camera"
        );
        assert_eq!(
            clean_camera_name("Integrated Webcam: HD"),
            "Integrated Webcam"
        );
        assert_eq!(clean_camera_name("  HD Webcam C920  "), "HD Webcam C920");
        assert_eq!(
            clean_camera_name("FaceTime HD Camera"),
            "FaceTime HD Camera"
        );
    }

    #[test]
    fn test_parse_macos_camera() {
        let sample = "Camera:\n\n    FaceTime HD Camera:\n\n      Model ID: UVC Camera VendorID_1452 ProductID_34068\n      Unique ID: 0x8020000005ac8514\n";
        assert_eq!(
            parse_macos_camera(sample),
            vec!["FaceTime HD Camera".to_string()]
        );
    }

    #[test]
    fn test_parse_macos_gamepad() {
        let usb_sample = "USB 3.1 Bus:\n\n    Xbox Wireless Controller:\n\n      Product ID: 0x02e0\n      Vendor ID: 0x045e\n";
        let bt_sample = "Bluetooth:\n\n      Devices (Connected):\n          DualSense Wireless Controller:\n              Address: AA-BB-CC\n              Connected: Yes\n";
        let parsed = parse_macos_gamepad(usb_sample, bt_sample);
        assert_eq!(
            parsed,
            vec![
                "Xbox Wireless Controller".to_string(),
                "DualSense Wireless Controller".to_string()
            ]
        );
    }
}

#[cfg(target_os = "windows")]
#[allow(clippy::upper_case_acronyms)]
mod win_reg {
    use std::ffi::OsStr;
    use std::os::windows::ffi::OsStrExt;
    use std::ptr;

    type HKEY = *mut std::ffi::c_void;
    pub const HKEY_LOCAL_MACHINE: HKEY = 0x80000002 as HKEY;
    pub const HKEY_CURRENT_USER: HKEY = 0x80000001 as HKEY;
    const KEY_READ: u32 = 0x20019;

    extern "system" {
        fn RegOpenKeyExW(
            hKey: HKEY,
            lpSubKey: *const u16,
            ulOptions: u32,
            samDesired: u32,
            phkResult: *mut HKEY,
        ) -> i32;

        fn RegQueryValueExW(
            hKey: HKEY,
            lpValueName: *const u16,
            lpReserved: *mut u32,
            lpType: *mut u32,
            lpData: *mut u8,
            lpcbData: *mut u32,
        ) -> i32;

        fn RegCloseKey(hKey: HKEY) -> i32;
    }

    pub fn get_reg_string(hkey: HKEY, subkey: &str, value: &str) -> Option<String> {
        let subkey_w: Vec<u16> = OsStr::new(subkey).encode_wide().chain(Some(0)).collect();
        let value_w: Vec<u16> = OsStr::new(value).encode_wide().chain(Some(0)).collect();
        let mut hk: HKEY = ptr::null_mut();

        let res = unsafe { RegOpenKeyExW(hkey, subkey_w.as_ptr(), 0, KEY_READ, &mut hk) };
        if res != 0 {
            return None;
        }

        let mut size: u32 = 0;
        let mut ty: u32 = 0;
        unsafe {
            RegQueryValueExW(
                hk,
                value_w.as_ptr(),
                ptr::null_mut(),
                &mut ty,
                ptr::null_mut(),
                &mut size,
            );
        }

        if size == 0 {
            unsafe {
                RegCloseKey(hk);
            }
            return None;
        }

        let mut buf = vec![0u8; size as usize];
        let res = unsafe {
            RegQueryValueExW(
                hk,
                value_w.as_ptr(),
                ptr::null_mut(),
                &mut ty,
                buf.as_mut_ptr(),
                &mut size,
            )
        };
        unsafe {
            RegCloseKey(hk);
        }

        if res == 0 {
            if ty == 1 || ty == 2 {
                // REG_SZ or REG_EXPAND_SZ
                let words = unsafe {
                    std::slice::from_raw_parts(buf.as_ptr() as *const u16, buf.len() / 2)
                };
                let len = words.iter().position(|&x| x == 0).unwrap_or(words.len());
                String::from_utf16(&words[..len]).ok()
            } else {
                None
            }
        } else {
            None
        }
    }

    pub fn get_reg_u32(hkey: HKEY, subkey: &str, value: &str) -> Option<u32> {
        let subkey_w: Vec<u16> = OsStr::new(subkey).encode_wide().chain(Some(0)).collect();
        let value_w: Vec<u16> = OsStr::new(value).encode_wide().chain(Some(0)).collect();
        let mut hk: HKEY = ptr::null_mut();

        let res = unsafe { RegOpenKeyExW(hkey, subkey_w.as_ptr(), 0, KEY_READ, &mut hk) };
        if res != 0 {
            return None;
        }

        let mut size: u32 = 4;
        let mut ty: u32 = 0;
        let mut val: u32 = 0;
        let res = unsafe {
            RegQueryValueExW(
                hk,
                value_w.as_ptr(),
                ptr::null_mut(),
                &mut ty,
                &mut val as *mut u32 as *mut u8,
                &mut size,
            )
        };
        unsafe {
            RegCloseKey(hk);
        }

        if res == 0 && ty == 4 {
            // REG_DWORD
            Some(val)
        } else {
            None
        }
    }
}

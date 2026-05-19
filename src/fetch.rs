use crate::cli::Cli;
use crate::config::Config;
use chrono::{DateTime, Utc};
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
}

impl SystemInfo {
    pub fn collect(_cli: &Cli, _config: &Config) -> anyhow::Result<Self> {
        let mut sys = System::new_all();
        sys.refresh_all();

        let os = System::long_os_version()
            .or_else(|| System::name())
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
                format!(
                    "{}: {:.1} GB free / {:.1} GB",
                    d.mount_point().display(),
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
                Some(format!("{:.2}, {:.2}, {:.2}", avg.one, avg.five, avg.fifteen))
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
                format!("{}: {} packets received", name, data.received())
            })
            .collect();

        let boot_timestamp = System::boot_time();
        let boot_dt = DateTime::<Utc>::from_timestamp(boot_timestamp as i64, 0)
            .map(|dt| dt.format("%Y-%m-%d %H:%M:%S").to_string())
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

        // Number of users
        let users = Users::new_with_refreshed_list().len();

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
        })
    }
}
// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Network interface detection, IP resolution, Wi-Fi, and related helpers.

use owo_colors::OwoColorize;
use sysinfo::Networks;

/// Detects the local IP address and active network interface name.
pub fn detect_active_interface_and_local_ip() -> (Option<String>, Option<String>) {
    let local_ip = std::net::UdpSocket::bind("0.0.0.0:0")
        .ok()
        .and_then(|socket| {
            socket.connect("8.8.8.8:53").ok()?;
            socket.local_addr().ok().map(|addr| addr.ip().to_string())
        });

    let active_interface = {
        #[cfg(target_os = "linux")]
        {
            let native_iface = std::fs::read_to_string("/proc/net/route")
                .ok()
                .and_then(|content| parse_proc_net_route(&content));

            native_iface.or_else(|| {
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
            // Identify the active (default-route) interface as the adapter whose
            // assigned IPs include the outbound `local_ip` we just resolved via the
            // UDP-connect trick. This avoids spawning PowerShell `Get-NetRoute`,
            // which costs ~1s of startup on Windows and dominated `--short` runtime.
            // sysinfo already exposes per-interface IPs on Windows (see
            // `detect_networks`), so no process spawn or extra API call is needed.
            local_ip
                .as_deref()
                .and_then(|ip| ip.parse::<std::net::IpAddr>().ok())
                .and_then(|target| {
                    let networks = Networks::new_with_refreshed_list();
                    match_active_interface(
                        networks.iter().map(|(name, data)| {
                            (
                                name.to_string(),
                                data.ip_networks().iter().map(|n| n.addr).collect(),
                            )
                        }),
                        target,
                    )
                })
        }
        #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
        {
            None
        }
    };

    (local_ip, active_interface)
}

/// Returns the name of the interface whose assigned IPs include `local_ip`.
///
/// Used on Windows to identify the active (default-route) interface without a
/// slow `Get-NetRoute` PowerShell spawn: the outbound local IP the OS picks to
/// reach the internet uniquely belongs to the adapter carrying the default
/// route, so matching it against each adapter's IP set yields the same answer.
#[cfg(any(target_os = "windows", test))]
fn match_active_interface(
    ifaces: impl Iterator<Item = (String, Vec<std::net::IpAddr>)>,
    local_ip: std::net::IpAddr,
) -> Option<String> {
    ifaces
        .into_iter()
        .find(|(_, ips)| ips.contains(&local_ip))
        .map(|(name, _)| name)
}

/// Fetches the public IP address via an external service (best-effort, 2s timeout).
pub fn detect_public_ip() -> Option<String> {
    std::process::Command::new("curl")
        .args(["-s", "--max-time", "2", "https://api.ipify.org"])
        .output()
        .ok()
        .and_then(|o| String::from_utf8(o.stdout).ok())
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())
}

/// Builds the formatted list of network interfaces with IP addresses and RX/TX stats.
pub fn detect_networks(active_interface: Option<&str>, local_ip: Option<&str>) -> Vec<String> {
    Networks::new_with_refreshed_list()
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
                    if let (Some(active), Some(ip)) = (active_interface, local_ip) {
                        if name == active {
                            ipv4_addresses.push(ip.to_string());
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
        .collect()
}

/// Formats a byte count into human-readable form (KB, MB, GB, etc.)
pub fn format_bytes(bytes: u64) -> String {
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

/// Looks up a PCI vendor name from `/usr/share/hwdata/pci.ids` (or fallback paths).
///
/// `vendor_id` should be a lowercase hex string without the `0x` prefix.
pub fn lookup_pci_vendor(vendor_id: &str) -> Option<String> {
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

/// Detects the connected Wi-Fi network and link parameters.
pub fn detect_wifi() -> Option<String> {
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

        // Fallback to nmcli (using --rescan no to avoid slow hardware channel scans)
        if let Ok(output) = std::process::Command::new("nmcli")
            .args([
                "-t",
                "-f",
                "active,ssid,rate",
                "device",
                "wifi",
                "list",
                "--rescan",
                "no",
            ])
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
        crate::macos_ffi::get_wifi_info().map(|(ssid, rate)| match rate {
            Some(r) if r > 0 => format!("{} (↑{} Mbps)", ssid, r),
            _ => ssid,
        })
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

#[cfg(any(target_os = "linux", test))]
pub fn parse_proc_net_route(content: &str) -> Option<String> {
    for line in content.lines().skip(1) {
        let parts: Vec<&str> = line.split_whitespace().collect();
        if parts.len() >= 8 {
            let dest = parts[1];
            let mask = parts[7];
            if dest == "00000000" && mask == "00000000" {
                return Some(parts[0].to_string());
            }
        }
    }
    None
}

#[allow(
    clippy::manual_is_multiple_of,
    clippy::manual_range_contains,
    dead_code
)]
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
pub struct WifiLink {
    pub freq: Option<f64>,
    pub rx_rate: Option<String>,
    pub tx_rate: Option<String>,
}

#[allow(dead_code)]
pub fn parse_iw_link_output(stdout: &str) -> (Option<String>, Vec<WifiLink>) {
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
pub fn parse_netsh_output(stdout: &str) -> Option<String> {
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

/// Returns the list of configured DNS nameserver addresses.
///
/// Linux/macOS: parses `nameserver` lines from `/etc/resolv.conf`.
/// Windows: runs PowerShell `Get-DnsClientServerAddress`.
/// Returns an empty `Vec` if nothing is found.
pub fn detect_dns() -> Vec<String> {
    #[cfg(any(target_os = "linux", target_os = "macos"))]
    {
        if let Ok(content) = std::fs::read_to_string("/etc/resolv.conf") {
            return parse_resolv_conf(&content);
        }
    }
    #[cfg(target_os = "windows")]
    {
        if let Ok(output) = std::process::Command::new("powershell")
            .args([
                "-Command",
                "Get-DnsClientServerAddress -AddressFamily IPv4 | Select-Object -ExpandProperty ServerAddresses | Sort-Object -Unique",
            ])
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                let servers: Vec<String> = stdout
                    .lines()
                    .map(|l| l.trim().to_string())
                    .filter(|l| !l.is_empty())
                    .collect();
                if !servers.is_empty() {
                    return servers;
                }
            }
        }
    }
    Vec::new()
}

#[cfg(any(target_os = "linux", target_os = "macos", test))]
pub fn parse_resolv_conf(content: &str) -> Vec<String> {
    content
        .lines()
        .filter_map(|line| {
            let line = line.trim();
            if line.starts_with('#') || line.starts_with(';') {
                return None;
            }
            let mut parts = line.split_whitespace();
            if parts.next()? == "nameserver" {
                parts.next().map(|s| s.to_string())
            } else {
                None
            }
        })
        .collect()
}

/// Returns the configured DNS domain name.
///
/// On **Linux**, the domain of the link carrying the IP default route wins (see
/// [`resolve_default_route_domain`]). `/etc/resolv.conf` is only a fallback there, because
/// under systemd-resolved it is the stub file whose `search` list is the *merged* set of
/// every link's domains — so its first entry is frequently a VPN's domain rather than the
/// default route's. On **macOS**, `/etc/resolv.conf` is written by configd from the primary
/// network service, so it is read directly. On **Windows**, queries the primary DNS domain
/// via `GetComputerNameExW` (`ComputerNameDnsDomain`).
///
/// Returns `None` when no domain is configured (e.g. a workgroup machine, or a default-route
/// link with no DNS domain of its own) or the source is unavailable.
pub fn detect_domain() -> Option<String> {
    #[cfg(target_os = "linux")]
    {
        // Ask systemd-resolved what the *default-route* link's domain is. When it manages
        // that link its answer is authoritative — including "no domain" — so we must not
        // fall through to resolv.conf's merged list, which is what leaks a VPN's domain.
        if let (Some(iface), Some(status)) = (default_route_interface(), resolvectl_status()) {
            if let DefaultRouteDomain::Managed(domain) =
                resolve_default_route_domain(&parse_resolvectl_domains(status), &iface)
            {
                return domain;
            }
        }
        read_resolv_conf_domain()
    }
    #[cfg(target_os = "macos")]
    {
        read_resolv_conf_domain()
    }
    #[cfg(target_os = "windows")]
    {
        detect_domain_windows()
    }
    #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
    {
        None
    }
}

/// Reads the `domain`/`search` fallback from `/etc/resolv.conf`.
#[cfg(any(target_os = "linux", target_os = "macos"))]
fn read_resolv_conf_domain() -> Option<String> {
    std::fs::read_to_string("/etc/resolv.conf")
        .ok()
        .and_then(|content| parse_domain_from_resolv_conf(&content))
}

/// Returns the interface carrying the IP default route, from `/proc/net/route`.
///
/// Deliberately the *routing table*, not resolvectl's `Default Route:` field — that field is
/// systemd-resolved's DNS-routing flag (may this link's servers answer arbitrary queries)
/// and is commonly `yes` for a VPN link and the physical link simultaneously, so it cannot
/// identify the default route.
#[cfg(target_os = "linux")]
fn default_route_interface() -> Option<String> {
    std::fs::read_to_string("/proc/net/route")
        .ok()
        .and_then(|content| parse_proc_net_route(&content))
}

/// Cached output of `resolvectl status --no-pager`, or `None` if it is unavailable.
#[cfg(target_os = "linux")]
static RESOLVECTL_STATUS: std::sync::OnceLock<Option<String>> = std::sync::OnceLock::new();

/// Runs `resolvectl status --no-pager` at most once per process and caches the output.
///
/// Both the `domain` and `domain-search` fields need it, and they are collected
/// sequentially; retch is a short-lived one-shot process, so a process-lifetime cache
/// cannot go stale and saves a second ~5 ms spawn in `--full`.
#[cfg(target_os = "linux")]
fn resolvectl_status() -> Option<&'static str> {
    RESOLVECTL_STATUS
        .get_or_init(|| {
            let output = std::process::Command::new("resolvectl")
                .args(["status", "--no-pager"])
                .output()
                .ok()?;
            if !output.status.success() {
                return None;
            }
            Some(String::from_utf8_lossy(&output.stdout).into_owned())
        })
        .as_deref()
}

/// Windows: returns the host's primary DNS domain via `GetComputerNameExW`.
///
/// Uses the two-call size-probing convention: a first call with a null buffer
/// reports the required length, the second fills the buffer. A workgroup
/// (non-domain-joined) host reports an empty DNS domain, which
/// [`clean_domain`] maps to `None`.
#[cfg(target_os = "windows")]
fn detect_domain_windows() -> Option<String> {
    use std::os::windows::ffi::OsStringExt;

    // COMPUTER_NAME_FORMAT::ComputerNameDnsDomain
    const COMPUTER_NAME_DNS_DOMAIN: i32 = 2;

    // kernel32 is linked by default on the MSVC target.
    extern "system" {
        fn GetComputerNameExW(name_type: i32, lp_buffer: *mut u16, n_size: *mut u32) -> i32;
    }

    // First call: null buffer + size 0 asks the OS for the required length
    // (in wide chars, including the trailing NUL). It fails and sets `size`.
    let mut size: u32 = 0;
    // SAFETY: the null-buffer / zero-size form is the documented size probe;
    // the OS only writes the required length back through `size`.
    unsafe {
        GetComputerNameExW(COMPUTER_NAME_DNS_DOMAIN, std::ptr::null_mut(), &mut size);
    }
    if size == 0 {
        return None;
    }

    let mut buf = vec![0u16; size as usize];
    // SAFETY: `buf` has `size` wide chars of capacity; `size` is passed by
    // pointer so the OS reports the final length (excluding the NUL). The call
    // writes at most `size` code units.
    let ok = unsafe { GetComputerNameExW(COMPUTER_NAME_DNS_DOMAIN, buf.as_mut_ptr(), &mut size) };
    if ok == 0 {
        return None;
    }

    let s = std::ffi::OsString::from_wide(&buf[..size as usize])
        .to_string_lossy()
        .into_owned();
    clean_domain(&s)
}

/// Trims a raw domain string and maps the empty string to `None`.
///
/// A non-domain-joined Windows host reports an empty DNS domain; treat that as
/// "no domain configured" rather than surfacing an empty value.
#[cfg(any(target_os = "windows", test))]
fn clean_domain(raw: &str) -> Option<String> {
    let trimmed = raw.trim();
    if trimmed.is_empty() {
        None
    } else {
        Some(trimmed.to_string())
    }
}

/// Returns per-interface DNS search domain lists.
///
/// On Linux, tries `resolvectl status --no-pager` first and parses per-link
/// DNS Domain / DNS Search Domains entries. Falls back to the global `search`
/// list from `/etc/resolv.conf` when resolvectl is unavailable.
/// On macOS, reads the global `search` list from `/etc/resolv.conf`.
pub fn detect_domain_search() -> Vec<String> {
    #[cfg(target_os = "linux")]
    {
        // Shares the one cached `resolvectl` spawn with `detect_domain`.
        if let Some(status) = resolvectl_status() {
            let result = parse_resolvectl_search(status);
            if !result.is_empty() {
                return result;
            }
        }
        if let Ok(content) = std::fs::read_to_string("/etc/resolv.conf") {
            return format_global_search_domains(&parse_search_from_resolv_conf(&content));
        }
    }
    #[cfg(target_os = "macos")]
    {
        if let Ok(content) = std::fs::read_to_string("/etc/resolv.conf") {
            return format_global_search_domains(&parse_search_from_resolv_conf(&content));
        }
    }
    Vec::new()
}

/// Scope label for search domains that carry no per-interface attribution.
///
/// `/etc/resolv.conf`'s `search` list is a single global list — it does not say which link
/// each domain came from — so it is labelled honestly rather than attributed to an
/// interface, which would be a fabrication on a multi-homed host.
#[cfg(any(target_os = "linux", target_os = "macos", test))]
const GLOBAL_SEARCH_SCOPE: &str = "global";

/// Renders a scope-less (global) search-domain list in the same shape as the per-link
/// resolvectl path: one entry of `"<scope>: a, b"`.
///
/// Without this the `Domain Search` field had no stable shape, and the difference was
/// *source*-driven rather than platform-driven — the same OS flipped format depending on
/// whether systemd-resolved was reachable. In CI, Ubuntu on a bare runner rendered
/// `eth0: example.com` (resolvectl) while the very same Ubuntu inside a container rendered a
/// bare `example.com` (this fallback), and Fedora — always containerised — looked
/// permanently "different from Ubuntu" for no platform reason at all.
///
/// Two things were inconsistent, not just the prefix: the resolvectl path returns **one entry
/// per interface** with domains joined by `", "`, whereas the raw fallback returned **one
/// entry per domain**, and the display prints one line per entry — so a host with
/// `search a b c` emitted three separate bare `Domain Search:` lines. Both are normalised
/// here.
#[cfg(any(target_os = "linux", target_os = "macos", test))]
pub fn format_global_search_domains(domains: &[String]) -> Vec<String> {
    if domains.is_empty() {
        Vec::new()
    } else {
        vec![format!("{}: {}", GLOBAL_SEARCH_SCOPE, domains.join(", "))]
    }
}

/// Parses the `domain` directive (or first `search` entry as fallback) from
/// `/etc/resolv.conf` content.
#[cfg(any(target_os = "linux", target_os = "macos", test))]
pub fn parse_domain_from_resolv_conf(content: &str) -> Option<String> {
    let mut first_search: Option<String> = None;
    for line in content.lines() {
        let line = line.trim();
        if line.starts_with('#') || line.starts_with(';') {
            continue;
        }
        let mut parts = line.split_whitespace();
        match parts.next() {
            Some("domain") => {
                if let Some(d) = parts.next() {
                    return Some(d.to_string());
                }
            }
            Some("search") if first_search.is_none() => {
                if let Some(d) = parts.next() {
                    first_search = Some(d.to_string());
                }
            }
            _ => {}
        }
    }
    first_search
}

/// Parses all entries from the `search` directive in `/etc/resolv.conf` content.
#[cfg(any(target_os = "linux", target_os = "macos", test))]
pub fn parse_search_from_resolv_conf(content: &str) -> Vec<String> {
    for line in content.lines() {
        let line = line.trim();
        if line.starts_with('#') || line.starts_with(';') {
            continue;
        }
        let mut parts = line.split_whitespace();
        if parts.next() == Some("search") {
            let domains: Vec<String> = parts.map(|s| s.to_string()).collect();
            if !domains.is_empty() {
                return domains;
            }
        }
    }
    Vec::new()
}

/// One link's DNS search domains, as reported by `resolvectl status`.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
#[cfg(any(target_os = "linux", test))]
pub struct LinkDomains {
    /// Interface name, e.g. `wlp194s0`.
    pub interface: String,
    /// Search domains in report order, with routing-only (`~`-prefixed) entries removed.
    /// Empty means systemd-resolved manages this link but it has no search domain.
    pub search: Vec<String>,
}

/// DNS search domains from `resolvectl status`, split by scope.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
#[cfg(any(target_os = "linux", test))]
pub struct ResolvectlDomains {
    /// Domains from the `Global` section (e.g. `resolved.conf`'s `Domains=`), which belong
    /// to no particular interface.
    pub global: Vec<String>,
    /// One entry per `Link N (iface)` section, in report order.
    pub links: Vec<LinkDomains>,
}

/// Outcome of looking up the default-route link in [`ResolvectlDomains`].
#[derive(Debug, Clone, PartialEq, Eq)]
#[cfg(any(target_os = "linux", test))]
pub enum DefaultRouteDomain {
    /// systemd-resolved manages the link, so its answer is authoritative. `None` means the
    /// link genuinely has no domain — the caller must **not** fall back to the merged
    /// `/etc/resolv.conf` search list, which would resurrect another link's (e.g. a VPN's)
    /// domain.
    Managed(Option<String>),
    /// The link has no section in the resolvectl output, so systemd-resolved has no opinion
    /// about it; the caller should fall back to `/etc/resolv.conf`.
    Unmanaged,
}

/// Picks the domain to display for `interface` from parsed resolvectl output.
///
/// Prefers the link's own first search domain, then a `Global` domain (interface-independent,
/// so it cannot be another link's). Never returns a *different* link's domain — that is the
/// whole point: the default route's domain must win over a VPN's.
#[cfg(any(target_os = "linux", test))]
pub fn resolve_default_route_domain(
    domains: &ResolvectlDomains,
    interface: &str,
) -> DefaultRouteDomain {
    match domains.links.iter().find(|l| l.interface == interface) {
        Some(link) => DefaultRouteDomain::Managed(
            link.search
                .first()
                .or_else(|| domains.global.first())
                .cloned(),
        ),
        None => DefaultRouteDomain::Unmanaged,
    }
}

/// Parses `resolvectl status --no-pager` output into per-scope DNS search domains.
///
/// Handles the two shapes that tripped up the previous single-line parser:
/// - **Wrapped values.** resolvectl right-aligns labels and continues long values on
///   following indented, label-less lines; those continuations were silently dropped.
/// - **Routing-only domains.** systemd prefixes a domain with `~` when it should only
///   *route* queries to that link, never be appended as a search suffix. Every `~` entry is
///   excluded (the old code special-cased only the exact catch-all `~.`).
///
/// Sections are recognised by content (`Global`, `Link N (iface)`) rather than by indentation,
/// since resolvectl's exact column padding varies with the longest label present. A `Link`
/// header always creates an entry, even with no domain line, so callers can distinguish
/// "managed, no domain" from "not managed at all".
#[cfg(any(target_os = "linux", test))]
pub fn parse_resolvectl_domains(content: &str) -> ResolvectlDomains {
    let mut out = ResolvectlDomains::default();
    // `None` = the Global section, `Some(iface)` = that link's section.
    let mut section: Option<String> = None;
    // True while consuming the (possibly wrapped) value of a DNS domain field.
    let mut in_domain_value = false;

    for line in content.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            in_domain_value = false;
            continue;
        }

        // "Link N (iface)" starts a link section. Checked before the continuation branch
        // below, since a header carries no colon either.
        if let Some(iface) = trimmed
            .strip_prefix("Link ")
            .and_then(|rest| rest.split_once('('))
            .and_then(|(_, rest)| rest.split_once(')'))
            .map(|(iface, _)| iface)
        {
            in_domain_value = false;
            section = Some(iface.to_string());
            // Record the link even if it never reports a domain.
            if !out.links.iter().any(|l| l.interface == iface) {
                out.links.push(LinkDomains {
                    interface: iface.to_string(),
                    search: Vec::new(),
                });
            }
            continue;
        }

        if trimmed == "Global" {
            in_domain_value = false;
            section = None;
            continue;
        }

        if let Some(value) = trimmed
            .strip_prefix("DNS Domain:")
            .or_else(|| trimmed.strip_prefix("DNS Search Domains:"))
        {
            in_domain_value = true;
            push_resolvectl_domains(&mut out, section.as_deref(), value);
            continue;
        }

        // A wrapped continuation of the domain value carries no `label:` of its own, and
        // domain names cannot contain ':' — so any colon means a new field has started.
        if in_domain_value && !trimmed.contains(':') {
            push_resolvectl_domains(&mut out, section.as_deref(), trimmed);
            continue;
        }
        in_domain_value = false;
    }
    out
}

/// Appends whitespace-separated domains from one resolvectl value fragment to `section`,
/// dropping systemd routing-only (`~`-prefixed) entries.
#[cfg(any(target_os = "linux", test))]
fn push_resolvectl_domains(out: &mut ResolvectlDomains, section: Option<&str>, value: &str) {
    let domains = value
        .split_whitespace()
        .filter(|d| !d.starts_with('~'))
        .map(|d| d.to_string());
    match section {
        Some(iface) => match out.links.iter_mut().find(|l| l.interface == iface) {
            Some(link) => link.search.extend(domains),
            None => out.links.push(LinkDomains {
                interface: iface.to_string(),
                search: domains.collect(),
            }),
        },
        None => out.global.extend(domains),
    }
}

/// Parses `resolvectl status --no-pager` output into per-interface search domain strings.
///
/// Formats [`parse_resolvectl_domains`] as `"wlan0: home.local"` entries, one per link,
/// skipping links with no search domain of their own.
#[cfg(any(target_os = "linux", test))]
pub fn parse_resolvectl_search(content: &str) -> Vec<String> {
    parse_resolvectl_domains(content)
        .links
        .into_iter()
        .filter(|link| !link.search.is_empty())
        .map(|link| format!("{}: {}", link.interface, link.search.join(", ")))
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_clean_domain() {
        // Normal domain passes through.
        assert_eq!(
            clean_domain("corp.example.com"),
            Some("corp.example.com".to_string())
        );
        // Surrounding whitespace is trimmed.
        assert_eq!(
            clean_domain("  example.org \n"),
            Some("example.org".to_string())
        );
        // A workgroup host reports an empty domain -> None (not Some("")).
        assert_eq!(clean_domain(""), None);
        assert_eq!(clean_domain("   "), None);
    }

    #[test]
    fn test_match_active_interface() {
        use std::net::IpAddr;
        let target: IpAddr = "192.168.1.50".parse().unwrap();
        let ifaces = vec![
            ("lo".to_string(), vec!["127.0.0.1".parse().unwrap()]),
            (
                "Ethernet".to_string(),
                vec!["192.168.1.50".parse().unwrap(), "fe80::1".parse().unwrap()],
            ),
            ("Wi-Fi".to_string(), vec!["10.0.0.2".parse().unwrap()]),
        ];
        // Matches the adapter that actually holds the outbound local IP.
        assert_eq!(
            match_active_interface(ifaces.into_iter(), target),
            Some("Ethernet".to_string())
        );

        // No adapter holds the target IP -> None (e.g. offline / unresolved).
        let orphan: IpAddr = "8.8.8.8".parse().unwrap();
        let ifaces2 = vec![(
            "lo".to_string(),
            vec!["127.0.0.1".parse::<IpAddr>().unwrap()],
        )];
        assert_eq!(match_active_interface(ifaces2.into_iter(), orphan), None);
    }

    #[test]
    fn test_format_bytes() {
        assert_eq!(format_bytes(500), "500 B");
        assert_eq!(format_bytes(1024), "1.0 KB");
        assert_eq!(format_bytes(1024 * 1024), "1.0 MB");
        assert_eq!(format_bytes(1024 * 1024 * 1024), "1.0 GB");
        assert_eq!(format_bytes(1536), "1.5 KB");
    }

    #[test]
    fn test_parse_proc_net_route() {
        let sample =
            "Iface\tDestination\tGateway \tFlags\tRefCnt\tUse\tMetric\tMask\t\tMTU\tWindow\tIRTT\n\
                      wlan0\t0000A8C0\t00000000\t0001\t0\t0\t600\t0000FFFF\t0\t0\t0\n\
                      wlan0\t00000000\t0100A8C0\t0003\t0\t0\t600\t00000000\t0\t0\t0\n";
        assert_eq!(parse_proc_net_route(sample), Some("wlan0".to_string()));

        let sample_no_default =
            "Iface\tDestination\tGateway \tFlags\tRefCnt\tUse\tMetric\tMask\t\tMTU\tWindow\tIRTT\n\
                                 wlan0\t0000A8C0\t00000000\t0001\t0\t0\t600\t0000FFFF\t0\t0\t0\n";
        assert_eq!(parse_proc_net_route(sample_no_default), None);
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
    fn test_parse_resolv_conf() {
        let sample = "# Generated by NetworkManager\ndomain home\nsearch home\nnameserver 192.168.1.1\nnameserver 8.8.8.8\n; comment\nnameserver 2001:db8::1\n";
        assert_eq!(
            parse_resolv_conf(sample),
            vec!["192.168.1.1", "8.8.8.8", "2001:db8::1"]
        );

        let empty = "# no nameservers\nsearch local\n";
        assert_eq!(parse_resolv_conf(empty), Vec::<String>::new());
    }

    #[test]
    fn test_parse_domain_from_resolv_conf_domain_directive() {
        let s = "# test\ndomain example.com\nsearch fallback.com\nnameserver 1.1.1.1\n";
        assert_eq!(
            parse_domain_from_resolv_conf(s),
            Some("example.com".to_string())
        );
    }

    #[test]
    fn test_parse_domain_from_resolv_conf_search_fallback() {
        let s = "# no domain directive\nsearch local.lan other.lan\nnameserver 1.1.1.1\n";
        assert_eq!(
            parse_domain_from_resolv_conf(s),
            Some("local.lan".to_string())
        );
    }

    #[test]
    fn test_parse_domain_from_resolv_conf_none() {
        let s = "# no domain or search\nnameserver 1.1.1.1\n";
        assert_eq!(parse_domain_from_resolv_conf(s), None);
    }

    #[test]
    fn test_parse_search_from_resolv_conf() {
        let s = "search home.local corp.example.com\nnameserver 1.1.1.1\n";
        assert_eq!(
            parse_search_from_resolv_conf(s),
            vec!["home.local", "corp.example.com"]
        );
    }

    #[test]
    fn test_parse_resolvectl_search_basic() {
        let sample = "Global\n\
            Link 2 (lo)\n\
              Current Scopes: none\n\
            Link 3 (wlan0)\n\
              Current Scopes: DNS\n\
              DNS Domain: home.local\n\
            Link 4 (eth0)\n\
              Current Scopes: DNS\n\
              DNS Search Domains: corp.example.com internal.net\n";
        let result = parse_resolvectl_search(sample);
        assert_eq!(
            result,
            vec!["wlan0: home.local", "eth0: corp.example.com, internal.net"]
        );
    }

    #[test]
    fn test_parse_resolvectl_search_skips_routing_domain() {
        let sample = "Link 2 (wlan0)\n  DNS Domain: ~.\nLink 3 (eth0)\n  DNS Domain: corp.net\n";
        let result = parse_resolvectl_search(sample);
        assert_eq!(result, vec!["eth0: corp.net"]);
    }

    #[test]
    fn test_parse_resolvectl_search_empty() {
        let sample = "Global\n  DNS Servers: 1.1.1.1\n";
        assert!(parse_resolvectl_search(sample).is_empty());
    }

    // ── domain selection: default route vs. VPN ───────────────────────────────

    /// Verbatim `resolvectl status --no-pager` output from the reported machine: a NetBird
    /// VPN (`wt0`, split tunnel) alongside the Wi-Fi default route (`wlp194s0`). Note that
    /// **both** links report `Default Route: yes` — that is systemd-resolved's DNS-routing
    /// flag, not the IP default route — and that `wt0`'s DNS Domain value wraps onto a
    /// continuation line.
    const RESOLVECTL_VPN_SAMPLE: &str = concat!(
        "Global\n",
        "         Protocols: LLMNR=resolve -mDNS -DNSOverTLS DNSSEC=no/unsupported\n",
        "  resolv.conf mode: stub\n",
        "\n",
        "Link 2 (wlp194s0)\n",
        "    Current Scopes: DNS LLMNR/IPv4 LLMNR/IPv6\n",
        "         Protocols: +DefaultRoute LLMNR=resolve -mDNS -DNSOverTLS\n",
        "                    DNSSEC=no/unsupported\n",
        "Current DNS Server: 192.168.86.1\n",
        "       DNS Servers: 192.168.86.1\n",
        "        DNS Domain: lan\n",
        "     Default Route: yes\n",
        "\n",
        "Link 3 (wt0)\n",
        "    Current Scopes: DNS\n",
        "         Protocols: +DefaultRoute LLMNR=resolve -mDNS -DNSOverTLS\n",
        "                    DNSSEC=no/unsupported\n",
        "Current DNS Server: 100.101.32.155\n",
        "       DNS Servers: 100.101.32.155\n",
        "        DNS Domain: netbird.cloud ~gammatile.com ~101.100.in-addr.arpa\n",
        "                    ~f.f.0.0.3.2.b.5.b.c.8.5.7.f.d.f.ip6.arpa ~.\n",
        "     Default Route: yes\n",
    );

    #[test]
    fn test_domain_prefers_default_route_over_vpn() {
        // The reported bug: resolv.conf's merged "search netbird.cloud lan" put the VPN
        // first, so the Domain field showed netbird.cloud. Keyed on the default-route
        // interface, the answer is the Wi-Fi link's own domain.
        let parsed = parse_resolvectl_domains(RESOLVECTL_VPN_SAMPLE);
        assert_eq!(
            resolve_default_route_domain(&parsed, "wlp194s0"),
            DefaultRouteDomain::Managed(Some("lan".to_string()))
        );
    }

    #[test]
    fn test_domain_reports_vpn_when_vpn_is_the_default_route() {
        // Full-tunnel case: if the VPN *is* the default route, its domain is correct.
        let parsed = parse_resolvectl_domains(RESOLVECTL_VPN_SAMPLE);
        assert_eq!(
            resolve_default_route_domain(&parsed, "wt0"),
            DefaultRouteDomain::Managed(Some("netbird.cloud".to_string()))
        );
    }

    #[test]
    fn test_domain_routing_only_entries_are_not_domains() {
        // Every `~`-prefixed entry is routing-only, never a search suffix — so a link whose
        // only entries are `~`-prefixed has no domain (and must not yield "~gammatile.com").
        let parsed = parse_resolvectl_domains(RESOLVECTL_VPN_SAMPLE);
        let wt0 = parsed.links.iter().find(|l| l.interface == "wt0").unwrap();
        assert_eq!(wt0.search, vec!["netbird.cloud"]);
        assert!(wt0.search.iter().all(|d| !d.starts_with('~')));

        let routing_only = "Link 5 (tun0)\n        DNS Domain: ~corp.example.com ~.\n";
        let parsed = parse_resolvectl_domains(routing_only);
        assert_eq!(
            resolve_default_route_domain(&parsed, "tun0"),
            DefaultRouteDomain::Managed(None)
        );
    }

    #[test]
    fn test_parse_resolvectl_domains_reads_wrapped_continuation_lines() {
        // Regression: the old parser read only the first line of a wrapped value, silently
        // dropping the rest. Here the continuation carries a real search domain.
        let sample = concat!(
            "Link 2 (eth0)\n",
            "        DNS Domain: one.example.com two.example.com\n",
            "                    three.example.com ~routing.example.com\n",
            "     Default Route: yes\n",
        );
        let parsed = parse_resolvectl_domains(sample);
        assert_eq!(
            parsed.links[0].search,
            vec!["one.example.com", "two.example.com", "three.example.com"]
        );
        // The following `label: value` line must end the value, not join it.
        assert!(!parsed.links[0].search.iter().any(|d| d.contains("yes")));
    }

    #[test]
    fn test_parse_resolvectl_domains_ignores_other_wrapped_fields() {
        // `Protocols:` also wraps; its continuation must not be mistaken for a domain.
        let sample = concat!(
            "Link 2 (eth0)\n",
            "         Protocols: +DefaultRoute LLMNR=resolve -mDNS -DNSOverTLS\n",
            "                    DNSSEC=no/unsupported\n",
            "        DNS Domain: real.example.com\n",
        );
        let parsed = parse_resolvectl_domains(sample);
        assert_eq!(parsed.links[0].search, vec!["real.example.com"]);
    }

    #[test]
    fn test_domain_unmanaged_link_falls_back() {
        // A default-route interface systemd-resolved knows nothing about: the caller should
        // fall back to /etc/resolv.conf rather than borrow another link's domain.
        let parsed = parse_resolvectl_domains(RESOLVECTL_VPN_SAMPLE);
        assert_eq!(
            resolve_default_route_domain(&parsed, "ppp0"),
            DefaultRouteDomain::Unmanaged
        );
    }

    #[test]
    fn test_domain_managed_without_domain_does_not_borrow_from_other_links() {
        // wlp194s0 is managed but has no domain of its own; the VPN's domain must NOT be
        // substituted (that is the bug). With no Global domain either, the answer is "none".
        let sample = concat!(
            "Link 2 (wlp194s0)\n",
            "     Default Route: yes\n",
            "Link 3 (wt0)\n",
            "        DNS Domain: netbird.cloud\n",
        );
        let parsed = parse_resolvectl_domains(sample);
        assert_eq!(
            resolve_default_route_domain(&parsed, "wlp194s0"),
            DefaultRouteDomain::Managed(None)
        );
    }

    #[test]
    fn test_domain_falls_back_to_global_but_not_to_another_link() {
        // A Global domain (resolved.conf `Domains=`) belongs to no interface, so it is a
        // legitimate answer when the default-route link has none of its own.
        let sample = concat!(
            "Global\n",
            "        DNS Domain: corp.example.com\n",
            "Link 2 (wlp194s0)\n",
            "     Default Route: yes\n",
            "Link 3 (wt0)\n",
            "        DNS Domain: netbird.cloud\n",
        );
        let parsed = parse_resolvectl_domains(sample);
        assert_eq!(parsed.global, vec!["corp.example.com"]);
        assert_eq!(
            resolve_default_route_domain(&parsed, "wlp194s0"),
            DefaultRouteDomain::Managed(Some("corp.example.com".to_string()))
        );
    }

    #[test]
    fn test_parse_resolvectl_domains_merges_both_domain_labels() {
        // A link reporting both labels yields one merged entry, not two.
        let sample = concat!(
            "Link 2 (eth0)\n",
            "        DNS Domain: a.example.com\n",
            "DNS Search Domains: b.example.com\n",
        );
        let parsed = parse_resolvectl_domains(sample);
        assert_eq!(parsed.links.len(), 1);
        assert_eq!(
            parsed.links[0].search,
            vec!["a.example.com", "b.example.com"]
        );
        assert_eq!(
            parse_resolvectl_search(sample),
            vec!["eth0: a.example.com, b.example.com"]
        );
    }

    // ── Domain Search: one shape regardless of source ─────────────────────────

    #[test]
    fn test_global_search_domains_match_per_link_shape() {
        // The fallback must render like the resolvectl path — "<scope>: a, b" — so the field
        // has one shape. Regression for the CI inconsistency where the same OS flipped format
        // depending on whether systemd-resolved was reachable (bare runner vs. container).
        let per_link = parse_resolvectl_search("Link 2 (eth0)\n  DNS Domain: a.example.com\n");
        assert_eq!(per_link, vec!["eth0: a.example.com"]);

        let global = format_global_search_domains(&["a.example.com".to_string()]);
        assert_eq!(global, vec!["global: a.example.com"]);

        // Same structural shape: exactly one entry, "<scope>: <domains>".
        assert_eq!(per_link.len(), global.len());
        for entry in per_link.iter().chain(global.iter()) {
            let (scope, domains) = entry.split_once(": ").expect("entry must carry a scope");
            assert!(!scope.is_empty() && !domains.is_empty());
        }
    }

    #[test]
    fn test_global_search_domains_group_into_one_entry() {
        // The raw resolv.conf parse yields one element per domain, and the display prints one
        // line per element — so `search a b c` used to emit three bare `Domain Search:` lines
        // while resolvectl emitted one per interface. Now it is a single grouped entry.
        let parsed = parse_search_from_resolv_conf("search a.example.com b.example.com c.net\n");
        assert_eq!(parsed.len(), 3); // parser stays faithful to the file
        assert_eq!(
            format_global_search_domains(&parsed),
            vec!["global: a.example.com, b.example.com, c.net"]
        );
    }

    #[test]
    fn test_global_search_domains_empty_yields_no_line() {
        // No search list -> no entry at all, so the field stays hidden (unchanged behaviour).
        assert!(format_global_search_domains(&[]).is_empty());
        assert!(format_global_search_domains(&parse_search_from_resolv_conf(
            "nameserver 1.1.1.1\n"
        ))
        .is_empty());
    }

    #[test]
    fn test_default_route_interface_selection_matches_routing_table() {
        // The routing table is the source of truth for "default route" — not resolvectl's
        // per-link `Default Route:` flag, which is `yes` for both links in the VPN sample.
        // Real /proc/net/route from the reported machine: only wlp194s0 has dest+mask 0.
        let proc_net_route = concat!(
            "Iface\tDestination\tGateway \tFlags\tRefCnt\tUse\tMetric\tMask\t\tMTU\tWindow\tIRTT\n",
            "wlp194s0\t00000000\t0156A8C0\t0003\t0\t0\t100\t00000000\t0\t0\t0\n",
            "wt0\t00006564\t00000000\t0001\t0\t0\t0\t0000FFFF\t0\t0\t0\n",
            "wlp194s0\t0056A8C0\t00000000\t0001\t0\t0\t100\t00FFFFFF\t0\t0\t0\n",
        );
        assert_eq!(
            parse_proc_net_route(proc_net_route),
            Some("wlp194s0".to_string())
        );
    }
}

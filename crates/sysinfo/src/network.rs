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

/// Returns the configured DNS search domain name.
///
/// Reads the `domain` directive from `/etc/resolv.conf` (takes precedence),
/// falling back to the first entry of the `search` directive. Returns `None`
/// when neither is present or the file is unreadable.
pub fn detect_domain() -> Option<String> {
    #[cfg(any(target_os = "linux", target_os = "macos"))]
    {
        if let Ok(content) = std::fs::read_to_string("/etc/resolv.conf") {
            return parse_domain_from_resolv_conf(&content);
        }
    }
    None
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
        if let Ok(output) = std::process::Command::new("resolvectl")
            .args(["status", "--no-pager"])
            .output()
        {
            if output.status.success() {
                let text = String::from_utf8_lossy(&output.stdout);
                let result = parse_resolvectl_search(&text);
                if !result.is_empty() {
                    return result;
                }
            }
        }
        if let Ok(content) = std::fs::read_to_string("/etc/resolv.conf") {
            return parse_search_from_resolv_conf(&content);
        }
    }
    #[cfg(target_os = "macos")]
    {
        if let Ok(content) = std::fs::read_to_string("/etc/resolv.conf") {
            return parse_search_from_resolv_conf(&content);
        }
    }
    Vec::new()
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

/// Parses `resolvectl status --no-pager` output into per-interface search domain strings.
///
/// Skips routing-only domains (`~.`). Returns entries like `"wlan0: home.local"`.
#[cfg(any(target_os = "linux", test))]
pub fn parse_resolvectl_search(content: &str) -> Vec<String> {
    let mut results = Vec::new();
    let mut current_iface: Option<String> = None;

    for line in content.lines() {
        let trimmed = line.trim();
        // "Link N (ifname)" starts a new interface section
        if trimmed.starts_with("Link ") {
            if let (Some(start), Some(end)) = (trimmed.find('('), trimmed.find(')')) {
                current_iface = Some(trimmed[start + 1..end].to_string());
            }
            continue;
        }
        if let Some(ref iface) = current_iface {
            let domains_str = trimmed
                .strip_prefix("DNS Domain:")
                .or_else(|| trimmed.strip_prefix("DNS Search Domains:"))
                .map(|v| v.trim());
            if let Some(domains) = domains_str {
                // Skip routing-only catch-all domain
                let filtered: Vec<&str> =
                    domains.split_whitespace().filter(|d| *d != "~.").collect();
                if !filtered.is_empty() {
                    results.push(format!("{}: {}", iface, filtered.join(", ")));
                }
            }
        }
    }
    results
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
}

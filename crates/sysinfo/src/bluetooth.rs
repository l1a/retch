// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Bluetooth controller state and connected device detection.

/// Detects Bluetooth power state, adapter hardware, and connected devices.
pub fn detect_bluetooth() -> Option<String> {
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
                                let vendor_name = crate::network::lookup_pci_vendor(&v_clean);
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
        if let Some((power_on, chipset)) = crate::macos_ffi::get_bluetooth_state() {
            let state = if power_on { "On" } else { "Off" };
            let mut info_str = state.to_string();
            if let Some(ch) = chipset {
                info_str.push_str(&format!(" (Apple {})", ch));
            } else {
                info_str.push_str(" (Apple Bluetooth)");
            }
            // Connected device names require Obj-C IOBluetooth; not available via C IOKit.
            if power_on {
                info_str.push_str(" - connected devices unknown");
            }
            Some(info_str)
        } else {
            None
        }
    }

    #[cfg(target_os = "windows")]
    {
        windows_impl::detect()
    }

    #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
    {
        None
    }
}

#[cfg(target_os = "linux")]
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

#[cfg(target_os = "linux")]
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
        if trimmed.starts_with("Bluetooth Power:") || trimmed.starts_with("State:") {
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

/// Formats Bluetooth state into the display string, matching the previous
/// PowerShell-parsing output: `"On (Adapter) - N connected (name1, name2)"`,
/// `"Off (Adapter)"`, or `"Off"`. Connected devices are only shown when powered on.
#[cfg(target_os = "windows")]
fn format_windows_bluetooth(on: bool, adapter: &str, devices: &[String]) -> String {
    let mut s = if on { "On" } else { "Off" }.to_string();
    if !adapter.is_empty() {
        s.push_str(&format!(" ({})", adapter));
    }
    if on {
        s.push_str(&format!(" - {} connected", devices.len()));
        if !devices.is_empty() {
            s.push_str(&format!(" ({})", devices.join(", ")));
        }
    }
    s
}

/// Native Windows Bluetooth detection.
///
/// Replaces the previous PowerShell spawn (`Get-Service bthserv` + two
/// `Get-PnpDevice -Class Bluetooth` queries, ~1.8 s) with native Win32:
/// - Power state: the `bthserv` service state via the Service Control Manager
///   (advapi32) — the same signal the old `Get-Service` check used.
/// - Adapter name + connected devices: the classic `bthprops` Bluetooth API
///   (`BluetoothFindFirstRadio`/`BluetoothGetRadioInfo` and
///   `BluetoothFindFirstDevice` with `fReturnConnected`) — no WinRT.
///
/// Hand-written `extern "system"` FFI matching the crate's style (`win_reg.rs`).
#[cfg(target_os = "windows")]
mod windows_impl {
    use super::format_windows_bluetooth;
    use std::ffi::{c_void, OsStr};
    use std::mem::size_of;
    use std::os::windows::ffi::OsStrExt;
    use std::ptr;

    type Handle = *mut c_void;

    // Service Control Manager (advapi32 — linked by std, like win_reg.rs's Reg* calls).
    const SC_MANAGER_CONNECT: u32 = 0x0001;
    const SERVICE_QUERY_STATUS: u32 = 0x0004;
    const SERVICE_RUNNING: u32 = 4;

    #[repr(C)]
    struct ServiceStatus {
        service_type: u32,
        current_state: u32,
        controls_accepted: u32,
        win32_exit_code: u32,
        service_specific_exit_code: u32,
        check_point: u32,
        wait_hint: u32,
    }

    extern "system" {
        fn OpenSCManagerW(
            machine_name: *const u16,
            database_name: *const u16,
            desired_access: u32,
        ) -> Handle;
        fn OpenServiceW(scm: Handle, service_name: *const u16, desired_access: u32) -> Handle;
        fn QueryServiceStatus(service: Handle, status: *mut ServiceStatus) -> i32;
        fn CloseServiceHandle(handle: Handle) -> i32;
    }

    const BLUETOOTH_MAX_NAME_SIZE: usize = 248;

    #[repr(C)]
    struct DeviceSearchParams {
        dw_size: u32,
        return_authenticated: i32,
        return_remembered: i32,
        return_unknown: i32,
        return_connected: i32,
        issue_inquiry: i32,
        timeout_multiplier: u8,
        h_radio: Handle,
    }

    #[repr(C)]
    struct SystemTime {
        year: u16,
        month: u16,
        day_of_week: u16,
        day: u16,
        hour: u16,
        minute: u16,
        second: u16,
        milliseconds: u16,
    }

    #[repr(C)]
    struct DeviceInfo {
        dw_size: u32,
        address: u64,
        ul_class_of_device: u32,
        f_connected: i32,
        f_remembered: i32,
        f_authenticated: i32,
        st_last_seen: SystemTime,
        st_last_used: SystemTime,
        sz_name: [u16; BLUETOOTH_MAX_NAME_SIZE],
    }

    #[link(name = "bthprops")]
    extern "system" {
        fn BluetoothFindFirstDevice(
            params: *const DeviceSearchParams,
            info: *mut DeviceInfo,
        ) -> Handle;
        fn BluetoothFindNextDevice(find: Handle, info: *mut DeviceInfo) -> i32;
        fn BluetoothFindDeviceClose(find: Handle) -> i32;
    }

    fn wide(s: &str) -> Vec<u16> {
        OsStr::new(s).encode_wide().chain(Some(0)).collect()
    }

    /// Converts a null-terminated wide buffer to a `String`, trimmed; `None` if empty.
    fn wide_to_string(buf: &[u16]) -> Option<String> {
        let len = buf.iter().position(|&c| c == 0).unwrap_or(buf.len());
        let s = String::from_utf16_lossy(&buf[..len]);
        let s = s.trim().to_string();
        if s.is_empty() {
            None
        } else {
            Some(s)
        }
    }

    /// Whether the `bthserv` (Bluetooth Support Service) is running — the power-state
    /// signal the old `Get-Service -Name bthserv` check used.
    fn bthserv_running() -> bool {
        // SAFETY: SCM handles are opened and closed in-scope; QueryServiceStatus writes
        // into a stack-allocated ServiceStatus.
        unsafe {
            let scm = OpenSCManagerW(ptr::null(), ptr::null(), SC_MANAGER_CONNECT);
            if scm.is_null() {
                return false;
            }
            let name = wide("bthserv");
            let svc = OpenServiceW(scm, name.as_ptr(), SERVICE_QUERY_STATUS);
            let mut running = false;
            if !svc.is_null() {
                let mut status: ServiceStatus = std::mem::zeroed();
                if QueryServiceStatus(svc, &mut status) != 0 {
                    running = status.current_state == SERVICE_RUNNING;
                }
                CloseServiceHandle(svc);
            }
            CloseServiceHandle(scm);
            running
        }
    }

    /// Whether a device friendly name looks like the Bluetooth adapter/controller itself
    /// (rather than a paired peripheral). Mirrors the old PowerShell name filter.
    pub(super) fn looks_like_adapter(name: &str) -> bool {
        let l = name.to_ascii_lowercase();
        [
            "adapter",
            "controller",
            "radio",
            "intel",
            "realtek",
            "broadcom",
        ]
        .iter()
        .any(|k| l.contains(k))
    }

    /// The Bluetooth adapter's hardware friendly name, via the shared SetupAPI helper over
    /// the Bluetooth device class (what the old `Get-PnpDevice -Class Bluetooth` reported).
    fn adapter_name() -> Option<String> {
        crate::win_setupapi::present_device_names(&crate::win_setupapi::GUID_DEVCLASS_BLUETOOTH)
            .into_iter()
            .find(|name| looks_like_adapter(name))
    }

    /// Names of currently-connected Bluetooth devices across all radios.
    fn connected_devices() -> Vec<String> {
        let params = DeviceSearchParams {
            dw_size: size_of::<DeviceSearchParams>() as u32,
            return_authenticated: 0,
            return_remembered: 0,
            return_unknown: 0,
            return_connected: 1,
            issue_inquiry: 0, // no scan — only already-known/connected devices
            timeout_multiplier: 0,
            h_radio: ptr::null_mut(), // all radios
        };
        let mut names = Vec::new();
        // SAFETY: info's dw_size is set before each call; the find handle is closed.
        unsafe {
            let mut info: DeviceInfo = std::mem::zeroed();
            info.dw_size = size_of::<DeviceInfo>() as u32;
            let find = BluetoothFindFirstDevice(&params, &mut info);
            if find.is_null() {
                return names;
            }
            loop {
                if info.f_connected != 0 {
                    if let Some(n) = wide_to_string(&info.sz_name) {
                        names.push(n);
                    }
                }
                info.dw_size = size_of::<DeviceInfo>() as u32;
                if BluetoothFindNextDevice(find, &mut info) == 0 {
                    break;
                }
            }
            BluetoothFindDeviceClose(find);
        }
        names
    }

    pub fn detect() -> Option<String> {
        let on = bthserv_running();
        let adapter = adapter_name().unwrap_or_default();
        let devices = if on { connected_devices() } else { Vec::new() };
        Some(format_windows_bluetooth(on, &adapter, &devices))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

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

        let sample_state_on = "Bluetooth:\n\n      State: On\n      Chipset: BCM_4388\n";
        assert_eq!(
            parse_macos_bluetooth(sample_state_on),
            Some("On (Apple BCM_4388) - 0 connected".to_string())
        );
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_format_windows_bluetooth() {
        // On, adapter, two connected devices.
        assert_eq!(
            format_windows_bluetooth(
                true,
                "Intel(R) Wireless Bluetooth(R)",
                &["Sony WH-1000XM4".to_string(), "Logitech MX Master".to_string()],
            ),
            "On (Intel(R) Wireless Bluetooth(R)) - 2 connected (Sony WH-1000XM4, Logitech MX Master)"
        );

        // On, adapter, nothing connected.
        assert_eq!(
            format_windows_bluetooth(true, "MediaTek Bluetooth Adapter", &[]),
            "On (MediaTek Bluetooth Adapter) - 0 connected"
        );

        // Off with a known adapter — no connected suffix when powered off.
        assert_eq!(
            format_windows_bluetooth(false, "MediaTek Bluetooth Adapter", &[]),
            "Off (MediaTek Bluetooth Adapter)"
        );

        // Off, no adapter detected.
        assert_eq!(format_windows_bluetooth(false, "", &[]), "Off");

        // On, no adapter name resolved.
        assert_eq!(
            format_windows_bluetooth(true, "", &["Pixel Buds".to_string()]),
            "On - 1 connected (Pixel Buds)"
        );
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_looks_like_adapter() {
        use super::windows_impl::looks_like_adapter;
        assert!(looks_like_adapter("MediaTek Bluetooth Adapter"));
        assert!(looks_like_adapter("Intel(R) Wireless Bluetooth(R)"));
        assert!(looks_like_adapter("Realtek Bluetooth Controller"));
        assert!(!looks_like_adapter("Ken's Pixel Buds Pro 2"));
        assert!(!looks_like_adapter("MX Anywhere 3S"));
    }
}

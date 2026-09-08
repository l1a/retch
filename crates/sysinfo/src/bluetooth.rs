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
/// - Adapter name: SetupAPI enumeration of `GUID_DEVCLASS_BLUETOOTH`.
/// - Connected devices: SetupAPI again, reading `System.Devices.Connected` per device
///   node. This replaced the classic `bthprops` API (`BluetoothFindFirstDevice` with
///   `fReturnConnected`), which is **BR/EDR-only** and therefore never reported a
///   Bluetooth Low Energy peripheral at all — the field under-counted every LE mouse,
///   keyboard and headset on the machine. Measured on a box with a classic headset and
///   an LE mouse connected, `bthprops` returned only the headset while the device nodes
///   reported both. LE state is not reachable from `bthprops`, and the WinRT route that
///   does expose it (`DeviceInformation` over association endpoints) never completed in
///   testing and cost ~1 s where it did work, against ~11 ms for this enumeration.
///
/// No WinRT: this is the same synchronous SetupAPI already used for the adapter name and
/// for `camera`.
///
/// Hand-written `extern "system"` FFI matching the crate's style (`win_reg.rs`).
#[cfg(target_os = "windows")]
mod windows_impl {
    use super::format_windows_bluetooth;
    use std::ffi::{c_void, OsStr};
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

    fn wide(s: &str) -> Vec<u16> {
        OsStr::new(s).encode_wide().chain(Some(0)).collect()
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

    /// True for a *remote device* instance id, as opposed to a service, an enumerator or
    /// the local radio.
    ///
    /// The Bluetooth setup class holds all of them. Remote devices are `BTHENUM\DEV_…`
    /// (classic) and `BTHLE\DEV_…` (LE); per-profile service nodes are
    /// `BTHENUM\{guid}_…` / `BTHLEDEVICE\{guid}_…`, so the `DEV_` segment is what
    /// separates a device from one of its services.
    pub(super) fn is_remote_device_id(instance_id: &str) -> bool {
        let id = instance_id.to_ascii_uppercase();
        id.starts_with("BTHENUM\\DEV_") || id.starts_with("BTHLE\\DEV_")
    }

    /// The device address embedded in a Bluetooth instance id, uppercased.
    ///
    /// `BTHLE\DEV_F5183CA50C6B\9&1C053637&0&F5183CA50C6B` yields `F5183CA50C6B`. Used to
    /// collapse a dual-mode device, which enumerates once per transport — a phone paired
    /// for both audio and LE appears as both `BTHENUM\DEV_<addr>` and `BTHLE\DEV_<addr>`
    /// and would otherwise be counted twice. De-duplicating on the address rather than
    /// the name is deliberate: two distinct devices may share a name, and collapsing
    /// those would under-count.
    pub(super) fn address_from_instance_id(instance_id: &str) -> Option<String> {
        let id = instance_id.to_ascii_uppercase();
        let rest = id.split_once("\\DEV_")?.1;
        let addr = rest.split('\\').next()?;
        if addr.is_empty() || !addr.chars().all(|c| c.is_ascii_hexdigit()) {
            return None;
        }
        Some(addr.to_string())
    }

    /// Names of currently-connected Bluetooth devices, classic and LE alike.
    fn connected_devices() -> Vec<String> {
        let mut seen = std::collections::HashSet::new();
        let mut names = Vec::new();
        for device in
            crate::win_setupapi::present_devices(&crate::win_setupapi::GUID_DEVCLASS_BLUETOOTH)
        {
            if !is_remote_device_id(&device.instance_id) {
                continue;
            }
            // Only a definite `true` counts: a node that does not expose the property is
            // unknown, and reporting an unknown device as connected would overstate.
            if device.connected != Some(true) {
                continue;
            }
            if let Some(addr) = address_from_instance_id(&device.instance_id) {
                if !seen.insert(addr) {
                    continue;
                }
            }
            if let Some(name) = device.name {
                names.push(name);
            }
        }
        names
    }

    pub fn detect() -> Option<String> {
        let on = bthserv_running();
        let adapter = adapter_name().unwrap_or_default();
        let devices = if on { connected_devices() } else { Vec::new() };
        Some(format_windows_bluetooth(on, &adapter, &devices))
    }

    #[cfg(test)]
    mod layout {
        use std::mem::size_of;

        // `QueryServiceStatus` fills this `#[repr(C)]` buffer by offset — pin the layout
        // so a reorder/padding change can't slip through.
        #[test]
        fn ffi_struct_layout() {
            assert_eq!(size_of::<super::ServiceStatus>(), 28);
        }
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

    /// Instance ids below are verbatim from a live machine, so the discriminator is
    /// pinned against real data rather than an invented shape.
    #[test]
    #[cfg(target_os = "windows")]
    fn test_is_remote_device_id() {
        use super::windows_impl::is_remote_device_id;
        // Real remote devices — classic and LE.
        assert!(is_remote_device_id(
            r"BTHENUM\DEV_7CE9138B5564\9&8E04A68&0&BLUETOOTHDEVICE_7CE9138B5564"
        ));
        assert!(is_remote_device_id(
            r"BTHLE\DEV_F5183CA50C6B\9&1C053637&0&F5183CA50C6B"
        ));
        // Per-profile service nodes sit in the same setup class and must not be counted:
        // an Avrcp transport and a GATT service are not devices.
        assert!(!is_remote_device_id(
            r"BTHENUM\{0000110E-0000-1000-8000-00805F9B34FB}_VID&000100E0_PID&4115\9&8E04A68&0&7CE9138B5564_C00000000"
        ));
        assert!(!is_remote_device_id(
            r"BTHLEDEVICE\{0000180F-0000-1000-8000-00805F9B34FB}_DEV_VID&02046D_PID&B037_REV&0003_D0940BA106B6\A&38AF489E&0&001B"
        ));
        // The radio itself and the enumerators.
        assert!(!is_remote_device_id(
            r"USB\VID_13D3&PID_3602&MI_00\7&2434504C&0&0000"
        ));
        assert!(!is_remote_device_id(r"BTH\MS_BTHLE\8&29FC6E36&0&3"));
    }

    #[test]
    #[cfg(target_os = "windows")]
    fn test_address_from_instance_id() {
        use super::windows_impl::address_from_instance_id;
        // The same physical device on both transports yields one address, which is what
        // makes de-duplicating a dual-mode device possible.
        assert_eq!(
            address_from_instance_id(
                r"BTHENUM\DEV_B0D5FBBB66EA\9&8E04A68&0&BLUETOOTHDEVICE_B0D5FBBB66EA"
            ),
            Some("B0D5FBBB66EA".to_string())
        );
        assert_eq!(
            address_from_instance_id(r"BTHLE\DEV_B0D5FBBB66EA\9&1C053637&0&B0D5FBBB66EA"),
            Some("B0D5FBBB66EA".to_string())
        );
        // Case-insensitive: the two transports disagree on case for the same device.
        assert_eq!(
            address_from_instance_id(r"BTHLE\Dev_f5183ca50c6b\9&1c053637&0&f5183ca50c6b"),
            Some("F5183CA50C6B".to_string())
        );
        // Not an address: a service node's `_DEV_` segment is followed by VID/PID text,
        // which must not be mistaken for one.
        assert_eq!(
            address_from_instance_id(
                r"BTHLEDEVICE\{0000180F-0000-1000-8000-00805F9B34FB}_DEV_VID&02046D_PID&B037_REV&0003_D0940BA106B6\A&38AF489E&0&001B"
            ),
            None
        );
        assert_eq!(
            address_from_instance_id(r"BTH\MS_BTHLE\8&29FC6E36&0&3"),
            None
        );
        // Synthetic — no observed device produces this. It covers the hex guard, which is
        // what stops a malformed id becoming a de-duplication key: a bogus key shared by
        // two real devices would silently drop one of them.
        assert_eq!(
            address_from_instance_id(r"BTHENUM\DEV_NOTANADDRESS\9&1"),
            None
        );
    }
}

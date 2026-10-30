// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Camera and webcam detection.

/// Whether `name` identifies a real user-facing camera rather than an IR/depth sensor
/// or V4L2 ISP/CSI pipeline plumbing node.
///
/// On Intel MIPI camera laptops (e.g. Alder Lake / Raptor Lake / Lunar Lake with IPU6),
/// `/sys/class/video4linux` exposes 32 ISP DMA capture queues (`Intel IPU6 ISYS Capture 0..31`),
/// 4 CSI-2 receiver subdevices (`Intel IPU6 CSI2 0..3`), and an MEI CSI bridge
/// (`Intel IVSC CSI`) alongside the actual I2C camera sensor (`ov01a10 17-0036`).
pub fn is_real_camera(name: &str) -> bool {
    let name_lower = name.to_lowercase();
    !name_lower.contains("infrared")
        && !name_lower.contains("ir camera")
        && !name_lower.contains("integrated i")
        && !name_lower.contains("integrated ir")
        && !name_lower.contains("depth camera")
        && !name_lower.contains("isys capture")
        && !name_lower.contains(" csi2")
        && !name_lower.contains("ivsc csi")
        && !name_lower.starts_with("ipu3-")
}

/// Whether `name` is the Windows synthetic frame-server camera.
///
/// Windows exposes a "Windows Virtual Camera Device" (and similarly-named virtual
/// sources) that register the camera interface but aren't physical capture devices;
/// exclude them so the camera list reflects real hardware. Windows-only so Linux/macOS
/// virtual-camera naming (e.g. OBS) is left untouched.
#[cfg(any(target_os = "windows", test))]
fn is_windows_virtual_camera(name: &str) -> bool {
    name.to_lowercase().contains("virtual camera")
}

/// Parses a Linux `v4l2_i2c_subdev_set_name` string (`"<model> <bus>-<4-hex-addr>"`,
/// e.g. `"ov01a10 17-0036"`) into a human-readable `"<Vendor> <MODEL>"` string
/// (e.g. `"OmniVision OV01A10"`). Returns `None` if `name` does not match the
/// V4L2 I2C subdev naming pattern.
fn format_i2c_sensor_name(name: &str) -> Option<String> {
    let (chip, bus_addr) = name.split_once(' ')?;
    if chip.is_empty()
        || !chip.chars().all(|c| c.is_ascii_alphanumeric() || c == '_')
        || !chip.chars().any(|c| c.is_ascii_digit())
    {
        return None;
    }
    let (bus, addr) = bus_addr.split_once('-')?;
    if bus.is_empty()
        || !bus.chars().all(|c| c.is_ascii_digit())
        || addr.len() != 4
        || !addr.chars().all(|c| c.is_ascii_hexdigit())
    {
        return None;
    }

    let lower = chip.to_ascii_lowercase();
    let vendor = if lower.starts_with("ov") || lower.starts_with("og") || lower.starts_with("os") {
        Some("OmniVision")
    } else if lower.starts_with("imx") {
        Some("Sony")
    } else if lower.starts_with("hi") {
        Some("SK Hynix")
    } else if lower.starts_with("gc") {
        Some("GalaxyCore")
    } else if lower.starts_with("s5k") {
        Some("Samsung")
    } else if lower.starts_with("mt9") || lower.starts_with("ar0") {
        Some("onsemi")
    } else if lower.starts_with("vd5") {
        Some("STMicroelectronics")
    } else if lower.starts_with("hm") {
        Some("Himax")
    } else {
        None
    };

    let model = chip.to_ascii_uppercase();
    match vendor {
        Some(v) => Some(format!("{v} {model}")),
        None => Some(model),
    }
}

pub fn clean_camera_name(name: &str) -> String {
    let trimmed = name.trim();
    if trimmed.starts_with("Integrated Camera:") {
        return "Integrated Camera".to_string();
    }
    if trimmed.starts_with("Integrated Webcam:") {
        return "Integrated Webcam".to_string();
    }
    if let Some(sensor) = format_i2c_sensor_name(trimmed) {
        return sensor;
    }
    trimmed.to_string()
}

/// Formats a single V4L2 camera entry from its raw `name` attribute and optional
/// `device/physical_location/panel` attribute (`"front"` or `"back"`).
pub fn format_v4l2_camera_entry(raw_name: &str, panel: Option<&str>) -> Option<String> {
    let trimmed = raw_name.trim();
    if trimmed.is_empty() || !is_real_camera(trimmed) {
        return None;
    }
    let cleaned = clean_camera_name(trimmed);
    let panel_label = match panel.map(str::trim).unwrap_or("") {
        p if p.eq_ignore_ascii_case("front") => Some("Front"),
        p if p.eq_ignore_ascii_case("back") || p.eq_ignore_ascii_case("rear") => Some("Back"),
        _ => None,
    };
    match panel_label {
        Some(loc) => Some(format!("{cleaned} ({loc})")),
        None => Some(cleaned),
    }
}

/// Filters, cleans, and deduplicates raw V4L2 `(name, panel)` pairs while preserving
/// their input order.
pub fn collect_v4l2_cameras_with_panel<I, S, P>(entries: I) -> Vec<String>
where
    I: IntoIterator<Item = (S, Option<P>)>,
    S: AsRef<str>,
    P: AsRef<str>,
{
    let mut cameras = Vec::new();
    for (raw_name, panel) in entries {
        if let Some(formatted) =
            format_v4l2_camera_entry(raw_name.as_ref(), panel.as_ref().map(P::as_ref))
        {
            if !cameras.contains(&formatted) {
                cameras.push(formatted);
            }
        }
    }
    cameras
}

/// Filters, cleans, and deduplicates raw V4L2 device `name` strings while preserving
/// their input order.
pub fn collect_v4l2_cameras<I, S>(names: I) -> Vec<String>
where
    I: IntoIterator<Item = S>,
    S: AsRef<str>,
{
    collect_v4l2_cameras_with_panel(names.into_iter().map(|n| (n, None::<&str>)))
}

#[cfg(target_os = "macos")]
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

pub(crate) fn detect_camera() -> Vec<String> {
    #[cfg(target_os = "linux")]
    {
        let mut entries: Vec<_> = std::fs::read_dir("/sys/class/video4linux")
            .ok()
            .into_iter()
            .flatten()
            .filter_map(|e| e.ok())
            .collect();
        entries.sort_by_key(|e| e.file_name());
        let raw_entries = entries.into_iter().filter_map(|entry| {
            let dir = entry.path();
            let name = std::fs::read_to_string(dir.join("name")).ok()?;
            let panel = std::fs::read_to_string(dir.join("device/physical_location/panel")).ok();
            Some((name, panel))
        });
        collect_v4l2_cameras_with_panel(raw_entries)
    }

    #[cfg(target_os = "macos")]
    {
        let mut cameras = crate::macos_ffi::get_usb_cameras();
        // Filter out IR/depth cameras that match USB UVC class but aren't real cameras
        cameras.retain(|name| is_real_camera(name));
        cameras
    }

    #[cfg(target_os = "windows")]
    {
        // Enumerate present devices exposing the KSCATEGORY_VIDEO_CAMERA *interface* class,
        // then apply the same real-camera filter, name cleanup, and de-duplication as the
        // other platforms. This deliberately replaces the earlier Camera + Image *setup*-class
        // enumeration: scanners/printers live in the Image (WIA) setup class alongside some
        // real webcams (e.g. a Logitech BRIO), so enumerating that class listed a scanner
        // (e.g. "EPSON ET-3850 Series") as a camera. Only real cameras register the video
        // camera interface, so filtering by it excludes scanners while keeping Image-class
        // webcams.
        let mut cameras = Vec::new();
        for name in crate::win_setupapi::present_interface_device_names(
            &crate::win_setupapi::KSCATEGORY_VIDEO_CAMERA,
        ) {
            if is_real_camera(&name) && !is_windows_virtual_camera(&name) {
                let cleaned = clean_camera_name(&name);
                if !cleaned.is_empty() && !cameras.contains(&cleaned) {
                    cameras.push(cleaned);
                }
            }
        }
        cameras
    }

    #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
    {
        Vec::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_is_real_camera() {
        assert!(!is_real_camera("Infrared Camera"));
        assert!(!is_real_camera("IR Camera"));
        assert!(!is_real_camera("Integrated IR Camera"));
        assert!(!is_real_camera("Depth Camera"));
        assert!(!is_real_camera("Intel IPU6 ISYS Capture 0"));
        assert!(!is_real_camera("Intel IPU6 ISYS Capture 31"));
        assert!(!is_real_camera("Intel IPU6 CSI2 0"));
        assert!(!is_real_camera("Intel IVSC CSI"));
        assert!(!is_real_camera("ipu3-cio2 0"));
        assert!(is_real_camera("FaceTime HD Camera"));
        assert!(is_real_camera("Integrated Camera"));
        assert!(is_real_camera("HD Webcam C920"));
        assert!(is_real_camera("ov01a10 17-0036"));
    }

    #[test]
    fn test_collect_v4l2_cameras_filters_intel_ipu6_pipeline() {
        // Verbatim `/sys/class/video4linux/*` inventory from `rabban`
        // (Dell XPS 13 Plus 9320, 12th Gen Intel Core i7-1260P with IPU6 MIPI camera):
        // 4 CSI-2 receivers, 1 MEI IVSC CSI bridge, 1 I2C camera sensor (`ov01a10 17-0036`
        // with `device/physical_location/panel` = `"front\n"`), and 32 ISP DMA capture queues
        // (`Intel IPU6 ISYS Capture 0..31`).
        let mut entries: Vec<(String, Option<String>)> = vec![
            ("Intel IPU6 CSI2 0\n".to_string(), None),
            ("Intel IPU6 CSI2 1\n".to_string(), None),
            ("Intel IPU6 CSI2 2\n".to_string(), None),
            ("Intel IPU6 CSI2 3\n".to_string(), None),
            ("Intel IVSC CSI\n".to_string(), None),
            ("ov01a10 17-0036\n".to_string(), Some("front\n".to_string())),
        ];
        for i in 0..32 {
            entries.push((format!("Intel IPU6 ISYS Capture {i}\n"), None));
        }

        assert_eq!(
            collect_v4l2_cameras_with_panel(entries),
            vec!["OmniVision OV01A10 (Front)".to_string()]
        );
    }

    #[test]
    fn test_collect_v4l2_cameras_deduplicates_and_cleans_uvc_nodes() {
        // Standard USB UVC cameras register two `videoN` nodes (video capture + metadata)
        // with identical `name` attributes, plus an optional IR pair.
        let names = [
            "Integrated Camera: Integrated C\n",
            "Integrated Camera: Integrated C\n",
            "Integrated IR Camera: Integrate\n",
            "Integrated IR Camera: Integrate\n",
        ];
        assert_eq!(
            collect_v4l2_cameras(names),
            vec!["Integrated Camera".to_string()]
        );
    }

    #[test]
    fn test_is_windows_virtual_camera() {
        // The Windows synthetic frame-server camera is excluded...
        assert!(is_windows_virtual_camera("Windows Virtual Camera Device"));
        assert!(is_windows_virtual_camera("OBS Virtual Camera"));
        // ...while physical webcams are kept.
        assert!(!is_windows_virtual_camera("Logitech BRIO"));
        assert!(!is_windows_virtual_camera("ASUS FHD webcam"));
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
        // V4L2 I2C sensor names (`v4l2_i2c_subdev_set_name`: "<model> <bus>-<4-hex-addr>")
        // are expanded to "<Vendor> <MODEL>":
        assert_eq!(clean_camera_name("ov01a10 17-0036"), "OmniVision OV01A10");
        assert_eq!(clean_camera_name("ov02c10 4-0036"), "OmniVision OV02C10");
        assert_eq!(clean_camera_name("imx258 2-001a"), "Sony IMX258");
        assert_eq!(clean_camera_name("hi556 1-0020"), "SK Hynix HI556");
        assert_eq!(clean_camera_name("gc0310 0-0021"), "GalaxyCore GC0310");
        assert_eq!(clean_camera_name("s5k3m5 3-002d"), "Samsung S5K3M5");
        assert_eq!(clean_camera_name("mt9m114 2-0048"), "onsemi MT9M114");
        assert_eq!(
            clean_camera_name("vd56g3 1-0010"),
            "STMicroelectronics VD56G3"
        );
        assert_eq!(clean_camera_name("hm1092 5-0024"), "Himax HM1092");
        assert_eq!(clean_camera_name("t4ka3 1-0010"), "T4KA3");
        assert_eq!(
            format_v4l2_camera_entry("ov01a10 17-0036", Some("front")).as_deref(),
            Some("OmniVision OV01A10 (Front)")
        );
        assert_eq!(
            format_v4l2_camera_entry("imx258 2-001a", Some("back")).as_deref(),
            Some("Sony IMX258 (Back)")
        );
        assert_eq!(
            format_v4l2_camera_entry("Integrated Camera", Some("unknown")).as_deref(),
            Some("Integrated Camera")
        );
    }

    #[cfg(target_os = "macos")]
    #[test]
    fn test_parse_macos_camera() {
        let sample = "Camera:\n\n    FaceTime HD Camera:\n\n      Model ID: UVC Camera VendorID_1452 ProductID_34068\n      Unique ID: 0x8020000005ac8514\n";
        assert_eq!(
            parse_macos_camera(sample),
            vec!["FaceTime HD Camera".to_string()]
        );
    }
}

// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Camera and webcam detection.

pub fn is_real_camera(name: &str) -> bool {
    let name_lower = name.to_lowercase();
    !name_lower.contains("infrared")
        && !name_lower.contains("ir camera")
        && !name_lower.contains("integrated i")
        && !name_lower.contains("integrated ir")
        && !name_lower.contains("depth camera")
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
        assert!(is_real_camera("FaceTime HD Camera"));
        assert!(is_real_camera("Integrated Camera"));
        assert!(is_real_camera("HD Webcam C920"));
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

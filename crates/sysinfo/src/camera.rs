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

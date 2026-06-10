// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 l1a

//! Audio server and device detection.

/// Detects the active audio server and hardware sound cards.
pub fn detect_audio(sys: &sysinfo::System) -> Option<String> {
    #[cfg(target_os = "linux")]
    {
        let mut server = None;
        for process in sys.processes().values() {
            let name = process.name().to_string_lossy().to_lowercase();
            if name.contains("pipewire") {
                server = Some("PipeWire");
                break;
            } else if name.contains("pulseaudio") {
                server = Some("PulseAudio");
            }
        }
        let server_str = server.unwrap_or("ALSA");

        let mut devices = Vec::new();
        if let Ok(content) = std::fs::read_to_string("/proc/asound/cards") {
            devices = parse_asound_cards(&content, "/proc/asound");
        }

        if !devices.is_empty() {
            Some(format!("{} ({})", server_str, devices.join(", ")))
        } else {
            Some(server_str.to_string())
        }
    }

    #[cfg(target_os = "macos")]
    {
        let _ = sys;
        let mut devices = Vec::new();
        if let Ok(output) = std::process::Command::new("system_profiler")
            .arg("SPAudioDataType")
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                let mut in_devices = false;
                for line in stdout.lines() {
                    let trimmed = line.trim();
                    let indent = line.len() - line.trim_start().len();
                    if trimmed.starts_with("Devices:") {
                        in_devices = true;
                        continue;
                    }
                    if in_devices {
                        if indent <= 4 && !trimmed.is_empty() && !trimmed.starts_with("Devices:") {
                            in_devices = false;
                            continue;
                        }
                        if indent == 8 && trimmed.ends_with(':') {
                            let name = trimmed.trim_end_matches(':').trim().to_string();
                            if !name.is_empty() && !devices.contains(&name) {
                                devices.push(name);
                            }
                        }
                    }
                }
            }
        }

        if !devices.is_empty() {
            Some(format!("CoreAudio ({})", devices.join(", ")))
        } else {
            Some("CoreAudio".to_string())
        }
    }

    #[cfg(target_os = "windows")]
    {
        let _ = sys;
        let mut devices = Vec::new();
        if let Ok(output) = std::process::Command::new("wmic")
            .args(["path", "Win32_SoundDevice", "get", "Name", "/value"])
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                for line in stdout.lines() {
                    let line = line.trim();
                    if line.starts_with("Name=") {
                        let name = line.strip_prefix("Name=").unwrap_or("").trim().to_string();
                        if !name.is_empty() && !devices.contains(&name) {
                            devices.push(name);
                        }
                    }
                }
            }
        }

        if !devices.is_empty() {
            Some(format!("Windows Audio ({})", devices.join(", ")))
        } else {
            Some("Windows Audio".to_string())
        }
    }

    #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
    {
        let _ = sys;
        None
    }
}

#[allow(dead_code)]
pub fn parse_asound_cards(content: &str, asound_dir: &str) -> Vec<String> {
    let mut devices = Vec::new();
    if let Ok(entries) = std::fs::read_dir(asound_dir) {
        for entry in entries.filter_map(|e| e.ok()) {
            let path = entry.path();
            if path.is_dir() {
                let name = entry.file_name().to_string_lossy().to_string();
                if name.starts_with("card") {
                    if let Ok(sub_entries) = std::fs::read_dir(&path) {
                        for sub_entry in sub_entries.filter_map(|se| se.ok()) {
                            let sub_path = sub_entry.path();
                            let sub_name = sub_entry.file_name().to_string_lossy().to_string();
                            if sub_name.starts_with("codec#") {
                                if let Ok(codec_content) = std::fs::read_to_string(&sub_path) {
                                    for line in codec_content.lines() {
                                        if let Some(stripped) = line.strip_prefix("Codec: ") {
                                            let codec_name = stripped.trim().to_string();
                                            if !codec_name.is_empty()
                                                && !devices.contains(&codec_name)
                                            {
                                                devices.push(codec_name);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if devices.is_empty() {
        for line in content.lines() {
            if let Some(idx) = line.find("]: ") {
                let desc = line[idx + 3..].trim();
                let device_name = if let Some(dash_idx) = desc.find(" - ") {
                    desc[dash_idx + 3..].trim()
                } else {
                    desc
                };
                if !device_name.is_empty() && !devices.contains(&device_name.to_string()) {
                    devices.push(device_name.to_string());
                }
            }
        }
    }
    devices
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_asound_cards() {
        let sample = " 0 [PCH            ]: HDA-Intel - HDA Intel PCH\n 1 [NVidia         ]: HDA-Intel - HDA NVIDIA HDMI\n 2 [sofhdadsp      ]: sof-hda-dsp - sof-hda-dsp\n                      DellInc.-Inspiron1676302_in_1-0DR8JD\n";
        let parsed = parse_asound_cards(sample, "/nonexistent");
        assert_eq!(
            parsed,
            vec![
                "HDA Intel PCH".to_string(),
                "HDA NVIDIA HDMI".to_string(),
                "sof-hda-dsp".to_string()
            ]
        );
    }
}

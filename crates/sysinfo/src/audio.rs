// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Audio server and device detection.

/// Detects the active audio server and hardware sound cards.
pub fn detect_audio(sys: &sysinfo::System) -> Option<String> {
    #[cfg(target_os = "linux")]
    {
        // Read from /proc directly rather than sysinfo's process table, which `sys` no
        // longer carries on Linux (loading it cost ~48 ms; see `crate::proc_tree`).
        let _ = sys;
        let server_str = crate::proc_tree::audio_server();

        // Codec names from the HDA bus in sysfs first (v0.20.6); the old path — reading
        // `/proc/asound/card*/codec#*`, then the card list — only when the bus has none.
        let mut devices = crate::timing::timed("audio-codecs", || {
            hda_codec_names(std::path::Path::new("/sys/bus/hdaudio/devices"))
        });
        if devices.is_empty() {
            if let Ok(content) = std::fs::read_to_string("/proc/asound/cards") {
                devices = parse_asound_cards(&content, "/proc/asound");
            }
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
        let devices = crate::macos_ffi::get_audio_device_names();
        if !devices.is_empty() {
            Some(format!("CoreAudio ({})", devices.join(", ")))
        } else {
            Some("CoreAudio".to_string())
        }
    }

    #[cfg(target_os = "windows")]
    {
        let _ = sys;
        // Read sound device names from the media device class in the registry.
        // HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e96c-e325-11ce-bfc1-08002be10318}\<NNNN>
        use crate::win_reg;
        const MEDIA_CLASS: &str =
            "SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e96c-e325-11ce-bfc1-08002be10318}";

        let mut devices = Vec::new();
        for subkey_name in win_reg::enum_reg_subkeys(win_reg::HKEY_LOCAL_MACHINE, MEDIA_CLASS) {
            if subkey_name.eq_ignore_ascii_case("Properties") {
                continue;
            }
            let subkey = format!("{}\\{}", MEDIA_CLASS, subkey_name);
            if let Some(name) =
                win_reg::get_reg_string(win_reg::HKEY_LOCAL_MACHINE, &subkey, "DriverDesc")
            {
                if let Some(clean_name) = normalize_win_audio_device(name.trim()) {
                    if !devices.contains(&clean_name) {
                        devices.push(clean_name);
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

/// HDA codec names — `vendor chip`, exactly the `Codec:` line of
/// `/proc/asound/card*/codec#*` — read from the HDA bus in sysfs.
///
/// The kernel prints that `Codec:` line from the same `vendor_name`/`chip_name` fields the
/// bus exposes, but it regenerates the `codec#` file on every read by querying the codec:
/// ~1.7 ms here, with spikes to ~17 ms, which made `audio` the default mode's slowest probe.
/// The sysfs attributes are the stored strings. Every HDA codec — legacy `hdaudioCxDy` and
/// SOF `ehdaudioXDy` alike — is a device on this bus; a codec with no name is skipped, as the
/// kernel would print `Not Set` for it. Ordered by device name, duplicates dropped.
#[cfg_attr(not(target_os = "linux"), allow(dead_code))]
fn hda_codec_names(bus_devices: &std::path::Path) -> Vec<String> {
    let mut paths: Vec<std::path::PathBuf> = match std::fs::read_dir(bus_devices) {
        Ok(entries) => entries.flatten().map(|e| e.path()).collect(),
        Err(_) => return Vec::new(),
    };
    paths.sort();
    let mut names = Vec::new();
    for path in paths {
        let read = |attr: &str| std::fs::read_to_string(path.join(attr)).unwrap_or_default();
        if let Some(name) = codec_display_name(read("vendor_name").trim(), read("chip_name").trim())
        {
            if !names.contains(&name) {
                names.push(name);
            }
        }
    }
    names
}

/// `vendor chip` as the kernel's `Codec:` line has it, or `None` when either is missing.
#[cfg_attr(not(target_os = "linux"), allow(dead_code))]
fn codec_display_name(vendor: &str, chip: &str) -> Option<String> {
    (!vendor.is_empty() && !chip.is_empty()).then(|| format!("{vendor} {chip}"))
}

/// Codec names from `/proc/asound/card*/codec#*`, falling back to the descriptions in
/// `content` (`/proc/asound/cards`). Since v0.20.6 retch calls this only when the HDA bus
/// in sysfs has no codecs, because reading a `codec#` file queries the hardware.
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

/// Filter out synthetic software proxy audio drivers and normalize root hardware controller names on Windows.
#[allow(dead_code)]
pub fn normalize_win_audio_device(name: &str) -> Option<String> {
    let lower = name.to_lowercase();
    if lower.is_empty()
        || lower.starts_with("microsoft ")
        || lower.contains("trusted audio")
        || lower.contains("a2dp")
        || lower.contains("render audio")
        || lower.contains("capture audio")
        || lower.contains("uaj ")
        || lower.contains("speaker device")
        || lower.contains("microphone device")
    {
        return None;
    }
    if lower.contains("soundwire") {
        return Some("AMD SoundWire Audio".to_string());
    }
    if lower.contains("amd high definition audio") || lower == "amd audio device" {
        return Some("AMD High Definition Audio".to_string());
    }
    if lower.contains("realtek") {
        return Some("Realtek High Definition Audio".to_string());
    }
    if lower.contains("nvidia") {
        return Some("NVIDIA High Definition Audio".to_string());
    }
    if lower.contains("intel") {
        return Some("Intel Smart Sound Technology".to_string());
    }
    if lower.contains("streaming") {
        return None;
    }
    Some(name.to_string())
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

    /// A fake `/sys/bus/hdaudio/devices` tree: one directory per `(device, vendor, chip)`,
    /// with `None` meaning the attribute file is absent.
    fn fake_bus(name: &str, devices: &[(&str, Option<&str>, Option<&str>)]) -> std::path::PathBuf {
        let root = std::env::temp_dir().join(format!("retch-hda-{name}-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&root);
        for (dev, vendor, chip) in devices {
            let dir = root.join(dev);
            std::fs::create_dir_all(&dir).unwrap();
            if let Some(v) = vendor {
                std::fs::write(dir.join("vendor_name"), format!("{v}\n")).unwrap();
            }
            if let Some(c) = chip {
                std::fs::write(dir.join("chip_name"), format!("{c}\n")).unwrap();
            }
        }
        root
    }

    #[test]
    fn hda_codec_names_match_the_proc_codec_line() {
        // Verbatim from arrakis: `/proc/asound/card0/codec#0` says `Codec: ATI R6xx HDMI`,
        // and `/sys/bus/hdaudio/devices/hdaudioC0D0` has vendor `ATI`, chip `R6xx HDMI`.
        let bus = fake_bus("one", &[("hdaudioC0D0", Some("ATI"), Some("R6xx HDMI"))]);
        assert_eq!(hda_codec_names(&bus), vec!["ATI R6xx HDMI".to_string()]);
        let _ = std::fs::remove_dir_all(&bus);
    }

    #[test]
    fn hda_codec_names_orders_dedups_and_skips_unnamed() {
        // Created out of order; an SOF `ehdaudio` device counts like a legacy one; a codec
        // with no chip name is skipped (the kernel prints `Not Set` for it); duplicates once.
        let bus = fake_bus(
            "many",
            &[
                ("hdaudioC1D0", Some("Nvidia"), Some("GPU 9a HDMI/DP")),
                ("ehdaudio0D0", Some("Realtek"), Some("ALC289")),
                ("hdaudioC0D2", Some("Intel"), None),
                ("hdaudioC0D0", Some("Realtek"), Some("ALC289")),
            ],
        );
        assert_eq!(
            hda_codec_names(&bus),
            vec![
                "Realtek ALC289".to_string(),
                "Nvidia GPU 9a HDMI/DP".to_string()
            ]
        );
        let _ = std::fs::remove_dir_all(&bus);
    }

    #[test]
    fn hda_codec_names_is_empty_without_the_bus() {
        assert!(hda_codec_names(std::path::Path::new("/nonexistent/hdaudio")).is_empty());
    }

    #[test]
    fn test_normalize_win_audio_device_filters_synthetic_and_normalizes() {
        assert_eq!(
            normalize_win_audio_device("Microsoft Streaming Service Proxy"),
            None
        );
        assert_eq!(
            normalize_win_audio_device("Microsoft Bluetooth A2dp Source"),
            None
        );
        assert_eq!(
            normalize_win_audio_device("AMD SoundWire Audio Streaming Speaker Device"),
            None
        );
        assert_eq!(
            normalize_win_audio_device("AMD SoundWire Audio Streaming Device"),
            Some("AMD SoundWire Audio".to_string())
        );
        assert_eq!(
            normalize_win_audio_device("USB Audio Device"),
            Some("USB Audio Device".to_string())
        );
        assert_eq!(
            normalize_win_audio_device("AMD High Definition Audio Device"),
            Some("AMD High Definition Audio".to_string())
        );
    }
}

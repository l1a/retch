// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Weather information via wttr.in.

pub(crate) fn detect_weather(location: Option<&str>) -> Option<String> {
    let url = match location {
        Some(loc) if !loc.is_empty() => format!("https://wttr.in/{}?format=3", loc),
        _ => "https://wttr.in/?format=3".to_string(),
    };

    let output = std::process::Command::new("curl")
        .args(["-s", "--max-time", "3", &url])
        .output()
        .ok()?;

    let text = String::from_utf8(output.stdout).ok()?;
    let trimmed = text.trim();
    if trimmed.is_empty() || !output.status.success() {
        return None;
    }
    Some(trimmed.to_string())
}

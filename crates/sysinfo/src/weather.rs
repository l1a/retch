// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Weather information via wttr.in.

pub(crate) fn detect_weather() -> Option<String> {
    let output = std::process::Command::new("curl")
        .args(["-s", "--max-time", "3", "https://wttr.in/?format=3"])
        .output()
        .ok()?;

    let text = String::from_utf8(output.stdout).ok()?;
    let trimmed = text.trim();
    if trimmed.is_empty() || !output.status.success() {
        return None;
    }
    Some(trimmed.to_string())
}

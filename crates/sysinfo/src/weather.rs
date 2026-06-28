// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Weather information via wttr.in.

pub(crate) fn detect_weather(location: Option<&str>) -> Option<String> {
    let url = match location {
        Some(loc) if !loc.is_empty() => {
            format!("https://wttr.in/{}?format=3", url_encode_location(loc))
        }
        _ => "https://wttr.in/?format=3".to_string(),
    };

    let output = std::process::Command::new("curl")
        .args(["-sf", "--max-time", "3", &url])
        .output()
        .ok()?;

    if !output.status.success() {
        return location.map(|loc| format!("Unknown location: \"{}\"", loc));
    }
    let text = String::from_utf8(output.stdout).ok()?;
    let trimmed = text.trim();
    if trimmed.is_empty() {
        return None;
    }
    Some(trimmed.to_string())
}

/// Encodes a location string for use in a wttr.in URL path segment.
fn url_encode_location(loc: &str) -> String {
    loc.chars()
        .map(|c| match c {
            ' ' => "+".to_string(),
            ',' => "%2C".to_string(),
            c if c.is_ascii_alphanumeric() || matches!(c, '-' | '.' | '_' | '~' | '+') => {
                c.to_string()
            }
            c => format!("%{:02X}", c as u32),
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_url_encode_location() {
        assert_eq!(url_encode_location("London"), "London");
        assert_eq!(
            url_encode_location("Thousand Oaks, CA"),
            "Thousand+Oaks%2C+CA"
        );
        assert_eq!(url_encode_location("New York"), "New+York");
        assert_eq!(url_encode_location("48.8566,2.3522"), "48.8566%2C2.3522");
        assert_eq!(url_encode_location("93426"), "93426");
    }
}

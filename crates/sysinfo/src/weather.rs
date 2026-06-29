// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Weather information via Open-Meteo (forecast) and Open-Meteo geocoding / ipinfo.io.

/// Temperature unit for weather display.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub enum WeatherUnit {
    #[default]
    Fahrenheit,
    Celsius,
}

impl std::str::FromStr for WeatherUnit {
    type Err = std::convert::Infallible;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(match s.to_ascii_lowercase().as_str() {
            "celsius" | "c" => Self::Celsius,
            _ => Self::Fahrenheit,
        })
    }
}

impl WeatherUnit {
    fn api_param(self) -> &'static str {
        match self {
            Self::Fahrenheit => "fahrenheit",
            Self::Celsius => "celsius",
        }
    }

    fn symbol(self) -> &'static str {
        match self {
            Self::Fahrenheit => "°F",
            Self::Celsius => "°C",
        }
    }
}

struct GeoPoint {
    lat: f64,
    lon: f64,
    display: String,
}

pub(crate) fn detect_weather(location: Option<&str>, unit: WeatherUnit) -> Option<String> {
    let geo = match location {
        Some(loc) if !loc.is_empty() => resolve_location(loc)?,
        _ => geolocate_ip()?,
    };
    let (temp, wmo_code) = fetch_open_meteo(geo.lat, geo.lon, unit)?;
    let emoji = wmo_to_emoji(wmo_code);
    Some(format!(
        "{}: {} {:.0}{}",
        geo.display,
        emoji,
        temp,
        unit.symbol()
    ))
}

/// Parse a raw "lat,lon" coordinate string, returning `None` if not in that form.
fn parse_coords(s: &str) -> Option<GeoPoint> {
    let s = s.trim();
    let comma = s.find(',')?;
    let lat: f64 = s[..comma].trim().parse().ok()?;
    let lon: f64 = s[comma + 1..].trim().parse().ok()?;
    if !(-90.0..=90.0).contains(&lat) || !(-180.0..=180.0).contains(&lon) {
        return None;
    }
    Some(GeoPoint {
        lat,
        lon,
        display: s.to_string(),
    })
}

fn resolve_location(loc: &str) -> Option<GeoPoint> {
    if let Some(coords) = parse_coords(loc) {
        return Some(coords);
    }
    geocode_open_meteo(loc)
}

/// Geocode a city/place name using the Open-Meteo geocoding API.
///
/// The API's `name` parameter only matches city names, so "City, State" inputs are split
/// on the first comma and only the city part is sent.
fn geocode_open_meteo(loc: &str) -> Option<GeoPoint> {
    let city_part = loc.split(',').next().unwrap_or(loc).trim();
    let encoded = url_encode(city_part);
    let url = format!(
        "https://geocoding-api.open-meteo.com/v1/search?name={}&count=1&language=en&format=json",
        encoded
    );
    let body = curl_get(&url)?;
    let v: serde_json::Value = serde_json::from_str(&body).ok()?;
    let result = v.get("results")?.get(0)?;

    let lat = result.get("latitude")?.as_f64()?;
    let lon = result.get("longitude")?.as_f64()?;
    let name = result.get("name")?.as_str().unwrap_or(loc);
    let country_code = result
        .get("country_code")
        .and_then(|v| v.as_str())
        .unwrap_or("");
    let admin1 = result.get("admin1").and_then(|v| v.as_str()).unwrap_or("");
    let country = result.get("country").and_then(|v| v.as_str()).unwrap_or("");

    let display = if !admin1.is_empty() && country_code == "US" {
        format!("{}, {}", name, admin1)
    } else if !country.is_empty() {
        format!("{}, {}", name, country)
    } else {
        name.to_string()
    };

    Some(GeoPoint { lat, lon, display })
}

/// Determine location from the outbound IP address via ipinfo.io.
fn geolocate_ip() -> Option<GeoPoint> {
    let body = curl_get("https://ipinfo.io/json")?;
    let v: serde_json::Value = serde_json::from_str(&body).ok()?;

    let loc_str = v.get("loc")?.as_str()?;
    let comma = loc_str.find(',')?;
    let lat: f64 = loc_str[..comma].parse().ok()?;
    let lon: f64 = loc_str[comma + 1..].parse().ok()?;

    let city = v.get("city").and_then(|v| v.as_str()).unwrap_or("");
    let region = v.get("region").and_then(|v| v.as_str()).unwrap_or("");
    let country = v.get("country").and_then(|v| v.as_str()).unwrap_or("");

    let display = match (city.is_empty(), region.is_empty(), country == "US") {
        (false, false, true) => format!("{}, {}", city, region),
        (false, _, false) if !country.is_empty() => format!("{}, {}", city, country),
        (false, _, _) => city.to_string(),
        _ => loc_str.to_string(),
    };

    Some(GeoPoint { lat, lon, display })
}

/// Fetch current temperature and WMO weather code from Open-Meteo.
fn fetch_open_meteo(lat: f64, lon: f64, unit: WeatherUnit) -> Option<(f64, u16)> {
    let url = format!(
        "https://api.open-meteo.com/v1/forecast?latitude={:.5}&longitude={:.5}&current=temperature_2m,weather_code&temperature_unit={}",
        lat, lon, unit.api_param()
    );
    let body = curl_get(&url)?;
    let v: serde_json::Value = serde_json::from_str(&body).ok()?;
    let current = v.get("current")?;
    let temp = current.get("temperature_2m")?.as_f64()?;
    let wmo = current.get("weather_code")?.as_u64()? as u16;
    Some((temp, wmo))
}

fn curl_get(url: &str) -> Option<String> {
    let out = std::process::Command::new("curl")
        .args(["-sf", "--max-time", "4", url])
        .output()
        .ok()?;
    if !out.status.success() {
        return None;
    }
    String::from_utf8(out.stdout).ok()
}

fn wmo_to_emoji(code: u16) -> &'static str {
    match code {
        0 => "☀️",
        1 => "🌤️",
        2 => "⛅",
        3 => "☁️",
        45 | 48 => "🌫️",
        51 | 53 | 55 => "🌦️",
        56 | 57 | 61..=67 | 80 | 81 => "🌧️",
        82 | 95..=99 => "⛈️",
        71..=77 | 85 | 86 => "🌨️",
        _ => "🌡️",
    }
}

fn url_encode(s: &str) -> String {
    s.chars()
        .map(|c| match c {
            ' ' => "+".to_string(),
            ',' => "%2C".to_string(),
            c if c.is_ascii_alphanumeric() || matches!(c, '-' | '.' | '_' | '~') => c.to_string(),
            c => format!("%{:02X}", c as u32),
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_url_encode() {
        assert_eq!(url_encode("London"), "London");
        assert_eq!(url_encode("Thousand Oaks, CA"), "Thousand+Oaks%2C+CA");
        assert_eq!(url_encode("New York"), "New+York");
        assert_eq!(url_encode("93426"), "93426");
    }

    #[test]
    fn test_parse_coords() {
        let g = parse_coords("34.42,-119.70").unwrap();
        assert!((g.lat - 34.42).abs() < 1e-6);
        assert!((g.lon - -119.70).abs() < 1e-6);

        assert!(parse_coords("Santa Barbara").is_none());
        assert!(parse_coords("93101").is_none());
    }

    #[test]
    fn test_weather_unit_from_str() {
        assert_eq!(
            "celsius".parse::<WeatherUnit>().unwrap(),
            WeatherUnit::Celsius
        );
        assert_eq!("C".parse::<WeatherUnit>().unwrap(), WeatherUnit::Celsius);
        assert_eq!(
            "fahrenheit".parse::<WeatherUnit>().unwrap(),
            WeatherUnit::Fahrenheit
        );
        assert_eq!(
            "nonsense".parse::<WeatherUnit>().unwrap(),
            WeatherUnit::Fahrenheit
        );
    }

    #[test]
    fn test_wmo_to_emoji() {
        assert_eq!(wmo_to_emoji(0), "☀️");
        assert_eq!(wmo_to_emoji(3), "☁️");
        assert_eq!(wmo_to_emoji(95), "⛈️");
    }
}

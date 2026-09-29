// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Weather information via [wttr.in](http://wttr.in), in one plain-HTTP request.
//!
//! Until v0.20.0 this took two requests in sequence: ipinfo.io to turn the caller's IP into
//! coordinates, then Open-Meteo for the forecast. Both weather hosts sit in Germany, so from
//! the US each round trip was ~180 ms and the pair cost ~870 ms — most of `--full`'s runtime.
//! wttr.in geolocates the caller itself and answers a compact custom format, so a single
//! request replaces both.
//!
//! **Plain HTTP since v0.20.10**, as fastfetch does. v0.20.0–v0.20.9 used HTTPS, and the TLS
//! 1.3 handshake costs one extra round trip to a server ~190 ms away: 570 vs 373 ms median
//! on arrakis, which alone kept `--full` behind fastfetch. The trade-off is that the request,
//! and the approximate location in the reply, travel unencrypted. Because anyone on the path
//! can also rewrite the reply, `parse_wttr` rejects any response containing a control
//! character, so a tampered reply cannot put terminal escape sequences on the screen.

/// Temperature unit for weather display.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub enum WeatherUnit {
    /// Degrees Fahrenheit (default).
    #[default]
    Fahrenheit,
    /// Degrees Celsius.
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
    /// wttr.in's unit switch: `u` for USCS (°F), `m` for metric (°C).
    fn wttr_flag(self) -> &'static str {
        match self {
            Self::Fahrenheit => "u",
            Self::Celsius => "m",
        }
    }

    fn symbol(self) -> &'static str {
        match self {
            Self::Fahrenheit => "°F",
            Self::Celsius => "°C",
        }
    }
}

/// Fetch current weather for `location` and return a formatted string like
/// `"Santa Barbara, California: ☀️ 67°F"`.
///
/// If `location` is `None` or empty, wttr.in locates the caller by IP address. Otherwise
/// it accepts a city (`London`, `Thousand Oaks, CA`), a US ZIP code, a three-letter airport
/// code, `lat,lon` coordinates, or `~landmark`, and the location is shown as given.
/// Returns `None` on any network failure, unknown location (wttr.in answers HTTP 500, which
/// `curl -f` treats as failure), or unexpected response — weather is best-effort and must
/// never block or garble the rest of the output.
pub(crate) fn detect_weather(location: Option<&str>, unit: WeatherUnit) -> Option<String> {
    let location = location.map(str::trim).filter(|l| !l.is_empty());
    let body = curl_get(&wttr_url(location, unit))?;
    parse_wttr(&body, unit, location.is_some())
}

/// The one request: location (empty for IP-based), then `%l` location, `%c` condition
/// emoji and `%t` temperature, `|`-separated, in the requested unit.
fn wttr_url(location: Option<&str>, unit: WeatherUnit) -> String {
    format!(
        "http://wttr.in/{}?format=%l|%c|%t&{}",
        location.map(url_encode).unwrap_or_default(),
        unit.wttr_flag()
    )
}

/// Parses `location|emoji |+67°F` into `location: emoji 67°F`.
///
/// Strict on purpose: anything that is not exactly three fields with a temperature in the
/// requested unit is rejected, so an error or rate-limit page served with HTTP 200 can
/// never be printed as weather.
///
/// A body containing any control character is rejected whole. The request is plain HTTP, so
/// the reply can be rewritten in transit, and the location field is printed verbatim: an
/// `ESC` there would reach the terminal. Real replies never contain one (the emoji are a
/// symbol plus U+FE0F, a combining mark), and a reply that does has been tampered with, so
/// none of it is trusted rather than stripping the escapes and showing the rest.
fn parse_wttr(body: &str, unit: WeatherUnit, overridden: bool) -> Option<String> {
    let body = body.trim();
    if body.chars().any(char::is_control) {
        return None;
    }
    let mut fields = body.split('|');
    let (loc, emoji, temp) = (fields.next()?, fields.next()?, fields.next()?);
    if fields.next().is_some() {
        return None;
    }
    let loc = loc.trim();
    if loc.is_empty() {
        return None;
    }
    let degrees: f64 = temp
        .trim()
        .strip_suffix(unit.symbol())?
        .trim_start_matches('+')
        .parse()
        .ok()?;
    let emoji = match emoji.trim() {
        "" => "🌡️",
        e => e,
    };
    let display = if overridden {
        loc.to_string()
    } else {
        shorten_location(loc)
    };
    Some(format!(
        "{}: {} {:.0}{}",
        display,
        emoji,
        degrees,
        unit.symbol()
    ))
}

/// wttr.in names an IP-derived location `City, Region, Country`. retch has always shown
/// `City, Region` for the US and `City, Country` elsewhere, so keep that.
fn shorten_location(loc: &str) -> String {
    let parts: Vec<&str> = loc.split(", ").collect();
    match parts.as_slice() {
        [city, region, .., country] if is_us(country) => format!("{city}, {region}"),
        [city, .., country] if parts.len() >= 2 => format!("{city}, {country}"),
        _ => loc.to_string(),
    }
}

fn is_us(country: &str) -> bool {
    matches!(
        country,
        "US" | "USA" | "United States" | "United States of America"
    )
}

/// Run `curl -sf --max-time 4 <url>` and return stdout on success, `None` on any failure.
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

/// Percent-encodes a location for the URL path. Spaces become `+`, which wttr.in accepts.
///
/// Non-ASCII characters are encoded as their UTF-8 bytes. Before v0.20.0 this encoded the
/// Unicode code point instead (`ã` as `%E3`, which is not valid UTF-8), so a name like
/// `São Paulo` never reached any weather service intact.
fn url_encode(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    for b in s.bytes() {
        match b {
            b' ' => out.push('+'),
            b if b.is_ascii_alphanumeric() || matches!(b, b'-' | b'.' | b'_' | b'~') => {
                out.push(b as char)
            }
            b => out.push_str(&format!("%{b:02X}")),
        }
    }
    out
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
        assert_eq!(url_encode("34.42,-119.70"), "34.42%2C-119.70");
        assert_eq!(url_encode("~Eiffel Tower"), "~Eiffel+Tower");
    }

    #[test]
    fn url_encode_uses_utf8_bytes_not_code_points() {
        // `ã` is U+00E3; its UTF-8 form is C3 A3. The old encoder emitted `%E3`.
        assert_eq!(url_encode("São Paulo"), "S%C3%A3o+Paulo");
        assert_eq!(url_encode("Zürich"), "Z%C3%BCrich");
    }

    #[test]
    fn wttr_url_carries_location_and_unit() {
        assert_eq!(
            wttr_url(None, WeatherUnit::Fahrenheit),
            "http://wttr.in/?format=%l|%c|%t&u"
        );
        assert_eq!(
            wttr_url(Some("Thousand Oaks, CA"), WeatherUnit::Celsius),
            "http://wttr.in/Thousand+Oaks%2C+CA?format=%l|%c|%t&m"
        );
    }

    #[test]
    fn rejects_a_reply_carrying_control_characters() {
        // Plain HTTP can be rewritten in transit, and the location is printed verbatim.
        let f = WeatherUnit::Fahrenheit;
        assert_eq!(
            parse_wttr("\u{1b}]0;pwned\u{7}X|☀️ |+5°F", f, true),
            None,
            "OSC title escape in the location"
        );
        assert_eq!(
            parse_wttr("X\u{1b}[2J|☀️ |+5°F", f, true),
            None,
            "CSI clear-screen in the location"
        );
        assert_eq!(parse_wttr("X|☀️\u{8}|+5°F", f, true), None, "backspace");
        assert_eq!(
            parse_wttr("Los Angeles, California,\rUS|☀️ |+82°F", f, false),
            None,
            "carriage return mid-line"
        );
    }

    #[test]
    fn real_weather_emoji_are_not_control_characters() {
        // Each is a symbol plus U+FE0F (a combining mark); none may trip the control check.
        // Verbatim from wttr.in replies: the trailing newline is trimmed before the check.
        for emoji in ["☀️", "☁️", "⛅️", "🌦️", "🌧️", "⛈️", "🌨️", "❄️", "🌫️", "🌩️"]
        {
            let reply = format!("Los Angeles, California, US|{emoji} |+82°F\n");
            assert_eq!(
                parse_wttr(&reply, WeatherUnit::Fahrenheit, false),
                Some(format!("Los Angeles, California: {emoji} 82°F")),
                "{emoji}"
            );
        }
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

    // Fixtures below are verbatim wttr.in responses captured 2026-09-28.

    #[test]
    fn parses_an_ip_located_us_response() {
        assert_eq!(
            parse_wttr(
                "Newbury Park, California, US|☁️ |+69°F",
                WeatherUnit::Fahrenheit,
                false
            )
            .as_deref(),
            Some("Newbury Park, California: ☁️ 69°F")
        );
    }

    #[test]
    fn parses_celsius_and_negative_temperatures() {
        assert_eq!(
            parse_wttr("London|☁️ |+15°C", WeatherUnit::Celsius, true).as_deref(),
            Some("London: ☁️ 15°C")
        );
        assert_eq!(
            parse_wttr("Nuuk|🌨️ |-7°C\n", WeatherUnit::Celsius, true).as_deref(),
            Some("Nuuk: 🌨️ -7°C")
        );
    }

    #[test]
    fn an_override_is_shown_as_given() {
        // wttr.in echoes the query; a ZIP, airport code or coordinates stay as typed.
        assert_eq!(
            parse_wttr("93426|☀️ |+58°F", WeatherUnit::Fahrenheit, true).as_deref(),
            Some("93426: ☀️ 58°F")
        );
        assert_eq!(
            parse_wttr("34.42,-119.70|☀️ |+63°F", WeatherUnit::Fahrenheit, true).as_deref(),
            Some("34.42,-119.70: ☀️ 63°F")
        );
        // Three comma-separated parts would be shortened if this were an IP-derived name;
        // typed by the user, it must survive intact.
        assert_eq!(
            parse_wttr(
                "Paris, Ile-de-France, France|☀️ |+17°C",
                WeatherUnit::Celsius,
                true
            )
            .as_deref(),
            Some("Paris, Ile-de-France, France: ☀️ 17°C")
        );
    }

    #[test]
    fn rejects_anything_that_is_not_a_weather_line() {
        let f = WeatherUnit::Fahrenheit;
        // wttr.in's unknown-location body (it comes with HTTP 500, but must not parse
        // even if some proxy passed it through as a 200).
        assert_eq!(
            parse_wttr(
                "location not found: upstream error: opencage: invalid response",
                f,
                true
            ),
            None
        );
        assert_eq!(parse_wttr("", f, false), None);
        assert_eq!(parse_wttr("a|b", f, false), None, "too few fields");
        assert_eq!(parse_wttr("a|b|+5°F|x", f, false), None, "too many fields");
        assert_eq!(parse_wttr("|☀️ |+5°F", f, false), None, "no location");
        assert_eq!(parse_wttr("X|☀️ |warm", f, false), None, "no number");
        assert_eq!(
            parse_wttr("X|☀️ |+5°C", f, false),
            None,
            "wrong unit for the request"
        );
    }

    #[test]
    fn a_missing_emoji_falls_back_to_a_thermometer() {
        assert_eq!(
            parse_wttr("X| |+5°F", WeatherUnit::Fahrenheit, true).as_deref(),
            Some("X: 🌡️ 5°F")
        );
    }

    #[test]
    fn shorten_location_keeps_retchs_long_standing_display() {
        assert_eq!(
            shorten_location("Santa Barbara, California, US"),
            "Santa Barbara, California"
        );
        assert_eq!(
            shorten_location("London, City of London, United Kingdom"),
            "London, United Kingdom"
        );
        assert_eq!(shorten_location("Paris, France"), "Paris, France");
        assert_eq!(shorten_location("Somewhere"), "Somewhere");
    }
}

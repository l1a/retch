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
    let body = fetch_wttr_body(location, unit)?;
    parse_wttr(&body, unit, location.is_some())
}

/// Path and query string for a wttr.in request.
fn wttr_path_and_query(location: Option<&str>, unit: WeatherUnit) -> String {
    format!(
        "/{}?format=%l|%c|%t&{}",
        location.map(url_encode).unwrap_or_default(),
        unit.wttr_flag()
    )
}

/// The one request: location (empty for IP-based), then `%l` location, `%c` condition
/// emoji and `%t` temperature, `|`-separated, in the requested unit.
fn wttr_url(location: Option<&str>, unit: WeatherUnit) -> String {
    format!("http://wttr.in{}", wttr_path_and_query(location, unit))
}

const WEATHER_TIMEOUT: std::time::Duration = std::time::Duration::from_secs(4);
const WEATHER_CONNECT_BUDGET: std::time::Duration = std::time::Duration::from_secs(2);
const WEATHER_CONNECT_ATTEMPT_CAP: std::time::Duration = std::time::Duration::from_secs(1);

/// Fetches the raw wttr.in response body over plain HTTP/1.1 in-process, falling back to
/// `curl` only when a proxy is configured or a direct TCP attempt fails/redirects, all within
/// a single [`WEATHER_TIMEOUT`] wall-clock budget.
fn fetch_wttr_body(location: Option<&str>, unit: WeatherUnit) -> Option<String> {
    let deadline = std::time::Instant::now() + WEATHER_TIMEOUT;
    let path_and_query = wttr_path_and_query(location, unit);
    match http_get_wttr(&path_and_query, deadline) {
        HttpOutcome::Ok(body) => Some(body),
        HttpOutcome::HttpError => None,
        HttpOutcome::Fallback => {
            let remaining = deadline.saturating_duration_since(std::time::Instant::now());
            let max_secs = remaining_curl_timeout_secs(remaining)?;
            curl_get(&wttr_url(location, unit), max_secs)
        }
    }
}

/// Converts remaining wall-clock budget into an integer `--max-time` argument for `curl`,
/// returning `None` once under 1 second remains so total latency stays within [`WEATHER_TIMEOUT`].
fn remaining_curl_timeout_secs(remaining: std::time::Duration) -> Option<u64> {
    if remaining >= std::time::Duration::from_millis(3900) {
        Some(WEATHER_TIMEOUT.as_secs())
    } else {
        let secs = remaining.as_secs();
        (secs >= 1).then_some(secs)
    }
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

/// Result of an in-process HTTP/1.1 `GET` attempt to `wttr.in`.
#[derive(Debug, PartialEq, Eq)]
enum HttpOutcome {
    /// HTTP 200 with decoded response body.
    Ok(String),
    /// Server returned an authoritative HTTP error (4xx/5xx); do not retry with `curl`.
    HttpError,
    /// Proxy configured, redirect received, or transport/framing failure; fall back to `curl`.
    Fallback,
}

/// Returns `true` if a standard HTTP proxy environment variable is set and non-empty.
fn has_http_proxy() -> bool {
    ["http_proxy", "HTTP_PROXY", "all_proxy", "ALL_PROXY"]
        .into_iter()
        .any(|k| std::env::var_os(k).is_some_and(|v| !v.is_empty()))
}

/// Runs a blocking resolver closure on a detached helper thread so a stalled `getaddrinfo`
/// cannot block the caller past `timeout`.
fn resolve_with_timeout<F>(
    timeout: std::time::Duration,
    resolver: F,
) -> Option<Vec<std::net::SocketAddr>>
where
    F: FnOnce() -> Option<Vec<std::net::SocketAddr>> + Send + 'static,
{
    if timeout.is_zero() {
        return None;
    }
    let (tx, rx) = std::sync::mpsc::sync_channel(1);
    std::thread::spawn(move || {
        let _ = tx.send(resolver());
    });
    rx.recv_timeout(timeout).ok().flatten()
}

/// Sends a single plain HTTP/1.1 `GET` request to `wttr.in:80` over a direct `TcpStream`
/// with `TCP_NODELAY` enabled, bounded by `deadline`, avoiding `curl` fork+exec overhead.
fn http_get_wttr(path_and_query: &str, deadline: std::time::Instant) -> HttpOutcome {
    use std::net::ToSocketAddrs;

    if has_http_proxy() {
        return HttpOutcome::Fallback;
    }

    let now = std::time::Instant::now();
    let connect_deadline = deadline.min(now + WEATHER_CONNECT_BUDGET);
    let dns_budget = connect_deadline.saturating_duration_since(now);
    let Some(mut addrs) = resolve_with_timeout(dns_budget, || {
        ("wttr.in", 80)
            .to_socket_addrs()
            .ok()
            .map(Iterator::collect)
    }) else {
        return HttpOutcome::Fallback;
    };
    if addrs.is_empty() {
        return HttpOutcome::Fallback;
    }
    // Try IPv4 endpoints before IPv6 so broken IPv6 routing does not stall connect_timeout.
    addrs.sort_by_key(|a| u8::from(a.is_ipv6()));

    http_get_wttr_addrs("wttr.in", path_and_query, addrs, connect_deadline, deadline)
}

/// Connects to the first reachable address in `addrs` before `connect_deadline`, then sends and
/// parses one HTTP/1.1 `GET` request before `deadline`.
fn http_get_wttr_addrs(
    host: &str,
    path_and_query: &str,
    addrs: Vec<std::net::SocketAddr>,
    connect_deadline: std::time::Instant,
    deadline: std::time::Instant,
) -> HttpOutcome {
    use std::net::TcpStream;

    let mut stream = None;
    for addr in addrs.into_iter().take(4) {
        let remaining = connect_deadline.saturating_duration_since(std::time::Instant::now());
        if remaining.is_zero() {
            break;
        }
        if let Ok(s) = TcpStream::connect_timeout(&addr, remaining.min(WEATHER_CONNECT_ATTEMPT_CAP))
        {
            stream = Some(s);
            break;
        }
    }
    let Some(stream) = stream else {
        return HttpOutcome::Fallback;
    };

    read_http_response(stream, host, path_and_query, deadline)
}

/// Writes the HTTP/1.1 `GET` request on `stream` and reads until completion, clean EOF, or error.
///
/// Any transport error or deadline expiration while reading returns `HttpOutcome::Fallback`
/// unconditionally so truncated unframed responses are never mistaken for complete bodies.
fn read_http_response(
    mut stream: std::net::TcpStream,
    host: &str,
    path_and_query: &str,
    deadline: std::time::Instant,
) -> HttpOutcome {
    use std::io::{Read, Write};

    let remaining = deadline.saturating_duration_since(std::time::Instant::now());
    if remaining.is_zero() {
        return HttpOutcome::Fallback;
    }
    let _ = stream.set_nodelay(true);
    let _ = stream.set_write_timeout(Some(remaining));

    let request = format!(
        "GET {path_and_query} HTTP/1.1\r\nHost: {host}\r\nUser-Agent: curl/8.0\r\nAccept: */*\r\nConnection: close\r\n\r\n"
    );
    if stream.write_all(request.as_bytes()).is_err() {
        return HttpOutcome::Fallback;
    }

    let mut raw = Vec::with_capacity(512);
    let mut chunk = [0u8; 1024];
    loop {
        let remaining = deadline.saturating_duration_since(std::time::Instant::now());
        if remaining.is_zero() {
            return HttpOutcome::Fallback;
        }
        let _ = stream.set_read_timeout(Some(remaining));
        match stream.read(&mut chunk) {
            Ok(0) => break,
            Ok(n) => {
                raw.extend_from_slice(&chunk[..n]);
                if raw.len() > 64 * 1024 {
                    return HttpOutcome::Fallback;
                }
                if is_http_response_complete(&raw) {
                    break;
                }
            }
            Err(ref e) if e.kind() == std::io::ErrorKind::Interrupted => continue,
            Err(_) => return HttpOutcome::Fallback,
        }
    }

    parse_http_response(&raw)
}

/// Finds the end of the HTTP header block and splits `(header_bytes, body_bytes)`.
fn split_http_headers(raw: &[u8]) -> Option<(&[u8], &[u8])> {
    raw.windows(4)
        .position(|w| w == b"\r\n\r\n")
        .map(|pos| (&raw[..pos], &raw[pos + 4..]))
}

/// Returns `true` when headers have arrived and either `Content-Length` bytes or the
/// terminating chunk (`0\r\n\r\n`) is already present in `raw`.
fn is_http_response_complete(raw: &[u8]) -> bool {
    let Some((headers_raw, body)) = split_http_headers(raw) else {
        return false;
    };
    let Ok(headers_str) = std::str::from_utf8(headers_raw) else {
        return false;
    };
    let mut chunked = false;
    let mut content_len: Option<usize> = None;
    for line in headers_str.lines().skip(1) {
        if let Some((k, v)) = line.split_once(':') {
            if k.trim().eq_ignore_ascii_case("transfer-encoding")
                && v.to_ascii_lowercase().contains("chunked")
            {
                chunked = true;
            } else if k.trim().eq_ignore_ascii_case("content-length") {
                content_len = v.trim().parse::<usize>().ok();
            }
        }
    }
    if chunked {
        decode_chunked_body(body).is_some()
    } else if let Some(len) = content_len {
        body.len() >= len
    } else {
        false
    }
}

/// Decodes an HTTP/1.1 `Transfer-Encoding: chunked` payload, returning `None` if malformed
/// or incomplete.
fn decode_chunked_body(mut data: &[u8]) -> Option<Vec<u8>> {
    let mut out = Vec::new();
    loop {
        let line_end = data.windows(2).position(|w| w == b"\r\n")?;
        let size_str = std::str::from_utf8(&data[..line_end]).ok()?;
        let size_hex = size_str.split(';').next()?.trim();
        let size = usize::from_str_radix(size_hex, 16).ok()?;
        data = &data[line_end + 2..];
        if size == 0 {
            // Require the final CRLF (or trailer section ending in CRLF) so partial
            // reads are not mistaken for complete chunked responses.
            if data.starts_with(b"\r\n") || data.windows(4).any(|w| w == b"\r\n\r\n") {
                return Some(out);
            }
            return None;
        }
        let end = size.checked_add(2)?;
        if data.len() < end {
            return None;
        }
        out.extend_from_slice(&data[..size]);
        if &data[size..end] != b"\r\n" {
            return None;
        }
        data = &data[end..];
    }
}

/// Parses a raw HTTP response buffer into [`HttpOutcome`].
fn parse_http_response(raw: &[u8]) -> HttpOutcome {
    let Some((headers_raw, body)) = split_http_headers(raw) else {
        return HttpOutcome::Fallback;
    };
    let Ok(headers_str) = std::str::from_utf8(headers_raw) else {
        return HttpOutcome::Fallback;
    };
    let Some(status_line) = headers_str.lines().next() else {
        return HttpOutcome::Fallback;
    };
    let Some(status_code) = status_line
        .split_whitespace()
        .nth(1)
        .and_then(|s| s.parse::<u16>().ok())
    else {
        return HttpOutcome::Fallback;
    };

    if (300..400).contains(&status_code) {
        return HttpOutcome::Fallback;
    }
    if status_code >= 400 {
        return HttpOutcome::HttpError;
    }
    if status_code != 200 {
        return HttpOutcome::Fallback;
    }

    let mut chunked = false;
    let mut content_len: Option<usize> = None;
    for line in headers_str.lines().skip(1) {
        if let Some((k, v)) = line.split_once(':') {
            if k.trim().eq_ignore_ascii_case("transfer-encoding")
                && v.to_ascii_lowercase().contains("chunked")
            {
                chunked = true;
            } else if k.trim().eq_ignore_ascii_case("content-length") {
                content_len = v.trim().parse::<usize>().ok();
            }
        }
    }

    let decoded = if chunked {
        match decode_chunked_body(body) {
            Some(v) => v,
            None => return HttpOutcome::Fallback,
        }
    } else if let Some(len) = content_len {
        if body.len() < len {
            return HttpOutcome::Fallback;
        }
        body[..len].to_vec()
    } else {
        body.to_vec()
    };

    match String::from_utf8(decoded) {
        Ok(s) => HttpOutcome::Ok(s),
        Err(_) => HttpOutcome::Fallback,
    }
}

/// Run `curl -sf --max-time <max_time_secs> <url>` and return stdout on success, `None` on any failure.
fn curl_get(url: &str, max_time_secs: u64) -> Option<String> {
    let max_time = max_time_secs.to_string();
    let out = std::process::Command::new("curl")
        .args(["-sf", "--max-time", &max_time, url])
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

    #[test]
    fn parse_http_response_handles_plain_and_chunked_bodies() {
        let plain = b"HTTP/1.1 200 OK\r\nContent-Length: 43\r\nConnection: close\r\n\r\nNewbury Park, California, US|\xe2\x98\x81\xef\xb8\x8f |+69\xc2\xb0F";
        assert_eq!(
            parse_http_response(plain),
            HttpOutcome::Ok("Newbury Park, California, US|☁️ |+69°F".to_string())
        );

        let chunked = b"HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n6\r\nLondon\r\nF\r\n|\xe2\x98\x81\xef\xb8\x8f |+15\xc2\xb0C\r\n0\r\n\r\n";
        assert_eq!(
            parse_http_response(chunked),
            HttpOutcome::Ok("London|☁️ |+15°C".to_string())
        );

        assert_eq!(
            parse_http_response(b"HTTP/1.1 500 Internal Server Error\r\n\r\nunknown location"),
            HttpOutcome::HttpError
        );
        assert_eq!(
            parse_http_response(b"HTTP/1.1 302 Found\r\nLocation: https://wttr.in/\r\n\r\n"),
            HttpOutcome::Fallback
        );
        assert_eq!(
            parse_http_response(b"HTTP/1.1 200 OK\r\nContent-Length: 100\r\n\r\nshort"),
            HttpOutcome::Fallback
        );
        assert!(is_http_response_complete(plain));
        assert!(is_http_response_complete(chunked));
        assert!(!is_http_response_complete(
            b"HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n6\r\nLondon\r\n"
        ));
    }

    #[test]
    fn decode_chunked_body_rejects_huge_chunk_sizes() {
        for huge in [usize::MAX, usize::MAX - 1, usize::MAX - 2] {
            let body = format!("{huge:X}\r\nx\r\n0\r\n\r\n");
            assert_eq!(decode_chunked_body(body.as_bytes()), None);
            let http = format!("HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n{body}");
            assert_eq!(parse_http_response(http.as_bytes()), HttpOutcome::Fallback);
        }
        assert_eq!(
            decode_chunked_body(b"FFFFFFFFFFFFFFFF\r\nx\r\n0\r\n\r\n"),
            None
        );
    }

    #[test]
    fn resolve_with_timeout_caps_stalled_dns() {
        use std::net::{IpAddr, Ipv4Addr, SocketAddr};
        use std::time::{Duration, Instant};

        let start = Instant::now();
        let timed_out = resolve_with_timeout(Duration::from_millis(40), || {
            std::thread::sleep(Duration::from_millis(400));
            Some(vec![SocketAddr::new(IpAddr::V4(Ipv4Addr::LOCALHOST), 80)])
        });
        assert_eq!(timed_out, None);
        assert!(start.elapsed() < Duration::from_millis(250));

        let addr = SocketAddr::new(IpAddr::V4(Ipv4Addr::LOCALHOST), 80);
        let ok = resolve_with_timeout(Duration::from_secs(1), move || Some(vec![addr]));
        assert_eq!(ok, Some(vec![addr]));
        assert_eq!(
            resolve_with_timeout(Duration::ZERO, move || Some(vec![addr])),
            None
        );
    }

    #[test]
    fn remaining_curl_timeout_secs_respects_budget() {
        use std::time::Duration;

        assert_eq!(remaining_curl_timeout_secs(Duration::from_secs(4)), Some(4));
        assert_eq!(
            remaining_curl_timeout_secs(Duration::from_millis(3950)),
            Some(4)
        );
        assert_eq!(
            remaining_curl_timeout_secs(Duration::from_millis(2500)),
            Some(2)
        );
        assert_eq!(
            remaining_curl_timeout_secs(Duration::from_millis(1999)),
            Some(1)
        );
        assert_eq!(
            remaining_curl_timeout_secs(Duration::from_millis(999)),
            None
        );
    }

    #[test]
    fn http_get_wttr_handles_unframed_eof_vs_read_timeout() {
        use std::io::{Read, Write};
        use std::net::{Shutdown, TcpListener};
        use std::time::{Duration, Instant};

        // Clean EOF on an unframed (no Content-Length / chunked) body succeeds.
        let listener = TcpListener::bind("127.0.0.1:0").expect("bind loopback");
        let addr = listener.local_addr().expect("local addr");
        let server = std::thread::spawn(move || {
            let (mut conn, _) = listener.accept().expect("accept");
            let mut req = [0u8; 512];
            let _ = conn.read(&mut req);
            conn.write_all(b"HTTP/1.1 200 OK\r\nConnection: close\r\n\r\nLondon|\xe2\x98\x81\xef\xb8\x8f |+15\xc2\xb0C")
                .expect("write");
            let _ = conn.shutdown(Shutdown::Write);
        });
        let deadline = Instant::now() + Duration::from_secs(2);
        assert_eq!(
            http_get_wttr_addrs("127.0.0.1", "/?format=x", vec![addr], deadline, deadline),
            HttpOutcome::Ok("London|☁️ |+15°C".to_string())
        );
        server.join().expect("server thread");

        // Stalled unframed body that hits read timeout must fall back, never return truncated Ok.
        let listener = TcpListener::bind("127.0.0.1:0").expect("bind loopback");
        let addr = listener.local_addr().expect("local addr");
        let (done_tx, done_rx) = std::sync::mpsc::sync_channel(1);
        let server = std::thread::spawn(move || {
            let (mut conn, _) = listener.accept().expect("accept");
            let mut req = [0u8; 512];
            let _ = conn.read(&mut req);
            conn.write_all(b"HTTP/1.1 200 OK\r\nConnection: close\r\n\r\nLondon|")
                .expect("write partial");
            let _ = done_rx.recv();
        });
        let deadline = Instant::now() + Duration::from_millis(80);
        assert_eq!(
            http_get_wttr_addrs("127.0.0.1", "/?format=x", vec![addr], deadline, deadline),
            HttpOutcome::Fallback
        );
        let _ = done_tx.send(());
        server.join().expect("server thread");

        // Expired connect deadline returns Fallback without attempting connections.
        let expired = Instant::now() - Duration::from_millis(1);
        assert_eq!(
            http_get_wttr_addrs(
                "127.0.0.1",
                "/?format=x",
                vec![addr],
                expired,
                Instant::now() + Duration::from_secs(1)
            ),
            HttpOutcome::Fallback
        );
    }
}

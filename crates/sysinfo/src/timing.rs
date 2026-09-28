// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Opt-in per-probe timing, printed to stderr when `RETCH_TIMING` is set.
//!
//! Each line gives a probe's **start offset** from the beginning of collection and how
//! long it **took**. Offsets, not differences, on purpose: fields collect concurrently,
//! so comparing `--fields` sets cannot see a slow serial section and a subtracted baseline
//! can cancel exactly the cost being hunted (NOTES §7.1). With offsets and durations the
//! critical path of one real run can be read straight off the output.
//!
//! It exists because a cost can be intermittent: on 2026-09-28 the process-table fields
//! measured ~50 ms each and, ninety minutes later on the same binary, ~1.5 ms, with no way
//! to tell afterwards where the time had gone. `RETCH_TIMING=1 retch` is meant to be run
//! *when it is slow*, so the evidence is captured while it exists.
//!
//! Disabled, [`timed`] is one cached flag check and a direct call.

use std::ffi::OsStr;
use std::sync::OnceLock;
use std::time::{Duration, Instant};

static ENABLED: OnceLock<bool> = OnceLock::new();
static ORIGIN: OnceLock<Instant> = OnceLock::new();

/// Whether timing output is on for this process (`RETCH_TIMING` set, non-empty, not `0`).
pub(crate) fn enabled() -> bool {
    *ENABLED.get_or_init(|| is_enabled(std::env::var_os("RETCH_TIMING").as_deref()))
}

fn is_enabled(value: Option<&OsStr>) -> bool {
    matches!(value, Some(v) if !v.is_empty() && v != "0")
}

/// Fixes the origin that start offsets are measured from. Call once, first thing in
/// collection; later calls keep the first origin.
pub(crate) fn start() {
    if enabled() {
        ORIGIN.get_or_init(Instant::now);
    }
}

/// Runs `f`, and when timing is enabled prints how long it took and when it started.
pub(crate) fn timed<T>(label: &str, f: impl FnOnce() -> T) -> T {
    if !enabled() {
        return f();
    }
    let origin = *ORIGIN.get_or_init(Instant::now);
    let t0 = Instant::now();
    let out = f();
    let took = t0.elapsed();
    eprintln!("{}", format_line(label, t0 - origin, took));
    out
}

/// Prints a zero-length marker at the current offset (e.g. the end of collection).
pub(crate) fn mark(label: &str) {
    if enabled() {
        let origin = *ORIGIN.get_or_init(Instant::now);
        eprintln!("{}", format_line(label, origin.elapsed(), Duration::ZERO));
    }
}

fn format_line(label: &str, start: Duration, took: Duration) -> String {
    format!(
        "retch-timing  {label:<16} start {:>9.2} ms  took {:>9.2} ms",
        start.as_secs_f64() * 1e3,
        took.as_secs_f64() * 1e3
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn enabled_only_for_a_non_empty_non_zero_value() {
        assert!(!is_enabled(None), "unset");
        assert!(!is_enabled(Some(OsStr::new(""))), "empty");
        assert!(!is_enabled(Some(OsStr::new("0"))), "explicitly off");
        assert!(is_enabled(Some(OsStr::new("1"))));
        assert!(is_enabled(Some(OsStr::new("yes"))));
    }

    #[test]
    fn line_carries_label_offset_and_duration_in_ms() {
        let line = format_line(
            "audio",
            Duration::from_micros(1_500),
            Duration::from_micros(48_250),
        );
        assert_eq!(
            line,
            "retch-timing  audio            start      1.50 ms  took     48.25 ms"
        );
    }
}

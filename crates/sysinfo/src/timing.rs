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
//!
//! **Lines go to a copy of stderr taken in [`start`], not to fd 2 itself.** On Linux
//! `gpu_api.rs` points fd 2 at `/dev/null` while the GPU drivers load, to hide their noise,
//! and that redirect is process-wide: until v0.20.1 any other probe's line printed in that
//! window was silently lost, so a `--full` trace could miss `public-ip` while `Public IP:`
//! was shown. A descriptor duplicated before the redirect still points at the real stderr.

use std::ffi::OsStr;
#[cfg(unix)]
use std::io::Write;
use std::sync::OnceLock;
use std::time::{Duration, Instant};

static ENABLED: OnceLock<bool> = OnceLock::new();
static ORIGIN: OnceLock<Instant> = OnceLock::new();
/// Copy of stderr taken in [`start`]; `None` inside if duplicating failed.
#[cfg(unix)]
static SINK: OnceLock<Option<std::fs::File>> = OnceLock::new();

/// Whether timing output is on for this process (`RETCH_TIMING` set, non-empty, not `0`).
pub(crate) fn enabled() -> bool {
    *ENABLED.get_or_init(|| is_enabled(std::env::var_os("RETCH_TIMING").as_deref()))
}

fn is_enabled(value: Option<&OsStr>) -> bool {
    matches!(value, Some(v) if !v.is_empty() && v != "0")
}

/// Fixes the origin that start offsets are measured from, and takes the copy of stderr that
/// timing lines are written to. Call once, first thing in collection — before any probe can
/// redirect fd 2; later calls keep the first origin and copy.
pub(crate) fn start() {
    if enabled() {
        ORIGIN.get_or_init(Instant::now);
        #[cfg(unix)]
        SINK.get_or_init(|| duplicate(std::io::stderr()));
    }
}

/// A new descriptor for the same open file as `fd` (`F_DUPFD_CLOEXEC`). Redirecting the
/// original descriptor number afterwards, as `dup2` does, leaves this one untouched.
#[cfg(unix)]
fn duplicate(fd: impl std::os::fd::AsFd) -> Option<std::fs::File> {
    fd.as_fd()
        .try_clone_to_owned()
        .ok()
        .map(std::fs::File::from)
}

/// Writes one timing line: to the copy taken in [`start`] when there is one, else to stderr.
fn emit(line: &str) {
    #[cfg(unix)]
    if let Some(Some(sink)) = SINK.get() {
        // One write per line: well under PIPE_BUF, so concurrent lines cannot interleave.
        let _ = (&*sink).write_all(format!("{line}\n").as_bytes());
        return;
    }
    eprintln!("{line}");
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
    emit(&format_line(label, t0 - origin, took));
    out
}

/// Prints a zero-length marker at the current offset (e.g. the end of collection).
pub(crate) fn mark(label: &str) {
    if enabled() {
        let origin = *ORIGIN.get_or_init(Instant::now);
        emit(&format_line(label, origin.elapsed(), Duration::ZERO));
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

    /// The bug and the fix in one place, on a temp file standing in for stderr, so the real
    /// fd 2 of the test process is never touched. `dup2` of `/dev/null` over the original
    /// descriptor is exactly what `gpu_api.rs`'s `SuppressStderr` does to fd 2.
    #[cfg(target_os = "linux")]
    #[test]
    fn a_copy_taken_before_a_redirect_still_reaches_the_original_file() {
        use std::io::{Read, Seek, Write};
        use std::os::fd::AsRawFd;

        let path = std::env::temp_dir().join(format!("retch-timing-{}", std::process::id()));
        let original = std::fs::File::options()
            .create(true)
            .truncate(true)
            .read(true)
            .write(true)
            .open(&path)
            .expect("temp file");
        let copy = duplicate(&original).expect("dup");

        let devnull = std::fs::File::options()
            .write(true)
            .open("/dev/null")
            .unwrap();
        // SAFETY: both descriptors are open and owned by live `File`s for the whole call;
        // dup2 only replaces what `original`'s descriptor number refers to.
        assert!(unsafe { libc::dup2(devnull.as_raw_fd(), original.as_raw_fd()) } >= 0);

        // Negative control: through the redirected descriptor, the line is lost — the bug.
        (&original).write_all(b"lost\n").unwrap();
        // Through the copy it still lands in the file — the fix.
        (&copy).write_all(b"kept\n").unwrap();

        let mut reread = std::fs::File::open(&path).unwrap();
        let mut text = String::new();
        reread.rewind().unwrap();
        reread.read_to_string(&mut text).unwrap();
        let _ = std::fs::remove_file(&path);
        assert_eq!(text, "kept\n");
    }

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

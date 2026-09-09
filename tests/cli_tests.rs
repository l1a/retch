// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

use std::fs;
use std::process::Command;

// Helper to run retch with arguments and return output/status
fn run_retch(args: &[&str]) -> (String, String, bool) {
    let bin_path = env!("CARGO_BIN_EXE_retch");
    let output = Command::new(bin_path)
        .args(args)
        .output()
        .expect("Failed to execute retch binary");

    let stdout = String::from_utf8_lossy(&output.stdout).into_owned();
    let stderr = String::from_utf8_lossy(&output.stderr).into_owned();
    (stdout, stderr, output.status.success())
}

#[test]
fn test_cli_help() {
    let (stdout, stderr, success) = run_retch(&["--help"]);
    assert!(success);
    assert!(stderr.is_empty());
    assert!(stdout.contains("Usage:"));
    assert!(stdout.contains("Options:"));
    assert!(stdout.contains("--theme"));
    assert!(stdout.contains("--logo"));
    assert!(stdout.contains("-s, --short"));
    assert!(stdout.contains("-l, --long"));
    assert!(stdout.contains("-f, --full"));
}

#[test]
fn test_cli_mode_missing_arg() {
    let (_, stderr, success) = run_retch(&["--mode"]);
    assert!(!success);
    assert!(stderr.contains("error: a value is required for '--mode <MODE>' but none was supplied"));
}

#[test]
fn test_cli_version() {
    let (stdout, stderr, success) = run_retch(&["--version"]);
    assert!(success);
    assert!(stderr.is_empty());
    let current_version = env!("CARGO_PKG_VERSION");
    assert!(stdout.contains(current_version));
}

#[test]
fn test_cli_list_themes() {
    let (stdout, stderr, success) = run_retch(&["--list-themes"]);
    assert!(success);
    assert!(stderr.is_empty());
    assert!(stdout.contains("neutral"));
    assert!(stdout.contains("dark"));
    assert!(stdout.contains("light"));
    assert!(stdout.contains("catppuccin-mocha"));
}

#[test]
fn test_cli_print_logos() {
    let (stdout, stderr, success) = run_retch(&["--print-logos"]);
    assert!(success);
    assert!(stderr.is_empty());
    assert!(stdout.contains("Arch"));
    assert!(stdout.contains("Debian"));
    assert!(stdout.contains("Fedora"));
    assert!(stdout.contains("MX Linux"));
    assert!(stdout.contains("Linux Mint"));
    assert!(stdout.contains("Kali Linux"));
    assert!(stdout.contains("Zorin OS"));
    assert!(stdout.contains("Garuda Linux"));
    assert!(stdout.contains("macOS"));
    assert!(stdout.contains("Windows"));
    assert!(stdout.contains("Tux"));
}

#[test]
fn test_cli_generate_config() {
    let (stdout, stderr, success) = run_retch(&["--generate-config"]);
    assert!(success);
    assert!(stderr.is_empty());
    assert!(stdout.contains("# Theme to use"));
    assert!(stdout.contains("# show_logo = true"));
}

#[test]
fn test_cli_write_config_temp() {
    let temp_dir = std::env::temp_dir();
    let temp_file = temp_dir.join(format!("retch_test_config_{}.toml", std::process::id()));

    // Ensure file doesn't exist yet
    if temp_file.exists() {
        let _ = fs::remove_file(&temp_file);
    }

    let path_str = temp_file.to_str().unwrap();
    let (stdout, stderr, success) = run_retch(&["--write-config", path_str]);
    assert!(success);
    assert!(stderr.is_empty());
    assert!(stdout.contains("Wrote default config to"));

    // Verify file was written and is not empty
    assert!(temp_file.exists());
    let content = fs::read_to_string(&temp_file).unwrap();
    assert!(content.contains("# Theme to use"));

    // Clean up
    let _ = fs::remove_file(&temp_file);
}

#[test]
fn test_cli_fields_terminal_size() {
    let (stdout, stderr, success) = run_retch(&["--fields", "terminal-size"]);
    assert!(success, "stderr: {}", stderr);
    assert!(stderr.is_empty());
    // Terminal size is empty when there is no TTY (e.g. in CI/test runner).
    assert!(
        stdout.contains("Terminal Size") || stdout.trim().is_empty(),
        "unexpected output: {}",
        stdout
    );
}

#[test]
fn test_cli_fields_dns() {
    let (stdout, stderr, success) = run_retch(&["--fields", "dns"]);
    assert!(success, "stderr: {}", stderr);
    assert!(stderr.is_empty());
    assert!(
        stdout.contains("DNS"),
        "expected 'DNS' in output: {}",
        stdout
    );
}

#[test]
fn test_cli_fields_wm() {
    let (stdout, stderr, success) = run_retch(&["--fields", "wm"]);
    assert!(success, "stderr: {}", stderr);
    assert!(stderr.is_empty());
    // WM may be empty on headless CI; just verify the binary ran cleanly.
    assert!(
        stdout.contains("WM") || stdout.trim().is_empty(),
        "unexpected output: {}",
        stdout
    );
}

#[test]
fn test_cli_full_mode() {
    let (stdout, stderr, success) = run_retch(&["--full", "--no-logo"]);
    assert!(success, "stderr: {}", stderr);
    assert!(stderr.is_empty());
    // --full should always contain at minimum the OS line
    assert!(
        stdout.contains("OS"),
        "expected 'OS' in --full output: {}",
        stdout
    );
}

#[test]
fn test_cli_piped_output_no_graphical_logo() {
    // run_retch uses Command::output() which pipes stdout, so is_terminal() == false.
    // No Kitty/iTerm2/Sixel escape sequences should appear.
    let (stdout, stderr, success) = run_retch(&[]);
    assert!(success, "stderr: {}", stderr);
    assert!(
        !stdout.contains("\x1b_G"),
        "Kitty escape sequence found in piped output"
    );
    assert!(
        !stdout.contains("\x1b]1337"),
        "iTerm2 escape sequence found in piped output"
    );
}

#[test]
fn test_bench_compiles() {
    let output = Command::new("cargo")
        .args(["bench", "--no-run"])
        .output()
        .expect("Failed to run cargo bench --no-run");

    assert!(
        output.status.success(),
        "Benchmark harness failed to compile: {}",
        String::from_utf8_lossy(&output.stderr)
    );
}

/// Guardrail against field-list drift (NOTES.md §5): every field key in the
/// single registry (`src/fields.rs`) must be documented in both the README's
/// `fields = [...]` array and the man-page source. Adding a field to the
/// registry without documenting it fails here instead of drifting silently.
#[test]
fn test_docs_cover_all_registry_fields() {
    let manifest = env!("CARGO_MANIFEST_DIR");
    let readme = fs::read_to_string(format!("{manifest}/README.md")).expect("read README.md");
    let man = fs::read_to_string(format!("{manifest}/docs/retch.1.md")).expect("read retch.1.md");

    for key in retch_cli::fields::all_keys() {
        // README lists fields quoted in the `fields = [...]` array.
        assert!(
            readme.contains(&format!("\"{key}\"")),
            "README.md is missing field key {key:?} — add it to the fields array"
        );
        // The man page lists each field as a backtick-delimited term.
        assert!(
            man.contains(&format!("`{key}`")),
            "docs/retch.1.md is missing field key {key:?} — document it under FIELDS"
        );
    }
}

/// The generated default-config field block must list every registry field, so
/// `--generate-config` / `--write-config` stay in sync with the registry.
#[test]
fn test_generated_config_covers_all_registry_fields() {
    let (stdout, _stderr, success) = run_retch(&["--generate-config"]);
    assert!(success);
    for key in retch_cli::fields::all_keys() {
        assert!(
            stdout.contains(&format!("\"{key}\"")),
            "--generate-config output missing field key: {key}"
        );
    }
}

/// Strip ANSI escape sequences so field labels can be read positionally.
///
/// Deliberately matches the whole `ESC [ ... <final byte>` form rather than SGR (`m`) only:
/// chafa opens each run with `\x1b[?25l`, and an SGR-only strip silently leaves those six
/// characters on the line — the measurement bug recorded in the 2026-08-24 session, where a
/// uniform 6-column overflow was blamed on the renderer.
fn strip_ansi(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    let mut chars = s.chars();
    while let Some(c) = chars.next() {
        if c != '\x1b' {
            out.push(c);
            continue;
        }
        // Consume the introducer and everything up to the final byte (0x40..=0x7E).
        if chars.next() != Some('[') {
            continue;
        }
        for f in chars.by_ref() {
            if ('\u{40}'..='\u{7E}').contains(&f) {
                break;
            }
        }
    }
    out
}

/// `Host` is the first field printed, in every mode that shows it.
///
/// Display order is the `print_line` call sequence in `display.rs` — the config `fields` array
/// is a membership test and does not reorder anything — so nothing but this test pins the
/// order. It is the same shape as the v0.9.2 `logo_column` regression: a property that held
/// only by accident for six months because nothing ever asserted it.
#[test]
fn test_host_is_listed_first() {
    for args in [
        ["--short", "--no-logo"].as_slice(),
        ["--no-logo"].as_slice(),
    ] {
        let (stdout, _, success) = run_retch(args);
        assert!(success, "retch {args:?} did not exit successfully");

        let plain = strip_ansi(&stdout);
        let first = plain
            .lines()
            .find(|l| !l.trim().is_empty())
            .unwrap_or_else(|| panic!("retch {args:?} produced no output lines"));

        // Assert Host is actually present rather than skipping when it is absent: a check
        // that quietly passes on a missing field is a check that cannot fail.
        assert!(
            first.starts_with("Host:"),
            "expected `Host` to be the first field for {args:?}, got: {first:?}"
        );

        let host = plain.find("\nHost:").expect("Host line missing");
        let os = plain.find("\nOS:").expect("OS line missing");
        assert!(
            host < os,
            "expected Host before OS for {args:?} (host at {host}, os at {os})"
        );
    }
}

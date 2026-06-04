// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 l1a

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

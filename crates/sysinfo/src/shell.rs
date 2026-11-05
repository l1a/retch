// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Shell detection and version querying.

use sysinfo::System;

/// How far up the process tree the shell lookup goes before giving up.
const MAX_SHELL_ANCESTORS: usize = 64;

/// Allowed shell executable basenames. Both process-tree ancestors and `$SHELL`
/// fallbacks must match this allowlist before `retch` will execute them for version
/// detection.
const KNOWN_SHELLS: &[&str] = &[
    "bash",
    "zsh",
    "fish",
    "sh",
    "ash",
    "dash",
    "nu",
    "elvish",
    "tcsh",
    "csh",
    "ksh",
    "powershell",
    "pwsh",
    "cmd",
];

/// Normalizes a raw shell process name or path into a lowercase bare shell name
/// (stripping any path prefix, leading login-shell `-`, and trailing `.exe`).
pub(crate) fn normalize_shell_name(raw: &str) -> String {
    let base = std::path::Path::new(raw)
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or(raw);
    let without_login_dash = base.strip_prefix('-').unwrap_or(base);
    let lower = without_login_dash.to_lowercase();
    lower.strip_suffix(".exe").unwrap_or(&lower).to_string()
}

/// Validates that `path_str` is safe to invoke as a shell binary for `--version` probing
/// on the current target OS.
pub(crate) fn is_safe_shell_executable_path(path_str: &str) -> bool {
    is_safe_shell_executable_path_for(path_str, cfg!(target_os = "windows"))
}

/// Platform-parameterized implementation of [`is_safe_shell_executable_path`].
///
/// Rejects:
/// - Empty strings, trailing-separator directory paths, or paths containing `.` or `..`
///   segments (e.g. `./bash`, `../bin/zsh`, `/var/./tmp/zsh`).
/// - Relative paths that contain directory separators (e.g. `bin/zsh`), drive-relative
///   paths (`C:zsh`, `/bin/zsh` on Windows), UNC network shares (`\\host\share\zsh`,
///   `//host/share/zsh`), and Win32 device namespace paths (`\\?\...`, `//?/...`).
/// - Paths located under world-writable temporary directories (`/tmp`, `/var/tmp`,
///   `/dev/shm`, `/private/tmp`, `/private/var/tmp`, `/var/folders`, or Windows `Temp`),
///   even when written with redundant separators (`//tmp/zsh`, `/var//tmp/zsh`).
fn is_safe_shell_executable_path_for(path_str: &str, windows: bool) -> bool {
    if path_str.is_empty() || path_str.ends_with('/') || path_str.ends_with('\\') {
        return false;
    }
    if path_str
        .split(['/', '\\'])
        .any(|seg| seg == "." || seg == "..")
    {
        return false;
    }
    let has_sep = path_str.contains('/') || path_str.contains('\\');
    if !has_sep {
        // A bare command name (e.g. "zsh") has no separator; reject drive-relative "C:zsh".
        return !path_str.contains(':');
    }

    if windows {
        // On Windows, any path with separators must start with an explicit local drive root
        // ("C:\" or "C:/"). This rejects UNC shares ("\\host\share", "//host/share"),
        // Win32 device namespaces ("\\?\...", "//?/..."), and drive-relative "/bin/zsh".
        let bytes = path_str.as_bytes();
        let is_win_drive_abs = bytes.len() >= 3
            && bytes[0].is_ascii_alphabetic()
            && bytes[1] == b':'
            && (bytes[2] == b'/' || bytes[2] == b'\\');
        if !is_win_drive_abs {
            return false;
        }
    } else if !path_str.starts_with('/') || path_str.starts_with("//") || path_str.contains('\\') {
        // On Unix, require a single leading '/' and no backslashes.
        return false;
    }

    let mut segments: Vec<String> = path_str
        .split(['/', '\\'])
        .filter(|s| !s.is_empty())
        .map(|s| s.to_ascii_lowercase())
        .collect();
    if windows && !segments.is_empty() {
        segments.remove(0);
    }
    if segments.len() < 2 {
        return false;
    }
    if segments
        .iter()
        .any(|seg| seg.contains(':') || seg.contains('?'))
    {
        return false;
    }
    if segments[..segments.len() - 1]
        .iter()
        .any(|seg| seg == "tmp" || seg == "temp")
    {
        return false;
    }

    const FORBIDDEN_PREFIXES: &[&[&str]] = &[
        &["dev", "shm"],
        &["var", "folders"],
        &["private", "var", "folders"],
    ];
    for prefix in FORBIDDEN_PREFIXES {
        if segments.len() > prefix.len()
            && segments.iter().zip(*prefix).all(|(seg, &forb)| seg == forb)
        {
            return false;
        }
    }
    true
}

pub(crate) fn detect_shell(sys: &System) -> Option<String> {
    // Walk the process tree to find the actual running shell. The cap is a loop guard,
    // not a policy: real shells sit a few levels up, and the walk used to be unbounded.
    let mut detected: Option<(String, String)> = None;
    for (pid, proc_name) in crate::proc_tree::ancestors(sys, MAX_SHELL_ANCESTORS) {
        let clean_name = normalize_shell_name(&proc_name);
        if KNOWN_SHELLS.contains(&clean_name.as_str()) {
            #[cfg(target_os = "linux")]
            {
                // Require a readable `/proc/<pid>/exe` symlink whose resolved path is safe
                // and whose basename is in `KNOWN_SHELLS`. If `read_link` fails (e.g. a
                // process called `prctl(PR_SET_DUMPABLE, 0)` after spoofing `comm` via
                // `prctl(PR_SET_NAME)`) or the binary lives in an unsafe directory such as
                // `/tmp`, skip this ancestor rather than falling back to the spoofable
                // `/proc/<pid>/stat` `comm`.
                let Ok(exe_path) = std::fs::read_link(format!("/proc/{pid}/exe")) else {
                    continue;
                };
                let exe_str = exe_path.to_string_lossy();
                let exe_clean_path = exe_str.strip_suffix(" (deleted)").unwrap_or(&exe_str);
                if !is_safe_shell_executable_path(exe_clean_path) {
                    continue;
                }
                let exe_name = normalize_shell_name(exe_clean_path);
                if KNOWN_SHELLS.contains(&exe_name.as_str()) {
                    // Always keep the verified absolute path `exe_clean_path` (even if the
                    // running inode had `" (deleted)"` after a package upgrade) so version
                    // probing never falls back to searching an untrusted `PATH`.
                    detected = Some((exe_clean_path.to_string(), exe_name));
                    break;
                } else if exe_name == "busybox" {
                    // BusyBox multicall binary backing a known shell applet (e.g. `/bin/ash`
                    // or `/bin/sh` -> `/bin/busybox` on Alpine): preserve the applet name and
                    // pass an empty path so `detect_shell_version` does not run `busybox`.
                    detected = Some((String::new(), clean_name));
                    break;
                } else {
                    continue;
                }
            }
            #[cfg(not(target_os = "linux"))]
            {
                let _ = pid;
                // A login shell on macOS/BSD appears in the process list as `-zsh` or `-bash`.
                // Strip the leading `-` when the process name is a bare command so
                // `detect_shell_version` invokes `zsh` rather than `-zsh`.
                let exec_name = if proc_name.contains('/') || proc_name.contains('\\') {
                    proc_name
                } else {
                    clean_name.clone()
                };
                if !is_safe_shell_executable_path(&exec_name) {
                    continue;
                }
                detected = Some((exec_name, clean_name));
                break;
            }
        }
    }

    let (shell_path, shell_name_clean) = if let Some((orig_name, clean_name)) = detected {
        (orig_name, clean_name)
    } else if let Some((path_str, clean_name)) = std::env::var("SHELL").ok().and_then(|s| {
        let has_sep = s.contains('/') || s.contains('\\');
        let clean = normalize_shell_name(&s);
        // Only accept `$SHELL` if it is a rooted, safe path (not a bare name) whose basename is in KNOWN_SHELLS.
        if has_sep
            && std::path::Path::new(&s).is_absolute()
            && is_safe_shell_executable_path(&s)
            && KNOWN_SHELLS.contains(&clean.as_str())
        {
            Some((s, clean))
        } else {
            None
        }
    }) {
        (path_str, clean_name)
    } else {
        #[cfg(target_os = "windows")]
        {
            if std::env::var("PSModulePath").is_ok() {
                ("powershell.exe".to_string(), "powershell".to_string())
            } else {
                ("cmd.exe".to_string(), "cmd".to_string())
            }
        }
        #[cfg(not(target_os = "windows"))]
        {
            ("sh".to_string(), "sh".to_string())
        }
    };

    let version = detect_shell_version(&shell_path, &shell_name_clean);

    if let Some(ver) = version {
        Some(format!("{} {}", shell_name_clean, ver))
    } else {
        Some(shell_name_clean)
    }
}

fn detect_shell_version(shell_path: &str, shell_name: &str) -> Option<String> {
    if !KNOWN_SHELLS.contains(&shell_name) || !is_safe_shell_executable_path(shell_path) {
        return None;
    }

    let args = match shell_name {
        "powershell" => vec![
            "-NoProfile",
            "-Command",
            "$PSVersionTable.PSVersion.ToString()",
        ],
        "elvish" => vec!["-version"],
        "bash" | "zsh" | "fish" | "nu" | "pwsh" | "tcsh" | "csh" | "ksh" | "sh" => {
            vec!["--version"]
        }
        // "cmd", "dash", and any unlisted shell have no safe `--version` flag.
        _ => return None,
    };

    let output = std::process::Command::new(shell_path)
        .args(&args)
        .output()
        .ok()?;

    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();
    let full_output = format!("{}\n{}", stdout, stderr);

    parse_shell_version(shell_name, &full_output)
}

pub fn parse_shell_version(shell_name: &str, output: &str) -> Option<String> {
    let output_trimmed = output.trim();
    if output_trimmed.is_empty() {
        return None;
    }

    match shell_name {
        "bash" => {
            if let Some(pos) = output.find("version ") {
                let rest = &output[pos + 8..];
                let ver = rest
                    .split(|c: char| c.is_whitespace() || c == '(' || c == ',' || c == '-')
                    .next()
                    .unwrap_or("");
                if !ver.is_empty() {
                    return Some(ver.to_string());
                }
            }
        }
        "zsh" => {
            if let Some(pos) = output.find("zsh ") {
                let rest = &output[pos + 4..];
                let ver = rest
                    .split(|c: char| c.is_whitespace() || c == '(')
                    .next()
                    .unwrap_or("");
                if !ver.is_empty() {
                    return Some(ver.to_string());
                }
            }
        }
        "fish" => {
            if let Some(pos) = output.find("version ") {
                let rest = &output[pos + 8..];
                let ver = rest
                    .split(|c: char| c.is_whitespace() || c == '(' || c == ',')
                    .next()
                    .unwrap_or("");
                if !ver.is_empty() {
                    return Some(ver.to_string());
                }
            }
        }
        "nu" => {
            let ver = output_trimmed.split_whitespace().next().unwrap_or("");
            if !ver.is_empty() {
                return Some(ver.to_string());
            }
        }
        "pwsh" => {
            if let Some(pos) = output.find("PowerShell ") {
                let rest = &output[pos + 11..];
                let ver = rest.split_whitespace().next().unwrap_or("");
                if !ver.is_empty() {
                    return Some(ver.to_string());
                }
            }
        }
        "powershell" => {
            let ver = output_trimmed.split_whitespace().next().unwrap_or("");
            if !ver.is_empty() {
                return Some(ver.to_string());
            }
        }
        "elvish" => {
            let ver = output_trimmed.split_whitespace().next().unwrap_or("");
            if !ver.is_empty() {
                return Some(ver.to_string());
            }
        }
        "tcsh" => {
            if let Some(pos) = output.find("tcsh ") {
                let rest = &output[pos + 5..];
                let ver = rest.split_whitespace().next().unwrap_or("");
                if !ver.is_empty() {
                    return Some(ver.to_string());
                }
            }
        }
        _ => {
            if let Some(pos) = output.to_lowercase().find("version ") {
                let rest = &output[pos + 8..];
                let ver = rest
                    .split(|c: char| c.is_whitespace() || c == '(' || c == ',' || c == '-')
                    .next()
                    .unwrap_or("");
                if !ver.is_empty() {
                    return Some(ver.to_string());
                }
            }
        }
    }

    None
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_shell_version() {
        let bash_out = "GNU bash, version 5.2.15(1)-release (x86_64-pc-linux-gnu)\nCopyright (C) 2022 Free Software Foundation, Inc.";
        assert_eq!(
            parse_shell_version("bash", bash_out),
            Some("5.2.15".to_string())
        );

        let zsh_out = "zsh 5.9 (x86_64-pc-linux-gnu)";
        assert_eq!(parse_shell_version("zsh", zsh_out), Some("5.9".to_string()));

        let fish_out = "fish, version 3.6.0";
        assert_eq!(
            parse_shell_version("fish", fish_out),
            Some("3.6.0".to_string())
        );

        let nu_out = "0.93.0";
        assert_eq!(
            parse_shell_version("nu", nu_out),
            Some("0.93.0".to_string())
        );

        let pwsh_out = "PowerShell 7.4.1";
        assert_eq!(
            parse_shell_version("pwsh", pwsh_out),
            Some("7.4.1".to_string())
        );

        let powershell_out = "5.1.22621.2428";
        assert_eq!(
            parse_shell_version("powershell", powershell_out),
            Some("5.1.22621.2428".to_string())
        );

        let elvish_out = "0.20.1";
        assert_eq!(
            parse_shell_version("elvish", elvish_out),
            Some("0.20.1".to_string())
        );

        let tcsh_out = "tcsh 6.24.10 (Astron) 2023-04-20 (x86_64-amd-linux) options wide,nls,dl,al,kan,sm,color,filec";
        assert_eq!(
            parse_shell_version("tcsh", tcsh_out),
            Some("6.24.10".to_string())
        );

        let custom_out = "CustomShell version 1.2.3-patch4";
        assert_eq!(
            parse_shell_version("custom", custom_out),
            Some("1.2.3".to_string())
        );
    }

    #[test]
    fn test_shell_validation_and_normalization() {
        assert_eq!(normalize_shell_name("/usr/bin/zsh"), "zsh");
        assert_eq!(normalize_shell_name("-bash"), "bash");
        assert_eq!(normalize_shell_name("pwsh.EXE"), "pwsh");

        // Safe paths under Unix rules
        assert!(is_safe_shell_executable_path_for("/bin/zsh", false));
        assert!(is_safe_shell_executable_path_for("/usr/bin/bash", false));
        assert!(is_safe_shell_executable_path_for(
            "/opt/homebrew/bin/fish",
            false
        ));
        assert!(is_safe_shell_executable_path_for("zsh", false));

        // Safe paths under Windows rules
        assert!(is_safe_shell_executable_path_for(
            r"C:\Program Files\PowerShell\7\pwsh.exe",
            true
        ));
        assert!(is_safe_shell_executable_path_for("zsh", true));

        // Unsafe paths under Unix rules
        assert!(!is_safe_shell_executable_path_for("", false));
        assert!(!is_safe_shell_executable_path_for("./zsh", false));
        assert!(!is_safe_shell_executable_path_for("../bin/zsh", false));
        assert!(!is_safe_shell_executable_path_for("C:zsh", false));
        assert!(!is_safe_shell_executable_path_for(
            "/usr/bin/../../tmp/zsh",
            false
        ));
        assert!(!is_safe_shell_executable_path_for("/tmp/zsh", false));
        assert!(!is_safe_shell_executable_path_for("//tmp/zsh", false));
        assert!(!is_safe_shell_executable_path_for(
            "//host/share/zsh",
            false
        ));
        assert!(!is_safe_shell_executable_path_for("/var/tmp/bash", false));
        assert!(!is_safe_shell_executable_path_for("/var/./tmp/bash", false));
        assert!(!is_safe_shell_executable_path_for("/var//tmp/bash", false));
        assert!(!is_safe_shell_executable_path_for("/dev/shm/fish", false));
        assert!(!is_safe_shell_executable_path_for(
            "/private/tmp/zsh",
            false
        ));
        assert!(!is_safe_shell_executable_path_for(
            "/private/var/tmp/zsh",
            false
        ));

        // Unsafe paths under Windows rules (UNC shares, Win32 device paths, drive-relative, Temp)
        assert!(!is_safe_shell_executable_path_for(
            "//host/share/zsh.exe",
            true
        ));
        assert!(!is_safe_shell_executable_path_for(
            r"\\host\share\zsh.exe",
            true
        ));
        assert!(!is_safe_shell_executable_path_for(
            "//?/C:/Temp/zsh.exe",
            true
        ));
        assert!(!is_safe_shell_executable_path_for(
            r"\\?\C:\Windows\System32\cmd.exe",
            true
        ));
        assert!(!is_safe_shell_executable_path_for("/bin/zsh", true));
        assert!(!is_safe_shell_executable_path_for("C:zsh", true));
        assert!(!is_safe_shell_executable_path_for(
            r"C:\Temp\pwsh.exe",
            true
        ));
        assert!(!is_safe_shell_executable_path_for(
            r"C:\Windows\Temp\pwsh.exe",
            true
        ));
        assert!(!is_safe_shell_executable_path_for(
            r"C:\Users\runner\AppData\Local\Temp\pwsh.exe",
            true
        ));

        // Unknown shells or unsafe paths never execute a child process in detect_shell_version
        assert_eq!(detect_shell_version("/usr/bin/python3", "python3"), None);
        assert_eq!(detect_shell_version("/tmp/zsh", "zsh"), None);
        assert_eq!(detect_shell_version("./zsh", "zsh"), None);
    }
}

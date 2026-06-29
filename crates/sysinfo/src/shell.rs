// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Shell detection and version querying.

use sysinfo::System;

pub(crate) fn detect_shell(sys: &System) -> Option<String> {
    let known_shells = [
        "bash",
        "zsh",
        "fish",
        "sh",
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

    // Walk the process tree to find the actual running shell.
    let mut current_pid = sysinfo::get_current_pid().ok();
    let mut detected: Option<(String, String)> = None;
    while let Some(pid) = current_pid {
        if let Some(process) = sys.process(pid) {
            let proc_name = process.name().to_string_lossy().to_string();
            let proc_name_lower = proc_name.to_lowercase();
            let clean_name = proc_name_lower
                .strip_suffix(".exe")
                .unwrap_or(&proc_name_lower)
                .to_string();
            if known_shells.contains(&clean_name.as_str()) {
                detected = Some((proc_name.clone(), clean_name));
                break;
            }
            current_pid = process.parent();
        } else {
            break;
        }
    }

    let (shell_path, shell_name) = if let Some((orig_name, clean_name)) = detected {
        (orig_name, clean_name)
    } else if let Ok(path_str) = std::env::var("SHELL") {
        // Fall back to $SHELL (login shell) when process tree yields nothing.
        let path = std::path::Path::new(&path_str);
        let name = path
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or(&path_str)
            .to_string();
        (path_str, name)
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

    let shell_name_lower = shell_name.to_lowercase();
    let shell_name_clean = shell_name_lower
        .strip_suffix(".exe")
        .unwrap_or(&shell_name_lower);

    let version = detect_shell_version(&shell_path, shell_name_clean);

    if let Some(ver) = version {
        Some(format!("{} {}", shell_name_clean, ver))
    } else {
        Some(shell_name_clean.to_string())
    }
}

fn detect_shell_version(shell_path: &str, shell_name: &str) -> Option<String> {
    let args = match shell_name {
        "powershell" => vec![
            "-NoProfile",
            "-Command",
            "$PSVersionTable.PSVersion.ToString()",
        ],
        "elvish" => vec!["-version"],
        _ => vec!["--version"],
    };

    let output = std::process::Command::new(shell_path)
        .args(&args)
        .output()
        .or_else(|_| std::process::Command::new(shell_name).args(&args).output())
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
}

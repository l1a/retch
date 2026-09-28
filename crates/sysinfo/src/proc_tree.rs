// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Process-table queries that do not load the whole process table.
//!
//! Four fields need something from the process table: `procs` a count, `audio` whether a
//! sound server is running, and `shell` / `terminal` the chain of retch's own ancestors.
//! None of them needs the *whole* table, but asking sysinfo for any of it makes it walk
//! every process **and every thread**, reading several files per entry. On a desktop with
//! ~600 processes and ~2,100 threads that cost ~48 ms, which was most of the default
//! mode's runtime; it is also why a container, with a handful of processes, showed no gap
//! to fastfetch at all.
//!
//! On Linux each question has a cheap direct answer in `/proc`, so this module answers
//! it there and [`crate::fetch`] stops loading the table. Elsewhere the table is still
//! loaded and [`ancestors`] walks it, exactly as before.
//!
//! Every answer matches what sysinfo reported, deliberately: sysinfo's Linux process name
//! *is* the `comm` field of `/proc/<pid>/stat` (15 characters, truncated by the kernel),
//! and the kernel's task total in `/proc/loadavg` is the same number sysinfo's table had
//! entries (it lists threads too).

use sysinfo::System;

/// retch and its ancestors, nearest first, as `(pid, name)` pairs; at most `max` entries.
///
/// The walk stops at the first process that cannot be read (it exited, or the parent id
/// is 0), matching the old `sys.process(pid)` walk returning `None`.
#[cfg(target_os = "linux")]
pub(crate) fn ancestors(_sys: &System, max: usize) -> Vec<(u32, String)> {
    ancestors_with(std::process::id(), max, |pid| {
        std::fs::read_to_string(format!("/proc/{pid}/stat")).ok()
    })
}

/// retch and its ancestors, nearest first, as `(pid, name)` pairs; at most `max` entries.
///
/// Off Linux this walks sysinfo's process table, so `sys` must have been built with it
/// (see `needs_process_list` in [`crate::fetch`]).
#[cfg(not(target_os = "linux"))]
pub(crate) fn ancestors(sys: &System, max: usize) -> Vec<(u32, String)> {
    let mut chain = Vec::new();
    let mut current = sys.process(sysinfo::Pid::from_u32(std::process::id()));
    while let Some(proc) = current {
        if chain.len() == max {
            break;
        }
        chain.push((
            proc.pid().as_u32(),
            proc.name().to_string_lossy().into_owned(),
        ));
        current = proc.parent().and_then(|pid| sys.process(pid));
    }
    chain
}

/// Walks up from `start` using `read_stat(pid)` for each `/proc/<pid>/stat`.
///
/// Injected so the walk is tested against fixtures rather than the process tree of
/// whichever machine runs the tests.
#[cfg_attr(not(target_os = "linux"), allow(dead_code))]
fn ancestors_with(
    start: u32,
    max: usize,
    read_stat: impl Fn(u32) -> Option<String>,
) -> Vec<(u32, String)> {
    let mut chain: Vec<(u32, String)> = Vec::new();
    let mut pid = start;
    while chain.len() < max && pid != 0 {
        let Some((name, ppid)) = read_stat(pid).as_deref().and_then(parse_stat) else {
            break;
        };
        chain.push((pid, name));
        // A process that names itself as its parent would loop forever; the kernel does
        // not produce one, but a walk that can spin is not worth trusting to that.
        if ppid == pid || chain.iter().any(|(seen, _)| *seen == ppid) {
            break;
        }
        pid = ppid;
    }
    chain
}

/// Extracts `(comm, ppid)` from the contents of `/proc/<pid>/stat`.
///
/// `comm` sits in parentheses and may itself contain spaces and `)` — a process can
/// name itself anything — so it runs to the **last** `)`, which is how the kernel
/// documents parsing it and how sysinfo does. The state follows, then the ppid.
#[cfg_attr(not(target_os = "linux"), allow(dead_code))]
fn parse_stat(stat: &str) -> Option<(String, u32)> {
    let open = stat.find('(')?;
    let close = stat.rfind(')')?;
    if close < open {
        return None;
    }
    let comm = stat[open + 1..close].to_string();
    let mut rest = stat[close + 1..].split_ascii_whitespace();
    let _state = rest.next()?;
    let ppid = rest.next()?.parse().ok()?;
    Some((comm, ppid))
}

/// Number of tasks (processes plus threads) on the system, which is what `procs` has
/// always reported on Linux: sysinfo's table listed threads as entries of their own.
///
/// Read from the kernel's own total in `/proc/loadavg`; counting `/proc` entries is the
/// fallback, and gives processes only, if that file cannot be read or parsed.
#[cfg(target_os = "linux")]
pub(crate) fn task_count() -> usize {
    std::fs::read_to_string("/proc/loadavg")
        .ok()
        .as_deref()
        .and_then(parse_loadavg_tasks)
        .unwrap_or_else(|| pids().count())
}

/// Extracts the total from the `running/total` field (the fourth) of `/proc/loadavg`.
#[cfg_attr(not(target_os = "linux"), allow(dead_code))]
fn parse_loadavg_tasks(loadavg: &str) -> Option<usize> {
    let field = loadavg.split_ascii_whitespace().nth(3)?;
    field.split_once('/')?.1.parse().ok()
}

/// The sound server to report on Linux: PipeWire, else PulseAudio, else ALSA.
///
/// **Fast path (v0.20.6): the session's own sockets.** `$XDG_RUNTIME_DIR/pipewire-0` means
/// PipeWire (whose `pipewire-pulse` also creates `pulse/native`), else `pulse/native` means
/// PulseAudio — two existence checks, ~2 µs. The process scan it replaces had to read
/// `comm` for ~430 of ~700 processes before reaching PipeWire, and was most of the default
/// mode's longest probe.
///
/// **Fallback: every process, as before**, when neither socket exists — no session in this
/// environment, as under `sudo`, whose stripped environment has no `XDG_RUNTIME_DIR`. Such a
/// run still reports the server that is actually running.
#[cfg(target_os = "linux")]
pub(crate) fn audio_server() -> &'static str {
    let runtime = std::env::var_os("XDG_RUNTIME_DIR").map(std::path::PathBuf::from);
    audio_server_with(runtime.as_deref(), || {
        audio_server_from_names(
            pids().filter_map(|pid| std::fs::read_to_string(format!("/proc/{pid}/comm")).ok()),
        )
    })
}

/// [`audio_server`] with the runtime directory and the fallback scan injected, so tests use
/// a temporary directory of real sockets and can prove the scan is skipped.
#[cfg_attr(not(target_os = "linux"), allow(dead_code))]
fn audio_server_with(
    runtime_dir: Option<&std::path::Path>,
    scan: impl FnOnce() -> &'static str,
) -> &'static str {
    let socket = |rel: &str| runtime_dir.is_some_and(|d| is_unix_socket(&d.join(rel)));
    server_from_sockets(socket("pipewire-0"), socket("pulse/native")).unwrap_or_else(scan)
}

/// Which server the session sockets name, or `None` when neither exists.
#[cfg_attr(not(target_os = "linux"), allow(dead_code))]
fn server_from_sockets(pipewire: bool, pulse: bool) -> Option<&'static str> {
    if pipewire {
        Some("PipeWire")
    } else if pulse {
        Some("PulseAudio")
    } else {
        None
    }
}

/// True only for an actual Unix socket: a stray regular file of the same name is not a
/// running server.
#[cfg(unix)]
fn is_unix_socket(path: &std::path::Path) -> bool {
    use std::os::unix::fs::FileTypeExt;
    std::fs::metadata(path).is_ok_and(|m| m.file_type().is_socket())
}

#[cfg(not(unix))]
fn is_unix_socket(_path: &std::path::Path) -> bool {
    false
}

/// Classifies process names; stops at the first PipeWire process, since nothing can
/// outrank it. PulseAudio only wins if no PipeWire process is found at all.
#[cfg_attr(not(target_os = "linux"), allow(dead_code))]
fn audio_server_from_names(names: impl IntoIterator<Item = String>) -> &'static str {
    let mut server = "ALSA";
    for name in names {
        let name = name.to_lowercase();
        if name.contains("pipewire") {
            return "PipeWire";
        }
        if name.contains("pulseaudio") {
            server = "PulseAudio";
        }
    }
    server
}

/// Every process id in `/proc` (the numeric entries; threads live under each one's
/// `task/` and are not listed here).
#[cfg(target_os = "linux")]
fn pids() -> impl Iterator<Item = u32> {
    std::fs::read_dir("/proc")
        .into_iter()
        .flatten()
        .filter_map(|e| e.ok()?.file_name().to_str()?.parse().ok())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;

    fn stat(pid: u32, comm: &str, ppid: u32) -> String {
        format!("{pid} ({comm}) S {ppid} {pid} {pid} 0 -1 4194560 1234 0 0 0")
    }

    #[test]
    fn parse_stat_reads_comm_and_ppid() {
        assert_eq!(
            parse_stat(&stat(4242, "zsh", 4100)),
            Some(("zsh".to_string(), 4100))
        );
    }

    #[test]
    fn parse_stat_takes_comm_to_the_last_paren() {
        // A comm may contain spaces and `)`. Splitting on the first `)` would read
        // "evil" as the name and ") S" as garbage where the ppid should be.
        assert_eq!(
            parse_stat(&stat(7, "evil) S 1 (x", 99)),
            Some(("evil) S 1 (x".to_string(), 99))
        );
        assert_eq!(
            parse_stat(&stat(8, "Web Content", 5)),
            Some(("Web Content".to_string(), 5))
        );
    }

    #[test]
    fn parse_stat_rejects_malformed_input() {
        assert_eq!(parse_stat(""), None);
        assert_eq!(parse_stat("12 zsh S 1"), None, "no parentheses");
        assert_eq!(parse_stat("12 (zsh)"), None, "nothing after comm");
        assert_eq!(parse_stat("12 (zsh) S notanumber"), None);
    }

    fn table(entries: &[(u32, &str, u32)]) -> HashMap<u32, String> {
        entries
            .iter()
            .map(|&(pid, comm, ppid)| (pid, stat(pid, comm, ppid)))
            .collect()
    }

    #[test]
    fn ancestors_walks_nearest_first_up_to_init() {
        let t = table(&[
            (500, "retch", 400),
            (400, "zsh", 300),
            (300, "rio", 1),
            (1, "systemd", 0),
        ]);
        let chain = ancestors_with(500, 64, |pid| t.get(&pid).cloned());
        let names: Vec<&str> = chain.iter().map(|(_, n)| n.as_str()).collect();
        assert_eq!(names, ["retch", "zsh", "rio", "systemd"]);
        assert_eq!(chain[1].0, 400, "pids travel with their names");
    }

    #[test]
    fn ancestors_respects_max() {
        let t = table(&[(5, "a", 4), (4, "b", 3), (3, "c", 2), (2, "d", 1)]);
        let chain = ancestors_with(5, 2, |pid| t.get(&pid).cloned());
        assert_eq!(chain.len(), 2);
        assert_eq!(chain[1].1, "b");
    }

    #[test]
    fn ancestors_stops_where_a_process_cannot_be_read() {
        // The parent exited between reads: the walk ends there, as the old
        // `sys.process(pid)` walk ended on `None`, rather than guessing.
        let t = table(&[(5, "retch", 4)]);
        let chain = ancestors_with(5, 64, |pid| t.get(&pid).cloned());
        assert_eq!(chain, vec![(5, "retch".to_string())]);
    }

    #[test]
    fn ancestors_cannot_loop() {
        let self_parent = table(&[(5, "odd", 5)]);
        assert_eq!(
            ancestors_with(5, 64, |pid| self_parent.get(&pid).cloned()).len(),
            1
        );
        let cycle = table(&[(5, "a", 6), (6, "b", 5)]);
        assert_eq!(
            ancestors_with(5, 64, |pid| cycle.get(&pid).cloned()).len(),
            2
        );
    }

    #[test]
    fn loadavg_total_is_the_fourth_fields_denominator() {
        assert_eq!(
            parse_loadavg_tasks("0.52 0.58 0.59 3/2109 123456\n"),
            Some(2109)
        );
        assert_eq!(parse_loadavg_tasks("0.52 0.58 0.59"), None);
        assert_eq!(parse_loadavg_tasks("0.52 0.58 0.59 2109 1"), None);
    }

    fn names(list: &[&str]) -> Vec<String> {
        list.iter().map(|s| format!("{s}\n")).collect()
    }

    #[test]
    fn audio_server_prefers_pipewire_wherever_it_appears() {
        // pipewire-pulse serves the PulseAudio protocol, so a PulseAudio-looking process
        // must not win when PipeWire is also running, in either order.
        assert_eq!(
            audio_server_from_names(names(&["systemd", "pulseaudio", "pipewire"])),
            "PipeWire"
        );
        assert_eq!(
            audio_server_from_names(names(&["pipewire-pulse", "pulseaudio"])),
            "PipeWire"
        );
    }

    #[test]
    fn audio_server_falls_back_to_pulseaudio_then_alsa() {
        assert_eq!(
            audio_server_from_names(names(&["bash", "pulseaudio"])),
            "PulseAudio"
        );
        assert_eq!(audio_server_from_names(names(&["bash", "sshd"])), "ALSA");
        assert_eq!(audio_server_from_names(Vec::new()), "ALSA");
    }

    #[test]
    fn server_from_sockets_prefers_pipewire() {
        assert_eq!(server_from_sockets(true, true), Some("PipeWire"));
        assert_eq!(server_from_sockets(true, false), Some("PipeWire"));
        assert_eq!(server_from_sockets(false, true), Some("PulseAudio"));
        assert_eq!(server_from_sockets(false, false), None);
    }

    /// A temporary runtime directory holding real listening sockets.
    #[cfg(unix)]
    fn runtime_with(name: &str, sockets: &[&str]) -> std::path::PathBuf {
        let dir = std::env::temp_dir().join(format!("retch-rt-{name}-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(dir.join("pulse")).unwrap();
        for s in sockets {
            // Leaked on purpose: the socket file must outlive this helper.
            std::mem::forget(std::os::unix::net::UnixListener::bind(dir.join(s)).unwrap());
        }
        dir
    }

    #[cfg(unix)]
    #[test]
    fn session_sockets_answer_without_scanning() {
        let never = || -> &'static str { panic!("the process scan must not run") };
        let both = runtime_with("both", &["pipewire-0", "pulse/native"]);
        assert_eq!(audio_server_with(Some(&both), never), "PipeWire");
        let pulse = runtime_with("pulse", &["pulse/native"]);
        assert_eq!(audio_server_with(Some(&pulse), never), "PulseAudio");
        let _ = std::fs::remove_dir_all(&both);
        let _ = std::fs::remove_dir_all(&pulse);
    }

    #[cfg(unix)]
    #[test]
    fn no_session_sockets_falls_back_to_the_scan() {
        // No XDG_RUNTIME_DIR at all, as under sudo.
        assert_eq!(audio_server_with(None, || "PipeWire"), "PipeWire");
        // A runtime dir without the sockets.
        let empty = runtime_with("empty", &[]);
        assert_eq!(audio_server_with(Some(&empty), || "ALSA"), "ALSA");
        // A regular FILE named like the socket is not a running server.
        std::fs::write(empty.join("pipewire-0"), b"").unwrap();
        assert_eq!(audio_server_with(Some(&empty), || "ALSA"), "ALSA");
        let _ = std::fs::remove_dir_all(&empty);
    }

    #[test]
    fn audio_server_matches_case_insensitively() {
        assert_eq!(audio_server_from_names(names(&["PipeWire"])), "PipeWire");
    }

    /// The live walk must start at retch's own process and find a parent — the regression
    /// v0.17.6 fixed was exactly a walk that found nothing when run on its own.
    #[cfg(target_os = "linux")]
    #[test]
    fn live_ancestors_start_at_this_process() {
        let sys = System::new();
        let chain = ancestors(&sys, 64);
        assert_eq!(chain.first().map(|(pid, _)| *pid), Some(std::process::id()));
        assert!(chain.len() >= 2, "the test runner has a parent: {chain:?}");
    }

    /// The primary path, not the fallback: this kernel's `/proc/loadavg` must parse, and
    /// its task total can never be below the number of processes (each process is at
    /// least one task). A small margin absorbs processes starting between the two reads.
    #[cfg(target_os = "linux")]
    #[test]
    fn live_loadavg_parses_and_counts_at_least_every_process() {
        let raw = std::fs::read_to_string("/proc/loadavg").expect("/proc/loadavg");
        let tasks = parse_loadavg_tasks(&raw).expect("loadavg must parse on Linux");
        let processes = pids().count();
        assert!(
            tasks + 16 >= processes,
            "{tasks} tasks < {processes} processes"
        );
    }
}

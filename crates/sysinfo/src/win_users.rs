// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Windows logged-in-user counting via the WTS (Terminal Services) API.
//!
//! `sysinfo`'s `Users` list on Windows exposes local *accounts* keyed by SID, so the
//! Unix `uid >= 1000` heuristic used elsewhere yields 0 (the SID string doesn't parse as
//! a `u32`). Instead, count active interactive *sessions* that have a user attached —
//! `query user` / "who"-style semantics — via `WTSEnumerateSessionsW`. Hand-written
//! `extern "system"` FFI matching the crate's Windows style (see `win_reg.rs`).

use std::ffi::c_void;
use std::ptr;

type Handle = *mut c_void;

/// `WTS_CONNECTSTATE_CLASS::WTSActive` — a session with a user actively logged on.
const WTS_ACTIVE: i32 = 0;
/// `WTS_INFO_CLASS::WTSUserName`.
const WTS_USER_NAME: i32 = 5;

/// `WTS_SESSION_INFOW`. Layout the OS fills by offset (see the `size_of` guard test).
#[repr(C)]
struct WtsSessionInfoW {
    session_id: u32,
    p_win_station_name: *mut u16,
    state: i32,
}

// wtsapi32 exports the WTS session APIs.
#[link(name = "wtsapi32")]
extern "system" {
    fn WTSEnumerateSessionsW(
        server: Handle,
        reserved: u32,
        version: u32,
        pp_session_info: *mut *mut WtsSessionInfoW,
        p_count: *mut u32,
    ) -> i32;
    fn WTSQuerySessionInformationW(
        server: Handle,
        session_id: u32,
        info_class: i32,
        pp_buffer: *mut *mut u16,
        p_bytes_returned: *mut u32,
    ) -> i32;
    fn WTSFreeMemory(memory: *mut c_void);
}

/// Number of active interactive user sessions on this machine.
///
/// Enumerates all sessions, keeps those in the `WTSActive` state that have a non-empty
/// user name (excludes the services session 0 and disconnected RDP sessions), and counts
/// them. Returns 0 on any API failure — the caller suppresses the field when the count is
/// 0, so a failed probe shows nothing rather than a misleading "0".
pub fn active_user_session_count() -> usize {
    let mut sessions: Vec<(i32, Option<String>)> = Vec::new();
    // SAFETY: `WTS_CURRENT_SERVER_HANDLE` is NULL. On success the API allocates the
    // session array and reports its length via `count`; we free it with `WTSFreeMemory`.
    unsafe {
        let mut p_info: *mut WtsSessionInfoW = ptr::null_mut();
        let mut count: u32 = 0;
        if WTSEnumerateSessionsW(ptr::null_mut(), 0, 1, &mut p_info, &mut count) == 0
            || p_info.is_null()
        {
            return 0;
        }
        for i in 0..count as isize {
            let session = &*p_info.offset(i);
            let user = query_user_name(session.session_id);
            sessions.push((session.state, user));
        }
        WTSFreeMemory(p_info as *mut c_void);
    }
    count_active_user_sessions(&sessions)
}

/// Queries the user name for a session, or `None` if unattached/empty.
///
/// # Safety
/// Calls into `wtsapi32`; the returned buffer is owned by WTS and freed here.
unsafe fn query_user_name(session_id: u32) -> Option<String> {
    let mut buf: *mut u16 = ptr::null_mut();
    let mut bytes: u32 = 0;
    if WTSQuerySessionInformationW(
        ptr::null_mut(),
        session_id,
        WTS_USER_NAME,
        &mut buf,
        &mut bytes,
    ) == 0
        || buf.is_null()
    {
        return None;
    }
    // `bytes` counts the returned wide string including its NUL terminator.
    let len = (bytes as usize / 2).saturating_sub(1);
    let name = if len == 0 {
        String::new()
    } else {
        String::from_utf16_lossy(std::slice::from_raw_parts(buf, len))
            .trim()
            .to_string()
    };
    WTSFreeMemory(buf as *mut c_void);
    if name.is_empty() {
        None
    } else {
        Some(name)
    }
}

/// Counts sessions that are `WTSActive` and have a non-empty user name.
///
/// Split out of [`active_user_session_count`] so the selection logic is unit-tested
/// without the WTS API (the FFI itself can't be exercised deterministically in tests).
fn count_active_user_sessions(sessions: &[(i32, Option<String>)]) -> usize {
    sessions
        .iter()
        .filter(|(state, user)| {
            *state == WTS_ACTIVE && user.as_deref().is_some_and(|n| !n.is_empty())
        })
        .count()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::mem::size_of;

    #[test]
    fn test_count_active_user_sessions() {
        let sessions = vec![
            // Services session 0: active but no user -> not counted.
            (WTS_ACTIVE, None),
            // Console user actively logged on -> counted.
            (WTS_ACTIVE, Some("kento".to_string())),
            // Disconnected RDP session with a user -> not active, not counted.
            (4 /* WTSDisconnected */, Some("remote".to_string())),
            // Active but empty username -> not counted.
            (WTS_ACTIVE, Some(String::new())),
        ];
        assert_eq!(count_active_user_sessions(&sessions), 1);

        // No sessions at all -> 0 (the caller then hides the field).
        assert_eq!(count_active_user_sessions(&[]), 0);

        // Two distinct active users (fast user switching) -> 2.
        let two = vec![
            (WTS_ACTIVE, Some("a".to_string())),
            (WTS_ACTIVE, Some("b".to_string())),
        ];
        assert_eq!(count_active_user_sessions(&two), 2);
    }

    #[test]
    fn test_wts_session_info_layout() {
        // WTS_SESSION_INFOW: DWORD (4) + pad (4) + LPWSTR (8) + WTS_CONNECTSTATE_CLASS (4)
        // + tail pad (4) = 24 on 64-bit Windows. A layout regression would misread every
        // session's state/id, so pin the size.
        assert_eq!(size_of::<WtsSessionInfoW>(), 24);
    }
}

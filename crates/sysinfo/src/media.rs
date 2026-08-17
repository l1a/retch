// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Active media player and currently playing track detection.
//!
//! Provides 100% native detection without forking child processes:
//! - **Linux**: Direct Unix domain socket connection to `$DBUS_SESSION_BUS_ADDRESS` /
//!   `/run/user/<uid>/bus` speaking the binary D-Bus wire protocol for MPRIS (`org.mpris.MediaPlayer2.*`).
//! - **Windows**: Native WinRT COM FFI via `combase.dll` querying
//!   `Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager`.
//! - **macOS**: Native Objective-C runtime FFI via `macos_ffi.rs` querying running media apps.

#![allow(clippy::manual_is_multiple_of)]

/// Information about the active media player and currently playing track.
#[derive(Debug, Clone, PartialEq, Eq, Default)]
pub struct MediaInfo {
    /// Normalized media player name (e.g. "Spotify", "VLC media player", "Firefox").
    pub player: Option<String>,
    /// Playback status (e.g. "Playing", "Paused", "Stopped").
    pub status: Option<String>,
    /// Track artist.
    pub artist: Option<String>,
    /// Track title.
    pub title: Option<String>,
    /// Track album.
    pub album: Option<String>,
}

impl MediaInfo {
    /// Formats the player line (e.g. `"Spotify (Playing)"` or `"VLC media player"`).
    pub fn format_player(&self) -> Option<String> {
        let player = self.player.as_deref()?;
        if let Some(status) = self.status.as_deref() {
            if !status.is_empty() {
                return Some(format!("{player} ({status})"));
            }
        }
        Some(player.to_string())
    }

    /// Formats the media track line (e.g. `"Artist - Title"` or `"Title"`).
    pub fn format_media(&self) -> Option<String> {
        match (&self.artist, &self.title) {
            (Some(artist), Some(title)) if !artist.is_empty() && !title.is_empty() => {
                Some(format!("{artist} - {title}"))
            }
            (_, Some(title)) if !title.is_empty() => Some(title.clone()),
            (Some(artist), _) if !artist.is_empty() => Some(artist.clone()),
            _ => None,
        }
    }
}

/// Detects the active media player and currently playing track.
///
/// Returns `(Option<media_string>, Option<player_string>)`.
pub fn detect_media() -> (Option<String>, Option<String>) {
    let info = detect_media_info();
    let media_str = info.as_ref().and_then(|i| i.format_media());
    let player_str = info.as_ref().and_then(|i| i.format_player());
    (media_str, player_str)
}

/// Detects raw `MediaInfo` from the platform's native media subsystem.
pub fn detect_media_info() -> Option<MediaInfo> {
    #[cfg(target_os = "linux")]
    {
        linux_dbus::detect_mpris_media()
    }

    #[cfg(target_os = "windows")]
    {
        win_media::detect_winrt_media()
    }

    #[cfg(target_os = "macos")]
    {
        macos_media::detect_macos_media()
    }

    #[cfg(not(any(target_os = "linux", target_os = "windows", target_os = "macos")))]
    {
        None
    }
}

// ─── Windows Backend (Native WinRT COM FFI) ──────────────────────────────────

#[cfg(target_os = "windows")]
pub mod win_media {
    use super::MediaInfo;
    use std::ffi::c_void;
    use std::ptr;

    type HResult = i32;
    type HString = *mut c_void;

    #[repr(C)]
    #[derive(Debug, Clone, Copy)]
    pub struct Guid {
        pub data1: u32,
        pub data2: u16,
        pub data3: u16,
        pub data4: [u8; 8],
    }

    #[repr(C)]
    pub struct HstringHeader {
        pub flags: u32,
        pub length: u32,
        pub padding1: u32,
        pub padding2: u32,
        pub data: *const c_void,
    }

    #[repr(C)]
    struct IUnknownVtbl {
        pub query_interface: unsafe extern "system" fn(
            this: *mut c_void,
            riid: *const Guid,
            ppv: *mut *mut c_void,
        ) -> HResult,
        pub add_ref: unsafe extern "system" fn(this: *mut c_void) -> u32,
        pub release: unsafe extern "system" fn(this: *mut c_void) -> u32,
    }

    #[repr(C)]
    struct IInspectableVtbl {
        pub base: IUnknownVtbl,
        pub get_iids: unsafe extern "system" fn(
            this: *mut c_void,
            count: *mut u32,
            iids: *mut *mut Guid,
        ) -> HResult,
        pub get_runtime_class_name:
            unsafe extern "system" fn(this: *mut c_void, name: *mut HString) -> HResult,
        pub get_trust_level:
            unsafe extern "system" fn(this: *mut c_void, trust_level: *mut i32) -> HResult,
    }

    #[repr(C)]
    struct IAsyncInfoVtbl {
        pub base: IInspectableVtbl,
        pub get_id: unsafe extern "system" fn(this: *mut c_void, id: *mut u32) -> HResult,
        pub get_status: unsafe extern "system" fn(this: *mut c_void, status: *mut u32) -> HResult,
        pub get_error_code:
            unsafe extern "system" fn(this: *mut c_void, error_code: *mut HResult) -> HResult,
        pub cancel: unsafe extern "system" fn(this: *mut c_void) -> HResult,
        pub close: unsafe extern "system" fn(this: *mut c_void) -> HResult,
    }

    #[repr(C)]
    struct IAsyncOperationVtbl {
        pub base: IInspectableVtbl,
        pub put_completed:
            unsafe extern "system" fn(this: *mut c_void, handler: *mut c_void) -> HResult,
        pub get_completed:
            unsafe extern "system" fn(this: *mut c_void, handler: *mut *mut c_void) -> HResult,
        pub get_results:
            unsafe extern "system" fn(this: *mut c_void, results: *mut *mut c_void) -> HResult,
    }

    #[repr(C)]
    struct IStaticsVtbl {
        pub base: IInspectableVtbl,
        pub request_async:
            unsafe extern "system" fn(this: *mut c_void, operation: *mut *mut c_void) -> HResult,
    }

    #[repr(C)]
    struct ISessionManagerVtbl {
        pub base: IInspectableVtbl,
        pub get_current_session:
            unsafe extern "system" fn(this: *mut c_void, result: *mut *mut c_void) -> HResult,
    }

    #[repr(C)]
    struct ISessionVtbl {
        pub base: IInspectableVtbl,
        pub get_source_app_user_model_id:
            unsafe extern "system" fn(this: *mut c_void, value: *mut HString) -> HResult,
        pub try_get_media_properties_async:
            unsafe extern "system" fn(this: *mut c_void, operation: *mut *mut c_void) -> HResult,
        pub get_playback_info:
            unsafe extern "system" fn(this: *mut c_void, result: *mut *mut c_void) -> HResult,
    }

    #[repr(C)]
    struct IPlaybackInfoVtbl {
        pub base: IInspectableVtbl,
        pub get_controls:
            unsafe extern "system" fn(this: *mut c_void, value: *mut *mut c_void) -> HResult,
        pub get_playback_status:
            unsafe extern "system" fn(this: *mut c_void, value: *mut i32) -> HResult,
    }

    #[repr(C)]
    struct IMediaPropertiesVtbl {
        pub base: IInspectableVtbl,
        pub get_title: unsafe extern "system" fn(this: *mut c_void, value: *mut HString) -> HResult,
        pub get_subtitle:
            unsafe extern "system" fn(this: *mut c_void, value: *mut HString) -> HResult,
        pub get_artist:
            unsafe extern "system" fn(this: *mut c_void, value: *mut HString) -> HResult,
        pub get_album_artist:
            unsafe extern "system" fn(this: *mut c_void, value: *mut HString) -> HResult,
        pub get_album_title:
            unsafe extern "system" fn(this: *mut c_void, value: *mut HString) -> HResult,
    }

    const IID_IASYNC_INFO: Guid = Guid {
        data1: 0x0000_0036,
        data2: 0x0000,
        data3: 0x0000,
        data4: [0xc0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x46],
    };

    const IID_ISTATICS: Guid = Guid {
        data1: 0x2050c4ee,
        data2: 0x11a0,
        data3: 0x57de,
        data4: [0xae, 0xd7, 0xc9, 0x7c, 0x70, 0x33, 0x82, 0x45],
    };

    type FnRoInitialize = unsafe extern "system" fn(init_type: i32) -> HResult;
    type FnRoGetActivationFactory = unsafe extern "system" fn(
        activatable_class_id: HString,
        iid: *const Guid,
        factory: *mut *mut c_void,
    ) -> HResult;
    type FnWindowsCreateStringReference = unsafe extern "system" fn(
        source_string: *const u16,
        length: u32,
        hstring_header: *mut HstringHeader,
        string: *mut HString,
    ) -> HResult;
    type FnWindowsGetStringRawBuffer =
        unsafe extern "system" fn(string: HString, length: *mut u32) -> *const u16;
    type FnWindowsDeleteString = unsafe extern "system" fn(string: HString) -> HResult;

    #[link(name = "kernel32")]
    extern "system" {
        fn LoadLibraryA(name: *const i8) -> *mut c_void;
        fn GetProcAddress(module: *mut c_void, name: *const i8) -> *mut c_void;
    }

    unsafe fn get_string_buffer(
        get_buf: FnWindowsGetStringRawBuffer,
        hs: HString,
    ) -> Option<String> {
        if hs.is_null() {
            return None;
        }
        let mut len: u32 = 0;
        let ptr = get_buf(hs, &mut len);
        if ptr.is_null() || len == 0 {
            return None;
        }
        let slice = std::slice::from_raw_parts(ptr, len as usize);
        let s = String::from_utf16_lossy(slice).trim().to_string();
        if s.is_empty() {
            None
        } else {
            Some(s)
        }
    }

    unsafe fn release_com(ptr: *mut c_void) {
        if !ptr.is_null() {
            let vtbl = *(ptr as *mut *mut IUnknownVtbl);
            ((*vtbl).release)(ptr);
        }
    }

    unsafe fn wait_async(async_op: *mut c_void, timeout_ms: u64) -> bool {
        let mut async_info: *mut c_void = ptr::null_mut();
        let vtbl = *(async_op as *mut *mut IUnknownVtbl);
        let hr = ((*vtbl).query_interface)(async_op, &IID_IASYNC_INFO, &mut async_info);
        if hr < 0 || async_info.is_null() {
            return false;
        }
        let info_vtbl = *(async_info as *mut *mut IAsyncInfoVtbl);
        let start = std::time::Instant::now();
        let mut completed = false;
        while start.elapsed().as_millis() < timeout_ms as u128 {
            let mut status: u32 = 0;
            let hr = ((*info_vtbl).get_status)(async_info, &mut status);
            if hr >= 0 && status != 0 {
                completed = status == 1; // 1 = Completed
                break;
            }
            std::thread::sleep(std::time::Duration::from_millis(1));
        }
        release_com(async_info);
        completed
    }

    /// Cleans and normalizes Windows AppUserModelIDs / executable names into friendly player names.
    pub fn clean_app_user_model_id(id: &str) -> String {
        let lower = id.to_lowercase();
        if lower.contains("spotify") {
            "Spotify".to_string()
        } else if lower.contains("zune")
            || lower.contains("mediaplayer")
            || lower.contains("groove")
        {
            "Media Player".to_string()
        } else if lower.contains("msedge") {
            "Microsoft Edge".to_string()
        } else if lower.contains("chrome") {
            "Google Chrome".to_string()
        } else if lower.contains("firefox") {
            "Firefox".to_string()
        } else if lower.contains("vlc") {
            "VLC media player".to_string()
        } else if lower.contains("foobar2000") {
            "foobar2000".to_string()
        } else if lower.contains("aimp") {
            "AIMP".to_string()
        } else if lower.contains("itunes") {
            "iTunes".to_string()
        } else if lower.contains("apple.music") || lower.contains("applemusic") {
            "Apple Music".to_string()
        } else {
            // Strip executable extension and trailing package IDs if present
            let base = id
                .split('!')
                .next()
                .unwrap_or(id)
                .trim_end_matches(".exe")
                .trim();
            base.to_string()
        }
    }

    /// Converts Windows WinRT PlaybackStatus integer to a display string.
    pub fn format_win_playback_status(status: i32) -> Option<String> {
        match status {
            4 => Some("Playing".to_string()),
            5 => Some("Paused".to_string()),
            3 => Some("Stopped".to_string()),
            1 | 2 => Some("Buffering".to_string()),
            _ => None,
        }
    }

    /// Detects active media information via native WinRT COM FFI.
    pub fn detect_winrt_media() -> Option<MediaInfo> {
        // SAFETY: All pointers are validated, HSTRINGs freed with WindowsDeleteString,
        // and COM interfaces released with IUnknown::Release.
        unsafe {
            let combase = LoadLibraryA(c"combase.dll".as_ptr());
            if combase.is_null() {
                return None;
            }

            let ro_init_ptr = GetProcAddress(combase, c"RoInitialize".as_ptr());
            let ro_get_factory_ptr = GetProcAddress(combase, c"RoGetActivationFactory".as_ptr());
            let str_ref_ptr = GetProcAddress(combase, c"WindowsCreateStringReference".as_ptr());
            let str_buf_ptr = GetProcAddress(combase, c"WindowsGetStringRawBuffer".as_ptr());
            let str_del_ptr = GetProcAddress(combase, c"WindowsDeleteString".as_ptr());

            if ro_init_ptr.is_null()
                || ro_get_factory_ptr.is_null()
                || str_ref_ptr.is_null()
                || str_buf_ptr.is_null()
                || str_del_ptr.is_null()
            {
                return None;
            }

            let ro_init: FnRoInitialize = std::mem::transmute(ro_init_ptr);
            let ro_get_factory: FnRoGetActivationFactory = std::mem::transmute(ro_get_factory_ptr);
            let str_ref: FnWindowsCreateStringReference = std::mem::transmute(str_ref_ptr);
            let str_buf: FnWindowsGetStringRawBuffer = std::mem::transmute(str_buf_ptr);
            let str_del: FnWindowsDeleteString = std::mem::transmute(str_del_ptr);

            // Initialize WinRT for the thread (RO_INIT_MULTITHREADED = 1)
            ro_init(1);

            let class_name =
                "Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager\0";
            let wide_class: Vec<u16> = class_name.encode_utf16().collect();
            let mut header = std::mem::zeroed::<HstringHeader>();
            let mut hs_class: HString = ptr::null_mut();
            str_ref(
                wide_class.as_ptr(),
                (wide_class.len() - 1) as u32,
                &mut header,
                &mut hs_class,
            );

            let mut factory: *mut c_void = ptr::null_mut();
            let hr = ro_get_factory(hs_class, &IID_ISTATICS, &mut factory);
            if hr < 0 || factory.is_null() {
                return None;
            }

            let statics_vtbl = *(factory as *mut *mut IStaticsVtbl);
            let mut async_op: *mut c_void = ptr::null_mut();
            let hr = ((*statics_vtbl).request_async)(factory, &mut async_op);
            release_com(factory);

            if hr < 0 || async_op.is_null() {
                return None;
            }

            if !wait_async(async_op, 30) {
                release_com(async_op);
                return None;
            }

            let op_vtbl = *(async_op as *mut *mut IAsyncOperationVtbl);
            let mut session_mgr: *mut c_void = ptr::null_mut();
            let hr = ((*op_vtbl).get_results)(async_op, &mut session_mgr);
            release_com(async_op);

            if hr < 0 || session_mgr.is_null() {
                return None;
            }

            let mgr_vtbl = *(session_mgr as *mut *mut ISessionManagerVtbl);
            let mut session: *mut c_void = ptr::null_mut();
            let hr = ((*mgr_vtbl).get_current_session)(session_mgr, &mut session);
            release_com(session_mgr);

            if hr < 0 || session.is_null() {
                return None;
            }

            let session_vtbl = *(session as *mut *mut ISessionVtbl);
            let mut app_id: HString = ptr::null_mut();
            let _ = ((*session_vtbl).get_source_app_user_model_id)(session, &mut app_id);
            let player = get_string_buffer(str_buf, app_id).map(|s| clean_app_user_model_id(&s));
            str_del(app_id);

            let mut playback_info: *mut c_void = ptr::null_mut();
            let mut status = None;
            let hr = ((*session_vtbl).get_playback_info)(session, &mut playback_info);
            if hr >= 0 && !playback_info.is_null() {
                let pb_vtbl = *(playback_info as *mut *mut IPlaybackInfoVtbl);
                let mut status_code: i32 = 0;
                if ((*pb_vtbl).get_playback_status)(playback_info, &mut status_code) >= 0 {
                    status = format_win_playback_status(status_code);
                }
                release_com(playback_info);
            }

            let mut title = None;
            let mut artist = None;
            let mut album = None;

            let mut async_props: *mut c_void = ptr::null_mut();
            let hr = ((*session_vtbl).try_get_media_properties_async)(session, &mut async_props);
            if hr >= 0 && !async_props.is_null() {
                if wait_async(async_props, 30) {
                    let props_op_vtbl = *(async_props as *mut *mut IAsyncOperationVtbl);
                    let mut props: *mut c_void = ptr::null_mut();
                    let hr = ((*props_op_vtbl).get_results)(async_props, &mut props);
                    if hr >= 0 && !props.is_null() {
                        let props_vtbl = *(props as *mut *mut IMediaPropertiesVtbl);
                        let mut title_hs: HString = ptr::null_mut();
                        let mut artist_hs: HString = ptr::null_mut();
                        let mut album_hs: HString = ptr::null_mut();

                        if ((*props_vtbl).get_title)(props, &mut title_hs) >= 0 {
                            title = get_string_buffer(str_buf, title_hs);
                        }
                        if ((*props_vtbl).get_artist)(props, &mut artist_hs) >= 0 {
                            artist = get_string_buffer(str_buf, artist_hs);
                        }
                        if ((*props_vtbl).get_album_title)(props, &mut album_hs) >= 0 {
                            album = get_string_buffer(str_buf, album_hs);
                        }

                        str_del(title_hs);
                        str_del(artist_hs);
                        str_del(album_hs);
                        release_com(props);
                    }
                }
                release_com(async_props);
            }

            release_com(session);

            if player.is_none() && title.is_none() && artist.is_none() {
                None
            } else {
                Some(MediaInfo {
                    player,
                    status,
                    artist,
                    title,
                    album,
                })
            }
        }
    }
}

// ─── Linux Backend (Native D-Bus Wire Protocol) ──────────────────────────────

// ─── Linux Backend (Native D-Bus Wire Protocol) ──────────────────────────────

#[cfg(any(target_os = "linux", test))]
pub mod linux_dbus {
    use super::MediaInfo;
    use std::io::{Read, Write};
    use std::path::PathBuf;
    use std::time::Duration;

    #[cfg(target_os = "linux")]
    use std::os::unix::net::UnixStream;

    /// Locates the user's session D-Bus Unix domain socket path.
    pub fn get_session_bus_path() -> Option<PathBuf> {
        if let Ok(addr) = std::env::var("DBUS_SESSION_BUS_ADDRESS") {
            for transport in addr.split(';') {
                for part in transport.split(',') {
                    if let Some(path) = part.strip_prefix("unix:path=") {
                        let p = PathBuf::from(path);
                        if p.exists() {
                            return Some(p);
                        }
                    }
                }
            }
        }
        #[cfg(target_os = "linux")]
        {
            let uid = unsafe { libc::getuid() };
            let default_path = PathBuf::from(format!("/run/user/{uid}/bus"));
            if default_path.exists() {
                return Some(default_path);
            }
        }
        None
    }

    /// Performs SASL authentication on a freshly connected D-Bus socket.
    #[cfg(target_os = "linux")]
    fn authenticate_dbus(stream: &mut UnixStream) -> bool {
        let uid = unsafe { libc::getuid() };
        let uid_str = uid.to_string();
        let hex_uid: String = uid_str.bytes().map(|b| format!("{b:02x}")).collect();

        // 1. Send single NUL byte followed by AUTH EXTERNAL
        let auth_cmd = format!("\0AUTH EXTERNAL {hex_uid}\r\n");
        if stream.write_all(auth_cmd.as_bytes()).is_err() {
            return false;
        }

        // 2. Read exactly one response line until \r\n (byte-by-byte to avoid eating binary data)
        let mut line = Vec::new();
        let mut b = [0u8; 1];
        while line.len() < 256 {
            match stream.read(&mut b) {
                Ok(1) => {
                    line.push(b[0]);
                    if line.ends_with(b"\r\n") {
                        break;
                    }
                }
                _ => return false,
            }
        }

        let resp = String::from_utf8_lossy(&line);
        if !resp.starts_with("OK") {
            return false;
        }

        // 3. Send BEGIN to switch to binary protocol mode
        if stream.write_all(b"BEGIN\r\n").is_err() {
            return false;
        }

        true
    }

    /// Writes a D-Bus method call message into a byte buffer.
    pub fn encode_dbus_call(
        serial: u32,
        destination: &str,
        path: &str,
        interface: &str,
        member: &str,
        signature: Option<&str>,
        body: &[u8],
    ) -> Vec<u8> {
        let mut header_fields = Vec::new();

        // 1: PATH (Object Path)
        encode_header_field(&mut header_fields, 1, b'o', path.as_bytes());
        // 2: INTERFACE (String)
        encode_header_field(&mut header_fields, 2, b's', interface.as_bytes());
        // 3: MEMBER (String)
        encode_header_field(&mut header_fields, 3, b's', member.as_bytes());
        // 6: DESTINATION (String)
        encode_header_field(&mut header_fields, 6, b's', destination.as_bytes());
        if let Some(sig) = signature {
            // 8: SIGNATURE (Signature)
            encode_header_field(&mut header_fields, 8, b'g', sig.as_bytes());
        }

        let mut msg = vec![
            b'l', // Little-endian
            1,    // Method call
            0,    // Flags
            1,    // Protocol version
        ];
        msg.extend_from_slice(&(body.len() as u32).to_le_bytes());
        msg.extend_from_slice(&serial.to_le_bytes());
        msg.extend_from_slice(&(header_fields.len() as u32).to_le_bytes());
        msg.extend_from_slice(&header_fields);

        // Pad header to 8-byte boundary
        while msg.len() % 8 != 0 {
            msg.push(0);
        }
        msg.extend_from_slice(body);
        msg
    }

    fn encode_header_field(out: &mut Vec<u8>, field_code: u8, sig_byte: u8, val: &[u8]) {
        // Struct alignment to 8 bytes in header fields array
        while out.len() % 8 != 0 {
            out.push(0);
        }
        out.push(field_code);
        out.push(1); // Signature len
        out.push(sig_byte);
        out.push(0); // Null terminator for signature
        if sig_byte == b'g' {
            out.push(val.len() as u8);
            out.extend_from_slice(val);
            out.push(0);
        } else {
            // String (s) or Object Path (o)
            while out.len() % 4 != 0 {
                out.push(0);
            }
            out.extend_from_slice(&(val.len() as u32).to_le_bytes());
            out.extend_from_slice(val);
            out.push(0);
        }
    }

    /// Reads a single complete D-Bus message from the stream.
    #[cfg(target_os = "linux")]
    pub fn read_dbus_message(stream: &mut UnixStream) -> Option<Vec<u8>> {
        let mut header_buf = [0u8; 16];
        stream.read_exact(&mut header_buf).ok()?;

        let body_len = u32::from_le_bytes(header_buf[4..8].try_into().ok()?) as usize;
        let fields_len = u32::from_le_bytes(header_buf[12..16].try_into().ok()?) as usize;
        let header_padding = (8 - (fields_len % 8)) % 8;
        let total_remaining = fields_len + header_padding + body_len;

        let mut rest = vec![0u8; total_remaining];
        stream.read_exact(&mut rest).ok()?;

        let mut full = Vec::with_capacity(16 + total_remaining);
        full.extend_from_slice(&header_buf);
        full.extend_from_slice(&rest);
        Some(full)
    }

    /// Extracts message type from a D-Bus binary message header.
    /// 1 = MethodCall, 2 = MethodReturn, 3 = Error, 4 = Signal.
    pub fn get_message_type(msg: &[u8]) -> Option<u8> {
        if msg.len() >= 2 {
            Some(msg[1])
        } else {
            None
        }
    }

    /// Extracts reply serial number from D-Bus header field 5 (REPLY_SERIAL).
    pub fn get_reply_serial(msg: &[u8]) -> Option<u32> {
        if msg.len() < 24 {
            return None;
        }
        let fields_len = u32::from_le_bytes(msg[12..16].try_into().ok()?) as usize;
        let end = (16 + fields_len).min(msg.len());
        let mut pos = 16;
        while pos + 8 <= end {
            while pos % 8 != 0 && pos < end {
                pos += 1;
            }
            if pos + 8 > end {
                break;
            }
            if msg[pos] == 5 && msg[pos + 1] == 1 && msg[pos + 2] == b'u' && msg[pos + 3] == 0 {
                return Some(u32::from_le_bytes(msg[pos + 4..pos + 8].try_into().ok()?));
            }
            pos += 1;
        }
        None
    }

    /// Reads incoming D-Bus messages, skipping asynchronous signals (e.g. `NameAcquired`),
    /// until receiving the matching `MethodReturn` (2) or `Error` (3) for `expected_serial`.
    #[cfg(target_os = "linux")]
    pub fn read_dbus_reply(stream: &mut UnixStream, expected_serial: u32) -> Option<Vec<u8>> {
        for _ in 0..10 {
            let msg = read_dbus_message(stream)?;
            let msg_type = get_message_type(&msg)?;
            if msg_type == 2 {
                // MethodReturn
                if let Some(serial) = get_reply_serial(&msg) {
                    if serial == expected_serial {
                        return Some(msg);
                    }
                } else {
                    return Some(msg);
                }
            } else if msg_type == 3 {
                // Error reply
                if let Some(serial) = get_reply_serial(&msg) {
                    if serial == expected_serial {
                        return None;
                    }
                }
            }
            // If message was a Signal (4), loop and read the next message
        }
        None
    }

    /// Extracts string list from a `ListNames` reply body (`as`).
    pub fn parse_name_list(msg: &[u8]) -> Vec<String> {
        if msg.len() < 16 {
            return Vec::new();
        }
        let fields_len = u32::from_le_bytes(msg[12..16].try_into().unwrap_or([0; 4])) as usize;
        let header_padding = (8 - (fields_len % 8)) % 8;
        let body_offset = 16 + fields_len + header_padding;
        if body_offset + 4 > msg.len() {
            return Vec::new();
        }

        let array_len = u32::from_le_bytes(
            msg[body_offset..body_offset + 4]
                .try_into()
                .unwrap_or([0; 4]),
        ) as usize;
        let mut pos = body_offset + 4;
        let end = (pos + array_len).min(msg.len());
        let mut names = Vec::new();

        while pos + 4 <= end {
            while pos % 4 != 0 && pos < end {
                pos += 1;
            }
            if pos + 4 > end {
                break;
            }
            let s_len = u32::from_le_bytes(msg[pos..pos + 4].try_into().unwrap_or([0; 4])) as usize;
            pos += 4;
            if pos + s_len <= end {
                if let Ok(s) = std::str::from_utf8(&msg[pos..pos + s_len]) {
                    names.push(s.to_string());
                }
                pos += s_len + 1; // skip string + null terminator
            } else {
                break;
            }
        }
        names
    }

    /// Parses player name from a D-Bus service name (e.g. `"org.mpris.MediaPlayer2.spotify"` -> `"Spotify"`).
    pub fn clean_mpris_service_name(service: &str) -> String {
        let raw_name = service
            .strip_prefix("org.mpris.MediaPlayer2.")
            .unwrap_or(service);

        // Strip instance suffixes (e.g. "vlc.instance1234" -> "vlc", "firefox.instance_1_42" -> "firefox")
        let base_name = raw_name
            .split(".instance")
            .next()
            .unwrap_or(raw_name)
            .trim();

        let lower = base_name.to_lowercase();
        if lower == "spotify" {
            "Spotify".to_string()
        } else if lower == "vlc" {
            "VLC media player".to_string()
        } else if lower == "chrome" || lower == "google-chrome" {
            "Google Chrome".to_string()
        } else if lower == "chromium" {
            "Chromium".to_string()
        } else if lower == "firefox" {
            "Firefox".to_string()
        } else if lower == "brave" {
            "Brave".to_string()
        } else if lower == "mpv" {
            "mpv".to_string()
        } else if lower == "celluloid" {
            "Celluloid".to_string()
        } else if lower == "rhythmbox" {
            "Rhythmbox".to_string()
        } else if lower == "cider" {
            "Cider".to_string()
        } else if lower == "audacious" {
            "Audacious".to_string()
        } else if lower == "clementine" {
            "Clementine".to_string()
        } else if lower == "strawberry" {
            "Strawberry".to_string()
        } else if lower == "amberol" {
            "Amberol".to_string()
        } else if lower == "elisa" {
            "Elisa".to_string()
        } else if lower == "lollypop" {
            "Lollypop".to_string()
        } else {
            // Capitalize first letter of player name
            let mut chars = base_name.chars();
            match chars.next() {
                None => String::new(),
                Some(f) => f.to_uppercase().collect::<String>() + chars.as_str(),
            }
        }
    }

    /// Scans a D-Bus dictionary response for string values by key name.
    pub fn extract_mpris_string(body: &[u8], key: &str) -> Option<String> {
        let key_bytes = key.as_bytes();
        let mut pos = 0;
        while pos + key_bytes.len() + 6 < body.len() {
            if &body[pos..pos + key_bytes.len()] == key_bytes {
                let search_start = pos + key_bytes.len();
                let search_end = (search_start + 32).min(body.len());
                for s in search_start..search_end.saturating_sub(6) {
                    if body[s] == 1 && body[s + 1] == b's' && body[s + 2] == 0 {
                        // Scan for the 4-byte string length
                        let mut str_pos = s + 3;
                        while str_pos < search_end {
                            if str_pos + 4 <= body.len() {
                                let slen = u32::from_le_bytes(
                                    body[str_pos..str_pos + 4].try_into().unwrap_or([0; 4]),
                                ) as usize;
                                if slen > 0 && slen < 4096 && str_pos + 4 + slen <= body.len() {
                                    if let Ok(val) =
                                        std::str::from_utf8(&body[str_pos + 4..str_pos + 4 + slen])
                                    {
                                        let trimmed = val.trim();
                                        if !trimmed.is_empty()
                                            && val.chars().all(|c| !c.is_control())
                                        {
                                            return Some(trimmed.to_string());
                                        }
                                    }
                                }
                            }
                            str_pos += 1;
                        }
                    }
                }
            }
            pos += 1;
        }
        None
    }

    /// Scans a D-Bus dictionary response for string array values (e.g. `xesam:artist` -> `as`).
    pub fn extract_mpris_string_list(body: &[u8], key: &str) -> Option<String> {
        let key_bytes = key.as_bytes();
        let mut pos = 0;
        while pos + key_bytes.len() + 8 < body.len() {
            if &body[pos..pos + key_bytes.len()] == key_bytes {
                let search_start = pos + key_bytes.len();
                let search_end = (search_start + 32).min(body.len());
                for s in search_start..search_end.saturating_sub(8) {
                    if body[s] == 2
                        && body[s + 1] == b'a'
                        && body[s + 2] == b's'
                        && body[s + 3] == 0
                    {
                        let mut arr_header_pos = s + 4;
                        while arr_header_pos < search_end {
                            if arr_header_pos + 4 <= body.len() {
                                let arr_len = u32::from_le_bytes(
                                    body[arr_header_pos..arr_header_pos + 4]
                                        .try_into()
                                        .unwrap_or([0; 4]),
                                ) as usize;
                                if arr_len > 0
                                    && arr_len < 65536
                                    && arr_header_pos + 4 + arr_len <= body.len()
                                {
                                    let mut elem_pos = arr_header_pos + 4;
                                    let end = elem_pos + arr_len;
                                    let mut items = Vec::new();
                                    while elem_pos + 4 <= end {
                                        while elem_pos < end && body[elem_pos] == 0 {
                                            elem_pos += 1;
                                        }
                                        if elem_pos + 4 > end {
                                            break;
                                        }
                                        let slen = u32::from_le_bytes(
                                            body[elem_pos..elem_pos + 4]
                                                .try_into()
                                                .unwrap_or([0; 4]),
                                        )
                                            as usize;
                                        elem_pos += 4;
                                        if slen > 0 && elem_pos + slen <= end {
                                            if let Ok(item_str) = std::str::from_utf8(
                                                &body[elem_pos..elem_pos + slen],
                                            ) {
                                                let trimmed = item_str.trim();
                                                if !trimmed.is_empty() {
                                                    items.push(trimmed.to_string());
                                                }
                                            }
                                            elem_pos += slen + 1; // skip string + null terminator
                                        } else {
                                            break;
                                        }
                                    }
                                    if !items.is_empty() {
                                        return Some(items.join(", "));
                                    }
                                }
                            }
                            arr_header_pos += 1;
                        }
                    }
                }
            }
            pos += 1;
        }
        None
    }

    /// Detects active media information on Linux via direct Unix socket D-Bus communication.
    #[cfg(target_os = "linux")]
    pub fn detect_mpris_media() -> Option<MediaInfo> {
        let bus_path = get_session_bus_path()?;
        let mut stream = UnixStream::connect(bus_path).ok()?;
        stream
            .set_read_timeout(Some(Duration::from_millis(100)))
            .ok()?;
        stream
            .set_write_timeout(Some(Duration::from_millis(100)))
            .ok()?;

        if !authenticate_dbus(&mut stream) {
            return None;
        }

        // 1. Send Hello to obtain unique connection name (serial 1)
        let hello_msg = encode_dbus_call(
            1,
            "org.freedesktop.DBus",
            "/org/freedesktop/DBus",
            "org.freedesktop.DBus",
            "Hello",
            None,
            &[],
        );
        stream.write_all(&hello_msg).ok()?;
        let _ = read_dbus_reply(&mut stream, 1)?;

        // 2. Query ListNames to find media players (serial 2)
        let list_msg = encode_dbus_call(
            2,
            "org.freedesktop.DBus",
            "/org/freedesktop/DBus",
            "org.freedesktop.DBus",
            "ListNames",
            None,
            &[],
        );
        stream.write_all(&list_msg).ok()?;
        let list_reply = read_dbus_reply(&mut stream, 2)?;
        let names = parse_name_list(&list_reply);

        let mpris_services: Vec<_> = names
            .into_iter()
            .filter(|n| n.starts_with("org.mpris.MediaPlayer2."))
            .collect();

        if mpris_services.is_empty() {
            return None;
        }

        let mut candidate_info: Option<MediaInfo> = None;

        // Query properties for each media player service
        for (i, service) in mpris_services.iter().enumerate() {
            let mut arg_body = Vec::new();
            let iface_name = "org.mpris.MediaPlayer2.Player";
            arg_body.extend_from_slice(&(iface_name.len() as u32).to_le_bytes());
            arg_body.extend_from_slice(iface_name.as_bytes());
            arg_body.push(0);

            let serial = 10 + i as u32;
            let get_all_msg = encode_dbus_call(
                serial,
                service,
                "/org/mpris/MediaPlayer2",
                "org.freedesktop.DBus.Properties",
                "GetAll",
                Some("s"),
                &arg_body,
            );

            if stream.write_all(&get_all_msg).is_ok() {
                if let Some(reply) = read_dbus_reply(&mut stream, serial) {
                    let status = extract_mpris_string(&reply, "PlaybackStatus");
                    let title = extract_mpris_string(&reply, "xesam:title");
                    let artist = extract_mpris_string_list(&reply, "xesam:artist")
                        .or_else(|| extract_mpris_string(&reply, "xesam:artist"));
                    let album = extract_mpris_string(&reply, "xesam:album");
                    let player = Some(clean_mpris_service_name(service));

                    let info = MediaInfo {
                        player,
                        status: status.clone(),
                        artist,
                        title,
                        album,
                    };

                    if status.as_deref() == Some("Playing") {
                        return Some(info);
                    }
                    if candidate_info.is_none() {
                        candidate_info = Some(info);
                    }
                }
            }
        }

        candidate_info
    }
}

// ─── macOS Backend (Native Objective-C Runtime FFI) ──────────────────────────

#[cfg(target_os = "macos")]
pub mod macos_media {
    use super::MediaInfo;
    use crate::macos_ffi::{cf_string_to_rust, CFStringRef};
    use std::ffi::{c_void, CString};

    #[link(name = "objc")]
    extern "C" {
        fn objc_getClass(name: *const i8) -> *mut c_void;
        fn sel_registerName(name: *const i8) -> *mut c_void;
        fn objc_msgSend(self_: *mut c_void, op: *mut c_void, ...) -> *mut c_void;
    }

    /// Queries Apple Music or Spotify via native Objective-C ScriptingBridge FFI.
    pub fn detect_macos_media() -> Option<MediaInfo> {
        unsafe {
            for (bundle_id, player_name) in [
                ("com.apple.Music", "Apple Music"),
                ("com.spotify.client", "Spotify"),
            ] {
                if let Some(info) = query_sb_player(bundle_id, player_name) {
                    return Some(info);
                }
            }
            None
        }
    }

    unsafe fn query_sb_player(bundle_id: &str, player_name: &str) -> Option<MediaInfo> {
        let sb_cls_name = CString::new("SBApplication").ok()?;
        let sb_cls = objc_getClass(sb_cls_name.as_ptr());
        if sb_cls.is_null() {
            return None;
        }

        let app_with_bundle_sel = sel_registerName(
            CString::new("applicationWithBundleIdentifier:")
                .ok()?
                .as_ptr(),
        );
        let is_running_sel = sel_registerName(CString::new("isRunning").ok()?.as_ptr());
        let current_track_sel = sel_registerName(CString::new("currentTrack").ok()?.as_ptr());
        let player_state_sel = sel_registerName(CString::new("playerState").ok()?.as_ptr());
        let name_sel = sel_registerName(CString::new("name").ok()?.as_ptr());
        let artist_sel = sel_registerName(CString::new("artist").ok()?.as_ptr());
        let album_sel = sel_registerName(CString::new("album").ok()?.as_ptr());

        let ns_str_cls = objc_getClass(CString::new("NSString").ok()?.as_ptr());
        let str_with_utf8_sel =
            sel_registerName(CString::new("stringWithUTF8String:").ok()?.as_ptr());
        let bundle_c = CString::new(bundle_id).ok()?;
        let bundle_ns = objc_msgSend(ns_str_cls, str_with_utf8_sel, bundle_c.as_ptr());
        if bundle_ns.is_null() {
            return None;
        }

        let app = objc_msgSend(sb_cls, app_with_bundle_sel, bundle_ns);
        if app.is_null() {
            return None;
        }

        let is_running = objc_msgSend(app, is_running_sel) as usize != 0;
        if !is_running {
            return None;
        }

        let track = objc_msgSend(app, current_track_sel);
        if track.is_null() {
            return None;
        }

        let name_ref = objc_msgSend(track, name_sel) as CFStringRef;
        let artist_ref = objc_msgSend(track, artist_sel) as CFStringRef;
        let album_ref = objc_msgSend(track, album_sel) as CFStringRef;

        let title = cf_string_to_rust(name_ref);
        let artist = cf_string_to_rust(artist_ref);
        let album = cf_string_to_rust(album_ref);

        let state_val = objc_msgSend(app, player_state_sel) as usize;
        let status = if state_val == 1800426352 || state_val == 1 {
            // 'kPSP' (playing) or 1
            Some("Playing".to_string())
        } else if state_val == 1800426353 || state_val == 2 {
            // 'kPSp' (paused) or 2
            Some("Paused".to_string())
        } else {
            None
        };

        if title.is_none() && artist.is_none() {
            None
        } else {
            Some(MediaInfo {
                player: Some(player_name.to_string()),
                status,
                artist,
                title,
                album,
            })
        }
    }
}

// ─── Tests ───────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_format_player() {
        let with_status = MediaInfo {
            player: Some("Spotify".to_string()),
            status: Some("Playing".to_string()),
            artist: Some("Daft Punk".to_string()),
            title: Some("Get Lucky".to_string()),
            album: None,
        };
        assert_eq!(
            with_status.format_player(),
            Some("Spotify (Playing)".to_string())
        );

        let without_status = MediaInfo {
            player: Some("VLC media player".to_string()),
            status: None,
            artist: None,
            title: None,
            album: None,
        };
        assert_eq!(
            without_status.format_player(),
            Some("VLC media player".to_string())
        );

        let empty = MediaInfo::default();
        assert_eq!(empty.format_player(), None);
    }

    #[test]
    fn test_format_media() {
        let full = MediaInfo {
            player: Some("Spotify".to_string()),
            status: Some("Playing".to_string()),
            artist: Some("Queen".to_string()),
            title: Some("Bohemian Rhapsody".to_string()),
            album: Some("A Night at the Opera".to_string()),
        };
        assert_eq!(
            full.format_media(),
            Some("Queen - Bohemian Rhapsody".to_string())
        );

        let title_only = MediaInfo {
            player: Some("Firefox".to_string()),
            status: Some("Playing".to_string()),
            artist: None,
            title: Some("YouTube Video Title".to_string()),
            album: None,
        };
        assert_eq!(
            title_only.format_media(),
            Some("YouTube Video Title".to_string())
        );

        let artist_only = MediaInfo {
            player: None,
            status: None,
            artist: Some("Unknown Artist".to_string()),
            title: None,
            album: None,
        };
        assert_eq!(
            artist_only.format_media(),
            Some("Unknown Artist".to_string())
        );

        let empty = MediaInfo::default();
        assert_eq!(empty.format_media(), None);
    }

    #[test]
    fn test_clean_app_user_model_id() {
        #[cfg(target_os = "windows")]
        {
            use win_media::clean_app_user_model_id;
            assert_eq!(clean_app_user_model_id("Spotify.exe"), "Spotify");
            assert_eq!(
                clean_app_user_model_id("Microsoft.ZuneMusic_8wekyb3d8bbwe!Microsoft.ZuneMusic"),
                "Media Player"
            );
            assert_eq!(clean_app_user_model_id("msedge.exe"), "Microsoft Edge");
            assert_eq!(clean_app_user_model_id("chrome.exe"), "Google Chrome");
            assert_eq!(clean_app_user_model_id("vlc.exe"), "VLC media player");
            assert_eq!(clean_app_user_model_id("foobar2000.exe"), "foobar2000");
        }
    }

    #[test]
    fn test_linux_dbus_mpris_parsing() {
        use linux_dbus::{
            clean_mpris_service_name, encode_dbus_call, extract_mpris_string,
            extract_mpris_string_list, get_message_type, get_reply_serial, parse_name_list,
        };

        assert_eq!(
            clean_mpris_service_name("org.mpris.MediaPlayer2.spotify"),
            "Spotify"
        );
        assert_eq!(
            clean_mpris_service_name("org.mpris.MediaPlayer2.vlc.instance1234"),
            "VLC media player"
        );
        assert_eq!(
            clean_mpris_service_name("org.mpris.MediaPlayer2.firefox.instance_1_42"),
            "Firefox"
        );
        assert_eq!(
            clean_mpris_service_name("org.mpris.MediaPlayer2.mpv"),
            "mpv"
        );

        // Test synthetic D-Bus ListNames reply message
        let mut body = Vec::new();
        let name1 = "org.freedesktop.DBus";
        let name2 = "org.mpris.MediaPlayer2.spotify";
        let name3 = ":1.42";

        let mut arr_bytes = Vec::new();
        for n in [name1, name2, name3] {
            while arr_bytes.len() % 4 != 0 {
                arr_bytes.push(0);
            }
            arr_bytes.extend_from_slice(&(n.len() as u32).to_le_bytes());
            arr_bytes.extend_from_slice(n.as_bytes());
            arr_bytes.push(0); // null terminator
        }

        body.extend_from_slice(&(arr_bytes.len() as u32).to_le_bytes());
        body.extend_from_slice(&arr_bytes);

        let msg = encode_dbus_call(
            1,
            ":1.42",
            "/org/freedesktop/DBus",
            "org.freedesktop.DBus",
            "ListNames",
            Some("as"),
            &body,
        );

        assert_eq!(get_message_type(&msg), Some(1)); // MethodCall

        let names = parse_name_list(&msg);
        assert!(names.contains(&"org.mpris.MediaPlayer2.spotify".to_string()));
        assert!(names.contains(&"org.freedesktop.DBus".to_string()));

        // Test D-Bus reply serial extraction from a synthetic MethodReturn header
        let mut reply_header_fields = Vec::new();
        // Struct alignment 8
        while reply_header_fields.len() % 8 != 0 {
            reply_header_fields.push(0);
        }
        reply_header_fields.push(5); // field code 5 = REPLY_SERIAL
        reply_header_fields.push(1); // sig len
        reply_header_fields.push(b'u'); // sig type
        reply_header_fields.push(0); // null terminator
        reply_header_fields.extend_from_slice(&42u32.to_le_bytes()); // reply serial 42

        let mut reply_msg = Vec::new();
        reply_msg.push(b'l'); // little-endian
        reply_msg.push(2); // MethodReturn
        reply_msg.push(0);
        reply_msg.push(1);
        reply_msg.extend_from_slice(&0u32.to_le_bytes()); // body len 0
        reply_msg.extend_from_slice(&100u32.to_le_bytes()); // serial 100
        reply_msg.extend_from_slice(&(reply_header_fields.len() as u32).to_le_bytes());
        reply_msg.extend_from_slice(&reply_header_fields);

        assert_eq!(get_message_type(&reply_msg), Some(2));
        assert_eq!(get_reply_serial(&reply_msg), Some(42));

        // Test property extraction (PlaybackStatus, xesam:title, xesam:artist)
        let mut prop_buf = Vec::new();
        // 1. PlaybackStatus: String "Playing"
        prop_buf.extend_from_slice(b"PlaybackStatus");
        prop_buf.push(0); // null terminator
        prop_buf.push(1); // variant sig len
        prop_buf.push(b's'); // variant sig 's'
        prop_buf.push(0); // null terminator
        prop_buf.extend_from_slice(&(7u32).to_le_bytes());
        prop_buf.extend_from_slice(b"Playing");
        prop_buf.push(0);

        // 2. xesam:title: String "Get Lucky"
        prop_buf.extend_from_slice(b"xesam:title");
        prop_buf.push(0);
        prop_buf.push(1);
        prop_buf.push(b's');
        prop_buf.push(0);
        prop_buf.extend_from_slice(&(9u32).to_le_bytes());
        prop_buf.extend_from_slice(b"Get Lucky");
        prop_buf.push(0);

        // 3. xesam:artist: Array of String ["Daft Punk", "Pharrell Williams"]
        prop_buf.extend_from_slice(b"xesam:artist");
        prop_buf.push(0);
        prop_buf.push(2); // variant sig len 2
        prop_buf.push(b'a');
        prop_buf.push(b's');
        prop_buf.push(0); // null terminator
        prop_buf.push(0); // alignment padding
        let mut artist_arr = Vec::new();
        for a in ["Daft Punk", "Pharrell Williams"] {
            artist_arr.extend_from_slice(&(a.len() as u32).to_le_bytes());
            artist_arr.extend_from_slice(a.as_bytes());
            artist_arr.push(0);
        }
        prop_buf.extend_from_slice(&(artist_arr.len() as u32).to_le_bytes());
        prop_buf.extend_from_slice(&artist_arr);

        assert_eq!(
            extract_mpris_string(&prop_buf, "PlaybackStatus"),
            Some("Playing".to_string())
        );
        assert_eq!(
            extract_mpris_string(&prop_buf, "xesam:title"),
            Some("Get Lucky".to_string())
        );
        assert_eq!(
            extract_mpris_string_list(&prop_buf, "xesam:artist"),
            Some("Daft Punk, Pharrell Williams".to_string())
        );
    }
}

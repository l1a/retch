// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Graphics and compute API versions: Vulkan, OpenGL and OpenCL.
//!
//! The last user-visible gap against fastfetch (NOTES.md §6). Each API is reached by
//! `dlopen`ing its loader at runtime rather than linking it, for three reasons:
//!
//! 1. **Linking would make the libraries hard requirements.** A machine without Vulkan
//!    must still run retch; a `#[link]` on `libvulkan` would refuse to start.
//! 2. **They are genuinely optional.** Absence is a normal answer ("no Vulkan here"),
//!    not an error, so the field is simply omitted.
//! 3. It keeps the crate free of new dependencies, matching the hand-written FFI house
//!    style used for the Windows and macOS probes.
//!
//! # These probes never modify the process environment
//!
//! Mesa's **rusticl** OpenCL driver is opt-in via `RUSTICL_ENABLE`: without it the ICD
//! still registers a platform advertising OpenCL 3.0 while exposing **zero devices**.
//! It is tempting to set that variable in-process before loading the ICD so the field
//! looks better. This module deliberately does not, for two reasons:
//!
//! - **It would be a data race.** Fields are collected inside a `std::thread::scope`, and
//!   mutating the environment while sibling threads read it is unsound. `std::env::set_var`
//!   became `unsafe` in Rust 2024 precisely for this; this crate is on edition 2021, where
//!   it still compiles silently — a trap rather than a compile error.
//! - **It would report something false.** A device visible only because retch enabled it
//!   for itself is not a device the user's own programs can use.
//!
//! So the OpenCL field reports the device count it actually observes, and says when that
//! count is zero. fastfetch prints a bare `OpenCL: 3.0` in both states — i.e. it reports a
//! working stack when nothing can run on it. Under-reporting beats asserting something
//! false, the same call as the `Users: 0` suppression (v0.6.1) and the v0.7.0 input
//! classification.

#[cfg(target_os = "linux")]
use std::ffi::c_int;
#[cfg(any(target_os = "linux", target_os = "windows"))]
use std::ffi::{c_char, c_void, CStr};

/// Versions reported by each graphics/compute API present on the system.
///
/// A `None` means the loader is absent or answered nothing usable — both are normal.
#[derive(Debug, Default, Clone, PartialEq, Eq)]
pub struct GpuApis {
    /// Vulkan: device `apiVersion`, driver name and driver info, e.g.
    /// `1.4.354 - radv [Mesa 26.1.8]`.
    pub vulkan: Option<String>,
    /// OpenGL: the `GL_VERSION` string of a headless context, e.g.
    /// `4.6 (Compatibility Profile) Mesa 26.1.8`.
    pub opengl: Option<String>,
    /// OpenCL: platform version, provider, and what device (if any) is actually exposed.
    pub opencl: Option<String>,
}

/// Decode a packed Vulkan version into `major.minor.patch`.
///
/// Vulkan packs the version as `variant:3 | major:7 | minor:10 | patch:12`. The variant
/// field is deliberately ignored: it is non-zero only for non-Khronos derivatives, and
/// including it would print a leading number no user recognises.
pub fn format_vulkan_version(packed: u32) -> String {
    let major = (packed >> 22) & 0x7F;
    let minor = (packed >> 12) & 0x3FF;
    let patch = packed & 0xFFF;
    format!("{major}.{minor}.{patch}")
}

/// Rank a Vulkan `VkPhysicalDeviceType` so the most capable real device wins.
///
/// Lower is better. The ordering is load-bearing rather than cosmetic: a machine with a
/// real GPU almost always *also* exposes Mesa's `llvmpipe` software rasteriser as a
/// `CPU` device, so picking the first enumerated device would report software rendering
/// on a box with a perfectly good GPU. Observed on this hardware: the AMD 780M enumerates
/// as `INTEGRATED_GPU` (1) alongside `llvmpipe` as `CPU` (4).
pub fn device_type_rank(device_type: u32) -> u8 {
    match device_type {
        2 => 0, // DISCRETE_GPU
        1 => 1, // INTEGRATED_GPU
        3 => 2, // VIRTUAL_GPU
        4 => 4, // CPU (software rasteriser — a last resort, never a preference)
        _ => 3, // OTHER
    }
}

/// Render the Vulkan field from its parts.
///
/// `driver_name`/`driver_info` are empty when the driver did not fill the
/// `VkPhysicalDeviceDriverProperties` chain, which happens on any instance created below
/// Vulkan 1.2 — silently, with no error. The version alone is still worth printing.
pub fn format_vulkan(version: &str, driver_name: &str, driver_info: &str) -> String {
    match (driver_name.trim(), driver_info.trim()) {
        ("", _) => version.to_string(),
        (name, "") => format!("{version} - {name}"),
        (name, info) => format!("{version} - {name} [{info}]"),
    }
}

/// Render the OpenCL field, distinguishing "usable" from "present but inert".
///
/// A platform that advertises a version while exposing no device cannot run anything, so
/// saying so is the whole point of the field. See the module docs for why this does not
/// simply enable rusticl for itself and report the better-looking answer.
pub fn format_opencl(version: &str, platform: &str, device: Option<&str>) -> String {
    // CL_PLATFORM_VERSION is specified to start with "OpenCL <major>.<minor>", so the raw
    // string would render as "OpenCL: OpenCL 3.0" under the field's own label.
    let version = version
        .trim()
        .strip_prefix("OpenCL ")
        .unwrap_or(version.trim())
        .trim();
    let platform = platform.trim();
    match device {
        Some(d) if !d.trim().is_empty() => {
            if platform.is_empty() {
                format!("{version} ({})", d.trim())
            } else {
                format!("{version} - {platform} ({})", d.trim())
            }
        }
        _ => {
            if platform.is_empty() {
                format!("{version} (no device enabled)")
            } else {
                format!("{version} - {platform} (no device enabled)")
            }
        }
    }
}

/// Shorten a driver-reported device name to the part a human recognises.
///
/// Mesa reports OpenCL and GL device names with a full driver descriptor appended, e.g.
/// `AMD Radeon 780M Graphics (radeonsi, phoenix, ACO, DRM 3.64, 7.1.13-200.fc44.x86_64)`.
/// That is 80+ characters of kernel and driver detail that pushes the line into wrapping
/// and tells the reader nothing the `GPU` field does not already say, so everything from
/// the first parenthesised descriptor on is dropped.
pub fn shorten_device_name(name: &str) -> String {
    match name.find(" (") {
        Some(i) => name[..i].trim().to_string(),
        None => name.trim().to_string(),
    }
}

/// Trim a NUL-terminated fixed-size C string field into a `String`.
///
/// Reads up to the first NUL and ignores the rest of the buffer. Returns an empty string
/// when the field was never written, which is how an unfilled `pNext` chain presents.
pub fn cstr_field(buf: &[u8]) -> String {
    let end = buf.iter().position(|&b| b == 0).unwrap_or(buf.len());
    String::from_utf8_lossy(&buf[..end]).into_owned()
}

// ---------------------------------------------------------------------------
// Runtime loader — one interface, two backends
// ---------------------------------------------------------------------------

/// Runtime library loading, presenting the same `open`/`sym`/`close` interface on every
/// platform so the probes above it need no `cfg` of their own.
///
/// The probes are the same code on Linux and Windows — the Vulkan and OpenCL APIs are
/// identical, and only the loader's *name* differs — so the platform split lives here
/// rather than being duplicated per API. A second copy of the
/// `VkPhysicalDeviceProperties2` offset arithmetic is exactly the drift that the shared
/// `win_setupapi` and `win_iftable` modules exist to prevent.
#[cfg(target_os = "linux")]
mod dl {
    use super::*;

    extern "C" {
        pub fn dlopen(filename: *const c_char, flags: c_int) -> *mut c_void;
        pub fn dlsym(handle: *mut c_void, symbol: *const c_char) -> *mut c_void;
        pub fn dlclose(handle: *mut c_void) -> c_int;
    }
    pub const RTLD_NOW: c_int = 2;
    pub const RTLD_LOCAL: c_int = 0;

    /// Open a shared library by soname, or `None` if it is not installed.
    ///
    /// `RTLD_LOCAL` keeps the symbols out of the global namespace so loading, say, a
    /// software OpenCL ICD cannot shadow symbols another probe resolves later.
    pub fn open(soname: &CStr) -> Option<*mut c_void> {
        // SAFETY: `soname` is a valid NUL-terminated C string for the duration of the
        // call. A null return is the documented "not found" answer and is handled.
        let h = unsafe { dlopen(soname.as_ptr(), RTLD_NOW | RTLD_LOCAL) };
        (!h.is_null()).then_some(h)
    }

    /// Resolve a symbol, or `None` if the library does not export it.
    pub fn sym(handle: *mut c_void, name: &CStr) -> Option<*mut c_void> {
        // SAFETY: `handle` came from `open` above and has not been closed; `name` is a
        // valid NUL-terminated C string.
        let p = unsafe { dlsym(handle, name.as_ptr()) };
        (!p.is_null()).then_some(p)
    }

    /// Close a handle opened by [`open`].
    pub fn close(handle: *mut c_void) {
        // SAFETY: `handle` came from `open` and is not used afterwards.
        unsafe {
            dlclose(handle);
        }
    }
}

/// Windows backend for the loader interface above.
///
/// `LoadLibraryA` rather than `LoadLibraryW`: the names are ASCII DLL filenames resolved
/// through the standard search order, so widening them would buy nothing and would mean
/// converting a `CStr` the callers already hold. `media.rs`'s `combase.dll` bootstrap is
/// the precedent for loading a system DLL at runtime rather than linking it.
///
/// There is no `RTLD_LOCAL` equivalent to worry about — Windows does not have the global
/// symbol namespace that flag exists to avoid polluting.
#[cfg(target_os = "windows")]
mod dl {
    use super::*;

    #[link(name = "kernel32")]
    extern "system" {
        fn LoadLibraryA(lp_lib_file_name: *const c_char) -> *mut c_void;
        fn GetProcAddress(h_module: *mut c_void, lp_proc_name: *const c_char) -> *mut c_void;
        fn FreeLibrary(h_module: *mut c_void) -> i32;
    }

    /// Open a DLL by name, or `None` if it is not installed.
    ///
    /// A missing loader is the normal answer on a machine without that API — a headless
    /// server, or one with no GPU driver — not an error.
    pub fn open(name: &CStr) -> Option<*mut c_void> {
        // SAFETY: `name` is a valid NUL-terminated C string for the duration of the call.
        // A null return is the documented "not found" answer and is handled.
        let h = unsafe { LoadLibraryA(name.as_ptr()) };
        (!h.is_null()).then_some(h)
    }

    /// Resolve an exported symbol, or `None` if the DLL does not export it.
    pub fn sym(handle: *mut c_void, name: &CStr) -> Option<*mut c_void> {
        // SAFETY: `handle` came from `open` above and has not been freed; `name` is a
        // valid NUL-terminated C string.
        let p = unsafe { GetProcAddress(handle, name.as_ptr()) };
        (!p.is_null()).then_some(p)
    }

    /// Release a handle opened by [`open`].
    pub fn close(handle: *mut c_void) {
        // SAFETY: `handle` came from `open` and is not used afterwards.
        unsafe {
            FreeLibrary(handle);
        }
    }
}

/// The Vulkan loader's filename on this platform.
#[cfg(target_os = "linux")]
const VULKAN_LIB: &CStr = c"libvulkan.so.1";
/// `vulkan-1.dll` is the Khronos loader's fixed name on Windows, installed by every
/// conformant driver into `System32`.
#[cfg(target_os = "windows")]
const VULKAN_LIB: &CStr = c"vulkan-1.dll";

/// The OpenCL ICD loader's filename on this platform.
#[cfg(target_os = "linux")]
const OPENCL_LIB: &CStr = c"libOpenCL.so.1";
/// `OpenCL.dll` is the Khronos ICD loader on Windows; vendor drivers register themselves
/// with it rather than being opened directly.
#[cfg(target_os = "windows")]
const OPENCL_LIB: &CStr = c"OpenCL.dll";

#[cfg(any(target_os = "linux", target_os = "windows"))]
mod vulkan {
    use super::dl;
    use super::*;

    const VK_STRUCTURE_TYPE_APPLICATION_INFO: u32 = 0;
    const VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO: u32 = 1;
    const VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_PROPERTIES_2: u32 = 1000059001;
    const VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_DRIVER_PROPERTIES: u32 = 1000196000;

    /// `VkPhysicalDeviceProperties2` places `properties` after `sType` + padding + `pNext`.
    const PROPS2_BODY: usize = 16;
    /// Offsets within `VkPhysicalDeviceProperties`.
    const OFF_API_VERSION: usize = 0;
    const OFF_DEVICE_TYPE: usize = 16;
    const OFF_DEVICE_NAME: usize = 20;
    /// Comfortably larger than `sizeof(VkPhysicalDeviceProperties)` (~824 bytes). The
    /// struct embeds `VkPhysicalDeviceLimits` (100+ fields) that this probe never reads,
    /// so it is handled as a sized byte buffer with documented offsets — the same approach
    /// `memory.rs` uses for SMBIOS type-17 and `win_iftable.rs` for `MIB_IF_ROW2`.
    const PROPS_BUF: usize = 1024;

    /// Offsets within `VkPhysicalDeviceDriverProperties`.
    const OFF_DRIVER_NAME: usize = 20;
    const OFF_DRIVER_INFO: usize = 276;
    const DRIVER_BUF: usize = 560;
    const VK_MAX_NAME: usize = 256;

    #[repr(C)]
    struct AppInfo {
        s_type: u32,
        p_next: *const c_void,
        app_name: *const c_char,
        app_version: u32,
        engine_name: *const c_char,
        engine_version: u32,
        api_version: u32,
    }

    #[repr(C)]
    struct InstanceCreateInfo {
        s_type: u32,
        p_next: *const c_void,
        flags: u32,
        app_info: *const AppInfo,
        layer_count: u32,
        layer_names: *const *const c_char,
        ext_count: u32,
        ext_names: *const *const c_char,
    }

    type VkCreateInstance =
        unsafe extern "C" fn(*const InstanceCreateInfo, *const c_void, *mut *mut c_void) -> i32;
    type VkDestroyInstance = unsafe extern "C" fn(*mut c_void, *const c_void);
    type VkEnumeratePhysicalDevices =
        unsafe extern "C" fn(*mut c_void, *mut u32, *mut *mut c_void) -> i32;
    type VkGetPhysicalDeviceProperties2 = unsafe extern "C" fn(*mut c_void, *mut c_void);
    type VkGetInstanceProcAddr = unsafe extern "C" fn(*mut c_void, *const c_char) -> *mut c_void;

    /// Query the best physical device's API version and driver identity.
    ///
    /// Returns `None` when Vulkan is absent, no instance can be created, or no device is
    /// present — all normal on a headless or GPU-less machine.
    pub fn detect() -> Option<String> {
        let lib = dl::open(VULKAN_LIB)?;
        let result = detect_with(lib);
        dl::close(lib);
        result
    }

    fn detect_with(lib: *mut c_void) -> Option<String> {
        let create = dl::sym(lib, c"vkCreateInstance")?;
        let gipa = dl::sym(lib, c"vkGetInstanceProcAddr")?;

        // SAFETY: every pointer below is either freshly resolved from the Vulkan loader or
        // a local we own. Buffers passed to the driver are sized at or above the structs
        // the API writes, and every returned code is checked before the result is read.
        unsafe {
            let create: VkCreateInstance = std::mem::transmute(create);
            let gipa: VkGetInstanceProcAddr = std::mem::transmute(gipa);

            let app = AppInfo {
                s_type: VK_STRUCTURE_TYPE_APPLICATION_INFO,
                p_next: std::ptr::null(),
                app_name: c"retch".as_ptr(),
                app_version: 0,
                engine_name: std::ptr::null(),
                engine_version: 0,
                // Must be >= 1.2. With a 1.0 or 1.1 instance the driver SILENTLY IGNORES
                // the `VkPhysicalDeviceDriverProperties` chain below and the driver name
                // and info come back as empty strings with no error anywhere — verified
                // against a 1.0 instance, which returned the right version and blank
                // driver fields.
                api_version: (1 << 22) | (2 << 12),
            };
            let ci = InstanceCreateInfo {
                s_type: VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO,
                p_next: std::ptr::null(),
                flags: 0,
                app_info: &app,
                layer_count: 0,
                layer_names: std::ptr::null(),
                ext_count: 0,
                ext_names: std::ptr::null(),
            };

            let mut instance: *mut c_void = std::ptr::null_mut();
            if create(&ci, std::ptr::null(), &mut instance) != 0 || instance.is_null() {
                return None;
            }

            let out = read_best_device(instance, gipa);

            if let Some(p) = dl::sym(lib, c"vkDestroyInstance") {
                let destroy: VkDestroyInstance = std::mem::transmute(p);
                destroy(instance, std::ptr::null());
            }
            out
        }
    }

    /// SAFETY: caller guarantees `instance` is a live `VkInstance` and `gipa` is the
    /// loader's `vkGetInstanceProcAddr`.
    unsafe fn read_best_device(
        instance: *mut c_void,
        gipa: VkGetInstanceProcAddr,
    ) -> Option<String> {
        let enum_ptr = gipa(instance, c"vkEnumeratePhysicalDevices".as_ptr());
        let props_ptr = gipa(instance, c"vkGetPhysicalDeviceProperties2".as_ptr());
        if enum_ptr.is_null() || props_ptr.is_null() {
            return None;
        }
        let enumerate: VkEnumeratePhysicalDevices = std::mem::transmute(enum_ptr);
        let get_props2: VkGetPhysicalDeviceProperties2 = std::mem::transmute(props_ptr);

        let mut count: u32 = 0;
        if enumerate(instance, &mut count, std::ptr::null_mut()) != 0 || count == 0 {
            return None;
        }
        let mut devices = vec![std::ptr::null_mut::<c_void>(); count as usize];
        if enumerate(instance, &mut count, devices.as_mut_ptr()) != 0 {
            return None;
        }

        let mut best: Option<(u8, String)> = None;
        for device in devices.iter().take(count as usize) {
            let mut driver = vec![0u8; DRIVER_BUF];
            driver[0..4].copy_from_slice(
                &VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_DRIVER_PROPERTIES.to_ne_bytes(),
            );
            let mut props = vec![0u8; PROPS2_BODY + PROPS_BUF];
            props[0..4]
                .copy_from_slice(&VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_PROPERTIES_2.to_ne_bytes());
            let chain = driver.as_mut_ptr() as usize;
            props[8..16].copy_from_slice(&chain.to_ne_bytes());

            get_props2(*device, props.as_mut_ptr() as *mut c_void);

            let at = |off: usize| -> u32 {
                let s = PROPS2_BODY + off;
                u32::from_ne_bytes(props[s..s + 4].try_into().unwrap_or([0; 4]))
            };
            let api = at(OFF_API_VERSION);
            let dtype = at(OFF_DEVICE_TYPE);
            let name_start = PROPS2_BODY + OFF_DEVICE_NAME;
            let _device_name = cstr_field(&props[name_start..name_start + VK_MAX_NAME]);

            let driver_name = cstr_field(&driver[OFF_DRIVER_NAME..OFF_DRIVER_NAME + VK_MAX_NAME]);
            let driver_info = cstr_field(&driver[OFF_DRIVER_INFO..OFF_DRIVER_INFO + VK_MAX_NAME]);

            let rank = device_type_rank(dtype);
            let rendered = format_vulkan(&format_vulkan_version(api), &driver_name, &driver_info);
            if best.as_ref().is_none_or(|(r, _)| rank < *r) {
                best = Some((rank, rendered));
            }
        }
        best.map(|(_, s)| s)
    }
}

#[cfg(target_os = "linux")]
mod opengl {
    use super::dl;
    use super::*;

    const EGL_OPENGL_API: u32 = 0x30A2;
    const EGL_NONE: i32 = 0x3038;
    const EGL_SURFACE_TYPE: i32 = 0x3033;
    const EGL_PBUFFER_BIT: i32 = 0x0001;
    const EGL_RENDERABLE_TYPE: i32 = 0x3040;
    const EGL_OPENGL_BIT: i32 = 0x0008;
    const GL_VERSION: u32 = 0x1F02;

    type EglGetDisplay = unsafe extern "C" fn(*mut c_void) -> *mut c_void;
    type EglInitialize = unsafe extern "C" fn(*mut c_void, *mut i32, *mut i32) -> u32;
    type EglBindApi = unsafe extern "C" fn(u32) -> u32;
    type EglChooseConfig =
        unsafe extern "C" fn(*mut c_void, *const i32, *mut *mut c_void, i32, *mut i32) -> u32;
    type EglCreateContext =
        unsafe extern "C" fn(*mut c_void, *mut c_void, *mut c_void, *const i32) -> *mut c_void;
    type EglMakeCurrent =
        unsafe extern "C" fn(*mut c_void, *mut c_void, *mut c_void, *mut c_void) -> u32;
    type EglGetProcAddress = unsafe extern "C" fn(*const c_char) -> *mut c_void;
    type EglTerminate = unsafe extern "C" fn(*mut c_void) -> u32;
    type GlGetString = unsafe extern "C" fn(u32) -> *const c_char;

    /// Read `GL_VERSION` from a headless EGL context.
    ///
    /// Deliberately uses EGL with `EGL_DEFAULT_DISPLAY` and a surfaceless
    /// `eglMakeCurrent`, so this works with no X or Wayland connection and without
    /// touching the environment. GLX would require a display server.
    ///
    /// **The context choice decides the number printed.** Passing no attribute list asks
    /// for the driver's default, which is the highest *compatibility* profile — matching
    /// what fastfetch reports. Requesting a core profile instead reports a different
    /// string for the same machine (`glxinfo -B` says `4.6 (Core Profile)` here where this
    /// returns `4.6 (Compatibility Profile)`), so the choice is deliberate, not incidental.
    pub fn detect() -> Option<String> {
        let lib = dl::open(c"libEGL.so.1")?;
        let out = detect_with(lib);
        dl::close(lib);
        out
    }

    fn detect_with(lib: *mut c_void) -> Option<String> {
        let get_display = dl::sym(lib, c"eglGetDisplay")?;
        let initialize = dl::sym(lib, c"eglInitialize")?;
        let bind_api = dl::sym(lib, c"eglBindAPI")?;
        let choose = dl::sym(lib, c"eglChooseConfig")?;
        let create_context = dl::sym(lib, c"eglCreateContext")?;
        let make_current = dl::sym(lib, c"eglMakeCurrent")?;
        let get_proc = dl::sym(lib, c"eglGetProcAddress")?;

        // SAFETY: all pointers are freshly resolved from libEGL or locals we own. Every
        // EGL call's status is checked before its output is used, and the display is
        // terminated on the success path.
        unsafe {
            let get_display: EglGetDisplay = std::mem::transmute(get_display);
            let initialize: EglInitialize = std::mem::transmute(initialize);
            let bind_api: EglBindApi = std::mem::transmute(bind_api);
            let choose: EglChooseConfig = std::mem::transmute(choose);
            let create_context: EglCreateContext = std::mem::transmute(create_context);
            let make_current: EglMakeCurrent = std::mem::transmute(make_current);
            let get_proc: EglGetProcAddress = std::mem::transmute(get_proc);

            // EGL_DEFAULT_DISPLAY is a null handle.
            let display = get_display(std::ptr::null_mut());
            if display.is_null() {
                return None;
            }
            let (mut major, mut minor) = (0i32, 0i32);
            if initialize(display, &mut major, &mut minor) == 0 {
                return None;
            }
            // Desktop GL specifically; an ES-only stack answers 0 here and is reported as
            // "no OpenGL" rather than being silently downgraded to an ES version string.
            if bind_api(EGL_OPENGL_API) == 0 {
                terminate(lib, display);
                return None;
            }

            let attrs = [
                EGL_SURFACE_TYPE,
                EGL_PBUFFER_BIT,
                EGL_RENDERABLE_TYPE,
                EGL_OPENGL_BIT,
                EGL_NONE,
            ];
            let mut config: *mut c_void = std::ptr::null_mut();
            let mut configs = 0i32;
            if choose(display, attrs.as_ptr(), &mut config, 1, &mut configs) == 0 || configs == 0 {
                terminate(lib, display);
                return None;
            }
            let context = create_context(display, config, std::ptr::null_mut(), std::ptr::null());
            if context.is_null() {
                terminate(lib, display);
                return None;
            }
            if make_current(display, std::ptr::null_mut(), std::ptr::null_mut(), context) == 0 {
                terminate(lib, display);
                return None;
            }
            let gl_get_string = get_proc(c"glGetString".as_ptr());
            let version = if gl_get_string.is_null() {
                None
            } else {
                let gl_get_string: GlGetString = std::mem::transmute(gl_get_string);
                let p = gl_get_string(GL_VERSION);
                if p.is_null() {
                    None
                } else {
                    Some(CStr::from_ptr(p).to_string_lossy().into_owned())
                }
            };
            terminate(lib, display);
            version.filter(|v| !v.trim().is_empty())
        }
    }

    /// Best-effort `eglTerminate`; failure to release is not worth reporting to the user.
    ///
    /// SAFETY: `display` is a live EGL display obtained from `eglGetDisplay`.
    unsafe fn terminate(lib: *mut c_void, display: *mut c_void) {
        if let Some(p) = dl::sym(lib, c"eglTerminate") {
            let terminate: EglTerminate = std::mem::transmute(p);
            terminate(display);
        }
    }
}

/// Windows OpenGL, via WGL against a hidden window.
///
/// **Why this is a separate module rather than a wider `cfg` on the EGL one.** Vulkan and
/// OpenCL are the same code on both platforms because those APIs are identical and only the
/// loader's filename differs. OpenGL is not: the Linux path gets a context from EGL with no
/// window and no display server, and **stock Windows ships no `libEGL.dll`** — verified on a
/// Windows 11 box carrying `vulkan-1.dll`, `opengl32.dll` and `OpenCL.dll` in `System32`
/// with no EGL at all. Windows has no headless equivalent in the base OS: WGL requires a
/// device context, a device context requires a window, and a window requires a window class.
/// So this is a genuinely different mechanism reaching the same `glGetString(GL_VERSION)`.
///
/// **The window is never shown.** It is created without `WS_VISIBLE` and `ShowWindow` is
/// never called, so nothing appears on screen — a fetch tool that flashed a window on every
/// run would be broken. This is asserted rather than assumed: see the visibility check
/// recorded in NOTES for v0.13.0, which enumerates top-level windows during a run.
///
/// `user32` and `gdi32` are linked rather than loaded at runtime, unlike the graphics
/// loaders: they are core OS libraries always present on any Windows that can run the
/// binary at all, and `display.rs` already links `user32` on the same grounds. `opengl32`
/// *is* loaded at runtime, because a machine with no OpenGL ICD is a real case and must
/// yield an absent field rather than a failure.
#[cfg(target_os = "windows")]
mod opengl {
    use super::dl;
    use super::*;

    const GL_VERSION: u32 = 0x1F02;

    // PIXELFORMATDESCRIPTOR.dwFlags
    const PFD_DOUBLEBUFFER: u32 = 0x0000_0001;
    const PFD_DRAW_TO_WINDOW: u32 = 0x0000_0004;
    const PFD_SUPPORT_OPENGL: u32 = 0x0000_0020;
    /// `PFD_TYPE_RGBA`.
    const PFD_TYPE_RGBA: u8 = 0;
    /// `PFD_MAIN_PLANE`.
    const PFD_MAIN_PLANE: u8 = 0;

    /// `WS_OVERLAPPED` is literally zero — the absence of `WS_VISIBLE` is what keeps the
    /// window off screen, so it is spelled out rather than left implicit.
    const WS_OVERLAPPED: u32 = 0x0000_0000;

    /// `PIXELFORMATDESCRIPTOR`, 40 bytes. Only a handful of fields are set; the rest must
    /// be zero, which is what `ChoosePixelFormat` expects for "don't care".
    #[repr(C)]
    #[derive(Default)]
    struct PixelFormatDescriptor {
        n_size: u16,
        n_version: u16,
        dw_flags: u32,
        i_pixel_type: u8,
        c_color_bits: u8,
        c_red_bits: u8,
        c_red_shift: u8,
        c_green_bits: u8,
        c_green_shift: u8,
        c_blue_bits: u8,
        c_blue_shift: u8,
        c_alpha_bits: u8,
        c_alpha_shift: u8,
        c_accum_bits: u8,
        c_accum_red_bits: u8,
        c_accum_green_bits: u8,
        c_accum_blue_bits: u8,
        c_accum_alpha_bits: u8,
        c_depth_bits: u8,
        c_stencil_bits: u8,
        c_aux_buffers: u8,
        i_layer_type: u8,
        b_reserved: u8,
        dw_layer_mask: u32,
        dw_visible_mask: u32,
        dw_damage_mask: u32,
    }

    /// `WNDCLASSW`, 72 bytes on x64. `lpfnWndProc` points at `DefWindowProcW`: the window
    /// never receives messages we care about, but a class still needs a procedure.
    #[repr(C)]
    struct WndClassW {
        style: u32,
        lpfn_wnd_proc: *const c_void,
        cb_cls_extra: i32,
        cb_wnd_extra: i32,
        h_instance: *mut c_void,
        h_icon: *mut c_void,
        h_cursor: *mut c_void,
        hbr_background: *mut c_void,
        lpsz_menu_name: *const u16,
        lpsz_class_name: *const u16,
    }

    #[link(name = "user32")]
    extern "system" {
        fn RegisterClassW(lp_wnd_class: *const WndClassW) -> u16;
        fn UnregisterClassW(lp_class_name: *const u16, h_instance: *mut c_void) -> i32;
        fn CreateWindowExW(
            dw_ex_style: u32,
            lp_class_name: *const u16,
            lp_window_name: *const u16,
            dw_style: u32,
            x: i32,
            y: i32,
            n_width: i32,
            n_height: i32,
            h_wnd_parent: *mut c_void,
            h_menu: *mut c_void,
            h_instance: *mut c_void,
            lp_param: *mut c_void,
        ) -> *mut c_void;
        fn DestroyWindow(h_wnd: *mut c_void) -> i32;
        fn GetDC(h_wnd: *mut c_void) -> *mut c_void;
        fn ReleaseDC(h_wnd: *mut c_void, h_dc: *mut c_void) -> i32;
        fn DefWindowProcW(h_wnd: *mut c_void, msg: u32, w_param: usize, l_param: isize) -> isize;
    }

    #[link(name = "gdi32")]
    extern "system" {
        fn ChoosePixelFormat(h_dc: *mut c_void, ppfd: *const PixelFormatDescriptor) -> i32;
        fn SetPixelFormat(
            h_dc: *mut c_void,
            format: i32,
            ppfd: *const PixelFormatDescriptor,
        ) -> i32;
    }

    type WglCreateContext = unsafe extern "system" fn(*mut c_void) -> *mut c_void;
    type WglMakeCurrent = unsafe extern "system" fn(*mut c_void, *mut c_void) -> i32;
    type WglDeleteContext = unsafe extern "system" fn(*mut c_void) -> i32;
    type GlGetString = unsafe extern "system" fn(u32) -> *const c_char;

    /// A hidden window plus its class, unregistered and destroyed on drop.
    ///
    /// Kept as a guard type so every early return unwinds the OS objects in the right
    /// order. Doing it by hand at each `?` is how a window or class leaks — and a leaked
    /// class makes a *second* run in the same process fail to register.
    struct HiddenWindow {
        class_name: Vec<u16>,
        hwnd: *mut c_void,
        hdc: *mut c_void,
    }

    impl HiddenWindow {
        fn new() -> Option<Self> {
            // A distinctive class name: it is unregistered on drop, so a collision would
            // only matter if two probes ran concurrently in one process, which they do not.
            let class_name: Vec<u16> = "retch_gl_probe\0".encode_utf16().collect();

            let wc = WndClassW {
                style: 0,
                lpfn_wnd_proc: DefWindowProcW as *const c_void,
                cb_cls_extra: 0,
                cb_wnd_extra: 0,
                h_instance: std::ptr::null_mut(),
                h_icon: std::ptr::null_mut(),
                h_cursor: std::ptr::null_mut(),
                hbr_background: std::ptr::null_mut(),
                lpsz_menu_name: std::ptr::null(),
                lpsz_class_name: class_name.as_ptr(),
            };

            // SAFETY: `wc` is a fully initialised WNDCLASSW whose string pointer outlives
            // the call, and every handle below is checked before use.
            unsafe {
                if RegisterClassW(&wc) == 0 {
                    return None;
                }
                // No WS_VISIBLE and no ShowWindow: the window exists only to own a device
                // context, and must never appear on screen. 1x1 at the origin.
                let hwnd = CreateWindowExW(
                    0,
                    class_name.as_ptr(),
                    std::ptr::null(),
                    WS_OVERLAPPED,
                    0,
                    0,
                    1,
                    1,
                    std::ptr::null_mut(),
                    std::ptr::null_mut(),
                    std::ptr::null_mut(),
                    std::ptr::null_mut(),
                );
                if hwnd.is_null() {
                    UnregisterClassW(class_name.as_ptr(), std::ptr::null_mut());
                    return None;
                }
                let hdc = GetDC(hwnd);
                if hdc.is_null() {
                    DestroyWindow(hwnd);
                    UnregisterClassW(class_name.as_ptr(), std::ptr::null_mut());
                    return None;
                }
                Some(Self {
                    class_name,
                    hwnd,
                    hdc,
                })
            }
        }
    }

    impl Drop for HiddenWindow {
        fn drop(&mut self) {
            // SAFETY: all three handles came from `new` and are released exactly once, in
            // the reverse of the order they were acquired.
            unsafe {
                ReleaseDC(self.hwnd, self.hdc);
                DestroyWindow(self.hwnd);
                UnregisterClassW(self.class_name.as_ptr(), std::ptr::null_mut());
            }
        }
    }

    /// Read `GL_VERSION` from a WGL context on a hidden window.
    ///
    /// **The pixel format is what makes the context creatable**, and it must be set before
    /// `wglCreateContext`: a device context with no pixel format cannot back a GL context,
    /// and the failure is a null handle rather than an error code that says so.
    ///
    /// Like the Linux path, this asks for the driver's **default** context rather than a
    /// core profile. `wglCreateContext` yields the highest compatibility profile the driver
    /// offers, which is what fastfetch reports — measured here as
    /// `4.6.0 Compatibility Profile Context 25.20.32.06.251214`. Requesting a core profile
    /// would need `wglCreateContextAttribsARB` and would print a different string for the
    /// same machine, so this is deliberate rather than the path of least resistance.
    pub fn detect() -> Option<String> {
        let lib = dl::open(c"opengl32.dll")?;
        let out = detect_with(lib);
        dl::close(lib);
        out
    }

    fn detect_with(lib: *mut c_void) -> Option<String> {
        let create_ctx = dl::sym(lib, c"wglCreateContext")?;
        let make_current = dl::sym(lib, c"wglMakeCurrent")?;
        let delete_ctx = dl::sym(lib, c"wglDeleteContext")?;
        let get_string = dl::sym(lib, c"glGetString")?;

        let window = HiddenWindow::new()?;

        // SAFETY: every function pointer is freshly resolved from opengl32; `window.hdc` is
        // a live device context owned by the guard above; the context is made non-current
        // and deleted before returning on every path.
        unsafe {
            let create_ctx: WglCreateContext = std::mem::transmute(create_ctx);
            let make_current: WglMakeCurrent = std::mem::transmute(make_current);
            let delete_ctx: WglDeleteContext = std::mem::transmute(delete_ctx);
            let get_string: GlGetString = std::mem::transmute(get_string);

            let pfd = PixelFormatDescriptor {
                n_size: std::mem::size_of::<PixelFormatDescriptor>() as u16,
                n_version: 1,
                dw_flags: PFD_DRAW_TO_WINDOW | PFD_SUPPORT_OPENGL | PFD_DOUBLEBUFFER,
                i_pixel_type: PFD_TYPE_RGBA,
                c_color_bits: 32,
                c_depth_bits: 24,
                c_stencil_bits: 8,
                i_layer_type: PFD_MAIN_PLANE,
                ..Default::default()
            };
            let format = ChoosePixelFormat(window.hdc, &pfd);
            if format == 0 || SetPixelFormat(window.hdc, format, &pfd) == 0 {
                return None;
            }

            let ctx = create_ctx(window.hdc);
            if ctx.is_null() {
                return None;
            }
            let version = if make_current(window.hdc, ctx) != 0 {
                let p = get_string(GL_VERSION);
                let s = (!p.is_null()).then(|| CStr::from_ptr(p).to_string_lossy().into_owned());
                // Unbind before deleting: deleting the context that is current to this
                // thread is documented as failing, which would leak it.
                make_current(std::ptr::null_mut(), std::ptr::null_mut());
                s
            } else {
                None
            };
            delete_ctx(ctx);

            version
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty())
        }
    }

    #[cfg(test)]
    mod layout {
        use std::mem::{offset_of, size_of};

        // Both structs are passed to the OS by pointer and read by fixed offset, and
        // `PIXELFORMATDESCRIPTOR.nSize` is set from `size_of` — so a layout change would
        // silently hand `ChoosePixelFormat` a wrong size rather than fail to compile.
        #[test]
        fn ffi_struct_layout() {
            assert_eq!(size_of::<super::PixelFormatDescriptor>(), 40);
            assert_eq!(offset_of!(super::PixelFormatDescriptor, dw_flags), 4);
            assert_eq!(offset_of!(super::PixelFormatDescriptor, i_pixel_type), 8);
            assert_eq!(offset_of!(super::PixelFormatDescriptor, c_color_bits), 9);
            assert_eq!(offset_of!(super::PixelFormatDescriptor, c_depth_bits), 23);
            assert_eq!(offset_of!(super::PixelFormatDescriptor, i_layer_type), 26);

            assert_eq!(size_of::<super::WndClassW>(), 72);
            assert_eq!(offset_of!(super::WndClassW, lpfn_wnd_proc), 8);
            assert_eq!(offset_of!(super::WndClassW, h_instance), 24);
            assert_eq!(offset_of!(super::WndClassW, lpsz_class_name), 64);
        }
    }
}

#[cfg(any(target_os = "linux", target_os = "windows"))]
mod opencl {
    use super::dl;
    use super::*;

    const CL_PLATFORM_VERSION: u32 = 0x0901;
    const CL_PLATFORM_NAME: u32 = 0x0902;
    const CL_DEVICE_TYPE_ALL: u64 = 0xFFFF_FFFF;
    const CL_DEVICE_NAME: u32 = 0x102B;

    type ClGetPlatformIDs = unsafe extern "C" fn(u32, *mut *mut c_void, *mut u32) -> i32;
    type ClGetPlatformInfo =
        unsafe extern "C" fn(*mut c_void, u32, usize, *mut c_void, *mut usize) -> i32;
    type ClGetDeviceIDs =
        unsafe extern "C" fn(*mut c_void, u64, u32, *mut *mut c_void, *mut u32) -> i32;
    type ClGetDeviceInfo =
        unsafe extern "C" fn(*mut c_void, u32, usize, *mut c_void, *mut usize) -> i32;

    #[cfg(target_os = "linux")]
    extern "C" {
        fn dup(oldfd: c_int) -> c_int;
        fn dup2(oldfd: c_int, newfd: c_int) -> c_int;
        fn close(fd: c_int) -> c_int;
        fn open(path: *const c_char, flags: c_int) -> c_int;
    }
    #[cfg(target_os = "linux")]
    const STDERR_FILENO: c_int = 2;
    #[cfg(target_os = "linux")]
    const O_WRONLY: c_int = 1;

    /// Silences `stderr` for its lifetime, restoring the original on drop.
    ///
    /// **Why this exists:** initialising an OpenCL driver can make it print to `stderr`
    /// over which retch has no control. Mesa's rusticl emits a 247-byte "Patched Mesa
    /// libclc not detected" warning on every enumeration once `RUSTICL_ENABLE` is set, and
    /// a fetch tool that sprays a driver's diagnostics into the terminal is broken. This
    /// was caught by `test_cli_full_mode`, which asserts retch writes nothing to `stderr`;
    /// fastfetch has the same leak and simply lets it through.
    ///
    /// **The caveat, stated rather than hidden:** file descriptors are process-wide, so
    /// this suppresses `stderr` for *every* thread while it is alive, and could in
    /// principle swallow a concurrent probe's error message. It is therefore scoped as
    /// tightly as possible — only around the OpenCL calls, ~20 ms — rather than around the
    /// collection scope. Moving the probe out of the concurrent scope would make the
    /// suppression provably safe, but costs ~100 ms serially and pushes `--full` past
    /// `fastfetch -c all` (1.02 s here), which NOTES.md §3 treats as blocking.
    #[cfg(target_os = "linux")]
    struct SuppressStderr {
        saved: c_int,
    }

    #[cfg(target_os = "linux")]
    impl SuppressStderr {
        fn new() -> Option<Self> {
            // SAFETY: plain fd manipulation. Every call's result is checked, and the
            // original descriptor is retained for restoration in `drop`.
            unsafe {
                let saved = dup(STDERR_FILENO);
                if saved < 0 {
                    return None;
                }
                let devnull = open(c"/dev/null".as_ptr(), O_WRONLY);
                if devnull < 0 {
                    close(saved);
                    return None;
                }
                dup2(devnull, STDERR_FILENO);
                close(devnull);
                Some(Self { saved })
            }
        }
    }

    #[cfg(target_os = "linux")]
    impl Drop for SuppressStderr {
        fn drop(&mut self) {
            // SAFETY: `self.saved` is a live descriptor duplicated from stderr in `new`.
            unsafe {
                dup2(self.saved, STDERR_FILENO);
                close(self.saved);
            }
        }
    }

    /// Report the OpenCL platform version, its provider, and whether a device exists.
    ///
    /// The device count is the point: see the module docs for why a platform advertising a
    /// version while exposing no device is reported as such rather than as a bare version.
    /// No-op stand-in on Windows.
    ///
    /// The Linux suppression exists for one specific driver: Mesa's rusticl prints a
    /// "Patched Mesa libclc not detected" warning to stderr on every enumeration. That
    /// driver does not exist on Windows, where the ICD loader dispatches to vendor DLLs
    /// instead. **Rather than assume the Windows ICDs are equally quiet, this is checked**
    /// — `test_cli_full_mode` asserts retch writes nothing to stderr, and it runs on the
    /// Windows CI leg. Adding suppression here pre-emptively would mean reimplementing the
    /// `dup2` dance on the CRT to solve a problem no observation has shown to exist, while
    /// silencing every other thread's diagnostics for the duration.
    #[cfg(target_os = "windows")]
    struct SuppressStderr;

    #[cfg(target_os = "windows")]
    impl SuppressStderr {
        fn new() -> Option<Self> {
            None
        }
    }

    pub fn detect() -> Option<String> {
        // Held across the whole probe: the driver can write to stderr at dlopen, at
        // platform enumeration, or at device enumeration, and rusticl does so at the last.
        let _quiet = SuppressStderr::new();
        let lib = dl::open(OPENCL_LIB)?;
        let out = detect_with(lib);
        dl::close(lib);
        out
    }

    fn detect_with(lib: *mut c_void) -> Option<String> {
        let get_platform_ids = dl::sym(lib, c"clGetPlatformIDs")?;
        let get_platform_info = dl::sym(lib, c"clGetPlatformInfo")?;

        // SAFETY: pointers are resolved from the ICD loader; every call's return code is
        // checked, and every buffer is sized by a preceding size query.
        unsafe {
            let get_platform_ids: ClGetPlatformIDs = std::mem::transmute(get_platform_ids);
            let get_platform_info: ClGetPlatformInfo = std::mem::transmute(get_platform_info);

            let mut count: u32 = 0;
            if get_platform_ids(0, std::ptr::null_mut(), &mut count) != 0 || count == 0 {
                return None;
            }
            let mut platforms = vec![std::ptr::null_mut::<c_void>(); count as usize];
            if get_platform_ids(count, platforms.as_mut_ptr(), std::ptr::null_mut()) != 0 {
                return None;
            }
            let platform = *platforms.first()?;

            let version = query(get_platform_info, platform, CL_PLATFORM_VERSION)?;
            let name = query(get_platform_info, platform, CL_PLATFORM_NAME).unwrap_or_default();

            let device = dl::sym(lib, c"clGetDeviceIDs")
                .zip(dl::sym(lib, c"clGetDeviceInfo"))
                .and_then(|(ids, info)| first_device_name(platform, ids, info))
                .map(|n| shorten_device_name(&n));

            Some(format_opencl(&version, &name, device.as_deref()))
        }
    }

    /// Two-call size-then-read query against a platform.
    ///
    /// SAFETY: `f` is `clGetPlatformInfo` and `obj` a valid platform id.
    unsafe fn query(f: ClGetPlatformInfo, obj: *mut c_void, param: u32) -> Option<String> {
        let mut size: usize = 0;
        if f(obj, param, 0, std::ptr::null_mut(), &mut size) != 0 || size == 0 {
            return None;
        }
        let mut buf = vec![0u8; size];
        if f(
            obj,
            param,
            size,
            buf.as_mut_ptr() as *mut c_void,
            std::ptr::null_mut(),
        ) != 0
        {
            return None;
        }
        let s = cstr_field(&buf);
        (!s.trim().is_empty()).then(|| s.trim().to_string())
    }

    /// Name of the first device on a platform, or `None` when it exposes none.
    ///
    /// SAFETY: `ids`/`info` are the corresponding OpenCL entry points and `platform` is a
    /// valid platform id.
    unsafe fn first_device_name(
        platform: *mut c_void,
        ids: *mut c_void,
        info: *mut c_void,
    ) -> Option<String> {
        let get_device_ids: ClGetDeviceIDs = std::mem::transmute(ids);
        let get_device_info: ClGetDeviceInfo = std::mem::transmute(info);

        let mut count: u32 = 0;
        // A platform with no usable device answers CL_DEVICE_NOT_FOUND (-1) here. That is
        // the rusticl-without-RUSTICL_ENABLE state, and it is a real answer, not an error.
        if get_device_ids(
            platform,
            CL_DEVICE_TYPE_ALL,
            0,
            std::ptr::null_mut(),
            &mut count,
        ) != 0
            || count == 0
        {
            return None;
        }
        let mut devices = vec![std::ptr::null_mut::<c_void>(); count as usize];
        if get_device_ids(
            platform,
            CL_DEVICE_TYPE_ALL,
            count,
            devices.as_mut_ptr(),
            std::ptr::null_mut(),
        ) != 0
        {
            return None;
        }
        let device = *devices.first()?;
        let mut size: usize = 0;
        if get_device_info(device, CL_DEVICE_NAME, 0, std::ptr::null_mut(), &mut size) != 0
            || size == 0
        {
            return None;
        }
        let mut buf = vec![0u8; size];
        if get_device_info(
            device,
            CL_DEVICE_NAME,
            size,
            buf.as_mut_ptr() as *mut c_void,
            std::ptr::null_mut(),
        ) != 0
        {
            return None;
        }
        let s = cstr_field(&buf);
        (!s.trim().is_empty()).then(|| s.trim().to_string())
    }
}

/// Detect Vulkan, OpenGL and OpenCL versions.
#[cfg(target_os = "linux")]
pub fn detect_gpu_apis() -> GpuApis {
    GpuApis {
        vulkan: vulkan::detect(),
        opengl: opengl::detect(),
        opencl: opencl::detect(),
    }
}

/// Windows: Vulkan and OpenCL, but not OpenGL.
///
/// The Vulkan and OpenCL probes are the *same code* as Linux — those APIs are identical
/// across platforms and only the loader filename differs, which is why the split lives in
/// [`dl`] and the two `*_LIB` constants rather than in duplicated probes.
///
/// **OpenGL is absent here deliberately, not by oversight.** The Linux path gets a headless
/// context through EGL (`EGL_DEFAULT_DISPLAY` plus a surfaceless `eglMakeCurrent`), and
/// **stock Windows ships no `libEGL.dll`** — checked on a Windows 11 box that has
/// `vulkan-1.dll`, `opengl32.dll` and `OpenCL.dll` in `System32` but no EGL at all. A
/// Windows OpenGL version therefore needs WGL against a hidden window, which is a different
/// mechanism rather than a different library name, so it is tracked as separate work
/// (NOTES.md §6a) instead of being half-done here.
#[cfg(target_os = "windows")]
pub fn detect_gpu_apis() -> GpuApis {
    GpuApis {
        vulkan: vulkan::detect(),
        opengl: opengl::detect(),
        opencl: opencl::detect(),
    }
}

/// Other platforms: reports nothing rather than guessing.
#[cfg(not(any(target_os = "linux", target_os = "windows")))]
pub fn detect_gpu_apis() -> GpuApis {
    GpuApis::default()
}

#[cfg(test)]
mod tests {
    use super::*;

    /// The loader filenames are the one part of the Windows arm with no runtime guard: a
    /// typo does not fail, it makes the probe report "not installed", which is
    /// indistinguishable from a machine that genuinely has no Vulkan. Pin them.
    ///
    /// `vulkan-1.dll` and `OpenCL.dll` are the Khronos loaders' fixed names on Windows —
    /// not vendor DLLs, which register themselves behind these. Confirmed present in
    /// `System32` on the machine this was developed against.
    #[cfg(target_os = "windows")]
    #[test]
    fn test_windows_loader_names_are_the_khronos_loaders() {
        assert_eq!(VULKAN_LIB.to_str().unwrap(), "vulkan-1.dll");
        assert_eq!(OPENCL_LIB.to_str().unwrap(), "OpenCL.dll");
    }

    /// The Linux sonames, pinned for the same reason and to keep the two arms visibly
    /// paired — a change to one should prompt a look at the other.
    #[cfg(target_os = "linux")]
    #[test]
    fn test_linux_loader_sonames() {
        assert_eq!(VULKAN_LIB.to_str().unwrap(), "libvulkan.so.1");
        assert_eq!(OPENCL_LIB.to_str().unwrap(), "libOpenCL.so.1");
    }

    /// The AMD platform string this machine reports, run through the same formatter the
    /// Linux Mesa strings go through.
    ///
    /// Windows drivers phrase `CL_PLATFORM_VERSION` differently from Mesa — AMD's carries
    /// a build number in parentheses — so this pins that the `OpenCL ` prefix strip still
    /// does the right thing on a non-Mesa string, and that the parenthesised build number
    /// is **not** mistaken for the device descriptor `shorten_device_name` strips.
    #[test]
    fn test_format_opencl_handles_a_windows_vendor_platform_string() {
        assert_eq!(
            format_opencl(
                "OpenCL 2.1 AMD-APP (3661.0)",
                "AMD Accelerated Parallel Processing",
                Some("gfx1151"),
            ),
            "2.1 AMD-APP (3661.0) - AMD Accelerated Parallel Processing (gfx1151)"
        );
    }

    /// A device name with no parenthesised driver descriptor must survive intact.
    ///
    /// The Linux fixtures all have one (Mesa appends `(radeonsi, phoenix, ACO, …)`), so
    /// nothing pinned the other branch until Windows produced a bare `gfx1151`.
    #[test]
    fn test_shorten_device_name_leaves_a_bare_name_alone() {
        assert_eq!(shorten_device_name("gfx1151"), "gfx1151");
        assert_eq!(shorten_device_name("  gfx1151  "), "gfx1151");
    }

    #[test]
    fn test_format_vulkan_version_decodes_packed_fields() {
        // 0x00404155 is what this machine's loader reports: 1.4.341.
        assert_eq!(format_vulkan_version(0x0040_4155), "1.4.341");
        // major/minor/patch boundaries
        assert_eq!(format_vulkan_version(1 << 22), "1.0.0");
        assert_eq!(format_vulkan_version((1 << 22) | (2 << 12)), "1.2.0");
        assert_eq!(
            format_vulkan_version((1 << 22) | (3 << 12) | 290),
            "1.3.290"
        );
    }

    #[test]
    fn test_format_vulkan_version_ignores_variant_bits() {
        // The top 3 bits are the variant; a non-Khronos variant must not leak into the
        // printed version or users see a leading number that means nothing to them.
        let with_variant = (1u32 << 29) | (1 << 22) | (4 << 12) | 354;
        assert_eq!(format_vulkan_version(with_variant), "1.4.354");
    }

    #[test]
    fn test_device_type_rank_prefers_real_gpu_over_software() {
        // The case that matters: a real GPU (integrated=1) must outrank llvmpipe (CPU=4),
        // which is enumerated alongside it on any Mesa system.
        assert!(device_type_rank(1) < device_type_rank(4));
        assert!(device_type_rank(2) < device_type_rank(1)); // discrete beats integrated
        assert!(device_type_rank(3) < device_type_rank(4)); // virtual beats CPU
        assert!(device_type_rank(0) < device_type_rank(4)); // even "other" beats CPU
    }

    #[test]
    fn test_format_vulkan_handles_unfilled_driver_chain() {
        // An instance below Vulkan 1.2 leaves these empty with no error, so the version
        // alone must still render.
        assert_eq!(format_vulkan("1.4.354", "", ""), "1.4.354");
        assert_eq!(format_vulkan("1.4.354", "radv", ""), "1.4.354 - radv");
        assert_eq!(
            format_vulkan("1.4.354", "radv", "Mesa 26.1.8"),
            "1.4.354 - radv [Mesa 26.1.8]"
        );
    }

    #[test]
    fn test_format_opencl_distinguishes_inert_platform_from_working_one() {
        // The whole point of the field: rusticl without RUSTICL_ENABLE advertises 3.0 and
        // exposes nothing. fastfetch prints "3.0" for both of these.
        assert_eq!(
            format_opencl("OpenCL 3.0", "rusticl", None),
            "3.0 - rusticl (no device enabled)"
        );
        assert_eq!(
            format_opencl("OpenCL 3.0", "rusticl", Some("AMD Radeon 780M Graphics")),
            "3.0 - rusticl (AMD Radeon 780M Graphics)"
        );
        // A device string that is only whitespace is not a device.
        assert_eq!(
            format_opencl("OpenCL 3.0", "rusticl", Some("   ")),
            "3.0 - rusticl (no device enabled)"
        );
    }

    #[test]
    fn test_format_opencl_without_platform_name() {
        assert_eq!(
            format_opencl("OpenCL 1.2", "", None),
            "1.2 (no device enabled)"
        );
        assert_eq!(format_opencl("OpenCL 1.2", "", Some("GPU")), "1.2 (GPU)");
        // A platform that does not carry the spec-mandated prefix is left alone rather
        // than having its first word eaten.
        assert_eq!(format_opencl("3.0", "x", Some("GPU")), "3.0 - x (GPU)");
    }

    #[test]
    fn test_shorten_device_name_drops_the_driver_descriptor() {
        // The real string this machine returns, otherwise 80+ characters of driver detail.
        assert_eq!(
            shorten_device_name(
                "AMD Radeon 780M Graphics (radeonsi, phoenix, ACO, DRM 3.64, 7.1.13-200.fc44.x86_64)"
            ),
            "AMD Radeon 780M Graphics"
        );
        // A name with no descriptor is returned intact rather than truncated.
        assert_eq!(
            shorten_device_name("NVIDIA GeForce RTX 4090"),
            "NVIDIA GeForce RTX 4090"
        );
        // Only " (" splits, so a parenthesis inside a model name survives.
        assert_eq!(
            shorten_device_name("Intel(R) Arc(TM) A770"),
            "Intel(R) Arc(TM) A770"
        );
    }

    #[test]
    fn test_cstr_field_stops_at_nul() {
        let mut buf = [0u8; 16];
        buf[..4].copy_from_slice(b"radv");
        assert_eq!(cstr_field(&buf), "radv");
        // An unwritten field is empty, not garbage — this is how an ignored pNext presents.
        assert_eq!(cstr_field(&[0u8; 16]), "");
        // No NUL at all: use the whole buffer rather than reading past it.
        assert_eq!(cstr_field(b"abcd"), "abcd");
    }
}

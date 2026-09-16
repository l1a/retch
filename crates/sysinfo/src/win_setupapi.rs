// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Shared SetupAPI (`setupapi.dll`) device-enumeration helper for Windows detection.
//!
//! Enumerates present devices — by setup class, by device interface, or across every class
//! — the native equivalent of `Get-PnpDevice -PresentOnly` and its `-Class` filter. Used
//! by the `bluetooth`, `camera`, `battery` and `gamepad` detection modules. Hand-written
//! `extern "system"` FFI matching the crate's Windows style (see `win_reg.rs`).

use std::ffi::c_void;
use std::mem::size_of;
use std::ptr;

type Handle = *mut c_void;
const INVALID_HANDLE_VALUE: Handle = -1isize as Handle;
const DIGCF_PRESENT: u32 = 0x0000_0002;
const DIGCF_DEVICEINTERFACE: u32 = 0x0000_0010;
/// What `SP_DEVICE_INTERFACE_DETAIL_DATA_W.cbSize` must be set to on 64-bit Windows: the
/// size of the struct's *fixed* part, **not** the size of the buffer being passed. Passing
/// the buffer size is the classic error and fails with `ERROR_INVALID_USER_BUFFER`.
const DETAIL_CB_SIZE: usize = 8;

/// Byte offset of the inline `WCHAR DevicePath[]` within that struct.
///
/// **This is 4, and it is NOT the same number as `DETAIL_CB_SIZE`** — which is the trap.
/// The struct is `{ DWORD cbSize; WCHAR DevicePath[ANYSIZE_ARRAY]; }`: the DWORD forces
/// 4-byte alignment so `sizeof` rounds up to 8, but the path still begins immediately
/// after the DWORD at offset 4. Reading from 8 silently drops the first two characters of
/// the path, and the only symptom is that `CreateFileW` then fails to open a device that
/// plainly exists — which reads as "no such device" rather than as a parsing bug. Hit
/// exactly that way while writing the battery probe.
const DETAIL_PATH_OFFSET: usize = 4;
const SPDRP_DEVICEDESC: u32 = 0x0000_0000;
const SPDRP_FRIENDLYNAME: u32 = 0x0000_000C;

/// A Win32/COM `GUID`.
#[repr(C)]
pub struct Guid {
    pub data1: u32,
    pub data2: u16,
    pub data3: u16,
    pub data4: [u8; 8],
}

/// `GUID_DEVCLASS_BLUETOOTH` = {e0cbf06c-cd8b-4647-bb8a-263b43f0f974}
pub const GUID_DEVCLASS_BLUETOOTH: Guid = Guid {
    data1: 0xe0cb_f06c,
    data2: 0xcd8b,
    data3: 0x4647,
    data4: [0xbb, 0x8a, 0x26, 0x3b, 0x43, 0xf0, 0xf9, 0x74],
};

/// `KSCATEGORY_VIDEO_CAMERA` device *interface* class =
/// {e5323777-f976-4f5b-9b55-b94699c46e44}.
///
/// Real video-capture cameras register this interface; scanners/printers in the Image
/// (WIA) setup class do **not**. Enumerating by this interface (rather than the Camera +
/// Image setup classes) therefore returns webcams while excluding scanners/MFPs — a
/// scanner and a webcam can share the Image setup class, so only the interface reliably
/// distinguishes them.
pub const KSCATEGORY_VIDEO_CAMERA: Guid = Guid {
    data1: 0xe532_3777,
    data2: 0xf976,
    data3: 0x4f5b,
    data4: [0x9b, 0x55, 0xb9, 0x46, 0x99, 0xc4, 0x6e, 0x44],
};

/// A `DEVPROPKEY` — a property GUID plus its property id.
///
/// Distinct from the older `SPDRP_*` registry properties read by
/// [`SetupDiGetDeviceRegistryPropertyW`]: the unified device property model exposes
/// values (such as live connection state) that have no `SPDRP_` equivalent.
#[repr(C)]
pub struct DevPropKey {
    pub fmtid: Guid,
    pub pid: u32,
}

/// `System.Devices.Connected` = {83DA6326-97A6-4088-9453-A1923F573B29}, PID 15.
///
/// `DEVPROP_TYPE_BOOLEAN`, and the only PnP-visible signal for whether a device is
/// *currently* connected rather than merely paired. Verified across both Bluetooth
/// transports: the neighbouring `DEVPKEY_Bluetooth_LastConnectedTime` is historical (it
/// records when a link was last established, not whether one is up) and
/// `DEVPKEY_DeviceContainer_AlwaysShowDeviceAsConnected` is a shell display hint that
/// reads `True` regardless — neither is a usable oracle.
pub const DEVPKEY_DEVICE_CONNECTED: DevPropKey = DevPropKey {
    fmtid: Guid {
        data1: 0x83da_6326,
        data2: 0x97a6,
        data3: 0x4088,
        data4: [0x94, 0x53, 0xa1, 0x92, 0x3f, 0x57, 0x3b, 0x29],
    },
    pid: 15,
};

/// `DEVPROP_TYPE_BOOLEAN`. Its `TRUE` is `0xFF` (-1), not `1`.
const DEVPROP_TYPE_BOOLEAN: u32 = 0x0000_0011;

/// A present device node: its instance id, friendly name, and connection state.
pub struct PresentDevice {
    /// e.g. `BTHLE\DEV_F5183CA50C6B\9&1C053637&0&F5183CA50C6B`.
    pub instance_id: String,
    pub name: Option<String>,
    /// `None` when the device does not expose [`DEVPKEY_DEVICE_CONNECTED`] — treated as
    /// unknown rather than as disconnected.
    pub connected: Option<bool>,
}

#[repr(C)]
struct SpDevinfoData {
    cb_size: u32,
    class_guid: Guid,
    dev_inst: u32,
    reserved: usize,
}

/// `SP_DEVICE_INTERFACE_DATA`. `cb_size` must be set before each enumeration call, the
/// same contract `SpDevinfoData` has.
#[repr(C)]
struct SpDeviceInterfaceData {
    cb_size: u32,
    interface_class_guid: Guid,
    flags: u32,
    reserved: usize,
}

#[link(name = "setupapi")]
extern "system" {
    fn SetupDiGetClassDevsW(
        class_guid: *const Guid,
        enumerator: *const u16,
        hwnd_parent: Handle,
        flags: u32,
    ) -> Handle;
    fn SetupDiEnumDeviceInfo(dev_info: Handle, index: u32, data: *mut SpDevinfoData) -> i32;
    fn SetupDiGetDeviceRegistryPropertyW(
        dev_info: Handle,
        data: *const SpDevinfoData,
        property: u32,
        property_reg_data_type: *mut u32,
        property_buffer: *mut u8,
        property_buffer_size: u32,
        required_size: *mut u32,
    ) -> i32;
    fn SetupDiGetDevicePropertyW(
        dev_info: Handle,
        data: *const SpDevinfoData,
        prop_key: *const DevPropKey,
        prop_type: *mut u32,
        prop_buffer: *mut u8,
        prop_buffer_size: u32,
        required_size: *mut u32,
        flags: u32,
    ) -> i32;
    fn SetupDiGetDeviceInstanceIdW(
        dev_info: Handle,
        data: *const SpDevinfoData,
        buffer: *mut u16,
        buffer_size: u32,
        required_size: *mut u32,
    ) -> i32;
    fn SetupDiDestroyDeviceInfoList(dev_info: Handle) -> i32;
    fn SetupDiEnumDeviceInterfaces(
        dev_info: Handle,
        dev_info_data: *mut SpDevinfoData,
        interface_class_guid: *const Guid,
        member_index: u32,
        interface_data: *mut SpDeviceInterfaceData,
    ) -> i32;
    fn SetupDiGetDeviceInterfaceDetailW(
        dev_info: Handle,
        interface_data: *mut SpDeviceInterfaceData,
        detail_data: *mut u8,
        detail_data_size: u32,
        required_size: *mut u32,
        device_info_data: *mut SpDevinfoData,
    ) -> i32;
}

/// Converts a null-terminated wide buffer to a trimmed `String`; `None` if empty.
fn wide_to_string(buf: &[u16]) -> Option<String> {
    let len = buf.iter().position(|&c| c == 0).unwrap_or(buf.len());
    let s = String::from_utf16_lossy(&buf[..len]).trim().to_string();
    if s.is_empty() {
        None
    } else {
        Some(s)
    }
}

/// Reads a device's friendly name, falling back to its device description.
fn device_name(dev_info: Handle, data: &SpDevinfoData) -> Option<String> {
    for prop in [SPDRP_FRIENDLYNAME, SPDRP_DEVICEDESC] {
        let mut buf = [0u16; 512];
        let mut required = 0u32;
        // SAFETY: buf is writable with its byte length passed; data is a valid SP_DEVINFO_DATA.
        let ok = unsafe {
            SetupDiGetDeviceRegistryPropertyW(
                dev_info,
                data,
                prop,
                ptr::null_mut(),
                buf.as_mut_ptr() as *mut u8,
                (buf.len() * 2) as u32,
                &mut required,
            )
        };
        if ok != 0 {
            if let Some(name) = wide_to_string(&buf) {
                return Some(name);
            }
        }
    }
    None
}

/// Friendly names of present devices selected by `class_guid` interpreted per `flags`.
///
/// With `DIGCF_PRESENT` alone, `class_guid` is a *setup* class; adding
/// `DIGCF_DEVICEINTERFACE` interprets it as a device *interface* class. Either way the
/// underlying devnodes are enumerated via `SetupDiEnumDeviceInfo` and their friendly
/// names read.
fn enumerate_names(class_guid: &Guid, flags: u32) -> Vec<String> {
    let mut names = Vec::new();
    // SAFETY: the device-info set is created and destroyed in-scope.
    unsafe {
        let dev_info = SetupDiGetClassDevsW(class_guid, ptr::null(), ptr::null_mut(), flags);
        if dev_info == INVALID_HANDLE_VALUE {
            return names;
        }
        let mut index = 0u32;
        loop {
            let mut data: SpDevinfoData = std::mem::zeroed();
            data.cb_size = size_of::<SpDevinfoData>() as u32;
            if SetupDiEnumDeviceInfo(dev_info, index, &mut data) == 0 {
                break;
            }
            index += 1;
            if let Some(name) = device_name(dev_info, &data) {
                names.push(name);
            }
        }
        SetupDiDestroyDeviceInfoList(dev_info);
    }
    names
}

/// Reads a device's instance id (e.g. `BTHLE\DEV_F5183CA50C6B\9&1C053637&0&…`).
fn device_instance_id(dev_info: Handle, data: &SpDevinfoData) -> Option<String> {
    let mut buf = [0u16; 512];
    let mut required = 0u32;
    // SAFETY: buf is writable and its element count is passed as the size; data is a
    // valid SP_DEVINFO_DATA obtained from SetupDiEnumDeviceInfo.
    let ok = unsafe {
        SetupDiGetDeviceInstanceIdW(
            dev_info,
            data,
            buf.as_mut_ptr(),
            buf.len() as u32,
            &mut required,
        )
    };
    if ok == 0 {
        return None;
    }
    wide_to_string(&buf)
}

/// Reads [`DEVPKEY_DEVICE_CONNECTED`]; `None` when the device does not expose it.
fn device_connected(dev_info: Handle, data: &SpDevinfoData) -> Option<bool> {
    let mut prop_type = 0u32;
    let mut value = 0u8;
    let mut required = 0u32;
    // SAFETY: a one-byte buffer is correct for DEVPROP_TYPE_BOOLEAN and its length is
    // passed; data is a valid SP_DEVINFO_DATA.
    let ok = unsafe {
        SetupDiGetDevicePropertyW(
            dev_info,
            data,
            &DEVPKEY_DEVICE_CONNECTED,
            &mut prop_type,
            &mut value,
            1,
            &mut required,
            0,
        )
    };
    if ok == 0 || prop_type != DEVPROP_TYPE_BOOLEAN {
        return None;
    }
    // DEVPROP_TRUE is 0xFF (-1) and DEVPROP_FALSE is 0, so this must test for non-zero
    // rather than for 1.
    Some(value != 0)
}

/// All *present* devices in the given setup class, with connection state.
///
/// The heavier sibling of [`present_device_names`], for callers that need to tell a
/// connected device from a merely-paired one.
pub fn present_devices(class_guid: &Guid) -> Vec<PresentDevice> {
    let mut devices = Vec::new();
    // SAFETY: the device-info set is created and destroyed in-scope.
    unsafe {
        let dev_info =
            SetupDiGetClassDevsW(class_guid, ptr::null(), ptr::null_mut(), DIGCF_PRESENT);
        if dev_info == INVALID_HANDLE_VALUE {
            return devices;
        }
        let mut index = 0u32;
        loop {
            let mut data: SpDevinfoData = std::mem::zeroed();
            data.cb_size = size_of::<SpDevinfoData>() as u32;
            if SetupDiEnumDeviceInfo(dev_info, index, &mut data) == 0 {
                break;
            }
            index += 1;
            let Some(instance_id) = device_instance_id(dev_info, &data) else {
                continue;
            };
            devices.push(PresentDevice {
                instance_id,
                name: device_name(dev_info, &data),
                connected: device_connected(dev_info, &data),
            });
        }
        SetupDiDestroyDeviceInfoList(dev_info);
    }
    devices
}

/// Friendly names of all *present* devices in the given setup class (the native
/// equivalent of `Get-PnpDevice -Class <class> -PresentOnly`).
pub fn present_device_names(class_guid: &Guid) -> Vec<String> {
    enumerate_names(class_guid, DIGCF_PRESENT)
}

/// Friendly names of all *present* devices exposing the given device *interface* class.
///
/// Use this when the setup class is ambiguous — e.g. cameras and scanners share the Image
/// setup class, but only cameras expose [`KSCATEGORY_VIDEO_CAMERA`].
pub fn present_interface_device_names(interface_guid: &Guid) -> Vec<String> {
    enumerate_names(interface_guid, DIGCF_PRESENT | DIGCF_DEVICEINTERFACE)
}

/// Device *paths* for every present device exposing `interface_guid`, e.g.
/// `\\?\acpi#pnp0c0a#0#{72631e54-...}`.
///
/// Distinct from [`present_interface_device_names`], which returns friendly names read
/// from the registry. A path is what `CreateFileW` accepts, so this is the entry point for
/// any probe that needs to *talk* to a device rather than merely name it — `battery` sends
/// it IOCTLs. Kept here rather than in the caller because the enumeration dance
/// (`SetupDiEnumDeviceInterfaces`, a size query, then the real
/// `SetupDiGetDeviceInterfaceDetailW`) is the part that is easy to get subtly wrong.
pub fn present_interface_device_paths(interface_guid: &Guid) -> Vec<String> {
    let mut paths = Vec::new();
    // SAFETY: the handle is checked before use and destroyed on every exit path; each
    // buffer is sized by a preceding size query and the struct sizes are set as the API
    // requires.
    unsafe {
        let dev_info = SetupDiGetClassDevsW(
            interface_guid,
            ptr::null(),
            ptr::null_mut(),
            DIGCF_PRESENT | DIGCF_DEVICEINTERFACE,
        );
        if dev_info.is_null() || dev_info == INVALID_HANDLE_VALUE {
            return paths;
        }
        let mut index = 0u32;
        loop {
            let mut data = SpDeviceInterfaceData {
                cb_size: size_of::<SpDeviceInterfaceData>() as u32,
                interface_class_guid: Guid {
                    data1: 0,
                    data2: 0,
                    data3: 0,
                    data4: [0; 8],
                },
                flags: 0,
                reserved: 0,
            };
            if SetupDiEnumDeviceInterfaces(
                dev_info,
                ptr::null_mut(),
                interface_guid,
                index,
                &mut data,
            ) == 0
            {
                break;
            }
            index += 1;

            // Size query first: the detail struct is variable-length because the path is
            // inline, so there is no fixed buffer that is always big enough.
            let mut needed = 0u32;
            SetupDiGetDeviceInterfaceDetailW(
                dev_info,
                &mut data,
                ptr::null_mut(),
                0,
                &mut needed,
                ptr::null_mut(),
            );
            if needed as usize <= DETAIL_PATH_OFFSET {
                continue;
            }
            let mut detail = vec![0u8; needed as usize];
            detail[0..4].copy_from_slice(&(DETAIL_CB_SIZE as u32).to_ne_bytes());
            if SetupDiGetDeviceInterfaceDetailW(
                dev_info,
                &mut data,
                detail.as_mut_ptr(),
                needed,
                &mut needed,
                ptr::null_mut(),
            ) == 0
            {
                continue;
            }
            let wide: Vec<u16> = detail[DETAIL_PATH_OFFSET..]
                .as_chunks::<2>()
                .0
                .iter()
                .map(|c| u16::from_ne_bytes(*c))
                .collect();
            if let Some(path) = wide_to_string(&wide) {
                paths.push(path);
            }
        }
        SetupDiDestroyDeviceInfoList(dev_info);
    }
    paths
}

/// `DIGCF_ALLCLASSES`: enumerate every setup class. The class GUID argument is then
/// ignored, and may be null.
const DIGCF_ALLCLASSES: u32 = 0x0000_0004;
/// `SPDRP_HARDWAREID`, a `REG_MULTI_SZ`.
const SPDRP_HARDWAREID: u32 = 0x0000_0001;

/// `GUID_DEVCLASS_HIDCLASS` = {745a17a0-74d3-11d0-b6fe-00a0c90f57da}, the setup class every
/// HID top-level collection is installed under.
pub const GUID_DEVCLASS_HIDCLASS: Guid = Guid {
    data1: 0x745a_17a0,
    data2: 0x74d3,
    data3: 0x11d0,
    data4: [0xb6, 0xfe, 0x00, 0xa0, 0xc9, 0x0f, 0x57, 0xda],
};

/// A present device node from an all-classes enumeration: the three properties
/// `Get-PnpDevice` exposes as `ClassGuid`, `FriendlyName` and `HardwareID`.
pub struct PnpDevice {
    pub class_guid: Guid,
    /// Friendly name, falling back to the device description — what `Get-PnpDevice`
    /// reports as `FriendlyName` for a node that has no explicit one.
    pub name: Option<String>,
    /// Most specific first, e.g. `HID\VID_045E&UP:0001_U:0080`, …, `HID_DEVICE`. The HID
    /// "special purpose" IDs such as `HID_DEVICE_SYSTEM_GAME` appear here, not among the
    /// compatible IDs (which are empty for HID collections).
    pub hardware_ids: Vec<String>,
}

impl PnpDevice {
    /// Whether this device is installed under the given setup class.
    pub fn in_class(&self, class: &Guid) -> bool {
        self.class_guid.data1 == class.data1
            && self.class_guid.data2 == class.data2
            && self.class_guid.data3 == class.data3
            && self.class_guid.data4 == class.data4
    }
}

/// Splits a `REG_MULTI_SZ` buffer — strings separated by one NUL and terminated by two —
/// into its entries.
///
/// Stops at the first empty string, so zeroed buffer space past the double NUL is never
/// read as data.
fn split_multi_sz(buf: &[u16]) -> Vec<String> {
    buf.split(|&c| c == 0)
        .take_while(|s| !s.is_empty())
        .map(String::from_utf16_lossy)
        .collect()
}

/// Reads a `REG_MULTI_SZ` registry property of a device.
///
/// Hardware-ID lists on composite devices run to several hundred characters, so a buffer
/// that proves too small is retried at the size the first call reports rather than
/// silently truncated — a truncated list would drop the generic IDs at its tail, which are
/// exactly the ones callers match on.
fn device_multi_sz(dev_info: Handle, data: &SpDevinfoData, prop: u32) -> Vec<String> {
    let mut buf = vec![0u16; 512];
    for _ in 0..2 {
        let mut required = 0u32;
        // SAFETY: buf is writable with its byte length passed; data is a valid SP_DEVINFO_DATA.
        let ok = unsafe {
            SetupDiGetDeviceRegistryPropertyW(
                dev_info,
                data,
                prop,
                ptr::null_mut(),
                buf.as_mut_ptr() as *mut u8,
                (buf.len() * 2) as u32,
                &mut required,
            )
        };
        if ok != 0 {
            return split_multi_sz(&buf);
        }
        let needed = (required as usize).div_ceil(2);
        if needed <= buf.len() {
            // Failed for a reason other than size (typically: the device has no such
            // property), so a bigger buffer would not help.
            break;
        }
        buf = vec![0u16; needed];
    }
    Vec::new()
}

/// Every *present* device node on the machine, across all setup classes — the native
/// equivalent of `Get-PnpDevice -PresentOnly`.
///
/// Heavier than the class-scoped helpers (a few hundred nodes rather than a few dozen), so
/// use it only where the predicate genuinely spans classes.
pub fn present_devices_all_classes() -> Vec<PnpDevice> {
    let mut devices = Vec::new();
    // SAFETY: the device-info set is created and destroyed in-scope.
    unsafe {
        let dev_info = SetupDiGetClassDevsW(
            ptr::null(),
            ptr::null(),
            ptr::null_mut(),
            DIGCF_PRESENT | DIGCF_ALLCLASSES,
        );
        if dev_info == INVALID_HANDLE_VALUE {
            return devices;
        }
        let mut index = 0u32;
        loop {
            let mut data: SpDevinfoData = std::mem::zeroed();
            data.cb_size = size_of::<SpDevinfoData>() as u32;
            if SetupDiEnumDeviceInfo(dev_info, index, &mut data) == 0 {
                break;
            }
            index += 1;
            let name = device_name(dev_info, &data);
            let hardware_ids = device_multi_sz(dev_info, &data, SPDRP_HARDWAREID);
            devices.push(PnpDevice {
                class_guid: data.class_guid,
                name,
                hardware_ids,
            });
        }
        SetupDiDestroyDeviceInfoList(dev_info);
    }
    devices
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sp_devinfo_data_layout() {
        // SetupDiEnumDeviceInfo rejects the struct unless cb_size matches the OS's
        // sizeof(SP_DEVINFO_DATA): 4 (cbSize) + 16 (GUID) + 4 (DevInst) + 8 (Reserved,
        // ULONG_PTR) = 32 on 64-bit Windows. A padding/field-order regression would break
        // every enumeration silently, so pin the size.
        assert_eq!(size_of::<SpDevinfoData>(), 32);
        assert_eq!(size_of::<Guid>(), 16);
    }

    #[test]
    fn test_split_multi_sz() {
        let wide = |s: &str| s.encode_utf16().collect::<Vec<u16>>();
        // Two entries, the double-NUL terminator, then zeroed spare buffer space.
        let mut buf = wide("HID\\VID_045E&UP:0001_U:0080");
        buf.push(0);
        buf.extend(wide("HID_DEVICE_SYSTEM_CONTROL"));
        buf.extend([0, 0, 0, 0]);
        assert_eq!(
            split_multi_sz(&buf),
            vec![
                "HID\\VID_045E&UP:0001_U:0080".to_string(),
                "HID_DEVICE_SYSTEM_CONTROL".to_string()
            ]
        );
        // Data past the terminator is never read back as an entry.
        let mut trailing = wide("A");
        trailing.extend([0, 0]);
        trailing.extend(wide("STALE"));
        assert_eq!(split_multi_sz(&trailing), vec!["A".to_string()]);
        // An empty list is just the terminator.
        assert!(split_multi_sz(&[0, 0]).is_empty());
        assert!(split_multi_sz(&[]).is_empty());
    }

    #[test]
    fn test_dev_prop_key_layout() {
        // SetupDiGetDevicePropertyW reads the key by pointer, so a padding or field-order
        // regression would silently query the wrong property rather than fail loudly:
        // 16 (GUID) + 4 (PID) = 20, with no tail padding.
        assert_eq!(size_of::<DevPropKey>(), 20);
    }
}

// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Shared Windows network-interface enumeration via `GetIfTable2`.
//!
//! Two fields need the same table for different reasons — `net-io` wants each interface's
//! byte counters, and `net` wants to know which rows are real interfaces at all — so the
//! FFI lives here rather than being declared twice. `MIB_IF_ROW2` is a 1352-byte struct
//! whose useful fields sit past 1.2 KB of preceding ones; two copies of that definition
//! drifting apart is exactly the hazard the shared `win_setupapi` module exists to avoid.
//!
//! Hand-written `extern "system"` declarations, matching the crate's Windows FFI house
//! style (`win_reg.rs`, `win_setupapi.rs`) rather than a binding crate.
//!
//! `GetIfTable2` is used rather than the older `GetIfTable`, whose `MIB_IFROW` carries
//! **32-bit** octet counters that wrap every 4 GB — a wrapped counter yields a
//! plausible-looking number rather than an obvious failure.

/// `IF_TYPE_SOFTWARE_LOOPBACK`, the `MIB_IF_ROW2.Type` value for a loopback interface.
#[cfg(any(target_os = "windows", test))]
const IF_TYPE_SOFTWARE_LOOPBACK: u32 = 24;

/// `FilterInterface`, bit 1 of `MIB_IF_ROW2.InterfaceAndOperStatusFlags`.
///
/// The flags are a struct of `BOOLEAN` bitfields, so all eight live in one byte,
/// least-significant first: bit 0 `HardwareInterface`, bit 1 `FilterInterface`,
/// bit 2 `ConnectorPresent`.
#[cfg(any(target_os = "windows", test))]
const FILTER_INTERFACE_FLAG: u8 = 1 << 1;

/// One interface as reported by `GetIfTable2`, reduced to the fields anything here needs.
#[cfg(target_os = "windows")]
#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct IfRow {
    /// The adapter's friendly name (`MIB_IF_ROW2.Alias`), e.g. `Wi-Fi`. This is the same
    /// vocabulary sysinfo reports interfaces in, which is what lets the two be matched.
    pub name: String,
    /// Cumulative bytes received (`InOctets`).
    pub in_octets: u64,
    /// Cumulative bytes transmitted (`OutOctets`).
    pub out_octets: u64,
}

/// Decides whether a `GetIfTable2` row is a real interface worth reporting.
///
/// **This is the Windows equivalent of excluding partitions, and it is not cosmetic.**
/// Every NDIS lightweight filter bound to an adapter gets its own row carrying that
/// adapter's *identical* counters. Measured on a Wi-Fi-only machine: `Wi-Fi` plus
/// `Wi-Fi-WFP Native MAC Layer LightWeight Filter-0000`,
/// `Wi-Fi-Native WiFi Filter Driver-0000`, `Wi-Fi-QoS Packet Scheduler-0000` and
/// `Wi-Fi-WFP 802.3 MAC Layer LightWeight Filter-0000` all reported `in=219996461
/// out=32914969`. Reporting them all states the machine's throughput five times, under
/// five names a reader would reasonably take for five devices.
///
/// **The rule is "exclude filter instances", NOT "keep hardware interfaces only"**, and
/// the difference is load-bearing: on the same machine the `wt0` WireGuard tunnel reads
/// `HardwareInterface = false, FilterInterface = false` while carrying real traffic, so
/// keying on `HardwareInterface` would drop exactly the kind of interface the Linux side
/// reports. Filter rows are the thing that is duplicated, so filter rows are what to drop.
///
/// Loopback is excluded to match the Linux arms dropping `lo`.
#[cfg(any(target_os = "windows", test))]
pub(crate) fn is_reportable_interface(if_type: u32, flags: u8) -> bool {
    if_type != IF_TYPE_SOFTWARE_LOOPBACK && (flags & FILTER_INTERFACE_FLAG) == 0
}

/// Enumerates the real network interfaces, filter instances and loopback excluded.
///
/// Returns an empty vector if the table cannot be read, so callers degrade to "no
/// information" rather than to a confident wrong answer.
#[cfg(target_os = "windows")]
pub(crate) fn interfaces() -> Vec<IfRow> {
    ffi::enumerate()
}

/// The names of rows that are **not** real interfaces — NDIS filter instances and
/// loopback.
///
/// `detect_networks` needs this rather than [`interfaces`] because it builds its list from
/// sysinfo and only wants to know which of those names to drop. Exposed as the exclusion
/// set rather than the inclusion set deliberately: an interface that `GetIfTable2` does not
/// list at all must still be reported by the caller, not silently removed.
#[cfg(target_os = "windows")]
pub(crate) fn excluded_interface_names() -> Vec<String> {
    ffi::enumerate_excluded()
}

#[cfg(target_os = "windows")]
mod ffi {
    use super::{is_reportable_interface, IfRow};
    use std::ffi::c_void;
    use std::ptr;

    /// `MIB_IF_ROW2`. Every field is declared because the ones that matter sit 1208 and
    /// 1280 bytes in — the offsets are only correct if everything ahead of them is.
    #[repr(C)]
    pub(super) struct MibIfRow2 {
        interface_luid: u64,
        interface_index: u32,
        interface_guid: [u8; 16],
        alias: [u16; 257],
        description: [u16; 257],
        physical_address_length: u32,
        physical_address: [u8; 32],
        permanent_physical_address: [u8; 32],
        mtu: u32,
        if_type: u32,
        tunnel_type: u32,
        media_type: u32,
        physical_medium_type: u32,
        access_type: u32,
        direction_type: u32,
        interface_and_oper_status_flags: u8,
        oper_status: u32,
        admin_status: u32,
        media_connect_state: u32,
        network_guid: [u8; 16],
        connection_type: u32,
        transmit_link_speed: u64,
        receive_link_speed: u64,
        in_octets: u64,
        in_ucast_pkts: u64,
        in_nucast_pkts: u64,
        in_discards: u64,
        in_errors: u64,
        in_unknown_protos: u64,
        in_ucast_octets: u64,
        in_multicast_octets: u64,
        in_broadcast_octets: u64,
        out_octets: u64,
        out_ucast_pkts: u64,
        out_nucast_pkts: u64,
        out_discards: u64,
        out_errors: u64,
        out_ucast_octets: u64,
        out_multicast_octets: u64,
        out_broadcast_octets: u64,
        out_qlen: u64,
    }

    /// `MIB_IF_TABLE2`. `Table` is declared `[MIB_IF_ROW2; 1]` as the header does; the
    /// real row count is `num_entries` and the rows follow contiguously.
    #[repr(C)]
    pub(super) struct MibIfTable2 {
        num_entries: u32,
        table: [MibIfRow2; 1],
    }

    #[link(name = "iphlpapi")]
    extern "system" {
        fn GetIfTable2(table: *mut *mut MibIfTable2) -> u32;
        fn FreeMibTable(memory: *mut c_void);
    }

    /// Walks the table once, handing each row to `f`, and frees it exactly once.
    ///
    /// Both public entry points need the same acquire/walk/free dance over a raw
    /// allocation; writing it twice is how one of them ends up leaking or double-freeing.
    fn with_rows<T>(mut f: impl FnMut(&MibIfRow2) -> Option<T>) -> Vec<T> {
        let mut table: *mut MibIfTable2 = ptr::null_mut();
        // SAFETY: GetIfTable2 allocates the table and writes its address into `table`.
        let rc = unsafe { GetIfTable2(&mut table) };
        if rc != 0 || table.is_null() {
            return Vec::new();
        }

        // SAFETY: rc == 0 means the table is allocated and initialised. `table.table` is
        // the first of `num_entries` contiguous rows.
        let out = unsafe {
            let count = (*table).num_entries as usize;
            let rows = ptr::addr_of!((*table).table) as *const MibIfRow2;
            (0..count).filter_map(|i| f(&*rows.add(i))).collect()
        };

        // SAFETY: the table was allocated by GetIfTable2 and is freed exactly once, after
        // the last read of it above.
        unsafe { FreeMibTable(table as *mut c_void) };
        out
    }

    /// Real interfaces with their counters, sorted by name for stable output.
    pub(super) fn enumerate() -> Vec<IfRow> {
        let mut out = with_rows(|row| {
            if !is_reportable_interface(row.if_type, row.interface_and_oper_status_flags) {
                return None;
            }
            let name = wide_to_string(&row.alias);
            if name.is_empty() {
                return None;
            }
            Some(IfRow {
                name,
                in_octets: row.in_octets,
                out_octets: row.out_octets,
            })
        });
        out.sort_by(|a, b| a.name.cmp(&b.name));
        out
    }

    /// The names of rows that are filter instances or loopback.
    pub(super) fn enumerate_excluded() -> Vec<String> {
        with_rows(|row| {
            if is_reportable_interface(row.if_type, row.interface_and_oper_status_flags) {
                return None;
            }
            let name = wide_to_string(&row.alias);
            if name.is_empty() {
                None
            } else {
                Some(name)
            }
        })
    }

    /// Decodes a fixed-size, null-padded UTF-16 field.
    fn wide_to_string(buf: &[u16]) -> String {
        let end = buf.iter().position(|&c| c == 0).unwrap_or(buf.len());
        String::from_utf16_lossy(&buf[..end]).trim().to_string()
    }

    #[cfg(test)]
    mod layout {
        use std::mem::{offset_of, size_of};

        // These structs are read by fixed offset — MIB_IF_ROW2's counters sit past 1.2 KB
        // of preceding fields, so a reorder or a padding change would silently read some
        // other field's bytes as a byte count. The expected values were confirmed against
        // live data before being pinned here: reading in/out_octets at these offsets
        // reproduced `Get-NetAdapterStatistics`' per-adapter totals.
        #[test]
        fn ffi_struct_layout() {
            assert_eq!(size_of::<super::MibIfRow2>(), 1352);
            assert_eq!(offset_of!(super::MibIfRow2, alias), 28);
            // `description` is what pins `alias`'s LENGTH, and it is not redundant with
            // the offsets below it. A first attempt at this test omitted it and passed
            // against an `alias` mutated to 256 WCHAR: the two lost bytes are swallowed by
            // the padding before `physical_address_length` (4-byte aligned at 1056), so
            // every later offset, and the total size, are unchanged. The mutation was
            // real — `wide_to_string` would read one WCHAR short — and the check could not
            // see it. Same family as every other entry in NOTES: an oracle answering a
            // different question from the one asked.
            assert_eq!(offset_of!(super::MibIfRow2, description), 542);
            assert_eq!(offset_of!(super::MibIfRow2, if_type), 1128);
            assert_eq!(
                offset_of!(super::MibIfRow2, interface_and_oper_status_flags),
                1152
            );
            assert_eq!(offset_of!(super::MibIfRow2, in_octets), 1208);
            assert_eq!(offset_of!(super::MibIfRow2, out_octets), 1280);

            // The rows must start at offset 8: NumEntries is a ULONG, and MIB_IF_ROW2's
            // 8-byte alignment pads it out. Reading them at offset 4 would shear every
            // field by four bytes.
            assert_eq!(offset_of!(super::MibIfTable2, table), 8);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Verbatim `GetIfTable2` rows from a Windows 11 host (arrakis), as
    /// `(alias, Type, InterfaceAndOperStatusFlags)`. Kept as data rather than reading the
    /// live table so the test asserts against a fixed machine's interfaces rather than
    /// whatever is plugged into the one running it — the #155/v0.6.2 pattern.
    ///
    /// The five `Wi-Fi*` rows all reported byte-identical counters
    /// (`in=219996461 out=32914969`); so did the four `Local Area Connection* 6/7` pairs.
    const IF_ROWS: &[(&str, u32, u8)] = &[
        (
            "Local Area Connection* 6-QoS Packet Scheduler-0000",
            6,
            0b0000_0010,
        ),
        ("Bluetooth Network Connection", 6, 0b0001_0000),
        ("Ethernet", 6, 0b0000_0101),
        ("Local Area Connection* 6", 6, 0b0000_0000),
        ("Loopback Pseudo-Interface 1", 24, 0b0000_0000),
        ("wt0", 53, 0b0000_0000),
        (
            "Wi-Fi-WFP Native MAC Layer LightWeight Filter-0000",
            71,
            0b0000_0010,
        ),
        ("Wi-Fi-Native WiFi Filter Driver-0000", 71, 0b0000_0010),
        ("Wi-Fi-QoS Packet Scheduler-0000", 71, 0b0000_0010),
        (
            "Wi-Fi-WFP 802.3 MAC Layer LightWeight Filter-0000",
            71,
            0b0000_0010,
        ),
        ("Wi-Fi", 71, 0b0000_0101),
        ("Teredo Tunneling Pseudo-Interface", 131, 0b0000_0000),
    ];

    #[test]
    fn test_is_reportable_interface_drops_ndis_filter_duplicates() {
        let kept: Vec<&str> = IF_ROWS
            .iter()
            .filter(|(_, if_type, flags)| is_reportable_interface(*if_type, *flags))
            .map(|(alias, _, _)| *alias)
            .collect();
        // Every `Wi-Fi-<filter>-0000` row carries the SAME counters as `Wi-Fi`; keeping
        // them reports this machine's throughput five times under five names.
        assert_eq!(
            kept,
            vec![
                "Bluetooth Network Connection",
                "Ethernet",
                "Local Area Connection* 6",
                "wt0",
                "Wi-Fi",
                "Teredo Tunneling Pseudo-Interface",
            ]
        );
        assert_eq!(kept.iter().filter(|a| a.starts_with("Wi-Fi")).count(), 1);
    }

    #[test]
    fn test_is_reportable_interface_keeps_a_non_hardware_tunnel() {
        // wt0 (WireGuard) is HardwareInterface=false, FilterInterface=false and moved
        // real bytes. Filtering on HardwareInterface instead would drop it — this is the
        // case that decides which flag the rule keys on, so it is pinned separately.
        assert!(is_reportable_interface(53, 0b0000_0000));
        // The physical Wi-Fi adapter (HardwareInterface|ConnectorPresent) also survives.
        assert!(is_reportable_interface(71, 0b0000_0101));
    }

    #[test]
    fn test_is_reportable_interface_drops_loopback() {
        // Matches the Linux arms skipping `lo`.
        assert!(!is_reportable_interface(IF_TYPE_SOFTWARE_LOOPBACK, 0));
    }

    /// The exclusion set `detect_networks` uses is the complement of the kept set, and it
    /// must contain the filter rows by their **full** name — the names sysinfo also
    /// reports them under, since that is what the two lists are matched on.
    #[test]
    fn test_excluded_names_are_the_complement() {
        let excluded: Vec<&str> = IF_ROWS
            .iter()
            .filter(|(_, if_type, flags)| !is_reportable_interface(*if_type, *flags))
            .map(|(alias, _, _)| *alias)
            .collect();
        assert!(excluded.contains(&"Wi-Fi-Native WiFi Filter Driver-0000"));
        assert!(excluded.contains(&"Loopback Pseudo-Interface 1"));
        // The real adapter must never land in the exclusion set, or `net` loses it.
        assert!(!excluded.contains(&"Wi-Fi"));
        assert!(!excluded.contains(&"wt0"));
    }
}

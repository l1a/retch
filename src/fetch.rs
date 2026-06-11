// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! System information gathering.
//!
//! This module re-exports the system information types and collection logic
//! from the `retch-sysinfo` crate.

pub use retch_sysinfo::fetch::{CollectOptions, SystemInfo};

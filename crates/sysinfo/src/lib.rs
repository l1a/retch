// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 l1a

//! # retch-sysinfo
//!
//! System information gathering library for retch.
//!
//! Provides cross-platform hardware and OS detection, GPU identification,
//! battery status, and environment probing. Extracted from the `retch-cli`
//! binary to allow reuse as a standalone library.
//!
//! ## Modules
//!
//! - [`battery`] — Cross-platform battery status detection.
//! - [`display`] — Display detection and EDID parsing.
//! - [`gpu`] — GPU detection and PCI ID lookup.
//! - [`fetch`] — Full system information gathering (`SystemInfo`, `CollectOptions`).

pub mod battery;
pub mod display;
pub mod fetch;
pub mod gpu;

pub use fetch::{CollectOptions, SystemInfo};

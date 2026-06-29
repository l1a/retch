// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

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
//! - [`audio`] — Audio server and device detection.
//! - [`battery`] — Cross-platform battery status detection.
//! - [`bios`] — BIOS / firmware version detection.
//! - [`bluetooth`] — Bluetooth controller state and connected device detection.
//! - [`camera`] — Camera and webcam detection.
//! - [`display`] — Display detection and EDID parsing.
//! - [`gamepad`] — Gamepad and joystick controller detection.
//! - [`gpu`] — GPU detection and PCI ID lookup.
//! - [`disk`] — Physical disk model, size, and type detection.
//! - [`memory`] — Physical memory (RAM) slot detection.
//! - [`motherboard`] — Motherboard / system model detection.
//! - [`network`] — Network interface detection, IP resolution, and Wi-Fi.
//! - [`packages`] — Installed package count detection.
//! - [`shell`] — Shell detection and version querying.
//! - [`terminal`] — Terminal emulator detection and font configuration reading.
//! - [`theme`] — UI theme, icon, cursor, and font detection.
//! - [`weather`] — Weather information via wttr.in.
//! - [`wm`] — Window manager detection.
//! - [`fetch`] — Full system information gathering (`SystemInfo`, `CollectOptions`).

pub mod audio;
pub mod battery;
pub mod bios;
pub mod bluetooth;
pub mod camera;
pub mod disk;
pub mod display;
pub mod fetch;
pub mod gamepad;
pub mod gpu;
pub mod memory;
pub mod motherboard;
pub mod network;
pub mod packages;
pub mod shell;
pub mod terminal;
pub mod theme;
pub mod weather;
pub mod wm;

#[cfg(target_os = "windows")]
pub(crate) mod win_reg;

#[cfg(target_os = "macos")]
pub(crate) mod macos_ffi;

pub use fetch::{CollectOptions, SystemInfo};

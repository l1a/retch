// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

#![doc = include_str!("../README.md")]

pub mod audio;
pub mod battery;
pub mod bios;
pub mod bluetooth;
pub mod btrfs;
pub mod camera;
pub mod disk;
pub mod display;
pub mod fetch;
pub mod gamepad;
pub mod gpu;
pub mod gpu_api;
pub mod input;
pub mod io;
pub mod media;
pub mod memory;
pub mod motherboard;
pub mod network;
pub mod packages;
pub(crate) mod proc_tree;
pub mod shell;
pub mod terminal;
pub mod theme;
pub(crate) mod timing;
pub mod weather;
pub mod wm;
pub mod zfs;

// Gated on `test` as well as `windows` so the pure interface-classification rule (which
// decides whether a `GetIfTable2` row is a real adapter or an NDIS filter instance) is
// exercised by the Linux and macOS CI legs too — it is the load-bearing half, and it needs
// no Windows API to test.
#[cfg(any(target_os = "windows", test))]
pub(crate) mod win_iftable;
#[cfg(target_os = "windows")]
pub(crate) mod win_reg;
#[cfg(target_os = "windows")]
pub(crate) mod win_setupapi;
#[cfg(target_os = "windows")]
pub(crate) mod win_users;

#[cfg(target_os = "macos")]
pub(crate) mod macos_ffi;

pub use fetch::{CollectOptions, SystemInfo};

// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! # retch
//!
//! A fast, feature-rich system information fetcher written in Rust.
//! Similar to tools like `fastfetch` or `neofetch`.
//!
//! This crate provides both a CLI binary (`retch`) and a library interface
//! for fetching and displaying system information.

pub mod fetch {
    //! System information gathering.
    //!
    //! This module re-exports the system information types and collection logic
    //! from the `retch-sysinfo` crate.

    pub use retch_sysinfo::fetch::{CollectOptions, SystemInfo};
}

pub mod gpu {
    //! GPU detection and identification.
    //!
    //! This module re-exports the GPU detection logic from the `retch-sysinfo` crate.

    pub use retch_sysinfo::gpu::*;
}

pub mod weather {
    pub use retch_sysinfo::weather::WeatherUnit;
}

pub mod cli;
pub mod config;
pub mod display;
pub mod logo;
pub mod theme;

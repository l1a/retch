//! # retch
//!
//! A fast, feature-rich system information fetcher written in Rust.
//! Similar to tools like `fastfetch` or `neofetch`.
//!
//! This crate provides both a CLI binary (`retch`) and a library interface
//! for fetching and displaying system information.

pub mod cli;
pub mod config;
pub mod display;
pub mod fetch;
pub mod gpu;
pub mod logo;
pub mod theme;

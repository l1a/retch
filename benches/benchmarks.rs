// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 l1a

//! Criterion benchmarks for retch core subsystems.
//!
//! Run with: `cargo bench` or `just bench`

use criterion::{criterion_group, criterion_main, Criterion};

use clap::Parser;
use retch_cli::cli::Cli;
use retch_cli::fetch::{CollectOptions, SystemInfo};
use retch_cli::gpu;
use retch_sysinfo::display;

/// Benchmark the full `SystemInfo::collect` pipeline.
///
/// This exercises the parallelised scoped-thread path that concurrently
/// queries GPU info, package counts, public/local IPs, and the active
/// network interface.
fn bench_system_info_collect(c: &mut Criterion) {
    let cli = Cli::try_parse_from(["retch"]).unwrap();

    c.bench_function("SystemInfo::collect", |b| {
        b.iter(|| {
            let _ = SystemInfo::collect(CollectOptions { long: cli.long });
        });
    });
}

/// Benchmark GPU detection in isolation.
///
/// On Linux this parses `/sys/bus/pci/devices` and `/usr/share/hwdata/pci.ids`.
/// On macOS it shells out to `system_profiler`.
/// On Windows it shells out to `wmic`/`powershell`.
fn bench_detect_gpus(c: &mut Criterion) {
    c.bench_function("gpu::detect_gpus", |b| {
        b.iter(|| {
            let _ = gpu::detect_gpus();
        });
    });
}

/// Benchmark EDID monitor name parsing.
///
/// Constructs a synthetic 128-byte EDID with a Monitor Name Descriptor at
/// offset 72 and measures how quickly `parse_monitor_name_from_edid` extracts it.
fn bench_parse_monitor_name_from_edid(c: &mut Criterion) {
    let mut edid = vec![0u8; 128];
    // Monitor Name Descriptor (tag 0xFC) at offset 72
    edid[72] = 0x00;
    edid[73] = 0x00;
    edid[74] = 0x00;
    edid[75] = 0xFC;
    let name = b"DELL S3422DW\n";
    for (i, &b) in name.iter().enumerate().take(13) {
        edid[76 + i] = b;
    }

    c.bench_function("display::parse_monitor_name_from_edid", |b| {
        b.iter(|| {
            let _ = display::parse_monitor_name_from_edid(&edid);
        });
    });
}

/// Benchmark EDID refresh rate parsing.
///
/// Uses a synthetic 1080p @ 60 Hz DTD block to measure the cost of the
/// fixed-point arithmetic in `parse_refresh_rate_from_edid`.
fn bench_parse_refresh_rate_from_edid(c: &mut Criterion) {
    let mut edid = vec![0u8; 128];
    // 1080p60 DTD at offset 54 (pixel clock 148.5 MHz)
    edid[54] = 0x02;
    edid[55] = 0x3A;
    edid[56] = 0x80;
    edid[57] = 0x18;
    edid[58] = 0x71;
    edid[59] = 0x38;
    edid[60] = 0x2D;
    edid[61] = 0x40;

    c.bench_function("display::parse_refresh_rate_from_edid", |b| {
        b.iter(|| {
            let _ = display::parse_refresh_rate_from_edid(&edid);
        });
    });
}

/// Benchmark EDID serial number parsing.
///
/// Tests the ASCII-descriptor-first path in `parse_serial_number_from_edid`.
fn bench_parse_serial_number_from_edid(c: &mut Criterion) {
    let mut edid = vec![0u8; 128];
    // ASCII Serial Number descriptor (tag 0xFF) at offset 72
    edid[72] = 0x00;
    edid[73] = 0x00;
    edid[74] = 0x00;
    edid[75] = 0xFF;
    let serial = b"CN0123456789\n";
    for (i, &b) in serial.iter().enumerate().take(13) {
        edid[76 + i] = b;
    }

    c.bench_function("display::parse_serial_number_from_edid", |b| {
        b.iter(|| {
            let _ = display::parse_serial_number_from_edid(&edid);
        });
    });
}

/// Benchmark xrandr output parsing (Linux / non-mac / non-windows only).
#[cfg(not(any(target_os = "macos", target_os = "windows")))]
fn bench_parse_xrandr_displays(c: &mut Criterion) {
    let sample = "Screen 0: minimum 320 x 200, current 5120 x 1440\n\
                  DP-1 connected primary 2560x1440+0+0\n\
                     2560x1440     143.97*+  120.00    99.95    84.98    74.97\n\
                     1920x1080     60.00\n\
                  HDMI-1 connected 2560x1440+2560+0\n\
                     2560x1440      59.95*+\n\
                     1920x1080     60.00    50.00\n";

    c.bench_function("display::parse_xrandr_displays", |b| {
        b.iter(|| {
            let _ = display::parse_xrandr_displays(sample);
        });
    });
}

#[cfg(not(any(target_os = "macos", target_os = "windows")))]
criterion_group! {
    name = benches;
    config = Criterion::default()
        .sample_size(20)
        .measurement_time(std::time::Duration::from_secs(10));
    targets = bench_system_info_collect,
              bench_detect_gpus,
              bench_parse_monitor_name_from_edid,
              bench_parse_refresh_rate_from_edid,
              bench_parse_serial_number_from_edid,
              bench_parse_xrandr_displays
}

#[cfg(any(target_os = "macos", target_os = "windows"))]
criterion_group! {
    name = benches;
    config = Criterion::default()
        .sample_size(20)
        .measurement_time(std::time::Duration::from_secs(10));
    targets = bench_system_info_collect,
              bench_detect_gpus,
              bench_parse_monitor_name_from_edid,
              bench_parse_refresh_rate_from_edid,
              bench_parse_serial_number_from_edid
}

criterion_main!(benches);

// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 l1a

//! Criterion benchmarks for retch core subsystems.
//!
//! Run with: `cargo bench` or `just bench`

use criterion::{criterion_group, criterion_main, Criterion};

use clap::Parser;
use retch_cli::cli::Cli;
use retch_cli::config::Config;
use retch_cli::fetch::SystemInfo;
use retch_cli::gpu;

/// Benchmark the full `SystemInfo::collect` pipeline.
///
/// This exercises the parallelised scoped-thread path that concurrently
/// queries GPU info, package counts, public/local IPs, and the active
/// network interface.
fn bench_system_info_collect(c: &mut Criterion) {
    let cli = Cli::try_parse_from(["retch"]).unwrap();
    let config = Config::default();

    c.bench_function("SystemInfo::collect", |b| {
        b.iter(|| {
            let _ = SystemInfo::collect(&cli, &config);
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

criterion_group! {
    name = benches;
    config = Criterion::default()
        .sample_size(20)
        .measurement_time(std::time::Duration::from_secs(10));
    targets = bench_system_info_collect, bench_detect_gpus
}

criterion_main!(benches);

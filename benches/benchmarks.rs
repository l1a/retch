// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Criterion benchmarks for retch core subsystems.
//!
//! Run with: `cargo bench` or `just bench`

use criterion::{criterion_group, criterion_main, Criterion};

use clap::Parser;
use retch_cli::cli::Cli;
use retch_cli::fetch::{CollectOptions, SystemInfo};
use retch_cli::gpu;
#[cfg(not(any(target_os = "macos", target_os = "windows")))]
use retch_sysinfo::audio;
#[cfg(target_os = "macos")]
use retch_sysinfo::camera;
use retch_sysinfo::display;
use retch_sysinfo::fetch::{detect_cpu_cache, detect_cpu_freq_range, format_cpu_cores};
#[cfg(target_os = "macos")]
use retch_sysinfo::gamepad;
use retch_sysinfo::network;

/// Benchmark the full `SystemInfo::collect` pipeline.
fn bench_system_info_collect(c: &mut Criterion) {
    let cli = Cli::try_parse_from(["retch"]).unwrap();

    c.bench_function("SystemInfo::collect", |b| {
        b.iter(|| {
            let _ = SystemInfo::collect(CollectOptions { long: cli.long });
        });
    });
}

/// Benchmark CPU cache detection from sysfs/sysctlbyname.
#[cfg(not(target_os = "windows"))]
fn bench_detect_cpu_cache(c: &mut Criterion) {
    c.bench_function("fetch::detect_cpu_cache", |b| {
        b.iter(|| {
            let _ = detect_cpu_cache();
        });
    });
}

/// Benchmark CPU freq range detection from sysfs cpufreq.
#[cfg(target_os = "linux")]
fn bench_detect_cpu_freq_range(c: &mut Criterion) {
    c.bench_function("fetch::detect_cpu_freq_range", |b| {
        b.iter(|| {
            let _ = detect_cpu_freq_range();
        });
    });
}

/// Benchmark CPU core topology formatting.
fn bench_format_cpu_cores(c: &mut Criterion) {
    c.bench_function("fetch::format_cpu_cores", |b| {
        b.iter(|| {
            let _ = format_cpu_cores(16, Some(8));
        });
    });
}

/// Benchmark GPU detection in isolation.
fn bench_detect_gpus(c: &mut Criterion) {
    c.bench_function("gpu::detect_gpus", |b| {
        b.iter(|| {
            let _ = gpu::detect_gpus();
        });
    });
}

/// Benchmark EDID monitor name parsing.
fn bench_parse_monitor_name_from_edid(c: &mut Criterion) {
    let mut edid = vec![0u8; 128];
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
fn bench_parse_refresh_rate_from_edid(c: &mut Criterion) {
    let mut edid = vec![0u8; 128];
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
fn bench_parse_serial_number_from_edid(c: &mut Criterion) {
    let mut edid = vec![0u8; 128];
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

/// Benchmark xrandr output parsing (Linux only).
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

/// Benchmark `/proc/net/route` default-gateway parsing (Linux only).
#[cfg(not(any(target_os = "macos", target_os = "windows")))]
fn bench_parse_proc_net_route(c: &mut Criterion) {
    let sample =
        "Iface\tDestination\tGateway\tFlags\tRefCnt\tUse\tMetric\tMask\tMTU\tWindow\tIRTT\n\
                  wlan0\t00000000\t0101A8C0\t0003\t0\t0\t600\t00000000\t0\t0\t0\n\
                  eth0\t0001A8C0\t00000000\t0001\t0\t0\t100\t00FFFFFF\t0\t0\t0\n";

    c.bench_function("network::parse_proc_net_route", |b| {
        b.iter(|| {
            let _ = network::parse_proc_net_route(sample);
        });
    });
}

/// Benchmark `iw dev wlan0 link` output parsing.
fn bench_parse_iw_link_output(c: &mut Criterion) {
    let sample = "Connected to aa:bb:cc:dd:ee:ff (on wlan0)\n\
        SSID: MyNetwork\n\
        freq: 5180\n\
        RX: 12345678 bytes (98765 packets)\n\
        TX: 9876543 bytes (54321 packets)\n\
        signal: -55 dBm\n\
        rx bitrate: 433.3 MBit/s VHT-MCS 9 80MHz short GI VHT-NSS 2\n\
        tx bitrate: 433.3 MBit/s VHT-MCS 9 80MHz short GI VHT-NSS 2\n";

    c.bench_function("network::parse_iw_link_output", |b| {
        b.iter(|| {
            let _ = network::parse_iw_link_output(sample);
        });
    });
}

/// Benchmark Windows `netsh wlan show interfaces` output parsing (Windows only).
#[cfg(target_os = "windows")]
fn bench_parse_netsh_output(c: &mut Criterion) {
    let sample = "    SSID                   : MyNetwork\r\n\
                       Signal                 : 85%\r\n\
                       Receive rate (Mbps)    : 433.3\r\n\
                       Transmit rate (Mbps)   : 433.3\r\n\
                       Channel                : 36\r\n";

    c.bench_function("network::parse_netsh_output", |b| {
        b.iter(|| {
            let _ = network::parse_netsh_output(sample);
        });
    });
}

/// Benchmark `/proc/asound/cards` string fallback parsing (Linux only).
#[cfg(not(any(target_os = "macos", target_os = "windows")))]
fn bench_parse_asound_cards(c: &mut Criterion) {
    let sample = " 0 [PCH            ]: HDA-Intel - HDA Intel PCH\n\
                   1 [NVidia         ]: HDA-Intel - HDA NVIDIA HDMI\n\
                   2 [sofhdadsp      ]: sof-hda-dsp - sof-hda-dsp\n";

    c.bench_function("audio::parse_asound_cards", |b| {
        b.iter(|| {
            let _ = audio::parse_asound_cards(sample, "/nonexistent");
        });
    });
}

/// Benchmark macOS `system_profiler SPCameraDataType` output parsing.
#[cfg(target_os = "macos")]
fn bench_parse_macos_camera(c: &mut Criterion) {
    let sample = "Camera:\n\n    FaceTime HD Camera:\n\n\
                  Model ID: UVC Camera VendorID_1452 ProductID_34068\n\
                  Unique ID: 0x8020000005ac8514\n\
              \n    Continuity Camera:\n\n\
                  Model ID: Apple Continuity Camera\n";

    c.bench_function("camera::parse_macos_camera", |b| {
        b.iter(|| {
            let _ = camera::parse_macos_camera(sample);
        });
    });
}

/// Benchmark macOS `system_profiler` gamepad parsing.
#[cfg(target_os = "macos")]
fn bench_parse_macos_gamepad(c: &mut Criterion) {
    let usb_sample = "USB 3.1 Bus:\n\n    Xbox Wireless Controller:\n\n\
                      Product ID: 0x02e0\n      Vendor ID: 0x045e\n";
    let bt_sample = "Bluetooth:\n\n      Devices (Connected):\n\
                         DualSense Wireless Controller:\n\
                             Address: AA-BB-CC\n\
                             Connected: Yes\n";

    c.bench_function("gamepad::parse_macos_gamepad", |b| {
        b.iter(|| {
            let _ = gamepad::parse_macos_gamepad(usb_sample, bt_sample);
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
              bench_detect_cpu_cache,
              bench_detect_cpu_freq_range,
              bench_format_cpu_cores,
              bench_parse_monitor_name_from_edid,
              bench_parse_refresh_rate_from_edid,
              bench_parse_serial_number_from_edid,
              bench_parse_xrandr_displays,
              bench_parse_proc_net_route,
              bench_parse_iw_link_output,
              bench_parse_asound_cards
}

#[cfg(target_os = "macos")]
criterion_group! {
    name = benches;
    config = Criterion::default()
        .sample_size(20)
        .measurement_time(std::time::Duration::from_secs(10));
    targets = bench_system_info_collect,
              bench_detect_gpus,
              bench_detect_cpu_cache,
              bench_format_cpu_cores,
              bench_parse_monitor_name_from_edid,
              bench_parse_refresh_rate_from_edid,
              bench_parse_serial_number_from_edid,
              bench_parse_iw_link_output,
              bench_parse_macos_camera,
              bench_parse_macos_gamepad
}

#[cfg(target_os = "windows")]
criterion_group! {
    name = benches;
    config = Criterion::default()
        .sample_size(20)
        .measurement_time(std::time::Duration::from_secs(10));
    targets = bench_system_info_collect,
              bench_detect_gpus,
              bench_format_cpu_cores,
              bench_parse_monitor_name_from_edid,
              bench_parse_refresh_rate_from_edid,
              bench_parse_serial_number_from_edid,
              bench_parse_iw_link_output,
              bench_parse_netsh_output
}

criterion_main!(benches);

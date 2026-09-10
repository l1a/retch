// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

fn main() {
    if std::env::var("CARGO_CFG_TARGET_OS").as_deref() == Ok("macos") {
        println!("cargo:rustc-link-lib=framework=CoreFoundation");
        println!("cargo:rustc-link-lib=framework=IOKit");
        println!("cargo:rustc-link-lib=framework=CoreAudio");
        println!("cargo:rustc-link-lib=framework=CoreGraphics");
        println!("cargo:rustc-link-lib=framework=CoreWLAN");
        println!("cargo:rustc-link-lib=framework=AppKit");
        // SystemConfiguration is the authoritative source for the default route's own DNS
        // configuration. /etc/resolv.conf on macOS is configd's legacy compatibility file
        // and mirrors the *merged* resolver, so it reports a split-tunnel VPN's servers
        // and domain in preference to the default route's (see v0.17.1 in NOTES.md).
        println!("cargo:rustc-link-lib=framework=SystemConfiguration");
    }
}

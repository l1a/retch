// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Single source of truth for the set of displayable fields and their output strata.
//!
//! Historically the field list was hand-duplicated across `main.rs` (collection
//! allow-lists *and* the generated config template), `display.rs` (display
//! allow-lists), `config.rs` (`DEFAULT_FIELDS_BLOCK`), plus `README.md` and
//! `docs/retch.1.md`. Every copy was a raw list of `&str` literals with no shared
//! definition, so adding or renaming a field risked silent drift — a field could
//! be collected but never displayed (or vice versa), or documented inconsistently.
//!
//! This module replaces the in-code copies with one [`FIELDS`] table. `main.rs`
//! and `display.rs` derive their per-strata allow-lists from [`fields_for`], and
//! both config-generation paths derive the commented `fields = [...]` block from
//! [`config_fields_block`]. The documentation copies (`README.md`,
//! `docs/retch.1.md`) can't be generated from Rust, so a guardrail test in
//! `tests/cli_tests.rs` asserts every [`FIELDS`] key appears in both, turning
//! future drift into a test failure instead of a silent bug.

/// Output verbosity mode, ordered from least to most verbose.
///
/// Each mode is a strict superset of the one before it (see NOTES.md §4), so a
/// field can be described by the single least-verbose mode in which it appears.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum Mode {
    /// `--short`: fast hardware-only snapshot.
    Short,
    /// Default (no flag): daily-use system overview.
    Standard,
    /// `--long`: diagnostics — firmware, network detail, consolidated thermals.
    Long,
    /// `--full`: everything, including slow and cosmetic fields.
    Full,
}

/// A single displayable field: its canonical config/CLI key and the least-verbose
/// [`Mode`] in which it is shown.
///
/// The `key` is the canonical hyphenated form (e.g. `"phys-mem"`, `"terminal-font"`)
/// as accepted by the `fields` config key and `--fields`. Field-name matching in
/// the collection and display layers normalizes `-`/`_`/spaces, so only the
/// canonical form needs to live here.
struct FieldDef {
    /// Canonical field key (hyphenated).
    key: &'static str,
    /// Least-verbose mode in which the field appears.
    min_mode: Mode,
}

/// The authoritative field table.
///
/// Ordered for a sensible generated config comment; ordering has no effect on
/// collection or display (both are membership tests — display order is fixed by
/// the `print_line` call sequence in `display.rs`). To add a field, add one row
/// here and wire its `print_line`/collector; the strata allow-lists and config
/// template update automatically.
const FIELDS: &[FieldDef] = &[
    // --- Standard identity/OS (Short subset marked below) ---
    FieldDef {
        key: "os",
        min_mode: Mode::Short,
    },
    FieldDef {
        key: "kernel",
        min_mode: Mode::Short,
    },
    FieldDef {
        key: "host",
        min_mode: Mode::Short,
    },
    FieldDef {
        key: "domain",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "domain-search",
        min_mode: Mode::Full,
    },
    FieldDef {
        key: "chassis",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "init",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "locale",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "arch",
        min_mode: Mode::Long,
    },
    // --- CPU ---
    FieldDef {
        key: "cpu",
        min_mode: Mode::Short,
    },
    FieldDef {
        key: "cpu-freq",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "cpu-cache",
        min_mode: Mode::Standard,
    },
    FieldDef {
        key: "cpu-usage",
        min_mode: Mode::Standard,
    },
    // --- Graphics / firmware / peripherals ---
    FieldDef {
        key: "gpu",
        min_mode: Mode::Short,
    },
    FieldDef {
        key: "motherboard",
        min_mode: Mode::Standard,
    },
    FieldDef {
        key: "bios",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "bootmgr",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "display",
        min_mode: Mode::Standard,
    },
    FieldDef {
        key: "brightness",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "audio",
        min_mode: Mode::Standard,
    },
    FieldDef {
        key: "camera",
        min_mode: Mode::Standard,
    },
    FieldDef {
        key: "gamepad",
        min_mode: Mode::Full,
    },
    // --- Memory / storage ---
    FieldDef {
        key: "memory",
        min_mode: Mode::Short,
    },
    FieldDef {
        key: "phys-mem",
        min_mode: Mode::Standard,
    },
    FieldDef {
        key: "swap",
        min_mode: Mode::Standard,
    },
    FieldDef {
        key: "uptime",
        min_mode: Mode::Standard,
    },
    FieldDef {
        key: "procs",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "load",
        min_mode: Mode::Standard,
    },
    FieldDef {
        key: "disk",
        min_mode: Mode::Short,
    },
    FieldDef {
        key: "phys-disk",
        min_mode: Mode::Standard,
    },
    FieldDef {
        key: "btrfs",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "zpool",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "temp",
        min_mode: Mode::Long,
    },
    // --- Network ---
    FieldDef {
        key: "net",
        min_mode: Mode::Short,
    },
    FieldDef {
        key: "public-ip",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "wifi",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "dns",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "bluetooth",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "battery",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "power-adapter",
        min_mode: Mode::Long,
    },
    // --- Environment ---
    FieldDef {
        key: "shell",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "editor",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "terminal",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "terminal-font",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "terminal-size",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "desktop",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "wm",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "login-manager",
        min_mode: Mode::Long,
    },
    // --- Cosmetic / slow (Full-only unless noted) ---
    FieldDef {
        key: "theme",
        min_mode: Mode::Full,
    },
    FieldDef {
        key: "icons",
        min_mode: Mode::Full,
    },
    FieldDef {
        key: "cursor",
        min_mode: Mode::Full,
    },
    FieldDef {
        key: "font",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "users",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "packages",
        min_mode: Mode::Long,
    },
    FieldDef {
        key: "weather",
        min_mode: Mode::Full,
    },
];

/// Returns the ordered list of field keys visible in the given [`Mode`].
///
/// A field is included when its `min_mode` is at or below `mode` (modes are
/// strictly nested supersets). Used by both the collection allow-list in
/// `main.rs` and the display allow-list in `display.rs`.
pub fn fields_for(mode: Mode) -> Vec<String> {
    FIELDS
        .iter()
        .filter(|f| f.min_mode <= mode)
        .map(|f| f.key.to_string())
        .collect()
}

/// Returns every field key, in table order.
pub fn all_keys() -> Vec<&'static str> {
    FIELDS.iter().map(|f| f.key).collect()
}

/// Generates the commented `fields = [...]` block for the default config file.
///
/// Used by both config-generation paths — `default_config_content()` in
/// `main.rs` (full write) and `Config::merge_defaults` in `config.rs` (merge
/// missing) — so the two can no longer drift apart. Emits every field key from
/// [`FIELDS`], wrapped to a readable width, all commented out.
pub fn config_fields_block() -> String {
    const PER_LINE: usize = 6;
    let mut out = String::new();
    out.push_str("# List of fields to display (leave empty or omit to show all)\n");
    out.push_str(
        "# Note: \"phys-mem\" requires running as root (sudo) on Linux to read DMI memory tables.\n",
    );
    out.push_str(
        "# Note: \"weather\" requires network access and is shown in full mode only by default.\n",
    );
    out.push_str(
        "# Note: \"domain-search\" queries resolvectl and is shown in full mode only by default.\n",
    );
    out.push_str("# fields = [\n");
    for chunk in FIELDS.chunks(PER_LINE) {
        let quoted: Vec<String> = chunk.iter().map(|f| format!("\"{}\"", f.key)).collect();
        out.push_str("#     ");
        out.push_str(&quoted.join(", "));
        out.push_str(",\n");
    }
    // Drop the trailing comma on the last emitted entry for valid TOML-in-comment.
    if let Some(pos) = out.rfind(",\n") {
        out.replace_range(pos..pos + 2, "\n");
    }
    out.push_str("# ]");
    out
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashSet;

    #[test]
    fn test_no_duplicate_keys() {
        let mut seen = HashSet::new();
        for f in FIELDS {
            assert!(seen.insert(f.key), "duplicate field key: {}", f.key);
        }
    }

    #[test]
    fn test_strata_strictly_nested() {
        let short: HashSet<_> = fields_for(Mode::Short).into_iter().collect();
        let standard: HashSet<_> = fields_for(Mode::Standard).into_iter().collect();
        let long: HashSet<_> = fields_for(Mode::Long).into_iter().collect();
        let full: HashSet<_> = fields_for(Mode::Full).into_iter().collect();

        assert!(
            short.is_subset(&standard),
            "short must be a subset of standard"
        );
        assert!(
            standard.is_subset(&long),
            "standard must be a subset of long"
        );
        assert!(long.is_subset(&full), "long must be a subset of full");
    }

    #[test]
    fn test_strata_counts() {
        // Golden counts pinning the current strata sizes (see NOTES.md §4).
        // A change here should be deliberate and accompany a docs/NOTES update.
        assert_eq!(fields_for(Mode::Short).len(), 8, "short field count");
        assert_eq!(fields_for(Mode::Standard).len(), 19, "standard field count");
        assert_eq!(fields_for(Mode::Long).len(), 49, "long field count");
        assert_eq!(fields_for(Mode::Full).len(), 55, "full field count");
    }

    #[test]
    fn test_short_set_exact() {
        let short: HashSet<_> = fields_for(Mode::Short).into_iter().collect();
        let expected: HashSet<String> = [
            "os", "kernel", "host", "cpu", "gpu", "memory", "disk", "net",
        ]
        .iter()
        .map(|s| s.to_string())
        .collect();
        assert_eq!(short, expected);
    }

    #[test]
    fn test_mode_membership_boundaries() {
        // Fields that must land in specific strata (guards against min_mode typos).
        let standard: HashSet<_> = fields_for(Mode::Standard).into_iter().collect();
        assert!(standard.contains("phys-mem"));
        assert!(standard.contains("cpu-cache"));
        assert!(!standard.contains("bios"), "bios is long+, not standard");

        let long: HashSet<_> = fields_for(Mode::Long).into_iter().collect();
        assert!(long.contains("bios"));
        assert!(long.contains("terminal-size"));
        assert!(long.contains("wm"));
        assert!(long.contains("login-manager"));
        assert!(long.contains("brightness"));
        assert!(long.contains("power-adapter"));
        // New Long fields must not leak into standard.
        assert!(
            !standard.contains("brightness"),
            "brightness is long+, not standard"
        );
        assert!(!long.contains("weather"), "weather is full-only");
        assert!(!long.contains("gamepad"), "gamepad is full-only");

        let full: HashSet<_> = fields_for(Mode::Full).into_iter().collect();
        assert!(full.contains("weather"));
        assert!(full.contains("domain-search"));
    }

    #[test]
    fn test_config_block_shape() {
        let block = config_fields_block();
        assert!(block.contains("# fields = ["));
        assert!(block.trim_end().ends_with("# ]"));
        // Every field key must appear in the generated block.
        for key in all_keys() {
            assert!(
                block.contains(&format!("\"{}\"", key)),
                "config block missing key: {}",
                key
            );
        }
        // Well-formed comment: no line escapes the leading '#'.
        for line in block.lines() {
            assert!(
                line.starts_with('#'),
                "uncommented line in config block: {line:?}"
            );
        }
        // No dangling comma before the closing bracket.
        assert!(
            !block.contains(",\n# ]"),
            "trailing comma before closing bracket"
        );
    }
}

// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Installed package count detection.
//!
//! Supports Pacman (Arch), Dpkg (Debian), XBPS (Void), RPM (Fedora/RHEL) on Linux,
//! Homebrew (Formulae and Casks) and MacPorts on macOS, and Scoop/Chocolatey on Windows.

/// Builds the SQLite URI used to read the RPM database without write access.
///
/// `/var/lib/rpm/rpmdb.sqlite` is owned by root (mode 0644) inside a root-owned directory,
/// so an unprivileged process cannot create the journal sidecar files SQLite wants — and
/// SQLite reports that as `attempt to write a readonly database` on the **query**, not on
/// `open()`. Plain `mode=ro` is not enough for the same reason: it still needs to touch the
/// directory. `immutable=1` promises SQLite the file will not change while it is open, which
/// lets it skip locking and sidecars entirely, so the count succeeds as a normal user.
///
/// This is why `Packages` previously appeared only under `sudo`.
#[cfg(any(not(any(target_os = "macos", target_os = "windows")), test))]
fn rpm_db_uri(path: &str) -> String {
    format!("file:{path}?immutable=1")
}

/// Counts non-hidden entries inside `dir` (skipping dotfiles such as Homebrew Caskroom's
/// `.metadata` directory and `.DS_Store`).
pub fn count_visible_dir_entries(dir: &std::path::Path) -> usize {
    let Ok(entries) = std::fs::read_dir(dir) else {
        return 0;
    };
    entries
        .filter_map(|e| e.ok())
        .filter(|e| !e.file_name().to_string_lossy().starts_with('.'))
        .count()
}

/// Counts active Flatpak installations under `dir` (`app/` or `runtime/`), skipping
/// dotfiles and empty directories left behind after `flatpak uninstall`.
#[cfg(any(not(any(target_os = "macos", target_os = "windows")), test))]
pub fn count_active_flatpak_entries(dir: &std::path::Path) -> usize {
    let Ok(entries) = std::fs::read_dir(dir) else {
        return 0;
    };
    entries
        .filter_map(|e| e.ok())
        .filter(|e| !e.file_name().to_string_lossy().starts_with('.'))
        .filter(|e| is_active_flatpak_entry(&e.path()))
        .count()
}

/// Returns `true` when a Flatpak `<id>` directory contains an active deployment
/// (`current` symlink or `<arch>/<branch>/active`).
#[cfg(any(not(any(target_os = "macos", target_os = "windows")), test))]
fn is_active_flatpak_entry(id_dir: &std::path::Path) -> bool {
    if id_dir.join("current").symlink_metadata().is_ok() {
        return true;
    }
    let Ok(archs) = std::fs::read_dir(id_dir) else {
        return false;
    };
    for arch in archs.flatten() {
        let Ok(branches) = std::fs::read_dir(arch.path()) else {
            continue;
        };
        for branch in branches.flatten() {
            if branch.path().join("active").symlink_metadata().is_ok() {
                return true;
            }
        }
    }
    false
}

/// Formats per-package-manager counts into a summary string.
///
/// A single manager renders as `"183 (brew)"`; multiple managers include the total and
/// breakdown, e.g. `"191 (183 brew, 8 brew-cask)"`.
pub fn format_package_counts(counts: &[(&str, usize)]) -> Option<String> {
    let active: Vec<(&str, usize)> = counts.iter().copied().filter(|(_, c)| *c > 0).collect();
    match active.as_slice() {
        [] => None,
        [(mgr, count)] => Some(format!("{} ({})", count, mgr)),
        many => {
            let total: usize = many.iter().map(|(_, c)| *c).sum();
            let breakdown: Vec<String> = many.iter().map(|(m, c)| format!("{} {}", c, m)).collect();
            Some(format!("{} ({})", total, breakdown.join(", ")))
        }
    }
}

pub(crate) fn detect_packages() -> Option<String> {
    #[cfg(target_os = "macos")]
    {
        let mut brew = 0;
        for cellar_path in &["/opt/homebrew/Cellar", "/usr/local/Cellar"] {
            brew += count_visible_dir_entries(std::path::Path::new(cellar_path));
        }

        let mut cask = 0;
        for cask_path in &["/opt/homebrew/Caskroom", "/usr/local/Caskroom"] {
            cask += count_visible_dir_entries(std::path::Path::new(cask_path));
        }

        let macports =
            count_visible_dir_entries(std::path::Path::new("/opt/local/var/macports/software"));

        format_package_counts(&[("brew", brew), ("brew-cask", cask), ("macports", macports)])
    }

    #[cfg(target_os = "windows")]
    {
        let mut scoop = 0;
        if let Some(home) = dirs::home_dir() {
            let scoop_dir = std::env::var("SCOOP")
                .map(std::path::PathBuf::from)
                .unwrap_or_else(|_| home.join("scoop"));
            scoop += count_visible_dir_entries(&scoop_dir.join("apps"));
        }

        let choco_install = std::env::var("ChocolateyInstall")
            .unwrap_or_else(|_| "C:\\ProgramData\\chocolatey".to_string());
        let choco = count_visible_dir_entries(&std::path::Path::new(&choco_install).join("lib"));

        format_package_counts(&[("scoop", scoop), ("choco", choco)])
    }

    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    {
        let mut counts: Vec<(&str, usize)> = Vec::new();

        if let Ok(entries) = std::fs::read_dir("/var/lib/pacman/local") {
            let count = entries
                .filter_map(|e| e.ok())
                .filter(|e| e.file_type().is_ok_and(|t| t.is_dir()))
                .count();
            if count > 0 {
                counts.push(("pacman", count));
            }
        }

        if let Ok(entries) = std::fs::read_dir("/var/lib/dpkg/info") {
            let count = entries
                .filter_map(|e| e.ok())
                .filter(|e| e.path().extension().is_some_and(|ext| ext == "list"))
                .count();
            if count > 0 {
                counts.push(("dpkg", count));
            }
        }

        if let Ok(entries) = std::fs::read_dir("/var/db/pkg") {
            let count: usize = entries
                .filter_map(|e| e.ok())
                .map(|e| count_visible_dir_entries(&e.path()))
                .sum();
            if count > 0 {
                counts.push(("portage", count));
            }
        }

        if let Ok(entries) = std::fs::read_dir("/var/db/xbps") {
            let count = entries
                .filter_map(|e| e.ok())
                .filter(|e| {
                    e.file_name().to_string_lossy().starts_with("pkgdb-")
                        || e.path().extension().is_some_and(|ext| ext == "plist")
                })
                .filter(|e| !e.file_name().to_string_lossy().starts_with("pkgdb-"))
                .count();
            if count > 0 {
                counts.push(("xbps", count));
            }
        }

        let rpm_db = "/var/lib/rpm/rpmdb.sqlite";
        if std::path::Path::new(rpm_db).exists() {
            use rusqlite::OpenFlags;
            let flags = OpenFlags::SQLITE_OPEN_READ_ONLY
                | OpenFlags::SQLITE_OPEN_URI
                | OpenFlags::SQLITE_OPEN_NO_MUTEX;
            match rusqlite::Connection::open_with_flags(rpm_db_uri(rpm_db), flags) {
                Ok(conn) => {
                    // Exclude `gpg-pubkey` pseudo-packages (imported RPM signing keys) when the
                    // `Name` index table is present, matching `fastfetch` and `rpm -qa`.
                    let query_res = conn
                        .query_row(
                            "SELECT COUNT(*) FROM Name WHERE key != 'gpg-pubkey'",
                            [],
                            |row| row.get::<_, i64>(0),
                        )
                        .or_else(|_| {
                            conn.query_row("SELECT COUNT(*) FROM Packages", [], |row| {
                                row.get::<_, i64>(0)
                            })
                        });
                    match query_res {
                        Ok(count) if count > 0 => counts.push(("rpm", count as usize)),
                        Ok(_) => {}
                        // Surfaced rather than swallowed: the read-only-database failure this
                        // URI exists to prevent used to land here and vanish silently, so the
                        // field simply disappeared with no clue why.
                        Err(e) => {
                            eprintln!("warning: failed to query RPM database at {rpm_db}: {e}");
                        }
                    }
                }
                Err(e) => {
                    eprintln!("warning: failed to open RPM database at {rpm_db}: {e}");
                }
            }
        }

        let mut flatpak =
            count_active_flatpak_entries(std::path::Path::new("/var/lib/flatpak/app"))
                + count_active_flatpak_entries(std::path::Path::new("/var/lib/flatpak/runtime"));
        if let Some(home) = dirs::home_dir() {
            let user_fp = home.join(".local/share/flatpak");
            flatpak += count_active_flatpak_entries(&user_fp.join("app"))
                + count_active_flatpak_entries(&user_fp.join("runtime"));
        }
        if flatpak > 0 {
            counts.push(("flatpak", flatpak));
        }

        format_package_counts(&counts)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rpm_db_uri_requests_immutable() {
        // `immutable=1` is the load-bearing part: without it an unprivileged read of the
        // root-owned rpmdb fails with "attempt to write a readonly database".
        assert_eq!(
            rpm_db_uri("/var/lib/rpm/rpmdb.sqlite"),
            "file:/var/lib/rpm/rpmdb.sqlite?immutable=1"
        );
    }

    #[test]
    fn test_rpm_db_uri_is_a_file_uri() {
        // The `file:` scheme is what makes SQLITE_OPEN_URI parse the query string at all;
        // a bare path would silently ignore `immutable=1`.
        let uri = rpm_db_uri("/tmp/some.sqlite");
        assert!(uri.starts_with("file:"));
        assert!(uri.contains("?immutable=1"));
    }

    #[test]
    fn test_format_package_counts() {
        assert_eq!(format_package_counts(&[]), None);
        assert_eq!(
            format_package_counts(&[("brew", 0), ("brew-cask", 0)]),
            None
        );
        assert_eq!(
            format_package_counts(&[("brew", 183), ("brew-cask", 0)]),
            Some("183 (brew)".to_string())
        );
        assert_eq!(
            format_package_counts(&[("brew", 183), ("brew-cask", 8), ("macports", 0)]),
            Some("191 (183 brew, 8 brew-cask)".to_string())
        );
    }

    #[test]
    fn test_count_visible_dir_entries_skips_dotfiles() {
        let dir = std::env::temp_dir().join(format!("retch-pkg-test-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(dir.join(".metadata")).unwrap();
        std::fs::create_dir_all(dir.join("ghostty")).unwrap();
        std::fs::create_dir_all(dir.join("rectangle")).unwrap();
        assert_eq!(count_visible_dir_entries(&dir), 2);
        let _ = std::fs::remove_dir_all(&dir);
    }

    #[test]
    fn test_count_active_flatpak_entries_skips_uninstalled_remnants() {
        let dir = std::env::temp_dir().join(format!("retch-flatpak-test-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        // Active app with `current` marker
        std::fs::create_dir_all(dir.join("org.mozilla.firefox/current")).unwrap();
        // Active runtime with `<arch>/<branch>/active` marker
        std::fs::create_dir_all(dir.join("org.freedesktop.Platform/x86_64/24.08/active")).unwrap();
        // Uninstalled remnant directory with no `current` or `active`
        std::fs::create_dir_all(dir.join("org.old.UninstalledApp/x86_64/stable")).unwrap();
        assert_eq!(count_active_flatpak_entries(&dir), 2);
        let _ = std::fs::remove_dir_all(&dir);
    }
}

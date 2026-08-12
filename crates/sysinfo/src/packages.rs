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

pub(crate) fn detect_packages() -> Option<usize> {
    #[cfg(target_os = "macos")]
    {
        let mut count = 0;

        for cellar_path in &["/opt/homebrew/Cellar", "/usr/local/Cellar"] {
            if let Ok(entries) = std::fs::read_dir(cellar_path) {
                count += entries.filter_map(|e| e.ok()).count();
            }
        }

        for cask_path in &["/opt/homebrew/Caskroom", "/usr/local/Caskroom"] {
            if let Ok(entries) = std::fs::read_dir(cask_path) {
                count += entries.filter_map(|e| e.ok()).count();
            }
        }

        if let Ok(entries) = std::fs::read_dir("/opt/local/var/macports/software") {
            count += entries.filter_map(|e| e.ok()).count();
        }

        if count > 0 {
            Some(count)
        } else {
            None
        }
    }

    #[cfg(target_os = "windows")]
    {
        let mut count = 0;

        if let Some(home) = dirs::home_dir() {
            let scoop_dir = std::env::var("SCOOP")
                .map(std::path::PathBuf::from)
                .unwrap_or_else(|_| home.join("scoop"));
            if let Ok(entries) = std::fs::read_dir(scoop_dir.join("apps")) {
                count += entries.filter_map(|e| e.ok()).count();
            }
        }

        let choco_install = std::env::var("ChocolateyInstall")
            .unwrap_or_else(|_| "C:\\ProgramData\\chocolatey".to_string());
        if let Ok(entries) = std::fs::read_dir(std::path::Path::new(&choco_install).join("lib")) {
            count += entries.filter_map(|e| e.ok()).count();
        }

        if count > 0 {
            Some(count)
        } else {
            None
        }
    }

    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    {
        if let Ok(entries) = std::fs::read_dir("/var/lib/pacman/local") {
            let count = entries.filter_map(|e| e.ok()).count();
            if count > 0 {
                return Some(count);
            }
        }

        if let Ok(entries) = std::fs::read_dir("/var/lib/dpkg/info") {
            let count = entries
                .filter_map(|e| e.ok())
                .filter(|e| e.path().extension().is_some_and(|ext| ext == "list"))
                .count();
            if count > 0 {
                return Some(count);
            }
        }

        if let Ok(entries) = std::fs::read_dir("/var/db/pkg") {
            let count: usize = entries
                .filter_map(|e| e.ok())
                .map(|e| {
                    std::fs::read_dir(e.path())
                        .map(|d| d.filter(|_| true).count())
                        .unwrap_or(0)
                })
                .sum();
            if count > 0 {
                return Some(count);
            }
        }

        if let Ok(entries) = std::fs::read_dir("/var/db/xbps") {
            let count = entries
                .filter_map(|e| e.ok())
                .filter(|e| e.path().extension().is_some_and(|ext| ext == "plist"))
                .count();
            if count > 0 {
                return Some(count);
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
                    match conn.query_row("SELECT COUNT(*) FROM Packages", [], |row| {
                        row.get::<_, i64>(0)
                    }) {
                        Ok(count) if count > 0 => return Some(count as usize),
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

        None
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
}

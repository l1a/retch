{ lib
, rustPlatform
, fetchFromGitHub
, pkg-config
, installShellFiles
}:

# TEMPLATE — do not write a concrete version or hash into this file.
#
# Like packaging/{aur,copr,homebrew,scoop}, this derivation records no released version
# and no checksum in the repository. `scripts/render_packaging.py --target nix` and
# `scripts/calculate_nix_hashes.py` substitute the sentinel placeholders for `version`,
# `src.hash` and `cargoHash` at release time, and `just nix-check` (`scripts/nix_check.py`)
# asserts the template stays unpinned on every `just check`.
rustPlatform.buildRustPackage rec {
  pname = "retch";
  version = "@VERSION@";

  src = fetchFromGitHub {
    owner = "l1a";
    repo = "retch";
    rev = "v${version}";
    hash = "@SRC_HASH@";
  };

  cargoHash = "@CARGO_HASH@";

  nativeBuildInputs = [
    pkg-config
    installShellFiles
  ];

  postInstall = ''
    # Install the committed man page from the release tarball (verified by `just man-check`)
    installManPage docs/retch.1

    # Generate and install shell completions
    installShellCompletion --cmd retch \
      --bash <($out/bin/retch --completions bash) \
      --zsh <($out/bin/retch --completions zsh) \
      --fish <($out/bin/retch --completions fish)
  '';

  meta = with lib; {
    description = "A fast, feature-rich system information fetcher written in Rust";
    homepage = "https://github.com/l1a/retch";
    license = licenses.gpl3Plus;
    maintainers = with maintainers; [ ];
    mainProgram = "retch";
    platforms = platforms.unix ++ platforms.windows;
  };
}

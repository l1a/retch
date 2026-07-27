{ lib
, rustPlatform
, fetchFromGitHub
, pkg-config
, installShellFiles
, mandown
}:

rustPlatform.buildRustPackage rec {
  pname = "retch";
  version = "0.6.12";

  src = fetchFromGitHub {
    owner = "l1a";
    repo = "retch";
    rev = "v${version}";
    # Computed by the release CI's nix-prefetch-url on the v0.6.12 tarball, independently
    # of the substitution bug described below, so this value is trustworthy.
    hash = "sha256-08nsxpti3GNFsK8zv2tQ+6iMQrgGBRnwzjG8nTOIM1g=";
  };

  # Deliberately left as the placeholder: the v0.6.12 release notes' cargoHash is WRONG.
  # calculate_nix_hashes.py only substituted `lib.fakeHash`, so once this file held literal
  # hashes the temp build silently kept the previous release's values, failed on a
  # source-hash mismatch instead of the intended cargoHash mismatch, and the old lenient
  # parser reported that stale source hash as the cargoHash — which is why the published
  # v0.6.12 cargoHash equals v0.6.8's `hash`. Both defects are fixed in that script now, but
  # the correct value cannot be recomputed without Nix (unavailable on the current dev box).
  # Run `just nix-update` on a machine with Nix to fill this in.
  cargoHash = lib.fakeHash;

  nativeBuildInputs = [
    pkg-config
    installShellFiles
    mandown
  ];

  postBuild = ''
    # Generate man page
    DATE="June 2026"
    mandown docs/retch.1.md RETCH 1 | sed -e 's/\\fB\\fB/\\fB/g' -e 's/\\fP\\fP/\\fP/g' -e "s/\\.TH \"RETCH\" 1/\\.TH \"RETCH\" \"1\" \"$DATE\" \"retch ${version}\" \"System Information Fetcher\"/" > docs/retch.1
  '';

  postInstall = ''
    # Install man page
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
    license = licenses.gpl3Only;
    maintainers = with maintainers; [ ];
    mainProgram = "retch";
    platforms = platforms.unix ++ platforms.windows;
  };
}

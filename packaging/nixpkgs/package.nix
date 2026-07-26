{ lib
, rustPlatform
, fetchFromGitHub
, pkg-config
, installShellFiles
, mandown
}:

rustPlatform.buildRustPackage rec {
  pname = "retch";
  version = "0.6.8";

  src = fetchFromGitHub {
    owner = "l1a";
    repo = "retch";
    rev = "v${version}";
    hash = "sha256-MDdKOYNkBIuO6iw0P7Z/1pps5QwpKDgugX/GhY/WQRw=";
  };

  cargoHash = "sha256-LMf62gbjZVKqsUF9f3JaN4qqsd9vPinr55s2rZGgCEc=";

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

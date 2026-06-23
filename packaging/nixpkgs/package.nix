{ lib
, rustPlatform
, fetchFromGitHub
, pkg-config
, installShellFiles
, pandoc
}:

rustPlatform.buildRustPackage rec {
  pname = "retch";
  version = "0.3.21";

  src = fetchFromGitHub {
    owner = "l1a";
    repo = "retch";
    rev = "v${version}";
    hash = lib.fakeHash; # Will be filled in by Nix CI / builder
  };

  cargoHash = lib.fakeHash; # Will be filled in by Nix CI / builder

  nativeBuildInputs = [
    pkg-config
    installShellFiles
    pandoc
  ];

  postBuild = ''
    # Generate man page
    pandoc docs/retch.1.md -s -t man --variable=footer="retch ${version}" -o docs/retch.1
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

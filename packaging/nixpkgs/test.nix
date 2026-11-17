with import <nixpkgs> {};
callPackage ./package.nix {
  rustPlatform = rustPlatform // {
    buildRustPackage = args: rustPlatform.buildRustPackage (args // {
      version = (builtins.fromTOML (builtins.readFile ../../Cargo.toml)).package.version;
      src = ../../.;
      cargoLock = {
        lockFile = ../../Cargo.lock;
      };
      cargoHash = null;
    });
  };
}

with import <nixpkgs> {};
callPackage ./package.nix {
  rustPlatform = rustPlatform // {
    buildRustPackage = args: rustPlatform.buildRustPackage (args // {
      src = ../../.;
      cargoLock = {
        lockFile = ../../Cargo.lock;
      };
      cargoHash = null;
    });
  };
}

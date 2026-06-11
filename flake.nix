{
  description = "Fast system fetcher with high-quality ASCII & graphical logos, theming, and short/long output modes.";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    crane.url = "github:ipetkov/crane";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      crane,
      flake-utils,
      rust-overlay,
      ...
    }:
    (flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ (import rust-overlay) ];
        };
        inherit (pkgs) lib;

        rustToolchain = pkgs.rust-bin.selectLatestNightlyWith (toolchain: toolchain.default);

        craneLib = (crane.mkLib pkgs).overrideToolchain rustToolchain;

        filter =
          path: type: (builtins.match ".*assets/.*$" path != null) || (craneLib.filterCargoSources path type);
        cleanSrc = lib.cleanSourceWith {
          src = craneLib.path ./.;
          filter = filter;
        };
        retch = craneLib.buildPackage {
          src = cleanSrc;
          strictDeps = true;
          pname = "retch";
        };
      in
      {
        packages.default = retch;

        devShells.default = craneLib.devShell {
          packages = with pkgs; [
            cargo
            rustc
            rust-analyzer
            just
            rustToolchain
          ];
        };
      }
    ))
    // {
      homeManagerModules.default =
        {
          config,
          lib,
          pkgs,
          ...
        }:
        let
          cfg = config.programs.retch;
          tomlFormat = pkgs.formats.toml { };
        in
        {
          options.programs.retch = {
            enable = lib.mkEnableOption "retch";

            package = lib.mkOption {
              type = lib.types.package;
              default = self.packages.${pkgs.system}.default;
            };

            settings = lib.mkOption {
              type = tomlFormat.type;
              default = { };
              description = "Configuration for retch";
            };
          };
          config = lib.mkIf cfg.enable {
            home.packages = [ cfg.package ];
            xdg.configFile."retch/config.toml" = {
              source = tomlFormat.generate "config.toml" cfg.settings;
            };
          };
        };
    };
}

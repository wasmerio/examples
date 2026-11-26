{
  description = "A Nix-flake-based Bun / Deno / Node.js development environment";

  inputs.nixpkgs.url = "https://flakehub.com/f/NixOS/nixpkgs/0.1.*.tar.gz";

  outputs = { self, nixpkgs }:
    let
      overlays = [
        (final: prev: rec {
          nodejs = prev.nodejs;
          pnpm = prev.nodePackages.pnpm;
          yarn = (prev.yarn.override { inherit nodejs; });
        })
      ];
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forEachSupportedSystem = f: nixpkgs.lib.genAttrs supportedSystems (system: f {
        pkgs = import nixpkgs { inherit overlays system; };
      });
    in
    {
      devShells = forEachSupportedSystem ({ pkgs }: {
        default = pkgs.mkShell {
          packages = with pkgs; [
            bun
            deno
            nodejs
            pnpm
            yarn
            cloudflared
          ];
          LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
            pkgs.stdenv.cc.cc
          ];
          shellHook = ''
            echo "[bun] `${pkgs.bun}/bin/bun --version`"
            echo "[deno] `${pkgs.deno}/bin/deno -V`"
            echo "[node] `${pkgs.nodejs}/bin/node --version`"
            echo "[pnpm] `${pkgs.pnpm}/bin/pnpm --version`"
            echo "[yarn] `${pkgs.yarn}/bin/yarn --version`"
          '';
        };
      });
    };
}

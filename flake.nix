{
  description = "Kacper Wyczawski's website";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };
  outputs = { nixpkgs ,... }: let
    system = "x86_64-linux";
  in {
    devShells."${system}".default = let
      pkgs = import nixpkgs {
        inherit system;
      };
    in pkgs.mkShell {
      packages = with pkgs; [
        bun
        biome
        nushell
      ];

      shellHook = ''
        exec nu -e 'bun dev'
      '';
    };
  };
}
declare module "node:fs" {
  export interface Dirent {
    name: string;
    isDirectory(): boolean;
  }

  export function cpSync(src: string, dest: string): void;
  export function existsSync(path: string): boolean;
  export function mkdirSync(
    path: string,
    options?: { recursive?: boolean }
  ): string | undefined;
  export function readdirSync(
    path: string,
    options: { withFileTypes: true }
  ): Dirent[];
  export function rmSync(
    path: string,
    options?: { recursive?: boolean; force?: boolean }
  ): void;
}

declare module "node:path" {
  export function join(...paths: string[]): string;
}

declare module "node:child_process" {
  export function execFileSync(
    file: string,
    args?: string[],
    options?: { cwd?: string; stdio?: "inherit" }
  ): unknown;
}

declare const process: {
  cwd(): string;
};

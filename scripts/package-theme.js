"use strict";

const { cpSync, existsSync, mkdirSync, readdirSync, rmSync } = require("node:fs");
const { execFileSync } = require("node:child_process");
const { join } = require("node:path");

const rootDir = process.cwd();
const distDir = join(rootDir, "dist");
const stageDir = join(distDir, "package");
const zipPath = join(distDir, "dark-neon-yellow.zip");
const localesDir = join(rootDir, "_locales");

const requiredFiles = [
  "manifest.json",
  "icon.png",
  "theme_frame.png",
  "theme_frame_inactive.png",
  "theme_tab_background.png",
  "theme_tab_background_inactive.png",
  "theme_toolbar.png"
];

function ensureFileExists(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required file: ${filePath}`);
  }
}

function copyRequiredFiles() {
  for (const fileName of requiredFiles) {
    const sourcePath = join(rootDir, fileName);
    const targetPath = join(stageDir, fileName);

    ensureFileExists(sourcePath);
    cpSync(sourcePath, targetPath);
  }
}

function copyLocales() {
  if (!existsSync(localesDir)) {
    return;
  }

  for (const entry of readdirSync(localesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const localeName = entry.name;
    const sourceMessagesPath = join(localesDir, localeName, "messages.json");
    const targetLocaleDir = join(stageDir, "_locales", localeName);

    ensureFileExists(sourceMessagesPath);
    mkdirSync(targetLocaleDir, { recursive: true });
    cpSync(sourceMessagesPath, join(targetLocaleDir, "messages.json"));
  }
}

function createZipArchive() {
  try {
    execFileSync("zip", ["-qr", zipPath, "."], {
      cwd: stageDir,
      stdio: "inherit"
    });
  } catch (error) {
    throw new Error(`Failed to create zip archive with system zip: ${String(error)}`);
  }
}

function main() {
  rmSync(stageDir, { recursive: true, force: true });
  mkdirSync(join(stageDir, "_locales"), { recursive: true });

  copyRequiredFiles();
  copyLocales();

  rmSync(zipPath, { force: true });
  createZipArchive();

  console.log(`Created: ${zipPath}`);
}

main();

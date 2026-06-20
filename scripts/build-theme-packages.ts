import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

import {
  themeImageNames,
  themeVariants,
  type ThemeImageName,
  type ThemeVariant
} from "../themes/config";

type ParsedArgs = {
  listOnly: boolean;
  requestedThemeIds: string[];
};

type ManifestTemplate = {
  name: string;
  description: string;
  manifest_version: number;
  version: string;
  default_locale: string;
  icons: Record<string, string>;
  theme: {
    colors: unknown;
    images: Record<string, string>;
    properties: {
      ntp_logo_alternate: number;
      ntp_background_repeat: string;
    };
  };
};

const rootDir = process.cwd();
const distDir = join(rootDir, "dist");
const packagesDir = join(distDir, "packages");
const localeTemplatesDir = join(rootDir, "themes", "locales");
const sharedAssetsDir = join(rootDir, "themes", "assets", "shared");
const unreplacedTokenPattern = /\{\{[^}]+\}\}/;
const manifestBase: ManifestTemplate = {
  name: "__MSG_name__",
  description: "__MSG_description__",
  manifest_version: 3,
  version: "1.0.0",
  default_locale: "en",
  icons: {
    "128": "icon.png"
  },
  theme: {
    colors: {},
    images: {
      theme_toolbar: "theme_toolbar.png",
      theme_frame: "theme_frame.png",
      theme_frame_inactive: "theme_frame_inactive.png",
      theme_tab_background: "theme_tab_background.png",
      theme_tab_background_inactive: "theme_tab_background_inactive.png"
    },
    properties: {
      ntp_logo_alternate: 0,
      ntp_background_repeat: "repeat"
    }
  }
};

function parseArgs(argv: string[]): ParsedArgs {
  const requestedThemeIds: string[] = [];
  let listOnly = false;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "--") {
      continue;
    }

    if (argument === "--list") {
      listOnly = true;
      continue;
    }

    if (argument === "--theme") {
      const rawValue = argv[index + 1];

      if (!rawValue || rawValue.startsWith("--")) {
        throw new Error("Expected a theme id after --theme.");
      }

      requestedThemeIds.push(...splitThemeIds(rawValue));
      index += 1;
      continue;
    }

    if (argument.startsWith("--theme=")) {
      requestedThemeIds.push(...splitThemeIds(argument.slice("--theme=".length)));
      continue;
    }

    throw new Error(`Unknown argument: ${argument}`);
  }

  if (listOnly && requestedThemeIds.length > 0) {
    throw new Error("Cannot combine --list with --theme.");
  }

  return {
    listOnly,
    requestedThemeIds: dedupe(requestedThemeIds)
  };
}

function splitThemeIds(rawValue: string): string[] {
  return rawValue
    .split(",")
    .map((themeId) => themeId.trim())
    .filter(Boolean);
}

function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}

function listThemes(): void {
  console.log("Available themes:");

  for (const theme of themeVariants) {
    const status = theme.enabled ? "enabled" : "disabled";
    console.log(`- ${theme.id}\t${status}\t${theme.displayName}\t${theme.zipName}`);
  }
}

function selectThemes(requestedThemeIds: string[]): ThemeVariant[] {
  const enabledThemes = themeVariants.filter((theme) => theme.enabled);

  if (requestedThemeIds.length === 0) {
    if (enabledThemes.length === 0) {
      throw new Error("No enabled themes found in themes/config.js.");
    }

    return enabledThemes;
  }

  const themeMap = new Map(enabledThemes.map((theme) => [theme.id, theme]));
  const selectedThemes: ThemeVariant[] = [];
  const missingThemeIds: string[] = [];

  for (const themeId of requestedThemeIds) {
    const theme = themeMap.get(themeId);

    if (!theme) {
      missingThemeIds.push(themeId);
      continue;
    }

    selectedThemes.push(theme);
  }

  if (missingThemeIds.length > 0) {
    throw new Error(
      `Unknown or disabled theme id(s): ${missingThemeIds.join(", ")}. Run with --list to inspect available themes.`
    );
  }

  return selectedThemes;
}

function getOutputFileName(theme: ThemeVariant, imageName: ThemeImageName): string {
  return theme.imageOverrides?.[imageName] ?? imageName;
}

function resolveAssetPath(theme: ThemeVariant, outputFileName: string): string {
  const themeAssetPath = join(rootDir, "themes", "assets", theme.assetDir, outputFileName);

  if (existsSync(themeAssetPath)) {
    return themeAssetPath;
  }

  const sharedAssetPath = join(sharedAssetsDir, outputFileName);

  if (existsSync(sharedAssetPath)) {
    return sharedAssetPath;
  }

  throw new Error(`Missing asset "${outputFileName}" for theme "${theme.id}".`);
}

function copyAssets(theme: ThemeVariant, stageDir: string): void {
  for (const imageName of themeImageNames) {
    const outputFileName = getOutputFileName(theme, imageName);
    const sourcePath = resolveAssetPath(theme, outputFileName);
    cpSync(sourcePath, join(stageDir, outputFileName));
  }
}

function buildManifest(theme: ThemeVariant): string {
  const currentImages = manifestBase.theme.images;
  const nextImages: Record<string, string> = {};

  for (const [key, currentValue] of Object.entries(currentImages)) {
    const fileName = currentValue.split("/").pop();

    if (!fileName || !themeImageNames.includes(fileName as ThemeImageName)) {
      throw new Error(`Unexpected manifest image path "${currentValue}" for key "${key}".`);
    }

    nextImages[key] = getOutputFileName(theme, fileName as ThemeImageName);
  }

  const manifest: ManifestTemplate = {
    ...manifestBase,
    version: theme.version,
    icons: { ...manifestBase.icons },
    theme: {
      ...manifestBase.theme,
      colors: theme.colors,
      images: nextImages,
      properties: { ...manifestBase.theme.properties }
    }
  };

  return `${JSON.stringify(manifest, null, 2)}\n`;
}

function getLocaleContext(theme: ThemeVariant, localeName: string): Record<string, string> {
  const localeMessages = theme.locales?.[localeName];

  return {
    displayName: localeMessages?.displayName ?? theme.displayName,
    description: localeMessages?.description ?? theme.description
  };
}

function renderLocaleTemplate(template: string, context: Record<string, string>): string {
  const rendered = template.replace(/\{\{\s*(displayName|description)\s*\}\}/g, (_, key: string) => {
    return context[key] ?? "";
  });

  if (unreplacedTokenPattern.test(rendered)) {
    throw new Error(`Unresolved locale template token found: ${rendered}`);
  }

  JSON.parse(rendered);
  return rendered.endsWith("\n") ? rendered : `${rendered}\n`;
}

function writeLocales(theme: ThemeVariant, stageDir: string): void {
  if (!existsSync(localeTemplatesDir)) {
    return;
  }

  for (const entry of readdirSync(localeTemplatesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const localeName = entry.name;
    const templatePath = join(localeTemplatesDir, localeName, "messages.json");

    if (!existsSync(templatePath)) {
      throw new Error(`Missing locale template: ${templatePath}`);
    }

    const rendered = renderLocaleTemplate(
      readFileSync(templatePath, "utf8"),
      getLocaleContext(theme, localeName)
    );
    const targetLocaleDir = join(stageDir, "_locales", localeName);

    mkdirSync(targetLocaleDir, { recursive: true });
    writeFileSync(join(targetLocaleDir, "messages.json"), rendered);
  }
}

function createZipArchive(theme: ThemeVariant, stageDir: string): string {
  const zipPath = join(distDir, theme.zipName);

  rmSync(zipPath, { force: true });

  try {
    execFileSync("zip", ["-qr", zipPath, "."], {
      cwd: stageDir,
      stdio: "inherit"
    });
  } catch (error) {
    throw new Error(`Failed to create zip archive for "${theme.id}": ${String(error)}`);
  }

  return zipPath;
}

function buildThemePackage(theme: ThemeVariant): string {
  const stageDir = join(packagesDir, theme.id);

  rmSync(stageDir, { recursive: true, force: true });
  mkdirSync(join(stageDir, "_locales"), { recursive: true });

  writeFileSync(join(stageDir, "manifest.json"), buildManifest(theme));
  copyAssets(theme, stageDir);
  writeLocales(theme, stageDir);

  return createZipArchive(theme, stageDir);
}

function main(): void {
  const { listOnly, requestedThemeIds } = parseArgs(process.argv.slice(2));

  if (listOnly) {
    listThemes();
    return;
  }

  mkdirSync(packagesDir, { recursive: true });

  const selectedThemes = selectThemes(requestedThemeIds);
  const builtPackages = selectedThemes.map((theme) => ({
    id: theme.id,
    zipPath: buildThemePackage(theme)
  }));

  console.log(`Built ${builtPackages.length} theme package(s):`);

  for (const builtPackage of builtPackages) {
    console.log(`- ${builtPackage.id}: ${builtPackage.zipPath}`);
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Build failed: ${message}`);
  process.exitCode = 1;
}

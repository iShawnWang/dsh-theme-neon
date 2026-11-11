#!/usr/bin/env node
// Install the DSH theme documents in themes/ into the running dsh-cool-theme host.
//
// The host exposes a same-origin JSON API (no Origin header == same origin), so a
// plain fetch from Node is enough: POST /cool-theme/api/themes upserts by id and
// GET /themes/<id>/export downloads the shareable zip.
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const THEMES_DIR = join(ROOT, "themes");
const EXPORT_DIR = join(ROOT, "dist");

const DEFAULT_URL = "http://127.0.0.1:51658";
const SHIKI_KEYS = [
  "constant",
  "string",
  "comment",
  "keyword",
  "parameter",
  "function",
  "string-expression",
  "punctuation",
  "link",
];
const HEX = /^#[0-9A-Fa-f]{6}$/;
const ID = /^[A-Za-z0-9_-]{1,64}$/;

function usage() {
  console.log(`用法: node scripts/install.mjs [--url <DSH Web GUI 地址>] [--dry-run] [--no-export]

  --url <url>   运行中的 DSH Web GUI，默认 ${DEFAULT_URL}，也可用环境变量 DSH_WEB_URL
  --dry-run     只校验 themes/*.json，不发请求
  --no-export   安装后不把 zip 导出到 dist/`);
}

function parseArgs(argv) {
  const options = { url: process.env.DSH_WEB_URL || DEFAULT_URL, dryRun: false, export: true };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    } else if (arg === "--url") {
      const value = argv[i + 1];
      if (!value) throw new Error("--url 需要一个地址");
      options.url = value;
      i += 1;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--no-export") {
      options.export = false;
    } else {
      throw new Error(`未知参数: ${arg}`);
    }
  }
  options.url = options.url.replace(/\/+$/, "");
  return options;
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function checkPair(value, where, problems) {
  if (!isRecord(value)) {
    problems.push(`${where} 应为 { light, dark }`);
    return;
  }
  for (const mode of ["light", "dark"]) {
    if (!HEX.test(value[mode] ?? "")) problems.push(`${where}.${mode} 不是 #RRGGBB`);
  }
}

function validate(theme) {
  const problems = [];
  const where = theme.id || "(无 id)";
  if (!ID.test(theme.id ?? "")) problems.push(`${where}: id 必须匹配 ${ID}`);
  if (typeof theme.name !== "string" || theme.name.trim() === "") problems.push(`${where}: name 不能为空`);
  if (typeof theme.base !== "string") problems.push(`${where}: base 必须是字符串`);
  const seed = theme.theme;
  if (!isRecord(seed)) return problems.concat(`${where}: 缺少 theme 种子`);

  for (const mode of ["light", "dark"]) {
    const ramp = seed.neutral?.[mode];
    if (!isRecord(ramp)) {
      problems.push(`${where}: neutral.${mode} 缺失`);
    } else {
      for (const end of ["lightest", "darkest"]) {
        if (!HEX.test(ramp[end] ?? "")) problems.push(`${where}: neutral.${mode}.${end} 不是 #RRGGBB`);
      }
    }
  }

  for (const key of ["accent", "green", "amber", "red"]) checkPair(seed[key], `${where}: ${key}`, problems);

  for (const mode of ["light", "dark"]) {
    const border = seed.border?.[mode];
    if (!isRecord(border)) {
      problems.push(`${where}: border.${mode} 缺失`);
      continue;
    }
    if (!HEX.test(border.color ?? "")) problems.push(`${where}: border.${mode}.color 不是 #RRGGBB`);
    if (typeof border.alpha !== "number" || border.alpha < 0 || border.alpha > 100) {
      problems.push(`${where}: border.${mode}.alpha 应为 0-100`);
    }
  }

  for (const key of SHIKI_KEYS) checkPair(seed.shiki?.[key], `${where}: shiki.${key}`, problems);
  return problems;
}

async function loadThemes() {
  const files = (await readdir(THEMES_DIR)).filter((name) => name.endsWith(".json")).sort();
  if (files.length === 0) throw new Error(`${THEMES_DIR} 里没有 .json`);
  const themes = [];
  for (const file of files) {
    const path = join(THEMES_DIR, file);
    let doc;
    try {
      doc = JSON.parse(await readFile(path, "utf8"));
    } catch (error) {
      throw new Error(`${file} 不是合法 JSON: ${error.message}`);
    }
    themes.push({ file, doc });
  }
  const seen = new Map();
  for (const { file, doc } of themes) {
    if (seen.has(doc.id)) throw new Error(`${file} 与 ${seen.get(doc.id)} 的 id 重复: ${doc.id}`);
    seen.set(doc.id, file);
  }
  return themes;
}

async function jsonFetch(url, init) {
  const response = await fetch(url, init);
  const body = await response.json().catch(() => null);
  if (!response.ok || body?.ok === false) {
    throw new Error(`${init?.method ?? "GET"} ${url} → ${response.status} ${body?.error ?? ""}`.trim());
  }
  return body;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const themes = await loadThemes();

  const problems = themes.flatMap(({ file, doc }) => validate(doc).map((problem) => `${file}: ${problem}`));
  if (problems.length > 0) {
    console.error("主题校验失败:");
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }
  console.log(`校验通过: ${themes.map(({ doc }) => `${doc.id} (${doc.name})`).join(", ")}`);

  if (options.dryRun) return;
  console.log(`安装到 ${options.url}`);

  const payload = {
    themes: themes.map(({ doc }) => ({
      id: doc.id,
      name: doc.name,
      base: doc.base,
      theme: doc.theme,
      ...(doc.background === undefined ? {} : { background: doc.background }),
    })),
  };
  const saved = await jsonFetch(`${options.url}/cool-theme/api/themes`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  console.log(`已保存: ${saved.themes.map((theme) => theme.id).join(", ")}`);

  if (!options.export) {
    console.log("跳过导出（--no-export）");
    return;
  }
  await mkdir(EXPORT_DIR, { recursive: true });
  for (const { doc } of themes) {
    const response = await fetch(`${options.url}/cool-theme/api/themes/${encodeURIComponent(doc.id)}/export`);
    if (!response.ok) throw new Error(`导出 ${doc.id} 失败: HTTP ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const target = join(EXPORT_DIR, `${doc.id}.zip`);
    await writeFile(target, bytes);
    console.log(`导出 ${target}`);
  }
  console.log("完成。在 DSH 设置 → 主题 → 自定义主题 中切换这三张卡片。");
}

main().catch((error) => {
  console.error(`失败: ${error.message}`);
  if (error.cause?.code === "ECONNREFUSED") {
    console.error(`连不上 ${DEFAULT_URL} 这类地址时，先确认 DSH Web GUI 正在运行，再用 --url 传当前地址。`);
  }
  process.exit(1);
});

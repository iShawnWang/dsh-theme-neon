#!/usr/bin/env node
/**
 * Compile themes/*.json into lib/client.js.
 *
 * The seeds in themes/ are the only place colours are authored. This script
 * expands them the same way DSH's own presets are built — neutral ramps between
 * two endpoint colours, semantic scales from one base colour each, border
 * aliases from one colour + alpha, shiki values verbatim — and inlines the
 * resulting token sheet into the browser bundle.
 *
 * Usage:
 *   node scripts/build-client.mjs           write lib/client.js
 *   node scripts/build-client.mjs --check   fail if lib/client.js is stale
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const THEMES_DIR = join(ROOT, "themes");
const TEMPLATE = join(ROOT, "lib", "client.template.js");
const OUTPUT = join(ROOT, "lib", "client.js");

const BLUISH_STEPS = [0, 50, 60, 75, 100, 150, 200, 300, 400, 500, 600, 700, 750, 800, 850, 875, 900, 950, 1000];
const NEUTRAL_STEPS = [0, 50, 100, 150, 200, 250, 300, 400, 500, 550, 600, 700, 800, 850, 900, 1000];
const SHIKI_KEYS = [
	"constant",
	"string",
	"comment",
	"keyword",
	"parameter",
	"function",
	"string-expression",
	"punctuation",
	"link"
];

/** Alpha steps DSH adds on top of the border seed, per appearance. */
const BORDER_ALPHA_STEPS = {
	light: { l2: 6, l3: 8, l4: 12, thin: 6 },
	dark: { l2: 6, l3: 10, l4: 14, thin: 0 }
};

function hexToRgb(hex) {
	const clean = String(hex).replace(/^#/, "");
	if (!/^[0-9a-fA-F]{6}$/.test(clean)) throw new Error(`Invalid hex colour: ${hex}`);
	return [
		parseInt(clean.slice(0, 2), 16),
		parseInt(clean.slice(2, 4), 16),
		parseInt(clean.slice(4, 6), 16)
	];
}

function rgbToHex([r, g, b]) {
	return `#${[r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0").toUpperCase()).join("")}`;
}

/** Linear interpolation in sRGB, one entry per requested scale step. */
function buildScale(prefix, start, end, steps) {
	const a = hexToRgb(start);
	const b = hexToRgb(end);
	const map = {};
	for (const step of steps) {
		const t = step / 1000;
		map[step === 0 ? `${prefix}-00` : `${prefix}-${step}`] = rgbToHex([
			a[0] + (b[0] - a[0]) * t,
			a[1] + (b[1] - a[1]) * t,
			a[2] + (b[2] - a[2]) * t
		]);
	}
	return map;
}

function mix(from, to, weight) {
	const a = hexToRgb(from);
	const b = hexToRgb(to);
	const w = Math.max(0, Math.min(1, weight));
	return rgbToHex([a[0] * (1 - w) + b[0] * w, a[1] * (1 - w) + b[1] * w, a[2] * (1 - w) + b[2] * w]);
}

/** Steps < 500 are tints toward white, > 500 are shades toward black, 500 is the base. */
function tintShadeScale(prefix, base, steps, weights) {
	const map = {};
	for (const step of steps) {
		const weight = weights[step];
		if (weight === undefined) continue;
		const key = String(step);
		const isBase = key === "500";
		const isShade = (typeof step === "number" && step > 500) || key === "950";
		map[`${prefix}-${key}`] = isBase ? base.toUpperCase() : isShade ? mix("#000000", base, weight) : mix("#FFFFFF", base, weight);
	}
	return map;
}

const SEMANTIC_SCALES = [
	{ prefix: "--dsw-static-deepseek", field: "accent", steps: [50, 100, 200, 300, 400, 450, 500, 600, 800, 900], weights: { 50: 0.08, 100: 0.15, 200: 0.32, 300: 0.52, 400: 0.78, 450: 0.88, 500: 1, 600: 0.82, 800: 0.55, 900: 0.35 } },
	{
		prefix: "--dsw-static-blue",
		field: "accent",
		steps: [50, 100, 300, 400, 450, 500, 600, 800, 900, "50p", "75", "950"],
		weights: { 50: 0.08, 100: 0.15, 300: 0.52, 400: 0.78, 450: 0.88, 500: 1, 600: 0.82, 800: 0.55, 900: 0.35, "50p": 0.1, 75: 0.12, 950: 0.25 }
	},
	{ prefix: "--dsw-static-green", field: "green", steps: [100, 400, 500, 900], weights: { 100: 0.15, 400: 0.78, 500: 1, 900: 0.35 } },
	{ prefix: "--dsw-static-amber", field: "amber", steps: [100, 400, 500, 600, 900], weights: { 100: 0.15, 400: 0.78, 500: 1, 600: 0.82, 900: 0.35 } },
	{ prefix: "--dsw-static-red", field: "red", steps: [50, 100, 400, 500, 600, 900], weights: { 50: 0.08, 100: 0.15, 400: 0.78, 500: 1, 600: 0.82, 900: 0.35 } }
];

function semanticScales(seeds, mode) {
	const map = {};
	for (const scale of SEMANTIC_SCALES) Object.assign(map, tintShadeScale(scale.prefix, seeds[scale.field][mode], scale.steps, scale.weights));
	map["--dsw-static-deepseek-700-delete"] = mix("#000000", seeds.accent[mode], 0.7);
	return map;
}

function borderTokens(mode, seed) {
	const [r, g, b] = hexToRgb(seed.color);
	const alpha = (value) => Math.max(0, Math.min(100, value)) / 100;
	const rgba = (value) => `rgba(${r}, ${g}, ${b}, ${alpha(value)})`;
	const steps = BORDER_ALPHA_STEPS[mode];
	return {
		"--dsw-alias-border-l1": rgba(seed.alpha),
		"--dsw-alias-border-l2": rgba(seed.alpha + steps.l2),
		"--dsw-alias-border-l3": rgba(seed.alpha + steps.l3),
		"--dsw-alias-border-l4": rgba(seed.alpha + steps.l4),
		"--dsw-alias-border-l2-darkmode-thin": rgba(seed.alpha + steps.thin)
	};
}

function appearanceTokens(seeds, mode) {
	const map = {
		...buildScale("--dsw-static-neutral-bluish", seeds.neutral[mode].lightest, seeds.neutral[mode].darkest, BLUISH_STEPS),
		...buildScale("--dsw-static-neutral", seeds.neutral[mode].lightest, seeds.neutral[mode].darkest, NEUTRAL_STEPS),
		...semanticScales(seeds, mode),
		...borderTokens(mode, seeds.border[mode])
	};
	for (const key of SHIKI_KEYS) map[`--shiki-token-${key}`] = seeds.shiki[key][mode];
	return map;
}

function cssBlock(selector, tokens) {
	const lines = Object.entries(tokens).map(([name, value]) => `  ${name}: ${value};`);
	return `${selector} {\n${lines.join("\n")}\n}`;
}

function paletteCss(doc) {
	const seeds = doc.theme;
	const scope = `html[data-neon-palette="${doc.id}"]`;
	return [
		cssBlock(`${scope} body:not([data-ds-dark-theme])`, appearanceTokens(seeds, "light")),
		cssBlock(`${scope} body[data-ds-dark-theme]`, appearanceTokens(seeds, "dark"))
	].join("\n\n");
}

function validate(doc, file) {
	for (const key of ["id", "name", "theme"]) if (!(key in doc)) throw new Error(`${file}: missing ${key}`);
	for (const mode of ["light", "dark"]) {
		const neutral = doc.theme.neutral?.[mode];
		if (!neutral?.lightest || !neutral?.darkest) throw new Error(`${file}: theme.neutral.${mode} needs lightest + darkest`);
		for (const field of ["accent", "green", "amber", "red"]) {
			if (!doc.theme[field]?.[mode]) throw new Error(`${file}: theme.${field}.${mode} missing`);
		}
		if (!doc.theme.border?.[mode]?.color || typeof doc.theme.border[mode].alpha !== "number") throw new Error(`${file}: theme.border.${mode} needs colour + alpha`);
		for (const key of SHIKI_KEYS) if (!doc.theme.shiki?.[key]?.[mode]) throw new Error(`${file}: theme.shiki.${key}.${mode} missing`);
	}
}

async function loadThemes() {
	const files = (await readdir(THEMES_DIR)).filter((name) => name.endsWith(".json")).sort();
	const docs = [];
	for (const file of files) {
		const doc = JSON.parse(await readFile(join(THEMES_DIR, file), "utf8"));
		validate(doc, `themes/${file}`);
		docs.push(doc);
	}
	return docs;
}

async function render() {
	const docs = await loadThemes();
	const palettes = docs.map((doc) => ({ id: doc.id, name: doc.name, accent: doc.theme.accent.dark }));
	const css = docs.map(paletteCss).join("\n\n");
	let bundle = await readFile(TEMPLATE, "utf8");
	bundle = bundle.replace("__PALETTES__", JSON.stringify(palettes, null, "\t"));
	bundle = bundle.replace("__PALETTE_CSS__", JSON.stringify(css));
	return { bundle, count: docs.length, bytes: Buffer.byteLength(css) };
}

const { bundle, count, bytes } = await render();

if (process.argv.includes("--check")) {
	const current = await readFile(OUTPUT, "utf8").catch(() => "");
	if (current !== bundle) {
		console.error("lib/client.js is stale — run `npm run build`");
		process.exit(1);
	}
	console.log(`lib/client.js is current (${count} palettes, ${bytes} bytes of tokens)`);
} else {
	await writeFile(OUTPUT, bundle);
	console.log(`wrote lib/client.js (${count} palettes, ${bytes} bytes of tokens)`);
}

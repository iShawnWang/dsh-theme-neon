/**
 * dsh-theme-neon — browser half.
 *
 * Adds one row to 设置 → 通用设置, right below the shell's own 外观 row. Four
 * cubes: Default plus the three palettes. Picking a palette sets
 * `data-neon-palette` on <html> and the generated token sheet does the rest;
 * picking Default removes it and the shell's own colours come back. 外观 keeps
 * working: every palette ships a light and a dark token set, selected by the
 * shell's `data-ds-dark-theme`.
 *
 * There is no picker, no import/export, no wallpaper — four cubes, one row.
 */
window.__ModuleLoader__.load({
	id: "dsh-theme-neon",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		var react = require("react");

		/** Palette ids, labels and preview accents, generated from themes/*.json. */
		const PALETTES = __PALETTES__;

		/** Per-palette token sheet, generated from themes/*.json. */
		const PALETTE_CSS = __PALETTE_CSS__;

		/** Locale namespace and the only strings this row owns. */
		const LOCALE_NS = "dsh-theme-neon";
		const DICTIONARIES = {
			zh: { "palette.title": "主题配色", "palette.default": "默认" },
			en: { "palette.title": "Theme colors", "palette.default": "Default" }
		};

		const STORAGE_KEY = "dsh-neon-palette";

		/** Sentinel for "the shell's own colours". Stored, so it survives a refresh. */
		const DEFAULT_ID = "default";

		/** Applied when nothing is stored yet: a fresh install lands on a palette, not on grey. */
		const INSTALL_PALETTE_ID = "neon-pink";

		/** The Default swatch is a neutral dot — it promises no colour. */
		const DEFAULT_DOT = "#7C828C";
		const VARS_STYLE_ID = "dsh-neon-palette-vars";
		const ROW_STYLE_ID = "dsh-neon-palette-row";

		/**
		 * Row chrome, copied from the shell's AppearanceRow metrics so the two
		 * rows line up. Class names are ours; the shell's are content-hashed.
		 */
		const ROW_CSS = `.dnp-group{display:flex;flex-direction:column;gap:8px;padding:16px 0;border-bottom:.5px solid var(--dsw-alias-border-l2)}
.dnp-title{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:400;line-height:22px}
.dnp-cubes{display:flex;flex-wrap:wrap;align-items:stretch;gap:8px}
.dnp-cube{box-sizing:border-box;display:flex;flex:1 1 0;min-width:0;flex-direction:column;align-items:center;justify-content:center;gap:6px;margin:0;padding:20px 12px;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-xl);background:0 0;color:var(--dsw-alias-label-primary);font:inherit;font-size:14px;line-height:22px;white-space:nowrap;cursor:pointer}
.dnp-cube:hover:not([aria-pressed="true"]){background:var(--dsw-alias-interactive-bg-hover)}
.dnp-cube[aria-pressed="true"]{background:var(--dsw-alias-bg-module-platform);border-color:var(--dsw-static-deepseek-500)}
html[data-neon-palette] [class*="themeCube"][class*="selected"]{border-color:var(--dsw-static-deepseek-500)}
html[data-neon-palette] [class*="kB3qhq_root"]{background:var(--dsw-alias-bg-base)!important}
.dnp-dot{width:14px;height:14px;border-radius:999px;box-shadow:0 0 0 .5px var(--dsw-alias-border-l4)}
@media (width<=767px){html:not([data-windows-titlebar]):not([data-platform=darwin]) .dnp-cube{flex:1 1 0;padding:12px 6px}}`;

		/** Install the token sheet and the row styles once. */
		function ensureStyles() {
			if (typeof document === "undefined") return;
			let vars = document.getElementById(VARS_STYLE_ID);
			if (vars === null) {
				vars = document.createElement("style");
				vars.id = VARS_STYLE_ID;
				document.head.appendChild(vars);
			}
			vars.textContent = PALETTE_CSS;
			let row = document.getElementById(ROW_STYLE_ID);
			if (row === null) {
				row = document.createElement("style");
				row.id = ROW_STYLE_ID;
				document.head.appendChild(row);
			}
			row.textContent = ROW_CSS;
		}

		/** The saved choice; a fresh profile starts on INSTALL_PALETTE_ID. */
		function readSaved() {
			try {
				const saved = localStorage.getItem(STORAGE_KEY);
				if (saved === DEFAULT_ID) return DEFAULT_ID;
				return PALETTES.some((palette) => palette.id === saved) ? saved : INSTALL_PALETTE_ID;
			} catch {
				return INSTALL_PALETTE_ID;
			}
		}

		/** Point the document at one palette; DEFAULT_ID hands control back to the shell. */
		function applyPalette(id) {
			ensureStyles();
			if (typeof document === "undefined") return;
			if (PALETTES.some((palette) => palette.id === id)) document.documentElement.dataset.neonPalette = id;
			else delete document.documentElement.dataset.neonPalette;
		}

		/** One row: title plus Default and the three palette cubes. */
		function PaletteRow({ t }) {
			const label = (key, fallback) => (typeof t === "function" ? t(key) : fallback);
			const title = label("palette.title", "Theme colors");
			const options = [
				{ id: DEFAULT_ID, name: label("palette.default", "Default"), accent: DEFAULT_DOT },
				...PALETTES
			];
			const [current, setCurrent] = react.useState(readSaved);
			const choose = (id) => {
				setCurrent(id);
				try {
					localStorage.setItem(STORAGE_KEY, id);
				} catch {}
				applyPalette(id);
			};
			return react.createElement(
				"div",
				{ className: "dnp-group" },
				react.createElement("div", { className: "dnp-title" }, title),
				react.createElement(
					"div",
					{ className: "dnp-cubes" },
					options.map((palette) =>
						react.createElement(
							"button",
							{
								key: palette.id,
								type: "button",
								className: "dnp-cube",
								"aria-pressed": current === palette.id,
								onClick: () => choose(palette.id)
							},
							react.createElement("span", { className: "dnp-dot", style: { background: palette.accent } }),
							react.createElement("span", null, palette.name)
						)
					)
				)
			);
		}

		const inject = ["slots", "locale"];

		/** Restore the saved palette, then register the row. */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(LOCALE_NS, DICTIONARIES), "dsh-theme-neon: dictionaries");
			ensureStyles();
			const saved = readSaved();
			applyPalette(saved);
			try {
				if (localStorage.getItem(STORAGE_KEY) === null) localStorage.setItem(STORAGE_KEY, saved);
			} catch {}
			ctx.slots.inject("settings.general.item", () =>
				ctx.slots.register(
					{
						name: "settings.general.item",
						id: "neon-palette",
						// Between 外观 (10) and 字号 (11): the row sits right next to 外观.
						order: 10.5,
						locale: LOCALE_NS
					},
					PaletteRow
				)
			);
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

/**
 * dsh-theme-neon — browser half.
 *
 * Adds one row to 设置 → 通用设置, right below the shell's own 外观 row. The three
 * cubes pick a palette; picking one sets `data-neon-palette` on <html> and the
 * generated token sheet does the rest. 外观 keeps working: every palette ships a
 * light and a dark token set, selected by the shell's `data-ds-dark-theme`.
 *
 * There is no picker, no import/export, no wallpaper — three colours, one row.
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

		const STORAGE_KEY = "dsh-neon-palette";
		const VARS_STYLE_ID = "dsh-neon-palette-vars";
		const ROW_STYLE_ID = "dsh-neon-palette-row";

		/**
		 * Row chrome, copied from the shell's AppearanceRow metrics so the two
		 * rows line up. Class names are ours; the shell's are content-hashed.
		 */
		const ROW_CSS = `.dnp-group{display:flex;flex-direction:column;gap:8px;padding:16px 0;border-bottom:.5px solid var(--dsw-alias-border-l2)}
.dnp-title{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:400;line-height:22px}
.dnp-cubes{display:flex;flex-wrap:wrap;align-items:stretch;gap:8px}
.dnp-cube{box-sizing:border-box;display:flex;flex:180px;flex-direction:column;align-items:center;justify-content:center;gap:6px;margin:0;padding:20px 32px;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-xl);background:0 0;color:var(--dsw-alias-label-primary);font:inherit;font-size:14px;line-height:22px;cursor:pointer}
.dnp-cube:hover:not([aria-pressed="true"]){background:var(--dsw-alias-interactive-bg-hover)}
.dnp-cube[aria-pressed="true"]{background:var(--dsw-alias-bg-module-platform);border-color:var(--dsw-static-neutral-bluish-400)}
.dnp-dot{width:14px;height:14px;border-radius:999px;box-shadow:0 0 0 .5px var(--dsw-alias-border-l4)}
@media (width<=767px){html:not([data-windows-titlebar]):not([data-platform=darwin]) .dnp-cube{flex:1 1 0;padding:12px 6px}}`;

		/** Install the token sheet and the row styles once. */
		function ensureStyles() {
			if (typeof document === "undefined") return;
			if (document.getElementById(VARS_STYLE_ID) === null) {
				const vars = document.createElement("style");
				vars.id = VARS_STYLE_ID;
				vars.textContent = PALETTE_CSS;
				document.head.appendChild(vars);
			}
			if (document.getElementById(ROW_STYLE_ID) === null) {
				const row = document.createElement("style");
				row.id = ROW_STYLE_ID;
				row.textContent = ROW_CSS;
				document.head.appendChild(row);
			}
		}

		/** The saved id, or null when it names a palette this build no longer has. */
		function readSaved() {
			try {
				const saved = localStorage.getItem(STORAGE_KEY);
				return PALETTES.some((palette) => palette.id === saved) ? saved : null;
			} catch {
				return null;
			}
		}

		/** Point the document at one palette; a null id returns to the shell's own. */
		function applyPalette(id) {
			ensureStyles();
			if (typeof document === "undefined") return;
			if (id !== null && PALETTES.some((palette) => palette.id === id)) document.documentElement.dataset.neonPalette = id;
			else delete document.documentElement.dataset.neonPalette;
		}

		/** One row: title plus the three palette cubes. */
		function PaletteRow() {
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
				react.createElement("div", { className: "dnp-title" }, "主题配色"),
				react.createElement(
					"div",
					{ className: "dnp-cubes" },
					PALETTES.map((palette) =>
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

		const inject = ["slots"];

		/** Restore the saved palette, then register the row. */
		function apply(ctx) {
			ensureStyles();
			const saved = readSaved();
			if (saved !== null) applyPalette(saved);
			ctx.slots.inject("settings.general.item", () =>
				ctx.slots.register(
					{
						name: "settings.general.item",
						id: "neon-palette",
						// Between 外观 (10) and 字号 (11): the row sits right next to 外观.
						order: 10.5
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

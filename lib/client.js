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
		const PALETTES = [
	{
		"id": "neon-cyan",
		"name": "Neon Cyan",
		"accent": "#54F5FF"
	},
	{
		"id": "neon-pink",
		"name": "Neon Pink",
		"accent": "#FF94B8"
	},
	{
		"id": "neon-yellow",
		"name": "Neon Yellow",
		"accent": "#E6FF40"
	}
];

		/** Per-palette token sheet, generated from themes/*.json. */
		const PALETTE_CSS = "html[data-neon-palette=\"neon-cyan\"] body:not([data-ds-dark-theme]) {\n  --dsw-static-neutral-bluish-00: #FBFCFD;\n  --dsw-static-neutral-bluish-50: #EFF1F2;\n  --dsw-static-neutral-bluish-60: #EDEEF0;\n  --dsw-static-neutral-bluish-75: #EAEBEC;\n  --dsw-static-neutral-bluish-100: #E4E5E7;\n  --dsw-static-neutral-bluish-150: #D8DADB;\n  --dsw-static-neutral-bluish-200: #CDCED0;\n  --dsw-static-neutral-bluish-300: #B6B8BA;\n  --dsw-static-neutral-bluish-400: #9FA1A3;\n  --dsw-static-neutral-bluish-500: #888A8D;\n  --dsw-static-neutral-bluish-600: #707376;\n  --dsw-static-neutral-bluish-700: #595C60;\n  --dsw-static-neutral-bluish-750: #4E5154;\n  --dsw-static-neutral-bluish-800: #424649;\n  --dsw-static-neutral-bluish-850: #373A3E;\n  --dsw-static-neutral-bluish-875: #313538;\n  --dsw-static-neutral-bluish-900: #2B2F33;\n  --dsw-static-neutral-bluish-950: #202327;\n  --dsw-static-neutral-bluish-1000: #14181C;\n  --dsw-static-neutral-00: #FBFCFD;\n  --dsw-static-neutral-50: #EFF1F2;\n  --dsw-static-neutral-100: #E4E5E7;\n  --dsw-static-neutral-150: #D8DADB;\n  --dsw-static-neutral-200: #CDCED0;\n  --dsw-static-neutral-250: #C1C3C5;\n  --dsw-static-neutral-300: #B6B8BA;\n  --dsw-static-neutral-400: #9FA1A3;\n  --dsw-static-neutral-500: #888A8D;\n  --dsw-static-neutral-550: #7C7F81;\n  --dsw-static-neutral-600: #707376;\n  --dsw-static-neutral-700: #595C60;\n  --dsw-static-neutral-800: #424649;\n  --dsw-static-neutral-850: #373A3E;\n  --dsw-static-neutral-900: #2B2F33;\n  --dsw-static-neutral-1000: #14181C;\n  --dsw-static-deepseek-50: #EBF4F5;\n  --dsw-static-deepseek-100: #D9EBED;\n  --dsw-static-deepseek-200: #ADD4D9;\n  --dsw-static-deepseek-300: #7ABAC1;\n  --dsw-static-deepseek-400: #3897A1;\n  --dsw-static-deepseek-450: #1F8A95;\n  --dsw-static-deepseek-500: #007A87;\n  --dsw-static-deepseek-600: #00646F;\n  --dsw-static-deepseek-800: #00434A;\n  --dsw-static-deepseek-900: #002B2F;\n  --dsw-static-blue-50: #EBF4F5;\n  --dsw-static-blue-100: #D9EBED;\n  --dsw-static-blue-300: #7ABAC1;\n  --dsw-static-blue-400: #3897A1;\n  --dsw-static-blue-450: #1F8A95;\n  --dsw-static-blue-500: #007A87;\n  --dsw-static-blue-600: #00646F;\n  --dsw-static-blue-800: #00434A;\n  --dsw-static-blue-900: #002B2F;\n  --dsw-static-blue-50p: #E6F2F3;\n  --dsw-static-blue-75: #E0EFF1;\n  --dsw-static-blue-950: #001F22;\n  --dsw-static-green-100: #DBEBE4;\n  --dsw-static-green-400: #439775;\n  --dsw-static-green-500: #0E7A4E;\n  --dsw-static-green-900: #052B1B;\n  --dsw-static-amber-100: #EDE6D9;\n  --dsw-static-amber-400: #A47E38;\n  --dsw-static-amber-500: #8A5A00;\n  --dsw-static-amber-600: #714A00;\n  --dsw-static-amber-900: #301F00;\n  --dsw-static-red-50: #FAEEF1;\n  --dsw-static-red-100: #F6DFE4;\n  --dsw-static-red-400: #D15972;\n  --dsw-static-red-500: #C42A4A;\n  --dsw-static-red-600: #A1223D;\n  --dsw-static-red-900: #450F1A;\n  --dsw-static-deepseek-700-delete: #00555F;\n  --dsw-alias-border-l1: rgba(11, 26, 30, 0.06);\n  --dsw-alias-border-l2: rgba(11, 26, 30, 0.12);\n  --dsw-alias-border-l3: rgba(11, 26, 30, 0.14);\n  --dsw-alias-border-l4: rgba(11, 26, 30, 0.18);\n  --dsw-alias-border-l2-darkmode-thin: rgba(11, 26, 30, 0.12);\n  --dsw-specific-sidebar-nav-item-active-accent: var(--dsw-static-deepseek-500);\n  --dsw-specific-sidebar-fill: var(--dsw-static-neutral-bluish-00);\n  --shiki-token-constant: #006D7A;\n  --shiki-token-string: #0E7A4E;\n  --shiki-token-comment: #6B7780;\n  --shiki-token-keyword: #B03A64;\n  --shiki-token-parameter: #8A5A00;\n  --shiki-token-function: #6E7C00;\n  --shiki-token-string-expression: #1B7A4A;\n  --shiki-token-punctuation: #3F5157;\n  --shiki-token-link: #006D7A;\n}\n\nhtml[data-neon-palette=\"neon-cyan\"] body[data-ds-dark-theme] {\n  --dsw-static-neutral-bluish-00: #F2F5F7;\n  --dsw-static-neutral-bluish-50: #E6E9EB;\n  --dsw-static-neutral-bluish-60: #E4E7E9;\n  --dsw-static-neutral-bluish-75: #E1E3E5;\n  --dsw-static-neutral-bluish-100: #DBDEE0;\n  --dsw-static-neutral-bluish-150: #CFD2D4;\n  --dsw-static-neutral-bluish-200: #C4C6C8;\n  --dsw-static-neutral-bluish-300: #ACAFB1;\n  --dsw-static-neutral-bluish-400: #959799;\n  --dsw-static-neutral-bluish-500: #7E8082;\n  --dsw-static-neutral-bluish-600: #67696B;\n  --dsw-static-neutral-bluish-700: #505153;\n  --dsw-static-neutral-bluish-750: #444648;\n  --dsw-static-neutral-bluish-800: #383A3C;\n  --dsw-static-neutral-bluish-850: #2D2E30;\n  --dsw-static-neutral-bluish-875: #27282A;\n  --dsw-static-neutral-bluish-900: #212224;\n  --dsw-static-neutral-bluish-950: #161719;\n  --dsw-static-neutral-bluish-1000: #0A0B0D;\n  --dsw-static-neutral-00: #F2F5F7;\n  --dsw-static-neutral-50: #E6E9EB;\n  --dsw-static-neutral-100: #DBDEE0;\n  --dsw-static-neutral-150: #CFD2D4;\n  --dsw-static-neutral-200: #C4C6C8;\n  --dsw-static-neutral-250: #B8BBBD;\n  --dsw-static-neutral-300: #ACAFB1;\n  --dsw-static-neutral-400: #959799;\n  --dsw-static-neutral-500: #7E8082;\n  --dsw-static-neutral-550: #727476;\n  --dsw-static-neutral-600: #67696B;\n  --dsw-static-neutral-700: #505153;\n  --dsw-static-neutral-800: #383A3C;\n  --dsw-static-neutral-850: #2D2E30;\n  --dsw-static-neutral-900: #212224;\n  --dsw-static-neutral-1000: #0A0B0D;\n  --dsw-static-deepseek-50: #F1FEFF;\n  --dsw-static-deepseek-100: #E5FEFF;\n  --dsw-static-deepseek-200: #C8FCFF;\n  --dsw-static-deepseek-300: #A6FAFF;\n  --dsw-static-deepseek-400: #7AF7FF;\n  --dsw-static-deepseek-450: #69F6FF;\n  --dsw-static-deepseek-500: #54F5FF;\n  --dsw-static-deepseek-600: #45C9D1;\n  --dsw-static-deepseek-800: #2E878C;\n  --dsw-static-deepseek-900: #1D5659;\n  --dsw-static-blue-50: #F1FEFF;\n  --dsw-static-blue-100: #E5FEFF;\n  --dsw-static-blue-300: #A6FAFF;\n  --dsw-static-blue-400: #7AF7FF;\n  --dsw-static-blue-450: #69F6FF;\n  --dsw-static-blue-500: #54F5FF;\n  --dsw-static-blue-600: #45C9D1;\n  --dsw-static-blue-800: #2E878C;\n  --dsw-static-blue-900: #1D5659;\n  --dsw-static-blue-50p: #EEFEFF;\n  --dsw-static-blue-75: #EAFEFF;\n  --dsw-static-blue-950: #153D40;\n  --dsw-static-green-100: #E8FBF5;\n  --dsw-static-green-400: #85ECCC;\n  --dsw-static-green-500: #63E6BE;\n  --dsw-static-green-900: #235143;\n  --dsw-static-amber-100: #FFF7E7;\n  --dsw-static-amber-400: #FFD484;\n  --dsw-static-amber-500: #FFC861;\n  --dsw-static-amber-600: #D1A450;\n  --dsw-static-amber-900: #594622;\n  --dsw-static-red-50: #FFF3F6;\n  --dsw-static-red-100: #FFE9ED;\n  --dsw-static-red-400: #FF8CA4;\n  --dsw-static-red-500: #FF6B8A;\n  --dsw-static-red-600: #D15871;\n  --dsw-static-red-900: #592530;\n  --dsw-static-deepseek-700-delete: #3BACB3;\n  --dsw-alias-border-l1: rgba(84, 245, 255, 0.07);\n  --dsw-alias-border-l2: rgba(84, 245, 255, 0.13);\n  --dsw-alias-border-l3: rgba(84, 245, 255, 0.17);\n  --dsw-alias-border-l4: rgba(84, 245, 255, 0.21);\n  --dsw-alias-border-l2-darkmode-thin: rgba(84, 245, 255, 0.07);\n  --dsw-specific-sidebar-nav-item-active-accent: var(--dsw-static-deepseek-500);\n  --dsw-specific-sidebar-fill: var(--dsw-static-neutral-bluish-950);\n  --shiki-token-constant: #54F5FF;\n  --shiki-token-string: #63E6BE;\n  --shiki-token-comment: #5F6B7A;\n  --shiki-token-keyword: #FF94B8;\n  --shiki-token-parameter: #FFC861;\n  --shiki-token-function: #E6FF40;\n  --shiki-token-string-expression: #7BE3A8;\n  --shiki-token-punctuation: #C3D6DD;\n  --shiki-token-link: #54F5FF;\n}\n\nhtml[data-neon-palette=\"neon-pink\"] body:not([data-ds-dark-theme]) {\n  --dsw-static-neutral-bluish-00: #FDFBFC;\n  --dsw-static-neutral-bluish-50: #F2EFF1;\n  --dsw-static-neutral-bluish-60: #EFEDEE;\n  --dsw-static-neutral-bluish-75: #ECEAEB;\n  --dsw-static-neutral-bluish-100: #E6E4E5;\n  --dsw-static-neutral-bluish-150: #DBD8DA;\n  --dsw-static-neutral-bluish-200: #CFCDCE;\n  --dsw-static-neutral-bluish-300: #B8B6B7;\n  --dsw-static-neutral-bluish-400: #A19FA0;\n  --dsw-static-neutral-bluish-500: #8B888A;\n  --dsw-static-neutral-bluish-600: #747073;\n  --dsw-static-neutral-bluish-700: #5D595C;\n  --dsw-static-neutral-bluish-750: #514E50;\n  --dsw-static-neutral-bluish-800: #464245;\n  --dsw-static-neutral-bluish-850: #3A3739;\n  --dsw-static-neutral-bluish-875: #353134;\n  --dsw-static-neutral-bluish-900: #2F2B2E;\n  --dsw-static-neutral-bluish-950: #232022;\n  --dsw-static-neutral-bluish-1000: #181417;\n  --dsw-static-neutral-00: #FDFBFC;\n  --dsw-static-neutral-50: #F2EFF1;\n  --dsw-static-neutral-100: #E6E4E5;\n  --dsw-static-neutral-150: #DBD8DA;\n  --dsw-static-neutral-200: #CFCDCE;\n  --dsw-static-neutral-250: #C4C1C3;\n  --dsw-static-neutral-300: #B8B6B7;\n  --dsw-static-neutral-400: #A19FA0;\n  --dsw-static-neutral-500: #8B888A;\n  --dsw-static-neutral-550: #7F7C7E;\n  --dsw-static-neutral-600: #747073;\n  --dsw-static-neutral-700: #5D595C;\n  --dsw-static-neutral-800: #464245;\n  --dsw-static-neutral-850: #3A3739;\n  --dsw-static-neutral-900: #2F2B2E;\n  --dsw-static-neutral-1000: #181417;\n  --dsw-static-deepseek-50: #F9EFF3;\n  --dsw-static-deepseek-100: #F3E1E8;\n  --dsw-static-deepseek-200: #E6C0CD;\n  --dsw-static-deepseek-300: #D699AE;\n  --dsw-static-deepseek-400: #C16586;\n  --dsw-static-deepseek-450: #B95277;\n  --dsw-static-deepseek-500: #B03A64;\n  --dsw-static-deepseek-600: #903052;\n  --dsw-static-deepseek-800: #612037;\n  --dsw-static-deepseek-900: #3E1423;\n  --dsw-static-blue-50: #F9EFF3;\n  --dsw-static-blue-100: #F3E1E8;\n  --dsw-static-blue-300: #D699AE;\n  --dsw-static-blue-400: #C16586;\n  --dsw-static-blue-450: #B95277;\n  --dsw-static-blue-500: #B03A64;\n  --dsw-static-blue-600: #903052;\n  --dsw-static-blue-800: #612037;\n  --dsw-static-blue-900: #3E1423;\n  --dsw-static-blue-50p: #F7EBF0;\n  --dsw-static-blue-75: #F6E7EC;\n  --dsw-static-blue-950: #2C0F19;\n  --dsw-static-green-100: #DDEBE4;\n  --dsw-static-green-400: #4D9772;\n  --dsw-static-green-500: #1B7A4A;\n  --dsw-static-green-900: #092B1A;\n  --dsw-static-amber-100: #EDE6D9;\n  --dsw-static-amber-400: #A47E38;\n  --dsw-static-amber-500: #8A5A00;\n  --dsw-static-amber-600: #714A00;\n  --dsw-static-amber-900: #301F00;\n  --dsw-static-red-50: #FAEDEF;\n  --dsw-static-red-100: #F6DCE2;\n  --dsw-static-red-400: #CF4B67;\n  --dsw-static-red-500: #C2183C;\n  --dsw-static-red-600: #9F1431;\n  --dsw-static-red-900: #440815;\n  --dsw-static-deepseek-700-delete: #7B2946;\n  --dsw-alias-border-l1: rgba(26, 15, 20, 0.06);\n  --dsw-alias-border-l2: rgba(26, 15, 20, 0.12);\n  --dsw-alias-border-l3: rgba(26, 15, 20, 0.14);\n  --dsw-alias-border-l4: rgba(26, 15, 20, 0.18);\n  --dsw-alias-border-l2-darkmode-thin: rgba(26, 15, 20, 0.12);\n  --dsw-specific-sidebar-nav-item-active-accent: var(--dsw-static-deepseek-500);\n  --dsw-specific-sidebar-fill: var(--dsw-static-neutral-bluish-00);\n  --shiki-token-constant: #B03A64;\n  --shiki-token-string: #1B7A4A;\n  --shiki-token-comment: #7A6B72;\n  --shiki-token-keyword: #006D7A;\n  --shiki-token-parameter: #8A5A00;\n  --shiki-token-function: #6E7C00;\n  --shiki-token-string-expression: #2E7D32;\n  --shiki-token-punctuation: #5A4A52;\n  --shiki-token-link: #B03A64;\n}\n\nhtml[data-neon-palette=\"neon-pink\"] body[data-ds-dark-theme] {\n  --dsw-static-neutral-bluish-00: #F7F3F4;\n  --dsw-static-neutral-bluish-50: #EBE7E8;\n  --dsw-static-neutral-bluish-60: #E9E5E6;\n  --dsw-static-neutral-bluish-75: #E5E2E3;\n  --dsw-static-neutral-bluish-100: #DFDCDD;\n  --dsw-static-neutral-bluish-150: #D3D0D1;\n  --dsw-static-neutral-bluish-200: #C8C5C6;\n  --dsw-static-neutral-bluish-300: #B0ADAF;\n  --dsw-static-neutral-bluish-400: #989698;\n  --dsw-static-neutral-bluish-500: #817F81;\n  --dsw-static-neutral-bluish-600: #696869;\n  --dsw-static-neutral-bluish-700: #515152;\n  --dsw-static-neutral-bluish-750: #454547;\n  --dsw-static-neutral-bluish-800: #39393B;\n  --dsw-static-neutral-bluish-850: #2E2E30;\n  --dsw-static-neutral-bluish-875: #28282A;\n  --dsw-static-neutral-bluish-900: #222224;\n  --dsw-static-neutral-bluish-950: #161719;\n  --dsw-static-neutral-bluish-1000: #0A0B0D;\n  --dsw-static-neutral-00: #F7F3F4;\n  --dsw-static-neutral-50: #EBE7E8;\n  --dsw-static-neutral-100: #DFDCDD;\n  --dsw-static-neutral-150: #D3D0D1;\n  --dsw-static-neutral-200: #C8C5C6;\n  --dsw-static-neutral-250: #BCB9BA;\n  --dsw-static-neutral-300: #B0ADAF;\n  --dsw-static-neutral-400: #989698;\n  --dsw-static-neutral-500: #817F81;\n  --dsw-static-neutral-550: #757375;\n  --dsw-static-neutral-600: #696869;\n  --dsw-static-neutral-700: #515152;\n  --dsw-static-neutral-800: #39393B;\n  --dsw-static-neutral-850: #2E2E30;\n  --dsw-static-neutral-900: #222224;\n  --dsw-static-neutral-1000: #0A0B0D;\n  --dsw-static-deepseek-50: #FFF6F9;\n  --dsw-static-deepseek-100: #FFEFF4;\n  --dsw-static-deepseek-200: #FFDDE8;\n  --dsw-static-deepseek-300: #FFC7DA;\n  --dsw-static-deepseek-400: #FFACC8;\n  --dsw-static-deepseek-450: #FFA1C1;\n  --dsw-static-deepseek-500: #FF94B8;\n  --dsw-static-deepseek-600: #D17997;\n  --dsw-static-deepseek-800: #8C5165;\n  --dsw-static-deepseek-900: #593440;\n  --dsw-static-blue-50: #FFF6F9;\n  --dsw-static-blue-100: #FFEFF4;\n  --dsw-static-blue-300: #FFC7DA;\n  --dsw-static-blue-400: #FFACC8;\n  --dsw-static-blue-450: #FFA1C1;\n  --dsw-static-blue-500: #FF94B8;\n  --dsw-static-blue-600: #D17997;\n  --dsw-static-blue-800: #8C5165;\n  --dsw-static-blue-900: #593440;\n  --dsw-static-blue-50p: #FFF4F8;\n  --dsw-static-blue-75: #FFF2F6;\n  --dsw-static-blue-950: #40252E;\n  --dsw-static-green-100: #EBFBF2;\n  --dsw-static-green-400: #98E9BB;\n  --dsw-static-green-500: #7BE3A8;\n  --dsw-static-green-900: #2B4F3B;\n  --dsw-static-amber-100: #FFF6E9;\n  --dsw-static-amber-400: #FFD18C;\n  --dsw-static-amber-500: #FFC46B;\n  --dsw-static-amber-600: #D1A158;\n  --dsw-static-amber-900: #594525;\n  --dsw-static-red-50: #FFF1F3;\n  --dsw-static-red-100: #FFE4E9;\n  --dsw-static-red-400: #FF748D;\n  --dsw-static-red-500: #FF4D6D;\n  --dsw-static-red-600: #D13F59;\n  --dsw-static-red-900: #591B26;\n  --dsw-static-deepseek-700-delete: #B36881;\n  --dsw-alias-border-l1: rgba(255, 148, 184, 0.07);\n  --dsw-alias-border-l2: rgba(255, 148, 184, 0.13);\n  --dsw-alias-border-l3: rgba(255, 148, 184, 0.17);\n  --dsw-alias-border-l4: rgba(255, 148, 184, 0.21);\n  --dsw-alias-border-l2-darkmode-thin: rgba(255, 148, 184, 0.07);\n  --dsw-specific-sidebar-nav-item-active-accent: var(--dsw-static-deepseek-500);\n  --dsw-specific-sidebar-fill: var(--dsw-static-neutral-bluish-950);\n  --shiki-token-constant: #FF94B8;\n  --shiki-token-string: #7BE3A8;\n  --shiki-token-comment: #6E5F66;\n  --shiki-token-keyword: #54F5FF;\n  --shiki-token-parameter: #FFC46B;\n  --shiki-token-function: #E6FF40;\n  --shiki-token-string-expression: #9BE36B;\n  --shiki-token-punctuation: #D6C6CE;\n  --shiki-token-link: #FF94B8;\n}\n\nhtml[data-neon-palette=\"neon-yellow\"] body:not([data-ds-dark-theme]) {\n  --dsw-static-neutral-bluish-00: #FDFDFD;\n  --dsw-static-neutral-bluish-50: #F2F2F2;\n  --dsw-static-neutral-bluish-60: #EFEFEF;\n  --dsw-static-neutral-bluish-75: #ECECEC;\n  --dsw-static-neutral-bluish-100: #E6E6E6;\n  --dsw-static-neutral-bluish-150: #DBDBDB;\n  --dsw-static-neutral-bluish-200: #CFCFCF;\n  --dsw-static-neutral-bluish-300: #B8B8B8;\n  --dsw-static-neutral-bluish-400: #A1A1A1;\n  --dsw-static-neutral-bluish-500: #8A8A8A;\n  --dsw-static-neutral-bluish-600: #737373;\n  --dsw-static-neutral-bluish-700: #5C5C5C;\n  --dsw-static-neutral-bluish-750: #515151;\n  --dsw-static-neutral-bluish-800: #454545;\n  --dsw-static-neutral-bluish-850: #3A3A3A;\n  --dsw-static-neutral-bluish-875: #343434;\n  --dsw-static-neutral-bluish-900: #2E2E2E;\n  --dsw-static-neutral-bluish-950: #232323;\n  --dsw-static-neutral-bluish-1000: #171717;\n  --dsw-static-neutral-00: #FDFDFD;\n  --dsw-static-neutral-50: #F2F2F2;\n  --dsw-static-neutral-100: #E6E6E6;\n  --dsw-static-neutral-150: #DBDBDB;\n  --dsw-static-neutral-200: #CFCFCF;\n  --dsw-static-neutral-250: #C4C4C4;\n  --dsw-static-neutral-300: #B8B8B8;\n  --dsw-static-neutral-400: #A1A1A1;\n  --dsw-static-neutral-500: #8A8A8A;\n  --dsw-static-neutral-550: #7E7E7E;\n  --dsw-static-neutral-600: #737373;\n  --dsw-static-neutral-700: #5C5C5C;\n  --dsw-static-neutral-800: #454545;\n  --dsw-static-neutral-850: #3A3A3A;\n  --dsw-static-neutral-900: #2E2E2E;\n  --dsw-static-neutral-1000: #171717;\n  --dsw-static-deepseek-50: #F3F5EB;\n  --dsw-static-deepseek-100: #E9EBD9;\n  --dsw-static-deepseek-200: #D1D5AD;\n  --dsw-static-deepseek-300: #B4BB7A;\n  --dsw-static-deepseek-400: #8E9938;\n  --dsw-static-deepseek-450: #7F8C1F;\n  --dsw-static-deepseek-500: #6E7C00;\n  --dsw-static-deepseek-600: #5A6600;\n  --dsw-static-deepseek-800: #3D4400;\n  --dsw-static-deepseek-900: #272B00;\n  --dsw-static-blue-50: #F3F5EB;\n  --dsw-static-blue-100: #E9EBD9;\n  --dsw-static-blue-300: #B4BB7A;\n  --dsw-static-blue-400: #8E9938;\n  --dsw-static-blue-450: #7F8C1F;\n  --dsw-static-blue-500: #6E7C00;\n  --dsw-static-blue-600: #5A6600;\n  --dsw-static-blue-800: #3D4400;\n  --dsw-static-blue-900: #272B00;\n  --dsw-static-blue-50p: #F1F2E6;\n  --dsw-static-blue-75: #EEEFE0;\n  --dsw-static-blue-950: #1C1F00;\n  --dsw-static-green-100: #E2EBDD;\n  --dsw-static-green-400: #69974C;\n  --dsw-static-green-500: #3F7A1A;\n  --dsw-static-green-900: #162B09;\n  --dsw-static-amber-100: #EDE6D9;\n  --dsw-static-amber-400: #A47E38;\n  --dsw-static-amber-500: #8A5A00;\n  --dsw-static-amber-600: #714A00;\n  --dsw-static-amber-900: #301F00;\n  --dsw-static-red-50: #FAEEF1;\n  --dsw-static-red-100: #F6DFE4;\n  --dsw-static-red-400: #D15972;\n  --dsw-static-red-500: #C42A4A;\n  --dsw-static-red-600: #A1223D;\n  --dsw-static-red-900: #450F1A;\n  --dsw-static-deepseek-700-delete: #4D5700;\n  --dsw-alias-border-l1: rgba(22, 26, 11, 0.06);\n  --dsw-alias-border-l2: rgba(22, 26, 11, 0.12);\n  --dsw-alias-border-l3: rgba(22, 26, 11, 0.14);\n  --dsw-alias-border-l4: rgba(22, 26, 11, 0.18);\n  --dsw-alias-border-l2-darkmode-thin: rgba(22, 26, 11, 0.12);\n  --dsw-specific-sidebar-nav-item-active-accent: var(--dsw-static-deepseek-500);\n  --dsw-specific-sidebar-fill: var(--dsw-static-neutral-bluish-00);\n  --shiki-token-constant: #6E7C00;\n  --shiki-token-string: #2E7D32;\n  --shiki-token-comment: #6B7780;\n  --shiki-token-keyword: #B03A64;\n  --shiki-token-parameter: #8A5A00;\n  --shiki-token-function: #006D7A;\n  --shiki-token-string-expression: #3F7A1A;\n  --shiki-token-punctuation: #4A555C;\n  --shiki-token-link: #006D7A;\n}\n\nhtml[data-neon-palette=\"neon-yellow\"] body[data-ds-dark-theme] {\n  --dsw-static-neutral-bluish-00: #F7F7F7;\n  --dsw-static-neutral-bluish-50: #EBEBEB;\n  --dsw-static-neutral-bluish-60: #E9E9E9;\n  --dsw-static-neutral-bluish-75: #E5E5E5;\n  --dsw-static-neutral-bluish-100: #DFDFE0;\n  --dsw-static-neutral-bluish-150: #D3D4D4;\n  --dsw-static-neutral-bluish-200: #C8C8C8;\n  --dsw-static-neutral-bluish-300: #B0B0B1;\n  --dsw-static-neutral-bluish-400: #989999;\n  --dsw-static-neutral-bluish-500: #818182;\n  --dsw-static-neutral-bluish-600: #69696B;\n  --dsw-static-neutral-bluish-700: #515253;\n  --dsw-static-neutral-bluish-750: #454648;\n  --dsw-static-neutral-bluish-800: #393A3C;\n  --dsw-static-neutral-bluish-850: #2E2E30;\n  --dsw-static-neutral-bluish-875: #28292A;\n  --dsw-static-neutral-bluish-900: #222324;\n  --dsw-static-neutral-bluish-950: #161719;\n  --dsw-static-neutral-bluish-1000: #0A0B0D;\n  --dsw-static-neutral-00: #F7F7F7;\n  --dsw-static-neutral-50: #EBEBEB;\n  --dsw-static-neutral-100: #DFDFE0;\n  --dsw-static-neutral-150: #D3D4D4;\n  --dsw-static-neutral-200: #C8C8C8;\n  --dsw-static-neutral-250: #BCBCBD;\n  --dsw-static-neutral-300: #B0B0B1;\n  --dsw-static-neutral-400: #989999;\n  --dsw-static-neutral-500: #818182;\n  --dsw-static-neutral-550: #757576;\n  --dsw-static-neutral-600: #69696B;\n  --dsw-static-neutral-700: #515253;\n  --dsw-static-neutral-800: #393A3C;\n  --dsw-static-neutral-850: #2E2E30;\n  --dsw-static-neutral-900: #222324;\n  --dsw-static-neutral-1000: #0A0B0D;\n  --dsw-static-deepseek-50: #FDFFF0;\n  --dsw-static-deepseek-100: #FBFFE2;\n  --dsw-static-deepseek-200: #F7FFC2;\n  --dsw-static-deepseek-300: #F2FF9C;\n  --dsw-static-deepseek-400: #ECFF6A;\n  --dsw-static-deepseek-450: #E9FF57;\n  --dsw-static-deepseek-500: #E6FF40;\n  --dsw-static-deepseek-600: #BDD134;\n  --dsw-static-deepseek-800: #7F8C23;\n  --dsw-static-deepseek-900: #515916;\n  --dsw-static-blue-50: #FDFFF0;\n  --dsw-static-blue-100: #FBFFE2;\n  --dsw-static-blue-300: #F2FF9C;\n  --dsw-static-blue-400: #ECFF6A;\n  --dsw-static-blue-450: #E9FF57;\n  --dsw-static-blue-500: #E6FF40;\n  --dsw-static-blue-600: #BDD134;\n  --dsw-static-blue-800: #7F8C23;\n  --dsw-static-blue-900: #515916;\n  --dsw-static-blue-50p: #FDFFEC;\n  --dsw-static-blue-75: #FCFFE8;\n  --dsw-static-blue-950: #3A4010;\n  --dsw-static-green-100: #F0FBE9;\n  --dsw-static-green-400: #B1E98C;\n  --dsw-static-green-500: #9BE36B;\n  --dsw-static-green-900: #364F25;\n  --dsw-static-amber-100: #FFF8E8;\n  --dsw-static-amber-400: #FFDB88;\n  --dsw-static-amber-500: #FFD166;\n  --dsw-static-amber-600: #D1AB54;\n  --dsw-static-amber-900: #594924;\n  --dsw-static-red-50: #FFF2F4;\n  --dsw-static-red-100: #FFE7EB;\n  --dsw-static-red-400: #FF8097;\n  --dsw-static-red-500: #FF5C7A;\n  --dsw-static-red-600: #D14B64;\n  --dsw-static-red-900: #59202B;\n  --dsw-static-deepseek-700-delete: #A1B32D;\n  --dsw-alias-border-l1: rgba(230, 255, 64, 0.07);\n  --dsw-alias-border-l2: rgba(230, 255, 64, 0.13);\n  --dsw-alias-border-l3: rgba(230, 255, 64, 0.17);\n  --dsw-alias-border-l4: rgba(230, 255, 64, 0.21);\n  --dsw-alias-border-l2-darkmode-thin: rgba(230, 255, 64, 0.07);\n  --dsw-specific-sidebar-nav-item-active-accent: var(--dsw-static-deepseek-500);\n  --dsw-specific-sidebar-fill: var(--dsw-static-neutral-bluish-950);\n  --shiki-token-constant: #E6FF40;\n  --shiki-token-string: #9BE36B;\n  --shiki-token-comment: #5F6B7A;\n  --shiki-token-keyword: #FF94B8;\n  --shiki-token-parameter: #FFC861;\n  --shiki-token-function: #54F5FF;\n  --shiki-token-string-expression: #C7F464;\n  --shiki-token-punctuation: #C8D2DC;\n  --shiki-token-link: #54F5FF;\n}";

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

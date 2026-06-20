# Dark Neon Themes 主题说明

## 目的

这个仓库保存的是一组独立的 Chrome 主题包源码，视觉方向为
“失落星船马拉松”。

当前实现保持最小化：

- 只依赖轻量 Node 脚本打包
- 允许极少量开发依赖用于类型检查
- locale 与图片统一走 `themes/` 真相源
- 不依赖 `midnight-pink-unpacked`

## 主题方向

视觉方向：

- 基底：深黑、石墨灰、冷调枪灰
- 强调：荧光黄
- 氛围：废弃星船驾驶舱 / 工业警示系统

避免：

- 糖果黄
- 偏橙的暖黄
- 大面积亮白
- 大面积高饱和纯黄背景

## 当前结构

根目录不再是可加载的已解压主题包，主题真相源位于 `themes/`，
可加载产物位于 `dist/packages/<variant>/`。

核心目录：

- `themes/config.ts`
- `themes/config.js`
- `themes/assets/shared/`
- `themes/assets/<variant>/`
- `themes/locales/`
- `scripts/build-theme-packages.js`
- `scripts/build-theme-packages.ts`

## 实现规则

- 保持主题独立，不要重新引入已经删除的旧根目录单主题资源、
  `_locales` 或下载下来的 CRX 文件。
- 优先编辑 `themes/config.*`、`themes/assets/`、`themes/locales/`
  和 `scripts/build-theme-packages.*`。
- 不要引入重型构建系统。
- 第一约束始终是 Chrome 主题兼容性。

## 配色指引

建议色板范围：

- 荧光黄：`rgb(235, 255, 72)` 到 `rgb(246, 255, 98)`
- 弱化非激活黄：约 `rgb(182, 194, 76)`
- 深石墨背景：约 `rgb(24, 27, 31)` 到 `rgb(49, 55, 64)`
- 框架黑：`rgb(0, 0, 0)`

常见映射：

- `toolbar_button_icon`：荧光黄
- `toolbar_text`：荧光黄
- `tab_text`：荧光黄
- `bookmark_text`：荧光黄
- `omnibox_text`：荧光黄
- 非激活文本：弱化黄
- 工具栏 / 框架 / 背景：黑到石墨灰

## 验证

修改主题时，至少确认：

1. `pnpm zip` 能成功生成目标主题 zip。
2. `dist/packages/<variant>/` 可以通过 `chrome://extensions` -> `Load unpacked` 正常加载。
3. 生成的 `manifest.json` 只引用包目录中真实存在的文件。
4. 工具栏图标、标签文字和地址栏文字符合对应配色。

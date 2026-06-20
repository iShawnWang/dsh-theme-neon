# Dark Neon Yellow 主题说明

## 目的

这个仓库保存的是一份独立的 Chrome 主题包，视觉方向为
“失落星船马拉松”。

当前实现保持最小化：

- 不需要构建步骤
- 不依赖外部库
- 不使用 locale 文件
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

## 当前包结构

根目录本身就是可加载的已解压主题包。

必须保留的文件：

- `manifest.json`
- `icon.png`
- `theme_frame.png`
- `theme_frame_inactive.png`
- `theme_tab_background.png`
- `theme_tab_background_inactive.png`
- `theme_toolbar.png`

## 实现规则

- 保持主题独立，不要重新引入已经删除的 `docs`、`spec`、
  `midnight-pink-unpacked`、`_locales` 或下载下来的 CRX 文件。
- 优先直接编辑 `manifest.json` 和根目录图片资源。
- 这类简单主题调整不要引入构建系统。
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

1. `manifest.json` 只引用根目录中真实存在的文件。
2. 主题可以通过 `chrome://extensions` -> `Load unpacked` 正常加载。
3. 工具栏图标、标签文字和地址栏文字显示为黄色。
4. 整体仍然是黑 / 石墨灰基底，黄色只作为强调色，而不是铺满背景。

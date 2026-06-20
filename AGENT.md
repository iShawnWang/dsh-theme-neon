# Neon Themes 主题说明

## 目的

这个仓库保存的是一组独立的 Chrome 主题包源码，视觉方向为
"失落星船马拉松"，同时包含深色和浅色两套主题。

当前实现保持最小化：

- 只依赖轻量 Node 脚本打包
- 使用 sharp 库生成纯色 PNG 图片
- locale 与图片统一走 `themes/` 真相源
- 不依赖 `midnight-pink-unpacked`

## 主题方向

### Dark 系列（深色主题）

视觉方向：

- 基底：深黑、石墨灰、冷调枪灰
- 强调：荧光黄 / 霓虹粉 / 霓虹青
- 氛围：废弃星船驾驶舱 / 工业警示系统

避免：

- 糖果黄
- 偏橙的暖黄
- 大面积亮白
- 大面积高饱和纯黄背景

### Light 系列（浅色主题）

视觉方向：

- 基底：暖白 RGB(250, 250, 249)、浅灰 RGB(234, 234, 234)
- 强调：与深色主题相同的霓虹色（适当调整色值以保证可读性）
- 氛围：明亮、现代、干净

## 当前主题列表

| 主题 ID | 类型 | 强调色 |
|---------|------|--------|
| `neon-pink-dark` | Dark | RGB(255, 148, 184) 粉色 |
| `neon-cyan-dark` | Dark | RGB(84, 245, 255) 青色 |
| `neon-yellow-dark` | Dark | RGB(230, 255, 64) 荧光黄 |
| `neon-pink-light` | Light | RGB(255, 148, 184) 粉色 |
| `neon-cyan-light` | Light | RGB(0, 180, 216) 深青蓝 |
| `neon-yellow-light` | Light | RGB(180, 210, 0) 橄榄绿黄 |

## 当前结构

根目录不再是可加载的已解压主题包，主题真相源位于 `themes/`，
可加载产物位于 `dist/packages/<variant>/`。

核心目录：

- `themes/config.js`
- `themes/assets/<variant>/`
- `themes/locales/`
- `scripts/build-theme-packages.js`
- `scripts/generate-theme-images.js`

## 实现规则

- 保持主题独立，不要重新引入已经删除的旧根目录单主题资源、
  `_locales` 或下载下来的 CRX 文件。
- 每个主题必须在自己的 `themes/assets/<variant>/` 目录下拥有完整的 6 张图片，
  构建脚本不再从 shared 目录 fallback。
- 优先编辑 `themes/config.js`、`themes/assets/`、`themes/locales/`
  和 `scripts/` 下的脚本。
- 不要引入重型构建系统。
- 第一约束始终是 Chrome 主题兼容性。

## 配色指引

### 深色主题

建议色板范围：

- 荧光黄：`rgb(235, 255, 72)` 到 `rgb(246, 255, 98)`
- 霓虹粉：`rgb(255, 148, 184)`
- 霓虹青：`rgb(84, 245, 255)`
- 弱化非激活色：降低对应强调色的饱和度
- 深石墨背景：约 `rgb(24, 27, 31)` 到 `rgb(49, 55, 64)`
- 框架黑：`rgb(0, 0, 0)`

### 浅色主题

建议色板范围：

- 暖白背景：`rgb(250, 250, 249)`
- 浅灰框架：`rgb(234, 234, 234)`
- 强调色需在深色版本基础上适当加深，确保在浅色背景上可读

### 常见映射

- `toolbar_button_icon`：强调色
- `toolbar_text`：强调色(深色) / 深灰蓝(浅色)
- `tab_text`：强调色
- `bookmark_text`：强调色
- `omnibox_text`：强调色(深色) / 深灰蓝(浅色)
- `ntp_text`：强调色(深色) / 深灰蓝(浅色)
- 非激活文本：弱化版强调色
- 工具栏 / 框架 / 背景：深主题用黑到石墨灰，浅主题用暖白到浅灰

## 验证

修改主题时，至少确认：

1. `pnpm generate-images --theme <主题ID>` 能生成图片。
2. `pnpm zip` 能成功生成目标主题 zip。
3. `dist/packages/<variant>/` 可以通过 `chrome://extensions` -> `Load unpacked` 正常加载。
4. 生成的 `manifest.json` 只引用包目录中真实存在的文件。
5. 工具栏图标、标签文字和地址栏文字符合对应配色。

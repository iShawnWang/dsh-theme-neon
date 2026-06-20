# 主题图片生成指南

## 快速开始

### 1. 为所有启用的主题生成图片

```bash
pnpm generate-images
```

### 2. 为指定主题生成图片

```bash
# 单个主题
pnpm generate-images --theme neon-pink-dark

# 多个主题(逗号分隔)
pnpm generate-images --theme neon-pink-dark,neon-cyan-dark
```

### 3. 查看所有可用主题

```bash
pnpm generate-images --list
```

### 4. 构建主题包

生成图片后,打包成 Chrome 主题:

```bash
# 构建所有主题
pnpm zip

# 构建指定主题
pnpm zip --theme neon-pink-dark
```

## 工作原理

脚本 `scripts/generate-theme-images.js` 会根据 `themes/config.js` 中的颜色配置自动生成以下图片:

| 图片文件 | 尺寸 | 用途 | 使用的颜色 |
|---------|------|------|-----------|
| `icon.png` | 128x128 | 主题图标 | `tab_text`(强调色) |
| `theme_frame.png` | 1x162 | 窗口框架(活跃) | `frame` |
| `theme_frame_inactive.png` | 1x162 | 窗口框架(非活跃) | `frame_inactive` |
| `theme_toolbar.png` | 1x162 | 工具栏背景 | `toolbar` |
| `theme_tab_background.png` | 1x162 | 标签页背景(活跃) | `frame` |
| `theme_tab_background_inactive.png` | 1x162 | 标签页背景(非活跃) | `frame_inactive` |

**重要**: 每个主题必须在 `themes/assets/{主题ID}/` 目录下拥有完整的 6 张图片。
构建脚本不再从 shared 目录 fallback,缺少任何图片都会导致构建失败。

## 新增主题流程

### 步骤 1: 在 config.js 中添加主题配置

编辑 `themes/config.js`,在 `themeVariants` 数组中添加新主题:

```javascript
{
  id: "neon-purple-dark",
  enabled: true,
  zipName: "neon-purple-dark.zip",
  displayName: "Neon Purple Dark",
  description: "A dark theme with purple accents.",
  version: "1.0.0",
  assetDir: "neon-purple-dark",
  colors: {
    ...neonYellowColors,
    bookmark_text: [180, 100, 255],
    tab_text: [180, 100, 255],
    // ... 其他颜色
  }
}
```

### 步骤 2: 生成主题图片

```bash
pnpm generate-images --theme neon-purple-dark
```

这会在 `themes/assets/neon-purple-dark/` 目录下生成所有必需的 6 张图片:
- `icon.png` (128x128)
- `theme_frame.png` (1x162)
- `theme_frame_inactive.png` (1x162)
- `theme_toolbar.png` (1x162)
- `theme_tab_background.png` (1x162)
- `theme_tab_background_inactive.png` (1x162)

### 步骤 3: 构建主题包

```bash
pnpm zip --theme neon-purple-dark
```

生成的 ZIP 文件位于 `dist/neon-purple-dark.zip`。

### 步骤 4: 测试主题

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `dist/packages/neon-purple-dark/` 目录

## 当前主题列表

### Dark 系列(深色主题)
| 主题 ID | 强调色 | 背景 |
|---------|--------|------|
| `neon-pink-dark` | RGB(255, 148, 184) 粉色 | 石墨黑 |
| `neon-cyan-dark` | RGB(84, 245, 255) 青色 | 石墨黑 |
| `neon-yellow-dark` | RGB(230, 255, 64) 荧光黄 | 石墨黑 |

### Light 系列(浅色主题)
| 主题 ID | 强调色 | 背景 |
|---------|--------|------|
| `neon-pink-light` | RGB(255, 148, 184) 粉色 | 暖白 RGB(250, 250, 249) |
| `neon-cyan-light` | RGB(0, 180, 216) 深青蓝 | 暖白 RGB(250, 250, 249) |
| `neon-yellow-light` | RGB(180, 210, 0) 橄榄绿黄 | 暖白 RGB(250, 250, 249) |

## 颜色配置说明

### 深色主题
- **背景色系**: 石墨黑 `RGB(32, 36, 42)` / 纯黑 `RGB(0, 0, 0)`
- **强调色**: 用于 `tab_text`、`bookmark_text`、`toolbar_button_icon`、`toolbar_text` 等
- **非活跃状态**: 使用降低饱和度的同色系

### 浅色主题
- **背景色系**: 暖白 `RGB(250, 250, 249)` / 浅灰 `RGB(234, 234, 234)`
- **强调色**: 同样用于图标和文字,但色值需要适当加深以保证在浅色背景上的可读性
- **正文文字**: 深灰蓝 `RGB(34, 40, 49)` 用于 `ntp_text`、`omnibox_text`、`toolbar_text`

## 技术细节

- 图片格式: PNG (RGBA, 8-bit)
- 生成库: [sharp](https://sharp.pixelplumbing.com/) (基于 libvips)
- 默认尺寸: 1x162 像素(可自定义)
- 颜色空间: sRGB

## 常见问题

**Q: 如何修改生成的图片尺寸?**

A: 编辑 `scripts/generate-theme-images.js` 中的 `images` 数组,修改 `width` 和 `height` 值。

**Q: 生成的图片在哪里?**

A: 位于 `themes/assets/{主题ID}/` 目录下。

**Q: 可以手动替换某些图片吗?**

A: 可以。手动替换后重新运行 `pnpm zip` 即可。如果再次运行 `generate-images`,手动修改会被覆盖。

**Q: 为什么是 1x162 像素?**

A: Chrome 主题使用可平铺的图片,1 像素宽的垂直条纹会被水平拉伸到整个宽度,162 像素高度覆盖工具栏区域。

**Q: 图标颜色是如何确定的?**

A: 图标颜色直接使用 `tab_text` 中配置的强调色。各主题的强调色已在 config.js 中针对其背景深浅分别配置了合适的色值,确保可见性。

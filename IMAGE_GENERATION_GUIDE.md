# 主题图片生成指南

## 快速开始

### 1. 为所有启用的主题生成图片

```bash
pnpm generate-images
```

### 2. 为指定主题生成图片

```bash
# 单个主题
pnpm generate-images --theme neon-pink

# 多个主题(逗号分隔)
pnpm generate-images --theme neon-pink,neon-cyan
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
pnpm zip --theme neon-pink
```

## 工作原理

脚本 `scripts/generate-theme-images.js` 会根据 `themes/config.js` 中的颜色配置自动生成以下图片:

| 图片文件 | 尺寸 | 用途 | 使用的颜色 |
|---------|------|------|-----------|
| `icon.png` | 128x128 | 主题图标 | `tab_text` 或 `bookmark_text` |
| `theme_frame.png` | 1x162 | 窗口框架(活跃) | `frame` |
| `theme_frame_inactive.png` | 1x162 | 窗口框架(非活跃) | `frame_inactive` |
| `theme_toolbar.png` | 1x162 | 工具栏背景 | `toolbar` |
| `theme_tab_background.png` | 1x162 | 标签页背景(活跃) | `tab_text` |
| `theme_tab_background_inactive.png` | 1x162 | 标签页背景(非活跃) | `tab_background_text_inactive` |

**重要**: 每个主题必须在 `themes/assets/{主题ID}/` 目录下拥有完整的 6 张图片。
构建脚本不再从 shared 目录 fallback,缺少任何图片都会导致构建失败。

## 新增主题流程

### 步骤 1: 在 config.js 中添加主题配置

编辑 `themes/config.js`,在 `themeVariants` 数组中添加新主题:

```javascript
{
  id: "neon-purple",
  enabled: true,
  zipName: "dark-neon-purple.zip",
  displayName: "Dark Neon Purple",
  description: "A dark theme with purple accents.",
  version: "1.0.0",
  assetDir: "neon-purple",
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
pnpm generate-images --theme neon-purple
```

这会在 `themes/assets/neon-purple/` 目录下生成所有必需的 6 张图片:
- `icon.png` (128x128)
- `theme_frame.png` (1x162)
- `theme_frame_inactive.png` (1x162)
- `theme_toolbar.png` (1x162)
- `theme_tab_background.png` (1x162)
- `theme_tab_background_inactive.png` (1x162)

### 步骤 3: 构建主题包

```bash
pnpm zip --theme neon-purple
```

生成的 ZIP 文件位于 `dist/dark-neon-purple.zip`。

### 步骤 4: 测试主题

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `dist/packages/neon-purple/` 目录

## 颜色配置说明

### 深色主题示例 (如 neon-pink)
从 midnight-pink 主题提取的颜色:
- **主强调色**: RGB(255, 148, 184) - 柔和粉色
- **非活跃状态**: RGB(207, 120, 149) - 暗粉色
- **背景色**: RGB(47, 54, 61) - 深灰蓝
- **框架色**: RGB(0, 0, 0) - 纯黑

### 浅色/白色主题示例
如果要创建白色主题,需要反转颜色逻辑:

```javascript
{
  id: "light-white",
  enabled: true,
  zipName: "light-white.zip",
  displayName: "Light White",
  description: "A clean white theme with dark text.",
  version: "1.0.0",
  assetDir: "light-white",
  colors: {
    toolbar: [255, 255, 255],        // 白色工具栏
    frame: [240, 240, 240],          // 浅灰框架
    ntp_background: [255, 255, 255], // 白色背景
    bookmark_text: [32, 36, 42],     // 深色文字
    tab_text: [32, 36, 42],          // 深色文字
    tab_background_text: [32, 36, 42],
    ntp_text: [32, 36, 42],
    frame_inactive: [240, 240, 240],
    background_tab: [245, 245, 245],
    background_tab_inactive: [245, 245, 245],
    omnibox_background: [250, 250, 250],
    omnibox_text: [32, 36, 42],
    tab_background_text_inactive: [128, 128, 128],
    ntp_link: [32, 36, 42],
    toolbar_button_icon: [32, 36, 42],
    toolbar_text: [32, 36, 42]
  }
}
```

**注意**: 
- 浅色主题的图标会自动使用深色(由脚本智能判断),确保在白色背景上可见
- 强调色(如 `tab_text`)应该是深色,以便与白色背景形成对比

## 技术细节

- 图片格式: PNG (RGBA, 8-bit)
- 压缩方式: Deflate
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

**Q: shared 目录还有什么用?**

A: shared 目录现在仅作为备份参考,构建脚本不再从该目录 fallback。每个主题必须在自己目录下拥有完整的图片资源。

**Q: 如何创建白色/浅色主题?**

A: 将背景色设置为浅色(如白色 [255, 255, 255]),文字颜色设置为深色(如深灰 [32, 36, 42])。脚本会自动检测并为图标使用深色,确保在白色背景上可见。参考文档中的"浅色/白色主题示例"部分。

**Q: 图标颜色是如何确定的?**

A: 脚本会智能判断:
- 深色主题: 图标使用强调色(如粉色、青色、黄色)
- 浅色主题: 如果强调色和背景都是浅色,图标自动使用深色文字颜色
- 这样可以确保图标在任何背景下都清晰可见

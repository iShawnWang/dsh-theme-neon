"use strict";

const { mkdirSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");
const sharp = require("sharp");

/**
 * 创建纯色 PNG 图片 (使用 sharp)
 * @param {number} width - 图片宽度(像素)
 * @param {number} height - 图片高度(像素)
 * @param {number[]} color - RGB 颜色数组 [r, g, b]
 * @returns {Promise<Buffer>} PNG 文件数据
 */
async function createPNG(width, height, color) {
  const [r, g, b] = color;
  
  return await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r, g, b, alpha: 1 }
    }
  })
    .png()
    .toBuffer();
}

/**
 * 为主题生成所有必需的图片
 * @param {string} themeId - 主题ID (如 "neon-pink")
 * @param {Object} colors - 颜色配置对象
 */
async function generateThemeImages(themeId, colors) {
  const rootDir = process.cwd();
  const assetsDir = join(rootDir, "themes", "assets", themeId);
  
  // 确保目录存在
  mkdirSync(assetsDir, { recursive: true });
  
  console.log(`\nGenerating images for theme: ${themeId}`);
  console.log(`Output directory: ${assetsDir}\n`);
  
  // 定义需要生成的图片及其对应的颜色
  const images = [
    {
      name: "icon.png",
      description: "主题图标 (128x128)",
      width: 128,
      height: 128,
      color: getIconColor(colors)
    },
    {
      name: "theme_frame.png",
      description: "窗口框架 (活跃状态)",
      width: 1,
      height: 162,
      color: colors.frame || [0, 0, 0]
    },
    {
      name: "theme_frame_inactive.png",
      description: "窗口框架 (非活跃状态)",
      width: 1,
      height: 162,
      color: colors.frame_inactive || colors.frame || [0, 0, 0]
    },
    {
      name: "theme_toolbar.png",
      description: "工具栏背景",
      width: 1,
      height: 162,
      color: colors.toolbar || [32, 36, 42]
    },
    {
      name: "theme_tab_background.png",
      description: "标签页背景 (活跃状态)",
      width: 1,
      height: 162,
      color: colors.frame || [0, 0, 0]
    },
    {
      name: "theme_tab_background_inactive.png",
      description: "标签页背景 (非活跃状态)",
      width: 1,
      height: 162,
      color: colors.frame_inactive || colors.frame || [0, 0, 0]
    }
  ];
  
  // 生成每张图片
  for (const image of images) {
    const pngData = await createPNG(image.width, image.height, image.color);
    const outputPath = join(assetsDir, image.name);
    
    writeFileSync(outputPath, pngData);
    
    const colorStr = `RGB(${image.color.join(", ")})`;
    console.log(`✓ ${image.name.padEnd(40)} ${colorStr.padEnd(20)} (${image.description})`);
  }
  
  console.log(`\n✅ Generated ${images.length} images for ${themeId} theme\n`);
}

/**
 * 获取图标颜色
 * 直接使用强调色 (tab_text) 作为图标颜色。
 * 各主题的强调色已在 config.js 中针对深浅背景分别配置好合适的色值。
 * @param {Object} colors - 颜色配置对象
 * @returns {number[]} RGB 颜色数组
 */
function getIconColor(colors) {
  return colors.tab_text || colors.bookmark_text || [255, 255, 255];
}

/**
 * 解析命令行参数
 */
function parseArgs(argv) {
  const requestedThemes = [];
  let listOnly = false;
  
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    
    if (arg === "--list") {
      listOnly = true;
      continue;
    }
    
    if (arg === "--theme") {
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) {
        throw new Error("Expected a theme id after --theme.");
      }
      requestedThemes.push(...value.split(",").map(t => t.trim()).filter(Boolean));
      i++;
      continue;
    }
    
    if (arg.startsWith("--theme=")) {
      requestedThemes.push(...arg.slice("--theme=".length).split(",").map(t => t.trim()).filter(Boolean));
      continue;
    }
    
    throw new Error(`Unknown argument: ${arg}`);
  }
  
  return { listOnly, requestedThemes };
}

async function main() {
  const { themeVariants } = require("../themes/config.js");
  const { listOnly, requestedThemes } = parseArgs(process.argv.slice(2));
  
  if (listOnly) {
    console.log("\nAvailable themes:");
    for (const theme of themeVariants) {
      const status = theme.enabled ? "enabled" : "disabled";
      console.log(`- ${theme.id}\t${status}\t${theme.displayName}`);
    }
    console.log();
    return;
  }
  
  // 如果没有指定主题,生成所有启用的主题
  const themesToGenerate = requestedThemes.length > 0
    ? themeVariants.filter(t => requestedThemes.includes(t.id) && t.enabled)
    : themeVariants.filter(t => t.enabled);
  
  if (themesToGenerate.length === 0) {
    throw new Error("No themes to generate. Check theme IDs or enable status.");
  }
  
  for (const theme of themesToGenerate) {
    await generateThemeImages(theme.assetDir, theme.colors);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\n❌ Error: ${message}\n`);
  process.exitCode = 1;
});

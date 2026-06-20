"use strict";

const { mkdirSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");
const zlib = require("node:zlib");

/**
 * 创建纯色 PNG 图片
 * @param {number} width - 图片宽度(像素)
 * @param {number} height - 图片高度(像素)
 * @param {number[]} color - RGB 颜色数组 [r, g, b]
 * @returns {Buffer} PNG 文件数据
 */
function createPNG(width, height, color) {
  const [r, g, b] = color;
  
  // PNG 签名
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk (图片头信息)
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;   // bit depth
  ihdrData[9] = 6;   // color type (RGBA)
  ihdrData[10] = 0;  // compression
  ihdrData[11] = 0;  // filter
  ihdrData[12] = 0;  // interlace
  
  const ihdrCrc = crc32(Buffer.concat([Buffer.from("IHDR"), ihdrData]));
  const ihdr = Buffer.concat([
    Buffer.from([0, 0, 0, 13]),
    Buffer.from("IHDR"),
    ihdrData,
    Buffer.alloc(4)
  ]);
  ihdr.writeUInt32BE(ihdrCrc, 17);
  
  // IDAT chunk (图像数据)
  const rawData = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    rawData[y * (width * 4 + 1)] = 0; // filter byte
    for (let x = 0; x < width; x++) {
      const offset = y * (width * 4 + 1) + 1 + x * 4;
      rawData[offset] = r;         // R
      rawData[offset + 1] = g;     // G
      rawData[offset + 2] = b;     // B
      rawData[offset + 3] = 255;   // A (完全不透明)
    }
  }
  
  const compressed = zlib.deflateSync(rawData);
  const idatCrc = crc32(Buffer.concat([Buffer.from("IDAT"), compressed]));
  const idat = Buffer.concat([
    Buffer.alloc(4),
    Buffer.from("IDAT"),
    compressed,
    Buffer.alloc(4)
  ]);
  idat.writeUInt32BE(compressed.length, 0);
  idat.writeUInt32BE(idatCrc, idat.length - 4);
  
  // IEND chunk (图片结束)
  const iendCrc = crc32(Buffer.from("IEND"));
  const iend = Buffer.concat([
    Buffer.from([0, 0, 0, 0]),
    Buffer.from("IEND"),
    Buffer.alloc(4)
  ]);
  iend.writeUInt32BE(iendCrc, 8);
  
  return Buffer.concat([signature, ihdr, idat, iend]);
}

/**
 * 计算 CRC32 校验码
 * @param {Buffer} data - 输入数据
 * @returns {number} CRC32 值
 */
function crc32(data) {
  let crc = 0xFFFFFFFF;
  const table = new Uint32Array(256);
  
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

/**
 * 为主题生成所有必需的图片
 * @param {string} themeId - 主题ID (如 "neon-pink")
 * @param {Object} colors - 颜色配置对象
 */
function generateThemeImages(themeId, colors) {
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
      color: colors.tab_text || [255, 255, 255]
    },
    {
      name: "theme_tab_background_inactive.png",
      description: "标签页背景 (非活跃状态)",
      width: 1,
      height: 162,
      color: colors.tab_background_text_inactive || colors.tab_background_text || [128, 128, 128]
    }
  ];
  
  // 生成每张图片
  for (const image of images) {
    const pngData = createPNG(image.width, image.height, image.color);
    const outputPath = join(assetsDir, image.name);
    
    writeFileSync(outputPath, pngData);
    
    const colorStr = `RGB(${image.color.join(", ")})`;
    console.log(`✓ ${image.name.padEnd(40)} ${colorStr.padEnd(20)} (${image.description})`);
  }
  
  console.log(`\n✅ Generated ${images.length} images for ${themeId} theme\n`);
}

/**
 * 智能选择图标颜色
 * 对于深色主题: 使用强调色(通常是 tab_text)
 * 对于浅色主题: 使用深色强调色或主文字颜色
 * @param {Object} colors - 颜色配置对象
 * @returns {number[]} RGB 颜色数组
 */
function getIconColor(colors) {
  // 优先使用 tab_text 或 bookmark_text(强调色)
  const accentColor = colors.tab_text || colors.bookmark_text;
  
  if (accentColor) {
    // 如果强调色是浅色(亮度 > 200),且背景也是浅色,则使用深色
    const brightness = calculateBrightness(accentColor);
    const backgroundBrightness = calculateBrightness(colors.toolbar || colors.ntp_background || [255, 255, 255]);
    
    // 如果强调色和背景都是浅色,使用深色作为图标
    if (brightness > 200 && backgroundBrightness > 200) {
      return colors.tab_background_text || colors.ntp_text || [32, 36, 42];
    }
    
    return accentColor;
  }
  
  // fallback: 使用白色
  return [255, 255, 255];
}

/**
 * 计算颜色的亮度 (0-255)
 * @param {number[]} rgb - RGB 颜色数组
 * @returns {number} 亮度值
 */
function calculateBrightness(rgb) {
  const [r, g, b] = rgb;
  return (r * 299 + g * 587 + b * 114) / 1000;
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

function main() {
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
    generateThemeImages(theme.assetDir, theme.colors);
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\n❌ Error: ${message}\n`);
  process.exitCode = 1;
}

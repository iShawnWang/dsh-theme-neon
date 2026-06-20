"use strict";

const themeImageNames = [
  "icon.png",
  "theme_frame.png",
  "theme_frame_inactive.png",
  "theme_tab_background.png",
  "theme_tab_background_inactive.png",
  "theme_toolbar.png"
];

const neonYellowColors = {
  toolbar: [32, 36, 42],
  frame: [0, 0, 0],
  ntp_background: [32, 36, 42],
  bookmark_text: [230, 255, 64],
  tab_text: [230, 255, 64],
  tab_background_text: [230, 255, 64],
  ntp_text: [230, 255, 64],
  frame_inactive: [0, 0, 0],
  background_tab: [49, 55, 64],
  background_tab_inactive: [49, 55, 64],
  omnibox_background: [24, 27, 31],
  omnibox_text: [230, 255, 64],
  tab_background_text_inactive: [166, 184, 58],
  ntp_link: [230, 255, 64],
  toolbar_button_icon: [230, 255, 64],
  toolbar_text: [230, 255, 64]
};

const neonYellowLocales = {
  de: {
    description:
      "Ein dunkles Chrome-Theme in Graphitschwarz mit saeuren neon-gelben Akzenten und der Energie von Warnlichtern eines Raumschiffs."
  },
  es: {
    description:
      "Un tema de Chrome en grafito oscuro con acentos amarillo neon acido y energia de luces de advertencia de una nave estelar."
  },
  fr: {
    description:
      "Un theme Chrome graphite sombre avec des accents jaune neon acide et l'energie de voyants d'alerte de vaisseau spatial."
  },
  ja: {
    description:
      "黒に近いグラファイトを基調に、アシッドなネオンイエローのアクセントと宇宙船の警告灯のような空気感を加えたChromeテーマです。"
  },
  ko: {
    description:
      "짙은 그래파이트 블랙 바탕에 애시드 네온 옐로 포인트와 우주선 경고등 같은 분위기를 더한 Chrome 테마입니다."
  },
  zh_CN: {
    description:
      "一款以深石墨黑为基底、酸性霓虹黄为点缀，并带有星舰警示灯氛围的 Chrome 主题。"
  },
  zh_TW: {
    description:
      "一款以深石墨黑為基底、酸性霓虹黃為點綴，並帶有星艦警示燈氛圍的 Chrome 主題。"
  }
};

const themeVariants = [
  {
    id: "neon-yellow",
    enabled: true,
    zipName: "dark-neon-yellow.zip",
    displayName: "Dark Neon Yellow",
    description: "A dark graphite Chrome theme with acid neon yellow accents and starship warning-light energy.",
    version: "1.0.0",
    assetDir: "neon-yellow",
    locales: neonYellowLocales,
    colors: neonYellowColors
  },
  {
    id: "neon-cyan",
    enabled: true,
    zipName: "dark-neon-cyan.zip",
    displayName: "Dark Neon Cyan",
    description: "A dark graphite Chrome theme with neon cyan accents and a cold starship console atmosphere.",
    version: "1.0.0",
    assetDir: "neon-cyan",
    colors: {
      ...neonYellowColors,
      bookmark_text: [84, 245, 255],
      tab_text: [84, 245, 255],
      tab_background_text: [84, 245, 255],
      ntp_text: [84, 245, 255],
      omnibox_text: [84, 245, 255],
      tab_background_text_inactive: [65, 170, 178],
      ntp_link: [84, 245, 255],
      toolbar_button_icon: [84, 245, 255],
      toolbar_text: [84, 245, 255]
    }
  },
  {
    id: "neon-pink",
    enabled: true,
    zipName: "dark-neon-pink.zip",
    displayName: "Dark Neon Pink",
    description: "A dark graphite Chrome theme with vibrant neon pink accents and electric cyberpunk energy.",
    version: "1.0.0",
    assetDir: "neon-pink",
    colors: {
      ...neonYellowColors,
      bookmark_text: [255, 148, 184],
      tab_text: [255, 148, 184],
      tab_background_text: [255, 148, 184],
      ntp_text: [255, 148, 184],
      omnibox_text: [255, 148, 184],
      tab_background_text_inactive: [207, 120, 149],
      ntp_link: [255, 148, 184],
      toolbar_button_icon: [255, 148, 184],
      toolbar_text: [255, 148, 184]
    }
  },
  {
    id: "light-white",
    enabled: false,
    zipName: "light-white.zip",
    displayName: "Light White",
    description: "A clean white theme with dark text for a minimalist look.",
    version: "1.0.0",
    assetDir: "light-white",
    colors: {
      toolbar: [255, 255, 255],
      frame: [240, 240, 240],
      ntp_background: [255, 255, 255],
      bookmark_text: [32, 36, 42],
      tab_text: [32, 36, 42],
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
];

module.exports = {
  themeImageNames,
  themeVariants
};

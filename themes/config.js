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

const neonYellowDarkLocales = {
  de: { description: "Ein neon-dunkles Thema mit saeuren gelben Akzenten." },
  es: { description: "Un tema neon oscuro con acentos amarillo acido." },
  fr: { description: "Un theme neon sombre avec des accents jaune acide." },
  ja: { description: "アシッドなイエローアクセントのネオンダークテーマ。" },
  ko: { description: "애시드 옐로 포인트의 네온 다크 테마." },
  zh_CN: { description: "一款以酸性霓虹黄为点缀的深色主题。" },
  zh_TW: { description: "一款以酸性霓虹黃為點綴的深色主題。" }
};

const neonPinkDarkLocales = {
  de: { description: "Ein neon-dunkles Thema mit elektrischen pinken Akzenten." },
  es: { description: "Un tema neon oscuro con acentos rosa electrico." },
  fr: { description: "Un theme neon sombre avec des accents rose electrique." },
  ja: { description: "エレクトリックなピンクアクセントのネオンダークテーマ。" },
  ko: { description: "일렉트릭 핑크 포인트의 네온 다크 테마." },
  zh_CN: { description: "一款以电气霓虹粉为点缀的深色主题。" },
  zh_TW: { description: "一款以電氣霓虹粉為點綴的深色主題。" }
};

const neonCyanDarkLocales = {
  de: { description: "Ein neon-dunkles Thema mit eisigen cyanfarbenen Akzenten." },
  es: { description: "Un tema neon oscuro con acentos cian glacial." },
  fr: { description: "Un theme neon sombre avec des accents cyan glacial." },
  ja: { description: "氷河のようなシアンアクセントのネオンダークテーマ。" },
  ko: { description: "글레이셜 시안 포인트의 네온 다크 테마." },
  zh_CN: { description: "一款以冰川霓虹青为点缀的深色主题。" },
  zh_TW: { description: "一款以冰川霓虹青為點綴的深色主題。" }
};

const neonPinkLightLocales = {
  de: { description: "Ein neon-helles Thema mit sanften pinken Akzenten." },
  es: { description: "Un tema neon claro con acentos rosa suaves." },
  fr: { description: "Un theme neon clair avec des accents rose doux." },
  ja: { description: "柔らかなピンクアクセントのネオンライトテーマ。" },
  ko: { description: "부드러운 핑크 포인트의 네온 라이트 테마." },
  zh_CN: { description: "一款以柔和霓虹粉为点缀的浅色主题。" },
  zh_TW: { description: "一款以柔和霓虹粉為點綴的淺色主題。" }
};

const neonCyanLightLocales = {
  de: { description: "Ein neon-helles Thema mit klaren cyanfarbenen Akzenten." },
  es: { description: "Un tema neon claro con acentos cian nitidos." },
  fr: { description: "Un theme neon clair avec des accents cyan vifs." },
  ja: { description: "爽やかなシアンアクセントのネオンライトテーマ。" },
  ko: { description: "산뜻한 시안 포인트의 네온 라이트 테마." },
  zh_CN: { description: "一款以清爽霓虹青为点缀的浅色主题。" },
  zh_TW: { description: "一款以清爽霓虹青為點綴的淺色主題。" }
};

const neonYellowLightLocales = {
  de: { description: "Ein neon-helles Thema mit leuchtenden gelben Akzenten." },
  es: { description: "Un tema neon claro con acentos amarillo vividos." },
  fr: { description: "Un theme neon clair avec des accents jaune vifs." },
  ja: { description: "鮮やかなイエローアクセントのネオンライトテーマ。" },
  ko: { description: "선명한 옐로 포인트의 네온 라이트 테마." },
  zh_CN: { description: "一款以明亮霓虹黄为点缀的浅色主题。" },
  zh_TW: { description: "一款以明亮霓虹黃為點綴的淺色主題。" }
};

const themeVariants = [
  // ==================== Dark 系列 (深色主题) ====================
  {
    id: "neon-pink-dark",
    enabled: true,
    zipName: "neon-pink-dark.zip",
    displayName: "Neon Pink Dark",
    description: "A neon dark theme with electric pink accents.",
    version: "1.0.0",
    assetDir: "neon-pink-dark",
    locales: neonPinkDarkLocales,
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
    id: "neon-cyan-dark",
    enabled: true,
    zipName: "neon-cyan-dark.zip",
    displayName: "Neon Cyan Dark",
    description: "A neon dark theme with glacial cyan accents.",
    version: "1.0.0",
    assetDir: "neon-cyan-dark",
    locales: neonCyanDarkLocales,
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
    id: "neon-yellow-dark",
    enabled: true,
    zipName: "neon-yellow-dark.zip",
    displayName: "Neon Yellow Dark",
    description: "A neon dark theme with acid yellow accents.",
    version: "1.0.0",
    assetDir: "neon-yellow-dark",
    locales: neonYellowDarkLocales,
    colors: neonYellowColors
  },
  
  // ==================== Light 系列 (浅色主题) ====================
  {
    id: "neon-pink-light",
    enabled: true,
    zipName: "neon-pink-light.zip",
    displayName: "Neon Pink Light",
    description: "A neon light theme with soft pink accents.",
    version: "1.0.0",
    assetDir: "neon-pink-light",
    locales: neonPinkLightLocales,
    colors: {
      toolbar: [250, 250, 249],
      frame: [234, 234, 234],
      ntp_background: [250, 250, 249],
      bookmark_text: [255, 148, 184],
      tab_text: [255, 148, 184],
      tab_background_text: [255, 148, 184],
      ntp_text: [34, 40, 49],
      frame_inactive: [234, 234, 234],
      background_tab: [234, 234, 234],
      background_tab_inactive: [234, 234, 234],
      omnibox_background: [234, 234, 234],
      omnibox_text: [34, 40, 49],
      tab_background_text_inactive: [207, 120, 149],
      ntp_link: [255, 148, 184],
      toolbar_button_icon: [255, 148, 184],
      toolbar_text: [34, 40, 49]
    }
  },
  {
    id: "neon-cyan-light",
    enabled: true,
    zipName: "neon-cyan-light.zip",
    displayName: "Neon Cyan Light",
    description: "A neon light theme with crisp cyan accents.",
    version: "1.0.0",
    assetDir: "neon-cyan-light",
    locales: neonCyanLightLocales,
    colors: {
      toolbar: [250, 250, 249],
      frame: [234, 234, 234],
      ntp_background: [250, 250, 249],
      bookmark_text: [0, 180, 216],
      tab_text: [0, 180, 216],
      tab_background_text: [0, 180, 216],
      ntp_text: [34, 40, 49],
      frame_inactive: [234, 234, 234],
      background_tab: [234, 234, 234],
      background_tab_inactive: [234, 234, 234],
      omnibox_background: [234, 234, 234],
      omnibox_text: [34, 40, 49],
      tab_background_text_inactive: [0, 140, 170],
      ntp_link: [0, 180, 216],
      toolbar_button_icon: [0, 180, 216],
      toolbar_text: [34, 40, 49]
    }
  },
  {
    id: "neon-yellow-light",
    enabled: true,
    zipName: "neon-yellow-light.zip",
    displayName: "Neon Yellow Light",
    description: "A neon light theme with vivid yellow accents.",
    version: "1.0.0",
    assetDir: "neon-yellow-light",
    locales: neonYellowLightLocales,
    colors: {
      toolbar: [250, 250, 249],
      frame: [234, 234, 234],
      ntp_background: [250, 250, 249],
      bookmark_text: [180, 210, 0],
      tab_text: [180, 210, 0],
      tab_background_text: [180, 210, 0],
      ntp_text: [34, 40, 49],
      frame_inactive: [234, 234, 234],
      background_tab: [234, 234, 234],
      background_tab_inactive: [234, 234, 234],
      omnibox_background: [234, 234, 234],
      omnibox_text: [34, 40, 49],
      tab_background_text_inactive: [140, 165, 0],
      ntp_link: [180, 210, 0],
      toolbar_button_icon: [180, 210, 0],
      toolbar_text: [34, 40, 49]
    }
  }
];

module.exports = {
  themeImageNames,
  themeVariants
};

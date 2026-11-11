# AGENT.md

这个分支只维护 DSH（DeepSeek Harness）主题，不再包含 Chrome 主题的源码或打包脚本。

## 真相源

- `themes/*.json`：每套 DSH 自定义主题的种子文档，id 与文件名一致。
- `scripts/install.mjs`：校验并安装到运行中的 DSH Web GUI，同时导出 `dist/<id>.zip`。

## 规则

- 改配色时只改 `themes/*.json`，不要加壁纸、CSS 或图片资源（保持「只切换」的轻量形态）。
- 保持每套主题的深色外观：neutral 的 `dark.darkest` 为近黑，`dark.lightest` 为浅色文字；
  边框 alpha 保持在 6–10 之间，避免硬边。
- 语义色 `green` / `amber` / `red` 要跟强调色同一色温，别引入第四种主色。
- 提交前跑 `npm run themes:validate`。
- 安装用 `npm run themes:install -- --url <DSH Web GUI 地址>`；地址每次会话可能不同。

## 不再包含

- `themes/config.js`、`themes/assets/`、`themes/locales/`
- `scripts/build-theme-packages.js`、`scripts/generate-theme-images.js`
- `market/`、`icon*.png`、`raw.png`、`pnpm-lock.yaml`

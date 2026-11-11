# AGENT.md

这个仓库只维护一个 DSH（DeepSeek Harness）插件，不包含 Chrome 主题的源码或打包脚本，也不依赖 `dsh-cool-theme`。

## 真相源

- `themes/*.json`：三套配色的种子文档，id 与文件名一致。
- `scripts/build-client.mjs`：把种子展开成 CSS 变量，内联生成 `lib/client.js`。
- `lib/client.template.js`：客户端插件源码；`lib/client.js` 是生成物，提交进仓库。
- `cordis.patch.yml` + `package.json` 的 `dsh` 字段：声明这是一个 profile bundle。

## 规则

- 改配色时只改 `themes/*.json`，然后跑 `npm run build`；不要手改 `lib/client.js`。
- 不加壁纸、图片资源、导入导出或主题面板——形态就是「外观」旁边的一行、三个色块。
- 深色外观的 `neutral.dark.darkest` 保持 `#0A0B0D`（近黑冷底，别改回纯黑）；边框 alpha 保持 6–10。
- 语义色 `green` / `amber` / `red` 要跟强调色同一色温，别引入第四种主色。
- 提交前跑 `npm run check` 和 `node --check lib/client.js`。
- 插件只改 token，不拦截 DSH 的「外观」开关：浅色/深色由 shell 的 `data-ds-dark-theme` 决定。

## 不再包含

- `themes/config.js`、`themes/assets/`、`themes/locales/`
- `scripts/build-theme-packages.js`、`scripts/generate-theme-images.js`
- `market/`、`icon*.png`、`raw.png`、`pnpm-lock.yaml`
- 针对 `dsh-cool-theme` 的安装脚本（`scripts/install.mjs`）和 `<id>.zip`

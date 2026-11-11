# Neon DSH Themes

把仓库原来的三个深色 Chrome 主题（青 / 粉 / 黄）改造成三套 **DeepSeek Harness (DSH) 主题**，
通过 `dsh-cool-theme` 的自定义主题机制装进 DSH，在 `设置 → 主题` 里直接切换。

只做配色：neutral 色阶 + 强调色 + 语义色 + 边框 + 代码高亮，没有壁纸，也没有自定义 CSS。

## 三套主题

| ID | 名称 | 强调色（深色） | 浅色强调 | 说明 |
| --- | --- | --- | --- | --- |
| `neon-cyan` | Neon Cyan | `#54F5FF` | `#007A87` | 冰川霓虹青，冷调枪灰底 |
| `neon-pink` | Neon Pink | `#FF94B8` | `#B03A64` | 电气霓虹粉 |
| `neon-yellow` | Neon Yellow | `#E6FF40` | `#6E7C00` | 酸性荧光黄 |

共同基底：深色外观下 neutral 色阶从 `#F2F5F7` 收到 `#000000`，边框带一点主题色（alpha 7），
代码高亮用「强调色 + 另外两色 + 语义绿/琥珀」的三色关系，保持「失落星船驾驶舱」的冷黑底 + 霓虹点缀。

## 安装 / 更新

先确认 DSH Web GUI 正在运行（当前地址可在 DSH 的运行时信息里看到，例如 `http://127.0.0.1:51658`）：

```sh
npm run themes:install -- --url http://127.0.0.1:51658
```

脚本会：

1. 校验 `themes/*.json`；
2. `POST /cool-theme/api/themes` 写入（按 id upsert，重复运行即更新）；
3. 把每套主题导出成 `dist/<id>.zip`，方便分享或在主题面板里导入。

只校验、不发请求：

```sh
npm run themes:validate
```

安装完在 **设置 → 主题 → 自定义主题** 中可以看到 `Neon Cyan` / `Neon Pink` / `Neon Yellow`
三张卡片，点选即可切换。面板若没刷新，关掉设置重新打开。

## 结构

```text
themes/
  neon-cyan.json      # DSH 自定义主题种子文档（真相源）
  neon-pink.json
  neon-yellow.json
scripts/
  install.mjs         # 校验 + 安装 + 导出 zip
dist/                 # 安装时生成的 zip（git 忽略）
```

每个 JSON 就是 `dsh-cool-theme` 的主题种子：

```jsonc
{
  "id": "neon-cyan",
  "name": "Neon Cyan",
  "base": "dsh",              // 缺失字段的回退预设
  "theme": {
    "neutral": { "light": {...}, "dark": { "lightest": "#F2F5F7", "darkest": "#000000" } },
    "accent": { "light": "...", "dark": "..." },
    "green": { ... }, "amber": { ... }, "red": { ... },
    "border": { "light": { "color": "...", "alpha": 6 }, "dark": { "color": "...", "alpha": 7 } },
    "shiki": { "constant": {...}, ... }
  }
}
```

客户端会用 `lightest → darkest` 线性生成 neutral 色阶，再从 accent/green/amber/red 的 500 值展开语义色阶，
边框由一个颜色 + alpha 推导，代码高亮直接使用。改色只需要改这些种子。

## 与 Chrome 版本的关系

原来的 Chrome 主题（`themes/config.js`、`market/`、`pnpm zip` 打包流程）保留在 `main` 分支；
本分支只保留 DSH 主题。

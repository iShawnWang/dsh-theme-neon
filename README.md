# Dark Neon Themes

这个仓库维护多个独立的 Chrome 主题变体，并由 `themes/config.ts` 统一驱动打包。
仓库根目录不再是可直接加载的单主题包，实际可加载产物由打包流程生成。

## 主题源码结构

- `themes/config.ts`：主题配置真相源，定义主题 id、名称、版本、描述与颜色
- `themes/assets/shared/`：所有主题共享的默认图片资源
- `themes/assets/<variant>/`：单个主题的覆盖图片资源
- `themes/locales/`：带占位符的 locale 模板
- `scripts/build-theme-packages.js`：多主题打包入口
- `dist/packages/<variant>/`：每个主题独立的可加载未打包目录

## 安装主题

1. 打开 `chrome://extensions`
2. 开启 `Developer mode`
3. 点击 `Load unpacked`
4. 先运行 `pnpm zip -- --theme <id>`
5. 选择 `dist/packages/<id>/`

## 多主题打包流程

运行以下命令：

```sh
pnpm zip
pnpm zip -- --theme neon-yellow
pnpm zip -- --theme neon-cyan
pnpm zip -- --list
```

命令说明：

- `pnpm zip`：打包所有启用的主题
- `pnpm zip -- --theme <id>`：只打包指定主题，便于新增主题时单独验证
- `pnpm zip -- --list`：列出当前可用主题与产物文件名

## 输出位置

构建结果会输出到 `dist/`：

```text
dist/
  dark-neon-yellow.zip
  dark-neon-cyan.zip
  packages/
    neon-yellow/
    neon-cyan/
```

其中 `dist/packages/<id>/` 是可直接通过 `Load unpacked` 加载的目录，每个主题最终也会在 `dist/` 根目录生成自己的 zip 包，例如：

```text
dist/dark-neon-yellow.zip
dist/dark-neon-cyan.zip
```

## 新增主题流程

1. 在 `themes/config.ts` 中新增一个主题配置
2. 按需在 `themes/assets/<variant>/` 中添加覆盖图片
3. 运行 `pnpm zip -- --theme <id>` 验证单主题产物
4. 再运行 `pnpm zip` 验证全量打包流程

## 类型检查

运行以下命令：

```sh
pnpm exec tsc --noEmit
```

# md2pdf

强大的**离线 Markdown 转 PDF** 工具。纯浏览器端编辑器 + 实时预览,通过浏览器打印导出 PDF——服务器永远不会接触你的文档。

[English](./README.md) | [繁體中文(Traditional Chinese)](./README_tc.md)

## 使用方法

1. 点击 **Choose**(或把 `.md` 文件拖到窗口任意位置)加载文档。
2. 在左侧编辑器中修改——右侧预览实时更新。
3. 点击 **Export → Print / Save as PDF**。
4. 在打印对话框中将**目标打印机**切换为 _Save as PDF_(另存为 PDF)。推荐使用 Chrome。

草稿会自动保存到 localStorage,刷新页面不会丢失内容。**Reset** 可恢复功能演示样例文档。

## 支持的 Markdown 语法

| 功能      | 语法                                                                                | 说明                              |
| --------- | ----------------------------------------------------------------------------------- | --------------------------------- |
| GFM       | 表格、`- [x]` 任务、`~~删除线~~`、自动链接、`[^脚注]`                               | 完整的 GitHub 风格基础语法        |
| 提示框    | `> [!NOTE]` `[!TIP]` `[!IMPORTANT]` `[!WARNING]` `[!CAUTION]`                       | 与 github.com 渲染一致            |
| 数学公式  | `$...$`、`$$...$$`                                                                  | KaTeX                             |
| 图表      | ` ```mermaid `                                                                      | 流程图、时序图、甘特图等,按需加载 |
| 高亮      | `==高亮==`                                                                          | `<mark>`                          |
| 上下标    | `H~2~O`、`x^2^`                                                                     | Pandoc 规则——标记内不能有空格     |
| 表情      | `:rocket:`                                                                          | GitHub 短代码                     |
| 定义列表  | `术语` + `: 定义`                                                                   | PHP Markdown Extra 风格           |
| 智能标点  | `"引号"`、`--`、`...`                                                               | 排版级破折号/引号                 |
| 前言块    | `---\ntitle: …\n---`                                                                | `title` 会成为 PDF 文件名         |
| 容器指令  | `:::note`、`:::tip`、`:::warning`、`:::caution`、`:::important`、`:::details[标题]` | Docusaurus 风格指令               |
| 目录      | 单独一行写 `[TOC]`                                                                  | 自动生成 H1–H3 链接目录           |
| 分页符    | 单独一行 `\newpage` 或 `\pagebreak`,或 `:::pagebreak`                               | 在新的一页开始                    |
| 原生 HTML | `<span style="color:red">…`                                                         | 始终启用——本应用完全本地运行      |

在编辑器中粘贴或拖入图片会嵌入为 base64 data URI,导出的 PDF/HTML 完全自包含。

## 导出

- **Print / Save as PDF**——文档标题(前言块 `title` 或第一个 `#` 标题)会成为建议文件名。
- **Download .md / .html**——下载源文件或独立的 HTML 快照。
- **Page setup**——纸张大小(A4/Letter/Legal)、方向、页边距预设。
- **高级分页**——启用 paged.js 模式可获得真实的页码(`当前页 / 总页数`)和每页页眉。

## 编辑器

- CodeMirror 6,支持 Markdown(GFM)语法高亮。
- 拖动中间的分隔条调整宽度;**Sync scroll** 可同步滚动两侧。
- 状态栏显示:字数、字符数、行数、光标位置。

## 离线 / PWA

本应用是渐进式 Web 应用:首次访问后即可完全离线使用,并可安装到桌面(通过 vite-plugin-pwa 的 Service Worker)。

## 使用 Docker

1. 安装 Docker。
2. 克隆仓库并 `cd` 进入目录。
3. 运行 `docker compose up -d`。

compose 文件默认绑定到 `localhost:8080`(nginx 托管静态 `dist/` 构建产物)。修改 `docker-compose.yaml` 中的 `ports` 可更换端口。

## 开发

需要 Node.js ≥ 20.19 和 pnpm(通过 `corepack enable` 启用)。

```bash
pnpm install        # 安装依赖
pnpm dev            # 开发服务器
pnpm build          # 生产构建 → dist/
pnpm preview        # 预览生产构建
pnpm test           # vitest 测试
pnpm lint           # eslint
pnpm typecheck      # tsc --noEmit
```

技术栈:Vite 8、React 19、TypeScript、react-markdown(unified/remark/rehype)、CodeMirror 6、SCSS modules、vite-plugin-pwa。

## 提示

- 在打印对话框中关闭**页眉和页脚**可获得更干净的 PDF。
- 超宽图表和公式在屏幕上可滚动,打印时会正确分页。

LICENSE MIT © 2019 realdennis, © 2026 overklassniy

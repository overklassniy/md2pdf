# md2pdf

強大的**離線 Markdown 轉 PDF** 工具。純瀏覽器端編輯器 + 即時預覽,透過瀏覽器列印輸出 PDF——伺服器永遠不會接觸你的文件。

[English](./README.md) | [简体中文(Simplified Chinese)](./README_cn.md)

## 使用方法

1. 點擊 **Choose**(或將 `.md` 檔案拖曳到視窗任意位置)載入文件。
2. 在左側編輯器中修改——右側預覽即時更新。
3. 點擊 **Export → Print / Save as PDF**。
4. 在列印對話框中將**目的地**切換為 _Save as PDF_(另存為 PDF)。建議使用 Chrome。

草稿會自動儲存到 localStorage,重新整理頁面不會遺失內容。**Reset** 可還原功能展示範例文件。

## 支援的 Markdown 語法

| 功能      | 語法                                                                                | 說明                              |
| --------- | ----------------------------------------------------------------------------------- | --------------------------------- |
| GFM       | 表格、`- [x]` 任務、`~~刪除線~~`、自動連結、`[^註腳]`                               | 完整的 GitHub 風格基礎語法        |
| 提示框    | `> [!NOTE]` `[!TIP]` `[!IMPORTANT]` `[!WARNING]` `[!CAUTION]`                       | 與 github.com 渲染一致            |
| 數學公式  | `$...$`、`$$...$$`                                                                  | KaTeX                             |
| 圖表      | ` ```mermaid `                                                                      | 流程圖、時序圖、甘特圖等,按需載入 |
| 高亮      | `==高亮==`                                                                          | `<mark>`                          |
| 上下標    | `H~2~O`、`x^2^`                                                                     | Pandoc 規則——標記內不能有空白     |
| 表情      | `:rocket:`                                                                          | GitHub 短代碼                     |
| 定義列表  | `術語` + `: 定義`                                                                   | PHP Markdown Extra 風格           |
| 智慧標點  | `"引號"`、`--`、`...`                                                               | 排版級破折號/引號                 |
| 前言區塊  | `---\ntitle: …\n---`                                                                | `title` 會成為 PDF 檔名           |
| 容器指令  | `:::note`、`:::tip`、`:::warning`、`:::caution`、`:::important`、`:::details[標題]` | Docusaurus 風格指令               |
| 目錄      | 單獨一行寫 `[TOC]`                                                                  | 自動產生 H1–H3 連結目錄           |
| 分頁符    | 單獨一行 `\newpage` 或 `\pagebreak`,或 `:::pagebreak`                               | 在新的一頁開始                    |
| 原生 HTML | `<span style="color:red">…`                                                         | 永遠啟用——本應用完全本機執行      |

在編輯器中貼上或拖入圖片會嵌入為 base64 data URI,輸出的 PDF/HTML 完全自包含。

## 匯出

- **Print / Save as PDF**——文件標題(前言區塊 `title` 或第一個 `#` 標題)會成為建議檔名。
- **Download .md / .html**——下載原始檔或獨立的 HTML 快照。
- **Page setup**——紙張大小(A4/Letter/Legal)、方向、邊界預設。
- **進階分頁**——啟用 paged.js 模式可獲得真正的頁碼(`目前頁 / 總頁數`)與每頁頁眉。

## 編輯器

- CodeMirror 6,支援 Markdown(GFM)語法高亮。
- 拖曳中間的分隔條調整寬度;**Sync scroll** 可同步捲動兩側。
- 狀態列顯示:字數、字元數、行數、游標位置。

## 離線 / PWA

本應用是漸進式網頁應用:首次造訪後即可完全離線使用,並可安裝到桌面(透過 vite-plugin-pwa 的 Service Worker)。

## 使用 Docker

1. 安裝 Docker。
2. 複製儲存庫並 `cd` 進入目錄。
3. 執行 `docker compose up -d`。

compose 檔案預設綁定到 `localhost:8080`(nginx 託管靜態 `dist/` 建置產物)。修改 `docker-compose.yaml` 中的 `ports` 可更換連接埠。

## 開發

需要 Node.js ≥ 20.19 與 pnpm(透過 `corepack enable` 啟用)。

```bash
pnpm install        # 安裝依賴
pnpm dev            # 開發伺服器
pnpm build          # 正式建置 → dist/
pnpm preview        # 預覽正式建置
pnpm test           # vitest 測試
pnpm lint           # eslint
pnpm typecheck      # tsc --noEmit
```

技術棧:Vite 8、React 19、TypeScript、react-markdown(unified/remark/rehype)、CodeMirror 6、SCSS modules、vite-plugin-pwa。

## 提示

- 在列印對話框中關閉**頁首與頁尾**可獲得更乾淨的 PDF。
- 超寬圖表與公式在螢幕上可捲動,列印時會正確分頁。

LICENSE MIT © 2019 realdennis, © 2026 overklassniy

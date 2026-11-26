# 貢獻指南 / Contributing guide

感謝你願意為這個範本貢獻。

Thanks for wanting to contribute to this template.

## 開發環境設置 / Development setup

```bash
npm install
npm run dev
```

開 PR 之前，先在本機跑一次 CI 會跑的檢查：

Before opening a PR, run the same checks CI runs, locally:

```bash
npm run check && npm run build && npm test
```

`npm audit` 目前應該回報 0 筆問題（Astro 7 升級後已清空）。若有新的
安全性建議，dependabot 每週會追蹤（`.github/dependabot.yml`）；只影響
建置工具的項目可以等例行更新，不要用 `--force` 硬升。

`npm audit` should currently report 0 findings (cleared by the Astro 7
upgrade). If new advisories appear, dependabot tracks them weekly
(`.github/dependabot.yml`); advisories that only affect build tooling can
wait for a routine update — never force through with `--force`.

## 專案地圖 / Project map

- `src/config.ts`：網站設定的唯一來源（標題、導覽列、功能旗標、社群連結）。
  大多數客製化都從這裡開始。
- `src/locales/en.ts`、`src/locales/zh-TW.ts`：所有內建介面字串，一個語言
  一份字典。`src/config.ts` 的 `SITE.locale` 決定載入哪一份。
- `src/data/*.ts`：內容資料，work/life 的「關於」文案（`about.ts`、
  `life.ts`）、作品集項目（`projects.ts`），以及共用的區塊內容型別定義
  （`sections.ts`）。
- `src/components/blocks/*.astro`：兩個「關於」面共用的通用內容區塊
  （text、chips、timeline、cards、stats 等），資料來自
  `src/data/sections.ts` 的項目。細節見下方〈慣例〉。
- `plugins/*.mjs`：建置期的 remark 外掛（Mermaid fence、閱讀時間），
  每個都有對應的 `*.test.mjs`。

In English:

- `src/config.ts`: the single source of site configuration (title, nav,
  feature flags, social links). Most customization starts here.
- `src/locales/en.ts`, `src/locales/zh-TW.ts`: every built-in UI string,
  one dictionary per language. `SITE.locale` in `src/config.ts` decides
  which one loads.
- `src/data/*.ts`: content data — the work/life "about" copy (`about.ts`,
  `life.ts`), portfolio items (`projects.ts`), and the shared block content
  types (`sections.ts`).
- `src/components/blocks/*.astro`: the generic content blocks shared by
  both "about" faces (text, chips, timeline, cards, stats, …), fed by the
  entries in `src/data/sections.ts`. Details under Conventions below.
- `plugins/*.mjs`: build-time remark plugins (Mermaid fences, reading
  time), each with a matching `*.test.mjs`.

## 慣例 / Conventions

- commit 訊息和 PR 標題使用 [Conventional Commits](https://www.conventionalcommits.org/)
  （`feat:`、`fix:`、`docs:` 等）。
- 一個改動一個分支；PR 開向 `main`。
- 區塊維持資料驅動：區塊元件從 `src/data/*.ts` 拿內容，資料是空的就什麼都
  不渲染（例如 `Cards.astro` 裡的 `cards.length > 0 && (...)`）。不要把
  內容寫死在區塊元件裡。
- 介面字串的改動要**同時**更新 `src/locales/en.ts` 和
  `src/locales/zh-TW.ts`，放在同一個 PR 裡。任何一份字典悄悄落後另一份，
  都算是一個 bug。
- commit 訊息、PR 標題與內文、分支名稱**不得包含任何 AI 工具的署名或
  痕跡**：不加 `Co-authored-by` 的 AI 署名、不留工具產生的會話連結或
  簽名列（例如 `Claude-Session:`、`Generated with ...`）。用什麼工具寫
  code 都可以，但進到 git 歷史的資訊只留人。

In English:

- Commit messages and PR titles follow
  [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`,
  `fix:`, `docs:`, …).
- One change per branch; PRs target `main`.
- Blocks stay data-driven: block components take their content from
  `src/data/*.ts` and render nothing when the data is empty (e.g.
  `cards.length > 0 && (...)` in `Cards.astro`). Never hardcode content
  into a block component.
- A UI-string change must update **both** `src/locales/en.ts` and
  `src/locales/zh-TW.ts` in the same PR. Either dictionary silently
  falling behind the other counts as a bug.
- Commit messages, PR titles and bodies, and branch names must carry **no
  AI-tool attribution or traces**: no AI `Co-authored-by`, no
  tool-generated session links or signature lines (e.g. `Claude-Session:`,
  `Generated with ...`). Write the code with whatever tool you like — what
  enters git history stays human-only.

## Pull request

小修正可以直接開 PR。功能或行為變更請先開 issue，討論好方向再動手。PR
表單會請你填描述、變更類型、測試方式，視覺變更要附前後對照截圖；PR
標題遵循 Conventional Commits，因為它會成為 squash-merge 後的 commit
message。

Small fixes can go straight to a PR. For features or behavior changes,
open an issue first and settle the direction before writing code. The PR
form asks for a description, the type of change, and how it was tested;
visual changes need before/after screenshots. The PR title follows
Conventional Commits because it becomes the commit message after
squash-merge.

<a id="個人資料"></a>

## 個人資料 / Personal data

這個範本內建的示範內容是刻意假造的（見 `src/data/life.ts`），確保範本
維護者的個人資訊不會外流到你的 fork 裡。請不要在 `src/`、`public/`、
`.github/`、`package.json` 或 `astro.config.mjs` 底下的任何地方，加入
真實姓名、雇主／組織關係、電話號碼、政府或帳號 ID，或是真人社群／遊戲
帳號的連結。

The demo content shipped with this template is deliberately fictional
(see `src/data/life.ts`), so the maintainer's personal information never
leaks into your fork. Do not add real names, employer/organization ties,
phone numbers, government or account IDs, or links to real personal
social/gaming profiles anywhere under `src/`, `public/`, `.github/`,
`package.json`, or `astro.config.mjs`.

以下是這項檢查的簡化、可直接執行版本（能抓到不小心留下的真實社群連結；
維護者審查時還會額外檢查幾個沒有列在這裡的專屬識別資訊）：

A simplified, runnable version of that check (it catches accidentally
kept real social links; the maintainer's review additionally covers a few
identifiers not listed here):

```bash
grep -rniE "steamcommunity|gravatar|instagram|facebook" src/ public/ .github/ package.json astro.config.mjs
```

任何比對到的結果都應該是廠商／通用參照（例如
`public/vendor/tocas/tocas.min.css` 裡的圖示 class 名稱），絕不能是真實
的個人頁面連結。

Anything the grep matches should be a vendor/generic reference (like icon
class names inside `public/vendor/tocas/tocas.min.css`), never a link to
a real personal page.

## `.mdx` 內容的信任層級 / Trust level of `.mdx` content

部落格文章可以是 `.md` 或 `.mdx`。跟 `.md` 不同，`.mdx` 檔案在建置時會
以 JavaScript/JSX 執行，所以新增或修改 `.mdx` 檔案的 PR，需要跟原始碼
變更一樣的程式碼層級審查，不能只當內容改動略讀過去。（這個範本的示範
文章刻意全部使用 `.md`。）

Blog posts can be `.md` or `.mdx`. Unlike `.md`, an `.mdx` file executes
as JavaScript/JSX at build time, so a PR that adds or changes `.mdx`
files needs the same code-level review as a source change — never skim it
as a content edit. (This template's own demo posts deliberately use `.md`
only.)

## 視覺檢查 / Visual check

```bash
npm run build && npm run preview
```

打開印出來的本機網址，檢查你改動到的頁面：亮色＋暗色主題都看一遍，
如果動到介面字串，兩種語言都要看。

Open the printed local URL and check the pages you touched: look at both
the light and dark themes, and if you changed any UI string, check both
languages.

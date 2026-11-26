# 部署

## GitHub Pages

`.github/workflows/deploy.yml` 在每次推送到 `main` 時執行 `npm run check && npm run build`，再用 GitHub Pages 原生的 Actions 發布（`actions/deploy-pages`）。第一次使用時，到 **Settings → Pages → Build and deployment**，將 **Source** 設為 **GitHub Actions**。

`src/config.ts` 最上方的兩個欄位要符合發布方式。`site` 是網址，`base` 是子路徑。

| 發布方式         | Repo 名稱          | `site`                       | `base`           | 結果網址                                |
| ---------------- | ------------------ | ---------------------------- | ---------------- | --------------------------------------- |
| Project page     | 任意               | `"https://<user>.github.io"` | `"/<repo-name>"` | `https://<user>.github.io/<repo-name>/` |
| 使用者或組織首頁 | `<user>.github.io` | `"https://<user>.github.io"` | `""`             | `https://<user>.github.io/`             |

若網頁沒有樣式或圖片，先檢查 `base`。

## Vercel

匯入 repo 即可，不需要改設定。

1. 到 [vercel.com](https://vercel.com)，用 GitHub 登入。
2. 選取 **Add New → Project**，匯入 repo。
3. 選取 **Deploy**。

之後每次推送到 `main` 會自動重新部署，PR 會附預覽網址。輸出為純靜態檔案，免費的 Hobby 方案已足夠，不需要 adapter。

## 其他平台

Netlify 與 Cloudflare Pages 也可以使用。做法見 [Astro 部署指南](https://docs.astro.build/en/guides/deploy/)。

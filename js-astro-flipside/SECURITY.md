# 安全政策 / Security policy

## 支援版本 / Supported versions

只支援 `main` 上最新的 commit，沒有另外維護的釋出分支。

Only the latest commit on `main` is supported; there are no separately
maintained release branches.

## 回報安全漏洞 / Reporting a vulnerability

請透過 GitHub 的私下漏洞回報功能回報安全漏洞，不要開公開 issue：進入
這個 repo 的 **Security** 分頁 → **Report a vulnerability**。這樣我們
可以在漏洞公開之前先討論並修復。

請不要為疑似的安全漏洞開公開 issue 或 PR。

Report security vulnerabilities through GitHub's private vulnerability
reporting instead of a public issue: open this repo's **Security** tab →
**Report a vulnerability**. That lets us discuss and fix the problem
before it becomes public.

Please do not open public issues or PRs for suspected security
vulnerabilities.

## `.mdx` 文章 / `.mdx` posts

跟純 `.md` 不同，`.mdx` 部落格文章在建置時會以 JavaScript/JSX 執行。
新增或修改 `.mdx` 檔案的 PR，需要跟原始碼變更一樣的程式碼層級審查，
不能只當內容改動略讀過去。（這個範本自己的示範文章刻意全部使用
`.md`。）

Unlike plain `.md`, `.mdx` blog posts execute as JavaScript/JSX at build
time. A PR that adds or changes `.mdx` files needs the same code-level
review as a source change — never skim it as a content edit. (This
template's own demo posts deliberately use `.md` only.)

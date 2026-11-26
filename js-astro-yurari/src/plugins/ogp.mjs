import fs from "node:fs";
import path from "node:path";
import { defineMdastPlugin } from "satteri";
import ogs from "open-graph-scraper";

// Markdown 内の外部リンクに OGP 情報を付ける Sätteri (mdast) プラグイン。
//  - 単独行のURL (本文がURLそのもののリンク) → リンクカード
//  - それ以外の http(s) リンク → ホバーカード用に data-ogp を付与 (表示は client 側)
// 取得結果は .cache/ogp.json に保存し、再ビルドで再取得しない。

const cacheFile = path.resolve(".cache/ogp.json");
const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, "utf8")) : {};
const pending = new Map();

const fetchOgp = (url) => {
  if (cache[url]) return Promise.resolve(cache[url]);
  if (pending.has(url)) return pending.get(url);

  const task = ogs({ url, timeout: 8, fetchOptions: { headers: { "user-agent": "Mozilla/5.0 (compatible; OgpBot/1.0)" } } })
    .then(({ result, error }) => {
      if (error) return null;
      const image = Array.isArray(result.ogImage) ? result.ogImage[0]?.url : undefined;
      const info = {
        title: result.ogTitle || result.twitterTitle || "",
        description: result.ogDescription || result.twitterDescription || "",
        image: image && /^https?:\/\//.test(image) ? image : "",
      };
      cache[url] = info;
      fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
      fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
      return info;
    })
    .catch(() => null);

  pending.set(url, task);
  return task;
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const cardHtml = (url, info) => {
  const host = new URL(url).hostname;
  const title = info?.title || host;
  return (
    `<a class="link-card not-prose" href="${esc(url)}" target="_blank" rel="noopener noreferrer">` +
    `<span class="link-card-body">` +
    `<span class="link-card-title">${esc(title)}</span>` +
    (info?.description ? `<span class="link-card-desc">${esc(info.description)}</span>` : "") +
    `<span class="link-card-host">${esc(host)}</span>` +
    `</span>` +
    (info?.image ? `<img class="link-card-img" src="${esc(info.image)}" alt="" loading="lazy" referrerpolicy="no-referrer" />` : "") +
    `</a>`
  );
};

const isExternal = (url) => /^https?:\/\//.test(url);

// 本文がURLそのもののリンクだけを含む段落 = リンクカードにする段落
const cardLink = (paragraph, ctx) => {
  const [child] = paragraph.children;
  if (paragraph.children.length !== 1 || child.type !== "link" || !isExternal(child.url)) return;
  const text = ctx.textContent(child);
  return text === child.url || text === child.url.replace(/\/$/, "") ? child : undefined;
};

export default defineMdastPlugin({
  name: "ogp",

  // 単独行のURL → 段落ごとリンクカードの html に置換
  async paragraph(node, ctx) {
    const link = cardLink(node, ctx);
    if (!link) return;
    ctx.replaceNode(node, { type: "html", value: cardHtml(link.url, await fetchOgp(link.url)) });
  },

  // それ以外の外部リンク → ホバーカード用の data-ogp を付与
  async link(node, ctx) {
    if (!isExternal(node.url)) return;
    const parent = ctx.parent(node);
    if (parent?.type === "paragraph" && cardLink(parent, ctx)) return;

    const info = await fetchOgp(node.url);
    if (!info || !(info.title || info.description)) return;
    ctx.setProperty(node, "data", {
      hProperties: {
        className: ["hover-link"],
        "data-ogp": JSON.stringify({ ...info, host: new URL(node.url).hostname }),
      },
    });
  },
});

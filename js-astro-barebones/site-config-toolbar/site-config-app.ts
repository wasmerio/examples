import { defineToolbarApp } from "astro/toolbar";

const APP_ID = "site-config";
const EVT = {
  load: `${APP_ID}:load`,
  data: `${APP_ID}:data`,
  error: `${APP_ID}:error`,
  save: `${APP_ID}:save`,
};

type SiteConfig = {
  SITE: Record<string, string>;
  NAV_LINKS: Record<string, { label: string; path: string }>;
  SOCIAL_LINKS: Record<string, { label: string; href: string }>;

};

type OgData = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  url: string;
  type: string;
  locale: string;
  twitterCard: string;
};

const CONFIG_PATH = "src/siteConfig.ts";

function getMeta(property: string): string {
  const el =
    document.querySelector(`meta[property="${property}"]`) ||
    document.querySelector(`meta[name="${property}"]`);
  return el?.getAttribute("content") ?? "";
}

function toDevUrl(url: string): string {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    if (parsed.origin !== location.origin) {
      return `${location.origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    // relative or malformed — leave as-is
  }
  return url;
}

function scrapeOg(): OgData {
  return {
    title: getMeta("og:title") || document.title,
    description: getMeta("og:description") || getMeta("description"),
    image: toDevUrl(getMeta("og:image")),
    imageAlt: getMeta("og:image:alt"),
    url:
      document.querySelector<HTMLLinkElement>("link[rel='canonical']")?.href ||
      location.href,
    type: getMeta("og:type"),
    locale: getMeta("og:locale"),
    twitterCard: getMeta("twitter:card"),
  };
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + "…";
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default defineToolbarApp({
  init(canvas, app, server) {
    const style = document.createElement("style");
    style.textContent = `
      :host astro-dev-toolbar-window {
        max-height: 520px;
        overflow-y: auto;
      }
      h1 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        color: #fff;
        margin: 0 0 4px;
        font-size: 22px;
      }
      .config-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      h1 astro-dev-toolbar-icon {
        width: 1em;
        height: 1em;
        display: block;
      }
      .hint {
        font-size: 13px;
        color: #a0a0a0;
        margin: 4px 0 12px;
        line-height: 1.5;
      }
      .hint code {
        background: #24262d;
        padding: 2px 5px;
        font-size: 12px;
        color: #c4b5fd;
      }
      h3 {
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        margin: 16px 0 8px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      h3:first-of-type {
        margin-top: 4px;
      }
      .field {
        margin-bottom: 6px;
        display: flex;
        gap: 6px;
        align-items: baseline;
      }
      .field-label {
        font-size: 13px;
        color: #a0a0a0;
        min-width: 80px;
        flex-shrink: 0;
      }
      .field-input {
        font-size: 13px;
        color: #e4e4e7;
        background: #1e1e24;
        border: 1px solid #343841;
        padding: 3px 6px;
        flex: 1;
        min-width: 0;
        font-family: inherit;
        outline: none;
      }
      .field-input:focus {
        border-color: #818cf8;
      }
      .link-group {
        border: 1px solid #343841;
        padding: 8px 10px;
        margin-bottom: 8px;
      }
      .link-group-title {
        font-size: 13px;
        font-weight: 500;
        color: #d4d4d8;
        margin: 0 0 4px;
      }

      /* --- divider --- */
      .divider {
        border: none;
        border-top: 1px solid #343841;
        margin: 20px 0;
      }

      /* --- OG preview card --- */
      .card {
        border: 1px solid #343841;
        overflow: hidden;
        margin-bottom: 16px;
        background: #1a1a2e;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      .card-img {
        width: 100%;
        aspect-ratio: 1.91 / 1;
        object-fit: cover;
        display: block;
        background: #1a1a2e;
      }
      .card-body {
        padding: 10px 12px;
      }
      .card-domain {
        font-size: 12px;
        color: #8899a6;
        margin: 0 0 2px;
        text-transform: lowercase;
      }
      .card-title {
        font-size: 15px;
        font-weight: 600;
        color: #e4e6eb;
        margin: 0 0 3px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .card-desc {
        font-size: 13px;
        color: #b0b3b8;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .no-image {
        width: 100%;
        aspect-ratio: 1.91 / 1;
        background: #1a1a2e;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #555;
        font-size: 13px;
      }

      /* --- metadata table --- */
      .meta-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
      }
      .meta-table td {
        padding: 4px 6px;
        vertical-align: top;
        border-bottom: 1px solid #343841;
      }
      .meta-table .meta-key {
        color: #818cf8;
        white-space: nowrap;
        width: 1%;
        font-family: monospace;
      }
      .meta-table .meta-val {
        color: #e4e4e7;
        word-break: break-all;
      }
      .meta-val.missing {
        color: #f87171;
        font-style: italic;
      }
      .meta-val.ok {
        color: #4ade80;
      }

      /* --- warnings --- */
      .warnings {
        margin: 12px 0 0;
        padding: 0;
        list-style: none;
      }
      .warnings li {
        font-size: 12px;
        padding: 4px 0;
        color: #fbbf24;
      }
      .warnings li::before {
        content: "⚠ ";
      }
    `;

    const win = document.createElement("astro-dev-toolbar-window");
    const container = document.createElement("div");
    win.appendChild(style);
    win.appendChild(container);
    canvas.appendChild(win);

    // ── OG Preview section ───────────────────────────────

    const ogSection = document.createElement("div");
    container.appendChild(ogSection);

    // ── Divider ──────────────────────────────────────────

    const divider = document.createElement("hr");
    divider.className = "divider";
    container.appendChild(divider);

    // ── Site Config section ──────────────────────────────

    const configHeader = document.createElement("div");
    configHeader.className = "config-header";

    const header = document.createElement("h1");
    header.innerHTML = `Site Config`;
    configHeader.appendChild(header);

    const saveBtn = document.createElement("button");
    saveBtn.className = "save-btn";
    saveBtn.textContent = "Save";
    saveBtn.style.display = "none";
    configHeader.appendChild(saveBtn);

    container.appendChild(configHeader);

    const hint = document.createElement("div");
    hint.className = "hint";
    hint.innerHTML = `Edit values below and click Save to update <code>${CONFIG_PATH}</code>.`;
    container.appendChild(hint);

    const status = document.createElement("div");
    status.className = "status";
    status.textContent = "Loading…";
    container.appendChild(status);

    const content = document.createElement("div");
    container.appendChild(content);

    // ── State & helpers ──────────────────────────────────

    let currentData: SiteConfig | null = null;

    function setStatus(msg: string, type: "" | "error" | "success" = "") {
      status.textContent = msg;
      status.className = `status ${type}`;
    }

    function renderInput(
      label: string,
      value: string,
      onChange: (v: string) => void,
    ): HTMLDivElement {
      const div = document.createElement("div");
      div.className = "field";
      const lbl = document.createElement("span");
      lbl.className = "field-label";
      lbl.textContent = label;
      div.appendChild(lbl);
      const input = document.createElement("input");
      input.className = "field-input";
      input.type = "text";
      input.value = value;
      input.addEventListener("input", () => onChange(input.value));
      div.appendChild(input);
      return div;
    }

    function collectData(): {
      SITE: Record<string, string>;
      NAV_LINKS: Record<string, { label: string; path: string }>;
      SOCIAL_LINKS: Record<string, { label: string; href: string }>;
    } | null {
      if (!currentData) return null;
      return {
        SITE: { ...currentData.SITE },
        NAV_LINKS: JSON.parse(JSON.stringify(currentData.NAV_LINKS)),
        SOCIAL_LINKS: JSON.parse(JSON.stringify(currentData.SOCIAL_LINKS)),
      };
    }

    function metaRow(key: string, value: string): string {
      if (!value)
        return `<tr><td class="meta-key">${escapeHtml(key)}</td><td class="meta-val missing">missing</td></tr>`;
      return `<tr><td class="meta-key">${escapeHtml(key)}</td><td class="meta-val ok">${escapeHtml(value)}</td></tr>`;
    }

    // ── Render site config fields ────────────────────────

    function renderData(data: SiteConfig) {
      currentData = JSON.parse(JSON.stringify(data));
      content.innerHTML = "";
      saveBtn.style.display = "";

      // SITE section
      const siteHeading = document.createElement("h3");
      siteHeading.textContent = "Site";
      content.appendChild(siteHeading);

      for (const key of Object.keys(data.SITE)) {
        content.appendChild(
          renderInput(key, data.SITE[key], (v) => {
            if (currentData) currentData.SITE[key] = v;
          }),
        );
      }

      // NAV_LINKS section
      const navHeading = document.createElement("h3");
      navHeading.textContent = "Navigation Links";
      content.appendChild(navHeading);

      for (const key of Object.keys(data.NAV_LINKS)) {
        const val = data.NAV_LINKS[key];
        const group = document.createElement("div");
        group.className = "link-group";
        const title = document.createElement("div");
        title.className = "link-group-title";
        title.textContent = key;
        group.appendChild(title);
        group.appendChild(
          renderInput("Label", val.label, (v) => {
            if (currentData) currentData.NAV_LINKS[key].label = v;
          }),
        );
        group.appendChild(
          renderInput("Path", val.path, (v) => {
            if (currentData) currentData.NAV_LINKS[key].path = v;
          }),
        );
        content.appendChild(group);
      }

      // SOCIAL_LINKS section
      const socialHeading = document.createElement("h3");
      socialHeading.textContent = "Social Links";
      content.appendChild(socialHeading);

      for (const key of Object.keys(data.SOCIAL_LINKS)) {
        const val = data.SOCIAL_LINKS[key];
        const group = document.createElement("div");
        group.className = "link-group";
        const title = document.createElement("div");
        title.className = "link-group-title";
        title.textContent = key;
        group.appendChild(title);
        group.appendChild(
          renderInput("Label", val.label, (v) => {
            if (currentData) currentData.SOCIAL_LINKS[key].label = v;
          }),
        );
        group.appendChild(
          renderInput("URL", val.href, (v) => {
            if (currentData) currentData.SOCIAL_LINKS[key].href = v;
          }),
        );
        content.appendChild(group);
      }
    }

    // ── Render OG preview ────────────────────────────────

    function renderOg() {
      const og = scrapeOg();
      const domain = getDomain(og.url);
      const warnings: string[] = [];

      if (!og.title) warnings.push("Missing og:title");
      if (!og.description) warnings.push("Missing og:description");
      if (!og.image)
        warnings.push(
          "Missing og:image — most platforms won't show a preview card",
        );
      if (og.description && og.description.length > 200)
        warnings.push(
          `og:description is ${og.description.length} chars (recommended: under 200)`,
        );
      if (og.title && og.title.length > 90)
        warnings.push(
          `og:title is ${og.title.length} chars (recommended: under 90)`,
        );
      if (!og.twitterCard) warnings.push("Missing twitter:card meta tag");

      // Check siteConfig fields
      if (currentData) {
        for (const [key, value] of Object.entries(currentData.SITE)) {
          if (!value) warnings.push(`SITE.${key} is empty in siteConfig.ts`);
        }
      }

      const img = og.image
        ? `<img class="card-img" src="${escapeHtml(og.image)}" alt="${escapeHtml(og.imageAlt || "")}" onerror="this.outerHTML='<div class=\\'no-image\\'>Image failed to load</div>'" />`
        : `<div class="no-image">No OG image</div>`;

      ogSection.innerHTML = `
        <div class="card">
          ${img}
          <div class="card-body">
            <div class="card-domain">${escapeHtml(domain)}</div>
            <div class="card-title">${escapeHtml(truncate(og.title || "Untitled", 110))}</div>
            <div class="card-desc">${escapeHtml(truncate(og.description || "", 200))}</div>
          </div>
        </div>

        <h3>Raw Metadata</h3>
        <table class="meta-table">
          ${metaRow("og:title", og.title)}
          ${metaRow("og:description", og.description)}
          ${metaRow("og:image", og.image)}
          ${metaRow("og:image:alt", og.imageAlt)}
          ${metaRow("og:type", og.type)}
          ${metaRow("og:locale", og.locale)}
          ${metaRow("og:url", og.url)}
          ${metaRow("twitter:card", og.twitterCard)}
        </table>

        ${
          warnings.length
            ? `<ul class="warnings">${warnings.map((w) => `<li>${escapeHtml(w)}</li>`).join("")}</ul>`
            : ""
        }
      `;
    }

    // ── Events ───────────────────────────────────────────

    saveBtn.addEventListener("click", () => {
      const data = collectData();
      if (!data) return;
      saveBtn.disabled = true;
      server.send(EVT.save, data);
    });

    server.on<SiteConfig>(EVT.data, (data) => {
      saveBtn.disabled = false;
      renderData(data);
      renderOg();
      setStatus("", "");
    });

    server.on<{ message: string }>(EVT.error, ({ message }) => {
      setStatus(message, "error");
    });

    app.onToggled(({ state }) => {
      if (state) {
        setStatus("Loading…");
        server.send(EVT.load, {});
      }
    });

    server.send(EVT.load, {});
  },
});

/**
 * Smoke tests for the interactive components. Requires
 * `COMPONENT_PREVIEWS=true npm run build` first for the `/preview-renders/` routes.
 *
 *   node scripts/tests/smoke.mjs [--only <substring>]
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { launchBrowser, serveDist } from "./lib/servedDist.mjs";

const root = join(dirname(new URL(import.meta.url).pathname), "..", "..");
const distDir = join(root, "dist");

const args = process.argv.slice(2);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;

const DESKTOP = { width: 1280, height: 800 };
const MOBILE = { width: 390, height: 844 };

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// One component per page, rendered from its structure-value defaults.
const PREVIEW_ROOT = "[data-preview-root]";

const tests = [
  {
    name: "accordion opens and closes on click",
    path: "/preview-renders/building-blocks/wrappers/accordion/",
    viewport: DESKTOP,
    async run(page) {
      const item = page.locator(`${PREVIEW_ROOT} .accordion-item`).first();

      await item.waitFor();
      assert(!(await item.evaluate((el) => el.open)), "expected the first item to start closed");

      await item.locator("summary").first().click();
      assert(await item.evaluate((el) => el.open), "item did not open after clicking its summary");

      await item.locator("summary").first().click();
      assert(
        !(await item.evaluate((el) => el.open)),
        "item did not close after clicking its summary again"
      );
    },
  },
  {
    name: "documentation drawer opens and closes at a mobile viewport",
    path: "/introduction/",
    viewport: MOBILE,
    async run(page) {
      const sidebar = page.locator("nav.docs-sidebar");
      const offScreen = () => sidebar.evaluate((el) => el.getBoundingClientRect().right <= 1);

      await sidebar.waitFor({ state: "attached" });
      assert(await offScreen(), "the drawer was on screen before the trigger was clicked");

      await page.locator("label.docs-topbar-drawer-trigger").click();
      await page.waitForFunction(
        () => document.querySelector("nav.docs-sidebar").getBoundingClientRect().left > -1
      );

      const onScreen = await sidebar.evaluate((el) => {
        const rect = el.getBoundingClientRect();

        return rect.width > 0 && rect.left > -1 && rect.left < 1;
      });

      assert(onScreen, "the drawer is open but is not positioned on screen");

      // The drawer covers most of the scrim, so click the strip it leaves uncovered.
      const strip = await page.evaluate(() => {
        const drawer = document.querySelector("nav.docs-sidebar").getBoundingClientRect();

        return drawer.right + (window.innerWidth - drawer.right) / 2;
      });

      await page.locator("label.docs-nav-scrim").click({ position: { x: strip, y: 400 } });
      await page.waitForFunction(
        () => document.querySelector("nav.docs-sidebar").getBoundingClientRect().right <= 1
      );
    },
  },
  {
    name: "content selector switches panels from the keyboard",
    path: "/preview-renders/building-blocks/wrappers/content-selector/",
    viewport: DESKTOP,
    async run(page) {
      const items = page.locator(`${PREVIEW_ROOT} .content-selector-item`);

      await items.first().waitFor();
      assert((await items.count()) > 1, "expected more than one content selector tab");

      const second = items.nth(1);

      await items.first().locator(".content-selector-input").focus();
      await page.keyboard.press("ArrowRight");
      await page.waitForFunction(() => {
        const item = document.querySelectorAll("[data-preview-root] .content-selector-item")[1];

        return item?.querySelector(".content-selector-input")?.checked === true;
      });
      assert(
        await second.locator(".content-selector-panel").isVisible(),
        "the activated panel is not visible"
      );
    },
  },
  {
    name: "announcement bar dismisses and stays dismissed across pages",
    path: "/",
    viewport: DESKTOP,
    async run(page) {
      // Relies on src/data/announcementBar.json shipping with enabled: true.
      const bar = page.locator(".announcement-bar");

      await bar.waitFor();
      await page.locator(".announcement-bar-close").click();
      await bar.waitFor({ state: "detached" });

      const stored = await page.evaluate(() => localStorage.getItem("announcement-bar-dismissed"));

      assert(
        typeof stored === "string" && stored.length > 0,
        "expected the dismissed announcement to be stored in localStorage"
      );

      // Dismissal is site-wide: navigate to another page and confirm the
      // inline script removed the bar there too.
      await page.locator('.docs-sidebar a[href="/introduction/"]').first().click();
      await page.waitForURL("**/introduction/", { waitUntil: "load" });

      assert(
        (await page.locator(".announcement-bar").count()) === 0,
        "expected the announcement bar to stay dismissed on other pages"
      );
    },
  },
  {
    name: "theme toggle flips data-theme and persists across reload",
    path: "/",
    viewport: DESKTOP,
    async run(page) {
      const initial = await page.evaluate(() =>
        document.documentElement.getAttribute("data-theme")
      );

      assert(
        initial === "light" || initial === "dark",
        `expected data-theme "light" or "dark" on <html>, got ${JSON.stringify(initial)}`
      );

      const flipped = initial === "dark" ? "light" : "dark";

      await page.locator(".theme-toggle").first().click();
      await page.waitForFunction(
        (theme) => document.documentElement.getAttribute("data-theme") === theme,
        flipped
      );

      const stored = await page.evaluate(() => localStorage.getItem("theme"));

      assert(
        stored === flipped,
        `expected localStorage theme ${JSON.stringify(flipped)}, got ${JSON.stringify(stored)}`
      );

      await page.reload({ waitUntil: "load" });
      await page.waitForFunction(
        (theme) => document.documentElement.getAttribute("data-theme") === theme,
        flipped
      );
    },
  },
  {
    name: "search modal opens on Ctrl+K and results land on the matched heading",
    path: "/introduction/",
    viewport: DESKTOP,
    async run(page) {
      const popoverSel = ".search .modal-popover";

      await page.locator(popoverSel).waitFor({ state: "attached" });
      await page.keyboard.press("Control+k");

      // Open + focus lands on Pagefind's input (the popover's first
      // focusable element) once the custom element has upgraded.
      await page.waitForFunction((sel) => {
        const popover = document.querySelector(sel);
        const active = document.activeElement;

        return Boolean(
          popover && popover.matches(":popover-open") && active?.matches('input[type="search"]')
        );
      }, popoverSel);

      await page.keyboard.type("versions");
      await page.locator(`${popoverSel} .search-result .search-result-link`).first().waitFor();

      // Sub-results are the point of the overlay: a result has to be able to
      // open a section rather than the top of a long page.
      await page.locator(`${popoverSel} .search-result-sub-link`).first().waitFor();

      const landsOnHeading = await page.evaluate(
        (sel) =>
          [...document.querySelectorAll(`${sel} .search-result-sub-link`)].some((link) =>
            link.getAttribute("href")?.includes("#")
          ),
        popoverSel
      );

      assert(landsOnHeading, "expected at least one sub-result to link to a heading anchor");

      // One Escape closes the overlay even with a query typed, and focus
      // returns to the header trigger.
      await page.keyboard.press("Escape");
      await page.waitForFunction((sel) => {
        const popover = document.querySelector(sel);
        const active = document.activeElement;

        return Boolean(
          popover && !popover.matches(":popover-open") && active?.closest(".search-trigger")
        );
      }, popoverSel);
    },
  },
  {
    // A laptop viewport, where the nav is taller than the gap it has to sit in.
    name: "sidebar stays clear of the topbar and footer at the end of a page",
    path: "/writing-content/",
    viewport: { width: 1280, height: 700 },
    async run(page) {
      const inner = page.locator(".docs-sidebar-inner");

      await inner.waitFor();
      await page.evaluate(() =>
        document.querySelectorAll(".docs-sidebar details").forEach((group) => (group.open = true))
      );
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForFunction(
        () => window.scrollY >= document.documentElement.scrollHeight - innerHeight - 1
      );

      const geometry = await page.evaluate(() => {
        const box = document.querySelector(".docs-sidebar-inner").getBoundingClientRect();

        return {
          firstLinkTop: document.querySelector(".docs-sidebar-inner a").getBoundingClientRect().top,
          navBottom: box.bottom,
          topbarBottom: document.querySelector(".docs-topbar").getBoundingClientRect().bottom,
          footerTop: document.querySelector("footer").getBoundingClientRect().top,
        };
      });

      assert(
        geometry.firstLinkTop >= geometry.topbarBottom,
        `expected the first nav link (${geometry.firstLinkTop}) to clear the topbar (${geometry.topbarBottom})`
      );
      assert(
        geometry.navBottom <= geometry.footerTop,
        `expected the nav (${geometry.navBottom}) to stop above the footer (${geometry.footerTop})`
      );
    },
  },
  {
    name: "on-this-page scroll-spy highlights the scrolled-to section",
    path: "/writing-content/",
    viewport: DESKTOP,
    async run(page) {
      const sidebar = page.locator(".toc-sidebar");

      await sidebar.waitFor();

      // Anchor navigation works without JS; the spy then marks the target's
      // link as current once its heading sits in the top viewport band.
      await page.evaluate(() => document.getElementById("tables").scrollIntoView());
      await page.waitForFunction(
        () =>
          document.querySelector(".toc-sidebar a[aria-current='true']")?.getAttribute("href") ===
          "#tables"
      );

      // Scrolling back to an earlier section moves the highlight with it.
      await page.evaluate(() => document.getElementById("callouts").scrollIntoView());
      await page.waitForFunction(
        () =>
          document.querySelector(".toc-sidebar a[aria-current='true']")?.getAttribute("href") ===
          "#callouts"
      );
    },
  },
  {
    name: "code tabs switch panels and the language persists across pages",
    path: "/writing-content/",
    viewport: DESKTOP,
    async run(page) {
      // "Node" is offered on both pages this test visits; the stored choice is
      // keyed by label, so only a shared one can carry across.
      const node = page.locator('.code-tabs [role="tab"][data-label="Node"]').first();

      await node.waitFor();
      await node.click();

      await page.waitForFunction(
        () =>
          document
            .querySelector('.code-tabs [role="tab"][data-label="Node"]')
            ?.getAttribute("aria-selected") === "true"
      );

      const visiblePanel = await page.evaluate(() => {
        const tab = document.querySelector('.code-tabs [role="tab"][data-label="Node"]');

        return !document.getElementById(tab.getAttribute("aria-controls")).hidden;
      });

      assert(visiblePanel, "the Node tab is selected but its panel stayed hidden");

      await page.goto(new URL("/config-api/", page.url()).href, { waitUntil: "load" });
      await page.waitForFunction(
        () =>
          document
            .querySelector('.code-tabs [role="tab"][data-label="Node"]')
            ?.getAttribute("aria-selected") === "true"
      );
    },
  },
  {
    name: "code sample gets a copy button that reports success",
    path: "/writing-content/",
    viewport: DESKTOP,
    async run(page, context) {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);

      // Content carries no Markdown fences by convention, so the fence branch
      // of `setupCodeFence` has nothing to drive here — this is the surface.
      const surface = page.locator(".prose .code-surface").first();

      await surface.waitFor();

      // The button ships in the markup; only the click handler waits on JS.
      await page.waitForFunction(
        () =>
          document.querySelector(".prose .code-surface")?.hasAttribute("data-code-initialized") ??
          false
      );
      await surface.locator(".code-surface-copy").first().click();

      await page.waitForFunction(
        () =>
          document.querySelector(".prose .code-surface .code-surface-copy")?.dataset.state ===
          "copied"
      );

      const copied = await page.evaluate(() => navigator.clipboard.readText());

      assert(copied.trim().length > 0, "the clipboard was empty after clicking copy");
    },
  },
  {
    name: "diagram source is replaced by rendered SVG",
    path: "/media-and-components/",
    viewport: DESKTOP,
    async run(page) {
      const diagram = page.locator(".diagram").first();

      await diagram.waitFor();

      // The source ships in the page and stays there until Mermaid renders,
      // so a reader with no JS still gets the content.
      assert(
        await diagram
          .locator(".diagram-source")
          .evaluate((el) => el.textContent.includes("flowchart")),
        "the diagram source is missing from the page"
      );

      await diagram.scrollIntoViewIfNeeded();
      await page.waitForFunction(
        () => document.querySelector(".diagram")?.hasAttribute("data-diagram-rendered"),
        undefined,
        { timeout: 15000 }
      );

      assert(
        await diagram.locator(".diagram-output svg").count(),
        "Mermaid reported success but emitted no SVG"
      );
    },
  },
  {
    name: "helpful vote swaps in the thank-you state",
    path: "/theming/",
    viewport: DESKTOP,
    async run(page) {
      const feedback = page.locator(".page-feedback");

      await feedback.waitFor();
      await feedback.locator('button[value="yes"]').click();

      await page.waitForFunction(
        () => document.querySelector(".page-feedback")?.getAttribute("data-voted") === "yes"
      );

      assert(
        await feedback.locator(".page-feedback-status").isVisible(),
        "the vote registered but the thank-you message stayed hidden"
      );
    },
  },
  {
    name: "masonry enhances to order-preserving grid spans",
    path: "/preview-renders/building-blocks/wrappers/masonry/",
    viewport: DESKTOP,
    async run(page) {
      const masonrySel = `${PREVIEW_ROOT} .masonry[data-masonry-enhanced]`;

      await page.waitForSelector(masonrySel);

      // Every item gets a measured row span (the enhancement's whole job)…
      await page.waitForFunction((sel) => {
        const items = [...document.querySelector(sel).querySelectorAll(".masonry-inner > *")];

        return (
          items.length >= 3 && items.every((item) => /^span \d+$/.test(item.style.gridRow || ""))
        );
      }, masonrySel);

      // …in source order across columns, unlike the CSS-columns fallback.
      const xs = await page.evaluate(
        (sel) =>
          [...document.querySelector(sel).querySelectorAll(".masonry-inner > *")]
            .slice(0, 3)
            .map((item) => Math.round(item.getBoundingClientRect().x)),
        masonrySel
      );

      assert(
        xs[0] < xs[1] && xs[1] < xs[2],
        `expected the first three items in distinct columns left-to-right, got x positions ${xs.join(", ")}`
      );
    },
  },
  {
    // A region re-render replaces the measured probe; the replacement is only
    // observed if the item's childList is watched, so swap it and then resize it.
    name: "masonry re-measures an item after its contents are replaced",
    path: "/preview-renders/building-blocks/wrappers/masonry/",
    viewport: DESKTOP,
    async run(page) {
      const masonrySel = `${PREVIEW_ROOT} .masonry[data-masonry-enhanced]`;

      await page.waitForSelector(masonrySel);
      await page.waitForFunction((sel) => {
        const first = document.querySelector(sel)?.querySelector(".masonry-inner > *");

        return /^span \d+$/.test(first?.style.gridRow || "");
      }, masonrySel);

      const before = await page.evaluate((sel) => {
        const item = document.querySelector(sel).querySelector(".masonry-inner > *");

        return item.style.gridRow;
      }, masonrySel);

      await page.evaluate((sel) => {
        const item = document.querySelector(sel).querySelector(".masonry-inner > *");

        item.firstElementChild.replaceWith(item.firstElementChild.cloneNode(true));
      }, masonrySel);

      // Otherwise the swap's pending relayout can measure the grown probe and pass by luck.
      await page.evaluate(
        () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      );

      await page.evaluate((sel) => {
        const item = document.querySelector(sel).querySelector(".masonry-inner > *");

        item.firstElementChild.style.height = "900px";
      }, masonrySel);

      await page.waitForFunction(
        ({ sel, previous }) => {
          const item = document.querySelector(sel).querySelector(".masonry-inner > *");

          return item.style.gridRow !== previous;
        },
        { sel: masonrySel, previous: before }
      );
    },
  },
  {
    name: "form submit shows an inline error per invalid field and clears it on input",
    path: "/feedback-and-forms/",
    viewport: DESKTOP,
    async run(page) {
      await page.waitForSelector("form.form");

      // Native validation is only handed over once the script has run; without
      // it the browser blocks the submit and this test would pass on a bubble.
      await page.waitForFunction(() => document.querySelector("form.form")?.noValidate === true);

      await page.click("form.form .submit button");

      await page.waitForFunction(
        () => document.querySelectorAll("form.form .form-field-error:not([hidden])").length === 3
      );

      const state = await page.evaluate(() => {
        const field = document.querySelector("form.form .form-field.input");
        const control = field.querySelector(".field");
        const error = field.querySelector(".form-field-error");

        return {
          message: error?.textContent.trim(),
          invalid: control.getAttribute("aria-invalid"),
          describedBy: control.getAttribute("aria-describedby"),
          errorId: error?.id,
          focused: document.activeElement === control,
        };
      });

      assert(state.message, "expected the browser's validation message to be shown inline");
      assert(state.invalid === "true", "expected the invalid control to be marked aria-invalid");
      assert(
        state.describedBy?.split(/\s+/).includes(state.errorId),
        `expected aria-describedby to name ${state.errorId}, got ${state.describedBy}`
      );
      assert(state.focused, "expected focus to move to the first invalid control");

      // The first field is an email input, so the value has to actually
      // satisfy it — a non-empty but invalid one stays marked invalid.
      await page.fill("form.form .form-field.input .field", "ada@example.com");

      await page.waitForFunction(() => {
        const control = document.querySelector("form.form .form-field.input .field");

        return !control.hasAttribute("aria-invalid") && !control.hasAttribute("aria-describedby");
      });
    },
  },
  {
    name: "copy page menu opens, copies the page markdown, and closes on Escape",
    path: "/installation/",
    viewport: DESKTOP,
    async run(page) {
      // The control ships `hidden`; anything visible here means its script ran.
      await page.waitForSelector(".copy-page:not([hidden])");

      // Headless Chrome has no clipboard permission, and the component
      // swallows the rejection — so the write is recorded instead.
      await page.evaluate(() => {
        window.copiedText = null;
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: {
            writeText(text) {
              window.copiedText = text;
              return Promise.resolve();
            },
          },
        });
      });

      await page.waitForSelector(".copy-page-menu", { state: "hidden" });
      await page.click(".copy-page-trigger");
      await page.waitForSelector(".copy-page-menu:not([hidden])");

      const items = await page.locator(".copy-page-menu .copy-page-item").count();

      assert(items === 5, `expected 5 menu items, got ${items}`);

      // window.print() blocks on a real dialog in headed runs; the assertion is
      // that the item is wired, not that the browser opens a print preview.
      await page.evaluate(() => {
        window.printCalled = false;
        window.print = () => {
          window.printCalled = true;
        };
      });
      await page.click('.copy-page-item[data-action="print"]');
      await page.waitForFunction(() => window.printCalled === true);
      await page.waitForSelector(".copy-page-menu", { state: "hidden" });

      await page.click(".copy-page-trigger");
      await page.click('.copy-page-item[data-action="markdown"]');
      await page.waitForFunction(() => window.copiedText?.startsWith("# Installation"));

      const copied = await page.evaluate(() => window.copiedText);

      assert(
        copied.includes("## Prerequisites"),
        "expected the copied markdown to carry the page body"
      );
      await page.waitForSelector('.copy-page[data-state="copied"]');
      await page.waitForSelector(".copy-page-menu", { state: "hidden" });

      await page.click(".copy-page-trigger");
      await page.waitForSelector(".copy-page-menu:not([hidden])");
      await page.keyboard.press("Escape");
      await page.waitForSelector(".copy-page-menu", { state: "hidden" });

      const focused = await page.evaluate(() =>
        document.activeElement?.classList.contains("copy-page-trigger")
      );

      assert(focused, "expected Escape to return focus to the trigger");
    },
  },
];

const marker = join(
  distDir,
  "preview-renders",
  "building-blocks",
  "wrappers",
  "accordion",
  "index.html"
);

if (!existsSync(marker)) {
  console.error(
    "dist/ is missing the preview-render routes. Run `COMPONENT_PREVIEWS=true npm run build` first."
  );
  process.exit(1);
}

const selected = only ? tests.filter((test) => test.name.includes(only)) : tests;

if (!selected.length) {
  console.error(`No smoke tests match "${only}".`);
  process.exit(1);
}

const { server, baseUrl } = await serveDist(distDir);
const browser = await launchBrowser();
const failures = [];

console.log(`Running ${selected.length} smoke test(s) against dist/…`);

try {
  for (const test of selected) {
    const context = await browser.newContext({
      viewport: test.viewport,
      deviceScaleFactor: 1,
      colorScheme: "light",
      // Stops transitions racing the assertions; matches scripts/previews/screenshot.mjs.
      reducedMotion: "reduce",
    });

    try {
      const page = await context.newPage();

      page.setDefaultTimeout(10000);
      await page.goto(`${baseUrl}${test.path}`, { waitUntil: "load", timeout: 15000 });
      await test.run(page, context);
      console.log(`  ✓ ${test.name}`);
    } catch (error) {
      failures.push(test.name);
      console.error(`  ✗ ${test.name} (${test.path}): ${error.message.split("\n")[0]}`);
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error(`\n${failures.length} smoke test(s) failed: ${failures.join(", ")}`);
  process.exit(1);
}

console.log(`\nOK: all ${selected.length} smoke tests passed.`);

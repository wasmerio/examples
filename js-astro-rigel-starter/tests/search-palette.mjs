import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

export async function checkSearchPalette({ cdp, evaluate, waitFor }) {
  const key = async (key, code, modifiers = 0) => {
    const windowsVirtualKeyCode = { Enter: 13, Tab: 9, Escape: 27, ArrowDown: 40, ArrowUp: 38, k: 75 }[key];
    await cdp("Input.dispatchKeyEvent", { type: "keyDown", key, code, modifiers, windowsVirtualKeyCode, ...(key === "Enter" ? { text: "\r" } : {}) });
    await cdp("Input.dispatchKeyEvent", { type: "keyUp", key, code, modifiers, windowsVirtualKeyCode });
  };
  const input = async (value) => {
    await evaluate(`(() => {
      const input = document.querySelector('.palette input');
      input.value = ${JSON.stringify(value)};
      input.dispatchEvent(new Event('input', { bubbles: true }));
    })()`);
  };
  for (const theme of ["light", "dark"]) {
    await cdp("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }] });
    await waitFor(`document.documentElement.dataset.theme === '${theme}'`);
    await key("k", "KeyK", 4);
    await waitFor("document.activeElement === document.querySelector('.palette input')");
    assert.equal(await evaluate("document.querySelector('.palette input').getAttribute('aria-label')"), "Search pages, collections, posts");
    assert.equal(await evaluate("document.elementFromPoint(innerWidth / 2, 20)?.classList.contains('palette-backdrop')"), true, "Backdrop must cover the breadcrumb header");
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.palette input')).borderTopWidth"), "0px");
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.palette input')).outlineStyle"), "none");
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.palette-search')).borderBottomColor"), theme === "dark" ? "rgb(114, 216, 255)" : "rgb(0, 90, 163)");
    await key("ArrowDown", "ArrowDown");
    await waitFor("document.querySelector('.palette li button')?.getAttribute('aria-selected') === 'true'");
    await key("ArrowDown", "ArrowDown");
    await waitFor("document.querySelectorAll('.palette li button')[1]?.getAttribute('aria-selected') === 'true'");
    await key("ArrowUp", "ArrowUp");
    await waitFor("document.querySelector('.palette li button')?.getAttribute('aria-selected') === 'true'");
    assert.equal(await evaluate("document.activeElement === document.querySelector('.palette input')"), true);
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.palette')).backgroundColor"), theme === "dark" ? "rgb(17, 28, 46)" : "rgb(255, 255, 255)");
    assert.ok(await evaluate("document.querySelectorAll('.palette li button').length > 0"));
    const shot = await cdp("Page.captureScreenshot", { format: "png" });
    await writeFile(`_temp/search-palette-${theme}.png`, Buffer.from(shot.data, "base64"));
    await key("ArrowUp", "ArrowUp");
    await waitFor("document.querySelector('.palette li:last-child button')?.getAttribute('aria-selected') === 'true'");
    await key("ArrowDown", "ArrowDown");
    await waitFor("document.querySelector('.palette li button')?.getAttribute('aria-selected') === 'true'");
    await key("ArrowDown", "ArrowDown");
    const selectedLabel = await evaluate("document.querySelector('.palette button[aria-selected=true] span').textContent");
    await key("Enter", "Enter");
    await waitFor("!document.querySelector('.palette')");
    assert.ok((await evaluate("document.querySelector('main h2').textContent")).includes(selectedLabel));
    await key("k", "KeyK", 4);
    await waitFor("document.activeElement === document.querySelector('.palette input')");
    await input("rigel-no-such-result-xyz");
    await waitFor("document.querySelector('.palette .empty')?.textContent === 'No results'");
    await key("ArrowDown", "ArrowDown");
    await key("Enter", "Enter");
    assert.equal(await evaluate("!!document.querySelector('.palette')"), true);
    await input("Page");
    await waitFor("document.querySelector('.palette .hint')?.textContent === 'Page'");
    await key("Tab", "Tab");
    await waitFor("document.activeElement === document.querySelector('.palette li button')");
    assert.equal(await evaluate("getComputedStyle(document.activeElement).outlineWidth"), "3px");
    await waitFor(`getComputedStyle(document.activeElement).backgroundColor === '${theme === "dark" ? "rgb(6, 38, 68)" : "rgb(217, 244, 255)"}'`);
    await key("Enter", "Enter");
    await waitFor("!document.querySelector('.palette')");
    await evaluate("document.querySelector('.search-trigger').click()");
    await waitFor("!!document.querySelector('.palette')");
    assert.equal(await evaluate("document.querySelector('.palette input').value"), "");
    await key("Escape", "Escape");
    await waitFor("!document.querySelector('.palette')");
  }
  await cdp("Emulation.setDeviceMetricsOverride", { width: 375, height: 667, deviceScaleFactor: 1, mobile: false });
  await evaluate("document.querySelector('.search-trigger').click()");
  await waitFor("!!document.querySelector('.palette')");
  assert.equal(await evaluate(`(() => {
    const palette = document.querySelector('.palette');
    const box = palette.getBoundingClientRect();
    return box.left >= 0 && box.right <= innerWidth && box.bottom <= innerHeight && palette.scrollWidth <= palette.clientWidth;
  })()`), true);
  await evaluate("document.querySelector('.palette-backdrop').click()");
  await waitFor("!document.querySelector('.palette')");
  await cdp("Emulation.clearDeviceMetricsOverride");
  await cdp("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "light" }] });
  await waitFor("document.documentElement.dataset.theme === 'light'");
  console.log("PASS: search palette light/dark, ring-free input with focus divider, ArrowUp/Down wrapping + Enter selection, Tab/Enter, empty state, Escape and mobile fit");
}

export async function openProperties({ evaluate, waitFor }) {
  await waitFor("!!document.querySelector('[aria-label=\"Toggle properties panel\"]')");
  await evaluate(`(() => { const toggle = document.querySelector('[aria-label="Toggle properties panel"]'); if (toggle?.getAttribute('aria-pressed') === 'false') toggle.click(); })()`);
  await waitFor("!!document.querySelector('.schema-panel')");
}

export async function chooseSelect({ evaluate, waitFor }, selector, label) {
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  await waitFor("!!document.querySelector('.select-menu:popover-open')");
  await evaluate(`(() => { const option = [...document.querySelectorAll('.select-menu:popover-open [role=option]')].find(option => option.querySelector('span').textContent === ${JSON.stringify(label)}); if (!option) throw new Error('Missing select option: ' + ${JSON.stringify(label)}); option.click(); })()`);
  await waitFor("!document.querySelector('.select-menu:popover-open')");
}

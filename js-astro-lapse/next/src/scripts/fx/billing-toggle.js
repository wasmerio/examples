// Monthly / Annual billing switch (Framer page variables "Billing Monthly" /
// "Billing Annual"). Mounted on any element holding buttons with
// data-billing="monthly|annual". A choice updates, page-wide:
//   - every [data-price-monthly][data-price-annual] element's text
//   - every [data-billing-state] element's attribute (for CSS hooks)
//   - aria-pressed on every billing button
// so several toggles and a comparison table stay in sync. Swaps are instant,
// as in Framer (visibility variables, no transition).
function apply(period) {
  const key = period === 'annual' ? 'priceAnnual' : 'priceMonthly';
  for (const el of document.querySelectorAll('[data-price-monthly][data-price-annual]')) {
    el.textContent = el.dataset[key];
  }
  for (const el of document.querySelectorAll('[data-billing-state]')) el.dataset.billingState = period;
  for (const b of document.querySelectorAll('button[data-billing]')) {
    b.setAttribute('aria-pressed', String(b.dataset.billing === period));
  }
}

export function mount(root) {
  for (const b of root.querySelectorAll('button[data-billing]')) {
    b.addEventListener('click', () => apply(b.dataset.billing));
  }
}

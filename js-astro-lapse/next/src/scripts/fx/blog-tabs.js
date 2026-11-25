/**
 * Category tabs on /blog (the "UI/Blog Tab" buttons). A tab sets the category
 * filter; the list keeps the posts whose category contains it, and the empty
 * state shows when nothing is left. "All" clears the filter.
 *
 * Markup: the section carries data-fx="blog-tabs"; tabs are
 * <button data-tab="Data" aria-pressed>, cards [data-category], the empty
 * state [data-empty]. Without JavaScript every post shows, which is the
 * "All" state the page is rendered in.
 */
export function mount(root) {
  const tabs = Array.from(root.querySelectorAll('[data-tab]'));
  const cards = Array.from(root.querySelectorAll('[data-category]'));
  const empty = root.querySelector('[data-empty]');

  function select(value) {
    const wanted = value.toLowerCase();
    tabs.forEach((tab) => tab.setAttribute('aria-pressed', String(tab.dataset.tab === value)));
    let shown = 0;
    cards.forEach((card) => {
      const match = !wanted || card.dataset.category.toLowerCase().includes(wanted);
      card.hidden = !match;
      if (match) shown++;
    });
    if (empty) empty.hidden = shown > 0;
  }

  tabs.forEach((tab) => tab.addEventListener('click', () => select(tab.dataset.tab)));
}

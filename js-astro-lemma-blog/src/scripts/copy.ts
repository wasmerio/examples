/**
 * A copy of part of the page, for showing it again elsewhere (sidenotes,
 * link previews). Ids are removed (they would repeat; MathJax's <use>
 * references still find the original glyphs), as are footnote back links.
 * Nothing in it takes keyboard focus, unless the copy is the only one shown
 * (`focusable`: sidenotes, whose list is hidden).
 */
export function displayCopy<T extends Element>(el: T, { focusable = false } = {}): T {
  const copy = el.cloneNode(true) as T;
  copy.removeAttribute('id');
  for (const node of copy.querySelectorAll('[id]')) node.removeAttribute('id');
  for (const back of copy.querySelectorAll('[data-footnote-backref]')) back.remove();
  if (!focusable) for (const node of copy.querySelectorAll<HTMLElement | SVGElement>('a, [tabindex], button')) node.setAttribute('tabindex', '-1');
  return copy;
}

/** A zero-size inline box sitting on the text baseline; its bottom is the baseline. */
export function baselineMark() {
  const mark = document.createElement('span');
  mark.className = 'baseline-mark';
  mark.setAttribute('aria-hidden', 'true');
  return mark;
}

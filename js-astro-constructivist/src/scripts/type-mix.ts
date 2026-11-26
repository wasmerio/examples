// @env browser
import { seededRandom } from '../utils/seed'

export function initTypeMix(): void {
  const heading = document.querySelector<HTMLElement>('[data-type-mix]')
  if (!heading || heading.dataset.typeMixed !== 'true' || heading.dataset.typeShuffle !== 'true')
    return
  const glyphs = [
    ...heading.querySelectorAll<HTMLElement>('[data-type-glyph]'),
  ]
  const button = document.querySelector<HTMLButtonElement>('[data-type-remix]')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  let seed = Number(heading.dataset.typeSeed) || 0
  let animations: Animation[] = []
  const remix = () => {
    for (const animation of animations)
      animation.cancel()
    const random = seededRandom(++seed)
    for (const glyph of glyphs)
      glyph.dataset.typeVariant = String(Math.floor(random() * 4))
    heading.dataset.typeIteration = String(seed)
    if (reduced.matches)
      return
    animations = glyphs.map((glyph, index) => glyph.animate([
      { transform: `translateY(${index % 2
        ? '-'
        : ''}12%) rotate(${random() * 8 - 4}deg)` },
      { transform: 'translateY(0) rotate(0)' },
    ], { duration: 400, delay: random() * 140, easing: 'cubic-bezier(.2,.7,.2,1)' }))
  }
  button?.addEventListener('click', remix)
  reduced.addEventListener('change', () => {
    for (const animation of animations)
      animation.cancel()
  })
  // One random arrangement per visit; fixed character cells prevent layout shifts.
  const enter = () => {
    if (reduced.matches)
      return
    seed += crypto.getRandomValues(new Uint16Array(1))[0]!
    remix()
  }
  if (document.documentElement.classList.contains('loader-active'))
    document.addEventListener('portfolio:enter', enter, { once: true })
  else
    enter()
}

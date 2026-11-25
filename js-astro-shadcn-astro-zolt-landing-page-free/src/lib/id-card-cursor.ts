// Bridges IdCard's r3f pointer-over/out (raycast-based) into CustomCursor's hover state.
// CustomCursor decides pointer-vs-default via real DOM hit-testing (event.target.closest), but
// IdCard's wrapper is pointer-events-none (see its own comment) so the browser's hit-test never
// lands on it — this module-level flag is the only way the two can communicate.
let hovering = false

export const setIdCardHover = (value: boolean) => {
  hovering = value
}

export const isIdCardHover = () => hovering

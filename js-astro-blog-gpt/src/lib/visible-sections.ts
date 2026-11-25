/** A section includes its heading and body up to the next heading in the outline. */
export function visibleSections(
  starts: number[],
  end: number,
  top: number,
  bottom: number,
) {
  return starts
    .map((start, index) => ({ index, start, end: starts[index + 1] ?? end }))
    .filter((section) => section.start < bottom && section.end > top)
    .map((section) => section.index);
}

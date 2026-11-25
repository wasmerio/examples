/** Required nodes belong to the theme markup, not optional integrations. */
export function requiredElement<T extends HTMLElement = HTMLElement>(
  selector: string,
  parent: ParentNode = document,
): T {
  const element = parent.querySelector<T>(selector);
  if (!element) throw new Error(`Missing Solitude element: ${selector}`);
  return element;
}

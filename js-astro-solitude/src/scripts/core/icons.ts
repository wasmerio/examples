import type { RuntimeIconName } from '@/lib/icons';

/** Resolve the current page's templates after every Astro navigation. */
export function createIcon(name: RuntimeIconName): SVGSVGElement {
  const template = document.getElementById(`solitude-icon-${name}`);
  const icon =
    template instanceof HTMLTemplateElement
      ? template.content.firstElementChild
      : null;
  if (!(icon instanceof SVGSVGElement)) {
    throw new Error(`Missing runtime icon template: ${name}`);
  }
  return icon.cloneNode(true) as SVGSVGElement;
}

export function iconMarkup(name: RuntimeIconName): string {
  return createIcon(name).outerHTML;
}

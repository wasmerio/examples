import type { Element } from 'hast';

export function getClasses(node: Element): string[] {
  const cls = node.properties?.class ?? node.properties?.className;
  if (!cls) return [];
  if (Array.isArray(cls)) return cls.map(String);
  return String(cls).split(/\s+/).filter(Boolean);
}

export function hasClass(node: Element, name: string): boolean {
  return getClasses(node).includes(name);
}

export function addClass(node: Element, name: string): void {
  const classes = getClasses(node);
  if (classes.includes(name)) return;
  node.properties = {
    ...node.properties,
    class: [...classes, name],
    className: undefined,
  };
}

export function setClasses(node: Element, classes: string[]): void {
  node.properties = {
    ...node.properties,
    class: classes,
    className: undefined,
  };
}

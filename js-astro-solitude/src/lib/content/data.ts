import type { PageData } from '@/types/page-data';

// Front matter `data: profile` resolves src/data/profile.ts at build time.
const modules = import.meta.glob('/src/data/**/*.ts', {
  eager: true,
  import: 'default',
});
const dataFields = {
  about: 'sections',
  links: 'links',
  kit: 'groups',
  brevity: 'items',
} as const;

export function pageData<K extends keyof PageData>(
  name: unknown,
  fallback: K,
): PageData[K] {
  const key = String(name ?? fallback).replace(/\.ts$/, '');
  const path = `/src/data/${key}.ts`;
  const value = modules[path];
  if (!value) throw new Error(`Missing page data: ${path}`);
  const field = dataFields[fallback];
  if (typeof value !== 'object' || !Array.isArray(Reflect.get(value, field))) {
    throw new Error(
      `Page data ${path} requires a ${field} array for ${fallback}`,
    );
  }
  return value as PageData[K];
}

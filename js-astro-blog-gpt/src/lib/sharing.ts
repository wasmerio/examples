export type ShareValues = Record<
  'title' | 'description' | 'author' | 'blog' | 'url' | 'image' | 'text',
  string
>;
export function shareTemplate(
  template: string,
  values: ShareValues,
  encode = false,
) {
  return template.replace(
    /\{(title|description|author|blog|url|image|text)\}/g,
    (_, key: keyof ShareValues) =>
      encode ? encodeURIComponent(values[key]) : values[key],
  );
}
export function shareHref(template: string, values: ShareValues) {
  const href = shareTemplate(template, values, true);
  if (!/^(https?:|mailto:)/i.test(href))
    throw new Error('Sharing href must use https, http, or mailto.');
  return href;
}

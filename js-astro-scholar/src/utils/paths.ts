const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

export const url = (path: string) => {
  if (/^(https?:|mailto:|tel:)/.test(path)) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
};

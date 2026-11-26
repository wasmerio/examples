export interface Bind {
  doc?: string;
  base: string;
}

export function anchor(bind: Bind | undefined, key: string): string | undefined {
  if (!bind) return undefined;
  return bind.base ? `${bind.base}.${key}` : key;
}

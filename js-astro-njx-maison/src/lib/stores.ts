/**
 * Client state — every piece in the archive is one-of-one, so the bag and
 * the vault are simple lists of product handles persisted to localStorage.
 * The patron session and preferences (currency, presentation case, notices)
 * persist the same way; prices convert live from the USD base.
 */
import { persistentAtom } from '@nanostores/persistent';

const json = { encode: JSON.stringify, decode: JSON.parse };

/** Acquisition bag — unique handles (each piece exists once). */
export const bag = persistentAtom<string[]>('njx-maison-bag', [], json);
/** Private vault — saved pieces. */
export const vault = persistentAtom<string[]>('njx-maison-vault', [], json);

export function toggleIn(store: typeof bag, handle: string): boolean {
  const list = store.get();
  const added = !list.includes(handle);
  store.set(added ? [...list, handle] : list.filter((h) => h !== handle));
  return added;
}

export interface PatronSession {
  id: string; // 'p1' | 'p2' | custom
  name: string;
  status: string;
  registry: string;
  since: string;
}
export const patron = persistentAtom<PatronSession | null>('njx-maison-patron', null, json);

export type Currency = 'USD' | 'EUR' | 'GBP';
export const CURRENCIES: Record<Currency, { sign: string; k: number }> = {
  USD: { sign: '$', k: 1 },
  EUR: { sign: '€', k: 0.92 },
  GBP: { sign: '£', k: 0.79 },
};
export const currency = persistentAtom<Currency>('njx-maison-currency', 'USD');
export const packaging = persistentAtom<string>('njx-maison-pack', 'Mahogany');
export const notify = persistentAtom<string>('njx-maison-notify', 'on');

export function fmtMoney(usd: number, cur: Currency): string {
  const c = CURRENCIES[cur] ?? CURRENCIES.USD;
  return c.sign + Math.round(usd * c.k).toLocaleString('en-US');
}

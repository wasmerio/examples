/**
 * Client-side cart on nanostores (persisted to localStorage).
 * Pages render server-side; the cart drawer hydrates on the client.
 */
import { persistentAtom } from '@nanostores/persistent';
import type { CartLine } from './commerce/types';

export const cartLines = persistentAtom<CartLine[]>('njx-store-cart', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function addLine(line: CartLine) {
  const lines = [...cartLines.get()];
  const existing = lines.find((l) => l.variantId === line.variantId);
  if (existing) existing.quantity += line.quantity;
  else lines.push(line);
  cartLines.set(lines);
}

export function setQuantity(variantId: string, quantity: number) {
  const lines = cartLines
    .get()
    .map((l) => (l.variantId === variantId ? { ...l, quantity } : l))
    .filter((l) => l.quantity > 0);
  cartLines.set(lines);
}

export function clearCart() {
  cartLines.set([]);
}

export function cartCount(): number {
  return cartLines.get().reduce((n, l) => n + l.quantity, 0);
}

export function cartTotal(): number {
  return cartLines.get().reduce((n, l) => n + l.price.amount * l.quantity, 0);
}

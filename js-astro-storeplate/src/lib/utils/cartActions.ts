import Cookies from "js-cookie";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "@/lib/shopify";

export async function addItem(selectedVariantId: string | undefined) {
  let cartId = Cookies.get("cartId");
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  if (!cartId || !cart) {
    cart = await createCart();
    cartId = cart.id;
    Cookies.set("cartId", cartId);
  }

  if (!selectedVariantId) {
    return "Missing product variant ID";
  }

  try {
    await addToCart(cartId, [
      { merchandiseId: selectedVariantId, quantity: 1 },
    ]);
    // return (window.location.href = "/");
  } catch (e) {
    return `Error adding item to cart: ${e}`;
  }
}

export async function removeItem(lineId: string) {
  const cartId = Cookies.get("cartId");

  if (!cartId) {
    return "Missing cart ID";
  }

  try {
    await removeFromCart(cartId, [lineId]);
    // return (window.location.href = "/");
  } catch (e) {
    return `Error removing item from cart: ${e}`;
  }
}

export async function updateItemQuantity(payload: {
  lineId: string;
  variantId: string;
  quantity: number;
}) {
  const cartId = Cookies.get("cartId");

  if (!cartId) {
    return "Missing cart ID";
  }

  const { lineId, variantId, quantity } = payload;

  try {
    if (quantity === 0) {
      await removeFromCart(cartId, [lineId]);
      // return (window.location.href = "/");
    }

    await updateCart(cartId, [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity,
      },
    ]);
    // return (window.location.href = "/");
  } catch (e) {
    return `Error updating item quantity: ${e}`;
  }
}

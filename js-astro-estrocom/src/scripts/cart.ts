/**
 * Interface for items in the cart
 */
export interface CartItem {
  name: string;
  image: string;
  price: string;
  quantity?: number;
}

/**
 * Get the current items in the cart
 * @returns The current items in the cart
 */
export function getCartItems(): CartItem[] {
  const cartData = localStorage.getItem("cart");
  return cartData ? JSON.parse(cartData) : [];
}

/**
 * Save the items in the cart to local storage
 * @param items The items to save in the cart
 */
export function saveCartItems(items: CartItem[]): void {
  localStorage.setItem("cart", JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cartUpdated", { detail: items }));
}

/**
 * Add an item to the cart
 * @param item The item to add to the cart
 */
export function addItem(item: Omit<CartItem, "quantity">): void {
  const cartItems = getCartItems();
  const existingIndex = cartItems.findIndex((i) => i.name === item.name);

  if (existingIndex > -1) {
    cartItems[existingIndex].quantity = (cartItems[existingIndex].quantity || 1) + 1;
  } else {
    cartItems.push({ ...item, quantity: 1 });
  }

  saveCartItems(cartItems);
}

/**
 * Remove an item from the cart
 * @param index The index of the item to remove
 */
export function removeItem(index: number): void {
  const cartItems = getCartItems();
  cartItems.splice(index, 1);
  saveCartItems(cartItems);
}

/**
 * Update the quantity of an item in the cart
 * @param index The index of the item to update
 * @param change The change in quantity
 */
export function updateQuantity(index: number, change: number): void {
  const cartItems = getCartItems();
  if (cartItems[index]) {
    cartItems[index].quantity = (cartItems[index].quantity || 1) + change;

    if (cartItems[index].quantity! <= 0) {
      cartItems.splice(index, 1);
    }

    saveCartItems(cartItems);
  }
}

/**
 * Remove an item from the cart by name
 * @param name The name of the item to remove
 */
export function removeItemFromCart(name: string): void {
  const cartItems = getCartItems();
  const updatedCart = cartItems.filter(item => item.name !== name);
  saveCartItems(updatedCart);
}

/**
 * Update the quantity of an item in the cart by name
 * @param name The name of the item to update
 * @param newQuantity The new quantity of the item
 */
export function updateCartItemQuantity(name: string, newQuantity: number): void {
  const cartItems = getCartItems();
  const itemIndex = cartItems.findIndex(item => item.name === name);

  if (itemIndex > -1) {
    if (newQuantity <= 0) {
      cartItems.splice(itemIndex, 1);
    } else {
      cartItems[itemIndex].quantity = newQuantity;
    }
    saveCartItems(cartItems);
  }
}

/**
 * Calculate the total cost of the items in the cart
 * @param items The items in the cart
 * @returns The total cost of the items in the cart
 */
export function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const price = parseFloat(item.price.replace(/,/g, ""));
    const quantity = item.quantity || 1;
    return total + price * quantity;
  }, 0);
}

/**
 * Remove all items from the cart
 */
export function removeAll(): void {
  localStorage.removeItem("cart");
  saveCartItems([]);
}

/**
 * Render the cart items
 */
export function renderCart(): void {
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  if (!cartItemsContainer) return;

  const cartItems = getCartItems();

  if (cartCount) {
    cartCount.textContent = `CART (${cartItems.length})`;
  }

  cartItemsContainer.innerHTML = "";

  cartItems.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
  <div class="cart-item-info">
    <img
      class="cart-item-image"
      src="${item.image}"
      alt="${item.name}"
      width="200"
      height="200"
      loading="lazy"
    />
    <div class="cart-item-details">
      <strong>${item.name}</strong>
      <span>₹ ${item.price}</span>
    </div>
  </div>
  <div class="counter-wrapper" data-index="${index}">
    <button class="counter-btn decrease">-</button>
    <span class="counter-value">${item.quantity || 1}</span>
    <button class="counter-btn increase">+</button>
  </div>
`;
    cartItemsContainer.appendChild(itemDiv);
  });

  const total = calculateTotal(cartItems);
  if (cartTotal) {
    cartTotal.textContent = `₹${total.toLocaleString()}`;
  }

  document.querySelectorAll<HTMLElement>(".counter-wrapper").forEach((wrapper) => {
    const index = parseInt(wrapper.dataset.index || "0");
    const decreaseBtn = wrapper.querySelector<HTMLButtonElement>(".decrease");
    const increaseBtn = wrapper.querySelector<HTMLButtonElement>(".increase");

    if (decreaseBtn) {
      decreaseBtn.addEventListener("click", () => {
        updateQuantity(index, -1);
        renderCart();
      });
    }

    if (increaseBtn) {
      increaseBtn.addEventListener("click", () => {
        updateQuantity(index, 1);
        renderCart();
      });
    }
  });
}

/**
 * Initialize the cart
 */
export function initCart(): void {
  const removeAllBtn = document.getElementById("remove-all-btn");

  if (removeAllBtn) {
    removeAllBtn.addEventListener("click", () => {
      removeAll();
      renderCart();
    });
  }

  renderCart();
}

/**
 * Get the number of items in the cart
 * @returns The number of items in the cart
 */
export function getItemCount(): number {
  return getCartItems().length;
}

/**
 * Get the total cost of the items in the cart
 * @returns The total cost of the items in the cart
 */
export function getTotal(): number {
  return calculateTotal(getCartItems());
}

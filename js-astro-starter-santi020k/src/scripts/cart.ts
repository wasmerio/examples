const productRows = Array.from(
  document.querySelectorAll<HTMLElement>('[data-cart-row]')
)

const quantities = new Map<string, number>()
const storageKey = 'lumen-starter-cart'
const cartStatus = document.querySelector<HTMLElement>('[data-cart-status]')

const checkout = document.querySelector<HTMLButtonElement>(
  '[data-demo-checkout]'
)

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

try {
  const stored: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '{}')

  if (typeof stored === 'object' && stored !== null) {
    for (const row of productRows) {
      const id = row.dataset.cartRow
      const quantity: unknown = id ? Reflect.get(stored, id) : undefined

      if (
        id &&
        typeof quantity === 'number' &&
        Number.isInteger(quantity) &&
        quantity > 0 &&
        quantity <= 99
      )
        quantities.set(id, quantity)
    }
  }
} catch {
  /* Invalid or unavailable storage starts a fresh cart. */
}

const renderCart = () => {
  let count = 0
  let total = 0

  for (const row of productRows) {
    const quantity = quantities.get(row.dataset.cartRow ?? '') ?? 0

    row.hidden = quantity === 0

    row.querySelector('[data-cart-quantity]')?.replaceChildren(String(quantity))

    count += quantity

    total += quantity * Number(row.dataset.price)
  }

  document.querySelector('[data-cart-count]')?.replaceChildren(String(count))

  document
    .querySelector('[data-cart-total] [data-slot="stat-value"]')
    ?.replaceChildren(currency.format(total))

  const empty = document.querySelector<HTMLElement>('[data-cart-empty]')

  if (empty) empty.hidden = count > 0

  if (checkout) {
    checkout.disabled = count === 0

    checkout.classList.toggle('ui-button--disabled', count === 0)
  }

  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify(Object.fromEntries(quantities))
    )
  } catch {
    /* The cart remains usable in memory. */
  }
}

for (const button of document.querySelectorAll<HTMLButtonElement>(
  '[data-add-product]'
)) {
  button.addEventListener('click', () => {
    const id = button.dataset.addProduct

    if (!id) return

    const current = quantities.get(id) ?? 0

    if (current >= 99) {
      cartStatus?.replaceChildren(
        'The sample cart supports up to 99 of each item.'
      )

      return
    }

    quantities.set(id, current + 1)

    renderCart()

    cartStatus?.replaceChildren(
      'Added to your bag. Your subtotal has been updated.'
    )
  })
}

for (const button of document.querySelectorAll<HTMLButtonElement>(
  '[data-remove-product]'
)) {
  button.addEventListener('click', () => {
    const id = button.dataset.removeProduct

    if (!id) return

    quantities.delete(id)

    renderCart()

    cartStatus?.replaceChildren('Item removed from your bag.')

    document.querySelector<HTMLButtonElement>('[data-add-product]')?.focus()
  })
}

checkout?.addEventListener('click', () => {
  cartStatus?.replaceChildren(
    'This is a demo checkout. Your bag is ready to connect to a commerce provider. No order has been placed.'
  )
})

renderCart()

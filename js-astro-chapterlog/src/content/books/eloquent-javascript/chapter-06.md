---
sections:
  - "6.1 Event Handlers"
  - "6.2 Propagation"
  - "6.3 Default Actions"
  - "6.4 Debouncing"
---

## Event Handlers

**`addEventListener`** registers a function to be called when a specific event occurs on a node. You can attach multiple handlers to the same event. `removeEventListener` detaches them — but only if you pass the exact same function reference.

The handler receives an **event object** with details like `target` (which element triggered it), `type`, and event-specific data like `key` or `clientX`.

## Propagation

Events **bubble** up the DOM tree by default. A click on a button also fires on its parent div, then on the body, and so on. This is useful — you can handle events on a parent instead of attaching handlers to every child (**event delegation**).

`event.stopPropagation()` stops the bubbling. **Capturing** is the opposite phase — events travel down before bubbling up. Pass `{ capture: true }` to listen during the capture phase.

## Default Actions

Some events have built-in browser behavior. Clicking a link navigates. Submitting a form sends a request. **`event.preventDefault()`** stops this default behavior while still letting your handler run.

Not all events are cancelable. Check `event.cancelable` if you're unsure. Common use cases: custom form validation, preventing navigation, handling keyboard shortcuts.

## Debouncing

Rapid-fire events like `scroll`, `mousemove`, and `input` can fire dozens of times per second. Running expensive logic on each one kills performance.

**Debouncing** waits until the events stop firing for a set period, then runs the handler once. **Throttling** runs the handler at most once per interval, regardless of how many events fire. Use `setTimeout` for debouncing, track timestamps for throttling. Both are essential for scroll handlers, resize listeners, and search-as-you-type inputs.

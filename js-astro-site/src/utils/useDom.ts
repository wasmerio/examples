export function attach(callback: () => any) {
  document.addEventListener("astro:after-swap", callback);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

export function detach(callback: () => any) {
  document.addEventListener("astro:before-swap", callback);
}

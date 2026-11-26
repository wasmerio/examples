// Also registered in `editor-live-sync.js`. Enhancement only: with JS off the form is a plain POST.
export function setupPageFeedback(root: HTMLElement): void {
  if (root.hasAttribute("data-feedback-initialized")) return;
  root.setAttribute("data-feedback-initialized", "");

  const form = root.querySelector<HTMLFormElement>("form");
  const status = root.querySelector<HTMLElement>(".page-feedback-status");

  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    const submitter = (event as SubmitEvent).submitter as HTMLButtonElement | null;

    event.preventDefault();

    const body = new FormData(form);

    if (submitter?.name) body.append(submitter.name, submitter.value);

    // Advisory: a failed POST still shows the thank-you state.
    fetch(form.action, { method: "post", body }).catch(() => {});

    root.setAttribute("data-voted", submitter?.value || "yes");
    status.hidden = false;
    status.focus();
  });
}

export function setupAllPageFeedback(): void {
  document.querySelectorAll<HTMLElement>(".page-feedback").forEach(setupPageFeedback);
}

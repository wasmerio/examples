/* Forms without an endpoint run in demo mode: they validate and confirm, but send nothing. */
document.querySelectorAll<HTMLFormElement>("form[data-demo-form]").forEach((form) => {
  const status = form.querySelector<HTMLElement>("[data-form-status]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.reset();
    if (status) status.textContent = form.dataset.success ?? "Thanks.";
  });
});

// Style playground and theme generator (_partials/playground.html): every change is applied at once
// (window.playground, from hooks/head-end.html), saved in the browser, and written out as the hugo.toml lines that
// make it a site's look. On the generator page also: the current preset as a copy under a name of your own, to change
// in your site's files. "Back to the site's settings" forgets it all.
const form = document.querySelector(".playground");

if (form) {
  const has = (name) => Boolean(form.elements[name]);
  const saved = playground.load();
  const choices = {
    preset: form.dataset.preset,
    scheme: form.dataset.scheme,
    font: "",
    background: "",
    name: "my-preset",
    ...saved,
  };
  // A saved preset without a saved scheme shows with its own (as head-end.html applies it)
  if (saved.preset && !saved.scheme) choices.scheme = playground.presets[saved.preset].scheme;

  function fillForm() {
    for (const name of ["preset", "scheme", "font", "background", "name"]) if (has(name)) form.elements[name].value = choices[name];
  }

  function render() {
    const lines = ["[params.style]", `  preset = "${choices.preset}"`, `  scheme = "${choices.scheme}"`];
    if (choices.font) lines.push("[params.fonts]", `  body = "${choices.font}"`);
    if (choices.background) lines.push("[params.background]", `  light = "${choices.background}"`, `  dark = "${choices.background}"`);
    form.parentElement.querySelector(".playground-config code").textContent = lines.join("\n");
  }

  function download(name, text) {
    const link = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([text], { type: "text/plain" })),
      download: name,
    });
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  form.addEventListener("change", (event) => {
    const { name, value } = event.target;
    if (name === "name") choices.name = value.toLowerCase().replace(/[^a-z0-9-]/g, "-") || "my-preset";
    else choices[name] = value;
    // A new preset brings its own colour scheme; it can be changed afterwards
    if (name === "preset") choices.scheme = playground.presets[value].scheme;
    playground.apply(choices);
    playground.save(choices);
    fillForm();
    render();
  });

  document.querySelector(".playground-reset").addEventListener("click", () => {
    try { localStorage.removeItem(playground.key); } catch {}
    location.reload();
  });

  // The preset as a starting point of your own: its CSS with its name replaced, and its data file
  document.querySelector(".playground-download-preset")?.addEventListener("click", async () => {
    const sources = JSON.parse(document.getElementById("playground-sources").textContent);
    const source = sources[choices.preset];
    const id = choices.name;
    const css = (await (await fetch(source.css)).text()).replaceAll(`data-preset="${choices.preset}"`, `data-preset="${id}"`);
    const { name, weight, ...rest } = source.data;
    const toml = [`name = "${id}"`, "weight = 200", ...Object.entries(rest).map(([k, v]) => `${k} = ${JSON.stringify(v)}`)].join("\n") + "\n";
    download(`${id}.css`, `/* assets/css/presets/${id}.css: made from the ${name} preset */\n` + css);
    download(`${id}.toml`, `# data/fieldnotes/presets/${id}.toml\n` + toml);
  });

  fillForm();
  render();
}

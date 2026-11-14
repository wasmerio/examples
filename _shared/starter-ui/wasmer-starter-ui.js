// Framework-neutral extension of the Wasmer design system. See DESIGN.md for source references.
// Do not edit generated copies in individual starters; run scripts/sync-starter-ui.mjs.
export const VERSION = "1.0.0";

if (typeof window !== "undefined" && !customElements.get("wasmer-card")) {
  const tokens = `
    :host{box-sizing:border-box;font-family:Gilroy,ui-sans-serif,system-ui,-apple-system,sans-serif;
      --ink:#0f0518;--muted:rgba(15,5,24,.5);--surface:#fbfbfc;--stroke:rgba(15,5,24,.2);
      --primary:#171717;--on-primary:#fafafa;--input:#e5e5e5;--focus:rgba(96,93,233,.5);
      --red:#ef476f;--green:#02c39a;--orange:#f38d2c;color:var(--ink);font-size:16px;line-height:1.5}
    *,*::before,*::after{box-sizing:border-box}`;
  const mount = (element, style, content) => {
    element.attachShadow({mode:"open",delegatesFocus:true}).innerHTML = `<style>${tokens}${style}</style>${content}`;
  };

  class Starter extends HTMLElement {
    constructor() {
      super();
      mount(this, `:host{display:block;min-height:100vh;background:linear-gradient(180deg,#eff1f6,#fcfcfe)}
        main{width:100%;max-width:704px;margin:auto;padding:48px 24px}
        @media(min-width:1152px){main{padding:80px 32px}}`, "<main><slot></slot></main>");
    }
  }
  class Card extends HTMLElement {
    constructor() {
      super();
      mount(this, `:host{display:block;min-width:0}section{display:flex;flex-direction:column;align-items:stretch;gap:24px;
        padding:32px 24px;border:1px solid var(--stroke);border-radius:12px;background:var(--surface);
        box-shadow:0 .40371px 7.42857px rgba(35,16,68,0),0 1.11621px 10.02857px rgba(35,16,68,.01),
          0 2.6874px 15.79314px rgba(35,16,68,.05),0 8.91428px 38.62857px rgba(35,16,68,.05)}
        @media(min-width:1152px){section{padding:32px}}
        header,footer{display:flex;flex-direction:column;gap:12px;min-width:0}
        .content{display:flex;flex-direction:column;gap:16px;min-width:0}
        ::slotted([slot=footer]){margin:0}`, `<section><header><slot name="header"></slot></header>
        <div class="content"><slot></slot></div><footer><slot name="footer"></slot></footer></section>`);
    }
  }
  class Title extends HTMLElement {
    constructor() {
      super();
      mount(this, ":host{display:block}h1{font-size:20px;line-height:1.4;font-weight:600;margin:0;overflow-wrap:anywhere}", "<h1><slot></slot></h1>");
    }
  }
  class Text extends HTMLElement {
    constructor() {
      super();
      mount(this, ":host{display:block;color:var(--muted)}p{margin:0;overflow-wrap:anywhere}", "<p><slot></slot></p>");
    }
  }
  class Stack extends HTMLElement {
    constructor() {
      super();
      mount(this, ":host{display:flex;flex-wrap:wrap;align-items:center;gap:12px;min-width:0}:host([vertical]){flex-direction:column;align-items:stretch}", "<slot></slot>");
    }
  }
  class Badge extends HTMLElement {
    constructor() {
      super();
      mount(this, ":host{display:inline-flex;width:fit-content;border:1px solid var(--input);border-radius:12px;padding:2px 8px;font-size:12px;font-weight:500;line-height:16px}", "<slot></slot>");
    }
  }
  class Notice extends HTMLElement {
    static observedAttributes = ["variant"];
    constructor() {
      super();
      mount(this, `:host{display:block}.notice{display:flex;gap:16px;border:1px solid var(--stroke);border-radius:2px;padding:16px;font-size:14px}
        :host([variant=success]) .notice{background:linear-gradient(180deg,#d9f6ea,#f7fdfb 150%);border-color:rgba(2,195,154,.3);color:var(--green)}
        :host([variant=error]) .notice{background:linear-gradient(180deg,#fde3e9,#fffbfc 150%);border-color:rgba(239,71,111,.3);color:var(--red)}
        :host([variant=warning]) .notice{background:linear-gradient(180deg,#fef0e0,#fffdfb 150%);border-color:rgba(243,141,44,.3);color:var(--orange)}
        .icon{flex-shrink:0;display:flex}.copy{min-width:0;overflow-wrap:anywhere}`, '<div class="notice" role="status"><span class="icon" aria-hidden="true"></span><div class="copy"><slot></slot></div></div>');
    }
    connectedCallback() { this.attributeChangedCallback(); }
    attributeChangedCallback() {
      this.shadowRoot.querySelector(".notice").setAttribute("role", this.getAttribute("variant") === "error" ? "alert" : "status");
      const shapes = {
        success:'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
        error:'<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4m0 4h.01"/>',
        warning:'<circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>',
        default:'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 3h.01"/>',
      };
      this.shadowRoot.querySelector(".icon").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${shapes[this.getAttribute("variant")] || shapes.default}</svg>`;
    }
  }
  class Action extends HTMLElement {
    static observedAttributes = ["href","target","disabled","loading","variant","type"];
    constructor() {
      super();
      mount(this, `:host{display:inline-flex;max-width:100%}button,a{font:inherit;font-weight:600;display:inline-flex;align-items:center;justify-content:center;
        gap:8px;height:32px;padding:6px 10px;border:0;border-radius:9999px;background:var(--primary);color:var(--on-primary);
        text-decoration:none;cursor:pointer;white-space:nowrap;transition:background-color 150ms}
        button:hover,a:hover{background:rgba(23,23,23,.9)}button:focus-visible,a:focus-visible{outline:2px solid #0a0a0a;outline-offset:2px}
        :host([variant=outline]) button,:host([variant=outline]) a{border:1px solid var(--input);background:white;color:#171717}
        :host([variant=outline]) button:hover,:host([variant=outline]) a:hover{background:#f5f5f5}
        :host([size=lg]) button,:host([size=lg]) a{height:44px;padding:0 32px}
        :host([wrap]) button,:host([wrap]) a{height:auto;min-height:32px;white-space:normal;overflow-wrap:anywhere;max-width:100%}
        button:disabled,a[aria-disabled=true]{background:rgba(15,5,24,.1);color:rgba(15,5,24,.7);cursor:not-allowed}
        .spinner{width:14px;height:14px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:spin 800ms linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.spinner{animation:none}}`, "<button type=button><slot></slot></button>");
      this.shadowRoot.addEventListener("click", event => {
        if (this.disabled || this.loading) { event.preventDefault(); event.stopImmediatePropagation(); return; }
        const form = this.closest("form");
        if (!this.hasAttribute("href") && this.getAttribute("type") === "submit" && form) {
          const invalid = [...form.elements].find(control => typeof control.reportValidity === "function" && !control.reportValidity());
          if (!invalid) form.requestSubmit();
        }
      });
    }
    get disabled() { return this.hasAttribute("disabled"); }
    set disabled(value) { this.toggleAttribute("disabled", Boolean(value)); }
    get loading() { return this.hasAttribute("loading"); }
    set loading(value) { this.toggleAttribute("loading", Boolean(value)); }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { this.render(); }
    render() {
      const root = this.shadowRoot;
      const href = this.getAttribute("href");
      const tag = href ? "a" : "button";
      let control = root.querySelector("button,a");
      if (control.localName !== tag) { const replacement = document.createElement(tag); control.replaceWith(replacement); control = replacement; }
      control.innerHTML = this.loading ? '<span class="spinner" aria-hidden="true"></span><slot></slot>' : "<slot></slot>";
      if (href) {
        try {
          const url = new URL(href, document.baseURI);
          if (!["http:","https:"].includes(url.protocol)) throw new Error("Unsupported link scheme");
          control.href = url.href;
        } catch { control.removeAttribute("href"); }
        if (this.getAttribute("target") === "_blank") { control.target = "_blank"; control.rel = "noopener noreferrer"; }
        else { control.removeAttribute("target"); control.removeAttribute("rel"); }
        control.setAttribute("aria-disabled", String(this.disabled || this.loading));
      } else { control.type = "button"; control.disabled = this.disabled || this.loading; }
      control.setAttribute("aria-busy", String(this.loading));
    }
  }
  class Input extends HTMLElement {
    static formAssociated = true;
    static observedAttributes = ["name","label","placeholder","required","maxlength","type","disabled","value"];
    constructor() {
      super();
      this.internals = this.attachInternals();
      mount(this, `:host{display:block;min-width:0}label{display:grid;gap:8px;font-size:14px;font-weight:500}
        input{font:inherit;font-weight:400;width:100%;height:40px;padding:4px 12px;border:1px solid var(--input);border-radius:6px;background:white;color:var(--ink);outline:none}
        input:hover{background:rgba(15,5,24,.05);border-color:rgba(15,5,24,.2)}
        input:focus-visible{border-color:#3734a5;box-shadow:0 0 0 3px var(--focus);background:rgba(96,93,233,.1);color:#3734a5}
        input:disabled{opacity:.5;cursor:not-allowed}
        input:invalid:not(:placeholder-shown){border-color:var(--red)}`, '<label><span></span><input></label>');
      this.control = this.shadowRoot.querySelector("input");
      this.control.addEventListener("input", () => this.syncValidity());
      this.control.addEventListener("change", () => this.syncValidity());
      this.control.addEventListener("keydown", event => {
        if (event.key === "Enter" && this.reportValidity()) {
          event.preventDefault();
          this.closest("form")?.requestSubmit();
        }
      });
    }
    connectedCallback() { this.attributeChangedCallback(); }
    attributeChangedCallback() {
      if (!this.control) return;
      for (const attr of ["name","placeholder","required","maxlength","type","disabled"]) {
        if (this.hasAttribute(attr)) this.control.setAttribute(attr, this.getAttribute(attr));
        else this.control.removeAttribute(attr);
      }
      if (this.hasAttribute("value")) this.control.value = this.getAttribute("value");
      this.shadowRoot.querySelector("span").textContent = this.getAttribute("label") || "";
      this.control.setAttribute("aria-label", this.getAttribute("label") || this.getAttribute("name") || "Input");
      this.syncValidity();
    }
    syncValidity() {
      this.internals.setFormValue(this.control.value);
      this.internals.setValidity(this.control.validity, this.control.validationMessage, this.control);
    }
    // Autofill and host integrations can update a native input before an input event.
    reportValidity() { this.syncValidity(); return this.internals.reportValidity(); }
    formResetCallback() { this.control.value = this.getAttribute("value") || ""; this.syncValidity(); }
    formDisabledCallback(disabled) { this.control.disabled = disabled; }
    get value() { return this.control.value; }
    set value(value) { this.control.value = value; this.syncValidity(); }
  }
  for (const [name, component] of Object.entries({starter:Starter,card:Card,title:Title,text:Text,stack:Stack,badge:Badge,notice:Notice,action:Action,input:Input})) {
    customElements.define(`wasmer-${name}`, component);
  }
}

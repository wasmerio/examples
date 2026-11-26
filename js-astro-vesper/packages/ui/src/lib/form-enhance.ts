/**
 * The opt-in form script (Form's enhance="fetch"; design, "Opt-in script"). Form's processed <script> calls start();
 * Astro bundles this module once per page however many forms use it. No framework.
 *
 * - It binds every form[data-enhance="fetch"] once (data-enhance-bound), on load and again on astro:page-load, so
 *   ClientRouter navigation binds new forms and never one twice. Every lookup is inside the form, so two forms on one
 *   page never touch each other.
 * - Only method="post" forms with fetch and FormData are enhanced; any other form submits as usual. If this script
 *   never loads, the form posts as usual, with the browser's own validation (novalidate is set only here).
 * - On submit: each field is checked with the browser's constraint API. A bad field gets its error text (the
 *   control's data-error, else the browser's message) in its Field's error node (errorSlot), aria-invalid, and the
 *   node's id in aria-describedby (a radio group is marked and cleared as one); focus moves to the first bad field,
 *   which announces it. When that field has focus already (Enter pressed in it), focus cannot move, so the status
 *   says its error instead, for screen readers only (it stays idle and takes no room); so it is said once either
 *   way. Nothing shows before the first submit. After it, a field is checked again when it loses
 *   focus, and its error clears as soon as it is valid. That check is one exported function, validateControls(form,
 *   controls), which the submit uses over every field; a part that checks some fields first (Pro QuoteSteps, one step
 *   at a time) calls it over those, and the form's blur check and error clearing are on from then (the form's state is
 *   kept per form, not inside the submit listener).
 * - Valid: new FormData(form, submitter) (the clicked button and repeated fields), sent with fetch as URL-encoded
 *   data, or multipart when enctype says so, with Accept: application/json. The clicked button's formaction,
 *   formenctype and formmethod win over the form's, as natively; a button whose method is not post submits natively.
 *   A 2xx answer with a JSON type (application/json or a +json type), or 204 No Content: success, the form resets,
 *   every error state is cleared and focus moves to the status. Anything else, or no network: error, and the text
 *   stays. No answer within SEND_TIMEOUT_MS (15 seconds) is an error too: the request is aborted, aria-busy goes, and
 *   the reader can send again. A 2xx HTML page is an error too: the contract is a JSON endpoint, and a page (a provider's CAPTCHA or
 *   thank-you page) cannot tell the script the post was accepted. The JSON body is not read: the status code says it. The button is never disabled: while sending it is aria-busy and
 *   a second submit is ignored. The fields stay editable while it sends; if the reader edits one before the answer
 *   comes, success keeps their edits (no reset) and leaves focus where they are typing; the status still says it.
 *   The status carries `data-reset` after a success that reset the form (none after a kept edit; it goes at the next
 *   send), so a page can tell a cleared form from one the reader is still typing in.
 *
 * It imports nothing, so its pure parts run under Node's test runner.
 */

/**
 * How long a send waits for an answer before it gives up (the request is aborted and the status says the error). Long
 * enough for a slow mobile connection, short enough that a hung endpoint never leaves the form busy for good.
 */
export const SEND_TIMEOUT_MS = 15_000;

/** The forms this script binds. */
export const ENHANCE_SELECTOR = 'form[data-enhance="fetch"]';

export type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type State = "idle" | "sending" | "success" | "error";

/** An id list (aria-describedby) with `id` added once, order kept. */
export function addId(list: string | null, id: string): string {
	const ids = (list ?? "").split(/\s+/).filter(Boolean);
	if (!ids.includes(id)) ids.push(id);
	return ids.join(" ");
}

/** An id list without `id`, or null when nothing is left (so the attribute is removed). */
export function removeId(list: string | null, id: string): string | null {
	const ids = (list ?? "").split(/\s+/).filter((x) => x && x !== id);
	return ids.length > 0 ? ids.join(" ") : null;
}

/** Whether a form with this method attribute is enhanced: post, in a browser with fetch and FormData. */
export function canEnhance(method: string | null, env: { fetch?: unknown; FormData?: unknown } = globalThis): boolean {
	return (method ?? "get").toLowerCase() === "post" && typeof env.fetch === "function" && typeof env.FormData === "function";
}

/** The request body: the FormData for multipart, else URL-encoded. */
export function requestBody(data: FormData, enctype: string | null): FormData | URLSearchParams {
	if ((enctype ?? "").toLowerCase() === "multipart/form-data") return data;
	return new URLSearchParams(data as unknown as Record<string, string>);
}

/**
 * Whether an answer is a success: a 2xx with a JSON type (application/json, or a +json type such as
 * application/problem+json, with any parameters), or 204 No Content, which has no body and no type. Any other answer,
 * a 2xx HTML page included, is an error, so the reader's text stays.
 */
export function accepted(status: number, contentType: string | null): boolean {
	if (status === 204) return true;
	return status >= 200 && status < 300 && /^application\/(?:[\w.-]+\+)?json\s*(?:;|$)/i.test((contentType ?? "").trim());
}

type Attrs = { getAttribute(name: string): string | null };

/**
 * Where and how a submit goes: the clicked button's formaction, formenctype and formmethod win over the form's own
 * attributes, as in a native submit. An empty formaction falls back to the form's (the HTML rule).
 */
export function submission(form: Attrs, submitter: Attrs | null): { action: string | null; enctype: string | null; method: string | null } {
	const pick = (own: string, attr: string) => {
		const value = submitter?.getAttribute(own);
		return value != null && value !== "" ? value : form.getAttribute(attr);
	};
	return { action: pick("formaction", "action"), enctype: pick("formenctype", "enctype"), method: pick("formmethod", "method") };
}

const isControl = (el: unknown): el is Control =>
	el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement;

/** A control and, for a named radio, every radio of its group in this form: they are marked and cleared together. */
function group(form: HTMLFormElement, control: Control): Control[] {
	if (!(control instanceof HTMLInputElement) || control.type !== "radio" || !control.name) return [control];
	return fields(form).filter((c) => c instanceof HTMLInputElement && c.type === "radio" && c.name === control.name);
}

/** The fields the browser validates (no hidden inputs, buttons or disabled controls). */
const fields = (form: HTMLFormElement): Control[] => [...form.elements].filter(isControl).filter((c) => c.willValidate);

/** A field's error node (Field's errorSlot), inside this form only. */
function errorNode(form: HTMLFormElement, control: Control): HTMLElement | null {
	if (!control.id) return null;
	return form.querySelector<HTMLElement>(`[data-field-error="${CSS.escape(control.id)}"]`);
}

/** Where the text goes: the node itself on the page tone, its text span on a band (beside the icon). */
const errorText = (node: HTMLElement) =>
	node.hasAttribute("data-field-error-text") ? node : (node.querySelector<HTMLElement>("[data-field-error-text]") ?? node);

/** A bad field's error text: the control's data-error, else the browser's message. */
const errorMessage = (control: Control) => control.getAttribute("data-error") || control.validationMessage;

function showError(form: HTMLFormElement, control: Control) {
	control.setAttribute("aria-invalid", "true");
	const node = errorNode(form, control);
	if (!node) return;
	errorText(node).textContent = errorMessage(control);
	node.hidden = false;
	control.setAttribute("aria-describedby", addId(control.getAttribute("aria-describedby"), node.id));
}

function clearError(form: HTMLFormElement, control: Control) {
	control.removeAttribute("aria-invalid");
	const node = errorNode(form, control);
	if (!node) return;
	errorText(node).textContent = "";
	node.hidden = true;
	const list = removeId(control.getAttribute("aria-describedby"), node.id);
	if (list === null) control.removeAttribute("aria-describedby");
	else control.setAttribute("aria-describedby", list);
}

/** Checks one field (a radio with its whole group); shows or clears its error. True when it is valid. */
function check(form: HTMLFormElement, control: Control): boolean {
	const valid = control.checkValidity();
	for (const c of group(form, control)) {
		if (valid) clearError(form, c);
		else showError(form, c);
	}
	return valid;
}

/** How long a repeat of the status's last text waits after the status is emptied. */
const REPEAT_DELAY_MS = 100;
/** Each status's waiting write, so a newer state cancels it. */
const waiting = new WeakMap<HTMLElement, number>();

/**
 * Sets the status's state and says its text (none for idle). `hidden` is said for screen readers only, in an sr-only
 * span, while the status stays idle (a bad field that had focus already). A screen reader says a change, and emptying
 * then refilling a node in one go is no change, so text the status already held is written a moment after it is
 * emptied: the same text said twice (Enter twice in a bad field) is heard twice. Different text is written at once.
 */
function setStatus(status: HTMLElement | null, state: State, hidden = "") {
	if (!status) return;
	window.clearTimeout(waiting.get(status));
	const before = status.textContent;
	status.dataset.state = state;
	status.textContent = "";
	const text = hidden || (state === "idle" ? "" : (status.dataset[state] ?? ""));
	if (!text) return;
	const write = () => {
		if (!hidden) {
			status.textContent = text;
			return;
		}
		const span = document.createElement("span");
		span.className = "sr-only";
		span.textContent = text;
		status.append(span);
	};
	if (text === before) waiting.set(status, window.setTimeout(write, REPEAT_DELAY_MS));
	else write();
}

/** The forms checked at least once (validateControls), so a field is checked again on blur and cleared on input. */
const submittedForms = new WeakSet<HTMLFormElement>();

/**
 * Checks these controls of the form (each shows or clears its error) and returns the bad ones. It marks the form as
 * submitted, which turns on the check on blur and the clearing on input for every field of the form. When one is bad,
 * focus moves to the first, which announces it; if that one has focus already (Enter in it), focus cannot move, so
 * the form's status says its error for screen readers only (Enter twice says it twice). The form's own submit calls
 * it over every field; Pro QuoteSteps over one step's.
 */
export function validateControls(form: HTMLFormElement, controls: Iterable<unknown>): Control[] {
	submittedForms.add(form);
	const status = form.querySelector<HTMLElement>("[data-form-status]");
	const bad = [...controls].filter(isControl).filter((c) => c.willValidate && !check(form, c));
	if (bad.length > 0) {
		// Focus moving to the bad field is what says its error. If it has focus already (Enter in it), focus cannot
		// move, so the status says the error for screen readers only; else the status is emptied.
		if (bad[0] === document.activeElement) setStatus(status, "idle", errorMessage(bad[0]));
		else {
			setStatus(status, "idle");
			bad[0].focus();
		}
	}
	return bad;
}

// A field named "action" or "reset" shadows the form's own property, so the action is read from the attributes
// (submission) and reset calls the prototype's method.
const actionUrl = (action: string | null) => new URL(action ?? "", document.baseURI).href;
const resetForm = (form: HTMLFormElement) => HTMLFormElement.prototype.reset.call(form);

function bind(form: HTMLFormElement) {
	if (form.hasAttribute("data-enhance-bound") || !canEnhance(form.getAttribute("method"))) return;
	form.setAttribute("data-enhance-bound", "");
	form.setAttribute("novalidate", "");
	const status = form.querySelector<HTMLElement>("[data-form-status]");
	let sending = false;
	// Whether a field changed while the form was sending: the answer is for the earlier values, so success keeps these.
	let edited = false;

	form.addEventListener("submit", async (event) => {
		if (sending) {
			event.preventDefault();
			return;
		}
		const submitter = event.submitter instanceof HTMLElement ? event.submitter : null;
		const target = submission(form, submitter);
		// The clicked button's formnovalidate skips the checks, as in a native submit.
		if (!submitter?.hasAttribute("formnovalidate") && validateControls(form, fields(form)).length > 0) {
			event.preventDefault();
			return;
		}
		// A button with formmethod="get" (or anything but post) submits natively, after the same checks.
		if (!canEnhance(target.method)) return;
		event.preventDefault();
		sending = true;
		edited = false;
		status?.removeAttribute("data-reset");
		submitter?.setAttribute("aria-busy", "true");
		setStatus(status, "sending");
		const abort = new AbortController();
		const timer = window.setTimeout(() => abort.abort(), SEND_TIMEOUT_MS);
		try {
			const data = new FormData(form, submitter ?? undefined);
			const response = await fetch(actionUrl(target.action), {
				method: "POST",
				body: requestBody(data, target.enctype),
				headers: { Accept: "application/json" },
				signal: abort.signal,
			});
			if (!accepted(response.status, response.headers.get("content-type"))) throw new Error(`HTTP ${response.status}`);
			// An edit made while it was sending is newer than what was sent: keep it (and its error state), and leave
			// focus where the reader is typing. The status is a live region, so success is still said.
			if (!edited) {
				resetForm(form);
				for (const control of fields(form)) clearError(form, control);
				submittedForms.delete(form);
				status?.setAttribute("data-reset", "");
			}
			setStatus(status, "success");
			if (!edited) status?.focus();
		} catch {
			setStatus(status, "error");
		} finally {
			window.clearTimeout(timer);
			sending = false;
			submitter?.removeAttribute("aria-busy");
		}
	});

	// After the first submit: check a field again when it loses focus, and clear its error as soon as it is valid.
	form.addEventListener("focusout", (event) => {
		if (submittedForms.has(form) && isControl(event.target) && event.target.willValidate) check(form, event.target);
	});
	form.addEventListener("change", () => {
		if (sending) edited = true;
	});
	form.addEventListener("input", (event) => {
		if (sending) edited = true;
		const control = event.target;
		// A radio's group is cleared together: choosing one makes the whole group valid.
		if (submittedForms.has(form) && isControl(control) && control.getAttribute("aria-invalid") === "true" && control.checkValidity()) {
			for (const c of group(form, control)) clearError(form, c);
			// The error the idle status said for screen readers (Enter in a bad field) is stale once a field is fixed.
			if (status?.dataset.state === "idle" && status.textContent) setStatus(status, "idle");
		}
	});
}

/** Binds every enhanced form under `root` that is not bound yet. */
export function enhanceForms(root: ParentNode = document) {
	for (const form of root.querySelectorAll<HTMLFormElement>(ENHANCE_SELECTOR)) bind(form);
}

/** Form's script calls this. Once per visit: it binds now, and on every ClientRouter page load. */
export function start() {
	const w = window as unknown as { __auiFormEnhance?: boolean };
	if (w.__auiFormEnhance) return;
	w.__auiFormEnhance = true;
	document.addEventListener("astro:page-load", () => enhanceForms());
	enhanceForms();
}

/**
 * The saved list behind SaveButton: listing ids kept in the reader's own browser (localStorage, no account), one list
 * per name ("homes" by default, key "astronomic:saved:homes"). A theme's Saved homes page reads the same list with
 * readSaved() and follows saved:change. Imports nothing, takes the document and window as arguments, so it runs
 * under node --test and in the browser.
 *
 * Storage blocked (private modes, a strict setting, a full quota): the list lives in memory for the page, so a Save
 * button still toggles and nothing breaks; nothing is kept.
 */

/** Fired on the document after a Save click or a change from another tab: `detail: { list, ids }`. */
export const SAVED_CHANGE = "saved:change";

/** The list a button uses when it names none. */
export const DEFAULT_LIST = "homes";

const PREFIX = "astronomic:saved:";
const BUTTON = "[data-save-button]";

/** The parts of Storage the list uses. */
export interface SavedStorage {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
}

/** The storage key of a list: "astronomic:saved:homes". */
export function savedKey(list: string = DEFAULT_LIST): string {
	return `${PREFIX}${list}`;
}

/**
 * Lists that could not be written, per storage (or per page with no storage): they win over what storage holds until
 * a write goes through or another tab changes the list (its write is newer, so it wins then).
 */
const memory = new WeakMap<object, Map<string, string[]>>();
/** The lists the page has read or changed, per storage: a storage clear refreshes them all. */
const used = new WeakMap<object, Set<string>>();
const NO_STORAGE = {};
const memoryOf = (storage: SavedStorage | null | undefined) => {
	const owner = storage ?? NO_STORAGE;
	let lists = memory.get(owner);
	if (!lists) memory.set(owner, (lists = new Map()));
	return lists;
};
const usedOf = (storage: SavedStorage | null | undefined) => {
	const owner = storage ?? NO_STORAGE;
	let lists = used.get(owner);
	if (!lists) used.set(owner, (lists = new Set()));
	return lists;
};

/** The ids in a list, oldest first. Junk (bad JSON, not a list of strings) reads as an empty list. */
export function readSaved(list: string, storage: SavedStorage | null | undefined): string[] {
	usedOf(storage).add(list);
	const kept = memoryOf(storage).get(list);
	if (kept) return [...kept];
	if (!storage) return [];
	try {
		const parsed: unknown = JSON.parse(storage.getItem(savedKey(list)) ?? "[]");
		return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
	} catch {
		return [];
	}
}

/** Adds the id to the list, or takes it out when it is there, and keeps the list. Returns the new list. */
export function toggleSaved(list: string, id: string, storage: SavedStorage | null | undefined): string[] {
	const ids = readSaved(list, storage);
	const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
	try {
		if (!storage) throw new Error("no storage");
		storage.setItem(savedKey(list), JSON.stringify(next));
		memoryOf(storage).delete(list);
	} catch {
		memoryOf(storage).set(list, next);
	}
	return next;
}

/** The window's localStorage, or null where reading it throws or there is none. */
function storageOf(win: Window & typeof globalThis): SavedStorage | null {
	try {
		return win.localStorage ?? null;
	} catch {
		return null;
	}
}

const listOf = (button: Element) => button.getAttribute("data-save-list") || DEFAULT_LIST;

/** Sets aria-pressed on every button of the list from its ids. */
function update(doc: Document, list: string, ids: string[]) {
	for (const button of doc.querySelectorAll(BUTTON)) {
		if (listOf(button) !== list) continue;
		button.setAttribute("aria-pressed", String(ids.includes(button.getAttribute("data-save-id") ?? "")));
	}
}

const bound = new WeakSet<object>();

/**
 * Binds the Save buttons of a document, once (a second call does nothing): shows each button (it renders hidden, so
 * with no script there is no button) with its state, and listens with one click listener on the document, so buttons
 * in cards added later work too. A button added later (a search's filled card, a page swap) is shown and set when it
 * lands. Every button with the same id and list flips at once; other tabs follow through the storage event.
 */
export function start(doc: Document, win: Window & typeof globalThis): void {
	if (bound.has(doc)) return;
	bound.add(doc);
	const storage = storageOf(win);
	const fire = (list: string, ids: string[]) => doc.dispatchEvent(new win.CustomEvent(SAVED_CHANGE, { detail: { list, ids } }));

	/** Shows the buttons still hidden and sets their state. */
	const show = () => {
		const lists = new Map<string, string[]>();
		for (const button of doc.querySelectorAll(`${BUTTON}[hidden]`)) {
			const list = listOf(button);
			if (!lists.has(list)) lists.set(list, readSaved(list, storage));
			button.setAttribute("aria-pressed", String(lists.get(list)!.includes(button.getAttribute("data-save-id") ?? "")));
			button.removeAttribute("hidden");
		}
	};

	doc.addEventListener("click", (event) => {
		const target = event.target as Element | null;
		const button = target && typeof target.closest === "function" ? target.closest(BUTTON) : null;
		const id = button?.getAttribute("data-save-id");
		if (!button || !id) return;
		const list = listOf(button);
		const ids = toggleSaved(list, id, storage);
		update(doc, list, ids);
		fire(list, ids);
	});

	// Another tab changed a list (key) or cleared the storage (key null). Its change is newer than a list this page
	// kept in memory after a failed write, so that list is dropped. A clear refreshes every list the page used (a Saved
	// page may have no Save buttons) and every list with a button.
	win.addEventListener("storage", (event) => {
		const key = (event as StorageEvent).key;
		if (key !== null && !key.startsWith(PREFIX)) return;
		const kept = memoryOf(storage);
		let lists: Set<string>;
		if (key === null) {
			lists = new Set([...usedOf(storage), ...kept.keys(), ...[...doc.querySelectorAll(BUTTON)].map(listOf)]);
			kept.clear();
		} else {
			lists = new Set([key.slice(PREFIX.length)]);
			kept.delete(key.slice(PREFIX.length));
		}
		for (const list of lists) {
			const ids = readSaved(list, storage);
			update(doc, list, ids);
			fire(list, ids);
		}
	});

	if (win.MutationObserver) new win.MutationObserver(show).observe(doc.documentElement, { childList: true, subtree: true });
	show();
}

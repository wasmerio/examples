import type {
  CloudCannonJavaScriptV1API,
  CloudCannonJavaScriptV1APIFile,
} from "@cloudcannon/javascript-api";

export interface EditorDataSource {
  file: CloudCannonJavaScriptV1APIFile;
  emitters: { addEventListener(event: "change", fn: () => void): void }[];
}

/**
 * Prefers the dataset (needs `data_config` in `cloudcannon.config.yml`): only it fires
 * `change` while a panel is open. Both path spellings are probed because a wrong one
 * throws nothing — `data.get()` just resolves `undefined`.
 */
export async function resolveDataSource(
  api: CloudCannonJavaScriptV1API,
  options: { dataset: string; path: string }
): Promise<EditorDataSource | undefined> {
  try {
    const dataset = api.dataset(options.dataset);
    const items = await dataset.items();
    const file = Array.isArray(items) ? items[0] : items;

    if (file && (await file.data.get())) return { file, emitters: [dataset, file, api] };
  } catch {
    // No such dataset — fall through to the file paths.
  }

  for (const path of [options.path, `/${options.path}`]) {
    try {
      const file = api.file(path);

      if (await file.data.get()) return { file, emitters: [file, api] };
    } catch {
      // Next spelling.
    }
  }

  return undefined;
}

/** One repaint per frame for a burst of `change` events. */
export function framed(repaint: () => void): () => void {
  let queued = false;

  return () => {
    if (queued) return;
    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      repaint();
    });
  };
}

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

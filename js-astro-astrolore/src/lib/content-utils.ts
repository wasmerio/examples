/**
 * Slim representation of a content entry passed to
 * client-side components.
 */
export type CollectionItem = {
    id: string;
    label: string;
};

/**
 * Reperesentation of a path section
 */
export type Crumb = {
    label: string;
    href?: string;
};

/**
 * Content objects counts
 */
export type ContentCounts = {
    categories: number;
    articles: number;
    maps: number;
    timelines: number;
    documents: number;
    handouts: number;
    tables: number;
    statblocks: number;
};

/**
 * Get the entry slug from an entry id
 * ```
 * const id = 'test/categories/example';
 * const slug = slugFromId(id);
 * console.log(slug === 'example');
 * ```
 */
export function slugFromId(id: string): string {
    const [_p, _s, ...rest] = id.split("/");
    return rest.join("/");
}

/**
 * Get the project id from an entry id
 * ```
 * const id = 'test/categories/example';
 * const project = projectFromId(id);
 * console.log(project === 'test');
 * ```
 */
export function projectFromId(id: string): string {
    const p = id.split("/").at(0);
    if (!p) throw `Id ${id} does not contain project id`;
    return p;
}

/**
 * Check if a string is a valid URL
 * ```
 * console.log(isURL('https://example.com')); // true
 * console.log(isURL('example'));             // false
 * ```
 */
export function isURL(value: string) {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

/**
 * Returns true if `value` is an article reference in the `(slug)`
 * format used in metadata fields.
 * ```
 * console.log(isLink('(example)'));  // true
 * console.log(isLink('example'));    // false
 * ```
 */
export function isLink(value: string): boolean {
    return value.startsWith("(") && value.endsWith(")");
}

/**
 * Strips the surrounding parentheses from a `(slug)` link.
 * ```
 * console.log(stripLink('(example)')); // 'example'
 * ```
 */
export function stripLink(value: string): string {
    return value.substring(1, value.length - 1);
}

/**
 * Collects every `(slug)`-style article reference out of a
 * frontmatter value.
 * ```
 * collectFrontmatterRefs({ parents: ["(john)"], spouses: ["(jane)"] });
 * // ['john', 'jane']
 * ```
 */
export function collectFrontmatterRefs(value: unknown): string[] {
    if (typeof value === "string") {
        return isLink(value) ? [stripLink(value)] : [];
    }
    if (Array.isArray(value)) {
        return value.flatMap(collectFrontmatterRefs);
    }
    if (value && typeof value === "object") {
        return Object.values(value).flatMap(collectFrontmatterRefs);
    }
    return [];
}

/**
 * Appends `value` to the array stored at `key` in `map`, creating the
 * array if this is the first entry for that key.
 * ```
 * const map = new Map<string, string[]>();
 * pushOrSet(map, "a", "x");
 * pushOrSet(map, "a", "y");
 * console.log(map.get("a")); // ['x', 'y']
 * ```
 */
export function pushOrSet<K, V>(map: Map<K, V[]>, key: K, value: V) {
    const list = map.get(key);
    if (list) list.push(value);
    else map.set(key, [value]);
}

/**
 * Gets the image src for values that can be both remote urls and
 * local images.
 * ```
 * const src = getImageSrc(entry.data.image);
 * ```
 */
export function getImageSrc(image: string | { src: string }): string {
    if (typeof image === "string") {
        return image;
    } else {
        return image.src;
    }
}

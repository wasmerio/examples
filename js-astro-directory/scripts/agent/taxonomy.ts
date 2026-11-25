// Shared taxonomy + content validators for the submission agent.
// check-data.ts does NOT validate category, pricing, title, or body — these do.

export const CATEGORY_DEFINITIONS: Record<string, string> = {
    art: 'AI image generation, illustration, and visual art creation.',
    audio: 'Speech, voice, text-to-speech, transcription, and sound tools.',
    code: 'AI coding assistants, code generation, and dev copilots.',
    copywriting: 'Marketing copy, blog, email, and general text writing.',
    design: 'UI/UX, graphic design, logos, and creative design tooling.',
    developer: 'Developer infrastructure, APIs, SDKs, and build tooling.',
    education: 'Learning, tutoring, courses, and study aids.',
    enterprise: 'Business-wide platforms, internal tools, and B2B suites.',
    fashion: 'Clothing, style, virtual try-on, and fashion generation.',
    gaming: 'Game creation, NPCs, assets, and gaming-related AI.',
    health: 'Medical, wellness, fitness, and mental-health tools.',
    legal: 'Contracts, legal research, compliance, and law assistants.',
    llm: 'Foundation models, chat assistants, and general-purpose LLMs.',
    music: 'Music generation, composition, and audio production.',
    nocode: 'No-code / low-code app and workflow builders.',
    photos: 'Photo editing, enhancement, upscaling, and retouching.',
    productivity: 'Notes, scheduling, meetings, and personal productivity.',
    prompts: 'Prompt marketplaces, libraries, and prompt engineering.',
    research: 'Search, knowledge discovery, and research assistants.',
    seo: 'Search-engine optimization, keywords, and content ranking.',
    social: 'Social media content, scheduling, and community tools.',
    video: 'Video generation, editing, avatars, and clip creation.',
    xtras: 'Anything that does not fit another category.',
};

export const CATEGORIES = Object.keys(CATEGORY_DEFINITIONS);
export const FALLBACK_CATEGORY = 'xtras';

export function isValidCategory(category: string): boolean {
    return CATEGORIES.includes(category);
}

export function normalizeCategory(category: string | undefined): string {
    const c = (category || '').trim().toLowerCase();
    return isValidCategory(c) ? c : FALLBACK_CATEGORY;
}

// Pricing is free-form in the data; the agent imposes this closed set for consistency.
const PRICING_LITERALS = new Set([
    'Free',
    'Freemium',
    'Free credits',
    'Premium',
    'Paid',
    'Beta',
    'Private Beta',
    'Contact',
    'Enterprise',
    'Not available',
]);

// e.g. "From $10/mo", "From $9", "$18 One-time", "From $5/yr"
const PRICING_PATTERNS: RegExp[] = [
    /^From \$\d+(\.\d+)?(\/(mo|yr|hr|month|year))?$/,
    /^\$\d+(\.\d+)? One-time$/,
];

export function normalizePricing(tag: string | undefined): string {
    const t = (tag || '').trim();
    if (!t) return 'Not available';
    if (PRICING_LITERALS.has(t)) return t;
    if (PRICING_PATTERNS.some((re) => re.test(t))) return t;
    return 'Not available';
}

// Titles must not start with the word "AI", a number, or a special character.
export function sanitizeTitle(raw: string): string {
    let title = (raw || '').replace(/[\u0000-\u001F\u007F]+/g, ' ').trim(); // strip control chars
    title = title.replace(/^(AI)\b[\s:–-]*/i, '');     // strip leading "AI"
    title = title.replace(/^[^A-Za-z]+/, '');           // strip leading digits/symbols
    return title.trim();
}

export function isValidTitle(title: string): boolean {
    return /^[A-Za-z][^\n]*$/.test(title) && !/^ai\b/i.test(title);
}

// Body must be a factual sentence of 5-6 words ending with a period.
export function countWords(body: string): number {
    return body.trim().split(/\s+/).filter(Boolean).length;
}

export function isValidBody(body: string): boolean {
    const b = (body || '').trim();
    if (!b.endsWith('.')) return false;
    const words = countWords(b);
    return words >= 5 && words <= 6;
}

export function categoryListForPrompt(): string {
    return CATEGORIES.map((c) => `- ${c}: ${CATEGORY_DEFINITIONS[c]}`).join('\n');
}

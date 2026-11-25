export const WORDS_PER_MINUTE = 200; // avg reading speed

export function calcReadTime(body: string): number {
    return Math.max(1, Math.ceil(body.split(/\s+/).length / WORDS_PER_MINUTE));
}

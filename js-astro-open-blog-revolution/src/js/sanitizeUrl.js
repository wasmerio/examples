const createSanitizer = (base) => (url) => {

    if (!url || url.startsWith('http') || url.startsWith('mailto:')) return url;

    const cleanBase = base === '/' ? '' : base.replace(/\/$/, '');

    if (cleanBase && url.startsWith(cleanBase)) {
        return url;
    }
    
    const combined = `${cleanBase}/${url}`;
    
    // Regex fies double // without affecting protocol
    return combined.replaceAll(/(?<!:)\/+/gm, '/');
};

const base = import.meta.env.BASE_URL;

export const sanitizeUrl = createSanitizer(base);
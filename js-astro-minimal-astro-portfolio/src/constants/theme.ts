export const THEME = {
    colors: {
        primary: "var(--primary-color)",
        text: "var(--text-color)",
        muted: "var(--text-muted)",
        background: "var(--bg-color)",
        border: "var(--border-color)",
        hover: "var(--hover-bg)",
    },
    fonts: {
        primary: "var(--font-primary)",
        mono: "var(--font-mono)",
    },
    sizes: {
        text: {
            xs: "var(--text-xs)",
            sm: "var(--text-sm)",
            base: "var(--text-base)",
            lg: "var(--text-lg)",
        },
        container: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
        },
    },
    transitions: {
        base: "var(--transition-base)",
    },
} as const; 
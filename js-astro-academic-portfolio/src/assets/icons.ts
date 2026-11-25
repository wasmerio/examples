const rawIcons = import.meta.glob('./icons/*.svg', {
    query: '?raw',
    import: 'default',
    eager: true,
}) as Record<string, string>;


export const ICONS: Record<string, string> = Object.keys(rawIcons).reduce((acc, filePath) => {
    const fileName = filePath
        .replace('./icons/', '')
        .replace('.svg', '');

    acc[fileName] = rawIcons[filePath];
    return acc;
}, {} as Record<string, string>);

export type IconName = keyof typeof ICONS;

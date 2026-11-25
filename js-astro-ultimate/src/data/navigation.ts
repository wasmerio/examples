export interface Framework {
    name: string;
    displayName: string;
    path: string;
    color: string;
}

export const frameworks: Framework[] = [
    { name: 'astro', displayName: 'Astro', path: '/', color: '#FF5D01' },
    { name: 'react', displayName: 'React', path: '/react', color: '#61DAFB' },
    { name: 'vuejs', displayName: 'Vue', path: '/vue', color: '#4FC08D' },
    { name: 'svelte', displayName: 'Svelte', path: '/svelte', color: '#FF3E00' },
    { name: 'solidjs', displayName: 'Solid', path: '/solid', color: '#2C4F7C' },
];

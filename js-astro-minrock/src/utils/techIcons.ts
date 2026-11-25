// src/utils/techIcons.ts
// SVG icons for search modal and UI components

export function getTechIconSvg(tagOrName?: string | null, size = 16): string {
  if (!tagOrName) return getDefaultDocIcon(size);
  const key = tagOrName.toLowerCase().trim();

  switch (key) {
    case 'obsidian':
    case 'vault':
    case 'vaultcms':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" class="tech-svg" style="color: #A855F7;" aria-hidden="true"><path d="m12.44 2.12 6.84 5.31a1.5 1.5 0 0 1 .49 1.6l-2.45 8.7a1.5 1.5 0 0 1-1.12 1.05l-8.54 1.83a1.5 1.5 0 0 1-1.57-.64l-3.8-5.83a1.5 1.5 0 0 1-.02-1.63L7.74 3.6a1.5 1.5 0 0 1 1.43-.88l3.27-.6z"/><path d="m12 7-3 5 4 4 4-6-5-3z" fill="#fff" opacity="0.8"/></svg>`;

    case 'astro':
    case 'ssg':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" class="tech-svg" style="color: #FF5D01;" aria-hidden="true"><path d="M12 2a1 1 0 0 1 .89.55l3.5 7a1 1 0 0 1-.13 1.15l-3.5 4a1 1 0 0 1-1.52 0l-3.5-4a1 1 0 0 1-.13-1.15l3.5-7A1 1 0 0 1 12 2z"/><path d="M7 16c-.55 0-1 .45-1 1a5 5 0 0 0 10 0c0-.55-.45-1-1-1a3 3 0 0 1-6 0c0-.55-.45-1-1-1z" fill="#9333ea"/></svg>`;

    case 'scatterleaf':
    case 'comments':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" class="tech-svg" style="color: #10B981;" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12c0 2.85 1.2 5.42 3.12 7.24L4 22l3.43-1.03C8.75 21.6 10.33 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/><path d="M17 8c-2 0-4 1.5-4 4s2 4 4 4c0-2-1-4-2-5 1 0 2 0 2-3z" fill="#fff" opacity="0.6"/></svg>`;

    case 'github':
    case 'git':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" class="tech-svg" style="color: #8957E5;" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>`;

    case 'design':
    case 'typography':
    case 'writing':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tech-svg" style="color: #3B82F6;" aria-hidden="true"><path d="M4 20h16"/><path d="m14 4-8 12"/><path d="m18 12-4-8-4 8"/></svg>`;

    case 'gallery':
    case 'showcase':
    case 'photoswipe':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tech-svg" style="color: #EC4899;" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;

    case 'code':
    case 'workflow':
    case 'web-components':
    case 'shadow-dom':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tech-svg" style="color: #06B6D4;" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;

    default:
      return getDefaultDocIcon(size);
  }
}

export function getDefaultDocIcon(size = 16): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tech-svg tech-svg-doc" style="color: var(--accent);" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`;
}

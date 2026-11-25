import '@fontsource-variable/figtree';
import '@fontsource/fragment-mono/400.css';
import '@fontsource-variable/climate-crisis/year.css';
import '@/styles/site.css';
import Scripts from './Scripts';

/**
 * Document shell only. Head tags and page chrome come from src/layouts/Base.tsx,
 * which every page renders, the way every Astro page renders Base.astro.
 * Fonts load in the same order as in the Astro build.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

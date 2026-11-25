import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type { AstroIntegration } from "astro";
import type { Plugin } from "vite";

const APP_ID = "site-config";
const EVT = {
  load: `${APP_ID}:load`,
  data: `${APP_ID}:data`,
  error: `${APP_ID}:error`,
  save: `${APP_ID}:save`,
};

type SiteData = {
  SITE: Record<string, string>;
  NAV_LINKS: Record<string, { label: string; path: string }>;
  SOCIAL_LINKS: Record<string, { label: string; href: string }>;
};

function generateSource(data: SiteData): string {
  const indent = "  ";
  let out = `import type {\n${indent}SiteConfiguration,\n${indent}NavigationLinks,\n${indent}SocialLinks,\n} from "@/types.ts";\n\n`;

  // SITE
  out += `export const SITE: SiteConfiguration = {\n`;
  for (const [key, value] of Object.entries(data.SITE)) {
    out += `${indent}${key}: ${JSON.stringify(value)},\n`;
  }
  out += `};\n\n`;

  // NAV_LINKS
  out += `export const NAV_LINKS: NavigationLinks = {\n`;
  for (const [key, val] of Object.entries(data.NAV_LINKS)) {
    out += `${indent}${key}: {\n`;
    out += `${indent}${indent}path: ${JSON.stringify(val.path)},\n`;
    out += `${indent}${indent}label: ${JSON.stringify(val.label)},\n`;
    out += `${indent}},\n`;
  }
  out += `};\n\n`;

  // SOCIAL_LINKS
  out += `export const SOCIAL_LINKS: SocialLinks = {\n`;
  for (const [key, val] of Object.entries(data.SOCIAL_LINKS)) {
    out += `${indent}${key}: {\n`;
    out += `${indent}${indent}label: ${JSON.stringify(val.label)},\n`;
    out += `${indent}${indent}href: ${JSON.stringify(val.href)},\n`;
    out += `${indent}},\n`;
  }
  out += `};\n`;

  return out;
}

export default function siteConfigToolbar(): AstroIntegration {
  let siteConfigPath = "";

  return {
    name: "site-config-toolbar",
    hooks: {
      "astro:config:setup": ({ command, addDevToolbarApp, updateConfig }) => {
        if (command !== "dev") return;

        addDevToolbarApp({
          id: APP_ID,
          name: "Site Config",
          icon: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><text y="80" font-size="80">🦴</text></svg>`,
          entrypoint: new URL("./site-config-app.ts", import.meta.url),
        });

        // Force a full page reload when siteConfig.ts changes on disk.
        // Astro components are server-rendered, so we need to:
        // 1. Invalidate the SSR module cache (otherwise the server re-renders stale data)
        // 2. Tell the browser to do a full reload
        const reloadPlugin: Plugin = {
          name: "site-config-reload",
          configureServer(server) {
            server.watcher.on("change", async (file) => {
              if (path.basename(file) !== "siteConfig.ts") return;

              // Invalidate in all environments (SSR + client)
              for (const env of Object.values(server.environments)) {
                const mod = await env.moduleGraph.getModuleByUrl(
                  "/src/siteConfig.ts",
                );
                if (mod) {
                  env.moduleGraph.invalidateModule(mod);
                }
              }

              // Trigger browser reload
              server.environments.client.hot.send({ type: "full-reload" });
            });
          },
        };

        updateConfig({ vite: { plugins: [reloadPlugin] } });
      },

      "astro:config:done": ({ config }) => {
        siteConfigPath = fileURLToPath(
          new URL("./src/siteConfig.ts", config.root),
        );
      },

      "astro:server:setup": ({ toolbar, server, logger }) => {
        async function sendConfig() {
          try {
            // Invalidate the SSR module cache before loading so we
            // always read the latest values from disk.
            for (const env of Object.values(server.environments)) {
              const cached = await env.moduleGraph.getModuleByUrl(
                "/src/siteConfig.ts",
              );
              if (cached) {
                env.moduleGraph.invalidateModule(cached);
              }
            }

            const mod = await server.ssrLoadModule("/src/siteConfig.ts");

            toolbar.send(EVT.data, {
              SITE: mod.SITE,
              NAV_LINKS: mod.NAV_LINKS,
              SOCIAL_LINKS: mod.SOCIAL_LINKS,
            });
          } catch (err) {
            logger.error(
              `[site-config] load failed: ${err instanceof Error ? err.message : String(err)}`,
            );
            toolbar.send(EVT.error, {
              message: "Failed to load siteConfig.ts",
            });
          }
        }

        // Send config when app finishes initializing (avoids race condition)
        toolbar.onAppInitialized(APP_ID, sendConfig);
        // Also handle explicit reload requests from the client
        toolbar.on(EVT.load, sendConfig);

        toolbar.on<SiteData>(EVT.save, async (data) => {
          try {
            const source = generateSource(data);
            await writeFile(siteConfigPath, source, "utf-8");
          } catch (err) {
            logger.error(
              `[site-config] save failed: ${err instanceof Error ? err.message : String(err)}`,
            );
          }
        });
      },
    },
  };
}

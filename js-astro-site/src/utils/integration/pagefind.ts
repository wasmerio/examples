import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import sirv from "sirv";

export default function createIntegration(): AstroIntegration {
  let outDir: string;
  let outAssets: string;
  return {
    name: "astro-pagefind",
    hooks: {
      "astro:config:setup": ({ config, logger }) => {
        if (config.output === "server") {
          logger.warn(
            "Output type `server` does not produce static *.html pages in its output and thus will not work with astro-pagefind integration."
          );
          return;
        }

        outAssets = config.build.assets;

        if (config.adapter?.name.startsWith("@astrojs/vercel")) {
          outDir = fileURLToPath(
            new URL(".vercel/output/static/", config.root)
          );
        } else if (config.adapter?.name === "@astrojs/cloudflare") {
          outDir = fileURLToPath(
            new URL(config.base?.replace(/^\//, ""), config.outDir)
          );
        } else if (
          config.adapter?.name === "@astrojs/node" &&
          config.output === "hybrid"
        ) {
          outDir = fileURLToPath(config.build.client!);
        } else {
          outDir = fileURLToPath(config.outDir);
        }
      },
      "astro:server:setup": ({ server, logger }) => {
        if (!outDir) {
          logger.warn(
            "astro-pagefind couldn't reliably determine the output directory. Search assets will not be served."
          );
          return;
        }

        const serve = sirv(outDir, {
          dev: true,
          etag: true,
        });
        // TODO: use more robust way to fallback to <outDir>
        server.middlewares.use((req, res, next) => {
          if (
            req.url?.startsWith("/pagefind/") ||
            req.url?.startsWith(`/${outAssets}/`)
          ) {
            serve(req, res, next);
          } else {
            next();
          }
        });
      },
      "astro:build:done": async ({ logger }) => {
        if (!outDir) {
          logger.warn(
            "astro-pagefind couldn't reliably determine the output directory. Search index will not be built."
          );
          return;
        }

        const child = spawnSync(
          process.versions.bun ? "bunx" : "npx",
          ["pagefind", "--site", outDir],
          {
            cwd: process.cwd(),
            windowsHide: true,
            stdio: ["inherit", "inherit", "inherit"],
          }
        );
        if (child.status === 0) logger.info("Finished indexing");
        else if (child.signal !== null)
          logger.warn(`Pagefind was killed with signal(${child.signal})`);
        else
          logger.error(
            `Pagefind exits with ${child.status}, error: ${child.error}`
          );
      },
    },
  };
}

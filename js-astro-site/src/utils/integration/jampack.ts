import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

export default function createIntegration(
  opts: { flags: string[] } = {
    flags: [],
  }
): AstroIntegration {
  let outDir: URL;
  return {
    name: "astro-jampack",
    hooks: {
      "astro:config:setup": ({ config, logger }) => {
        if (config.output === "server") {
          logger.warn(
            "Output type `server` does not produce static *.html pages in its output and thus will not work with astro-jampack integration."
          );
          return;
        }

        outDir = config.outDir;
      },
      "astro:build:done": async ({ logger }) => {
        if (!outDir) {
          logger.warn(
            "astro-jampack couldn't reliably determine the output directory. Jampack will not run."
          );
          return;
        }

        const child = spawnSync(
          process.versions.bun ? "bunx" : "npx",
          ["jampack", fileURLToPath(outDir), ...opts.flags],
          {
            cwd: process.cwd(),
            windowsHide: true,
            stdio: ["inherit", "inherit", "inherit"],
          }
        );
        if (child.status === 0) logger.info("Finished packing");
        else if (child.signal !== null)
          logger.warn(`Jampack was killed with signal(${child.signal})`);
        else
          logger.error(
            `Jampack exits with ${child.status}, error: ${child.error}`
          );
      },
    },
  };
}

import preact from "@astrojs/preact";
import { defineConfig } from "astro/config";

export default defineConfig({
	output: "static",
	integrations: [preact()],
	build: {
		inlineStylesheets: "always",
	},
	vite: {
		resolve: {
			alias: {
				"@": new URL("./src", import.meta.url).pathname,
			},
		},
	},
});

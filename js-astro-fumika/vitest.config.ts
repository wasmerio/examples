/// <reference types="vitest/config" />
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@utils": path.resolve(__dirname, "./src/utils"),
			"@i18n": path.resolve(__dirname, "./src/i18n"),
			"@constants": path.resolve(__dirname, "./src/constants"),
		},
	},
	test: {
		globals: true,
		environment: "node",
		coverage: {
			provider: "v8",
		},
	},
});

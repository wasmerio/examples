import type { RawBookPageDefinition } from "../types";
import { abstractionsPages } from "./abstractions";
import { advancedPages } from "./advanced";
import { corePages } from "./core";
import { dataPages } from "./data";
import { effectsRuntimePages } from "./effects-runtime";
import { organizationPages } from "./organization";
import { startPages } from "./start";
import { typesPages } from "./types";

export const rawBookPages = [
	...startPages,
	...corePages,
	...dataPages,
	...organizationPages,
	...typesPages,
	...abstractionsPages,
	...effectsRuntimePages,
	...advancedPages,
] satisfies readonly RawBookPageDefinition[];

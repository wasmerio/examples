import { advancedExampleGroups } from "./groups-advanced";
import { coreExampleGroups } from "./groups-core";
import type { ExampleGroup } from "./types";

export const exampleGroups: readonly ExampleGroup[] = [
	...coreExampleGroups,
	...advancedExampleGroups,
];

export function exampleGroupById(id: string) {
	return exampleGroups.find((group) => group.id === id);
}

import { describe, expect, it } from "vitest";
import { groupTeachingLedger } from "../src/lib/teaching";

describe("teaching ledger", () => {
	it("groups repeated course offerings and keeps every term", () => {
		const first = { id: "studio-2024", data: { title: "Studio", code: "INFO 623", term: "Spring 2024" } };
		const second = { id: "studio-2023", data: { title: "Studio", code: "INFO 623", term: "Spring 2023" } };
		const differentCourse = { id: "methods-2023", data: { title: "Methods", code: "INFO 623", term: "Autumn 2023" } };

		expect(groupTeachingLedger([first, second, differentCourse])).toEqual([
			{ course: first, terms: ["Spring 2024", "Spring 2023"] },
			{ course: differentCourse, terms: ["Autumn 2023"] },
		]);
	});
});

import { describe, expect, test } from "vitest";
import { getReadingTimeMinutes } from "../src/lib/reading-time";

describe("getReadingTimeMinutes", () => {
	test("returns at least one minute for short content", () => {
		expect(getReadingTimeMinutes("short note")).toBe(1);
	});

	test("rounds up long content", () => {
		const text = Array.from({ length: 201 }, (_, index) => `word${index}`).join(" ");
		expect(getReadingTimeMinutes(text)).toBe(2);
	});

	test("handles whitespace-only content", () => {
		expect(getReadingTimeMinutes("   \n\t  ")).toBe(1);
	});
});

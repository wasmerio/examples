import { describe, expect, it } from "vitest";
import { createUniqueSectionId, slugifySectionId } from "../src/lib/section-id";

describe("section ID helpers", () => {
	it("slugifies labels for anchor IDs", () => {
		expect(slugifySectionId("Working Paper")).toBe("working-paper");
		expect(slugifySectionId("Work & Progress!")).toBe("work-progress");
	});

	it("uses a fallback when a label has no ASCII slug", () => {
		expect(slugifySectionId("!!!", "section-1")).toBe("section-1");
	});

	it("keeps generated IDs unique against fixed IDs", () => {
		const used = new Set(["profile"]);
		expect(createUniqueSectionId("Profile", used, "section-1")).toBe("profile-2");
		expect(createUniqueSectionId("Profile", used, "section-2")).toBe("profile-3");
	});
});

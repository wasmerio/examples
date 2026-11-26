/** Icon.astro's lookup (src/utils/icons.ts): own entries only, else the Website icon. */
import assert from "node:assert/strict";
import { test } from "node:test";
import { iconSvg } from "../../src/utils/icons.ts";

const icons = { website: "<svg>web</svg>", github: "<svg>gh</svg>" };

test("iconSvg: a known id gives its markup", () => {
	assert.equal(iconSvg(icons, "github"), "<svg>gh</svg>");
	assert.equal(iconSvg(icons, "website"), "<svg>web</svg>");
});

test("iconSvg: an unknown id, or one inherited from Object.prototype, gives the Website icon", () => {
	for (const name of ["nope", "", "constructor", "toString", "__proto__", "hasOwnProperty", "valueOf"]) {
		const svg = iconSvg(icons, name);
		assert.equal(svg, "<svg>web</svg>", name);
		assert.equal(typeof svg.replace, "function", name);
	}
});

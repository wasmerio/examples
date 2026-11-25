import { visit } from "unist-util-visit";

export function remarkRuby() {
	return (tree) => {
		visit(tree, "text", (node) => {
			const rubyRegex = /\{([^}]+)\}\^\(([^)]+)\)/g;

			if (rubyRegex.test(node.value)) {
				node.type = "html";
				node.value = node.value.replace(rubyRegex, (_, baseStr, rubyStr) => {
					const baseMatches = [...baseStr.matchAll(/\[([^\]]+)\]/g)].map(
						(m) => m[1],
					);
					const rubyMatches = [...rubyStr.matchAll(/\[([^\]]+)\]/g)].map(
						(m) => m[1],
					);

					if (
						baseMatches.length > 0 &&
						baseMatches.length === rubyMatches.length
					) {
						return baseMatches
							.map(
								(base, i) => `<ruby>${base}<rt>${rubyMatches[i]}</rt></ruby>`,
							)
							.join("");
					}

					return `<ruby>${baseStr}<rt>${rubyStr}</rt></ruby>`;
				});
			}
		});
	};
}

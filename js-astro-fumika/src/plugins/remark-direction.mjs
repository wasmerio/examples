import { visit } from "unist-util-visit";

export function remarkDirection() {
	return (tree) => {
		visit(tree, (node) => {
			if (
				node.type === "textDirective" ||
				node.type === "leafDirective" ||
				node.type === "containerDirective"
			) {
				const name = node.name;
				if (name !== "rtl" && name !== "ltr") return;

				// biome-ignore lint/suspicious/noAssignInExpressions: <check later>
				const data = node.data || (node.data = {});

				const tagName = node.type === "textDirective" ? "span" : "div";

				data.hName = tagName;
				data.hProperties = {
					...(data.hProperties || {}),
					dir: name,
					class: `dir-${name}`,
				};
			}
		});
	};
}

export function OnThisPageNav(props: {
	headings: Array<{ depth: number; id: string; text: string }>;
	label?: string;
}) {
	const headings = props.headings.filter((heading) => heading.depth <= 3);
	if (headings.length === 0) {
		return null;
	}

	const label = props.label ?? "Page sections";
	return (
		<nav aria-label={label} className="mx-sidebar__nav">
			{headings.map((heading) => (
				<a
					key={heading.id}
					href={`#${heading.id}`}
					className="mx-sidebar__link"
					data-depth={heading.depth}
				>
					{heading.text}
				</a>
			))}
		</nav>
	);
}

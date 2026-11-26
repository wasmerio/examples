export function InlineHtml(props: { className?: string; html: string }) {
	return (
		<span
			className={props.className}
			dangerouslySetInnerHTML={{ __html: props.html }}
		/>
	);
}

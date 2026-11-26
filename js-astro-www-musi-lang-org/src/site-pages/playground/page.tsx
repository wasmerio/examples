import { siteCopy } from "../../lib/site-copy";
import type { AppRoute } from "../../routes";
import { ActionStrip, InlineAction, SecondaryAction } from "../../ui/actions";
import { MachinesActionCard } from "../../ui/machines";
import { SiteHeading } from "../../ui/site-heading";

export function PlaygroundPage(_props: { route: AppRoute }) {
	const copy = siteCopy.playground;
	const statusCards = [
		{
			label: "Local install",
			title: "Run Musi locally",
			copy: "Install Musi on your computer to check and test code.",
			href: "/install",
			action: "Install",
		},
		{
			label: "Examples",
			title: "Read examples",
			copy: "Open examples and commands you can try.",
			href: "/learn/book",
			action: "Open book",
		},
		{
			label: "Status",
			title: "Read GitHub issues",
			copy: "Read GitHub issues for playground work.",
			href: "/community",
			action: "Community",
		},
	];
	return (
		<div className="site-stack">
			<SiteHeading
				eyebrow={copy.eyebrow}
				title={copy.statusTitle}
				description={copy.statusCopy}
				actions={
					<ActionStrip>
						<SecondaryAction href="/install">
							{siteCopy.nav.install}
						</SecondaryAction>
						<InlineAction href="/community">
							{siteCopy.nav.community}
						</InlineAction>
					</ActionStrip>
				}
			/>
			<section
				className="mx-grid site-grid--three"
				aria-label="Playground paths"
			>
				{statusCards.map((card) => (
					<MachinesActionCard
						key={card.title}
						href={card.href}
						kicker={card.label}
						title={card.title}
						description={card.copy}
						action={card.action}
					/>
				))}
			</section>
		</div>
	);
}

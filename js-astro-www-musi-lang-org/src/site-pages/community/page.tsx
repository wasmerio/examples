import { siteCopy } from "../../lib/site-copy";
import type { AppRoute } from "../../routes";
import { MachinesGroupbox, MachinesSection } from "../../ui/machines";
import { SiteHeading } from "../../ui/site-heading";

export function CommunityPage(_props: { route: AppRoute }) {
	const copy = siteCopy.community;
	const communityNotes = [
		{
			label: "Source",
			value: "Code is on GitHub",
			copy: "Code, issues, and notes for helpers are on GitHub. You do not need a new account on this site.",
		},
		{
			label: "Support",
			value: "Use GitHub issues",
			copy: "Use GitHub issues to follow bugs, language work, and missing docs.",
		},
	];
	return (
		<div className="site-stack">
			<SiteHeading
				eyebrow={copy.eyebrow}
				title={copy.title}
				description={copy.description}
			/>
			<MachinesSection kicker={copy.eyebrow} title={siteCopy.ui.communityLinks}>
				<section
					className="mx-grid site-grid--three"
					aria-label={siteCopy.ui.communityLinks}
				>
					{copy.sections.map((section) => (
						<MachinesGroupbox
							key={section.title}
							legend={section.title}
							className="community-link-group"
						>
							<a href={section.href} className="community-link-box">
								<span className="mx-kicker">{section.label}</span>
								<span>{section.copy}</span>
							</a>
						</MachinesGroupbox>
					))}
				</section>
			</MachinesSection>
			<section className="mx-grid site-grid--two" aria-label="Project notes">
				{communityNotes.map((item) => (
					<MachinesGroupbox
						key={item.label}
						legend={item.value}
						className="mx-groupbox--compact community-note-group"
					>
						<p>{item.copy}</p>
					</MachinesGroupbox>
				))}
			</section>
		</div>
	);
}

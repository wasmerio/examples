import { CodeTabs } from "@musi-lang/machines/preact";
import {
	commandRows,
	installCommandGroup,
	installPrerequisites,
	quickstartHtml,
} from "../../content";
import { siteCopy } from "../../lib/site-copy";
import type { AppRoute } from "../../routes";
import { ActionStrip, InlineAction, SecondaryAction } from "../../ui/actions";
import { HtmlSnippet } from "../../ui/html-snippet";
import {
	MachinesCodeFrame,
	MachinesGroupbox,
	MachinesMessage,
	MachinesSection,
} from "../../ui/machines";
import { SiteHeading } from "../../ui/site-heading";

export function InstallPage(_props: { route: AppRoute }) {
	const copy = siteCopy.install;
	const scriptInstallGroup = installCommandGroup("script");
	const cargoInstallGroup = installCommandGroup("cargo");
	const installSteps = [
		{
			label: "1",
			title: "Check needed tools",
			copy: "Install Rust, Cargo, and native libraries first.",
		},
		{
			label: "2",
			title: "Choose command",
			copy: "The install script is fastest. Cargo keeps the code on your computer.",
		},
		{
			label: "3",
			title: "Verify PATH",
			copy: "Both music and musi land in Cargo's bin directory.",
		},
		{
			label: "4",
			title: "Use commands",
			copy: "Use musi for projects. Use music for one file.",
		},
	];
	return (
		<div className="site-stack">
			<SiteHeading
				eyebrow={copy.eyebrow}
				title={copy.title}
				description={copy.description}
				actions={
					<ActionStrip>
						<SecondaryAction href="/learn">
							{siteCopy.nav.learn}
						</SecondaryAction>
						<InlineAction href="/community">
							{siteCopy.nav.community}
						</InlineAction>
					</ActionStrip>
				}
			/>

			<section className="install-step-list" aria-label="Install process">
				{installSteps.map((step) => (
					<MachinesMessage
						key={step.label}
						mark={step.label}
						className="install-step-message"
					>
						<strong>{step.title}</strong>
						<p>{step.copy}</p>
					</MachinesMessage>
				))}
			</section>

			<section
				className="mx-grid site-grid--three"
				aria-label={copy.prerequisitesLabel}
			>
				{installPrerequisites().map((item) => (
					<MachinesGroupbox
						key={item.title}
						legend={item.title}
						className="mx-groupbox--compact"
					>
						<h2>{item.value}</h2>
						<p>{item.copy}</p>
					</MachinesGroupbox>
				))}
			</section>

			<section
				className="install-command-grid"
				aria-label={siteCopy.ui.installCommands}
			>
				{scriptInstallGroup ? (
					<MachinesGroupbox
						legend={copy.installScriptsLabel}
						className="install-command-group"
					>
						<p className="site-copy site-copy--small">
							{scriptInstallGroup.copy}
						</p>
						{scriptInstallGroup.tabs ? (
							<CodeTabs
								label={copy.installScriptsLabel}
								tabs={scriptInstallGroup.tabs}
							/>
						) : null}
					</MachinesGroupbox>
				) : null}
				{cargoInstallGroup ? (
					<MachinesGroupbox
						legend={copy.cargoInstallLabel}
						className="install-command-group"
					>
						<p className="site-copy site-copy--small">
							{cargoInstallGroup.copy}
						</p>
						{cargoInstallGroup.html ? (
							<MachinesCodeFrame>
								<HtmlSnippet html={cargoInstallGroup.html} />
							</MachinesCodeFrame>
						) : null}
					</MachinesGroupbox>
				) : null}
				<MachinesGroupbox
					legend={copy.quickStartLabel}
					className="install-command-group"
				>
					<MachinesCodeFrame>
						<HtmlSnippet html={quickstartHtml} />
					</MachinesCodeFrame>
				</MachinesGroupbox>
			</section>

			<MachinesSection
				kicker={copy.commandMapLabel}
				title={copy.commandMapTitle}
			>
				<p className="site-copy site-copy--small">{copy.commandMapCopy}</p>
				<div className="mx-table-wrap">
					<table>
						<caption className="sr-only">
							{siteCopy.ui.commandReference}
						</caption>
						<thead>
							<tr>
								<th scope="col">{siteCopy.ui.useFor}</th>
								<th scope="col">{siteCopy.ui.command}</th>
								<th scope="col">{siteCopy.ui.description}</th>
							</tr>
						</thead>
						<tbody>
							{commandRows().map((row) => (
								<tr key={row.command}>
									<td>{row.audience}</td>
									<td>
										<code>{row.command}</code>
									</td>
									<td>{row.description}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</MachinesSection>
		</div>
	);
}

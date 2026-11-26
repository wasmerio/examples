import {
	CodeTabs,
	Disclosure,
	Drawer,
	LiveFilter,
	MeterBar,
	ProgressBar,
	Slider,
	Tabs,
} from "@musi-lang/machines/preact";

export function MachinesWidgets() {
	return (
		<div class="mx-stack">
			<Tabs
				label="Machines widget tabs"
				items={[
					{
						id: "first",
						label: "First",
						content: (
							<p>
								Tab content keeps the old rail style but uses modern state and
								keyboard rules.
							</p>
						),
					},
					{
						id: "second",
						label: "Second",
						content: (
							<p>
								Widgets are optional. The visual language works without client
								JavaScript.
							</p>
						),
					},
				]}
			/>
			<CodeTabs
				label="Install command examples"
				tabs={[
					{
						id: "macos",
						label: "macOS / Linux",
						language: "sh",
						code: "curl -fsSL https://example.invalid/install.sh | sh",
					},
					{
						id: "windows",
						label: "Windows",
						language: "powershell",
						code: "irm https://example.invalid/install.ps1 | iex",
					},
				]}
			/>
			<div class="mx-grid">
				<Slider label="Density" defaultValue={64} min={0} max={100} />
				<ProgressBar label="Build progress" value={72} showValue={true} />
				<MeterBar
					label="Cache health"
					value={82}
					high={75}
					optimum={90}
					showValue={true}
				/>
			</div>
			<div class="mx-grid">
				<Disclosure title="Disclosure panel" open={true}>
					<p>Visible old-style box, modern disclosure behavior.</p>
				</Disclosure>
				<Drawer label="Drawer preview" buttonLabel="Open drawer preview">
					<p>
						Use for mobile navigation, inspector panels, or short page tools.
					</p>
				</Drawer>
			</div>
			<LiveFilter
				label="Live filter"
				items={[
					"Primary panel",
					"Secondary section",
					"Post layout",
					"Data table",
					"Message box",
					"Form field",
				]}
			/>
		</div>
	);
}

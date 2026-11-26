import { renderedSnippets } from "./generated-content";

export interface InstallPrerequisite {
	title: string;
	value: string;
	copy: string;
}

export interface CommandRow {
	command: string;
	description: string;
	audience: string;
}

export interface InstallCommandTab {
	id: string;
	label: string;
	html: string;
}

export interface InstallCommandGroup {
	id: string;
	title: string;
	copy: string;
	html?: string;
	tabs?: InstallCommandTab[];
}

const installPrerequisitesData: InstallPrerequisite[] = [
	{
		title: "Rust",
		value: "Rust 1.87 or newer",
		copy: "Builds the musi and music command tools.",
	},
	{
		title: "libffi",
		value: "System dev package",
		copy: "Needed for code that calls C.",
	},
	{
		title: "Git",
		value: "Any recent Git install",
		copy: "Downloads and updates project code.",
	},
];

const commandRowsData: CommandRow[] = [
	{
		command: "musi check",
		audience: "Project",
		description: "Check the current project.",
	},
	{
		command: "musi build",
		audience: "Project",
		description: "Build the current project entry.",
	},
	{
		command: "musi run",
		audience: "Project",
		description: "Run the current project entry.",
	},
	{
		command: "musi test",
		audience: "Project",
		description: "Discover and run *.test.ms files.",
	},
	{
		command: "music check index.ms",
		audience: "One file",
		description: "Check one file and what it imports.",
	},
	{
		command: "music build index.ms",
		audience: "One file",
		description: "Build one .seam file from one source file.",
	},
	{
		command: "music run index.seam",
		audience: "One file",
		description: "Run one built .seam file.",
	},
];

const installCommandGroupsData: InstallCommandGroup[] = [
	{
		id: "script",
		title: "Install script",
		copy: "Pick one install command. The scripts download the repository, then install both command tools with cargo install.",
		tabs: [
			{
				id: "curl",
				label: "macOS / Linux",
				html: renderedSnippets.installCurlHtml,
			},
			{
				id: "powershell",
				label: "Windows",
				html: renderedSnippets.installPowershellHtml,
			},
		],
	},
	{
		id: "cargo",
		title: "Cargo install",
		copy: "Use this when you already cloned the repository and want a local install.",
		html: renderedSnippets.installCargoHtml,
	},
];

export function installPrerequisites() {
	return installPrerequisitesData;
}

export function commandRows() {
	return commandRowsData;
}

export function installCommandGroups() {
	return installCommandGroupsData;
}

export function installCommandGroup(id: InstallCommandGroup["id"]) {
	return installCommandGroupsData.find((group) => group.id === id);
}

export const siteOrigin = "https://musi-lang.org";
export const homeSampleHtml = renderedSnippets.homeSampleHtml;
export const installCurlHtml = renderedSnippets.installCurlHtml;
export const installPowershellHtml = renderedSnippets.installPowershellHtml;
export const installCargoHtml = renderedSnippets.installCargoHtml;
export const quickstartHtml = renderedSnippets.quickstartHtml;

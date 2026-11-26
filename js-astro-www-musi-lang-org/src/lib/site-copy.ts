export type Locale = "en";

export interface SiteCopy {
	skipToContent: string;
	menu: string;
	nav: {
		learn: string;
		install: string;
		playground: string;
		community: string;
	};
	utilityLabels: {
		github: string;
	};
	ui: {
		sample: string;
		open: string;
		openSection: string;
		primaryPaths: string;
		docsEntryPoints: string;
		questions: string;
		openFirstChapter: string;
		openQuestions: string;
		learnSection: string;
		chapters: string;
		onThisPage: string;
		chapterNavigation: string;
		previousChapter: string;
		nextChapter: string;
		communityLinks: string;
		installCommands: string;
		commandReference: string;
		useFor: string;
		command: string;
		description: string;
		status: string;
		startHere: string;
		fastPath: string;
		unusualCases: string;
		findDocs: string;
	};
	home: {
		eyebrow: string;
		title: string;
		description: string;
		sectionsTitle: string;
		summary: string[];
		primaryCta: string;
		secondaryCta: string;
		tertiaryCta: string;
		statusItems: Array<{ label: string; value: string; copy: string }>;
		taskBoards: Array<{
			label: string;
			title: string;
			copy: string;
			href: string;
			actionLabel: string;
		}>;
		sections: Array<{ title: string; copy: string }>;
	};
	install: {
		eyebrow: string;
		title: string;
		description: string;
		prerequisitesLabel: string;
		installScriptsLabel: string;
		cargoInstallLabel: string;
		quickStartLabel: string;
		commandMapLabel: string;
		commandMapTitle: string;
		commandMapCopy: string;
	};
	playground: {
		eyebrow: string;
		title: string;
		copy: string;
		statusTitle: string;
		statusCopy: string;
	};
	community: {
		eyebrow: string;
		title: string;
		description: string;
		sections: Array<{
			title: string;
			copy: string;
			href: string;
			label: string;
		}>;
	};
	learn: {
		eyebrow: string;
		title: string;
		description: string;
		startTitle: string;
		questionsTitle: string;
		partsTitle: string;
	};
}

export const siteCopy = {
	skipToContent: "Skip to main content",
	menu: "Menu",
	nav: {
		learn: "Learn",
		install: "Install",
		playground: "Playground",
		community: "Community",
	},
	utilityLabels: {
		github: "GitHub repository",
	},
	ui: {
		sample: "Sample",
		open: "Open",
		openSection: "Open section",
		primaryPaths: "Primary paths",
		docsEntryPoints: "Docs Entry Points",
		questions: "Questions",
		openFirstChapter: "Open First Chapter",
		openQuestions: "Open questions",
		learnSection: "Learn",
		chapters: "Chapters",
		onThisPage: "On this page",
		chapterNavigation: "Chapter Navigation",
		previousChapter: "Previous Chapter",
		nextChapter: "Next Chapter",
		communityLinks: "Community Links",
		installCommands: "Install Commands",
		commandReference: "Musi command reference",
		useFor: "Use for",
		command: "Command",
		description: "Description",
		status: "Status",
		startHere: "Start here",
		fastPath: "I know what I need",
		unusualCases: "Unusual cases",
		findDocs: "Find docs",
	},
	home: {
		eyebrow: "Home",
		title: "What is Musi?",
		description:
			"Musi is a programming language where most code gives a value. It has pattern matching, effects, and a small set of commands. Learn the language, install Musi, check the playground, and find project links from one site.",
		sectionsTitle: "Why Musi",
		summary: [
			"Most code gives a value, so data is easier to follow.",
			"Install from source. Use musi for a project and music for one file.",
			"Learn, install, playground, and project links each have their own page.",
		],
		primaryCta: "Start Learning",
		secondaryCta: "Install",
		tertiaryCta: "See Community",
		statusItems: [
			{
				label: "Docs",
				value: "Start with the book",
				copy: "Chapters use examples you can run and commands you can try.",
			},
			{
				label: "Install",
				value: "Install from source",
				copy: "Build Musi from source. Use musi for a project. Use music for one file.",
			},
			{
				label: "Playground",
				value: "Not ready yet",
				copy: "The browser runner is not ready. Install Musi to run code now.",
			},
		],
		taskBoards: [
			{
				label: "Start here",
				title: "Read Musi Book",
				copy: "Start with setup. Then learn syntax, data, types, effects, and commands.",
				href: "/learn/book",
				actionLabel: "Open book",
			},
			{
				label: "I know what I need",
				title: "Install and Commands",
				copy: "Go straight to needed tools, install commands, and when to use musi or music.",
				href: "/install",
				actionLabel: "Open install path",
			},
			{
				label: "Unusual cases",
				title: "Source, issues, and FFI",
				copy: "Find project links, unsafe/FFI docs, and GitHub issues.",
				href: "/community",
				actionLabel: "Open project links",
			},
		],
		sections: [
			{
				title: "Expression-first",
				copy: "Read files from top to bottom with let, match, and code that gives values.",
			},
			{
				title: "Effects stay clear",
				copy: "Use effects and handlers without extra setup code.",
			},
			{
				title: "Two commands",
				copy: "Use musi for a project. Use music for one file or one built file.",
			},
			{
				title: "Clear site pages",
				copy: "Learn, Install, Playground, and Community each have one clear job.",
			},
		],
	},
	install: {
		eyebrow: "Install",
		title: "Install Musi with Script or Cargo",
		description:
			"Install Rust and libffi first. Then use the install script or a local Cargo install. Both install music and musi into Cargo's bin directory.",
		prerequisitesLabel: "Needed tools",
		installScriptsLabel: "Install Script",
		cargoInstallLabel: "Cargo Install",
		quickStartLabel: "Quick Start",
		commandMapLabel: "Command Map",
		commandMapTitle: "Commands",
		commandMapCopy:
			"Use musi for a project most of the time. Use music when you want one file or one built file.",
	},
	playground: {
		eyebrow: "Playground",
		title: "Playground Status",
		copy: "The browser runner is planned, but it is not ready yet.",
		statusTitle: "Browser Playground Is Not Ready Yet",
		statusCopy:
			"This page shows playground status and links to install steps and GitHub issues.",
	},
	community: {
		eyebrow: "Community",
		title: "Join the Musi Project",
		description:
			"Find code, issues, ways to help, and discussion links in one place.",
		sections: [
			{
				title: "Repository",
				copy: "Browse code, tags, issues, and releases.",
				href: "https://github.com/musi-lang/musi",
				label: "Open GitHub",
			},
			{
				title: "Contributing",
				copy: "Read how to help and how project work happens.",
				href: "https://github.com/musi-lang/musi/blob/main/CONTRIBUTING.md",
				label: "Read contributing guide",
			},
			{
				title: "Issues",
				copy: "See bugs, language work, and open tasks.",
				href: "https://github.com/musi-lang/musi/issues",
				label: "Open issues",
			},
		],
	},
	learn: {
		eyebrow: "Learn",
		title: "Musi Book",
		description:
			"Read Musi in order with small beginner chapters. Learn with install steps and commands you can try.",
		startTitle: "Start at the beginning",
		questionsTitle: "Follow the chapters",
		partsTitle: "Parts and Chapters",
	},
} satisfies SiteCopy;

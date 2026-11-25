import chalk from "chalk";

// Bearnie brand colors
export const brand = {
  primary: chalk.hex("#F59E0B"), // Amber (bear/honey color)
  secondary: chalk.hex("#FCD34D"), // Light amber
  accent: chalk.hex("#FBBF24"), // Mid amber
  muted: chalk.dim,
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  info: chalk.cyan,
};

// ASCII Art - Bear inspired
export const banner = `
${brand.primary("   ╭─────────────────────────────────────╮")}
${brand.primary("   │")}  ${brand.secondary("🐻")} ${chalk.bold.white("bearnie")}                         ${brand.primary("│")}
${brand.primary("   │")}  ${brand.muted("UI components for Astro")}           ${brand.primary("│")}
${brand.primary("   ╰─────────────────────────────────────╯")}
`;

// Smaller inline logo
export const logo = `${brand.secondary("🐻")} ${chalk.bold.white("bearnie")}`;

// Playful messages
export const messages = {
  // Greetings
  greeting: () => `${brand.primary("Hey!")} Let's build something beautiful.`,
  
  // Init messages
  initStart: () => `${brand.primary("Hey!")} Let's set up your project.`,
  initSuccess: () => `${brand.success("✓")} ${chalk.bold("You're all set!")} Time to add some components.`,
  alreadyInit: () => `Looks like Bearnie is already set up here.`,
  
  // Add messages
  addStart: () => `${brand.primary("Hey!")} Let's add some components.`,
  fetching: () => `Fetching the good stuff...`,
  foundComponents: (count: number) => `Found ${chalk.bold(count)} components ready to use`,
  resolving: () => `Gathering what you need...`,
  installing: (name: string) => `Adding ${chalk.cyan(name)}...`,
  installed: (name: string) => `${brand.success("✓")} ${name} is ready`,
  installingDeps: () => `Installing dependencies...`,
  
  // List messages
  listHeader: (version: string) => `${logo} ${brand.muted(`v${version}`)}`,
  listFooter: (count: number) => `${brand.accent("🐻")} ${count} components available`,
  
  // Success messages (randomized for fun)
  success: () => {
    const messages = [
      `${brand.success("🎉")} ${chalk.bold("All done!")} Happy building!`,
      `${brand.success("✨")} ${chalk.bold("Looking good!")} Your components are ready.`,
      `${brand.success("🐻")} ${chalk.bold("Done!")} Time to make something awesome.`,
      `${brand.success("🚀")} ${chalk.bold("Ready to go!")} Have fun building!`,
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  },
  
  // Error messages (friendly, not scary)
  notAstro: () => `Hmm, this doesn't look like an Astro project.`,
  notAstroHelp: () => `Make sure you're in the root of an Astro project with a package.json.`,
  networkError: () => `Couldn't reach the component registry.`,
  networkErrorHelp: () => `Check your internet connection and try again.`,
  unknownComponent: (names: string[]) => 
    `Couldn't find: ${names.map(n => chalk.yellow(n)).join(", ")}`,
  
  // Hints
  hint: (text: string) => brand.muted(`  💡 ${text}`),
  nextStep: (step: string) => `   ${brand.muted("→")} ${step}`,
};

// Box drawing for nicer output
export function box(content: string, title?: string): string {
  const lines = content.split("\n");
  const maxLen = Math.max(...lines.map(l => stripAnsi(l).length), title ? stripAnsi(title).length + 4 : 0);
  const width = maxLen + 4;
  
  let result = brand.muted("╭" + "─".repeat(width - 2) + "╮") + "\n";
  
  if (title) {
    result += brand.muted("│") + " " + chalk.bold(title) + " ".repeat(width - stripAnsi(title).length - 3) + brand.muted("│") + "\n";
    result += brand.muted("├" + "─".repeat(width - 2) + "┤") + "\n";
  }
  
  for (const line of lines) {
    const padding = width - stripAnsi(line).length - 3;
    result += brand.muted("│") + " " + line + " ".repeat(padding) + brand.muted("│") + "\n";
  }
  
  result += brand.muted("╰" + "─".repeat(width - 2) + "╯");
  return result;
}

// Strip ANSI codes for length calculation
function stripAnsi(str: string): string {
  return str.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");
}

// Spacing helpers
export const newline = () => console.log();
export const space = (n: number = 1) => console.log("\n".repeat(n - 1));

// Print helpers
export const print = {
  banner: () => console.log(banner),
  logo: () => console.log(`\n  ${logo}\n`),
  greeting: () => console.log(`\n  ${messages.greeting()}\n`),
  success: () => console.log(`\n  ${messages.success()}\n`),
  newline: () => console.log(),
  
  // Formatted output
  step: (text: string) => console.log(`  ${text}`),
  hint: (text: string) => console.log(messages.hint(text)),
  error: (text: string) => console.log(`  ${brand.error("✗")} ${text}`),
  warning: (text: string) => console.log(`  ${brand.warning("⚠")} ${text}`),
  info: (text: string) => console.log(`  ${brand.info("ℹ")} ${text}`),
  
  // Next steps box
  nextSteps: (steps: string[]) => {
    console.log();
    console.log(`  ${chalk.bold("Next steps:")}`);
    steps.forEach((step, i) => {
      console.log(`  ${brand.muted(`${i + 1}.`)} ${step}`);
    });
    console.log();
  },
  
  // Footer
  footer: () => {
    const link = (text: string, url: string) => 
      `\u001B]8;;${url}\u0007${chalk.cyan(text)}\u001B]8;;\u0007`;
    
    console.log(`  ${brand.secondary("🐻")} ${brand.muted("Made by")} ${link("Michael Andreuzza", "https://michaelandreuzza.com")} ${brand.muted("at")} ${link("Lexington Themes", "https://lexingtonthemes.com")}`);
    console.log(`  ${brand.muted("Love Bearnie?")} ${link("Sponsor", "https://github.com/sponsors/michael-andreuzza")} ${brand.muted("🖤")}`);
    console.log();
  },
};

// Custom prompts styling (for prompts library)
export const promptsTheme = {
  prefix: brand.secondary("?"),
  highlight: brand.accent,
  submit: brand.success("✓"),
};

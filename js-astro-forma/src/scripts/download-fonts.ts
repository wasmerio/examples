import fs from 'node:fs';
import path from 'node:path';

const CSS_FILE = path.join(process.cwd(), 'src/styles/fonts.css');
const EXPECTED_CSS = '/* Fonty są dołączone do projektu, dzięki czemu build nie zależy od zewnętrznego CDN. */\n@import "@fontsource-variable/instrument-sans";\n';

// Fonts are installed with the project so production builds stay deterministic
// and do not depend on a network request or a mutable external stylesheet.
if (!fs.existsSync(CSS_FILE) || fs.readFileSync(CSS_FILE, 'utf8') !== EXPECTED_CSS) {
  fs.writeFileSync(CSS_FILE, EXPECTED_CSS);
}

console.log('Font setup verified: @fontsource-variable/instrument-sans.');

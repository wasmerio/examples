/**
 * Theme CSS Generator Script
 * 
 * Automatically generates theme.css files from tokens.ts files.
 * This eliminates duplication - you only need to define tokens once!
 * 
 * Usage: npm run generate-themes
 * 
 * Architecture Decision: We generate CSS at build time rather than runtime because:
 * 1. Better performance - CSS is static and can be optimized
 * 2. Works with SSR - no JavaScript needed for theme application
 * 3. Easier debugging - CSS files are human-readable
 * 4. Better tooling support - CSS linters, formatters work on generated files
 */

import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const themesDir = join(projectRoot, 'src/themes');

/**
 * Dynamically import theme utilities
 * Works with tsx which handles TypeScript imports
 */
async function importThemeUtils() {
  try {
    // tsx allows importing .ts files directly
    const utils = await import('../src/themes/utils.ts');
    const generator = await import('../src/themes/darkVariantGenerator.ts');
    
    if (!utils.tokensToCSS || !generator.generateDarkVariant) {
      throw new Error('Required functions not found in imported modules');
    }
    
    return { 
      tokensToCSS: utils.tokensToCSS, 
      generateDarkVariant: generator.generateDarkVariant 
    };
  } catch (error) {
    throw new Error(
      `Could not import theme utilities: ${error instanceof Error ? error.message : String(error)}\n` +
      'Make sure to run this script with tsx: npm run generate-themes'
    );
  }
}

/**
 * Generate CSS for a theme
 */
async function generateThemeCSSFile(themeDir: string, themeId: string, utils: any): Promise<void> {
  const tokensPath = join(themeDir, 'tokens.ts');
  const metaPath = join(themeDir, 'meta.json');
  const cssPath = join(themeDir, 'theme.css');
  
  // Check if tokens.ts exists
  try {
    await stat(tokensPath);
  } catch {
    console.warn(`⚠️  Skipping ${themeId}: tokens.ts not found`);
    return;
  }
  
  // Dynamically import tokens (tsx handles TypeScript imports)
  let tokens;
  try {
    // Use relative path from project root
    const tokensModule = await import(`../src/themes/${themeId}/tokens.ts`);
    tokens = tokensModule.tokens;
    
    if (!tokens) {
      console.warn(`⚠️  Skipping ${themeId}: tokens export not found in tokens.ts`);
      return;
    }
  } catch (error) {
    console.warn(`⚠️  Skipping ${themeId}: Could not import tokens.ts`);
    if (error instanceof Error && error.message.includes('Cannot find module')) {
      console.warn(`   Make sure tokens.ts exists in src/themes/${themeId}/`);
    } else {
      console.warn(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    }
    return;
  }
  
  // Read meta.json
  let meta;
  try {
    const metaContent = await readFile(metaPath, 'utf-8');
    meta = JSON.parse(metaContent);
  } catch {
    console.warn(`⚠️  Skipping ${themeId}: meta.json not found`);
    return;
  }
  
  // Handle special cases for light and dark themes
  let finalCSS: string;
  
  if (themeId === 'light') {
    // Light theme uses :root selector (default theme)
    const cssProps = utils.tokensToCSS(tokens);
    finalCSS = `/* ${meta.name} Theme - Generated from tokens */\n:root {\n${cssProps}\n}\n`;
  } else if (themeId === 'dark') {
    // Dark theme uses [data-theme="dark"] without mode selector
    const cssProps = utils.tokensToCSS(tokens);
    finalCSS = `/* ${meta.name} Theme - Generated from tokens */\n[data-theme="dark"] {\n${cssProps}\n}\n`;
  } else {
    // Color themes have both light and dark modes
    const darkTokens = utils.generateDarkVariant(tokens);
    const lightProps = utils.tokensToCSS(tokens);
    const darkProps = utils.tokensToCSS(darkTokens);
    finalCSS = `/* ${meta.name} Theme - Light mode */\n[data-theme="${themeId}"][data-mode="light"] {\n${lightProps}\n}\n\n/* ${meta.name} Theme - Dark mode */\n[data-theme="${themeId}"][data-mode="dark"] {\n${darkProps}\n}\n`;
  }
  
  // Write to theme.css
  await writeFile(cssPath, finalCSS, 'utf-8');
  console.log(`✅ Generated theme.css for ${themeId}`);
}

/**
 * Main function
 */
async function main() {
  console.log('🎨 Generating theme CSS files from tokens...\n');
  
  try {
    // Import utilities
    const utils = await importThemeUtils();
    
    const entries = await readdir(themesDir, { withFileTypes: true });
    const themeDirs = entries.filter(entry => entry.isDirectory());
    
    // Filter out non-theme directories
    const validThemeDirs = themeDirs.filter(dir => {
      const dirName = dir.name;
      // Skip utility directories and files
      return dirName !== 'node_modules' && 
             !dirName.startsWith('.') &&
             dirName !== '__tests__';
    });
    
    console.log(`Found ${validThemeDirs.length} theme directories\n`);
    
    // Generate CSS for each theme
    for (const dir of validThemeDirs) {
      const themeDir = join(themesDir, dir.name);
      await generateThemeCSSFile(themeDir, dir.name, utils);
    }
    
    console.log('\n✨ Theme generation complete!');
    console.log('💡 Tip: Run this script whenever you modify tokens.ts files');
  } catch (error) {
    console.error('❌ Error generating themes:', error);
    console.error('\n💡 Make sure to run this script with tsx:');
    console.error('   npx tsx scripts/generate-themes.ts');
    console.error('   Or add tsx as a dev dependency and use: npm run generate-themes');
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.includes('generate-themes')) {
  main();
}

export { main };

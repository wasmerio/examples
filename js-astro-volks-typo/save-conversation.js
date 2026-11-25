#!/usr/bin/env node

/**
 * Script to save Claude conversation context and summary
 * This helps preserve important decisions and context from Claude Code sessions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const CONVERSATION_DIR = 'claude-conversations';
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
const SESSION_ID = `session-${TIMESTAMP}-${Date.now()}`;

// Ensure conversation directory exists
if (!fs.existsSync(CONVERSATION_DIR)) {
  fs.mkdirSync(CONVERSATION_DIR, { recursive: true });
}

// Function to save conversation context
function saveConversationContext() {
  const contextFile = path.join(CONVERSATION_DIR, `${SESSION_ID}-context.md`);
  
  // Context to save (you can expand this based on your needs)
  const context = `# Claude Conversation Context
Session ID: ${SESSION_ID}
Date: ${new Date().toISOString()}

## Project State
- Working Directory: ${process.cwd()}
- Node Version: ${process.version}
- Platform: ${process.platform}

## Recent Changes
- Separated marketing files into volks-typo-marketing repository
- Cleaned up main theme repository
- Updated .gitignore to exclude claude-conversations

## Files Modified in This Session
- .gitignore (added claude-conversations/)
- Removed MARKETING_PLAN.md
- Removed .github/GOOD_FIRST_ISSUES/
- Created setup-marketing-repo.sh (later removed)

## Key Decisions
1. Separated marketing strategy from theme code for cleaner repository
2. Created script-based approach for setting up marketing repo
3. Implemented conversation saving mechanism

## Commands Executed
- Created claude-conversations directory
- Updated .gitignore
- Git operations for cleaning up marketing files

## Next Steps
- Run setup-marketing-repo.sh from Projects directory
- Create private GitHub repo for marketing
- Push changes to both repositories
`;

  fs.writeFileSync(contextFile, context);
  console.log(`✅ Saved conversation context to: ${contextFile}`);
  return contextFile;
}

// Function to create summary
function createSummary() {
  const summaryFile = path.join(CONVERSATION_DIR, `${SESSION_ID}-summary.md`);
  
  const summary = `# Claude Session Summary
Session ID: ${SESSION_ID}
Date: ${new Date().toISOString()}

## Overview
This session focused on cleaning up the Volks-Typo theme repository by separating marketing-related files into a dedicated private repository.

## Major Accomplishments

### 1. Repository Separation
- **What**: Moved marketing files to separate repository structure
- **Why**: Keep theme repo focused on product, hide marketing strategy
- **Files Moved**:
  - MARKETING_PLAN.md
  - .github/GOOD_FIRST_ISSUES/ (4 issue templates)

### 2. Marketing Repository Setup
- Created comprehensive structure in /tmp/volks-typo-marketing/
- Added README.md explaining the marketing repo purpose
- Added .gitignore for marketing-specific files
- Created setup-marketing-repo.sh script for easy setup

### 3. Theme Repository Cleanup
- Removed all marketing-related files
- Committed changes with descriptive message
- Maintained clean git history

### 4. Conversation Preservation
- Created claude-conversations/ directory
- Updated .gitignore to exclude conversation logs
- Built system to save session context and summaries

## Technical Decisions

### Repository Structure
- **Main Repo (volks-typo)**: Public, theme-only files
- **Marketing Repo (volks-typo-marketing)**: Private, strategy and growth initiatives

### File Organization
\`\`\`
volks-typo/                    # Clean theme repository
├── src/                       # Theme source
├── public/                    # Public assets
├── screenshots/               # Theme screenshots
└── claude-conversations/      # Private conversation logs (gitignored)

volks-typo-marketing/          # Separate marketing repository
├── MARKETING_PLAN.md          # Strategy document
├── .github/GOOD_FIRST_ISSUES/ # Issue templates
└── README.md                  # Repo documentation
\`\`\`

## Implementation Notes

### Security Considerations
- Used /tmp directory for staging due to security restrictions
- Created executable script for manual repo setup
- Ensured private files are properly gitignored

### Git Workflow
1. Copied files to temporary location
2. Removed from main repository
3. Created setup script for user to run
4. Committed changes with clear message

## Lessons Learned
- Claude Code has directory traversal restrictions for security
- Separating concerns improves repository professionalism
- Documentation and context preservation is valuable for continuity

## Follow-up Actions Required
1. User needs to run setup-marketing-repo.sh
2. Create private GitHub repository
3. Push both repositories to remotes
4. Consider creating issue templates in main repo for actual contributions

## Code Quality Notes
- All changes follow existing conventions
- Git commits use descriptive messages
- File organization maintains clarity
- Scripts include helpful documentation
`;

  fs.writeFileSync(summaryFile, summary);
  console.log(`✅ Saved session summary to: ${summaryFile}`);
  return summaryFile;
}

// Function to save current file states
function saveFileSnapshots() {
  const snapshotFile = path.join(CONVERSATION_DIR, `${SESSION_ID}-snapshots.md`);
  
  const snapshots = `# File Snapshots
Session ID: ${SESSION_ID}
Date: ${new Date().toISOString()}

## Key Files at End of Session

### .gitignore
\`\`\`
${fs.readFileSync('.gitignore', 'utf8')}
\`\`\`

### CLAUDE.md
\`\`\`
${fs.readFileSync('CLAUDE.md', 'utf8')}
\`\`\`

### package.json (excerpt)
\`\`\`json
${JSON.stringify(JSON.parse(fs.readFileSync('package.json', 'utf8')), null, 2).split('\n').slice(0, 20).join('\n')}
...
\`\`\`
`;

  fs.writeFileSync(snapshotFile, snapshots);
  console.log(`✅ Saved file snapshots to: ${snapshotFile}`);
  return snapshotFile;
}

// Main execution
console.log('🤖 Saving Claude conversation context...\n');

try {
  const contextFile = saveConversationContext();
  const summaryFile = createSummary();
  const snapshotFile = saveFileSnapshots();
  
  console.log('\n✨ Successfully saved conversation data:');
  console.log(`   - Context: ${contextFile}`);
  console.log(`   - Summary: ${summaryFile}`);
  console.log(`   - Snapshots: ${snapshotFile}`);
  console.log('\n📁 All files saved in:', CONVERSATION_DIR);
} catch (error) {
  console.error('❌ Error saving conversation:', error.message);
  process.exit(1);
}
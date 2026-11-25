import fs from 'node:fs';

const report = JSON.parse(fs.readFileSync('./dist/lighthouse-report.json', 'utf8'));

console.log('=============================================');
console.log('       LIGHTHOUSE AUDIT SCORES (LIVE)        ');
console.log('=============================================');
for (const [, data] of Object.entries(report.categories)) {
  console.log(`${data.title}: ${Math.round(data.score * 100)}/100`);
}
console.log('=============================================\n');

console.log('Audits with opportunities or issues:');
let issueCount = 0;
for (const [id, audit] of Object.entries(report.audits)) {
  if (audit.score !== null && audit.score < 1 && audit.scoreDisplayMode !== 'notApplicable' && audit.scoreDisplayMode !== 'informative') {
    console.log(`- [${id}] ${audit.title}`);
    if (audit.explanation) console.log(`  Explanation: ${audit.explanation}`);
    if (audit.displayValue) console.log(`  Value: ${audit.displayValue}`);
    issueCount++;
    if (id === 'color-contrast') {
      console.log('\n  Contrast Breakdown:');
      audit.details.items.forEach((item, idx) => {
        console.log(`  (${idx + 1}) Selector: ${item.node.selector}`);
        console.log(`      Snippet:  ${item.node.snippet}`);
        console.log(`      Details:  ${item.node.explanation || 'N/A'}`);
      });
    }
  }
}

if (issueCount === 0) {
  console.log('Zero issues found in evaluated categories! Perfect score!');
}

const forbiddenText = [
  ['source nickname', new RegExp([[0x5c0f, 0x9c7c], [0x4e56, 0x4e56], [0x6bdb, 0x6bdb]].map((points) => String.fromCodePoint(...points)).join('|'))],
  ['source domain', /20241006\.love/i],
  ['source anniversary date', new RegExp([`${'2024'}-10-06`, `${'2026'}-03-12`].join('|').replaceAll('-', '[-.]'))],
];

const forbiddenPath = [
  ['source image directory', /(?:^|\/)src\/assets\/images\/(?:cover|timeline|q-avatar|pet)\//i],
  ['source-specific docs or screenshots', /(?:^|\/)(?:artifacts\/visual-checks|\.impeccable\/|screenshots?\/source|private-notes?\/)/i],
];

export function auditPublicFiles(files) {
  const issues = [];
  for (const { path, content = '' } of files) {
    for (const [label, pattern] of forbiddenPath) if (pattern.test(path)) issues.push(`${path}: ${label}`);
    const text = Buffer.isBuffer(content) ? content.toString('utf8') : String(content);
    for (const [label, pattern] of forbiddenText) if (pattern.test(text)) issues.push(`${path}: contains ${label}`);
    const demoRaster = /^src\/assets\/images\/demo\/[^/]+\.(?:jpe?g|png|webp)$/i.test(path);
    if (/^src\/assets\/images\//i.test(path) && /\.(?:jpe?g|png|webp)$/i.test(path) && !demoRaster) issues.push(`${path}: sample art outside demo/ must stay vector illustrations`);
  }
  return issues;
}

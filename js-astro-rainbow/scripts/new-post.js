const fs = require('fs');
const path = require('path');

let title = process.argv[2];
if (!title) {
    console.error('Please provide a title as an argument.');
    process.exit(1);
}

const currentDate = new Date().toISOString();

const markdownContent = `---
title: ${title}
publishDate: ${currentDate}
draft: true
tags: []
---
`;

const fileName = `${title.replace(/\s+/g, '-')}.md`;
const filePath = path.join(__dirname, '../src/content/blog', fileName);

fs.mkdirSync(path.dirname(filePath), { recursive: true });

if (fs.existsSync(filePath)) {
    console.log(`File not created: A file with the name "${fileName}" already exists.`);
    return;
}

fs.writeFile(filePath, markdownContent, (err) => {
    if (err) {
        console.error('Failed to create the file:', err);
    } else {
        console.log(`File created successfully: ${filePath}`);
    }
});

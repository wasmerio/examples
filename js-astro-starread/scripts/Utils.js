import fs from 'fs';
import path from 'path';

const SUPPORTED_LANGS = ['zh', 'en', 'ja', 'ko', 'ru'];
const DEFAULT_LANG = 'zh';

export function parseFrontmatter(fileContent) {
  const normalizedContent = fileContent.replace(/\r\n/g, '\n');
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = normalizedContent.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content: fileContent };
  }
  
  const frontmatterText = match[1];
  const content = match[2];
  const data = {};
  
  const lines = frontmatterText.split('\n');
  let currentKey = '';
  let currentValue = '';
  let inMultiline = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }
    
    if (inMultiline) {
      if (trimmedLine.startsWith('-') || trimmedLine.includes(':')) {
        if (currentKey) {
          data[currentKey] = currentValue.trim();
        }
        currentKey = '';
        currentValue = '';
        inMultiline = false;
      } else {
        currentValue += '\n' + line;
        continue;
      }
    }
    
    if (trimmedLine.startsWith('- ')) {
      const arrayItem = trimmedLine.substring(2).trim();
      if (currentKey) {
        if (Array.isArray(data[currentKey])) {
          data[currentKey].push(arrayItem);
        } else {
          data[currentKey] = [data[currentKey], arrayItem];
        }
      }
      continue;
    }
    
    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex !== -1) {
      currentKey = trimmedLine.substring(0, colonIndex).trim();
      const valuePart = trimmedLine.substring(colonIndex + 1).trim();
      
      if (valuePart === '|' || valuePart === '>') {
        inMultiline = true;
        currentValue = '';
      } else if (valuePart.startsWith('[')) {
        try {
          data[currentKey] = JSON.parse(valuePart.replace(/'/g, '"'));
        } catch {
          const arrayContent = valuePart.slice(1, -1).trim();
          data[currentKey] = arrayContent
            ? arrayContent.split(',').map(item => item.trim().replace(/['"]/g, ''))
            : [];
        }
      } else if (valuePart.toLowerCase() === 'true') {
        data[currentKey] = true;
      } else if (valuePart.toLowerCase() === 'false') {
        data[currentKey] = false;
      } else if (!isNaN(Number(valuePart)) && valuePart !== '') {
        data[currentKey] = Number(valuePart);
      } else if (
        (valuePart.startsWith('"') && valuePart.endsWith('"')) ||
        (valuePart.startsWith("'") && valuePart.endsWith("'"))
      ) {
        data[currentKey] = valuePart.substring(1, valuePart.length - 1);
      } else {
        data[currentKey] = valuePart;
      }
    }
  }
  
  if (inMultiline && currentKey) {
    data[currentKey] = currentValue.trim();
  }
  
  return { data, content };
}

export function getPathInfo(filePath) {
  const pathParts = filePath.split(path.sep);
  const contentIndex = pathParts.indexOf('content');
  
  if (contentIndex === -1) {
    return { topic: '', lang: DEFAULT_LANG, id: '' };
  }
  
  const fileName = path.basename(filePath);
  const fileBase = fileName.replace(/\.(md|mdx)$/, '');
  
  const nextPart = pathParts[contentIndex + 1];
  
  if (SUPPORTED_LANGS.includes(nextPart)) {
    const lang = nextPart;
    const remainingParts = pathParts.slice(contentIndex + 2);
    const topic = remainingParts.join('/').replace(/\.(md|mdx)$/, '');
    const id = `${lang}/${topic}`;
    return { topic, lang, id };
  } else {
    const topic = pathParts.slice(contentIndex + 1).join('/').replace(/\.(md|mdx)$/, '');
    return { topic, lang: DEFAULT_LANG, id: topic };
  }
}

export function getCurrentDate() {
  const date = new Date();
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date).replace(/\//g, '-');
}

export function showProgress(current, total, status = '') {
  if (total === 0) return;
  const barLength = 30;
  const progress = Math.floor((current / total) * barLength);
  const bar = '█'.repeat(progress) + '░'.repeat(barLength - progress);
  const percentage = Math.floor((current / total) * 100);
  process.stdout.write(`\r${status} [${bar}] ${percentage}% (${current}/${total})`);
}

export function countMarkdownFiles(dir) {
  let count = 0;
  function countInDir(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        countInDir(itemPath);
      } else if (path.extname(item).toLowerCase() === '.md') {
        count++;
      }
    }
  }
  countInDir(dir);
  return count;
}

export function updateFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let frontmatterStart = -1;
    let frontmatterEnd = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        if (frontmatterStart === -1) {
          frontmatterStart = i;
        } else if (i > frontmatterStart) {
          frontmatterEnd = i;
          break;
        }
      }
    }
    
    if (frontmatterStart === -1 || frontmatterEnd === -1) {
      return false;
    }
    
    const frontmatterLines = lines.slice(frontmatterStart + 1, frontmatterEnd);
    let hasDate = false;
    
    for (const line of frontmatterLines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('date:')) {
        hasDate = true;
        break;
      }
    }
    
    if (hasDate) {
      return false;
    }
    
    const updatedFrontmatterLines = [...frontmatterLines];
    updatedFrontmatterLines.push(`date: ${getCurrentDate()}`);
    
    const updatedLines = [
      ...lines.slice(0, frontmatterStart + 1),
      ...updatedFrontmatterLines,
      ...lines.slice(frontmatterEnd)
    ];
    
    fs.writeFileSync(filePath, updatedLines.join('\n'), 'utf8');
    return true;
    
  } catch {
    return false;
  }
}

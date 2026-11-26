#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  parseFrontmatter, 
  getPathInfo, 
  showProgress, 
  countMarkdownFiles,
  getCurrentDate
} from './Utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.join(process.cwd(), 'src/content');
const outputPath = path.join(process.cwd(), 'public/data.json');
const astroConfigPath = path.join(process.cwd(), 'astro.config.mjs');

const SUPPORTED_LANGS = ['zh', 'en', 'ja', 'ko', 'ru'];
const DEFAULT_LANG = 'zh';

function stripImages(text) {
  if (!text) return '';
  let result = text;
  result = result.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  result = result.replace(/<img\s[^>]*>/gi, '');
  result = result.replace(/<!--[\s\S]*?-->/g, '');
  return result;
}

let siteUrl = '';
try {
  const configContent = fs.readFileSync(astroConfigPath, 'utf8');
  const siteMatch = configContent.match(/site:\s*["']([^"']+)["']/);
  if (siteMatch && siteMatch[1]) {
    siteUrl = siteMatch[1].replace(/\/$/, '');
  }
} catch (error) {
  console.warn('读取astro.config.mjs文件失败:', error.message);
}

function processContent(contentDir, index, progress) {
  if (!fs.existsSync(contentDir)) {
    console.log(`⚠️  ${contentDir} 目录不存在，跳过处理`);
    return;
  }
  
  function processRecursive(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        processRecursive(itemPath);
      } else if (path.extname(item).toLowerCase() === '.md') {
        try {
          const fileContent = fs.readFileSync(itemPath, 'utf8');
          const { data, content } = parseFrontmatter(fileContent);
          
          let coverPath = data.cover || '/defaultCover.jpg';
          if (coverPath && !coverPath.startsWith('http') && siteUrl) {
            coverPath = siteUrl + coverPath;
          }
          
          const { topic, lang, id } = getPathInfo(itemPath);
          
          let route;
          if (lang === DEFAULT_LANG) {
            route = `/${topic}`;
          } else {
            route = `/${lang}/${topic}`;
          }
          
          index.push({
            title: data.title || 'Untitled',
            description: data.description || '',
            cover: coverPath,
            categories: Array.isArray(data.categories) ? data.categories : (data.categories ? [data.categories] : []),
            tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
            date: data.date || '',
            content: stripImages(content).trim(),
            id: id,
            topic: topic,
            lang: lang,
            route: route
          });
          
          progress.processed++;
          showProgress(progress.processed, progress.total, '📄 正在处理内容');
        } catch (error) {
          console.error(`处理文件 ${itemPath} 失败:`, error.message);
        }
      }
    }
  }
  
  processRecursive(contentDir);
  console.log(`\n✅ 处理完成 ${contentDir} 目录`);
}

export function generateIndex() {
  const index = [];
  const totalFiles = countMarkdownFiles(contentDir);
  
  if (totalFiles === 0) {
    console.log('未找到 markdown 文件');
    return;
  }
  
  const progress = { processed: 0, total: totalFiles };
  
  processContent(contentDir, index, progress);
  
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
  console.log(`📝 索引生成成功: ${outputPath}`);
}

if (import.meta.url === new URL(process.argv[1], import.meta.url).href) {
  console.log('🔍 开始生成索引文件...');
  generateIndex();
  console.log('🎉 索引文件生成完成');
}

export default function autoIndex() {
  return {
    name: 'auto-index',
    hooks: {
      'astro:config:setup': async () => {
        console.log('✨ 自动生成索引文件...');
        try {
          generateIndex();
          console.log('🎉 索引文件生成完成');
        } catch (error) {
          console.error(`❌ 生成索引文件失败: ${error.message}`);
          throw error;
        }
      },
    },
  };
}

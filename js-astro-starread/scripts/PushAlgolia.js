#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { algoliasearch } from 'algoliasearch';
import { generateIndex } from './AutoIndex.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile() {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.warn('⚠️ .env 文件不存在');
    return;
  }
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      const trimmedKey = key.trim();
      const trimmedValue = valueParts.join('=').trim();
      if (trimmedKey && !trimmedKey.startsWith('#')) {
        process.env[trimmedKey] = trimmedValue;
      }
    });
    console.log(`✅ 成功加载.env文件: ${envPath}`);
  } catch (error) {
    console.warn('⚠️ 读取 .env 文件失败:', error.message);
  }
}

function getSiteUrl() {
  try {
    const astroConfigPath = path.join(process.cwd(), 'astro.config.mjs');
    const configContent = fs.readFileSync(astroConfigPath, 'utf8');
    const siteMatch = configContent.match(/site:\s*["']([^"']+)["']/);
    if (siteMatch && siteMatch[1]) {
      const url = siteMatch[1].replace(/\/$/, '');
      console.log(`🌐 检测到站点URL: ${url}`);
      return url;
    }
  } catch (error) {
    console.warn('⚠️ 读取astro.config.mjs文件失败:', error.message);
  }
  return 'http://localhost:4321';
}

function loadData() {
  const dataPath = path.join(process.cwd(), 'public/data.json');
  console.log(`📂 读取数据文件: ${dataPath}`);
  const raw = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(raw);
}

function validateConfig() {
  const APP_ID = process.env.PUBLIC_ALGOLIA_APP_ID;
  const ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY || process.env.ALGOLIA_WRITE_API_KEY;
  const INDEX_NAME = process.env.PUBLIC_ALGOLIA_INDEX_NAME;

  if (!APP_ID) {
    console.error('❌ 错误: 缺少 PUBLIC_ALGOLIA_APP_ID 环境变量');
    console.error('   请在 .env 文件中添加: PUBLIC_ALGOLIA_APP_ID=你的AppID');
    return null;
  }
  if (!ADMIN_API_KEY) {
    console.error('❌ 错误: 缺少 ALGOLIA_ADMIN_API_KEY 环境变量');
    console.error('   请在 .env 文件中添加: ALGOLIA_ADMIN_API_KEY=你的AdminAPIKey');
    console.error('   注意: 需要使用 Algolia Admin API Key (不是 Search API Key)');
    return null;
  }
  if (!INDEX_NAME) {
    console.error('❌ 错误: 缺少 PUBLIC_ALGOLIA_INDEX_NAME 环境变量');
    console.error('   请在 .env 文件中添加: PUBLIC_ALGOLIA_INDEX_NAME=你的索引名称');
    return null;
  }

  return { APP_ID, ADMIN_API_KEY, INDEX_NAME };
}

function prepareRecords(data, siteUrl) {
  return data.map((item, i) => {
    const truncatedContent = item.content ? item.content.substring(0, 1000) : '';
    
    let url, route;
    if (item.lang === 'zh') {
      url = `${siteUrl}/${item.topic}`;
      route = `/${item.topic}`;
    } else {
      url = `${siteUrl}/${item.lang}/${item.topic}`;
      route = `/${item.lang}/${item.topic}`;
    }

    return {
      objectID: item.objectID || `${i + 1}_${item.topic || 'content'}`,
      title: item.title || 'Untitled',
      description: item.description || '',
      cover: item.cover,
      categories: Array.isArray(item.categories) ? item.categories : (item.categories ? [item.categories] : []),
      tags: Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : []),
      date: item.date || '',
      content: truncatedContent,
      url: url,
      route: route,
      id: item.id,
      topic: item.topic || 'content',
      lang: item.lang || 'zh'
    };
  });
}

async function pushToAlgolia(config, records) {
  const { APP_ID, ADMIN_API_KEY, INDEX_NAME } = config;
  const client = algoliasearch(APP_ID, ADMIN_API_KEY);

  const res = await client.saveObjects({
    indexName: INDEX_NAME,
    objects: records,
    autoGenerateObjectIDIfNotExist: true,
  });

  console.log(`✅ 推送成功！任务 ID: ${res.taskID}，共 ${records.length} 条数据`);

  await client.setSettings({
    indexName: INDEX_NAME,
    indexSettings: {
      searchableAttributes: ['title', 'content', 'description', 'categories', 'tags', 'url'],
      attributesToSnippet: ['content:100'],
      customRanking: ['desc(date)'],
      attributesForFaceting: ['categories', 'tags', 'topic', 'lang']
    },
  });

  console.log('⚙️ 索引配置已更新！');
}

async function main() {
  loadEnvFile();
  generateIndex();
  const config = validateConfig();
  if (!config) {
    process.exit(1);
  }
  const data = loadData();
  const siteUrl = getSiteUrl();
  const records = prepareRecords(data, siteUrl);
  await pushToAlgolia(config, records);
  console.log('🎯 数据已写入索引完成！');
}

main().catch((err) => {
  console.error('❌ 推送失败:', err);
  process.exit(1);
});

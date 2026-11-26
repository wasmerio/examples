#!/usr/bin/env node

console.log(`
███████╗████████╗ █████╗  ██████╗      ██████╗ ███████╗ █████╗ ██████╗ 
██╔════╝╚══██╔══╝██╔══██╗ ██╔══██╗     ██╔══██╗██╔════╝██╔══██╗██╔══██╗ 
███████╗   ██║   ███████║ ██████╔╝     ██████╔╝█████╗  ███████║██║  ██║
╚════██║   ██║   ██╔══██║ ██╔══██╗     ██╔══██╗██╔══╝  ██╔══██║██║  ██║
███████║   ██║   ██║  ██║ ██║  ██║     ██║  ██║███████╗██║  ██║██████╔╝    
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═╝  ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝
`);

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  updateFrontmatter, 
  showProgress, 
  countMarkdownFiles,
  getCurrentDate
} from './Utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageDir = path.join(__dirname, '..');

const userFiles = [
  { src: 'starread.config.ts', dest: 'starread.config.ts', type: 'config' },
  { src: 'astro.config.mjs', dest: 'astro.config.mjs', type: 'config' },
  { src: 'tsconfig.json', dest: 'tsconfig.json', type: 'config' },
  { src: 'README.md', dest: 'README.md', type: 'doc' },
  { src: 'LICENSE', dest: 'LICENSE', type: 'doc' },
];

function getInstalledVersion(currentDir) {
  const nodeModulesPath = path.join(currentDir, 'node_modules', 'astro-theme-starread', 'package.json');
  if (fs.existsSync(nodeModulesPath)) {
    return JSON.parse(fs.readFileSync(nodeModulesPath, 'utf-8')).version;
  }
  return null;
}

function getPackageJsonVersion(currentDir) {
  const pkgJson = JSON.parse(fs.readFileSync(path.join(currentDir, 'package.json'), 'utf-8'));
  return pkgJson.dependencies?.['astro-theme-starread'] || null;
}

function mergeConfig(newConfig, oldConfig) {
  try {
    const newMatch = newConfig.match(/export const themeConfig: StarreadThemeConfig = ({[\s\S]*});/);
    const oldMatch = oldConfig.match(/export const themeConfig: StarreadThemeConfig = ({[\s\S]*});/);

    if (newMatch && oldMatch) {
      const newConfigObj = eval(`(${newMatch[1]})`);
      const oldConfigObj = eval(`(${oldMatch[1]})`);

      const merged = deepMerge(newConfigObj, oldConfigObj);

      const mergedConfig = `export const themeConfig: StarreadThemeConfig = ${JSON.stringify(merged, null, 2)};`;
      return newConfig.replace(newMatch[0], mergedConfig);
    }
  } catch (e) {
    console.error('\x1b[31m警告：无法自动合并配置，将保留用户配置\x1b[0m');
  }

  return oldConfig;
}

function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key of Object.keys(source)) {
    if (key in result && typeof result[key] === 'object' && typeof source[key] === 'object' && !Array.isArray(result[key])) {
      result[key] = deepMerge(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

async function checkThemeUpdate() {
  const currentDir = process.cwd();
  
  if (!fs.existsSync(path.join(currentDir, 'package.json'))) {
    return;
  }

  const pkgJsonVersion = getPackageJsonVersion(currentDir);
  if (!pkgJsonVersion) {
    return;
  }

  const themeVersion = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf-8')).version;
  const installedVersion = getInstalledVersion(currentDir);

  if (installedVersion === themeVersion) {
    return;
  }

  console.log('');
  console.log('\x1b[33m⚠️  检测到主题版本更新！\x1b[0m');
  console.log(`   当前安装：${installedVersion || '未安装'} → 可用：${themeVersion}`);
  console.log('');
  console.log('\x1b[34m📝 正在更新配置文件...\x1b[0m');

  for (const file of userFiles) {
    const srcPath = path.join(packageDir, file.src);
    const destPath = path.join(currentDir, file.dest);

    if (fs.existsSync(destPath)) {
      const destContent = fs.readFileSync(destPath, 'utf-8');
      const srcContent = fs.readFileSync(srcPath, 'utf-8');

      if (file.type === 'config') {
        const updatedContent = mergeConfig(srcContent, destContent);
        if (updatedContent !== destContent) {
          fs.writeFileSync(destPath, updatedContent);
          console.log(`\x1b[32m✅ 更新配置文件：${file.dest}\x1b[0m`);
        } else {
          console.log(`\x1b[36mℹ️  配置文件已是最新：${file.dest}\x1b[0m`);
        }
      } else {
        if (srcContent !== destContent) {
          fs.writeFileSync(destPath, srcContent);
          console.log(`\x1b[32m✅ 更新文件：${file.dest}\x1b[0m`);
        } else {
          console.log(`\x1b[36mℹ️  文件已是最新：${file.dest}\x1b[0m`);
        }
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`\x1b[32m✅ 创建文件：${file.dest}\x1b[0m`);
    }
  }

  console.log('');
  console.log('\x1b[32m🎉 配置文件更新完成！\x1b[0m');
  console.log('\x1b[35m提示：\x1b[0m');
  console.log('   如果配置结构有变化，请检查 starread.config.ts 并根据新结构调整你的配置');
  console.log('   运行 pnpm install 确保依赖已更新');
  console.log('');
}

function processDirectoryWithProgress(dir, totalFiles, progress) {
  let updatedCount = 0;
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      updatedCount += processDirectoryWithProgress(itemPath, totalFiles, progress);
    } else if (path.extname(item).toLowerCase() === '.md') {
      const updated = updateFrontmatter(itemPath);
      if (updated) {
        updatedCount++;
      }
      progress.processed++;
      showProgress(progress.processed, totalFiles, '📄 正在处理内容');
    }
  }
  return updatedCount;
}

function processDirectory(directory) {
  try {
    if (!fs.existsSync(directory)) {
      return 0;
    }
    
    const totalFiles = countMarkdownFiles(directory);
    if (totalFiles === 0) {
      return 0;
    }
    
    const progress = { processed: 0 };
    const updatedCount = processDirectoryWithProgress(directory, totalFiles, progress);
    process.stdout.write('\n');
    return updatedCount;
    
  } catch (error) {
    console.error(`❌ 处理目录时出错 ${directory}:`, error.message);
    return 0;
  }
}

function main() {
  const contentDir = path.join(process.cwd(), 'src', 'content');
  
  console.log('🔍 开始检查和更新frontmatter...\n');
  
  const updatedCount = processDirectory(contentDir);
  
  console.log(`✅ 共更新了 ${updatedCount} 个文件`);
  
  if (updatedCount > 0) {
    console.log('\n🔄 注意：已更新frontmatter文件。请重新启动开发服务器以应用更改。');
  }
}

if (import.meta.url === new URL(process.argv[1], import.meta.url).href) {
  main();
}

export default function autoUpdateFrontmatter() {
  return {
    name: 'auto-update-frontmatter',
    hooks: {
      'astro:config:setup': async () => {
        console.log('✨ 自动更新frontmatter...');
        try {
          main();
          console.log('🎉 frontmatter更新完成');
        } catch (error) {
          console.error(`❌ 更新frontmatter失败: ${error.message}`);
          throw error;
        }
      },
      'astro:server:start': async () => {
        console.log('🔍 检查主题版本更新...');
        try {
          await checkThemeUpdate();
        } catch (error) {
          console.error(`❌ 检查主题更新失败: ${error.message}`);
        }
      },
    },
  };
}
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cursorUp(n) {
  process.stdout.write(`\x1b[${n}A`);
}

function clearLine() {
  process.stdout.write("\x1b[2K\r");
}

async function typewriter(text, speed = 30, newLine = true) {
  for (let i = 0; i < text.length; i++) {
    process.stdout.write(text[i]);
    await delay(speed);
  }
  if (newLine) process.stdout.write("\n");
}

async function printBanner() {
  console.log(`\x1b[36m
███████╗████████╗ █████╗  ██████╗      ██████╗ ███████╗ █████╗ ██████╗ 
██╔════╝╚══██╔══╝██╔══██╗ ██╔══██╗     ██╔══██╗██╔════╝██╔══██╗██╔══██╗ 
███████╗   ██║   ███████║ ██████╔╝     ██████╔╝█████╗  ███████║██║  ██║
╚════██║   ██║   ██╔══██║ ██╔══██╗     ██╔══██╗██╔══╝  ██╔══██║██║  ██║
███████║   ██║   ██║  ██║ ██║  ██║     ██║  ██║███████╗██║  ██║██████╔╝    
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═╝  ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝
\x1b[0m`);
}

function copyRecursive(src, dest) {
  if (fs.lstatSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

(function init() {
  const packageDir = path.join(__dirname, '..'); 
  const filesToCopy = [
    'astro.config.mjs',
    'starread.config.ts',
    'package.json',
    'tsconfig.json',
    'README.md',
    'LICENSE',
    'public',
    'src/content'
  ];

  async function copyFiles() {
    for (const name of filesToCopy) {
      const srcPath = path.join(packageDir, name);
      const destPath = path.join(process.cwd(), name);

      process.stdout.write(`\x1b[34m📂\x1b[0m `);
      await typewriter(name, 20, false);
      process.stdout.write(`\x1b[32m ✅\x1b[0m\n`);
      copyRecursive(srcPath, destPath);
    }
  }

  function selectOption(question, options, defaultIndex = 0) {
    return new Promise((resolve) => {
      if (!process.stdin.isTTY) {
        resolve(defaultIndex);
        return;
      }

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      readline.emitKeypressEvents(process.stdin, rl);
      process.stdin.setRawMode(true);
      
      let selectedIndex = defaultIndex;
      let isFirstDisplay = true;
      
      function displayOptions() {
        if (isFirstDisplay) {
          console.log();
          isFirstDisplay = false;
        } else {
          const totalLines = options.length + 2;
          for (let i = 0; i < totalLines; i++) {
            readline.cursorTo(process.stdout, 0);
            readline.moveCursor(process.stdout, 0, -1);
            readline.clearLine(process.stdout, 0);
          }
        }
        
        console.log(`\x1b[1m${question}\x1b[0m`);
        
        options.forEach((option, index) => {
          const isSelected = index === selectedIndex;
          const prefix = isSelected ? '\x1b[36m▶\x1b[0m' : '  ';
          const optionText = isSelected ? `\x1b[1;36m${option}\x1b[0m` : option;
          console.log(`${prefix} ${optionText}`);
        });
        
        console.log('\x1b[33m按 Enter 确认选择，使用 ↑ ↓ 键切换选项\x1b[0m');
      }
      
      function cleanup() {
        process.stdin.setRawMode(false);
        rl.close();
      }
      
      function onKeypress(chunk, key) {
        if (key && key.name === 'return') {
          const totalLines = options.length + 2;
          for (let i = 0; i < totalLines; i++) {
            readline.cursorTo(process.stdout, 0);
            readline.moveCursor(process.stdout, 0, -1);
            readline.clearLine(process.stdout, 0);
          }
          
          cleanup();
          process.stdin.removeListener('keypress', onKeypress);
          resolve(selectedIndex);
          return;
        }
        
        if (key && key.name === 'up') {
          selectedIndex = Math.max(0, selectedIndex - 1);
          displayOptions();
          return;
        }
        
        if (key && key.name === 'down') {
          selectedIndex = Math.min(options.length - 1, selectedIndex + 1);
          displayOptions();
          return;
        }
        
        if (key && key.ctrl && key.name === 'c') {
          cleanup();
          process.exit(0);
        }
      }
      
      process.stdin.on('keypress', onKeypress);
      
      displayOptions();
    });
  }

  (async function main() {
    await printBanner();
    
    await typewriter("\x1b[35m✨ 欢迎使用 StarRead 主题安装向导\x1b[0m\n", 50);
    await delay(300);
    
    await typewriter("\n\x1b[34m🚀 正在创建项目...\x1b[0m\n", 40);
    await delay(200);
    
    await copyFiles();
    
    await delay(300);
    await typewriter("\x1b[32m✅ 所有文件已复制到你的项目目录！\x1b[0m\n", 40);
    await delay(300);

    const installChoice = await selectOption('👉 是否要立即安装依赖？', ['是 (默认)', '否']);
    const installNow = installChoice === 0;
    
    if (!installNow) {
      await typewriter('\n\x1b[33mℹ️  你选择了不安装依赖。\x1b[0m\n', 40);
      await delay(200);
      await typewriter('   稍后可以手动运行以下命令安装依赖：\n', 30);
      await typewriter('   npm install 或者 pnpm install / yarn install / cnpm install\n\n', 30);
      process.exit(0);
    }
    
    const pmOptions = ['npm (默认)', 'pnpm', 'yarn', 'cnpm'];
    const pmChoice = await selectOption('👉 请选择包管理器：', pmOptions);
    
    const pmMap = ['npm', 'pnpm', 'yarn', 'cnpm'];
    const pm = pmMap[pmChoice];
    
    await typewriter(`\n\x1b[34m📦 使用 ${pm} 安装依赖中...\x1b[0m\n`, 40);
    await delay(500);
    
    try {
      execSync(`${pm} install`, { stdio: 'inherit' });
      
      await delay(500);
      await typewriter('\n\x1b[32m🎉 初始化完成！\x1b[0m\n', 50);
      await delay(200);
      await typewriter('\x1b[35m下一步：\x1b[0m\n', 40);
      await typewriter('   cd <your-project>\n', 30);
      await typewriter(`   ${pm} run dev 🚀\n\n`, 30);
    } catch (err) {
      await typewriter('\n\x1b[31m❌ 依赖安装失败，请手动运行 install\x1b[0m\n', 40);
    }
  })();

})();
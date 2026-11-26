import fs from 'node:fs';
import path from 'node:path';

const preset = process.argv[2];
const valid = {
  invest: 'investor.yaml',
  investor: 'investor.yaml',
  dev: 'developer.yaml',
  developer: 'developer.yaml',
  garden: 'digital-garden.yaml',
};

if (!preset || !valid[preset]) {
  console.log(`
使用方式: pnpm preset <preset_name>

可选预设:
  - invest  (或 investor): 投资与深度思考复盘版
  - dev     (或 developer): 极客开发与开源系统架构版
  - garden  : 通识思考与个人数字花园版

示例:
  pnpm preset invest
`);
  process.exit(1);
}

const sourceFile = path.resolve(process.cwd(), 'presets', valid[preset]);
const targetFile = path.resolve(process.cwd(), 'config.yaml');

if (!fs.existsSync(sourceFile)) {
  console.error(`❌ 未找到预设文件: ${sourceFile}`);
  process.exit(1);
}

// 备份现有 config.yaml
if (fs.existsSync(targetFile)) {
  fs.copyFileSync(targetFile, path.resolve(process.cwd(), 'config.yaml.bak'));
  console.log(`📦 已备份现有 config.yaml 到 config.yaml.bak`);
}

fs.copyFileSync(sourceFile, targetFile);
console.log(`✅ 成功切换至 [${preset}] 预设！已更新根目录下的 config.yaml。`);

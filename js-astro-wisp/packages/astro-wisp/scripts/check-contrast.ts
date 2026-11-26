/** 主题维护者用：默认调色板的对比度门禁。站点覆盖调色板时由集成在构建期检查。 */
import { checkContrast, MIN_CONTRAST } from '../src/tokens/contrast';

const rows = checkContrast();
const bad = rows.filter((r) => !r.pass);
console.log(`对比度检查：${rows.length} 项，阈值 ${MIN_CONTRAST}:1`);
if (bad.length) {
  console.error('未达标：');
  for (const r of bad) console.error(`  [${r.mode}] ${r.pair}: ${r.ratio.toFixed(2)}`);
  process.exit(1);
}
console.log(`全部通过（最低 ${Math.min(...rows.map((r) => r.ratio)).toFixed(2)}:1）`);

#!/usr/bin/env node
/**
 * wisp —— 主题随包分发的命令行。包以 TypeScript 源码发布，这里用 tsx 的 ESM 钩子加载。
 *
 *   wisp diagram <build|check|lint|export|new|probe|cache> [...]   图表工具（转调包内 Python skill，需要 uv）
 *   wisp skills                                                    打印随包分发的 Agent skill 路径
 */
import { register } from 'tsx/esm/api';
import { fileURLToPath } from 'node:url';

register();
const [cmd, ...rest] = process.argv.slice(2);
const skills = fileURLToPath(new URL('../skills/', import.meta.url));

if (cmd === 'diagram') {
  const { main } = await import('../scripts/diagram/cli.ts');
  process.exit(main(rest));
} else if (cmd === 'skills') {
  process.stdout.write(
    `wisp-writer   ${skills}wisp-writer/SKILL.md\nwisp-diagram  ${skills}wisp-diagram/SKILL.md\n`,
  );
} else {
  process.stdout.write(
    '用法：wisp diagram <build|check|lint|export|new|probe|cache> [...]\n      wisp skills\n',
  );
  process.exit(cmd === undefined || cmd === '-h' || cmd === '--help' ? 0 : 2);
}

/**
 * `wisp diagram <command>` —— 站点侧的薄包装：把命令转给包内 skill 的 Python CLI
 * （`uv run <astro-wisp>/skills/wisp-diagram/scripts/wisp_diagram.py …`），并补上站点的项目参数
 * （`--root <站点根，默认当前目录> --manifest <站点根>/diagrams.manifest.json`）。需要 uv（https://docs.astral.sh/uv/）。
 *
 *   build [路径...] [--force] [--embed-fonts] [--fix] [--drawio cli|docker|browser]
 *         增量构建 src/content/**\/diagrams/*.{excalidraw,drawio} → .wisp.svg，并更新 manifest。
 *         给出路径时只处理这些文件/目录；扫描范围外的文件照常构建，但不写入 manifest。
 *   check                 只校验 manifest 哈希（CI 用，不需要浏览器 / draw.io）。失败退出码 1。
 *   lint [文件...] [--fix] [--strict]   默认检查扫描范围内全部源文件。
 *   export <文件> [--png] [--theme light|dark] [--scale 2] [-o out.png] [--transparent]
 *   new <skeleton.json> [-o out.excalidraw] [--build]   骨架 → .excalidraw（可选立即构建）
 *   probe                 打印 Chromium / Excalidraw / draw.io 导出方式探测结果
 *   cache [status|warm|clear]   skill 的下载缓存（~/.cache/wisp-diagram）
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { delimiter, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { MANIFEST_FILE } from '../../src/lib/render-diagram.ts';

/** 包根（skill 随包分发） */
export const PACKAGE_ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
export const SKILL_CLI = join(PACKAGE_ROOT, 'skills', 'wisp-diagram', 'scripts', 'wisp_diagram.py');

const USAGE = `用法：wisp diagram <build|check|lint|export|new|probe|cache> [...]
  build [路径...] [--force] [--embed-fonts] [--fix] [--drawio cli|docker|browser]
  check
  lint [文件...] [--fix] [--strict]
  export <文件> [--png] [--theme light|dark] [--scale 2] [-o out.png]
  new <skeleton.json> [-o out.excalidraw] [--build]
  probe
  cache [status|warm|clear]
（转调包内 skills/wisp-diagram/scripts/wisp_diagram.py；需要 uv）
`;

const COMMANDS = new Set(['build', 'check', 'lint', 'export', 'new', 'probe', 'cache']);

interface Flags {
  positional: string[];
  flags: Map<string, string | true>;
}
const VALUE_FLAGS = new Set([
  '--drawio',
  '--theme',
  '--scale',
  '-o',
  '--out',
  '--seed',
  '--title',
  '--desc',
  '--out-dir',
]);

export function parseArgs(argv: string[]): Flags {
  const positional: string[] = [];
  const flags = new Map<string, string | true>();
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a.startsWith('-')) {
      if (VALUE_FLAGS.has(a)) flags.set(a, argv[++i] ?? '');
      else flags.set(a, true);
    } else positional.push(a);
  }
  return { positional, flags };
}

/** `wisp diagram …` 的参数 → wisp_diagram.py 的参数（补上项目根与 manifest）。 */
export function toPythonArgs(argv: string[], root = process.cwd()): string[] {
  const [cmd, ...rest] = argv;
  const project = ['--root', root, '--manifest', join(root, MANIFEST_FILE)];
  switch (cmd) {
    case 'build':
      return ['build', ...rest, ...project];
    case 'check':
      return ['check', ...project];
    case 'lint':
      return ['lint', ...rest, '--root', root];
    case 'new':
      return ['new', ...rest, ...project];
    default:
      return [cmd!, ...rest];
  }
}

/** 找 uv：$WISP_UV → PATH → ~/.local/bin/uv、~/.cargo/bin/uv。 */
export function findUv(): string | null {
  if (process.env.WISP_UV) return existsSync(process.env.WISP_UV) ? process.env.WISP_UV : null;
  const exe = process.platform === 'win32' ? 'uv.exe' : 'uv';
  for (const dir of (process.env.PATH ?? '').split(delimiter)) {
    if (dir && existsSync(join(dir, exe))) return join(dir, exe);
  }
  for (const p of [join(homedir(), '.local', 'bin', exe), join(homedir(), '.cargo', 'bin', exe)])
    if (existsSync(p)) return p;
  return null;
}

export function main(argv: string[]): number {
  const [cmd, ...rest] = argv;
  if (cmd === undefined || cmd === '-h' || cmd === '--help' || cmd === 'help') {
    process.stdout.write(USAGE);
    return cmd ? 0 : 2;
  }
  if (!COMMANDS.has(cmd)) {
    process.stderr.write(`未知命令：${cmd}\n${USAGE}`);
    return 2;
  }
  if (cmd === 'export') {
    const theme = parseArgs(rest).flags.get('--theme');
    if (theme !== undefined && theme !== 'light' && theme !== 'dark') {
      process.stderr.write('--theme 只能是 light 或 dark\n');
      return 2;
    }
  }
  const uv = findUv();
  if (!uv) {
    process.stderr.write(
      'wisp diagram 需要 uv：curl -LsSf https://astral.sh/uv/install.sh | sh（或设置 WISP_UV=<uv 路径>）\n',
    );
    return 1;
  }
  const r = spawnSync(uv, ['run', '--quiet', SKILL_CLI, ...toPythonArgs(argv)], {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
  if (r.error) throw r.error;
  return r.status ?? 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exit(main(process.argv.slice(2)));
}

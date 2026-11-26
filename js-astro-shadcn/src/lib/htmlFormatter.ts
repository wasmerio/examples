/**
 * @file htmlFormatter.ts
 * @description HTMLファイルを整形するための関数と、Astroビルド後に自動で整形するプラグインを提供します。
 *              Astroビルドプロセスでの使用を想定しています。
 */

// 基本モジュールのインポート
import path from 'node:path';
import fs from 'node:fs';
import chalk from 'chalk';
import prettier from 'prettier';
import type { AstroIntegration } from 'astro';

/**
 * HTMLフォーマッターの設定オプションの型定義
 * Prettierのオプション型を拡張しています
 */
export interface FormatterOptions {
  [key: string]: string | number | boolean | undefined;
  parser: string;
  tabWidth: number;
  useTabs: boolean;
  printWidth: number;
  htmlWhitespaceSensitivity: 'css' | 'strict' | 'ignore';
  endOfLine?: 'lf' | 'crlf' | 'cr' | 'auto';
  bracketSameLine?: boolean;
  singleAttributePerLine?: boolean;
  embeddedLanguageFormatting?: 'auto' | 'off';
}

/**
 * デフォルトの整形設定オプション
 * prettierの設定に準拠し、HTML整形に最適化されています
 */
export const defaultConfig: FormatterOptions = {
  parser: 'html', // HTMLパーサーを使用
  tabWidth: 2, // インデントのサイズ（スペース数）
  useTabs: true, // タブを使用する
  printWidth: 120, // 1行の最大文字数
  htmlWhitespaceSensitivity: 'css', // CSS依存の空白の扱い
  endOfLine: 'lf', // 改行コード（Unix/Linux形式）
  bracketSameLine: false, // 閉じタグを別の行に配置
  singleAttributePerLine: false, // 複数の属性を同じ行に許可
  embeddedLanguageFormatting: 'auto', // 埋め込み言語（CSS/JSなど）の自動整形
};

/**
 * 指定されたディレクトリ内の全てのファイルパスを再帰的に取得します
 *
 * @param {string} dirPath -             検索するディレクトリのパス
 * @param {string[]} [arrayOfFiles=[]] - 収集されたファイルパスの配列（再帰呼び出し用）
 * @returns {string[]}                   取得されたファイルパスの配列
 */
export const getAllFiles = function (dirPath: string, arrayOfFiles: string[] = []): string[] {
  // ディレクトリ内のファイル・フォルダを取得
  const files = fs.readdirSync(dirPath);

  // 各ファイル・フォルダを処理
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);

    // フォルダの場合は再帰的に処理
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    }
    // ファイルの場合は配列に追加
    else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
};

/**
 * 指定されたHTMLファイルを整形し、上書き保存します
 *
 * @param {string} filePath - 整形するHTMLファイルのパス
 * @param {FormatterOptions} options -  整形に使用するオプション
 * @returns {Promise<void>} 処理完了後に解決されるPromise
 */
export const htmlFormatter = async (filePath: string, options: FormatterOptions): Promise<void> => {
  try {
    // ファイルの内容を読み込む
    const data = fs.readFileSync(filePath, { encoding: 'utf8' });

    // オプションにパーサーが含まれていることを確認
    const formattingOptions = {
      ...options,
      parser: options.parser || 'html', // パーサーが指定されていることを確認
    };

    // prettierでフォーマット
    const result = await prettier.format(data, formattingOptions);

    // 整形された内容を書き込む
    fs.writeFileSync(filePath, result);
    console.log(chalk.green(`Formatted: ${path.basename(filePath)}`));
  } catch (err) {
    // エラーハンドリング
    console.error(chalk.red(`Error formatting ${filePath}: ${(err as Error).message}`));
  }
};

/**
 * Astroのビルド完了後のフックの引数型定義
 */
interface AstroBuildDoneParams {
  dir: URL;
  pages: { pathname: string }[];
}

/**
 * Astroビルド後に自動でHTMLファイルを整形するプラグイン
 *
 * @param {Partial<FormatterOptions>} [options={}] - 整形オプション（デフォルト設定をベースに拡張可能）
 * @returns {AstroIntegration}                      Astroプラグインオブジェクト
 */
export default function htmlBeautifier(options: Partial<FormatterOptions> = {}): AstroIntegration {
  // デフォルトとユーザーオプションを確実にマージ
  const formattingOptions = { ...defaultConfig, ...options };

  return {
    name: 'htmlFormatter',
    hooks: {
      'astro:build:done': async ({ dir }: AstroBuildDoneParams) => {
        try {
          console.log(chalk.blue.bold('\nFormatting HTML files...'));

          // ビルド出力ディレクトリ内のすべてのファイルを取得
          const allFiles = getAllFiles(dir.pathname);

          // HTMLファイルのみをフィルタリング
          const htmlFiles = allFiles.filter(filePath => path.extname(filePath) === '.html');

          // 並列処理で整形（パフォーマンス向上）
          const promises = htmlFiles.map(filePath => htmlFormatter(filePath, formattingOptions));

          // すべての整形処理の完了を待機
          await Promise.all(promises);

          console.log(chalk.green.bold('\nHTML formatting completed successfully ✓'));
        } catch (error) {
          // エラーハンドリング
          console.error(chalk.red.bold('\nHTML Formatting Error:'));
          console.error(chalk.red(`${(error as Error).message}`));
        }
      },
    },
  };
}

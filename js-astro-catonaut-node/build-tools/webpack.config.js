import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { removeInlineScriptAndStyle } from './extract-inline.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Webpack configuration
 * @type {Object}
 * @see https://webpack.js.org/configuration/
 */
const config = {
  // We start by extracting the inline scripts and styles from the generated HTML files.
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.beforeRun.tapAsync(
          'ExtractInlinePlugin',
          (_, callback) => {
            removeInlineScriptAndStyle('../dist').then(() => callback());
          }
        );
      },
    },
  ],
  entry: {
    content: '../src/scripts/content.ts',
    background: '../src/scripts/background.ts',
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, '../dist'),
    clean: false,
  },
};

export default config;

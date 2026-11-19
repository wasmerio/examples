import { AsyncDuckDB, VoidLogger } from '@duckdb/duckdb-wasm';
import workerUrl from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import databaseWasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import { embed } from '@duckdb/duckdb-wasm-shell';
import shellWasm from '@duckdb/duckdb-wasm-shell/dist/shell_bg.wasm?url';
import 'xterm/css/xterm.css';

const status = document.querySelector('#status');
const shell = document.querySelector('#shell');

async function resolveDatabase(onProgress) {
  const db = new AsyncDuckDB(new VoidLogger(), new Worker(workerUrl));
  try {
    await db.instantiate(databaseWasm, undefined, onProgress);
    const response = await fetch('/campaigns.csv');
    if (!response.ok) throw new Error('Sample dataset could not be loaded.');
    await db.registerFileText('campaigns.csv', await response.text());
    const connection = await db.connect();
    try {
      await connection.query("CREATE TABLE campaigns AS SELECT * FROM read_csv_auto('campaigns.csv')");
    } finally {
      await connection.close();
    }
    return db;
  } catch (error) {
    await db.terminate();
    throw error;
  }
}

try {
  await embed({
    shellModule: shellWasm,
    container: shell,
    resolveDatabase,
  });
  status.textContent = '';
} catch (error) {
  shell.hidden = true;
  status.textContent = 'DuckDB could not start. Reload the page to try again.';
  console.error(error);
}

import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core';
import enUS from '@univerjs/preset-sheets-core/locales/en-US';
import { createUniver, LocaleType, mergeLocales } from '@univerjs/presets';
import '@univerjs/preset-sheets-core/lib/index.css';

const storageKey = 'wasmer-univer-sheets:workbook:v1';
const status = document.querySelector('#storage-status');
const sample = {
  id: 'campaign-budget',
  name: 'Campaign budget',
  sheetOrder: ['budget'],
  sheets: {
    budget: {
      id: 'budget',
      name: 'Budget',
      rowCount: 100,
      columnCount: 26,
      cellData: {
        0: { 0: { v: 'Channel' }, 1: { v: 'Budget' }, 2: { v: 'Actual' } },
        1: { 0: { v: 'Video' }, 1: { v: 320 }, 2: { v: 275 } },
        2: { 0: { v: 'Photography' }, 1: { v: 180 }, 2: { v: 200 } },
        3: { 0: { v: 'Total' }, 1: { f: '=SUM(B2:B3)' }, 2: { f: '=SUM(C2:C3)' } },
      },
    },
  },
};

let snapshot = sample;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved?.sheetOrder?.length && saved.sheets) snapshot = saved;
} catch {
  status.textContent = 'Could not restore the saved workbook. Showing the sample instead.';
}

const { univerAPI } = createUniver({
  locale: LocaleType.EN_US,
  locales: { [LocaleType.EN_US]: mergeLocales(enUS) },
  presets: [UniverSheetsCorePreset({ container: 'workbook' })],
});
const workbook = univerAPI.createWorkbook(snapshot);

let saveTimer;
function save() {
  clearTimeout(saveTimer);
  try {
    localStorage.setItem(storageKey, JSON.stringify(workbook.save()));
    status.textContent = '';
  } catch {
    status.textContent = 'This browser could not save your edits.';
  }
}

univerAPI.addEvent(univerAPI.Event.CommandExecuted, ({ type }) => {
  if (type !== univerAPI.Enum.CommandType.MUTATION) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(save, 250);
});
window.addEventListener('pagehide', save);

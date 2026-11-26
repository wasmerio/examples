export const languages = { en: 'English', ja: '日本語', 'zh-TW': '繁體中文' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';

const en = {
  'nav.features': 'Features', 'nav.pricing': 'Pricing', 'nav.docs': 'Docs', 'nav.changelog': 'Changelog', 'nav.install': 'Add to Chrome',
  'hero.label': 'Browser extension · v', 'hero.title': 'Fifty tabs.\nOne calm window.',
  'hero.lead': 'Tabwise groups, searches and parks your tabs without sending a single URL off your machine.',
  'hero.meta': 'users · rating · works offline',
  'hero.demo': 'demo figures', 'hero.demoNote': 'Tabwise is a fictional demo product; user count and rating are sample figures.',
  'store.chrome': 'Add to Chrome', 'store.edge': 'Get it for Edge', 'store.firefox': 'Firefox add-on', 'store.free': 'Free · no account',
  'how.label': 'How it works', 'how.1.t': 'Install', 'how.1.d': 'One click from the store. No sign-up wall.',
  'how.2.t': 'Pin', 'how.2.d': 'Pin the icon. Press ⌘K anywhere to search every open tab.',
  'how.3.t': 'Park', 'how.3.d': 'Park a whole window for later; memory freed, order kept.',
  'perm.label': 'Permissions, explained', 'perm.title': 'What we ask for, and why.',
  'perm.lead': 'Store reviewers read this. So should you. Every permission, in plain words.',
  'perm.col.id': 'Permission', 'perm.col.why': 'Why we need it', 'perm.col.never': 'What we never do',
  'perm.tabs.why': 'Read tab titles and URLs to build the local search index.', 'perm.tabs.never': 'Transmit or log your browsing history.',
  'perm.storage.why': 'Save parked windows and settings on this device.', 'perm.storage.never': 'Sync to our servers without opt-in.',
  'perm.menus.why': 'Add “Park this window” to the right-click menu.', 'perm.menus.never': 'Inject scripts into pages.',
  'cta.title': 'Your tabs are waiting.', 'cta.lead': 'Free forever for personal use. Pro when you need sync.',
  'pricing.label': 'Pricing', 'pricing.title': 'Pay once, or not at all.', 'pricing.lead': 'No trials that expire mid-thought. The free plan is the real product.',
  'pricing.free': 'Free', 'pricing.pro': 'Pro', 'pricing.team': 'Team', 'pricing.once': 'one-time', 'pricing.seat': 'per seat / year',
  'pricing.cta.free': 'Install free', 'pricing.cta.pro': 'Buy Pro', 'pricing.cta.team': 'Contact us', 'pricing.popular': 'Most chosen',
  'pricing.f1': 'Unlimited tab search', 'pricing.f2': 'Park windows', 'pricing.f3': 'Encrypted cross-device sync', 'pricing.f4': 'Custom shortcuts',
  'pricing.f5': 'Shared workspaces', 'pricing.f6': 'Admin policy (MDM)', 'pricing.faq': 'Questions',
  'pricing.q1': 'Is the free plan limited?', 'pricing.a1': 'No time limit and no tab cap. Pro adds sync and shortcuts.',
  'pricing.q2': 'Can I get a refund?', 'pricing.a2': 'Yes, within 30 days, no questions asked.',
  'docs.label': 'Documentation', 'docs.toc': 'On this page', 'docs.edit': 'Edit this page',
  'footer.privacy': 'Privacy', 'footer.made': 'Built with Astro Extension Kit', 'theme.toggle': 'Toggle dark mode', 'skip': 'Skip to content',
};
type Dict = typeof en;
const ja: Dict = {
  ...en,
  'nav.features': '機能', 'nav.pricing': '料金', 'nav.docs': 'ドキュメント', 'nav.changelog': '更新履歴', 'nav.install': 'Chrome に追加',
  'hero.label': 'ブラウザ拡張機能 · v', 'hero.title': 'タブが50個でも、\n静かなウィンドウ。',
  'hero.lead': 'Tabwise はタブをまとめ、検索し、退避します。URL は一つも端末の外に出ません。', 'hero.meta': 'ユーザー · 評価 · オフライン動作',
  'hero.demo': 'デモ用の数字', 'hero.demoNote': 'Tabwise は架空のデモ製品です。ユーザー数と評価はサンプルの数字です。',
  'store.chrome': 'Chrome に追加', 'store.edge': 'Edge で入手', 'store.firefox': 'Firefox アドオン', 'store.free': '無料 · アカウント不要',
  'how.label': '使い方', 'how.1.t': 'インストール', 'how.1.d': 'ストアからワンクリック。登録不要。', 'how.2.t': 'ピン留め', 'how.2.d': 'アイコンを固定し、⌘K で全タブを検索。',
  'how.3.t': '退避', 'how.3.d': 'ウィンドウごと退避。メモリを解放し、順序は保持。',
  'perm.label': '権限の説明', 'perm.title': '必要な権限と、その理由。', 'perm.lead': 'ストア審査担当者が読むページです。あなたにも読んでほしい。',
  'perm.col.id': '権限', 'perm.col.why': '必要な理由', 'perm.col.never': '決してしないこと',
  'perm.tabs.why': 'ローカル検索用にタブのタイトルと URL を読み取ります。', 'perm.tabs.never': '閲覧履歴の送信や記録。',
  'perm.storage.why': '退避したウィンドウと設定をこの端末に保存します。', 'perm.storage.never': '同意なしでのサーバー同期。',
  'perm.menus.why': '右クリックメニューに「このウィンドウを退避」を追加します。', 'perm.menus.never': 'ページへのスクリプト挿入。',
  'cta.title': 'タブが待っています。', 'cta.lead': '個人利用はずっと無料。同期が必要なら Pro へ。',
  'pricing.label': '料金', 'pricing.title': '買い切り、または無料。', 'pricing.lead': '途中で切れる試用期間はありません。無料プランこそ本物の製品です。',
  'pricing.free': '無料', 'pricing.once': '買い切り', 'pricing.seat': '1席 / 年', 'pricing.cta.free': '無料で導入', 'pricing.cta.pro': 'Pro を購入', 'pricing.cta.team': 'お問い合わせ', 'pricing.popular': '人気',
  'pricing.f1': '無制限のタブ検索', 'pricing.f2': 'ウィンドウ退避', 'pricing.f3': '暗号化された端末間同期', 'pricing.f4': 'ショートカット設定', 'pricing.f5': '共有ワークスペース', 'pricing.f6': '管理ポリシー (MDM)', 'pricing.faq': 'よくある質問',
  'pricing.q1': '無料プランに制限は？', 'pricing.a1': '期間・タブ数の制限はありません。Pro は同期とショートカットを追加します。', 'pricing.q2': '返金できますか？', 'pricing.a2': 'はい、30日以内なら理由を問わず返金します。',
  'docs.label': 'ドキュメント', 'docs.toc': 'このページの内容', 'docs.edit': 'このページを編集',
  'footer.privacy': 'プライバシー', 'footer.made': 'Astro Extension Kit で構築', 'theme.toggle': 'ダークモード切替', 'skip': '本文へスキップ',
};
const zhTW: Dict = {
  ...en,
  'nav.features': '功能', 'nav.pricing': '價格', 'nav.docs': '文件', 'nav.changelog': '更新日誌', 'nav.install': '加到 Chrome',
  'hero.label': '瀏覽器擴充功能 · v', 'hero.title': '五十個分頁，\n一個安靜的視窗。',
  'hero.lead': 'Tabwise 幫你分組、搜尋、暫存分頁，任何網址都不會離開你的電腦。', 'hero.meta': '位使用者 · 評分 · 離線可用',
  'hero.demo': '示範數字', 'hero.demoNote': 'Tabwise 是虛構的示範產品，使用人數與評分都是示範數字。',
  'store.chrome': '加到 Chrome', 'store.edge': '在 Edge 取得', 'store.firefox': 'Firefox 附加元件', 'store.free': '免費 · 不需帳號',
  'how.label': '使用方式', 'how.1.t': '安裝', 'how.1.d': '從商店一鍵安裝，不用註冊。', 'how.2.t': '釘選', 'how.2.d': '釘選圖示，在任何頁面按 ⌘K 搜尋所有分頁。',
  'how.3.t': '暫存', 'how.3.d': '整個視窗暫存起來，釋放記憶體、保留順序。',
  'perm.label': '權限說明', 'perm.title': '我們要求哪些權限，以及原因。', 'perm.lead': '商店審核人員會讀這一頁，你也應該讀。每項權限都用白話說明。',
  'perm.col.id': '權限', 'perm.col.why': '為什麼需要', 'perm.col.never': '我們絕不做的事',
  'perm.tabs.why': '讀取分頁標題與網址，建立本機搜尋索引。', 'perm.tabs.never': '傳送或記錄你的瀏覽紀錄。',
  'perm.storage.why': '把暫存視窗與設定存在這台裝置。', 'perm.storage.never': '未經同意就同步到我們的伺服器。',
  'perm.menus.why': '在右鍵選單加入「暫存這個視窗」。', 'perm.menus.never': '在網頁中注入腳本。',
  'cta.title': '你的分頁在等你。', 'cta.lead': '個人使用永久免費，需要同步時再升級 Pro。',
  'pricing.label': '價格', 'pricing.title': '買斷一次，或完全免費。', 'pricing.lead': '沒有用到一半就到期的試用。免費版就是完整產品。',
  'pricing.free': '免費', 'pricing.once': '一次買斷', 'pricing.seat': '每席 / 年', 'pricing.cta.free': '免費安裝', 'pricing.cta.pro': '購買 Pro', 'pricing.cta.team': '聯絡我們', 'pricing.popular': '最多人選',
  'pricing.f1': '無限分頁搜尋', 'pricing.f2': '暫存視窗', 'pricing.f3': '加密跨裝置同步', 'pricing.f4': '自訂快捷鍵', 'pricing.f5': '共享工作區', 'pricing.f6': '管理政策 (MDM)', 'pricing.faq': '常見問題',
  'pricing.q1': '免費版有限制嗎？', 'pricing.a1': '沒有時間或分頁數限制。Pro 增加同步與快捷鍵。', 'pricing.q2': '可以退款嗎？', 'pricing.a2': '可以，30 天內無條件退款。',
  'docs.label': '文件', 'docs.toc': '本頁內容', 'docs.edit': '編輯此頁',
  'footer.privacy': '隱私權', 'footer.made': '以 Astro Extension Kit 製作', 'theme.toggle': '切換深色模式', 'skip': '跳到主要內容',
};
export const ui: Partial<Record<Lang, Dict>> & { en: Dict } = { en, ja, 'zh-TW': zhTW };
export type UIKey = keyof Dict;
export function useT(lang: Lang) { return (k: UIKey) => (ui[lang] ?? ui.en)[k] ?? en[k]; }
export function localePath(lang: Lang, path = '/') {
  const p = path.startsWith('/') ? path : `/${path}`;
  return lang === defaultLang ? p : `/${lang}${p === '/' ? '/' : p}`;
}
export const langPaths = () => (Object.keys(languages) as Lang[]).map((l) => ({ params: { lang: l === defaultLang ? undefined : l }, props: { lang: l } }));

const extra = {
  en: { 'cl.title': 'Every release, in order.', 'cl.lead': 'What changed, when, and why. No marketing fluff.', 'cl.feature': 'Feature', 'cl.fix': 'Fix', 'cl.store': 'Store',
    'ob.label': 'Installed', 'ob.title': 'You’re in. Three things, then you’re done.', 'ob.lead': 'This page opens once after install. Nothing has been sent anywhere.',
    'ob.1': 'Pin Tabwise', 'ob.1d': 'Click the puzzle icon in the toolbar, then the pin next to Tabwise.', 'ob.2': 'Try the shortcut', 'ob.2d': 'Press ⌘K (or Ctrl+K) now. Type any word from a tab title.', 'ob.3': 'Park a window', 'ob.3d': 'Right-click any page → “Park this window”.', 'ob.done': 'Read the docs', 'ob.privacy': 'Read what we store',
    'pv.label': 'Privacy policy', 'pv.updated': 'Last updated', 'pv.title': 'Privacy policy', 'pv.lead': 'Written for humans and for store reviewers. Short because we collect almost nothing.',
    'pv.h1': 'Data we collect', 'pv.p1': 'None by default. Tab titles and URLs are indexed locally in chrome.storage and never transmitted.', 'pv.h2': 'Optional sync (Pro)', 'pv.p2': 'If you enable sync, parked windows are encrypted on your device with a key we never see, then stored on our servers.', 'pv.h3': 'Third parties', 'pv.p3': 'No analytics, no ads, no data sales. Payments are processed by our merchant of record.', 'pv.h4': 'Limited Use', 'pv.p4': 'Use of information received from Google APIs adheres to the Chrome Web Store User Data Policy, including the Limited Use requirements.', 'pv.h5': 'Contact', 'pv.p5': 'privacy@example.com — we reply within 7 days.' },
  ja: { 'cl.title': 'すべてのリリースを、順番に。', 'cl.lead': '何が、いつ、なぜ変わったか。', 'cl.feature': '機能', 'cl.fix': '修正', 'cl.store': 'ストア',
    'ob.label': 'インストール完了', 'ob.title': 'ようこそ。あと3つで完了です。', 'ob.lead': 'このページはインストール後に一度だけ開きます。何も送信されていません。',
    'ob.1': 'Tabwise を固定', 'ob.1d': 'ツールバーのパズルアイコンから Tabwise の横のピンをクリック。', 'ob.2': 'ショートカットを試す', 'ob.2d': '今 ⌘K（または Ctrl+K）を押して、タブ名の単語を入力。', 'ob.3': 'ウィンドウを退避', 'ob.3d': 'ページを右クリック →「このウィンドウを退避」。', 'ob.done': 'ドキュメントを読む', 'ob.privacy': '保存データを確認',
    'pv.label': 'プライバシーポリシー', 'pv.updated': '最終更新', 'pv.title': 'プライバシーポリシー', 'pv.lead': '人とストア審査担当者のために書きました。収集するものがほぼないので短いです。',
    'pv.h1': '収集するデータ', 'pv.p1': '既定では何も収集しません。タブのタイトルと URL は chrome.storage にローカル保存され、送信されません。', 'pv.h2': '任意の同期（Pro）', 'pv.p2': '同期を有効にすると、退避ウィンドウは当社が知らない鍵で端末上で暗号化されてから保存されます。', 'pv.h3': '第三者', 'pv.p3': '解析・広告・データ販売は一切ありません。決済は販売代理事業者が処理します。', 'pv.h4': '限定的使用', 'pv.p4': 'Google API から受け取った情報の利用は、限定的使用の要件を含む Chrome ウェブストアのユーザーデータ ポリシーに準拠します。', 'pv.h5': 'お問い合わせ', 'pv.p5': 'privacy@example.com — 7日以内に返信します。' },
  'zh-TW': { 'cl.title': '每一次發布，依序列出。', 'cl.lead': '改了什麼、什麼時候改、為什麼改。', 'cl.feature': '新功能', 'cl.fix': '修正', 'cl.store': '商店',
    'ob.label': '安裝完成', 'ob.title': '裝好了。再三個步驟就完成。', 'ob.lead': '這一頁只在安裝後開一次。目前沒有任何資料被送出。',
    'ob.1': '釘選 Tabwise', 'ob.1d': '點工具列的拼圖圖示，再點 Tabwise 旁的圖釘。', 'ob.2': '試試快捷鍵', 'ob.2d': '現在按 ⌘K（或 Ctrl+K），輸入任何分頁標題裡的字。', 'ob.3': '暫存一個視窗', 'ob.3d': '在任何頁面按右鍵 →「暫存這個視窗」。', 'ob.done': '閱讀文件', 'ob.privacy': '看看我們存了什麼',
    'pv.label': '隱私權政策', 'pv.updated': '最後更新', 'pv.title': '隱私權政策', 'pv.lead': '寫給一般人，也寫給商店審核人員。很短，因為我們幾乎什麼都不收集。',
    'pv.h1': '我們收集的資料', 'pv.p1': '預設不收集任何資料。分頁標題與網址只在本機 chrome.storage 建立索引，從不傳送。', 'pv.h2': '選用同步（Pro）', 'pv.p2': '開啟同步後，暫存視窗會先在你的裝置上用我們看不到的金鑰加密，再存到我們的伺服器。', 'pv.h3': '第三方', 'pv.p3': '沒有分析工具、沒有廣告、不販售資料。付款由我們的代理銷售商處理。', 'pv.h4': '有限使用', 'pv.p4': '從 Google API 取得的資訊之使用，遵守 Chrome 線上應用程式商店使用者資料政策，包括「有限使用」規定。', 'pv.h5': '聯絡', 'pv.p5': 'privacy@example.com — 7 天內回覆。' },
} as const;
export type XKey = keyof (typeof extra)['en'];
export function useX(lang: Lang) { return (k: XKey) => ((extra as Record<string, Record<string, string>>)[lang] ?? extra.en)[k] ?? extra.en[k]; }

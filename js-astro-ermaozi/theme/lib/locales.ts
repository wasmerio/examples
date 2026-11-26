import { siteConfig } from '../../site.config.mjs'

const localeConfigs = siteConfig.locales as Record<string, Record<string, any>>

const en = {
  selectLanguageName: 'English', selectLanguageText: 'Languages', appearanceText: 'Appearance', lightModeSwitchTitle: 'Switch to light theme', darkModeSwitchTitle: 'Switch to dark theme',
  outlineLabel: 'On this page', returnToTopLabel: 'Back to top', editLinkText: 'Edit this page', contributorsText: 'Contributors', prevPageLabel: 'Previous page', nextPageLabel: 'Next page', lastUpdatedText: 'Last Updated',
  changelogText: 'Changelog', changelogOnText: 'On', changelogButtonText: 'View All Changelog',
  copyrightText: 'Copyright', copyrightAuthorText: 'Copyright Ownership:', copyrightCreationOriginalText: 'This article link:', copyrightCreationTranslateText: 'This article is translated from:', copyrightCreationReprintText: 'This article is reprint from:', copyrightLicenseText: 'License under:',
  openNewWindowText: '(Open in new window)', homeText: 'Home', postsText: 'Blog', tagText: 'Tags', archiveText: 'Archives', categoryText: 'Categories', archiveTotalText: '{count} articles',
  encryptButtonText: 'Confirm', encryptPlaceholder: 'Enter password', encryptGlobalText: 'Only password can access this site', encryptPageText: 'Only password can access this page',
  copyPageText: 'Copy page', copiedPageText: 'Copied !', copingPageText: 'Copying..', copyTagline: 'Copy page as Markdown for LLMs', viewMarkdown: 'View as Markdown', viewMarkdownTagline: 'View this page as plain text', askAIText: 'Open in {name}', askAITagline: 'Ask {name} about this page', askAIMessage: 'Read {link} and answer content-related questions.',
  notFound: { code: '404', title: 'Page not found', quote: 'But if you do not change your direction, and if you keep looking, you may end up where you are heading.', linkText: 'Take me home' },
}

const zh = {
  selectLanguageName: '简体中文', selectLanguageText: '选择语言', appearanceText: '外观', lightModeSwitchTitle: '切换为浅色主题', darkModeSwitchTitle: '切换为深色主题',
  outlineLabel: '此页内容', returnToTopLabel: '返回顶部', editLinkText: '编辑此页', contributorsText: '贡献者', prevPageLabel: '上一页', nextPageLabel: '下一页', lastUpdatedText: '最后更新于',
  changelogText: '变更历史', changelogOnText: '于', changelogButtonText: '查看全部变更历史',
  copyrightText: '版权所有', copyrightAuthorText: '版权归属：', copyrightCreationOriginalText: '本文链接：', copyrightCreationTranslateText: '本文翻译自：', copyrightCreationReprintText: '本文转载自：', copyrightLicenseText: '许可证：',
  openNewWindowText: '（在新窗口打开）', homeText: '首页', postsText: '博客', tagText: '标签', archiveText: '归档', categoryText: '分类', archiveTotalText: '{count} 篇',
  encryptButtonText: '确认', encryptPlaceholder: '请输入密码', encryptGlobalText: '本站只允许密码访问', encryptPageText: '本页面只允许密码访问',
  copyPageText: '复制页面', copiedPageText: '复制成功', copingPageText: '复制中..', copyTagline: '将页面以 Markdown 格式复制供 LLMs 使用', viewMarkdown: '以 Markdown 格式查看', viewMarkdownTagline: '以纯文本查看此页面', askAIText: '在 {name} 中打开', askAITagline: '向 {name} 提问有关此页面', askAIMessage: '阅读 {link} 并回答内容相关的问题。',
  notFound: { code: '404', title: '页面未找到', quote: '但是，如果你不改变方向，并且一直寻找，最终可能会到达你要去的地方。', linkText: '返回首页' },
}

const presets = {
  en,
  zh,
  'zh-TW': { ...zh, selectLanguageName: '繁體中文', selectLanguageText: '選擇語言', appearanceText: '外觀', lightModeSwitchTitle: '切換為淺色主題', darkModeSwitchTitle: '切換為深色主題', outlineLabel: '此頁內容', returnToTopLabel: '返回頂部', editLinkText: '編輯此頁', contributorsText: '貢獻者', lastUpdatedText: '最後更新於', changelogText: '變更歷史', changelogOnText: '於', changelogButtonText: '查看全部變更歷史', copyrightText: '版權所有', copyrightAuthorText: '版權歸屬：', copyrightCreationOriginalText: '本文連結：', copyrightCreationTranslateText: '本文翻譯自：', copyrightCreationReprintText: '本文轉載自：', copyrightLicenseText: '授權條款：', homeText: '首頁', postsText: '部落格', tagText: '標籤', archiveText: '歸檔', categoryText: '分類', encryptPlaceholder: '請輸入密碼', copyPageText: '複製頁面', copiedPageText: '複製成功', copingPageText: '複製中..', copyTagline: '將頁面以 Markdown 格式複製供 LLMs 使用', viewMarkdown: '以 Markdown 格式檢視', viewMarkdownTagline: '以純文字檢視此頁面', askAIText: '在 {name} 中開啟', askAITagline: '向 {name} 提問有關此頁面', askAIMessage: '閱讀 {link} 並回答內容相關的問題。', notFound: { code: '404', title: '頁面未找到', quote: '但是，如果你不改變方向，並且一直尋找，最終可能會到達你要去的地方。', linkText: '返回首頁' } },
  de: { ...en, selectLanguageName: 'Deutsch', selectLanguageText: 'Sprache auswählen', appearanceText: 'Erscheinungsbild', lightModeSwitchTitle: 'Zu hellem Thema wechseln', darkModeSwitchTitle: 'Zu dunklem Thema wechseln', outlineLabel: 'Inhalt dieser Seite', returnToTopLabel: 'Zurück nach oben', editLinkText: 'Diese Seite bearbeiten', contributorsText: 'Mitwirkende', prevPageLabel: 'Vorherige Seite', nextPageLabel: 'Nächste Seite', lastUpdatedText: 'Zuletzt aktualisiert am', changelogText: 'Änderungsprotokoll', changelogOnText: 'am', changelogButtonText: 'Alle Änderungen anzeigen', copyrightText: 'Alle Rechte vorbehalten', copyrightAuthorText: 'Urheberrecht liegt bei:', copyrightCreationOriginalText: 'Originalartikel:', copyrightCreationTranslateText: 'Übersetzt aus:', copyrightCreationReprintText: 'Nachdruck von:', copyrightLicenseText: 'Lizenz:', openNewWindowText: '(In neuem Fenster öffnen)', homeText: 'Startseite', tagText: 'Tag', archiveText: 'Archiv', categoryText: 'Kategorie', archiveTotalText: '{count} Beiträge', encryptButtonText: 'Bestätigen', encryptPlaceholder: 'Bitte Passwort eingeben', encryptGlobalText: 'Diese Website ist nur mit Passwort zugänglich', encryptPageText: 'Diese Seite ist nur mit Passwort zugänglich', copyPageText: 'Seite kopieren', copiedPageText: 'Kopieren !', copingPageText: 'Wird kopiert..', copyTagline: 'Seite als Markdown für LLMs kopieren', viewMarkdown: 'Als Markdown anzeigen', viewMarkdownTagline: 'Diese Seite als Nur-Text anzeigen', askAIText: 'In {name} öffnen', askAITagline: '{name} zu dieser Seite befragen', askAIMessage: 'Lese {link} und beantworte Fragen zum Inhalt.', notFound: { code: '404', title: 'Seite nicht gefunden', quote: 'Aber wenn du deine Richtung nicht änderst und weiter suchst, könntest du schließlich dorthin gelangen, wohin du gehen willst.', linkText: 'Zur Startseite' } },
  fr: { ...en, selectLanguageName: 'Français', selectLanguageText: 'Choisir la langue', appearanceText: 'Apparence', lightModeSwitchTitle: 'Passer au thème clair', darkModeSwitchTitle: 'Passer au thème sombre', outlineLabel: 'Contenu de cette page', returnToTopLabel: 'Retour en haut', editLinkText: 'Modifier cette page', contributorsText: 'Contributeurs', prevPageLabel: 'Page précédente', nextPageLabel: 'Page suivante', lastUpdatedText: 'Dernière mise à jour', changelogText: 'Historique des changements', changelogOnText: 'le', changelogButtonText: "Voir tout l'historique des changements", copyrightText: 'Tous droits réservés', copyrightAuthorText: 'Copyright appartenant à :', copyrightCreationOriginalText: "Lien de l'article :", copyrightCreationTranslateText: 'Traduit de :', copyrightCreationReprintText: 'Reproduit de :', copyrightLicenseText: 'Licence :', openNewWindowText: '(Ouvrir dans une nouvelle fenêtre)', homeText: 'Accueil', tagText: 'Étiquette', archiveText: 'Archives', categoryText: 'Catégorie', archiveTotalText: '{count} articles', encryptButtonText: 'Confirmer', encryptPlaceholder: 'Veuillez entrer le mot de passe', encryptGlobalText: "Ce site n'est accessible qu'avec un mot de passe", encryptPageText: "Cette page n'est accessible qu'avec un mot de passe", copyPageText: 'Copier la page', copiedPageText: 'Copie réussie', copingPageText: 'Copie en cours..', copyTagline: 'Copier la page au format Markdown pour une utilisation avec des LLM', viewMarkdown: 'Voir en Markdown', viewMarkdownTagline: 'Voir cette page en texte brut', askAIText: 'Ouvrir dans {name}', askAITagline: 'Interroger {name} sur cette page', askAIMessage: 'Lisez {link} et répondez aux questions concernant son contenu.', notFound: { code: '404', title: 'Page non trouvée', quote: 'Mais si tu ne changes pas de direction et que tu continues à chercher, tu finiras par arriver à destination.', linkText: "Retour à l'accueil" } },
  ru: { ...en, selectLanguageName: 'Русский', selectLanguageText: 'Выберите язык', appearanceText: 'Внешний вид', lightModeSwitchTitle: 'Переключить на светлую тему', darkModeSwitchTitle: 'Переключить на темную тему', outlineLabel: 'Содержание страницы', returnToTopLabel: 'Вернуться наверх', editLinkText: 'Редактировать страницу', contributorsText: 'Авторы', prevPageLabel: 'Предыдущая страница', nextPageLabel: 'Следующая страница', lastUpdatedText: 'Последнее обновление', changelogText: 'История изменений', changelogOnText: 'от', changelogButtonText: 'Посмотреть все изменения', copyrightText: 'Все права защищены', copyrightAuthorText: 'Авторские права принадлежат:', copyrightCreationOriginalText: 'Ссылка на статью:', copyrightCreationTranslateText: 'Перевод статьи:', copyrightCreationReprintText: 'Перепечатано из:', copyrightLicenseText: 'Лицензия:', openNewWindowText: '(Открыть в новой вкладке)', homeText: 'Главная', tagText: 'Теги', archiveText: 'Архив', categoryText: 'Категории', archiveTotalText: '{count} статей', encryptButtonText: 'Подтвердить', encryptPlaceholder: 'Введите пароль', encryptGlobalText: 'Доступ к сайту только по паролю', encryptPageText: 'Доступ к странице только по паролю', copyPageText: 'Копировать страницу', copiedPageText: 'Скопировано успешно', copingPageText: 'Копируется...', copyTagline: 'Скопировать страницу в формате Markdown для использования в LLM', viewMarkdown: 'Просмотреть в Markdown', viewMarkdownTagline: 'Просмотреть эту страницу в виде простого текста', askAIText: 'Открыть в {name}', askAITagline: 'Спросить {name} об этой странице', askAIMessage: 'Прочитайте {link} и ответьте на вопросы, связанные с содержанием.', notFound: { code: '404', title: 'Страница не найдена', quote: 'Но если вы не меняете курс и продолжаете искать, в конечном итоге вы можете добраться до места назначения.', linkText: 'Вернуться на главную' } },
  ja: { ...en, selectLanguageName: '日本語', selectLanguageText: '言語を選択', appearanceText: '外観', lightModeSwitchTitle: 'ライトモードに切り替え', darkModeSwitchTitle: 'ダークモードに切り替え', outlineLabel: 'このページの内容', returnToTopLabel: 'トップに戻る', editLinkText: 'このページを編集', contributorsText: '貢献者', prevPageLabel: '前のページ', nextPageLabel: '次のページ', lastUpdatedText: '最終更新日', changelogText: '変更履歴', changelogOnText: 'に', changelogButtonText: 'すべての変更履歴を見る', copyrightText: '著作権', copyrightAuthorText: '著作権者：', copyrightCreationOriginalText: '本文リンク：', copyrightCreationTranslateText: '本文の翻訳元：', copyrightCreationReprintText: '本文の転載元：', copyrightLicenseText: 'ライセンス：', openNewWindowText: '(新しいウィンドウで開く)', homeText: 'ホーム', postsText: 'ブログ', tagText: 'タグ', archiveText: 'アーカイブ', categoryText: 'カテゴリー', archiveTotalText: '{count} 件', encryptButtonText: '確認', encryptPlaceholder: 'パスワードを入力してください', encryptGlobalText: 'このサイトはパスワードでのみアクセス可能です', encryptPageText: 'このページはパスワードでのみアクセス可能です', copyPageText: 'ページをコピー', copiedPageText: 'コピーしました', copingPageText: 'コピー中..', copyTagline: 'ページをMarkdown形式でコピーしてLLMで使用', viewMarkdown: 'Markdown形式で表示', viewMarkdownTagline: 'このページをプレーンテキストで表示', askAIText: '{name} で開く', askAITagline: 'このページについて {name} に質問する', askAIMessage: '{link} を読み、内容に関する質問に答えてください。', notFound: { code: '404', title: 'ページが見つかりません', quote: 'しかし、方向を変えずに探し続ければ、最終的には行きたい場所にたどり着くかもしれません。', linkText: 'ホームに戻る' } },
  ko: { ...en, selectLanguageName: '한국어', selectLanguageText: '', appearanceText: '모양', lightModeSwitchTitle: '밝은 테마로 전환', darkModeSwitchTitle: '어두운 테마로 전환', outlineLabel: '목차', returnToTopLabel: '위로 이동', editLinkText: '편집하기', contributorsText: '기여자', prevPageLabel: '이전 페이지', nextPageLabel: '다음 페이지', lastUpdatedText: '마지막 업데이트', changelogText: '변경 내역', changelogButtonText: '변경 내역 모두 보기', homeText: '홈', postsText: '블로그', tagText: '태그', archiveText: '아카이브', categoryText: '카테고리', archiveTotalText: '{count}개의 글', encryptButtonText: '확인', encryptPlaceholder: '비밀번호를 입력하세요', encryptGlobalText: '이 사이트를 이용하려면 비밀번호가 필요합니다', encryptPageText: '이 페이지를 이용하려면 비밀번호가 필요합니다', openNewWindowText: '(새 창에서 열기)', copyPageText: '페이지 복사', copiedPageText: '복사 완료', copingPageText: '복사 중..', copyTagline: '페이지를 마크다운 형식으로 복사하여 LLM에서 사용', viewMarkdown: 'Markdown 형식으로 보기', viewMarkdownTagline: '이 페이지를 일반 텍스트로 보기', askAIText: '{name} 에서 열기', askAITagline: '이 페이지에 대해 {name} 에 질문하기', askAIMessage: '{link} 을(를) 읽고 내용과 관련된 질문에 답변해 주세요.', notFound: { code: '404', title: '페이지를 찾을 수 없습니다', quote: '방향을 잃지 않고 꾸준히 나아가다 보면 결국엔 목적지에 닿을 수 있습니다.', linkText: '홈으로' } },
} as const

const aliases: Record<string, keyof typeof presets> = {
  en: 'en', 'en-US': 'en', zh: 'zh', 'zh-CN': 'zh', 'zh-Hans': 'zh', 'zh-Hant': 'zh', 'zh-TW': 'zh-TW', de: 'de', 'de-DE': 'de', fr: 'fr', 'fr-FR': 'fr', ru: 'ru', 'ru-RU': 'ru', ja: 'ja', 'ja-JP': 'ja', ko: 'ko', 'ko-KR': 'ko',
}

export interface SearchLocale {
  placeholder: string
  buttonText?: string
  resetButtonTitle: string
  backButtonTitle: string
  noResultsText: string
  footer: { selectText: string, selectKeyAriaLabel: string, navigateText: string, navigateUpKeyAriaLabel: string, navigateDownKeyAriaLabel: string, closeText: string, closeKeyAriaLabel: string }
}

const searchEn: SearchLocale = { placeholder: 'Search', resetButtonTitle: 'Reset search', backButtonTitle: 'Close search', noResultsText: 'No results for', footer: { selectText: 'to select', selectKeyAriaLabel: 'enter', navigateText: 'to navigate', navigateUpKeyAriaLabel: 'up arrow', navigateDownKeyAriaLabel: 'down arrow', closeText: 'to close', closeKeyAriaLabel: 'escape' } }
const searchLocales: Partial<Record<keyof typeof presets, SearchLocale>> = {
  en: searchEn,
  zh: { placeholder: '搜索文档', resetButtonTitle: '重置搜索', backButtonTitle: '关闭', noResultsText: '无搜索结果：', footer: { selectText: '选择', selectKeyAriaLabel: '输入', navigateText: '切换', navigateUpKeyAriaLabel: '向上', navigateDownKeyAriaLabel: '向下', closeText: '关闭', closeKeyAriaLabel: '退出' } },
  'zh-TW': { placeholder: '搜尋文件', resetButtonTitle: '重設搜尋', backButtonTitle: '關閉', noResultsText: '無搜尋結果：', footer: { selectText: '選擇', selectKeyAriaLabel: '輸入', navigateText: '切換', navigateUpKeyAriaLabel: '向上', navigateDownKeyAriaLabel: '向下', closeText: '關閉', closeKeyAriaLabel: '退出' } },
  de: { placeholder: 'Dokumente durchsuchen', resetButtonTitle: 'Suche zurücksetzen', backButtonTitle: 'Schließen', noResultsText: 'Keine Suchergebnisse:', footer: { selectText: 'Auswählen', selectKeyAriaLabel: 'Eingabe', navigateText: 'Wechseln', navigateUpKeyAriaLabel: 'Nach oben', navigateDownKeyAriaLabel: 'Nach unten', closeText: 'Schließen', closeKeyAriaLabel: 'Beenden' } },
  fr: { placeholder: 'Rechercher dans la documentation', resetButtonTitle: 'Réinitialiser la recherche', backButtonTitle: 'Fermer', noResultsText: 'Aucun résultat trouvé :', footer: { selectText: 'sélectionner', selectKeyAriaLabel: 'Entrée', navigateText: 'naviguer', navigateUpKeyAriaLabel: 'haut', navigateDownKeyAriaLabel: 'bas', closeText: 'fermer', closeKeyAriaLabel: 'sortie' } },
  ru: { placeholder: 'Поиск по документации', resetButtonTitle: 'Сбросить поиск', backButtonTitle: 'Закрыть', noResultsText: 'Нет результатов поиска:', footer: { selectText: 'Выбрать', selectKeyAriaLabel: 'Ввод', navigateText: 'Переключить', navigateUpKeyAriaLabel: 'Вверх', navigateDownKeyAriaLabel: 'Вниз', closeText: 'Закрыть', closeKeyAriaLabel: 'Выход' } },
  ja: { placeholder: 'ドキュメントを検索', resetButtonTitle: '検索をリセット', backButtonTitle: '閉じる', noResultsText: '検索結果がありません：', footer: { selectText: '選択', selectKeyAriaLabel: '入力', navigateText: '切り替え', navigateUpKeyAriaLabel: '上へ', navigateDownKeyAriaLabel: '下へ', closeText: '閉じる', closeKeyAriaLabel: '終了' } },
}

const readingTimeLocales: Record<keyof typeof presets, { word: string, less1Minute: string, time: string }> = {
  en: { word: 'About $word words', less1Minute: 'Less than 1 minute', time: 'About $time min' },
  zh: { word: '约 $word 字', less1Minute: '小于 1 分钟', time: '大约 $time 分钟' },
  'zh-TW': { word: '約 $word 字', less1Minute: '小於 1 分鐘', time: '大約 $time 分鐘' },
  de: { word: 'Ungefähr $word Wörter', less1Minute: 'Weniger als eine Minute', time: 'Ungefähr $time min' },
  fr: { word: 'Environ $word mots', less1Minute: 'Moins de 1 minute', time: 'Environ $time min' },
  ru: { word: 'Около $word слов', less1Minute: 'Меньше 1 минуты', time: 'Около $time мин' },
  ja: { word: '$word字程度', less1Minute: '1分以内', time: '約$time分' },
  ko: { word: '약 $word 단어', less1Minute: '1분 미만', time: '약 $time 분' },
}

const licenseKeys = ['CC0', 'CC-BY-4.0', 'CC-BY-NC-4.0', 'CC-BY-NC-SA-4.0', 'CC-BY-NC-ND-4.0', 'CC-BY-ND-4.0', 'CC-BY-SA-4.0'] as const
const licensePresets: Record<keyof typeof presets, readonly string[]> = {
  en: ['CC0 1.0 Universal', 'Attribution 4.0 International', 'Attribution-NonCommercial 4.0 International', 'Attribution-NonCommercial-ShareAlike 4.0 International', 'Attribution-NonCommercial-NoDerivatives 4.0 International', 'Attribution-NoDerivatives 4.0 International', 'Attribution-ShareAlike 4.0 International'],
  zh: ['CC0 1.0 通用', '署名 4.0 国际', '署名-非商业性 4.0 国际', '署名-非商业性-相同方式共享 4.0 国际', '署名-非商业性-禁止演绎 4.0 国际', '署名-禁止演绎 4.0 国际', '署名-相同方式共享 4.0 国际'],
  'zh-TW': ['CC0 1.0 通用', '署名 4.0 國際', '署名-非商業性 4.0 國際', '署名-非商業性-相同方式共享 4.0 國際', '署名-非商業性-禁止演繹 4.0 國際', '署名-禁止演繹 4.0 國際', '署名-相同方式共享 4.0 國際'],
  de: ['CC0 1.0 Universell', 'Namensnennung 4.0 International', 'Namensnennung-Nicht kommerziell 4.0 International', 'Namensnennung-Nicht kommerziell-Weitergabe unter gleichen Bedingungen 4.0 International', 'Namensnennung-Nicht kommerziell-Keine Bearbeitung 4.0 International', 'Namensnennung-Keine Bearbeitung 4.0 International', 'Namensnennung-Weitergabe unter gleichen Bedingungen 4.0 International'],
  fr: ['CC0 1.0 Universel', 'Attribution 4.0 International', "Attribution-Pas d'Utilisation Commerciale 4.0 International", "Attribution-Pas d'Utilisation Commerciale-Partage dans les Mêmes Conditions 4.0 International", "Attribution-Pas d'Utilisation Commerciale-Pas de Modification 4.0 International", 'Attribution-Pas de Modification 4.0 International', 'Attribution-Partage dans les Mêmes Conditions 4.0 International'],
  ru: ['CC0 1.0 Универсальная', 'Атрибуция 4.0 Международный', 'Атрибуция-Некоммерческое 4.0 Международный', 'Атрибуция-Некоммерческое-С сохранением условий 4.0 Международный', 'Атрибуция-Некоммерческое-Без производных 4.0 Международный', 'Атрибуция-Без производных 4.0 Международный', 'Атрибуция-С сохранением условий 4.0 Международный'],
  ja: ['CC0 1.0 パブリックドメイン', '表示 4.0 国際', '表示-非営利 4.0 国際', '表示-非営利-継承 4.0 国際', '表示-非営利-改変禁止 4.0 国際', '表示-改変禁止 4.0 国際', '表示-継承 4.0 国際'],
  ko: ['CC0 1.0 Universal', 'Attribution 4.0 International', 'Attribution-NonCommercial 4.0 International', 'Attribution-NonCommercial-ShareAlike 4.0 International', 'Attribution-NonCommercial-NoDerivatives 4.0 International', 'Attribution-NoDerivatives 4.0 International', 'Attribution-ShareAlike 4.0 International'],
}

export type Lang = string
export const configuredLanguages = () => Object.keys(localeConfigs) as Lang[]
export const localePath = (lang: Lang) => localeConfigs[lang]?.path
  ?? (typeof localeConfigs[lang]?.home === 'string' ? localeConfigs[lang].home : undefined)
  ?? (lang === configuredLanguages()[0] ? '/' : `/${lang.split('-')[0]}/`)
export const localePrefix = (lang: Lang) => localePath(lang).replace(/\/$/u, '')
export const rootLanguage = () => configuredLanguages().find(lang => localePath(lang) === '/') ?? configuredLanguages()[0] ?? 'en-US'
export const languageFromPath = (pathname: string): Lang => configuredLanguages()
  .filter(lang => localePath(lang) !== '/')
  .sort((left, right) => localePath(right).length - localePath(left).length)
  .find(lang => pathname === localePrefix(lang) || pathname.startsWith(localePath(lang))) ?? rootLanguage()
export const routeFromSourcePath = (sourcePath = ''): string => {
  const normalized = sourcePath.replaceAll('\\', '/')
  const contentIndex = normalized.lastIndexOf('/content/')
  const relative = contentIndex >= 0 ? normalized.slice(contentIndex + 9) : normalized.match(/^(?:\.\/)?content\/(.*)$/u)?.[1]
  return relative === undefined ? '/' : `/${relative}`
}
export const languageFromSourcePath = (sourcePath = ''): Lang => languageFromPath(routeFromSourcePath(sourcePath))
const plainObject = (value: unknown): value is Record<string, any> => Boolean(value) && typeof value === 'object' && !Array.isArray(value)
export const localeOf = (lang: Lang): Record<string, any> => {
  const { locales: _, ...globalConfig } = siteConfig
  const base: Record<string, any> = { ...en, ...presets[aliases[lang] ?? 'en'], ...globalConfig }
  const locale: Record<string, any> = localeConfigs[lang] ?? {}
  return Object.fromEntries([...new Set([...Object.keys(base), ...Object.keys(locale)])].map(key => [
    key,
    plainObject(base[key]) && plainObject(locale[key]) ? { ...base[key], ...locale[key] } : key in locale ? locale[key] : base[key],
  ]))
}
export const searchLocaleOf = (lang: Lang, configured: Record<string, Partial<SearchLocale>> = {}): SearchLocale => {
  const preset = searchLocales[aliases[lang] ?? 'en'] ?? searchEn
  const custom = configured[localePath(lang)] ?? configured[lang] ?? {}
  return { ...searchEn, ...preset, ...custom, footer: { ...searchEn.footer, ...preset.footer, ...custom.footer } }
}
export const readingTimeOf = (lang: Lang, words: number) => {
  const options = siteConfig.readingTime as false | { wordPerMinute?: number, locales?: Record<string, Partial<{ word: string, less1Minute: string, time: string }>> } | undefined
  if (options === false) return null
  const preset = readingTimeLocales[aliases[lang] ?? aliases[lang.split('-')[0]] ?? 'en']
  const custom = options?.locales?.[localePath(lang)] ?? options?.locales?.[lang] ?? {}
  const locale = { ...preset, ...custom }
  const wordPerMinute = options?.wordPerMinute && options.wordPerMinute > 0 ? options.wordPerMinute : 300
  const minutes = Math.round(words / wordPerMinute * 100) / 100
  return { words: locale.word.replace('$word', String(words)), time: minutes < 1 ? locale.less1Minute : locale.time.replace('$time', String(Math.round(minutes))) }
}
export const isCjkLanguage = (lang: Lang) => /^(?:zh|ja|ko)(?:-|$)/iu.test(lang)
export const licenseName = (lang: Lang, license: string) => {
  const index = licenseKeys.indexOf(license as typeof licenseKeys[number])
  return index < 0 ? license : licensePresets[aliases[lang] ?? 'en'][index]
}

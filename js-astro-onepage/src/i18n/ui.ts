/**
 * 界面文案（UI chrome）的多语言表。
 *
 * 这里只放**模板自带的固定文案**——「源码」「在线体验」「回到首页」这类。
 * 你自己的内容（名字、简介、项目描述）写在 projects.yaml 里，不经过这里。
 *
 * 语言由 projects.yaml 顶层的 `语言`（英文别名 `lang`）字段决定：
 *   语言: en        # 或 zh-CN / zh-TW / ja / ko / es / fr / de / pt / ru
 *
 * 想加一种语言：在下面照抄一份并译好，顶层「语言」字段填对应的码即可。
 * 找不到对应语言时回退到英文。
 */

export interface UIStrings {
  /** 重点大卡区的标题（固定「代表作」） */
  featuredTitle: string;
  /** 代表作区标题后的轻量副标题（如「点开即用」） */
  backToTop: string;
  /** 清单区无分类时的默认标题（固定「作品」） */
  worksTitle: string;
  /** 自动开源项目节的标题 */
  opensourceTitle: string;
  opensourceMore: string;
  /** featured 卡片上主链接（「在线体验」）按钮的默认文字 */
  demo: string;
  /** featured 卡片上指向仓库的链接 */
  source: string;
  /** featured 卡片缩略图的 alt 文案，{name} 会被替换成条目名 */
  thumbAlt: string;
  /**
   * 页脚的数据更新时间前缀，{date} 会被替换。
   * 它在页脚里是「·」分隔的独立一项，所以有大小写字母的语言要按句首大写：
   * de 的 Daten / es 的 Datos / pt 的 Dados / ru 的 Данные 都是名词，小写就是语法错。
   * 中日韩没有大小写问题，维持原样。
   */
  updated: string;
  /** 404 页 */
  notFoundTitle: string;
  notFoundBody: string;
  notFoundBack: string;
}

export const ui: Record<string, UIStrings> = {
  en: {
    featuredTitle: "Featured",
    backToTop: "Back to top",
    worksTitle: "Works",
    opensourceTitle: "Open Source",
    opensourceMore: "See more on GitHub",
    demo: "Try it",
    source: "Source",
    thumbAlt: "{name} preview",
    updated: "Data updated {date}",
    notFoundTitle: "This page doesn't exist",
    notFoundBody: "It may have moved, or it hasn't been built yet.",
    notFoundBack: "Back to home",
  },
  "zh-CN": {
    featuredTitle: "代表作",
    backToTop: "返回顶部",
    worksTitle: "作品",
    opensourceTitle: "开源项目",
    opensourceMore: "在 GitHub 看更多",
    demo: "在线体验",
    source: "源码",
    thumbAlt: "{name} 预览图",
    updated: "数据更新于 {date}",
    notFoundTitle: "这一页不存在",
    notFoundBody: "要找的东西可能改了地址，或者还没做出来。",
    notFoundBack: "回到首页",
  },
  "zh-TW": {
    featuredTitle: "代表作",
    backToTop: "返回頂部",
    worksTitle: "作品",
    opensourceTitle: "開源專案",
    opensourceMore: "在 GitHub 看更多",
    demo: "線上體驗",
    source: "原始碼",
    thumbAlt: "{name} 預覽圖",
    updated: "資料更新於 {date}",
    notFoundTitle: "這一頁不存在",
    notFoundBody: "要找的東西可能改了網址，或者還沒做出來。",
    notFoundBack: "回到首頁",
  },
  ja: {
    featuredTitle: "代表作",
    backToTop: "ページの先頭へ",
    worksTitle: "作品",
    opensourceTitle: "オープンソース",
    opensourceMore: "GitHub でもっと見る",
    demo: "体験する",
    source: "ソース",
    thumbAlt: "{name} のプレビュー",
    updated: "データ更新日 {date}",
    notFoundTitle: "このページはありません",
    notFoundBody: "移動したか、まだ作られていないようです。",
    notFoundBack: "ホームへ戻る",
  },
  ko: {
    featuredTitle: "대표작",
    backToTop: "맨 위로",
    worksTitle: "작품",
    opensourceTitle: "오픈소스",
    opensourceMore: "GitHub에서 더 보기",
    demo: "체험하기",
    source: "소스",
    thumbAlt: "{name} 미리보기",
    updated: "데이터 갱신 {date}",
    notFoundTitle: "이 페이지는 없습니다",
    notFoundBody: "주소가 바뀌었거나 아직 만들어지지 않았습니다.",
    notFoundBack: "홈으로",
  },
  es: {
    featuredTitle: "Destacados",
    backToTop: "Volver arriba",
    worksTitle: "Trabajos",
    opensourceTitle: "Código abierto",
    opensourceMore: "Ver más en GitHub",
    demo: "Probarlo",
    source: "Código",
    thumbAlt: "Vista previa de {name}",
    updated: "Datos actualizados el {date}",
    notFoundTitle: "Esta página no existe",
    notFoundBody: "Puede que haya cambiado de dirección o que aún no exista.",
    notFoundBack: "Volver al inicio",
  },
  fr: {
    featuredTitle: "À la une",
    backToTop: "Retour en haut",
    worksTitle: "Travaux",
    opensourceTitle: "Open source",
    opensourceMore: "Voir plus sur GitHub",
    demo: "Essayer",
    source: "Code source",
    thumbAlt: "Aperçu de {name}",
    updated: "Données mises à jour le {date}",
    notFoundTitle: "Cette page n'existe pas",
    notFoundBody: "Elle a peut-être changé d'adresse, ou n'existe pas encore.",
    notFoundBack: "Retour à l'accueil",
  },
  de: {
    featuredTitle: "Ausgewählt",
    backToTop: "Nach oben",
    worksTitle: "Projekte",
    opensourceTitle: "Open Source",
    opensourceMore: "Mehr auf GitHub",
    demo: "Ausprobieren",
    source: "Quellcode",
    thumbAlt: "Vorschau von {name}",
    updated: "Daten aktualisiert am {date}",
    notFoundTitle: "Diese Seite gibt es nicht",
    notFoundBody: "Sie wurde vielleicht verschoben oder existiert noch nicht.",
    notFoundBack: "Zurück zur Startseite",
  },
  pt: {
    featuredTitle: "Destaques",
    backToTop: "Voltar ao topo",
    worksTitle: "Trabalhos",
    opensourceTitle: "Código aberto",
    opensourceMore: "Ver mais no GitHub",
    demo: "Experimentar",
    source: "Código",
    thumbAlt: "Pré-visualização de {name}",
    updated: "Dados atualizados em {date}",
    notFoundTitle: "Esta página não existe",
    notFoundBody: "Pode ter mudado de endereço, ou ainda não foi criada.",
    notFoundBack: "Voltar ao início",
  },
  ru: {
    featuredTitle: "Избранное",
    backToTop: "Наверх",
    worksTitle: "Работы",
    opensourceTitle: "Открытое ПО",
    opensourceMore: "Ещё на GitHub",
    demo: "Открыть",
    source: "Исходный код",
    thumbAlt: "Превью {name}",
    updated: "Данные обновлены {date}",
    notFoundTitle: "Такой страницы нет",
    notFoundBody: "Возможно, адрес изменился или страница ещё не создана.",
    notFoundBack: "На главную",
  },
};

/**
 * 按 site.lang 取文案表。
 * 先精确匹配（zh-CN），再按主语言回退（zh-Hans → zh-CN），最后回退英文。
 */
export function getUI(lang: string | undefined): UIStrings {
  if (!lang) return ui.en;
  if (ui[lang]) return ui[lang];

  const lower = lang.toLowerCase();
  const exact = Object.keys(ui).find((k) => k.toLowerCase() === lower);
  if (exact) return ui[exact];

  // zh-Hans / zh-Hant / zh 之类
  if (lower.startsWith("zh")) {
    return /hant|tw|hk|mo/.test(lower) ? ui["zh-TW"] : ui["zh-CN"];
  }
  const base = lower.split("-")[0];
  const byBase = Object.keys(ui).find((k) => k.toLowerCase().split("-")[0] === base);
  return byBase ? ui[byBase] : ui.en;
}

/** 把 {done} / {total} / {date} 这类占位符填上 */
export function fmt(tpl: string, vars: Record<string, string | number>): string {
  return tpl.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/** 切换器上显示的母语短名。未收录的语言码回退为大写码 */
const NATIVE: Record<string, string> = {
  en: "EN",
  "zh-CN": "中文",
  "zh-TW": "繁體",
  ja: "日本語",
  ko: "한국어",
  es: "ES",
  fr: "FR",
  de: "DE",
  pt: "PT",
  ru: "RU",
};

export function nativeName(code: string): string {
  const hit = Object.keys(NATIVE).find((k) => k.toLowerCase() === code.toLowerCase());
  return hit ? NATIVE[hit] : code.toUpperCase();
}

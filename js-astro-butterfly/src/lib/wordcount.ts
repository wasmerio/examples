/**
 * Same counting rules as hexo-wordcount: every CJK character counts as one word,
 * every run of latin letters/digits counts as one word.
 * Reading speed: 300 CJK chars/min, 160 English words/min.
 */
const CJK = /[⺀-⿿぀-ヿ㄀-ㇿ㐀-䶿一-鿿豈-﫿＀-￯]/g;
const EN = /[a-zA-Z0-9_Β-ωЀ-ӿ]+|[一-鿿㐀-䶿豈-﫿぀-ゟ가-힯Ѐ-ӿ]+|[äÄåÅöÖ]+|\w+/g;

export function countWords(text: string) {
  const cn = (text.match(CJK) ?? []).length;
  const en = (text.replace(CJK, ' ').match(EN) ?? []).length;
  const words = cn + en;
  const minutes = Math.max(1, Math.round(cn / 300 + en / 160));
  return { words, minutes };
}

/** 1234 -> "1.2k" (hexo-wordcount style) */
export function formatCount(n: number) {
  return n < 1000 ? String(n) : `${Math.round(n / 100) / 10}k`;
}

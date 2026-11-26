import type { Strings } from './index';

// The chrome, in Korean. A second language is here so the shape of a translation is settled
// before anyone needs one: the type below fails the build the moment en.ts grows a key this
// file has not answered.
//
// Korean has no plural agreement, so the count strings read the same at one and at many.
const ko: Strings = {
  skip: '본문으로 건너뛰기',
  desks: '부서',

  by: '글',
  minutes: (n) => `${n}분`,
  stories: (n) => `기사 ${n}편`,

  figures: '숫자로 보기',
  moreFrom: (desk) => `${desk} 더 보기`,
  filedTo: '분류',
  relatedReading: '함께 읽기',

  photoEssay: '포토 에세이',
  pagination: '쪽 이동',
  newer: '← 최신',
  older: '이전 →',
  pageOf: (n, total) => `${total}쪽 중 ${n}쪽`,

  notFound: '페이지를 찾을 수 없습니다',
  notFoundLine: '찾으시는 페이지가 여기에 없습니다.',
  backHome: '첫 화면으로',
};
export default ko;

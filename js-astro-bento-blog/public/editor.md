# Bento Blog Post Editor — AI 작성 가이드

이 문서는 AI 에이전트가 `/editor`에서 불러올 수 있는 **Post JSON v2** 문서를 작성하기 위한 계약서다.

## 목표

- 결과물은 유효한 JSON 객체 하나여야 한다. Markdown 본문이나 코드 펜스는 출력하지 않는다.
- 최상위 `version`은 반드시 숫자 `2`다.
- `meta`, `page`, `blocks`를 항상 포함한다.
- 모든 블록의 `id`는 문서 안에서 고유한 문자열이어야 한다. 예: `block-intro`, `block-01`.
- 사람이 읽기 쉬운 한국어를 기본으로 작성하고, 사실·인용·링크는 확인 가능한 경우에만 넣는다.

## 기본 형태

```json
{
  "version": 2,
  "meta": {
    "title": "글 제목",
    "slug": "post-slug",
    "description": "목록과 RSS에 표시할 짧은 소개",
    "pubDate": "2026-08-04",
    "category": "engineering",
    "tags": "astro, editor",
    "status": ["draft"]
  },
  "page": {
    "icon": "📝",
    "cover": { "type": "color", "value": "#eaf4ff", "position": 50 }
  },
  "blocks": []
}
```

`page.icon`과 `page.cover`는 생략할 수 있다. 커버는 `type: "color"` 또는 `type: "image"`이며, 이미지일 때 `value`에는 이미지 URL을 넣는다. `position`은 0~100이다.

## 공통 규칙

- 일반 문장 블록은 `richText` 배열을 사용한다. 단순 텍스트는 `[{ "text": "내용" }]`로 작성한다.
- `richText` 조각에는 선택적으로 `href`, `annotations`, `textColor`, `backgroundColor`를 넣을 수 있다.
- `annotations`에는 `bold`, `italic`, `underline`, `strike`, `code`만 `true`로 넣는다.
- 색상은 `default`, `gray`, `brown`, `orange`, `yellow`, `green`, `blue`, `purple`, `pink`, `red`, `teal` 중 하나를 권장한다.
- 블록에는 선택적으로 `backgroundColor`, `textColor`, `children`을 넣을 수 있다. `children`은 하위 블록 배열이다.
- 이미지 블록에는 선택적으로 `isHeroImage: true`를 넣을 수 있으며, 문서 전체에서 대표 이미지는 하나만 설정할 수 있다. `displayWidth`에는 120~760 사이의 표시 너비(px)를 넣는다. 생략하면 기존과 같이 본문 너비를 모두 사용한다.
- 제목은 문서의 구조를 반영해 H1부터 순서대로 사용한다. 목차가 필요한 문서에는 `table_of_contents` 블록을 제목 뒤에 하나 둔다.

## 블록 레퍼런스

### 텍스트 계열

```json
{ "id": "p-1", "type": "paragraph", "richText": [{ "text": "본문" }] }
{ "id": "h-1", "type": "heading", "level": 2, "richText": [{ "text": "섹션 제목" }] }
{ "id": "ul-1", "type": "bulleted_list", "richText": [{ "text": "항목" }] }
{ "id": "ol-1", "type": "numbered_list", "richText": [{ "text": "첫 번째 항목" }] }
{ "id": "todo-1", "type": "todo", "checked": false, "richText": [{ "text": "할 일" }] }
{ "id": "quote-1", "type": "quote", "richText": [{ "text": "인용문" }] }
{ "id": "callout-1", "type": "callout", "icon": "💡", "richText": [{ "text": "중요한 메모" }] }
{ "id": "context-1", "type": "context", "title": "배경", "richText": [{ "text": "문맥과 전제" }] }
```

### 구조·미디어 계열

```json
{ "id": "toggle-1", "type": "toggle", "richText": [{ "text": "자세히 보기" }], "children": [{ "id": "toggle-p-1", "type": "paragraph", "richText": [{ "text": "접히는 내용" }] }] }
{ "id": "toc-1", "type": "table_of_contents" }
{ "id": "divider-1", "type": "divider" }
{ "id": "code-1", "type": "code", "language": "ts", "code": "const answer = 42;" }
{ "id": "math-1", "type": "equation", "equation": "E = mc^2" }
{ "id": "image-1", "type": "image", "src": "https://example.com/image.webp", "alt": "이미지 설명", "caption": [{ "text": "이미지 캡션" }], "isHeroImage": true, "displayWidth": 420 }
{ "id": "bookmark-1", "type": "bookmark", "url": "https://example.com", "title": "참고 자료", "description": "링크 설명" }
```

### 표

`rows`는 행 배열이며, 각 셀은 반드시 `richText`를 가진 객체다. 보통 첫 행은 헤더로 쓴다.

```json
{
  "id": "table-1",
  "type": "table",
  "hasHeaderRow": true,
  "rows": [
    [{ "richText": [{ "text": "항목" }] }, { "richText": [{ "text": "설명" }] }],
    [{ "richText": [{ "text": "예시" }] }, { "richText": [{ "text": "내용" }] }]
  ]
}
```

## 인라인 서식 예시

```json
{
  "id": "p-link",
  "type": "paragraph",
  "richText": [
    { "text": "중요한 " },
    { "text": "링크", "href": "https://example.com", "annotations": { "bold": true }, "textColor": "blue" },
    { "text": "입니다." }
  ]
}
```

## 작성 품질 체크

- `meta.title`, `meta.slug`, `meta.description`, `meta.pubDate`를 채운다.
- `slug`는 영문 소문자·숫자·하이픈 중심으로 쓴다.
- 블록 ID 중복, 알 수 없는 `type`, 잘못된 날짜 형식은 피한다.
- 코드 블록에는 설명 없이 긴 비밀값·토큰·개인정보를 넣지 않는다.
- 이미지·북마크는 실제로 접근 가능한 URL일 때만 사용한다.
- 완성한 JSON을 `/editor`의 **불러오기**로 열어 내용과 서식을 확인한다.

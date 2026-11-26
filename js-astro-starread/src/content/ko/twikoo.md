---
title: Twikoo 댓글 시스템
cover: /cover/2ca3dc68e9893bd1.avif
categories: [도움말 문서]
date: 2026-06-30 12:58:33
---

## 클라우드 함수 배포

Twikoo를 호스팅하거나 지정된 사이트에 직접 배포하세요

| 배포 방식 | 추천도 | 설명 |
| :----------------------------------------------------------- | :----- | :----------------------------------------------------------- |
| [텐센트 클라우드 원클릭 배포](https://twikoo.js.org/backend.html#텐센트-클라우드-원클릭-배포) | ★☆☆☆☆  | 편리하지만 종량제 환경만 지원합니다 — 즉, **원클릭 배포 환경은 무료 리소스가 소진되면 비용이 발생합니다**. 그리고 종량제 환경은 연간/월간 환경으로 전환할 수 없습니다. 무료 할당량 데이터베이스 읽기 작업은 하루 500회에 불과하며, **Twikoo의 운영 요구를 지원할 수 없습니다**. |
| [텐센트 클라우드 수동 배포](https://twikoo.js.org/backend.html#텐센트-클라우드-수동-배포) | ★★☆☆☆  | 텐센트 클라우드 클라우드 개발 환경에 수동으로 배포하며, 중국 본토에서 접근 속도가 빠릅니다. 배포하려면 환경을 유료로 구매해야 합니다. |
| [텐센트 클라우드 CLI 배포](https://twikoo.js.org/backend.html#텐센트-클라우드-CLI-배포) | ★☆☆☆☆  | Node.js 경험이 있는 개발자만 대상으로 합니다. |
| [Vercel 배포](https://twikoo.js.org/backend.html#vercel-배포) | ★★★☆☆  | 무료로 배포하려는 사용자에게 적합하며, 중국 본토에서는 접근 속도가 느리거나 접근할 수 없을 수 있습니다. 자신의 도메인을 바인딩하면 접근 속도를 높일 수 있습니다. |
| [Railway 배포](https://twikoo.js.org/backend.html#railway-배포) | ★★☆☆☆  | 무료 할당량이 있지만 한 달 연속 운영을 지원하기에는 충분하지 않으며, 배포가 간단하고 전 세계 접근에 적합합니다. |
| [Zeabur 배포](https://twikoo.js.org/backend.html#zeabur-배포) | ★☆☆☆☆  | 알리페이 또는 신용카드 바인딩이 필요하며, 배포가 간단하고 중국 본토 접근에 적합합니다. 무료 플랜 환경은 언제든지 삭제될 수 있습니다. |
| [Netlify 배포](https://twikoo.js.org/backend.html#netlify-배포) | ★★★★☆  | 충분한 무료 할당량이 있으며, 중국 본토 접근 속도가 괜찮습니다. |
| [Hugging Face 배포](https://twikoo.js.org/backend.html#hugging-face-배포) | ★★★★☆  | 무료이며, 중국 본토 접근 속도가 괜찮습니다. Cloudflare Tunnels를 통해 사용자 정의 도메인을 허용합니다. |
| [AWS Lambda 배포](https://twikoo.js.org/backend.html#aws-lambda-배포) | ★★★☆☆  | 세계 최대의 클라우드 플랫폼으로, 이미 AWS 풀세트를 사용하는 사용자에게 적합합니다. |
| [Cloudflare Workers 배포](https://twikoo.js.org/backend.html#cloudflare-workers-배포) | ★★☆☆☆  | 배포에 명령줄이 필요하며, 콜드 스타트 시간이 짧고 일부 기능 제한이 있습니다. |
| [개인 배포](https://twikoo.js.org/backend.html#개인-배포) | ★★☆☆☆  | 서버가 있는 사용자에게 적합하며, 직접 HTTPS 인증서를 신청해야 합니다. |
| [개인 배포 (Docker)](https://twikoo.js.org/backend.html#개인-배포-docker) | ★★★☆☆  | 서버가 있는 사용자에게 적합하며, 직접 HTTPS 인증서를 신청해야 합니다. |

## 프론트엔드 배포

👆위의 클라우드 함수 환경 주소를 도입하기만 하면 됩니다

### Hexo에서 사용하기

#### [Hexo Butterfly](https://github.com/jerryc127/hexo-theme-butterfly) 테마에서 사용하기

[Butterfly 설치 문서(4) 테마 설정-2](https://butterfly.js.org/posts/ceeb73f/#comments)를 참고하여 설정하세요

#### [Hexo Keep](https://github.com/XPoet/hexo-theme-keep) 테마에서 사용하기

[hexo-theme-keep/_config.yml](https://github.com/XPoet/hexo-theme-keep/blob/master/_config.yml)을 참고하여 설정하세요

#### [Hexo Volantis](https://github.com/volantis-x/hexo-theme-volantis) 테마에서 사용하기

[hexo-theme-volantis/_config.yml](https://github.com/volantis-x/hexo-theme-volantis/blob/master/_config.yml)을 참고하여 설정하세요

#### [Hexo Ayer](https://github.com/Shen-Yu/hexo-theme-ayer) 테마에서 사용하기

[hexo-theme-ayer/_config.yml](https://github.com/Shen-Yu/hexo-theme-ayer/blob/master/_config.yml)을 참고하여 설정하세요

#### [Hexo NexT](https://github.com/next-theme/hexo-theme-next) 테마에서 사용하기

**NexT 8 이하 버전은 아직 지원되지 않습니다**, 먼저 NexT 8로 업그레이드하세요. 그런 다음 Hexo 프로젝트 루트 디렉토리에서 실행하세요

```bash
# NexT 버전 >= 8.0.0 && < 8.4.0용
npm install hexo-next-twikoo@1.0.0
# NexT 버전 >= 8.4.0용
npm install hexo-next-twikoo@1.0.3
```

그런 다음 설정에 추가하세요

```yaml
twikoo:
  enable: true
  visitor: true
  envId: xxxxxxxxxxxxxxx # 텐센트 클라우드 환경은 envId를 입력; Vercel 환경은 주소를 입력 (https://xxx.vercel.app)
  # region: ap-guangzhou # 환경 지역, 기본 ap-shanghai, 텐센트 클라우드 환경은 ap-shanghai 또는 ap-guangzhou 입력; Vercel 환경은 입력하지 마세요
```

#### [Hexo Matery](https://github.com/blinkfox/hexo-theme-matery) 테마에서 사용하기

[hexo-theme-matery/_config.yml](https://github.com/blinkfox/hexo-theme-matery/blob/develop/_config.yml)을 참고하여 설정하세요

#### [Hexo Icarus](https://github.com/ppoffice/hexo-theme-icarus) 테마에서 사용하기

异次元de机智君💯의 [텐센트 클라우드를 기반으로 당신의 Icarus 블로그에 Twikoo 댓글 시스템을 장착하세요](https://www.anzifan.com/post/icarus_to_candy_2/)를 참고하세요

#### [Hexo MengD](https://github.com/lete114/hexo-theme-MengD) 테마에서 사용하기

[hexo-theme-MengD/_config.yml](https://github.com/lete114/hexo-theme-MengD/blob/master/_config.yml)을 참고하여 설정하세요

#### [hexo-theme-fluid](https://github.com/fluid-dev/hexo-theme-fluid) 테마에서 사용하기

[설정 가이드 - 댓글](https://hexo.fluid-dev.com/docs/guide/#comments)을 참고하여 설정하세요

#### [hexo-theme-cards](https://github.com/ChrAlpha/hexo-theme-cards) 테마에서 사용하기

[hexo-theme-cards/_config.yml](https://github.com/ChrAlpha/hexo-theme-cards/blob/master/_config.yml)을 참고하여 설정하세요

#### [maupassant-hexo](https://github.com/tufu9441/maupassant-hexo) 테마에서 사용하기

[maupassant-hexo/_config.yml](https://github.com/tufu9441/maupassant-hexo/blob/master/_config.yml)을 참고하여 설정하세요

#### [hexo-theme-redefine](https://github.com/EvanNotFound/hexo-theme-redefine) 테마에서 사용하기

[Redefine 공식 문서 #comment](https://redefine-docs.ohevan.com/docs/configuration-guide/comment#twikoo)를 참고하여 설정하세요

#### [Hexo-Theme-Solitude](https://github.com/valor-x/hexo-theme-solitude) 테마에서 사용하기

[Solitude 문서](https://solitude-docs.efu.me/comments/twikoo)를 참고하여 설정하세요

### Hugo에서 사용하기

#### [hugo-theme-stack](https://github.com/CaiJimmy/hugo-theme-stack) 테마에서 사용하기

[Comments | Stack](https://stack.jimmycai.com/config/comments)과 [hugo-theme-stack/config.yaml#L83](https://github.com/CaiJimmy/hugo-theme-stack/blob/master/config.yaml#L83)을 참고하여 설정하세요

#### [FixIt](https://github.com/hugo-fixit/FixIt) 테마에서 사용하기

[입문편 - FixIt #테마 설정](https://fixit.lruihao.cn/zh-cn/documentation/basics/#theme-configuration)과 [hugo-fixit/FixIt/config.toml#L613-L624](https://github.com/hugo-fixit/FixIt/blob/8bb2a35dcc4c54fc3e0fb968df063d6be1daabf3/config.toml#L613-L624)을 참고하여 설정하세요

### VitePress에서 사용하기

[VitePress twikoo 통합 참고 솔루션](https://github.com/twikoojs/twikoo/issues/715)을 참고하여 설정하세요.

### CDN으로 도입하기

사용 중인 블로그 테마가 Twikoo를 지원하지 않고, Twikoo를 도입하는 방법을 모르는 경우 블로그 테마 개발자에게 적응 요청을 제출할 수 있습니다

```html
<div id="tcomment"></div>
<script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.min.js"></script>
<script>
twikoo.init({
  envId: '귀하의 환경 id', // 텐센트 클라우드 환경은 envId를 입력; Vercel 환경은 주소를 입력 (https://xxx.vercel.app)
  el: '#tcomment', // 컨테이너 요소
  // region: 'ap-guangzhou', // 환경 지역, 기본 ap-shanghai, 텐센트 클라우드 환경은 ap-shanghai 또는 ap-guangzhou 입력; Vercel 환경은 입력하지 마세요
  // path: location.pathname, // 다른 글을 구분하기 위한 사용자 정의 js 경로, 글 경로가 location.pathname이 아닌 경우 이 매개변수를 전달해야 합니다
  // lang: 'zh-CN', // 댓글 영역 언어를 수동으로 설정하는 데 사용, 지원되는 언어 목록 https://github.com/twikoojs/twikoo/blob/main/src/client/utils/i18n/index.js
})
</script>
```

#### 다른 버전 간의 차이점

- `twikoo.all.min.js`: 텐센트 클라우드 클라우드 개발(tcb)이 포함된 전체 버전, 텐센트 클라우드 클라우드 개발로 배포하는 경우 이 버전을 선택하세요
- `twikoo.min.js`: 텐센트 클라우드 클라우드 개발(tcb)이 제거된 간소화 버전, 용량이 더 작으며 텐센트 클라우드 클라우드 개발로 배포하지 않는 모든 사용자에게 적합합니다
- `twikoo.nocss.js`: 전체 버전에서 스타일을 분리한 버전, 정상적으로 표시하려면 `twikoo.css`를 동시에 도입해야 하며, 댓글 영역 스타일을 마음대로 수정하고 싶은 사용자에게 적합합니다

#### CDN 미러 교체

기본 CDN의 로딩 속도가 느린 경우 다른 CDN 미러로 교체할 수 있습니다. 다음은 선택 가능한 공용 CDN이며, 일부 CDN은 최신 버전을 동기화하는 데 며칠이 걸릴 수 있습니다:

#### 중국에서 사용 권장

- `https://registry.npmmirror.com/twikoo/1.6.44/files/dist/twikoo.min.js`
- `https://s4.zstatic.net/npm/twikoo@1.6.44/dist/twikoo.min.js`

#### 전 세계에서 사용 권장

- `https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.min.js`

#### 백업 옵션

- `https://s4.zstatic.net/ajax/libs/twikoo/1.6.41/twikoo.min.js`
- `https://lib.baomitu.com/twikoo/1.6.39/twikoo.min.js`

CDN으로 Twikoo를 도입하는 사용자는 링크 주소에서 버전을 고정하여 향후 Twikoo 업그레이드 시 비호환성 업데이트의 영향을 받지 않도록 하는 것이 좋습니다.

CDN으로 Twikoo를 도입하는 사용자는 무결성을 보장하기 위해 코드에 [SRI](https://developer.mozilla.org/ko/docs/Web/Security/Subresource_Integrity)를 추가하는 것이 좋습니다. 예:

```js
<script
  src="https://cdn.jsdelivr.net/npm/twikoo@1.6.36/dist/twikoo.all.min.js"
  integrity="sha384-4KfOjEinLSkv1i1J8TzlkC/RTnuiLoR1OLerVgjEKoH5djYtbf7mzEFsz9p3nfuA"
  crossorigin="anonymous">
</script>
```

여기서 `integrity`의 값은 [SRI Hash Generator](https://www.srihash.org/)에서 조회할 수 있습니다.

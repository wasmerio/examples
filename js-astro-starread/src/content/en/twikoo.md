---
title: Twikoo Comment System
cover: /cover/2ca3dc68e9893bd1.avif
categories: [Help Documentation]
date: 2026-06-30 12:58:33
---

## Cloud Function Deployment

Host Twikoo or deploy it yourself to the specified site

| Deployment Method | Recommendation | Description |
| :----------------------------------------------------------- | :----- | :----------------------------------------------------------- |
| [Tencent Cloud One-click Deployment](https://twikoo.js.org/backend.html#Tencent-Cloud-one-click-deployment) | ★☆☆☆☆  | Although convenient, it only supports pay-as-you-go environments — that is to say, **for one-click deployed environments, fees will be incurred when free resources are exhausted**. And pay-as-you-go environments cannot be switched to yearly/monthly environments. The free quota database read operations are only 500 times/day, **which cannot support Twikoo's operational requirements**. |
| [Tencent Cloud Manual Deployment](https://twikoo.js.org/backend.html#Tencent-Cloud-manual-deployment) | ★★☆☆☆  | Manually deploy to Tencent Cloud CloudBase environment, faster access speed in mainland China. Requires paid purchase of environment to deploy. |
| [Tencent Cloud CLI Deployment](https://twikoo.js.org/backend.html#Tencent-Cloud-CLI-deployment) | ★☆☆☆☆  | Only for developers with Node.js experience. |
| [Vercel Deployment](https://twikoo.js.org/backend.html#vercel-deployment) | ★★★☆☆  | Suitable for users who want free deployment, slower or even inaccessible access speed in mainland China, binding your own domain name can improve access speed. |
| [Railway Deployment](https://twikoo.js.org/backend.html#railway-deployment) | ★★☆☆☆  | Has free quota but not enough to support one month of continuous operation, simple deployment, suitable for global access. |
| [Zeabur Deployment](https://twikoo.js.org/backend.html#zeabur-deployment) | ★☆☆☆☆  | Requires binding Alipay or credit card, simple deployment, suitable for mainland China access, free plan environment may be deleted at any time. |
| [Netlify Deployment](https://twikoo.js.org/backend.html#netlify-deployment) | ★★★★☆  | Has sufficient free quota, good access speed in mainland China. |
| [Hugging Face Deployment](https://twikoo.js.org/backend.html#hugging-face-deployment) | ★★★★☆  | Free, good access speed in mainland China. Allows custom domain names through Cloudflare Tunnels. |
| [AWS Lambda Deployment](https://twikoo.js.org/backend.html#aws-lambda-deployment) | ★★★☆☆  | The world's largest cloud platform, suitable for users who already use the full AWS suite. |
| [Cloudflare Workers Deployment](https://twikoo.js.org/backend.html#cloudflare-workers-deployment) | ★★☆☆☆  | Deployment requires command line, shorter cold start time, some functional limitations. |
| [Private Deployment](https://twikoo.js.org/backend.html#private-deployment) | ★★☆☆☆  | Suitable for users with servers, need to apply for HTTPS certificate yourself. |
| [Private Deployment (Docker)](https://twikoo.js.org/backend.html#private-deployment-docker) | ★★★☆☆  | Suitable for users with servers, need to apply for HTTPS certificate yourself. |

## Frontend Deployment

👆Just introduce the cloud function environment address above

### Using in Hexo

#### Using in [Hexo Butterfly](https://github.com/jerryc127/hexo-theme-butterfly) theme

Please refer to [Butterfly Installation Document (4) Theme Configuration-2](https://butterfly.js.org/posts/ceeb73f/#comments) for configuration

#### Using in [Hexo Keep](https://github.com/XPoet/hexo-theme-keep) theme

Please refer to [hexo-theme-keep/_config.yml](https://github.com/XPoet/hexo-theme-keep/blob/master/_config.yml) for configuration

#### Using in [Hexo Volantis](https://github.com/volantis-x/hexo-theme-volantis) theme

Please refer to [hexo-theme-volantis/_config.yml](https://github.com/volantis-x/hexo-theme-volantis/blob/master/_config.yml) for configuration

#### Using in [Hexo Ayer](https://github.com/Shen-Yu/hexo-theme-ayer) theme

Please refer to [hexo-theme-ayer/_config.yml](https://github.com/Shen-Yu/hexo-theme-ayer/blob/master/_config.yml) for configuration

#### Using in [Hexo NexT](https://github.com/next-theme/hexo-theme-next) theme

**Versions below NexT 8 are not supported yet**, please upgrade to NexT 8 first. Then execute in the Hexo project root directory

```bash
# For NexT version >= 8.0.0 && < 8.4.0
npm install hexo-next-twikoo@1.0.0
# For NexT version >= 8.4.0
npm install hexo-next-twikoo@1.0.3
```

Then add in the configuration

```yaml
twikoo:
  enable: true
  visitor: true
  envId: xxxxxxxxxxxxxxx # Tencent Cloud environment fill in envId; Vercel environment fill in address (https://xxx.vercel.app)
  # region: ap-guangzhou # Environment region, default ap-shanghai, Tencent Cloud environment fill in ap-shanghai or ap-guangzhou; Vercel environment do not fill
```

#### Using in [Hexo Matery](https://github.com/blinkfox/hexo-theme-matery) theme

Please refer to [hexo-theme-matery/_config.yml](https://github.com/blinkfox/hexo-theme-matery/blob/develop/_config.yml) for configuration

#### Using in [Hexo Icarus](https://github.com/ppoffice/hexo-theme-icarus) theme

Please refer to [Based on Tencent Cloud, equip your Icarus blog with Twikoo comment system](https://www.anzifan.com/post/icarus_to_candy_2/) by 异次元de机智君💯

#### Using in [Hexo MengD](https://github.com/lete114/hexo-theme-MengD) theme

Please refer to [hexo-theme-MengD/_config.yml](https://github.com/lete114/hexo-theme-MengD/blob/master/_config.yml) for configuration

#### Using in [hexo-theme-fluid](https://github.com/fluid-dev/hexo-theme-fluid) theme

Please refer to [Configuration Guide - Comments](https://hexo.fluid-dev.com/docs/guide/#comments) for configuration

#### Using in [hexo-theme-cards](https://github.com/ChrAlpha/hexo-theme-cards) theme

Please refer to [hexo-theme-cards/_config.yml](https://github.com/ChrAlpha/hexo-theme-cards/blob/master/_config.yml) for configuration

#### Using in [maupassant-hexo](https://github.com/tufu9441/maupassant-hexo) theme

Please refer to [maupassant-hexo/_config.yml](https://github.com/tufu9441/maupassant-hexo/blob/master/_config.yml) for configuration

#### Using in [hexo-theme-redefine](https://github.com/EvanNotFound/hexo-theme-redefine) theme

Please refer to [Redefine Official Documentation #comment](https://redefine-docs.ohevan.com/docs/configuration-guide/comment#twikoo) for configuration

#### Using in [Hexo-Theme-Solitude](https://github.com/valor-x/hexo-theme-solitude) theme

Please refer to [Solitude Documentation](https://solitude-docs.efu.me/comments/twikoo) for configuration

### Using in Hugo

#### Using in [hugo-theme-stack](https://github.com/CaiJimmy/hugo-theme-stack) theme

Please refer to [Comments | Stack](https://stack.jimmycai.com/config/comments) and [hugo-theme-stack/config.yaml#L83](https://github.com/CaiJimmy/hugo-theme-stack/blob/master/config.yaml#L83) for configuration

#### Using in [FixIt](https://github.com/hugo-fixit/FixIt) theme

Please refer to [Getting Started - FixIt #Theme Configuration](https://fixit.lruihao.cn/zh-cn/documentation/basics/#theme-configuration) and [hugo-fixit/FixIt/config.toml#L613-L624](https://github.com/hugo-fixit/FixIt/blob/8bb2a35dcc4c54fc3e0fb968df063d6be1daabf3/config.toml#L613-L624) for configuration

### Using in VitePress

Please refer to [VitePress integrated twikoo reference solution](https://github.com/twikoojs/twikoo/issues/715) for configuration.

### Introduce via CDN

If the blog theme you are using does not support Twikoo, and you don't know how to introduce Twikoo, you can submit an adaptation request to the blog theme developer

```html
<div id="tcomment"></div>
<script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.min.js"></script>
<script>
twikoo.init({
  envId: 'Your environment id', // Tencent Cloud environment fill in envId; Vercel environment fill in address (https://xxx.vercel.app)
  el: '#tcomment', // Container element
  // region: 'ap-guangzhou', // Environment region, default ap-shanghai, Tencent Cloud environment fill in ap-shanghai or ap-guangzhou; Vercel environment do not fill
  // path: location.pathname, // Custom js path to distinguish different articles, if your article path is not location.pathname, you need to pass this parameter
  // lang: 'zh-CN', // Used to manually set the comment area language, list of supported languages https://github.com/twikoojs/twikoo/blob/main/src/client/utils/i18n/index.js
})
</script>
```

#### Differences between different versions

- `twikoo.all.min.js`: Full version including Tencent Cloud CloudBase (tcb), if you deploy using Tencent Cloud CloudBase, please choose this version
- `twikoo.min.js`: Simplified version with Tencent Cloud CloudBase (tcb) removed, smaller size, suitable for all users not deploying with Tencent Cloud CloudBase
- `twikoo.nocss.js`: Styles stripped on the basis of the full version, need to introduce `twikoo.css` at the same time to display normally, suitable for users who want to customize comment area styles

#### Replace CDN mirror

If you encounter slow loading speed of the default CDN, you can replace it with other CDN mirrors. The following are public CDNs to choose from, some of which may take several days to sync the latest version:

#### Recommended for use in China

- `https://registry.npmmirror.com/twikoo/1.6.44/files/dist/twikoo.min.js`
- `https://s4.zstatic.net/npm/twikoo@1.6.44/dist/twikoo.min.js`

#### Recommended for global use

- `https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.min.js`

#### Backup options

- `https://s4.zstatic.net/ajax/libs/twikoo/1.6.41/twikoo.min.js`
- `https://lib.baomitu.com/twikoo/1.6.39/twikoo.min.js`

It is recommended that users who introduce Twikoo via CDN lock the version in the link address to avoid being affected by incompatible updates when Twikoo upgrades in the future.

It is recommended that users who introduce Twikoo via CDN add [SRI](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) in the code to ensure integrity, example:

```js
<script
  src="https://cdn.jsdelivr.net/npm/twikoo@1.6.36/dist/twikoo.all.min.js"
  integrity="sha384-4KfOjEinLSkv1i1J8TzlkC/RTnuiLoR1OLerVgjEKoH5djYtbf7mzEFsz9p3nfuA"
  crossorigin="anonymous">
</script>
```

Where the value of `integrity` can be queried at [SRI Hash Generator](https://www.srihash.org/).

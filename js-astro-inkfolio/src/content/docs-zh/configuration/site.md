---
title: 站点设置
order: 1
description: 站名、标语、作者、语言和域名，都在一个块里。
---

```yaml
site:
  name: Inkfolio
  nameZh: Inkfolio
  tagline: 写下来，做出来
  taglineZh: 写下来，做出来
  description: 一句话介绍这个站。
  url: https://example.com
  author: 你的名字
  email: you@example.com
  defaultLanguage: zh
  showLanguageSwitcher: true
```

## 每个键干什么

- `name` / `nameZh`：导航里的品牌名和 `<title>` 后缀。中文名只在 `/zh/` 页面用。
- `tagline` / `taglineZh`：列表页标题下那句话。
- `description` / `descriptionZh`：meta 描述和首页标题下那段。
- `url`：canonical、sitemap、RSS。结尾不要斜杠。
- `author` / `authorZh`：每篇文章的署名。
- `email`：可选，填了才出现在页脚。
- `defaultLanguage`：`en` 或 `zh`，决定哪棵树在 `/`。
- `showLanguageSwitcher`：`false` 一次性隐藏所有语言入口。

> [!NOTE]
> 没有单独的「站点标题」：`name` 兼顾导航和浏览器标题。想改某页标题，直接改那一页的 `title`。

## 中文页

所有 `*Zh` 键不写就回落到英文值，所以单语言站只需要 `showLanguageSwitcher: false`，其他中文键全删也没关系。

## 天气与本地时间

页脚可以显示读者本地时间和当前天气，默认关闭，`weather.enabled` 设为 `true` 才出现。

```yaml
weather:
  enabled: true
  mode: visitor        # visitor = 读者所在地 · fixed = 下面填的固定地址
  units: celsius       # celsius | fahrenheit
  geoEndpoint: ''      # 仅 visitor 模式；留空用 ipwho.is
  fallbackLatitude: 31.2304
  fallbackLongitude: 121.4737
  label: Shanghai
  labelZh: 上海
  latitude: 31.2304
  longitude: 121.4737
  timezone: Asia/Shanghai
```

时钟精确到秒，用读者自己的时区。`visitor` 模式下天气按免 key 的 IP 定位查询，定位失败才回落到坐标；改成 `mode: fixed` 就只报一个地址，此时 `label`、`latitude`、`longitude`、`timezone` 决定显示内容。全程不涉及 API key——Open-Meteo 本身不需要，`geoEndpoint` 可把定位请求指到你自己的代理。天气缓存 30 分钟；都失败时天气部分隐藏，时钟照常走。

定位按顺序试三个互不相干的服务——你配了 `geoEndpoint` 就先用它，然后 `ipwho.is`、`get.geojs.io`、`ipapi.co`，每个四秒超时。因为广告拦截插件、公司网络和部分国家的网络环境都会单独卡掉其中任意一个。三个全挂时用回落坐标，并把坐标对应的地名一起显示，不会出现一个没有地名的温度。

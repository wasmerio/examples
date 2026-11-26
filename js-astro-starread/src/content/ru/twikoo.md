---
title: Система комментариев Twikoo
cover: /cover/2ca3dc68e9893bd1.avif
categories: [Справочная документация]
date: 2026-06-30 12:58:33
---

## Развёртывание облачной функции

Разместите Twikoo на хостинге или разверните самостоятельно на указанном сайте

| Способ развёртывания | Рекомендация | Описание |
| :----------------------------------------------------------- | :----- | :----------------------------------------------------------- |
| [Одно кликовое развёртывание Tencent Cloud](https://twikoo.js.org/backend.html#одно-кликовое-развёртывание-tencent-cloud) | ★☆☆☆☆  | Хотя и удобно, но поддерживает только среды оплаты по факту использования — то есть **для сред, развёрнутых в один клик, после исчерпания бесплатных ресурсов будут начисляться платежи**. И среды оплаты по факту использования нельзя переключить на среды годовой/месячной подписки. Бесплатный лимит операций чтения базы данных составляет всего 500 раз в день, **что не может поддерживать эксплуатационные требования Twikoo**. |
| [Ручное развёртывание Tencent Cloud](https://twikoo.js.org/backend.html#ручное-развёртывание-tencent-cloud) | ★★☆☆☆  | Ручное развёртывание в среде CloudBase Tencent Cloud, более быстрая скорость доступа в материковом Китае. Требует платной покупки среды для развёртывания. |
| [Развёртывание Tencent Cloud CLI](https://twikoo.js.org/backend.html#развёртывание-tencent-cloud-cli) | ★☆☆☆☆  | Только для разработчиков с опытом Node.js. |
| [Развёртывание Vercel](https://twikoo.js.org/backend.html#развёртывание-vercel) | ★★★☆☆  | Подходит для пользователей, желающих бесплатного развёртывания, более медленная или даже недоступная скорость доступа в материковом Китае, привязка собственного доменного имени может повысить скорость доступа. |
| [Развёртывание Railway](https://twikoo.js.org/backend.html#развёртывание-railway) | ★★☆☆☆  | Имеет бесплатный лимит, но недостаточный для поддержки непрерывной работы в течение месяца, простое развёртывание, подходит для глобального доступа. |
| [Развёртывание Zeabur](https://twikoo.js.org/backend.html#развёртывание-zeabur) | ★☆☆☆☆  | Требует привязки Alipay или кредитной карты, простое развёртывание, подходит для доступа из материкового Китая, среда бесплатного тарифа может быть удалена в любое время. |
| [Развёртывание Netlify](https://twikoo.js.org/backend.html#развёртывание-netlify) | ★★★★☆  | Имеет достаточный бесплатный лимит, хорошая скорость доступа в материковом Китае. |
| [Развёртывание Hugging Face](https://twikoo.js.org/backend.html#развёртывание-hugging-face) | ★★★★☆  | Бесплатно, хорошая скорость доступа в материковом Китае. Позволяет использовать пользовательские доменные имена через Cloudflare Tunnels. |
| [Развёртывание AWS Lambda](https://twikoo.js.org/backend.html#развёртывание-aws-lambda) | ★★★☆☆  | Крупнейшая в мире облачная платформа, подходит для пользователей, которые уже используют полный набор сервисов AWS. |
| [Развёртывание Cloudflare Workers](https://twikoo.js.org/backend.html#развёртывание-cloudflare-workers) | ★★☆☆☆  | Развёртывание требует командной строки, более короткое время холодного старта, некоторые функциональные ограничения. |
| [Частное развёртывание](https://twikoo.js.org/backend.html#частное-развёртывание) | ★★☆☆☆  | Подходит для пользователей с серверами, нужно самостоятельно запрашивать HTTPS-сертификат. |
| [Частное развёртывание (Docker)](https://twikoo.js.org/backend.html#частное-развёртывание-docker) | ★★★☆☆  | Подходит для пользователей с серверами, нужно самостоятельно запрашивать HTTPS-сертификат. |

## Фронтенд развёртывание

👆Просто подключите адрес среды облачной функции выше

### Использование в Hexo

#### Использование в теме [Hexo Butterfly](https://github.com/jerryc127/hexo-theme-butterfly)

Пожалуйста, обратитесь к [Документу по установке Butterfly (4) Конфигурация темы-2](https://butterfly.js.org/posts/ceeb73f/#comments) для настройки

#### Использование в теме [Hexo Keep](https://github.com/XPoet/hexo-theme-keep)

Пожалуйста, обратитесь к [hexo-theme-keep/_config.yml](https://github.com/XPoet/hexo-theme-keep/blob/master/_config.yml) для настройки

#### Использование в теме [Hexo Volantis](https://github.com/volantis-x/hexo-theme-volantis)

Пожалуйста, обратитесь к [hexo-theme-volantis/_config.yml](https://github.com/volantis-x/hexo-theme-volantis/blob/master/_config.yml) для настройки

#### Использование в теме [Hexo Ayer](https://github.com/Shen-Yu/hexo-theme-ayer)

Пожалуйста, обратитесь к [hexo-theme-ayer/_config.yml](https://github.com/Shen-Yu/hexo-theme-ayer/blob/master/_config.yml) для настройки

#### Использование в теме [Hexo NexT](https://github.com/next-theme/hexo-theme-next)

**Версии ниже NexT 8 пока не поддерживаются**, сначала обновитесь до NexT 8. Затем выполните в корневом каталоге проекта Hexo

```bash
# Для версии NexT >= 8.0.0 && < 8.4.0
npm install hexo-next-twikoo@1.0.0
# Для версии NexT >= 8.4.0
npm install hexo-next-twikoo@1.0.3
```

Затем добавьте в конфигурацию

```yaml
twikoo:
  enable: true
  visitor: true
  envId: xxxxxxxxxxxxxxx # Для среды Tencent Cloud заполните envId; для среды Vercel заполните адрес (https://xxx.vercel.app)
  # region: ap-guangzhou # Регион среды, по умолчанию ap-shanghai, для среды Tencent Cloud заполните ap-shanghai или ap-guangzhou; для среды Vercel не заполняйте
```

#### Использование в теме [Hexo Matery](https://github.com/blinkfox/hexo-theme-matery)

Пожалуйста, обратитесь к [hexo-theme-matery/_config.yml](https://github.com/blinkfox/hexo-theme-matery/blob/develop/_config.yml) для настройки

#### Использование в теме [Hexo Icarus](https://github.com/ppoffice/hexo-theme-icarus)

Пожалуйста, обратитесь к [На основе Tencent Cloud, оснастите ваш блог Icarus системой комментариев Twikoo](https://www.anzifan.com/post/icarus_to_candy_2/) от 异次元de机智君💯

#### Использование в теме [Hexo MengD](https://github.com/lete114/hexo-theme-MengD)

Пожалуйста, обратитесь к [hexo-theme-MengD/_config.yml](https://github.com/lete114/hexo-theme-MengD/blob/master/_config.yml) для настройки

#### Использование в теме [hexo-theme-fluid](https://github.com/fluid-dev/hexo-theme-fluid)

Пожалуйста, обратитесь к [Руководство по конфигурации - Комментарии](https://hexo.fluid-dev.com/docs/guide/#comments) для настройки

#### Использование в теме [hexo-theme-cards](https://github.com/ChrAlpha/hexo-theme-cards)

Пожалуйста, обратитесь к [hexo-theme-cards/_config.yml](https://github.com/ChrAlpha/hexo-theme-cards/blob/master/_config.yml) для настройки

#### Использование в теме [maupassant-hexo](https://github.com/tufu9441/maupassant-hexo)

Пожалуйста, обратитесь к [maupassant-hexo/_config.yml](https://github.com/tufu9441/maupassant-hexo/blob/master/_config.yml) для настройки

#### Использование в теме [hexo-theme-redefine](https://github.com/EvanNotFound/hexo-theme-redefine)

Пожалуйста, обратитесь к [Официальной документации Redefine #comment](https://redefine-docs.ohevan.com/docs/configuration-guide/comment#twikoo) для настройки

#### Использование в теме [Hexo-Theme-Solitude](https://github.com/valor-x/hexo-theme-solitude)

Пожалуйста, обратитесь к [Документации Solitude](https://solitude-docs.efu.me/comments/twikoo) для настройки

### Использование в Hugo

#### Использование в теме [hugo-theme-stack](https://github.com/CaiJimmy/hugo-theme-stack)

Пожалуйста, обратитесь к [Комментарии | Stack](https://stack.jimmycai.com/config/comments) и [hugo-theme-stack/config.yaml#L83](https://github.com/CaiJimmy/hugo-theme-stack/blob/master/config.yaml#L83) для настройки

#### Использование в теме [FixIt](https://github.com/hugo-fixit/FixIt)

Пожалуйста, обратитесь к [Введение - FixIt #Конфигурация темы](https://fixit.lruihao.cn/zh-cn/documentation/basics/#theme-configuration) и [hugo-fixit/FixIt/config.toml#L613-L624](https://github.com/hugo-fixit/FixIt/blob/8bb2a35dcc4c54fc3e0fb968df063d6be1daabf3/config.toml#L613-L624) для настройки

### Использование в VitePress

Пожалуйста, обратитесь к [Эталонному решению интеграции twikoo в VitePress](https://github.com/twikoojs/twikoo/issues/715) для настройки.

### Подключение через CDN

Если тема блога, которую вы используете, не поддерживает Twikoo, и вы не знаете, как подключить Twikoo, вы можете отправить запрос на адаптацию разработчику темы блога

```html
<div id="tcomment"></div>
<script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.min.js"></script>
<script>
twikoo.init({
  envId: 'Ваш id среды', // Для среды Tencent Cloud заполните envId; для среды Vercel заполните адрес (https://xxx.vercel.app)
  el: '#tcomment', // Элемент контейнера
  // region: 'ap-guangzhou', // Регион среды, по умолчанию ap-shanghai, для среды Tencent Cloud заполните ap-shanghai или ap-guangzhou; для среды Vercel не заполняйте
  // path: location.pathname, // Пользовательский путь js для различения разных статей, если путь вашей статьи не является location.pathname, вам нужно передать этот параметр
  // lang: 'zh-CN', // Используется для ручной установки языка области комментариев, список поддерживаемых языков https://github.com/twikoojs/twikoo/blob/main/src/client/utils/i18n/index.js
})
</script>
```

#### Различия между разными версиями

- `twikoo.all.min.js`: Полная версия, включающая CloudBase (tcb) Tencent Cloud, если вы развёртываете с использованием CloudBase Tencent Cloud, выберите эту версию
- `twikoo.min.js`: Упрощённая версия с удалённым CloudBase (tcb) Tencent Cloud, меньший размер, подходит для всех пользователей, не развёртывающих с помощью CloudBase Tencent Cloud
- `twikoo.nocss.js`: Версия с вынесенными стилями на основе полной версии, нужно одновременно подключить `twikoo.css` для нормального отображения, подходит для пользователей, желающих кастомизировать стили области комментариев

#### Замена CDN-зеркала

Если вы столкнулись с медленной скоростью загрузки CDN по умолчанию, вы можете заменить его на другое CDN-зеркало. Ниже приведены общедоступные CDN на выбор, некоторые из которых могут потребовать нескольких дней для синхронизации последней версии:

#### Рекомендуется для использования в Китае

- `https://registry.npmmirror.com/twikoo/1.6.44/files/dist/twikoo.min.js`
- `https://s4.zstatic.net/npm/twikoo@1.6.44/dist/twikoo.min.js`

#### Рекомендуется для глобального использования

- `https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.min.js`

#### Резервные варианты

- `https://s4.zstatic.net/ajax/libs/twikoo/1.6.41/twikoo.min.js`
- `https://lib.baomitu.com/twikoo/1.6.39/twikoo.min.js`

Пользователям, подключающим Twikoo через CDN, рекомендуется зафиксировать версию в адресе ссылки, чтобы избежать влияния несовместимых обновлений при будущем обновлении Twikoo.

Пользователям, подключающим Twikoo через CDN, рекомендуется добавить [SRI](https://developer.mozilla.org/ru/docs/Web/Security/Subresource_Integrity) в код для обеспечения целостности, пример:

```js
<script
  src="https://cdn.jsdelivr.net/npm/twikoo@1.6.36/dist/twikoo.all.min.js"
  integrity="sha384-4KfOjEinLSkv1i1J8TzlkC/RTnuiLoR1OLerVgjEKoH5djYtbf7mzEFsz9p3nfuA"
  crossorigin="anonymous">
</script>
```

Где значение `integrity` можно запросить в [SRI Hash Generator](https://www.srihash.org/).

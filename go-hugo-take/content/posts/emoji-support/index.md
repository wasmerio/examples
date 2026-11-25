---
categories: [blog]
title: Emoji Support
date: 2023-02-01
author: Hugo Authors
description: Guide to emoji usage in Hugo
tags:
  - emoji
  - aa
---


Os emojis podem ser habilitados em um projeto Hugo de várias maneiras.
<!--more-->
A função [`emojify`](https://gohugo.io/functions/emojify/) pode ser chamada diretamente em templates ou [Inline Shortcodes](https://gohugo.io/templates/shortcode-templates/#inline-shortcodes).

Para habilitar emojis globalmente, defina `enableEmoji` como `true` no arquivo `hugo.toml` do seu site.
Você pode digitar os códigos abreviados de emoji diretamente nos arquivos de conteúdo; por exemplo:

`:see_no_evil:` :see_no_evil: `:hear_no_evil:` :hear_no_evil: `:speak_no_evil:` :speak_no_evil:

Eu :heart: Hugo! 😁

O [Emoji cheat sheet](http://www.emoji-cheat-sheet.com/) é uma referência útil para os códigos abreviados de emoji.

***

**N.B.** As etapas acima habilitam caracteres e sequências de emojis do Padrão Unicode no Hugo; no entanto, a renderização desses glifos depende do navegador e da plataforma. Para estilizar os emojis, você pode usar uma fonte de emoji de terceiros ou um pacote de fontes; por exemplo:

{{< highlight css >}}
.emoji {
  font-family: Apple Color Emoji, Segoe UI Emoji, NotoColorEmoji, Segoe UI Symbol, Android Emoji, EmojiSymbols;
}
{{< /highlight >}}

{{< css.inline >}}
<style>
.emojify {
    font-family: Apple Color Emoji, Segoe UI Emoji, NotoColorEmoji, Segoe UI Symbol, Android Emoji, EmojiSymbols;
    font-size: 2rem;
    vertical-align: middle;
}
@media screen and (max-width:650px) {
  .nowrap {
    display: block;
    margin: 25px 0;
  }
}
</style>
{{< /css.inline >}}

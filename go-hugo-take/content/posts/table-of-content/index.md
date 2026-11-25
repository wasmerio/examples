---
categories: [blog]
author: Hugo Authors
title: Tabela de Conteúdo
date: 2023-05-02
description: Configurar a tabela de conteúdo no tema "Awesome" do blog Hugo.
points: ["目次の出し方と見出しの範囲", "1100px 未満で目次が折りたたまれる仕組み", "目次の現在地と読んだ割合"]
---


## Tabela de Conteúdo

Este tema suporta a exibição de um tabela de conteúdo (ToC) em postagens de blog.

## Parâmetros

Você pode gerenciar o tabela de conteúdo com dois parâmetros:
- parâmetro global `toc`;
- parâmetro de postagem `toc`.

O parâmetro `toc` da postagem tem prioridade mais alta que o parâmetro global `toc`.

## Habilitar a Tabela de Conteúdo em todas as postagens

Para habilitar o tabela de conteúdo (ToC) em todas as postagens (globalmente), defina o parâmetro `toc` como `true` no arquivo `hugo.toml`.

```toml
[params]
  toc = true
```

Para desativar o tabela de conteúdo globalmente, basta ignorar o parâmetro `toc` ou defini-lo como `false`.

 ## Habilitar a Tabela de Conteúdo em determinadas postagens

Para habilitar o tabela de conteúdo (ToC) em certas postagens, defina o parâmetro `toc` como `true` nas configurações da postagem.

```yaml
---
title: Como habilitar o tabela de conteúdo
date: 2023-05-02
toc: true
---
```
## Desabilitar o tabela de conteúdo em determinadas postagens

Para desabilitar o tabela de conteúdo (ToC) em certas postagens, você deve seguir dois passos.


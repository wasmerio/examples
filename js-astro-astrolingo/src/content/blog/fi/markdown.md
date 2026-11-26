---
title: 'Markdown-tyylit'
description: 'Markdown-perussyntaksi, jota voidaan käyttää kirjoitettaessa Markdown-sisältöä Astrossa.'
locale: "fi"
pubDate: 'Jun 19 2024'
heroImage: '/blog-placeholder-2.jpg'
tags: ["ohjelmointi", "kieliä"]
---

Tässä on esimerkki Markdownin perussyntaksista, mitä voidaan käyttää Markdown-sisällön kirjoittamiseen Astrossa.

## Otsikot

HTML elements `<h1>`—`<h6>` represent six levels of section headings. `<h1>` is the highest section level while `<h6>` is the lowest.
HTML elementit `<h1>`—`<h6>` kuvaavat otsikoita kuudessa tasossa. `<h1>` on korkein otsikon taso ja `<h6>` alin.

# H1

## H2

### H3

#### H4

##### H5

###### H6

## Kohta

Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur, offic to cor sequas etum rerum idem sintibus eiur? Quianimin porecus evelectur, cum que nis nust voloribus ratem aut omnimi, sitatur? Quiatem. Nam, omnis sum am facea corem alique molestrunt et eos evelece arcillit ut aut eos eos nus, sin conecerem erum fuga. Ri oditatquam, ad quibus unda veliamenimin cusam et facea ipsamus es exerum sitate dolores editium rerore eost, temped molorro ratiae volorro te reribus dolorer sperchicium faceata tiustia prat.

Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.

## Kuvat

### Syntaksi

```markdown
![Alt text](./path/to/image)
```

### Tulos

![blogin kuva](/blogi-kuva.jpg)

## Blockquotes (lohkolainaukset)

Blockquote elementti kuvaa toisesta lähteestä lainattua sisältöä, valinnaisesti viittauksella, jonka on oltava `footer`- tai `cite`-elementin sisällä, ja valinnaisesti rivin sisäisillä muutoksilla, kuten huomautuksilla ja lyhenteillä.

### Blockquote ilman viittausta

#### Syntaksi

```markdown
> Tiam, ad mint andaepu dandae nostion secatur sequo quae.  
> **Huom.** Voit käyttää _Markdown syntaksi_ blockquote:ssa.
```

#### Tulos

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.  
> **Huom.** Voit käyttää _Markdown syntaksi_ blockquote:ssa.

### Blockquote viittauksella

#### Syntaksi

```markdown
> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>
```

#### Tulos

> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>

[^1]: Ote Rob Piken [puheesta](https://www.youtube.com/watch?v=PAAkCSZUG1c) Gopherfestillä, marraskuun 18, 2015.

## Tables

### Syntaksi

```markdown
| Italics   | Bold     | Code   |
| --------- | -------- | ------ |
| _italics_ | **bold** | `code` |
```

### Tulos

| Italics   | Bold     | Code   |
| --------- | -------- | ------ |
| _italics_ | **bold** | `code` |

## Code Blocks

### Syntaksi

we can use 3 backticks ``` in new line and write snippet and close with 3 backticks on new line and to highlight language specific syntax, write one word of language name after first 3 backticks, for eg. html, javascript, css, markdown, typescript, txt, bash

````markdown
```html
<!doctype html>
<html lang="fi">
  <head>
    <meta charset="utf-8" />
    <title>HTML5</title>
  </head>
  <body>
    <p>Teksti</p>
  </body>
</html>
```
````

### Tulos

```html
<!doctype html>
<html lang="fi">
  <head>
    <meta charset="utf-8" />
    <title>HTML5</title>
  </head>
  <body>
    <p>Teksti</p>
  </body>
</html>
```

## List Types

### Ordered List

#### Syntaksi

```markdown
1. Ensimmäinen
2. Toinen
3. Kolmas
```

#### Tulos

1. Ensimmäinen
2. Toinen
3. Kolmas

### Unordered List

#### Syntaksi

```markdown
- List item
- Another item
- And another item
```

#### Tulos

- List item
- Another item
- And another item

### Nested list

#### Syntaksi

```markdown
- Hedelmiä
  - Omena
  - Oranssi
  - Banaani
- Maitotuotteet
  - Maito
  - Juusto
```

#### Tulos

- Hedelmiä
  - Omena
  - Oranssi
  - Banaani
- Maitotuotteet
  - Maito
  - Juusto

## Muut elementit — abbr, sub, sup, kbd, mark

### Syntaksi

```markdown
<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms, and other small creatures.
```

### Tulos

<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms, and other small creatures.

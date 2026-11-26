---
title: 'Estilos Markdown'
description: 'Guía sintáxica básica de Markdown.'
locale: "es"
pubDate: 'Jun 19 2024'
heroImage: '/blog-placeholder-2.jpg'
tags: ["programación", "idiomas"]
---

Este post contiene una muestra de sintaxis básica de Markdown que se puede utilizar al escribir contenido de Markdown en Astro.

## Títulos

Los elementos de HTML `<h1>`—`<h6>` representan la jerarquía de títulos de sección. `<h1>` es el nivel más alto, mientras que `<h6>` es el más bajo.

# H1

## H2

### H3

#### H4

##### H5

###### H6

## Párrafos

Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur, offic to cor sequas etum rerum idem sintibus eiur? Quianimin porecus evelectur, cum que nis nust voloribus ratem aut omnimi, sitatur? Quiatem. Nam, omnis sum am facea corem alique molestrunt et eos evelece arcillit ut aut eos eos nus, sin conecerem erum fuga. Ri oditatquam, ad quibus unda veliamenimin cusam et facea ipsamus es exerum sitate dolores editium rerore eost, temped molorro ratiae volorro te reribus dolorer sperchicium faceata tiustia prat.

Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.

## Imagenes

### Sintaxis

```markdown
![Texto alternativo](./ubicacion/completa/o/relativa/de/la/imagen)
```

### Resultado

![imagen de relleno para blogs](/blog-placeholder-about.jpg)

## Blockquote (cita en bloque)

Un elemento "blockquote" (cita en blogque) representa contenido que se cita de otra fuente, opcionalmente con una cita que debe estar dentro de un elemento `footer` o `cite`, y opcionalmente con cambios en línea como anotaciones y abreviaturas.

### Blockquote sin atribución

#### Sintaxis

```markdown
> Tiam, ad mint andaepu dandae nostion secatur sequo quae.  
> **Nota.** Se puede usar _sintaxis Markdown_ dentro de una cita en bloque.
```

#### Resultado

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.  
> **Nota.** Se puede usar _sintaxis Markdown_ dentro de una cita en bloque.

### Blockquote con atribución

#### Sintaxis

```markdown
> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>
```

#### Resultado

> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>

[^1]: El texto acá arriba es un extracto de la [plática de Rob Pike](https://www.youtube.com/watch?v=PAAkCSZUG1c) durante Gopherfest, Noviembre 18, 2015.

## Tablas

### Sintaxis

```markdown
| Cursiva   | Negrita     | Código   |
| --------- | ----------- | -------- |
| _cursiva_ | **negrita** | `código` |
```

### Resultado

| Cursiva   | Negrita     | Código   |
| --------- | ----------- | -------- |
| _cursiva_ | **negrita** | `código` |

## Bloques de código

### Sintaxis

Se usan tres (3) comillas invertidas ``` en la línea de arriba y abajo de un fragmento para resaltar líneas de código. Las primeras 3 comillas invertidas deben llevar el nombre del lenguaje (por ejemplo, *html*, *javascript*, *css*, *markdown*, *typescript*, *txt*, *bash*, etc.) para resaltar la sintaxis específica de un lenguaje de programación.

````markdown
```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Ejemplo HTML5</title>
  </head>
  <body>
    <p>Texto</p>
  </body>
</html>
```
````

### Resultado

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Ejemplo HTML5</title>
  </head>
  <body>
    <p>Texto</p>
  </body>
</html>
```

## Listas

### Lista ordenada

#### Sintaxis

```markdown
1. Primer item
2. Segundo item
3. Tercer item
```

#### Resultado

1. Primer item
2. Segundo item
3. Tercer item

### Unordered List

#### Sintaxis

```markdown
- Item
- Otro item
- Y otro item
```

#### Resultado

- Item
- Otro item
- Y otro item

### Listas con niveles

#### Sintaxis

```markdown
- Frutas
  - Manzana
  - Naranja
  - Banana
- Otros
  - Leche
  - Queso
```

#### Resultado

- Frutas
  - Manzana
  - Naranja
  - Banana
- Otros
  - Leche
  - Queso

## Otros elementos — abbr, sub, sup, kbd, mark

### Sintaxis

```markdown
<abbr title="Graphics Interchange Format">GIF</abbr> es un formato de imagen de mapa de bits.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Apreta <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> para terminar la sesión.

La mayoría de las <mark>salamandras</mark> son nocturnas y cazan insectos, gusanos y otras criaturas pequeñas.
```

### Resultado

<abbr title="Graphics Interchange Format">GIF</abbr> es un formato de imagen de mapa de bits.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Apreta <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> para terminar la sesión.

La mayoría de las <mark>salamandras</mark> son nocturnas y cazan insectos, gusanos y otras criaturas pequeñas.

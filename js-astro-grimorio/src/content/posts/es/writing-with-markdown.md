---
title: "Escribir con Markdown"
description: "Un recorrido por todos los elementos que puedes usar en un artículo: encabezados, énfasis, listas, código, tablas, citas e imágenes."
date: 2026-01-20
lang: es
category: notes
tags: ["Markdown", "Writing"]
featured: false
---

Este artículo es una chuleta viva: muestra cómo se ve cada elemento de Markdown en la plantilla. Úsalo como referencia mientras escribes y bórralo cuando ya no lo necesites.

Cada post empieza con un pequeño bloque de datos (el _frontmatter_) entre líneas de tres guiones:

```yaml
---
title: "Mi artículo"
description: "Un resumen de una o dos frases."
date: 2026-01-20
lang: es
category: notes
tags: ["Markdown"]
---
```

## Encabezados

Usa `##` para las secciones y `###` para las subsecciones. El primer nivel (`#`) se reserva para el título, así que dentro del texto empieza por `##`. Los encabezados aparecen solos en el índice lateral del artículo.

## Texto y énfasis

Puedes poner texto en **negrita**, en _cursiva_ o en `código en línea` para referirte a un comando o a un nombre de archivo. También funcionan los [enlaces](https://astro.build) y, si hace falta, ~~tachar~~ algo.

## Listas

Las listas sin orden sirven para enumerar ideas sueltas:

- Primer punto
- Segundo punto, con un detalle
- Tercer punto

Y las ordenadas, para pasos que van en secuencia:

1. Escribe el archivo
2. Rellena el frontmatter
3. Publica

## Código

El código en línea va entre acentos graves, como `pnpm dev`. Para bloques más largos, usa tres acentos graves e indica el lenguaje para que se coloree. Cada bloque trae un botón para copiarlo:

```sh
pnpm install
pnpm dev
```

```js
function saludar(nombre) {
  return `Hola, ${nombre}`;
}

console.log(saludar("mundo"));
```

## Tablas

Las tablas son útiles para comparar cosas de un vistazo:

| Elemento   | Sintaxis        | ¿Para qué?                    |
| ---------- | --------------- | ----------------------------- |
| Negrita    | `**texto**`     | Resaltar una idea             |
| Enlace     | `[texto](url)`  | Apuntar a otra página         |
| Código     | `` `código` ``  | Nombrar un comando o archivo  |

## Citas e imágenes

Las citas resaltan una frase o una referencia:

> La mejor forma de aprender algo es escribir sobre ello después.

Y las imágenes se insertan con una línea; se adaptan solas al ancho de la página:

![Una montaña de libros sobre una mesa](/covers/markdown.webp)

Con esto tienes cubierto casi todo lo que vas a necesitar. A partir de aquí, lo demás es escribir.

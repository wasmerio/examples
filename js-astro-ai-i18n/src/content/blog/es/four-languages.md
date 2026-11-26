---
title: "Lo que aprendimos al lanzar en cuatro idiomas"
description: "Seis meses, cuatro regiones y los tres errores que más tiempo nos costaron."
date: 2026-05-12
glyph: stack
---
La primavera pasada lanzamos nuestro primer producto correctamente multilingüe: cuatro idiomas, una compilación, un repositorio. Esto es lo que salió mal, en orden de impacto.

## Enlaces dentro de una página traducida

Este es el fallo que nadie detecta. La página se renderiza, el enlace funciona y simplemente está en el idioma equivocado. Un lector francés hace clic en un enlace a mitad de una frase y aterriza en una página en inglés, al principio, habiendo perdido su lugar.

La solución debe estar en la compilación y no en el contenido: cuando un enlace apunte a una página que existe en este idioma, reescríbelo; cuando no, déjalo como está. Reescribir los archivos en sí implicaría repetirlo tras cada traducción.

## El diseño asume el inglés

El alemán es más largo. No ocasionalmente: sistemáticamente, aproximadamente un tercio más. Todos los botones que ajustamos según la etiqueta en inglés se rompieron, y el error parecía un problema de diseño más que de traducción, por lo que durante una semana fue reportado por las personas equivocadas al canal equivocado.

Ahora la regla es que nada se ajusta a su contenido. No cuesta nada en inglés y ahorra un día por idioma.

## Los títulos de página se miden en caracteres

Un resultado de búsqueda se corta aproximadamente a los sesenta y siete caracteres. Un título traducido que se lee perfectamente con noventa caracteres es un título cuyo final nadie ve. Tuvimos que decir esto explícitamente en las instrucciones al traductor, porque la fidelidad y el encaje son objetivos distintos y solo uno de ellos es visible en el archivo.

## Lo que salió bien

Una decisión ahorró más tiempo que el que costaron los tres errores anteriores: cada idioma responde por cada página, haya sido traducida o no. Nadie se encuentra jamás con un 404 porque una traducción lleve una semana de retraso, y ninguna URL que publicamos ha tenido que moverse.

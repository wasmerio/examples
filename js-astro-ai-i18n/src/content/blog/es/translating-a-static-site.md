---
title: "Traducir un sitio estático sin un CMS"
description: "Una traducción es un archivo junto al original. Todo lo demás se deriva de esa única decisión."
date: 2026-03-04
glyph: arc
---
El primer sitio multilingüe que construimos usaba una plataforma de traducción. El texto vivía en una interfaz web, el sitio lo recuperaba al compilar y cada pregunta sobre qué había cambiado requería que alguien iniciara sesión y mirara.

El segundo utilizó archivos. `en/pricing.md` y `fr/pricing.md`, uno al lado del otro en el repositorio, y nada más. Ha sido más sencillo en todos los aspectos relevantes, y las razones no son las que esperábamos.

## Diffs

Una traducción guardada en una base de datos no tiene un historial legible. Una traducción guardada en un archivo tiene el mismo historial que el código: quién la cambió, cuándo y qué decía la frase antes. Revisar una traducción se convierte en revisar un pull request, algo que el equipo ya sabe hacer.

## La ruta es la clave

`fr/pricing.md` es el `pricing.md` en francés porque las rutas coinciden, y por ninguna otra razón. No hay tabla de mapeo.

Vale la pena defender esa regla, porque la tentación de romperla es real. Un slug localizado se lee mejor y funciona marginalmente mejor en las búsquedas. El coste es que el «de qué página es traducción esta» deja de ser una operación de cadena y se convierte en una tabla que leen el selector de idioma, el control de vigencia y el sitemap. Cualquiera de ellos puede quedar desactualizado por una sola fila errónea.

## La falta de vigencia es todo el problema

Traducir una página una vez es fácil. Saber que el inglés cambió hace tres semanas y el alemán no, es la parte que requiere una máquina.

Guardamos el hash del texto en inglés a partir del cual se hizo cada traducción. La traducción queda desactualizada cuando el hash ya no coincide. Es un archivo pequeño y una idea sencilla, y es la diferencia entre un sitio que es multilingüe y un sitio que fue multilingüe una vez.

---
title: "Herramientas que no estorban"
description: "Por qué dejamos de añadir funciones a nuestras herramientas internas y qué pasó con las que eliminamos."
date: 2026-01-20
glyph: grid
---
Cada herramienta que creamos para nosotros mismos empieza igual. Alguien hace algo a mano por tercera vez, se harta y, una semana después, hay un script. Ese script suele ser la mejor versión que tendrá la herramienta.

Lo que sigue es la parte interesante. El script recibe una flag. Luego un modo interactivo. Después un archivo de configuración, porque ahora hay demasiadas flags que recordar. Para cuando tiene un archivo de configuración, nadie sabe qué hace sin abrirlo.

## La regla que establecimos

Una herramienta se gana una opción nueva cuando la alternativa es un fork. Nada más cuenta. La comodidad no es un motivo, tampoco lo es la simetría: dos comandos que requieren cinco flags cada uno no mejoran por tener una sexta compartida.

El otoño pasado eliminamos once opciones de nuestra herramienta de compilación interna. Nueve de ellas nunca habían sido usadas por nadie. Una era ejecutada por un cron job que llevaba cuatro meses fallando silenciosamente. La undécima era genuinamente útil y ahora es la predeterminada.

## Lo que mantuvimos

- Una forma de ver qué va a hacer la herramienta antes de que lo haga.
- Un código de salida sobre el cual un script pueda ramificarse.
- Una salida que es una tabla para una persona y JSON para un programa, decidido según si alguien está observando.

Esto último vale más que cualquier función que hayamos eliminado. El mismo comando funciona en una terminal y en un pipeline, y nadie tiene que recordar una flag para lograrlo.

## Lo que haríamos diferente

Deberíamos haber anotado por qué existía cada opción en el momento de añadirla. Un año después, la única forma honesta de averiguarlo era eliminarla y ver quién se quejaba. Funcionó, pero es una forma lenta de aprender algo que ya sabíamos.

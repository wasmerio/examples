import fs from "fs";
import path from "path";

const filename = process.argv[2];

if (!filename) {
	console.log(
		"\x1b[38;2;255;100;0mUsage: node scripts/add-post.js <filename>\x1b[0m",
	);
	console.log(
		"\x1b[38;2;255;150;0mFile will be created in src/content/blog/ directory\x1b[0m",
	);
	process.exit(1);
}

const date = new Date().toISOString().split("T")[0];
const postPath = path.join("src", "content", "blog", `${filename}.md`);

const content = `---
title: Título del artículo
category: Conocimiento
description: Descripción del artículo
date: ${date}
tags: []
draft: true
image: /logo-emc.webp
image_alt: "Logotipo de Eloy Martínez Cuesta"
twitter_img: /logo-emc.webp
twitterCreator: "@eloy_emc"
twitterSite: "@eloy_emc"
keywords:
      - iluminación
      - tecnología

  - negocio
author: "eloymartinez"
authorUrl: "https://www.linkedin.com/in/eloymartinezemc/"
authorImage: "/eloy_feria_iluminacion.webp"
modifiedDate: "" # Puedes actualizarlo dinámicamente si es necesario
ogType: "article" # Cambia a 'website' si es una página general
locale: "es_ES"
siteName: "Eloy Martínez Cuesta"
noindex: false # Cambiar a true si no quieres que los buscadores indexen este post
nofollow: false # Cambiar a true si no quieres que los enlaces del post sean seguidos por buscadores
faqs:
  - question: "¿Qué es Markdown?"
    answer: "Markdown es un lenguaje de marcado ligero que se utiliza para formatear texto."
  - question: "¿Cómo se usa Markdown?"
    answer: "Puedes usar Markdown para crear documentos, páginas web o incluso correos electrónicos con formato."
  - question: "¿Qué es Schema Markup?"
    answer: "Schema Markup es un vocabulario estructurado que se agrega al HTML para ayudar a los motores de búsqueda a entender el contenido de una página."
---

Write your content here...
`;

fs.mkdirSync(path.dirname(postPath), { recursive: true });
fs.writeFileSync(postPath, content);
console.log(`Created new post at: ${postPath}`);
console.log(
	"\x1b[38;2;100;255;100m✓\x1b[38;2;150;255;150m Post created successfully!\x1b[0m",
);

import type { Locale } from "./books";

export type AttributionDocument = {
  locale: Locale;
  slug: string;
  path: string;
  title: string;
  description: string;
  status: string;
  identity: string;
  introduction: string[];
  adaptations: {
    heading: string;
    paragraphs: string[];
  };
  projects: AttributionProject[];
  license: {
    heading: string;
    introduction: string;
    copyrightHeading: string;
    copyrightLines: string[];
    text: string;
  };
};

type AttributionProject = {
  name: string;
  authorLabel: string;
  author: string;
  versionLabel: string;
  version: string;
  repositoryLabel: string;
  repositoryUrl: string;
  repositoryText: string;
  useLabel: string;
  use: string;
  licenseLabel: string;
  license: string;
};

const mitLicenseText = `Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

export const attributionDocuments: AttributionDocument[] = [
  {
    locale: "es",
    slug: "atribuciones",
    path: "/es/atribuciones/",
    title: "Atribuciones de terceros",
    description:
      "Reconocimientos de software y materiales de terceros bajo licencia MIT utilizados por esta plantilla.",
    status: "Avisos de terceros",
    identity: "EXAMPLE TEMPLATE",
    introduction: [
      "Esta página identifica el software y los materiales de terceros utilizados en este sitio. Cada obra conserva la titularidad y las condiciones de licencia de sus autores o titulares respectivos.",
      "This template does not claim ownership del código ni de los recursos upstream aquí atribuidos.",
    ],
    adaptations: {
      heading: "Material upstream e integración propia",
      paragraphs: [
        "La integración localizada, la shell public/wormhole-home.html y la implementación del título de partículas son trabajo propio del proyecto. Estas adaptaciones no transfieren la titularidad del código ni de los recursos de Wormhole Extreme o three.js.",
        "El directorio public/vendor/wormhole-extreme/ conserva el material upstream vendorizado; sus créditos, licencia y atribución siguen correspondiendo a su autor original.",
      ],
    },
    projects: [
      {
        name: "Wormhole Extreme",
        authorLabel: "Autor",
        author: "Rainner Lins",
        versionLabel: "Instantánea utilizada",
        version: "Commit 26c1ba80bdcdc9565249e21555174c989aa633c4",
        repositoryLabel: "Repositorio de origen",
        repositoryUrl: "https://github.com/rainner/wormhole-extreme",
        repositoryText: "github.com/rainner/wormhole-extreme",
        useLabel: "Uso en este proyecto",
        use: "El proyecto reutiliza código y recursos desde public/vendor/wormhole-extreme/ y los carga mediante la shell propia public/wormhole-home.html.",
        licenseLabel: "Licencia",
        license: "MIT",
      },
      {
        name: "three.js",
        authorLabel: "Copyright",
        author: "Copyright © 2010-2026 three.js authors",
        versionLabel: "Versión instalada",
        version: "0.185.1",
        repositoryLabel: "Repositorio de origen",
        repositoryUrl: "https://github.com/mrdoob/three.js",
        repositoryText: "github.com/mrdoob/three.js",
        useLabel: "Uso en este proyecto",
        use: "Dependencia del proyecto utilizada por la implementación Three.js/WebGL del título de partículas.",
        licenseLabel: "Licencia",
        license: "MIT",
      },
    ],
    license: {
      heading: "Texto de la licencia MIT",
      introduction:
        "El texto estándar de la licencia MIT aplicable a las obras identificadas arriba se reproduce una sola vez a continuación.",
      copyrightHeading: "Líneas de copyright",
      copyrightLines: [
        "Copyright © Rainner Lins",
        "Copyright © 2010-2026 three.js authors",
      ],
      text: mitLicenseText,
    },
  },
  {
    locale: "en",
    slug: "attributions",
    path: "/en/attributions/",
    title: "Third-party attributions",
    description:
      "Attributions for MIT-licensed third-party software and materials used by this template.",
    status: "Third-party notices",
    identity: "EXAMPLE TEMPLATE",
    introduction: [
      "This page identifies third-party software and materials used on this site. Each work remains subject to the ownership and licence terms of its respective authors or rightsholders.",
      "This template does not claim ownership of the upstream code or assets attributed here.",
    ],
    adaptations: {
      heading: "Upstream material and project-owned integration",
      paragraphs: [
        "The localized integration, the public/wormhole-home.html shell, and the particle-title implementation are project-owned work. Those adaptations do not transfer ownership of Wormhole Extreme or three.js code or assets.",
        "The public/vendor/wormhole-extreme/ directory retains the vendored upstream material; its credit, licence, and attribution remain with its original author.",
      ],
    },
    projects: [
      {
        name: "Wormhole Extreme",
        authorLabel: "Author",
        author: "Rainner Lins",
        versionLabel: "Snapshot used",
        version: "Commit 26c1ba80bdcdc9565249e21555174c989aa633c4",
        repositoryLabel: "Source repository",
        repositoryUrl: "https://github.com/rainner/wormhole-extreme",
        repositoryText: "github.com/rainner/wormhole-extreme",
        useLabel: "Use in this project",
        use: "The project reuses code and assets from public/vendor/wormhole-extreme/ and loads them through the project-owned public/wormhole-home.html shell.",
        licenseLabel: "Licence",
        license: "MIT",
      },
      {
        name: "three.js",
        authorLabel: "Copyright",
        author: "Copyright © 2010-2026 three.js authors",
        versionLabel: "Installed version",
        version: "0.185.1",
        repositoryLabel: "Source repository",
        repositoryUrl: "https://github.com/mrdoob/three.js",
        repositoryText: "github.com/mrdoob/three.js",
        useLabel: "Use in this project",
        use: "A project dependency used by the Three.js/WebGL particle-title implementation.",
        licenseLabel: "Licence",
        license: "MIT",
      },
    ],
    license: {
      heading: "MIT License text",
      introduction:
        "The standard MIT License text that applies to the works identified above is reproduced once below.",
      copyrightHeading: "Copyright lines",
      copyrightLines: [
        "Copyright © Rainner Lins",
        "Copyright © 2010-2026 three.js authors",
      ],
      text: mitLicenseText,
    },
  },
];

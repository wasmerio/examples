<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [AstroLingo](https://github.com/jbolns/astrolingo) Astro theme by jbolns, copied from commit `443ee30212ae9ce314d1d3bd1f46cd5885b2bf80` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-astrolingo.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [jbolns](https://github.com/jbolns), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

## AstroLingo: Multilingual Astro Blog Template
[**AstroLingo**](https://github.com/jbolns/astrolingo) is a minimalistic Astro blog template with robust multilingual (i18n) support. It packs all (or at least much of) the functionality needed for a multilingual personal, blog, or portfolio website, and leaves you room to easily adjust the design to match your brand and taste.

If your website does not need multiple languages, *AstroLingo* is probably a bit of an overkill.

If it does, *AstroLingo* might save you many hours of work.

## 📱Features
General features:
- ✅ Minimal styling (make it your own!)
- ✅ Outstanding Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

Multilingual (i18n) features:
- ✅ Multilingual pages
- ✅ Multilingual blogs
- ✅ Multilingual tags (tags can be different across languages)
- ✅ Multilingual paths (URLs can be different across languages)
- ✅ Multilingual pagination (blogs and tag lists paginated by language)
- ✅ Independently customisable pages (pages can look different across languages).

## Examples

For a demo showcasing AstroLingo as it comes by default, see [here](href="https://astrolingo.josebolanos.xyz/).

Or check [my website](https://www.josebolanos.xyz/) for a real world implementation that uses and expands on AstroLingo.

> *Note for other developers.* If you use AstroLingo in a project, feel free to submit an issue adding your website here.

## 🚀 Guidance
Since *AstroLingo* relies heavily on Astro's functionality, understanding folder structure is an important first step.

The standard *AstroLingo* project looks as follows.

```text
├── public/ 
├── src/
│   ├── components/
│   ├── content/
|   |   ├── lang_1
|   |   ├── lang_2
|   |   ├── ...
|   |   └── lang_N
│   ├── i18n/
│   ├── layouts/
│   ├── pages/
|   |   ├── blog
|   |   |   ├── [...page].astro
|   |   |   └── [...slug].astro
|   |   └── tags
|   |   |   └── [lang]
|   |   |   |   └── [tags]
|   |   |   |       └── [...page].astro
|   |   lang_1
|   |   └──  index.astro
|   |   └──  about.astro
|   |   lang_2
|   |   └──  index.astro
|   |   └──  acerca.astro
|   |   ...
|   |   lang_N
|   |   └──  index.astro
|   |   └──  minusta.astro
│   ├── styles/
│   └── consts.ts 
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Once you are familiar with the folder structure or have adjusted the structure to your own needs (relevant guidance [here](https://docs.astro.build/en/guides/internationalization/#create-localized-folders)), you can start modifying config files and creating content to suit your needs.

### Internationalisation
The key language configuration files are in the `src\i18n` folder.

The file `src\i18n\ui.ts` is for language defaults and top-level navigation links to show in header.
- `languages`: a list of all languages supported
  - Used variously across AstroLingo to render the correct string or path for a given language
- `defaultLang`: the site's default language
  - Used variously across AstroLingo when there is a need of a language fallback
- `listOfCollections`: a list of the names for all collection names in the site
  - Used in the component that generates top-level navigation links to render each link with the appropriate URL format
- `navLinks`: top-level links for the entire website
  - Used in the component that generates top-level navigation links to render the correct links for each language.

The file `src\i18n\sections.ts` is for general website info used repeatedly across the site, like the website name and description. The shortest way to understand the purpose of this file is: if you need to write something more than a few times across your site, put it here and just call it from elsewhere. Easier!

The file `src\i18n\routes.ts` is for redirection rules.
- Ignore this file if your slugs are essentially the across languages (e.g. `en\about\`, `es\about\`). The language bar is designed to automatically redirect to the current slug in a different language.
- If you use language-specific slugs, this is where you enter the slug-equivalences (e.g. `en\about\` <---> `es\acerca\`).

The file `src\i18n\utils.ts` contains utility functions needed to support internationalization.
- If you want to modify the default behaviour of the language bar, this is the file you need to edit. 
- If you want to add icons (it is purposely icon-free so that users can use their preferred icon sets), this is where you add the call to the component that renders each language into an icon (most typically, a flag). 

### Creating top-level pages
Files in `src\pages\lang_1`, `src\pages\lang_2`, `...`, to `src\pages\lang_N` automatically become top-level pages with the URL format `./[lang]/[filename]/`.
- To add a new language, add a folder named with the language code of the new language. 
- To create pages for that language, add files inside that folder.
- You can use different filenames across language folders (in which case, URLs will be different, so you will need to add a route equivalence in `src\i18n\routes.ts`). 

Files in `src\pages\blog\[lang]` generate blog reel with format `blog/[lang]/` and blog entries with format `blog/[lang]/[entry]` from the files in the content folder. The functions inside the files in this folder follow a relatively straightforward logic:
- Get all content in the specific collection using Astro's `getCollection()`
- Map content to language using `flatMap()` and `map()`
- Create pages/paths for all possible blog indexes, entries, and tags combinations using Astro's `getStaticPaths()`.

AstroLingo comes with one collection by default: blog. To add more collections, simply recreate the logic in the `src\pages\blog\` folder. Paths for additional collection will use the format `./[collection]/[lang]/[entry]/`.
- For guidance on how to create Astro collections and collection schemas, see [here](https://docs.astro.build/en/guides/content-collections/).
- It is possible to change the folder structure so the language acronyms come before the collection name (e.g. `example.com/[lang]/blog`) rather than after (e.g. `example.com/blog/[lang]`), which, in my experience, makes it harder to manage route equivalences when you have multiple collections.

### Creating and managing content
The `src\content\` directory contains "collections" of related Markdown and MDX documents with the content that ultimately gets rendered as a blog entries (or portfolio, or services, or other entries – depending on how many collections you define). 

This folder follows the same rationale as the pages folder.
- To add a new collection, create a folder named after the collection
- To add a language, create a folder with add an `.md` or `.mdx` file under the desired `[collection]/[language]` folder
- You do not need to translate every single entry
  - Entries in each folder will show on the respective blog regardless of whether they have equivalents in other languages.
  - But if there is a language without entry, best edit `src\i18n\routes.ts` to redirect to your home or blog page for that missing entry to avoid "Page Not Found" errors.
- To avoid image duplication, all images for blogs go to Astro's standard `public\` directory.

**FORBIDDEN KEYWORDS.** Do **NOT** name entries inside any collection with the exact acronym of any language used in the site or the exact name of any collection used in the site. For example:
- If you use `en` as a language, avoid naming files `\en.md`, `\en.astro`, or `\en.whatever`
- If you have a collection named `blog`, files named `\blog.md`, `\blog.astro`, or `\blog.whatever` could be problematic.

### Other folders & files
- The `src\components\` folder is the standard Astro/React/Vue/Svelte/Preact components folder.
  - A few components needed for multilingual functionality are included.
- The `src\layouts\` folder contains layouts that help render pages and blogs across the site.
  - You can create additional layouts and use them as wrappers aroung other components (you might need to slightly adapt the code to use them).
- Hero images referenced in the frontmatter of markdown (blog) files must be placed in the `public\` directory.
  - There are ways around this, but this is not within the scope of this theme.
- CSS styles are in a single file in the `src\styles` folders.
  - To use your own styles, recode or replace `src\styles\global.css`.
  - Alternatively, delete the existing styles and use a stylying Astro integration, like Tailwind (that's what I did with my own website).
- The *file* `src\types.ts` if for types additional to what Astro already offers.

## 🛣️ Expanding AstroLingo
*AstroLingo* is very expandable

Since it relies on Astro's underlying structure, AstroLingo can be modified to, for instance, redirect the shared home to a default language, or entirely hide the default language in URLs. Read [Astro's documentation](https://docs.astro.build/en/guides/internationalization/#prefixdefaultlocale) for details about how to do this and how internalisation works. And remember that any such changes naturally imply a need for revisiting the files in `src\i18n`.

Since it is based on Astro's minimalistic blog template, there is ample room for visual editing and expansion. I use AstroLingo on my own website, for instance, in combination with Tailwind and even 3D animations using Three.js. I also coded an improved version of the language bar that hides any non-existing page, to not have to worry about manually encoding redirections when I do not want to translate some content. 

## 💻 Commands
All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `.\dist\`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🤗 Credits
*AstroLingo's* bare-bones minimalistic look is based on a historical minimalistic blog template by Astro that is no longer available but I used to like a lot, which was itself based on [Bear Blog](https://github.com/HermanMartinus/bearblog/).

To learn more about me, check out my [website](https:www.josebolanos.xyz/) or [GitHub](https://github.com/jbolns).

To learn more about Astro, check out [their documentation](https://docs.astro.build), in particular, the bits about [internationalization](https://docs.astro.build/en/guides/internationalization/).

## ⚖️ License
This theme is published under a standard [MIT license](./LICENSE).

I am more of an Apache person myself. However, [Astro uses MIT](https://github.com/withastro/astro/blob/main/LICENSE). It made sense to stick with it.

## 📐 Services
[Get in touch](https://www.josebolanos.xyz/en/) if you are interested in advice or services to implement and/or expand on *AstroLingo*.

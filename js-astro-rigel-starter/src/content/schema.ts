import { multilingual } from "../multilang.mjs";
import { defineDocument, defineObject, defineSchema } from "@rigel-cms/rigel/content";

const titleField = { key: "title", label: "Title", type: "string" as const, required: true };

const schema = defineSchema({
  documents: [
    defineDocument({
      name: "settings", title: "Site settings", type: "document", folder: "src/content/settings", shared: true, singleton: true, creatable: false,
      fields: [
        { key: "siteName", label: "Site name", type: "string" },
        { key: "copyright", label: "Copyright", type: "string" },
        { key: "metaDescription", label: "Meta description", type: "text" },
      ],
    }),
    defineDocument({
      name: "demo", title: "Demo", type: "document", folder: "src/content/demo", shared: true, singleton: true, creatable: false, demo: true,
      fields: [
        { key: "siteName", label: "Site name", type: "string" },
        { key: "metaDescription", label: "Meta description", type: "text" },
        { key: "legalNote", label: "Legal note", type: "markdown" },
        { key: "bookingUrl", label: "Booking URL", type: "url" },
        { key: "logo", label: "Logo", type: "image" },
        { key: "brandColor", label: "Brand color", type: "color" },
        { key: "analyticsSnippet", label: "Analytics snippet", type: "code" },
        { key: "mapsApiKey", label: "Maps API key", type: "password" },
        { key: "maintenanceMode", label: "Maintenance mode", type: "boolean" },
        { key: "maxGuests", label: "Max guests", type: "number" },
        { key: "priceValidUntil", label: "Price valid until", type: "date" },
        { key: "address", label: "Address", type: "object", fields: [
          { key: "street", label: "Street", type: "string" },
          { key: "city", label: "City", type: "string" },
          { key: "postcode", label: "Postcode", type: "string" },
        ] },
        { key: "noticeMessages", label: "Notice messages", type: "array", items: [{ type: "string" }] },
        { key: "openingHours", label: "Opening hours", type: "array", items: [{ type: "object", fields: [
          { key: "day", label: "Day", type: "string" },
          { key: "hours", label: "Hours", type: "string" },
        ] }] },
        { key: "customFacts", label: "Custom facts", type: "array", items: [{ type: "object", fields: [
          { key: "label", label: "Label", type: "string" },
          { key: "value", label: "Value", type: "string" },
        ] }] },
        { key: "primaryContact", label: "Primary contact", type: "reference", to: ["author"] },
      ],
    }),
    defineDocument({
      name: "author", title: "Authors", type: "document", folder: "src/content/authors", shared: true, creatable: true, columns: ["photo", "email"],
      fields: [
        { key: "name", label: "Name", type: "string", required: true },
        { key: "description", label: "Description", type: "text" },
        { key: "photo", label: "Photo", type: "image" },
        { key: "email", label: "Email", type: "string" },
        { key: "url", label: "Website", type: "url" },
      ],
    }),
    defineDocument({
      name: "page",
      title: "Pages",
      type: "document",
      folder: "src/content/pages",
      protectedSlugs: ["home", "about", "services", "blog", "news", "contact", "getting-started", "perspective"],
      fields: [
        { ...titleField, label: "Page name" },
        { key: "draft", label: "Draft", type: "boolean" },
        { key: "metaTitle", label: "SEO title", type: "string" },
        { key: "description", label: "SEO description", type: "text" },
        {
          key: "sections",
          label: "Sections",
          type: "array",
          min: 1,
          items: [
            { type: "object", name: "hero" },
            { type: "object", name: "textBlock" },
            { type: "object", name: "logoStrip" },
            { type: "object", name: "workGrid" },
            { type: "object", name: "services" },
            { type: "object", name: "journal" },
            { type: "object", name: "pageIntro" },
            { type: "object", name: "wideImage" },
            { type: "object", name: "story" },
            { type: "object", name: "cta" },
            { type: "object", name: "contactDetails" },
            { type: "object", name: "blogFeed" },
            { type: "object", name: "newsFeed" },
            { type: "object", name: "articleText" },
          ],
        },
      ],
      template: [
        { type: "pageIntro", values: { eyebrow: "New page", title: "A new page", body: "Start with an introduction." } },
        { type: "cta", values: { callout: { _ref: "callout:studio" } } },
      ],
    }),
    defineDocument({
      name: "logoSet",
      title: "Logo sets",
      type: "document",
      folder: "src/content/shared/logos",
      shared: true,
      fields: [
        titleField,

        {
          key: "logos",
          label: "Logos",
          type: "array",
          items: [
            {
              type: "object",
              title: "Logo",
              fields: [
                { key: "image", label: "Image", type: "image", required: true },
                { key: "alt", label: "Alt text", type: "string", required: true },
              ],
            },
          ],
        },
      ],
    }),
    defineDocument({
      name: "callout",
      title: "Callouts",
      type: "document",
      folder: "src/content/shared/callouts",
      shared: true,
      fields: [
        titleField,
        { key: "heading", label: "Heading", type: "string", required: true },
        { key: "buttonLabel", label: "Button label", type: "string", required: true },
        { key: "href", label: "Button link", type: "url", required: true },
      ],
    }),
  ],
  objects: [
    defineObject({
      name: "hero",
      title: "Hero",
      type: "section",
      fields: [
        { key: "title", label: "Headline", type: "string", required: true, initialValue: "Your headline starts here" },
        { key: "body", label: "Subheadline", type: "text", required: true, initialValue: "Introduce your work and what makes it different. Edit this text to make it yours." },
        { key: "image", label: "Image", type: "image", required: true, initialValue: "/demo/hero.jpg" },
        { key: "alt", label: "Image alt text", type: "string", required: true, initialValue: "Looking up between glass office towers toward an overcast sky" },
        { key: "label", label: "Button label", type: "string", initialValue: "Explore services" },
        { key: "href", label: "Button link", type: "url", initialValue: "/services/" },
      ],
    }),
    defineObject({
      name: "textBlock",
      title: "Text block",
      type: "section",
      fields: [
        { key: "heading", label: "Heading", type: "string", required: true, initialValue: "Introduce your next idea" },
        { key: "lead", label: "Lead", type: "text", initialValue: "Start with the main point you want readers to remember." },
        { key: "body", label: "Body", type: "text", initialValue: "Replace this starter copy with the details of your story." },
        { key: "linkLabel", label: "Link label", type: "string", initialValue: "About us" },
        { key: "linkHref", label: "Link URL", type: "url", initialValue: "/about/" },
      ],
    }),
    defineObject({
      name: "logoStrip",
      title: "Logo strip",
      type: "section",
      fields: [
        { key: "heading", label: "Heading", type: "string", initialValue: "Demo brands: choose your logo set" },
        { key: "logoSet", label: "Logo set", type: "reference", to: ["logoSet"], required: true, initialValue: { _ref: "logoSet:brands" } },
      ],
    }),
    defineObject({
      name: "workGrid",
      title: "Work grid",
      type: "section",
      fields: [
        { key: "heading", label: "Heading", type: "string", required: true, initialValue: "Showcase your work" },
        {
          key: "items",
          label: "Projects",
          type: "array",
          initialValue: [{ _key: "starterproject", image: "/demo/hero.jpg", alt: "Looking up between glass office towers toward an overcast sky", brand: "Your project name", caption: "Replace this with a short project description." }],
          items: [
            {
              type: "object",
              title: "Project",
              fields: [
                { key: "image", label: "Image", type: "image", required: true },
                { key: "alt", label: "Alt text", type: "string", required: true },
                { key: "brand", label: "Brand", type: "string", required: true },
                { key: "caption", label: "Caption", type: "string" },
              ],
            },
          ],
        },
      ],
    }),
    defineObject({
      name: "services",
      title: "Services",
      type: "section",
      fields: [
        { key: "heading", label: "Heading", type: "string", required: true, initialValue: "Introduce your services" },
        {
          key: "rows",
          label: "Service rows",
          type: "array",
          initialValue: [{ _key: "starterservice", title: "Your service name", subtitle: "A short service summary", body: "Describe what this service includes and who it helps." }],
          items: [
            {
              type: "object",
              title: "Service",
              fields: [
                { key: "title", label: "Title", type: "string", required: true },
                { key: "subtitle", label: "Subtitle", type: "string" },
                { key: "body", label: "Body", type: "text" },
              ],
            },
          ],
        },
      ],
    }),
    defineObject({
      name: "journal",
      title: "Journal",
      type: "section",
      fields: [
        { key: "heading", label: "Heading", type: "string", required: true, initialValue: "Stories from your journal" },
        { key: "linkLabel", label: "Link label", type: "string", initialValue: "Read the journal" },
        { key: "linkHref", label: "Link URL", type: "url", initialValue: "/blog/" },
      ],
    }),
    defineObject({
      name: "pageIntro",
      title: "Page introduction",
      type: "section",
      fields: [
        { key: "eyebrow", label: "Eyebrow", type: "string", initialValue: "New section" },
        { key: "title", label: "Heading", type: "string", required: true, initialValue: "Your introduction starts here" },
        { key: "body", label: "Lead", type: "text", initialValue: "Tell readers what this page is about. Replace this text with your introduction." },
      ],
    }),
    defineObject({
      name: "wideImage",
      title: "Wide image",
      type: "section",
      fields: [
        { key: "image", label: "Image", type: "image", required: true, initialValue: "/demo/hero.jpg" },
        { key: "alt", label: "Alt text", type: "string", required: true, initialValue: "Looking up between glass office towers toward an overcast sky" },
      ],
    }),
    defineObject({
      name: "story",
      title: "Story",
      type: "section",
      fields: [
        { key: "heading", label: "Heading", type: "string", required: true, initialValue: "Tell your story" },
        {
          key: "paragraphs",
          label: "Paragraphs",
          type: "array",
          initialValue: [{ _key: "starterparagraph", title: "Start at the beginning", text: "Replace this starter paragraph with the story you want to share." }],
          items: [{ type: "object", title: "Paragraph", fields: [{ key: "title", label: "Subheading", type: "string" }, { key: "text", label: "Text", type: "text", required: true }] }],
        },
      ],
    }),
    defineObject({
      name: "cta",
      title: "Call to action",
      type: "section",
      fields: [
        { key: "callout", label: "Callout", type: "reference", to: ["callout"], required: true, initialValue: { _ref: "callout:studio" } },
      ],
    }),
    defineObject({
      name: "contactDetails", title: "Contact details", type: "section",
      fields: [
        { key: "heading", label: "Heading", type: "string", required: true, initialValue: "Help readers get in touch" },
        { key: "email", label: "Email", type: "string", required: true, initialValue: "hello@rigel.example" },
        { key: "emailHref", label: "Email link", type: "url", required: true, initialValue: "mailto:hello@rigel.example" },
        { key: "notice", label: "Contact notice", type: "text", initialValue: "This demo address does not receive mail. Replace it and its email link with your contact details." },
        { key: "body", label: "Body", type: "text", initialValue: "Tell readers how to contact you and what to include in their message." },
        { key: "linkLabel", label: "Link label", type: "string", initialValue: "Explore services" },
        { key: "linkHref", label: "Link URL", type: "url", initialValue: "/services/" },
        { key: "image", label: "Image", type: "image", required: true, initialValue: "/demo/hero.jpg" },
        { key: "alt", label: "Image alt text", type: "string", required: true, initialValue: "Looking up between glass office towers toward an overcast sky" },
      ],
    }),
    defineObject({ name: "blogFeed", title: "Blog articles", type: "section", fields: [{ key: "heading", label: "Heading", type: "string", initialValue: "Journal articles" }] }),
    defineObject({ name: "newsFeed", title: "News articles", type: "section", fields: [{ key: "heading", label: "Heading", type: "string", initialValue: "Latest updates" }] }),
    defineObject({
      name: "articleText", title: "Article text", type: "section",
      fields: [
        { key: "title", label: "Heading", type: "string", required: true, initialValue: "Your article starts here" },
        { key: "intro", label: "Introduction", type: "text", initialValue: "Introduce the topic and give readers a reason to keep reading." },
        { key: "subheading", label: "Subheading", type: "string", initialValue: "Develop your idea" },
        { key: "body", label: "Body", type: "text", initialValue: "Replace this starter copy with your article, examples and supporting details." },
        { key: "linkLabel", label: "Link label", type: "string", initialValue: "Read more articles" },
        { key: "linkHref", label: "Link URL", type: "url", initialValue: "/blog/" },
        { key: "closing", label: "Closing text", type: "text", initialValue: "Leave readers with a useful takeaway or a next step." },
      ],
    }),
  ],
});

if (multilingual) {
  const page = schema.documents.find(document => document.name === "page")!;
  for (const locale of ["en", "fr"] as const) {
    const sections = locale === "en" ? ["pageIntro", "textBlock", "logoStrip"] : ["hero", "story", "logoStrip"];
    schema.documents.push(defineDocument({
      ...page,
      name: locale === "en" ? "pageEn" : "pageFr",
      title: locale === "en" ? "English pages" : "Pages françaises",
      locale,
      folder: `src/content/multilang/${locale}/pages`,
      protectedSlugs: locale === "en" ? ["welcome"] : ["welcome", "unpublished"],
      fields: page.fields.map(field => field.key === "sections" ? {
        ...field,
        items: sections.map(name => ({ type: "object" as const, name })),
      } : field),
      template: sections.map(type => ({ type })),
    }));
  }
}

for (const locale of [undefined, ...(multilingual ? ["en", "fr"] : [])]) {
  const page = schema.documents.find(document => document.name === "page")!;
  const french = locale === "fr";
  const sections = ["pageIntro", "articleText"];
  schema.documents.push(defineDocument({
    ...page,
    name: `legalPage${locale ? locale === "fr" ? "Fr" : "En" : ""}`,
    title: `Legal pages${locale ? ` (${locale})` : ""}`,
    category: "Legal",
    protectedSlugs: ["example"],
    ...(locale ? { locale } : {}),
    folder: locale ? `src/content/multilang/${locale}/legal` : "src/content/legal",
    fields: page.fields.map(field => field.key === "sections" ? {
      ...field,
      items: sections.map(name => ({ type: "object" as const, name })),
    } : field),
    template: [
      { type: "pageIntro", values: { eyebrow: "Legal", title: french ? "Informations légales" : "Legal information", body: french ? "Exemple de mise en page, à adapter avant publication." : "A layout example to adapt before publication." } },
      { type: "articleText", values: { title: french ? "À propos de cette page" : "About this page", intro: "", subheading: "", body: french ? "Remplacez cet exemple par vos propres informations légales." : "Replace this example with your own legal information.", linkLabel: "", linkHref: "", closing: "" } },
    ],
  }));
}

export default schema;

import type { Discipline } from "@/config/work";

export interface Service {
  /** Matches a discipline, so the service can link to the work it produced. */
  key: Discipline;
  title: string;
  /** One line on the homepage list. */
  summary: string;
  /** A paragraph on the services page. */
  description: string;
  deliverables: string[];
  /** The project whose cover floats beside this service on hover. */
  project: string;
}

export const services: Service[] = [
  {
    key: "identity",
    title: "Brand identity",
    summary: "Names, marks, type, colour and the rules that hold them together.",
    description:
      "We start with what a company believes and end with a system anyone on the team can use: a mark that works at sixteen pixels, a palette with a point of view, a typeface that sounds like the founders talking. Every identity ships with guidelines people actually open.",
    deliverables: [
      "Strategy and positioning",
      "Naming",
      "Logo and marque",
      "Typography and colour",
      "Brand guidelines",
      "Launch toolkit",
    ],
    project: "halden",
  },
  {
    key: "digital",
    title: "Digital",
    summary: "Websites and online shops built to be looked at, then used.",
    description:
      "Sites that load fast, read well and still feel like an event. We design and build in the same room, so motion, type and content decisions are made with the code open. We hand over a CMS your team can run without calling us.",
    deliverables: [
      "UX and content design",
      "Art direction",
      "Web design",
      "Front-end development",
      "E-commerce",
      "CMS and handover",
    ],
    project: "lumio",
  },
  {
    key: "packaging",
    title: "Packaging",
    summary: "Boxes, bottles and bags that win the shelf from two metres away.",
    description:
      "Packaging is a brand's loudest moment. We design ranges that hold together as a family and stand alone as single objects, working with printers and converters from the first sketch so the finish on the shelf matches the render.",
    deliverables: [
      "Range architecture",
      "Structural design",
      "Labels and finishes",
      "Print management",
      "Photography direction",
    ],
    project: "kitebird",
  },
  {
    key: "campaign",
    title: "Campaign",
    summary: "Art direction, photography and film for launches that travel.",
    description:
      "From one hero image to a season of content, we write the idea, cast it, shoot it and cut it for every format it will live in. One studio, one point of view, from the moodboard to the last six-second cut-down.",
    deliverables: [
      "Campaign concepts",
      "Art direction",
      "Photography",
      "Motion and film",
      "Social formats",
    ],
    project: "veldt",
  },
  {
    key: "spatial",
    title: "Spatial",
    summary: "Restaurants, hotels and shops where the brand becomes a room.",
    description:
      "When a brand needs walls, we work with architects and fit-out teams on the parts guests touch: signage, wayfinding, menus, uniforms, the colour of the grout. The space should feel like the identity before anyone reads a word.",
    deliverables: [
      "Interior concepts",
      "Signage and wayfinding",
      "Menus and print",
      "Uniforms and objects",
      "Opening campaigns",
    ],
    project: "ostra",
  },
];

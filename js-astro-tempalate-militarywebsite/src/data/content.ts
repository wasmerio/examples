/**
 * ============================================
 * PAGE CONTENT DATA
 * ============================================
 * All structured content for pages lives here.
 * Edit these arrays/objects to customize the template content.
 *
 * CUSTOMIZE: Replace placeholder images in src/assets/ with your own.
 */

// ── Image Imports ──────────────────────────────────────────
// CUSTOMIZE: Replace these images in src/assets/ with your own.
import fotoInfantri from "../assets/foto-infantri.jpg";
import tank from "../assets/alusista-tank.jpg";
import artilery from "../assets/artilery.jpg";
import congoMission from "../assets/congo-pbbmission.jpg";
import pbbMisi from "../assets/PBB-misicongo.jpg";
import rocketLauncher from "../assets/rocket-launcher.jpg";

// ── Hero Section ───────────────────────────────────────────
export const heroData = {
  /** Large heading text */
  heading: "[UNIT NAME]",
  /** Subtitle below the heading (also in i18n as hero.subtitle) */
  subtitle: "[UNIT SUBTITLE]",
  /** Description paragraph */
  description:
    "The primary operational command of your organization. Ready for rapid deployment across the nation.",
  /** CTA button labels (also in i18n) */
  cta1Label: "Our History",
  cta1Href: "/sejarah",
  cta2Label: "Organization",
  cta2Href: "/struktur",
};

// ── Division / Department Cards ────────────────────────────
export const divisions = [
  {
    title: "Division 1",
    location: "[City, Region]",
    description:
      "Commands operational units in the western region, including capital security operations.",
    iconType: "layers" as const,
    descKey: "card.div1.desc",
    descKeyStruktur: "card.div1.desc.struktur",
  },
  {
    title: "Division 2",
    location: "[City, Region]",
    description:
      "A division specializing in airborne and mechanized operations. Known as [Division Nickname].",
    iconType: "parachute" as const,
    descKey: "card.div2.desc",
    descKeyStruktur: "card.div2.desc.struktur",
  },
  {
    title: "Division 3",
    location: "[City, Region]",
    description:
      "The newest division, responsible for defense of the eastern territory.",
    iconType: "crosshair" as const,
    descKey: "card.div3.desc",
    descKeyStruktur: "card.div3.desc.struktur",
  },
];

// ── Timeline Events ────────────────────────────────────────
export const timelineEvents = [
  {
    year: "1961",
    titleKey: "timeline.1.title",
    descKey: "timeline.1.desc",
    tagKey: "timeline.1.tag",
    title: "[Original Name] Established",
    description:
      "Established by official decree as the first strategic reserve corps under the command of [First Commander Name].",
    tag: "FOUNDING",
  },
  {
    year: "1962",
    titleKey: "timeline.2.title",
    descKey: "timeline.2.desc",
    tagKey: "timeline.2.tag",
    title: "Operation [Name]",
    description:
      "Forces were directly involved in a major military operation for territorial integrity.",
    tag: "OPERATION",
  },
  {
    year: "1963",
    titleKey: "timeline.3.title",
    descKey: "timeline.3.desc",
    tagKey: "timeline.3.tag",
    title: "Official Renaming",
    description:
      "The unit was officially renamed to [Unit Name], marking a new era of organizational restructuring.",
    tag: "INAUGURATION",
  },
  {
    year: "1975",
    titleKey: "timeline.4.title",
    descKey: "timeline.4.desc",
    tagKey: "timeline.4.tag",
    title: "Operation [Name]",
    description:
      "Played a key role in border security operations and territorial integration.",
    tag: "OPERATION",
  },
  {
    year: "Now",
    titleKey: "timeline.5.title",
    descKey: "timeline.5.desc",
    tagKey: "timeline.5.tag",
    yearKey: "timeline.5.year",
    title: "Peacekeeping Missions",
    description:
      "Soldiers serve as part of international peacekeeping contingents in missions worldwide.",
    tag: "INTERNATIONAL",
  },
];

// ── Gallery Images ─────────────────────────────────────────
// CUSTOMIZE: Replace these images in src/assets/ with your own.
export const galleryImages = [
  {
    src: fotoInfantri.src,
    alt: "Soldiers in Combat Formation",
    i18n: "gallery.img1",
    span: "row-span-2 col-span-2",
  },
  {
    src: tank.src,
    alt: "Main Battle Tank",
    i18n: "gallery.img2",
    span: "row-span-1 col-span-1",
  },
  {
    src: artilery.src,
    alt: "Artillery Live Fire Exercise",
    i18n: "gallery.img3",
    span: "row-span-1 col-span-1",
  },
  {
    src: congoMission.src,
    alt: "Peacekeeping Mission",
    i18n: "gallery.img4",
    span: "row-span-2 col-span-2",
  },
  {
    src: pbbMisi.src,
    alt: "International Contingent",
    i18n: "gallery.img5",
    span: "row-span-1 col-span-1",
  },
  {
    src: rocketLauncher.src,
    alt: "Rocket Launcher System",
    i18n: "gallery.img6",
    span: "row-span-1 col-span-1",
  },
];

// ── History Page Chapters ──────────────────────────────────
// CUSTOMIZE: Replace these images in src/assets/ with your own.
export const historyChapters = [
  {
    year: "1961",
    yearI18nKey: undefined,
    titleI18nKey: "sejarah.ch1.title",
    titleHtml: 'The <span class="text-primary">Founding</span>',
    captionI18nKey: "sejarah.ch1.caption",
    caption: "International Contingent — [Location]",
    image: congoMission,
    imageAlt: "International contingent on a mission",
    paragraphs: [
      {
        i18nKey: "sejarah.ch1.p1",
        isHtml: false,
        text: "In the early 1960s, leadership recognized the need for a strategic reserve unit that could be rapidly deployed across the nation.",
      },
      {
        i18nKey: "sejarah.ch1.p2",
        isHtml: true,
        text: 'By official decree dated <strong class="text-base-content">[Date]</strong>, the <strong class="text-base-content">[Original Unit Name]</strong> was established. Its first commander was [Commander Name].',
      },
    ],
  },
  {
    year: "1963",
    yearI18nKey: undefined,
    titleI18nKey: "sejarah.ch2.title",
    titleHtml: 'Becoming <span class="text-primary">[UNIT NAME]</span>',
    captionI18nKey: "sejarah.ch2.caption",
    caption: "Artillery Live Fire Exercise",
    image: artilery,
    imageAlt: "Artillery exercise",
    paragraphs: [
      {
        i18nKey: "sejarah.ch2.p1",
        isHtml: true,
        text: 'On <strong class="text-base-content">[Date]</strong>, the name was officially changed to <strong class="text-base-content">[Full Official Name]</strong>. This renaming coincided with an organizational restructuring.',
      },
      {
        i18nKey: "sejarah.ch2.p2",
        isHtml: false,
        text: "Since then, the unit has served as one of the primary operational commands, conducting strategic-level operations.",
      },
    ],
  },
  {
    year: "Present",
    yearI18nKey: "sejarah.ch3.year",
    titleI18nKey: "sejarah.ch3.title",
    titleHtml: 'Modern <span class="text-primary">Equipment</span>',
    captionI18nKey: "sejarah.ch3.caption",
    caption: "[Equipment Name]",
    image: tank,
    imageAlt: "Modern military equipment",
    paragraphs: [
      {
        i18nKey: "sejarah.ch3.p1",
        isHtml: true,
        text: 'Today the unit operates modern equipment including <strong class="text-base-content">[main battle tanks]</strong>, self-propelled artillery, and multiple rocket launcher systems.',
      },
      {
        i18nKey: "sejarah.ch3.p2",
        isHtml: true,
        text: 'Beyond domestic defense, soldiers serve in <strong class="text-base-content">international peacekeeping missions</strong> in various countries.',
      },
    ],
  },
];

// ── Stats (Sejarah Page) ───────────────────────────────────
export const stats = [
  { value: "63+", labelI18nKey: "sejarah.stat1.label", label: "Years Active" },
  {
    value: "3",
    labelI18nKey: "sejarah.stat2.label",
    label: "Divisions",
  },
  {
    value: "40+",
    labelI18nKey: "sejarah.stat3.label",
    label: "Missions",
  },
  { value: "∞", label: "[Unit Motto]" },
];

// ── Commander Info (Struktur Page) ─────────────────────────
export const commanderInfo = {
  titleI18nKey: "struktur.cmd.title",
  title: "[Unit Name] Commander",
  descI18nKey: "struktur.cmd.desc",
  description:
    "The Commander holds the rank of [Rank] and reports directly to [Superior]. Under the Commander are the Deputy Commander, Chief of Staff, and specialized staff sections.",
  subunits: [
    { i18nKey: "struktur.cmd.list1", text: "— Inspectorate" },
    {
      i18nKey: "struktur.cmd.list2",
      text: "— General Staff (Intel, Ops, Personnel, Logistics, Planning)",
    },
    {
      i18nKey: "struktur.cmd.list3",
      text: "— Support Units (Adjutant General, Signal, Ordnance, etc.)",
    },
  ],
  badgeI18nKey: "struktur.cmd.badge",
  badgeText: "Chain of Command",
};

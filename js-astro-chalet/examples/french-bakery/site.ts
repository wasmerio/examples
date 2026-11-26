// ============================================================================
// EXEMPLE FRANÇAIS — configuration complète en français pour Chalet.
// Remplace src/config/site.ts par ce fichier pour un site 100 % français.
// (Les clés restent en anglais : seuls les contenus changent.)
// ============================================================================

export const SITE = {
  // --- Identité & URLs -------------------------------------------------------
  url: "https://www.fournee-des-aiguilles.example.com", // SANS slash final
  lang: "fr",
  ogLocale: "fr_FR",
  name: "La Fournée des Aiguilles",
  tagline: "Boulangerie-pâtisserie artisanale au pied du Mont-Blanc",
  description:
    "Boulangerie-pâtisserie artisanale à Chamonix : pains au levain, viennoiseries pur beurre et pâtisseries maison, tous les jours dès 6h30.",

  // --- Entreprise (alimente le JSON-LD LocalBusiness) ------------------------
  business: {
    schemaType: "Bakery",
    phone: "+33450000000",
    email: "bonjour@fournee-des-aiguilles.example.com",
    address: {
      street: "12 rue du Docteur Paccard",
      postalCode: "74400",
      city: "Chamonix-Mont-Blanc",
      country: "FR",
    },
    geo: { latitude: 45.9219, longitude: 6.8696 },
    priceRange: "€",
    googleBusinessUrl: "https://maps.google.com/?cid=EXEMPLE",
    socialProfiles: [
      "https://www.instagram.com/exemple",
      "https://www.facebook.com/exemple",
    ],
  },

  // --- Horaires (affichés sur le site ET injectés dans le JSON-LD) -----------
  openingHours: [
    { label: "Lundi", days: [0], opens: "06:30", closes: "19:00" },
    { label: "Mardi", days: [1], opens: "06:30", closes: "19:00" },
    { label: "Mercredi", days: [2], closed: true },
    { label: "Jeudi", days: [3], opens: "06:30", closes: "19:00" },
    { label: "Vendredi", days: [4], opens: "06:30", closes: "19:00" },
    { label: "Samedi", days: [5], opens: "06:30", closes: "19:30" },
    { label: "Dimanche", days: [6], opens: "07:00", closes: "13:00" },
  ] as OpeningHours[],

  // --- Navigation --------------------------------------------------------------
  navigation: [
    { label: "Nos produits", href: "/#services" },
    { label: "La maison", href: "/#about" },
    { label: "Galerie", href: "/#gallery" },
    { label: "Avis", href: "/#reviews" },
    { label: "Infos pratiques", href: "/#info" },
    { label: "Contact", href: "/#contact" },
  ],

  // --- Section héro --------------------------------------------------------------
  hero: {
    // "immersive" = photo plein écran derrière un voile sombre (photo large
    //               et atmosphérique ≥ 1600 px). "split" = texte à gauche,
    //               photo encadrée à droite (gros plan produit).
    layout: "immersive" as "immersive" | "split",
    title: "Le vrai goût du pain, à Chamonix",
    // Portion du titre affichée en italique accentué ("" pour désactiver)
    titleHighlight: "Chamonix",
    subtitle:
      "Levain naturel, farines de meule et pâtisseries maison, préparés chaque nuit dans notre fournil du centre-ville.",
    image: "/images/hero.webp",
    imageAlt: "Pain au levain tout juste cuit, présenté sur un linge",
    primaryCta: { label: "Voir nos produits", href: "/#services" },
    secondaryCta: { label: "Nous trouver", href: "/#info" },
    // Badges de confiance sous les boutons (2 à 4 éléments courts)
    highlights: ["★ 4,7 sur Google", "Maison familiale depuis 1987", "Chaud dès 6 h 30"],
  },

  // --- Services / produits ---------------------------------------------------------
  services: {
    eyebrow: "Notre savoir-faire",
    title: "Nos produits",
    intro: "Tout est pétri, façonné et cuit sur place, chaque jour.",
    items: [
      {
        title: "Pains au levain",
        description:
          "Tourte de meule, campagne, graines ou nature : fermentation lente de 24 h pour un pain qui se garde toute la semaine.",
        icon: "bread",
      },
      {
        title: "Viennoiseries pur beurre",
        description:
          "Croissants, pains au chocolat et brioches feuilletées au beurre AOP Charentes-Poitou, cuits en continu jusqu'à midi.",
        icon: "croissant",
      },
      {
        title: "Pâtisseries maison",
        description:
          "Tartes aux fruits de saison, éclairs et notre fameux mont-blanc à la crème de marrons d'Ardèche.",
        icon: "cake",
      },
      {
        title: "Snacking du midi",
        description:
          "Sandwichs baguette tradition, fougasses et quiches, parfaits à glisser dans le sac avant de monter en télécabine.",
        icon: "sandwich",
      },
    ],
  },

  // --- À propos ----------------------------------------------------------------------
  about: {
    eyebrow: "Depuis 1987",
    title: "La maison",
    paragraphs: [
      "Installée rue du Docteur Paccard depuis 1987, La Fournée des Aiguilles est tenue par la famille Ravanel depuis trois générations. Nous travaillons exclusivement des farines de meule des Alpes et un levain que nous entretenons depuis plus de trente ans.",
      "Été comme hiver, le fournil s'allume à 3 h du matin pour que guides, saisonniers et familles trouvent du pain chaud dès l'ouverture.",
    ],
    image: "/images/about.webp",
    imageAlt: "Le fournil et son four à sole",
  },

  // --- Galerie ---------------------------------------------------------------------------
  gallery: {
    eyebrow: "Côté fournil",
    title: "En images",
    // La première image est mise en avant (2×2) : 5 ou 7 images remplissent
    // parfaitement la grille sur grand écran.
    images: [
      { src: "/images/gallery-1.webp", alt: "Étagères en bois remplies de tourtes rustiques" },
      { src: "/images/gallery-2.webp", alt: "Croissants dorés dans la vitrine" },
      { src: "/images/gallery-3.webp", alt: "Éclairs et choux alignés au comptoir pâtisserie" },
      { src: "/images/gallery-4.webp", alt: "La devanture verte de la boutique" },
      { src: "/images/gallery-5.webp", alt: "Le boulanger présente une tourte croustillante" },
    ],
  },

  // --- Avis clients -------------------------------------------------------------------------
  reviews: {
    eyebrow: "Avis clients",
    title: "Ils en parlent mieux que nous",
    allReviewsUrl: "https://maps.google.com/?cid=EXEMPLE",
    items: [
      {
        author: "Marie L.",
        rating: 5,
        text: "Le meilleur pain de la vallée, sans hésiter. La tourte de meule se garde une semaine et le mont-blanc est une tuerie.",
      },
      {
        author: "Thomas B.",
        rating: 5,
        text: "Ouvert tôt, parfait avant de partir en course. Les sandwichs à la baguette tradition sont copieux et le café est bon.",
      },
      {
        author: "Elena K.",
        rating: 4,
        text: "Wonderful bakery, authentic sourdough bread. A bit of a queue on Saturday mornings but absolutely worth it.",
      },
    ],
  },

  // --- FAQ -------------------------------------------------------------------------------------
  faq: {
    eyebrow: "Bon à savoir",
    title: "Questions fréquentes",
    items: [
      {
        question: "Proposez-vous des pains spéciaux sur commande ?",
        answer:
          "Oui : pains de seigle, sans gluten (four dédié le mardi) et grosses pièces pour les restaurants et refuges, sur commande 48 h à l'avance par téléphone.",
      },
      {
        question: "Peut-on commander un gâteau d'anniversaire ou de mariage ?",
        answer:
          "Bien sûr. Comptez une semaine de délai pour les pièces montées et gâteaux personnalisés. Passez nous voir en boutique pour définir le projet.",
      },
      {
        question: "Êtes-vous ouverts pendant l'intersaison ?",
        answer:
          "Oui, toute l'année sauf le mercredi et trois semaines en novembre. Les dates de congés sont affichées en boutique et sur notre fiche Google.",
      },
      {
        question: "Où se garer pour venir à la boulangerie ?",
        answer:
          "Le parking du Mont-Blanc est à 3 minutes à pied. Une zone de dépose-minute se trouve juste devant la boutique, rue du Docteur Paccard.",
      },
    ],
  },

  // --- Bandeau d'appel à l'action -------------------------------------------------------------------
  ctaBanner: {
    title: "Une commande pour un événement ?",
    text: "Buffets, mariages, séminaires ou ravitaillement de refuge : écrivez-nous, nous préparons un devis sous 24 h.",
    button: { label: "Demander un devis", href: "/#contact" },
  },

  // --- Formulaire de contact ---------------------------------------------------------------------------
  contact: {
    eyebrow: "Contact",
    title: "Écrivez-nous",
    intro:
      "Une question, une commande spéciale ? Laissez-nous un message, nous répondons sous 24 h ouvrées.",
    endpoint: "",
    // "site-web" = le nom attendu par certains backends francophones ;
    // garde la même valeur que ton backend anti-spam.
    honeypotField: "site-web",
  },

  // --- Pages légales -------------------------------------------------------------------------------------
  legal: {
    companyType: "SARL au capital de 10 000 €",
    registrationNumber: "000 000 000 00000",
    publisher: "Jeanne Ravanel",
    host: {
      name: "Vercel Inc.",
      address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
      url: "https://vercel.com",
    },
  },

  // --- Textes d'interface ------------------------------------------------------------------------------------
  ui: {
    skipToContent: "Aller au contenu",
    menuOpenLabel: "Ouvrir le menu",
    closedLabel: "Fermé",
    hoursTitle: "Horaires d'ouverture",
    findUsTitle: "Nous trouver",
    infoEyebrow: "Pratique",
    infoTitle: "Infos pratiques",
    directionsLabel: "Itinéraire Google Maps",
    googleProfileLabel: "Notre fiche Google",
    readAllReviews: "Lire tous les avis sur Google →",
    ratingLabel: "Note :",
    ratingOutOf: "sur 5",
    reviewsScoreLabel: "d'après les avis Google",
    formNameLabel: "Votre nom",
    formEmailLabel: "Votre email",
    formMessageLabel: "Votre message",
    formSubmitLabel: "Envoyer le message",
    formHoneypotLabel: "Ne pas remplir ce champ",
    legalNoticeLabel: "Mentions légales",
    privacyPolicyLabel: "Politique de confidentialité",
    allRightsReserved: "Tous droits réservés",
    notFoundTitle: "Page introuvable",
    notFoundText: "La page que vous cherchez n'existe pas ou a été déplacée.",
    notFoundCta: "Retour à l'accueil",
  },
} as const;

// --- Types utilitaires ---------------------------------------------------------------------------------------
export interface OpeningHours {
  label: string;
  days: number[];
  opens?: string;
  closes?: string;
  closed?: boolean;
}

export type SiteConfig = typeof SITE;

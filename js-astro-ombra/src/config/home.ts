export const homeContent = {
  hero: {
    eyebrow: "Tasting Counter - Twelve Seats",
    title: ["We cook", "with the dark", "and a little fire."],
    body: "Ombra is a counter for twelve, hidden behind an unmarked door in the old quarter. One menu. One season. One fire at the centre of the room.",
    action: "Reserve a seat",
  },
  marquee: [
    "Embers",
    "Ash Butter",
    "Night Herbs",
    "Fermentation",
    "Wild Orchard",
    "Charred Citrus",
    "Cellar Smoke",
    "Tidewater",
    "Old Grain",
    "Candle Wax",
  ],
  concept: {
    eyebrow: "01 - Concept",
    heading: ["A room held together", "by heat, by hands,", "by the quiet between courses."],
    body: [
      "We do not write a menu. We listen to the week: to the market, the boats, the orchard outside town, and we cook what is most alive that night. The fire is the only constant.",
      "Service is slow on purpose. Twelve guests, one pass, one pace. You will meet the cooks, watch the embers fall, and stay for three hours without noticing.",
    ],
    caption: "Fig. 01 - Vessel, raku, 2026",
    quote: "The fire is older than the recipe. We only translate.",
    quoteByline: "Elia Marchetti, Chef",
  },
  tasting: {
    eyebrow: "02 - Tasting",
    heading: ["Six movements,", "one evening,", "written that morning."],
    note: "EUR245 per guest, six courses. Wine pairing EUR165, non-alcoholic EUR85. Service begins at 19:30, sharp.",
    caption: "Mise - week 47",
    courses: [
      {
        number: "I",
        title: "First Light",
        accent: "of the orchard",
        body: "Quince, raw cream, bitter almond, a whisper of smoke from the morning's first coals.",
        pairing: "Cider - Asturias, 2022",
      },
      {
        number: "II",
        title: "Tide",
        accent: "after the storm",
        body: "Day-boat langoustine, fennel pollen, the brine of its own shell reduced to glass.",
        pairing: "Albarino - Rias Baixas, 2021",
      },
      {
        number: "III",
        title: "The Ember",
        accent: "kept overnight",
        body: "Heirloom beet buried in ash since dawn, aged sheep's butter, sourdough crust.",
        pairing: "Trousseau - Jura, 2020",
      },
      {
        number: "IV",
        title: "An Animal,",
        accent: "patiently",
        body: "Forty-day lamb shoulder cooked beside the fire, charred allium, fermented plum.",
        pairing: "Mencia - Bierzo, 2018",
      },
      {
        number: "V",
        title: "Field, Burnt",
        accent: "and cooled",
        body: "Toasted grain ice, hazelnut praline, a cold pour of single-estate olive oil.",
        pairing: "PX - Montilla, 1998",
      },
      {
        number: "VI",
        title: "Last Word",
        accent: "",
        body: "Bitter chocolate, fig leaf, salt from the cliffs at Llanes.",
        pairing: "Genever - house infusion",
      },
    ],
  },
  chef: {
    eyebrow: "03 - The Chef",
    heading: {
      line1: "Elia Marchetti.",
      accent: "A quiet cook,",
      rest: "a patient room.",
    },
    quote:
      "I learned to cook from my grandmother, who never owned a thermometer and never made the same dish twice.",
    timeline: [
      { year: "1986", text: "Born in Pollenzo, between vineyards and his grandmother's hearth." },
      { year: "2008", text: "Stages at Mugaritz and Etxebarri. Learns the discipline of fire." },
      { year: "2014", text: "Opens Ombra with twelve seats and no sign on the door." },
      { year: "2019", text: "First star. Refuses to expand. Closes Sundays and Mondays." },
      { year: "2024", text: "Second star. Same twelve seats. Same fire." },
    ],
  },
  interior: {
    eyebrow: "04 - Sala",
    heading: {
      lead: "Terracotta walls,",
      accent: "one candle,",
      rest: "oak older than the city.",
    },
    features: [
      {
        title: "Materials",
        body: "Hand-troweled lime plaster in burnt sienna. Reclaimed oak beams from a 17th-century granary. Cast iron, smoked glass, raw linen.",
      },
      {
        title: "Light",
        body: "Two sources only: the hearth at the centre of the counter, and a single tall taper at each setting. The room is never brighter than the food.",
      },
      {
        title: "Sound",
        body: "A custom playlist by composer Luis Tinoco. Strings, breath, the long pause. No screens, no notifications, no announcements.",
      },
    ],
  },
  reservation: {
    eyebrow: "05 - Reserve",
    heading: ["Twelve seats.", "Two seatings.", "One evening at a time."],
    body: "Bookings open the first Monday of each month for the following month. A deposit of EUR100 per guest secures your seat and is fully credited to your bill.",
    formTitle: "Request a table",
    confirmation: "We confirm every request personally within 24 hours.",
  },
  footer: {
    tagline: "A counter for twelve, behind an unmarked door in the old quarter.",
    signal: "The fire is lit.",
  },
} as const;

export type HomeContent = typeof homeContent;

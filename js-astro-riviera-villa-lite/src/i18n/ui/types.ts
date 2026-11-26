/**
 * Interface texts of the theme (menus, labels, form messages...).
 * Texts about the villa itself live in `villa.config.ts`.
 */
export interface SectionTitle {
  eyebrow: string;
  title: string;
}

export interface UiStrings {
  skipToContent: string;
  nav: {
    gallery: string;
    rates: string;
    reviews: string;
    availability: string;
    book: string;
    bookShort: string;
    menu: string;
    close: string;
    language: string;
    /** Label of the language button, e.g. "Language: Français". */
    currentLanguage: (name: string) => string;
    mainMenu: string;
  };
  bar: {
    label: string;
    arrival: string;
    departure: string;
    guests: string;
    addDate: string;
    search: string;
  };
  trust: {
    reviewsOn: (count: number, source: string) => string;
    from: string;
    perNight: string;
    bedrooms: (n: number) => string;
    guests: (n: number) => string;
    noFees: string;
  };
  sections: {
    gallery: SectionTitle;
    bedrooms: SectionTitle;
    amenities: SectionTitle;
    rates: SectionTitle;
    reviews: SectionTitle;
    availability: SectionTitle & { intro: string };
    booking: SectionTitle & { intro: string };
    faq: SectionTitle;
    rules: SectionTitle;
  };
  house: {
    eyebrow: string;
  };
  area: {
    eyebrow: string;
    openMap: string;
  };
  gallery: {
    open: (index: number, total: number) => string;
    dialogLabel: string;
    close: string;
    previous: string;
    next: string;
    counter: (index: number, total: number) => string;
  };
  rates: {
    season: string;
    nightly: string;
    minStayLabel: string;
    minStay: (nights: number) => string;
    extras: string;
    touristTax: string;
    payment: string;
    checkInOut: (checkIn: string, checkOut: string) => string;
  };
  reviews: {
    outOf: string;
    basedOn: (count: number, source: string) => string;
    stayed: (month: string) => string;
  };
  calendar: {
    previous: string;
    next: string;
    available: string;
    booked: string;
    selected: string;
    past: string;
    updated: (when: string) => string;
    chooseArrival: string;
    chooseDeparture: (arrival: string) => string;
    selection: (arrival: string, departure: string, nights: number) => string;
    clear: string;
    bookTheseDates: string;
    rangeUnavailable: string;
    noScript: string;
  };
  form: {
    arrival: string;
    departure: string;
    adults: string;
    children: string;
    name: string;
    email: string;
    phone: string;
    optional: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    sending: string;
    successTitle: string;
    successText: string;
    errorTitle: string;
    errorText: string;
    fallbackTitle: string;
    noScript: string;
    fallbackText: string;
    required: string;
    invalidEmail: string;
    departureAfterArrival: string;
    arrivalInPast: string;
    tooManyGuests: (max: number) => string;
    minNights: (nights: number, season: string) => string;
    datesTaken: string;
    whatsapp: string;
    emailUs: string;
    privacyNote: string;
    privacyLink: string;
    perksTitle: string;
    perks: string[];
    summary: (nights: number, guests: number) => string;
    requestSubject: (villa: string, arrival: string, departure: string) => string;
    requestIntro: string;
  };
  rules: {
    checkIn: string;
    checkOut: string;
  };
  footer: {
    contact: string;
    legal: string;
    privacy: string;
    registration: string;
    languages: string;
    rights: (year: number, name: string) => string;
    madeWith: string;
  };
  notFound: {
    title: string;
    text: string;
    back: string;
  };
  common: {
    nights: (n: number) => string;
    adults: (n: number) => string;
    children: (n: number) => string;
    guests: (n: number) => string;
  };
}

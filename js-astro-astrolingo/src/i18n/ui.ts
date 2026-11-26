// THIS FILE IS FOR LANGUAGE DEFAULTS AND TOP-LEVEL NAVIGATION

// IMPORTS
import type { Multi, Links } from "@types"


// ALL LANGUAGES
export const languages: Multi = {
  en: 'English',
  es: 'Español',
  fi: 'Suomi',
};


// DEFAULT LANGUAGE
export const defaultLang = 'en';

// COLLECTION NAMES
export const listOfCollections = ["blog"]

// TOP-LEVEL NAVIGATION
//
// Each entry requires:
//  - TEXT (to render in menus)
//  - HREF (where link points to)
//  - LANGUAGES (array) (languages where item will show)
//    - E.g.
//      - `languages: ["es"]` => item shows only on "es" version of site.
//      - `languages: ["es", "en"]` => item shows on "es" and "en" versions of site.

export const navLinks: Links = [
  {
    text: "Home",
    href: "/",
    languages: ["en"]
  },
  {
    text: "Inicio",
    href: "/",
    languages: ["es"]
  },
  {
    text: "Etusivu",
    href: "/",
    languages: ["fi"]
  },
  {
    text: "Blog",
    href: "/blog",
    languages: ["en", "es", "fi"]
  },
  {
    text: "About",
    href: "/about",
    languages: ["en"]
  },
  {
    text: "Acerca",
    href: "/acerca",
    languages: ["es"]
  },
  {
    text: "Minusta",
    href: "/minusta",
    languages: ["fi"]
  },
]


// MISC STRINGS USED ACROSS WEBSITE
// Strings for OG spaces in header
export const ogStrings: Multi = {
  en: "en_GB",
  es: "es_ES",
  fi: "fi_FI"
}
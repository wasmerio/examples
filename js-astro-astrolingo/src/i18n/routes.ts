import type { Multi } from "@types"
// Routes to re-direct users to equivalent page when they change language using language picker

// Pattern !!!
//
// routes = { 
//  { lang_1: slug, lang_2: slug, ..., lang_N: slug }  // For top-level pages
//  { lang_1: collection/slug, lang_2: collection/slug, ..., lang_N: collection/slug } // For any page inside a collection
//  ...
// }

// Note.
// You only need to add a route when page has a different slug in some languages.
// If the slug is the same across **all** languages, redirection happens automatically.

export const routes: Multi[] = [
  { en: "about", es: "acerca", fi: "minusta" },  // Top-level page equivalence
  { en: "one", es: "uno", fi: "yksi" },  // Blog equivalence
  { en: "two", es: "dos", fi: "kaksi" },  // Blog equivalence
  { en: "three", es: "tres", fi: "kolme" },  // Blog equivalence
  { en: "four", es: "cuatro", fi: "nelja" },  // Blog equivalence
  { en: "five", es: "cinco", fi: "viisi" },  // Blog equivalence
  { en: "coding", es: "programación", fi: "koodaus" },  // Tag equivalence
  { en: "movies", es: "cine", fi: "elokuvia" },  // Tag equivalence
  { en: "life", es: "vida", fi: "elämää" },  // Tag equivalence
  { en: "languages", es: "idiomas", fi: "kieliä" },  // Tag equivalence
]
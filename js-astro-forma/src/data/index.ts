import companyJson from './global/company.json';
import cookieConsentJson from './global/cookie-consent.json';
import floatingBarJson from './global/floating-bar.json';
import formMessagesJson from './global/form-messages.json';
import legalJson from './global/legal.json';
import lightboxJson from './global/lightbox.json';
import seoJson from './global/seo.json';
import siteJson from './global/site.json';
import breadcrumbsJson from './navigation/breadcrumbs.json';
import footerJson from './navigation/footer.json';
import headerJson from './navigation/header.json';
import ctaJson from './sections/cta.json';
import heroJson from './sections/hero.json';
import servicesJson from './sections/services.json';
import testimonialsJson from './sections/testimonials.json';
import privacyPageJson from './pages/privacy-policy.json';
import {
  companySchema,
  cookieConsentSchema,
  ctaSectionSchema,
  floatingBarSchema,
  footerSchema,
  formMessagesSchema,
  headerSchema,
  heroSchema,
  legalSchema,
  lightboxSchema,
  pageSchema,
  seoSchema,
  servicesSchema,
  siteSchema,
  testimonialsSchema,
  breadcrumbsSchema,
} from './schemas';

// Parse content at build time so a malformed JSON file fails with a useful error.
export const site = siteSchema.parse(siteJson);
export const company = companySchema.parse(companyJson);
export const seo = seoSchema.parse(seoJson);
export const cookieConsent = cookieConsentSchema.parse(cookieConsentJson);
export const floatingBar = floatingBarSchema.parse(floatingBarJson);
export const formMessages = formMessagesSchema.parse(formMessagesJson);
export const legal = legalSchema.parse(legalJson);
export const lightbox = lightboxSchema.parse(lightboxJson);
export const breadcrumbs = breadcrumbsSchema.parse(breadcrumbsJson);
export const header = headerSchema.parse(headerJson);
export const footer = footerSchema.parse(footerJson);
export const hero = heroSchema.parse(heroJson);
export const services = servicesSchema.parse(servicesJson);
export const testimonials = testimonialsSchema.parse(testimonialsJson);
export const cta = ctaSectionSchema.parse(ctaJson);
export const privacyPage = pageSchema.parse(privacyPageJson);

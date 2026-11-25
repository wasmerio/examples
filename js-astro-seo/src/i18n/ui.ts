/**
 * Translation dictionaries for UI strings.
 *
 * Usage:
 *   import { getLangFromUrl, useTranslations } from '../i18n/utils';
 *   const lang = getLangFromUrl(Astro.url);
 *   const t = useTranslations(lang);
 *   t('nav.features') // => "Features" or "Características"
 */

export const languages = {
  en: 'English',
  es: 'Español',
} as const;

export const defaultLang = 'en' as const;

export type Lang = keyof typeof languages;

export const ui = {
  en: {
    // Navigation
    'nav.product': 'Product',
    'nav.resources': 'Resources',
    'nav.features': 'Features',
    'nav.featuresDesc': 'Learn about our core capabilities.',
    'nav.pricing': 'Pricing',
    'nav.pricingDesc': 'Simple and transparent pricing.',
    'nav.blog': 'Blog',
    'nav.blogDesc': 'Latest news and industry insights.',
    'nav.caseStudies': 'Case Studies',
    'nav.caseStudiesDesc': 'See how other companies succeed.',
    'nav.docs': 'Documentation',
    'nav.docsDesc': 'Guides, tutorials, and API reference.',
    'nav.about': 'About',
    'nav.contact': 'Contact',

    // Hero
    'hero.badge': 'v1.0 is now live',
    'hero.titleStart': 'The SEO Theme',
    'hero.titleHighlight': 'Your SaaS Deserves',
    'hero.description':
      'Advanced technical SEO, GEO & AEO optimization out of the box. Lighthouse 100/100. Built with Astro, Tailwind & React.',
    'hero.primaryCta': 'Get Started on GitHub',
    'hero.secondaryCta': 'Read the Docs',

    // Bento Grid
    'bento.title': 'Everything you need to rank higher',
    'bento.subtitle': 'Built from the ground up for technical SEO and modern AI search engines.',

    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.description': 'Everything you need to know about the product and billing.',

    // Footer
    'footer.navigation': 'Footer navigation',
    'footer.product': 'Product',
    'footer.resources': 'Resources',
    'footer.company': 'Company',
    'footer.documentation': 'Documentation',
    'footer.rssFeed': 'RSS Feed',
    'footer.license': 'License (MIT)',
    'footer.copyright':
      'Astro SEO Theme Crafted by <a href="https://davidrueda.vercel.app/" target="_blank" rel="noopener noreferrer" class="hover:text-[var(--text-primary)] transition-colors">druedaro</a>.',
    'footer.builtWith': 'Built with',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.termsOfService': 'Terms of Service',

    // Contact Page
    'contact.title': "Let's talk about your project",
    'contact.description':
      'Whether you need a custom implementation, have questions about our open-source offering, or just want to say hi, our team is ready to help.',
    'contact.formTitle': 'Send us a message',
    'contact.firstName': 'First name',
    'contact.lastName': 'Last name',
    'contact.email': 'Company email',
    'contact.message': 'How can we help?',
    'contact.submit': 'Send Message',
    'contact.emailLabel': 'Email',
    'contact.phoneLabel': 'Phone',
    'contact.hqLabel': 'Headquarters',

    // About Page
    'about.title': 'About Us',
    'about.subtitle': 'Building the ultimate open-source SEO theme for Astro.',
    'about.missionTitle': 'Our Mission',
    'about.missionText':
      "We believe that technical SEO shouldn't be an afterthought. It should be baked into the foundation of every marketing website. That's why we created Astro SEO Theme—to provide a robust, lightning-fast starting point for B2B SaaS companies.",
    'about.openSourceTitle': 'Open Source',
    'about.openSourceText':
      'This project is 100% open-source and free to use under the MIT license. We encourage contributions from the community to help make this the best SEO template available.',

    // Misc
    skipToContent: 'Skip to main content',
    lastUpdated: 'Last updated',
  },
  es: {
    // Navigation
    'nav.product': 'Producto',
    'nav.resources': 'Recursos',
    'nav.features': 'Características',
    'nav.featuresDesc': 'Descubre nuestras funciones principales.',
    'nav.pricing': 'Precios',
    'nav.pricingDesc': 'Planes simples y transparentes.',
    'nav.blog': 'Blog',
    'nav.blogDesc': 'Últimas noticias y artículos.',
    'nav.caseStudies': 'Casos de Éxito',
    'nav.caseStudiesDesc': 'Mira cómo otras empresas tienen éxito.',
    'nav.docs': 'Documentación',
    'nav.docsDesc': 'Guías, tutoriales y referencia.',
    'nav.about': 'Nosotros',
    'nav.contact': 'Contacto',

    // Hero
    'hero.badge': 'v1.0 disponible',
    'hero.titleStart': 'El Tema SEO',
    'hero.titleHighlight': 'Que Tu SaaS Merece',
    'hero.description':
      'SEO técnico avanzado, optimización GEO y AEO incluidos. Lighthouse 100/100. Construido con Astro, Tailwind y React.',
    'hero.primaryCta': 'Empezar en GitHub',
    'hero.secondaryCta': 'Leer la Documentación',

    // Bento Grid
    'bento.title': 'Todo lo que necesitas para posicionar mejor',
    'bento.subtitle': 'Construido desde cero para SEO técnico y motores de búsqueda con IA.',

    // FAQ
    'faq.title': 'Preguntas Frecuentes',
    'faq.description': 'Todo lo que necesitas saber sobre el producto y la facturación.',

    // Footer
    'footer.navigation': 'Navegación del pie de página',
    'footer.product': 'Producto',
    'footer.resources': 'Recursos',
    'footer.company': 'Empresa',
    'footer.documentation': 'Documentación',
    'footer.rssFeed': 'Feed RSS',
    'footer.license': 'Licencia (MIT)',
    'footer.copyright':
      'Astro SEO Theme Creado por <a href="https://davidrueda.vercel.app/" target="_blank" rel="noopener noreferrer" class="hover:text-[var(--text-primary)] transition-colors">druedaro</a>.',
    'footer.builtWith': 'Hecho con',
    'footer.privacyPolicy': 'Política de Privacidad',
    'footer.termsOfService': 'Términos de Servicio',

    // Contact Page
    'contact.title': 'Hablemos de tu proyecto',
    'contact.description':
      'Ya sea que necesites una implementación personalizada, tengas preguntas sobre nuestra oferta open-source o simplemente quieras saludar, nuestro equipo está listo para ayudarte.',
    'contact.formTitle': 'Envíanos un mensaje',
    'contact.firstName': 'Nombre',
    'contact.lastName': 'Apellidos',
    'contact.email': 'Email corporativo',
    'contact.message': '¿Cómo podemos ayudarte?',
    'contact.submit': 'Enviar Mensaje',
    'contact.emailLabel': 'Email',
    'contact.phoneLabel': 'Teléfono',
    'contact.hqLabel': 'Sede Central',

    // About Page
    'about.title': 'Sobre Nosotros',
    'about.subtitle': 'Creando el tema SEO open-source definitivo para Astro.',
    'about.missionTitle': 'Nuestra Misión',
    'about.missionText':
      'Creemos que el SEO técnico no debería ser una ocurrencia tardía. Debería estar integrado en los cimientos de cada sitio web de marketing. Por eso creamos Astro SEO Theme: para proporcionar un punto de partida robusto y ultrarrápido para empresas B2B SaaS.',
    'about.openSourceTitle': 'Código Abierto',
    'about.openSourceText':
      'Este proyecto es 100% open-source y de uso gratuito bajo la licencia MIT. Fomentamos las contribuciones de la comunidad para ayudar a convertir esto en la mejor plantilla SEO disponible.',

    // Misc
    skipToContent: 'Saltar al contenido principal',
    lastUpdated: 'Última actualización',
  },
} as const;

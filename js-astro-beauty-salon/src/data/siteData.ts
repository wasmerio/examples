
// --- IMPORTACIONES DE LA LÓGICA DE NEGOCIO ---
import { priceList } from './priceList';
import { catalogsBank } from './catalogs';
import { promotionsBank } from './promotions';
import { statusBank } from './statusOptions';

export const siteData = {
  info: {
    title: "Beauty Salon",
    subtitle: "Professional Hair & Aesthetics",
    lema: "Reveal your true beauty",
    author: "Beauty Studio",
    description: "Professional Beauty Salon Template created with Astro and TailwindCSS.",
    
    // DATOS DE CONTACTO FICTICIOS
    phone: "+1 (555) 123-4567",
    email: "contact@demo-salon.com",
    whatsappLink: "https://wa.me/15551234567",
    address: "123 Fashion Avenue, Design District, NY",
    
    // MAPAS
    mapUrl: "https://goo.gl/maps/placeholder",
    mapEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1!2d-73.98!3d40.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzAwLjAiTiA3M8KwNTgnNDguMCJX!5e0!3m2!1sen!2sus!4v1600000000000!5m2!1sen!2sus",
    
    // 🔒 AUTORÍA LMK STUDIO (INTOCABLE)
    dev: "LMK Studio",
    devAuthor: "LeoMartinK Studio",
    devUrl: "https://lmkstudio.pages.dev"
  },
  social: {
    instagram: "https://instagram.com/demo_salon",
    facebook: "https://facebook.com/demo_salon"
  },
  schedule: [
    { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
    { day: "Sunday", hours: "Closed" }
  ],
  navigation: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/servicios" },
    { label: "Catalogs", href: "/links" },
    { label: "Contact", href: "/contacto" }
  ],

  // --- LÓGICA DE NEGOCIO CONECTADA ---
  status: statusBank.find(s => s.active) || statusBank[0],
  promo: promotionsBank.find(p => p.active) || promotionsBank[0],
  priceList: priceList,
  catalogs: catalogsBank,
  
  christmasMode: false,
  quote: { text: "Beauty begins the moment you decide to be yourself.", author: "Coco Chanel" }
};

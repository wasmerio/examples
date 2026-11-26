/**
 * Zahit - Site Configuration
 * ----------------------------------------
 * Temayı kişiselleştirmek için bu dosyayı düzenleyin.
 * Edit this file to personalize your site.
 */

export const SITE_CONFIG = {
  /** Sitenin başlığı / Site title */
  title: 'Zahit Theme',

  /** Sitenin açıklaması / Site description */
  description: 'A raw, flat minimalist theme built on the philosophy that simplicity is depth.',

  /** Sitenin adresi / Site URL */
  url: 'https://example.com',
};

export const AUTHOR = {
  /** Adınız / Your name */
  name: 'John Doe',

  /** Rolünüz / Your role */
  role: {
    tr: 'Yazılım Geliştirici',
    en: 'Software Developer',
  },

  /** Kısa biyografiniz / Your short bio */
  bio: {
    tr: 'Modern web teknolojileri ile ilgilenen, açık kaynak kodlu projelere katkıda bulunan bir geliştiriciyim. Burada örnek projelerimi ve yazılarımı paylaşıyorum.',
    en: 'A developer interested in modern web technologies and contributing to open source projects. Documenting example projects and posts here.',
  },

  /** Profil fotoğrafı yolu / Profile picture path (/src/assets klasöründen / from /src/assets folder) */
  avatar: '/profile.jpg',
};

export const SOCIALS = [
  {
    label: 'Mail',
    href: 'mailto:johndoe@example.com',
    icon: 'mdi:email',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/example',
    icon: 'mdi:github',
  },
  {
    label: 'X',
    href: 'https://x.com/example',
    icon: 'mdi:twitter',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/example',
    icon: 'mdi:linkedin',
  },
  {
    label: 'Mastodon',
    href: 'https://mastodon.social/@example',
    icon: 'mdi:mastodon',
  },
  {
    label: 'Medium',
    href: 'https://medium.com/@example',
    icon: 'mdi:medium',
  },
  {
    label: 'RSS',
    href: '/rss.xml',
    icon: 'mdi:rss',
  }
];

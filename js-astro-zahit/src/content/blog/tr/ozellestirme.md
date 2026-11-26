---
title: 'Zahit Teması: Gelişmiş Özelleştirme ve Stil Ayarları'
description: 'Konfigürasyon değişkenlerini değiştirmeyi, yerleşim sistemlerini biçimlendirmeyi ve renk şablonlarını güncellemeyi öğrenin.'
pubDate: '2026-05-23'
tags: ['zahit-guide', 'ozellestirme', 'css']
translationKey: 'zahit-customization'
---

Zahit gelişmiş özelleştirme rehberine hoş geldiniz! Zahit, saf minimalist estetik ilkelerine uygun tasarlandığı için kod yapısı oldukça sade, şeffaf ve düzenlemesi son derece kolaydır. Bu rehberde, yazar profil kartınızı güncellemeyi, global tasarım sistemindeki temel CSS parametrelerini ayarlamayı ve çeviri sözlüklerini değiştirmeyi öğreneceğiz.

---

## 👤 1. Temel Site Ayarlarını Düzenleme: `src/config.ts`

Adınızı, mevcut rolünüzü, kısa biyografinizi ve sosyal medya adreslerinizi değiştirmek için `src/config.ts` dosyasını açmanız yeterlidir. Bu dosya dışa aktarılan üç ana yapılandırma nesnesi barındırır:

### SITE_CONFIG
Web sitenizin global parametrelerini belirler:
- `title`: Tarayıcı sekmelerinde ve sayfa başlıklarında görüntülenir.
- `description`: Varsayılan SEO açıklaması (meta description) olarak kullanılır.
- `url`: Blogunuzun yayında olduğu alan adı adresi.

### AUTHOR
Sol taraftaki profil kartınızın verilerini barındırır:
- `name`: Tam adınız.
- `role`: Türkçe (`tr`) ve İngilizce (`en`) dillerine göre rolleriniz.
- `bio`: Profil fotoğrafınızın altında yer alacak kısa biyografi yazınız.
- `avatar`: Profil fotoğrafınızın klasör yolu (Örn: `/src/assets` altına eklenen `/profile.jpg`).

### SOCIALS
Sidebar veya mobil footer alanında ikon şeklinde gösterilecek sosyal medya hesaplarınızın listesidir:
```typescript
export const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/johndoe',
    icon: 'mdi:github',
  },
  // Benzer şablonu kopyalayarak yeni sosyal ağlar ekleyebilirsiniz
];
```
*Not: İkonlar için [Iconify MDI](https://icon-sets.iconify.design/mdi/) kodlarını doğrudan kullanabilirsiniz.*

---

## 🎨 2. Temayı ve Renkleri Özelleştirme

Zahit'in tüm tasarımı `src/styles/global.css` içerisindeki CSS değişkenleri ile yönetilir. `:root` seçicisi altındaki değerleri değiştirerek sitenizin tüm renklerini ve yazı tiplerini anında değiştirebilirsiniz:

```css
:root {
  /* Renkler */
  --bg-color: #00022b;     /* Derin uzay mavisi arka plan */
  --dark: #010e54;         /* Kartlar ve koyu panel alanları */
  --accent: #0855b1;       /* Birincil vurgu rengi (Bağlantılar ve sınırlar) */
  --light: #4fa5d8;        /* Hover durumları ve parlak detay renkleri */
  --text-color: #daeaff;   /* Yüksek okunabilirlik sağlayan buz mavisi metin tonu */

  /* Tipografi */
  --font-family-body: 'Source Sans 3', sans-serif;
  --font-family-heading: 'Source Sans 3', sans-serif;

  /* Genişlikler */
  --site-width: 80%;       /* Global genişlik oranı */
  --content-padding: 2rem;
}
```

### Örnek: Orman Yeşili Tema Oluşturma
Temayı mavi tonlardan koyu yeşil bir orman temasına dönüştürmek için renk kodlarını şu şekilde güncelleyebilirsiniz:
```css
:root {
  --bg-color: #0d1a0d;
  --dark: #1b331b;
  --accent: #2e662e;
  --light: #66cc66;
  --text-color: #e2f2e2;
}
```

---

## 🗣️ 3. Çeviri Kelimelerini Güncelleme: `src/i18n/ui.ts`

Sitedeki tüm navigasyon menüleri, "Yayınlanma Tarihi" veya "İçindekiler" gibi statik kelimeler `src/i18n/ui.ts` dosyasında saklanır. 

Bu kelimeleri değiştirmek veya yeni bir kelime eklemek için `ui` nesnesini düzenlemeniz yeterlidir:

```typescript
export const ui = {
  tr: {
    'nav.home': 'Ana Sayfa',
    'toc.title': 'İçindekiler',
  },
  en: {
    'nav.home': 'Home',
    'toc.title': 'Contents',
  },
} as const;
```

Değişiklikleri kaydettiğinizde sitenizdeki tüm statik butonlar ve navigasyon metinleri güncellenecektir.

---

## Sonuç

Zahit, dikkatinizi dağıtmadan sadece yazmaya odaklanabilmeniz için sade tasarlandı. CSS değişkenleri, `config.ts` ayrımı ve statik çeviri sözlüğü sayesinde portföyünüzü dakikalar içinde tamamen kendinize ait bir alana dönüştürebilirsiniz.

Keyifli kodlamalar ve yazımlar dileriz!

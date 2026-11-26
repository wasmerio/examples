---
title: 'Zahit Teması: İçerik Kullanımı ve Çoklu Dil Yapısı'
description: 'İki dilli yazılar oluşturmayı, içerik koleksiyonlarını yönetmeyi ve Zahit’in akıllı dil geçiş mekanizmasını kullanmayı öğrenin.'
pubDate: '2026-05-21'
tags: ['zahit-guide', 'kullanim', 'i18n']
translationKey: 'zahit-usage'
---

Zahit temasının en güçlü özelliklerinden biri, iki dilli (Türkçe ve İngilizce) içerik yönetimine sunduğu yerleşik ve akıcı destektir. Bu rehberde, yazılarınızın klasör yapısını nasıl düzenleyeceğinizi, gönderi üst bilgilerini (frontmatter) nasıl biçimlendireceğinizi ve akıllı dil geçiş sistemini nasıl verimli kullanacağınızı öğreneceğiz.

---

## 📂 İçerik Klasör Yapısı

Tüm blog yazıları `src/content/blog/` klasörü altında tutulur. Bu dizin içinde, yazılar dillere göre iki alt klasöre ayrılmıştır:

- `src/content/blog/tr/` — Türkçe yazılarınızın bulunacağı klasör.
- `src/content/blog/en/` — İngilizce yazılarınızın bulunacağı klasör.

Astro, `src/content.config.ts` dosyasında tanımlanan koleksiyon yükleyicisi sayesinde bu klasörler içindeki `.md` ve `.mdx` uzantılı tüm dosyaları otomatik olarak tarar ve derler.

---

## 📋 Gönderi Şablonu ve Parametreler (Frontmatter)

Her markdown yazısının en başında, üç tire `---` işaretleri arasına yerleştirilmiş bir üst bilgi (meta veri) bloğu yer almalıdır. Zahit şemasının zorunlu kıldığı alanlar şunlardır:

```markdown
---
title: 'Yazınızın Başlığı'
description: 'Yazınızın kısa bir özeti veya açıklaması.'
pubDate: '2026-05-17'
tags: ['etiket1', 'etiket2']
translationKey: 'benzersiz-yazi-anahtari'
---
```

### Alanların Açıklamaları:
- **`title` & `description`:** Yazının başında gösterilen ve arama motorları (SEO) için HTML `<head>` etiketlerine dinamik olarak aktarılan zorunlu alanlardır.
- **`pubDate`:** Yayınlanma tarihi. Zahit bu tarihi yazıları kronolojik sıralamak ve arşiv sayfasında yıllara göre otomatik gruplamak için kullanır.
- **`tags`:** Yazı etiketleri. Bu yazıların rehber arşivinde listelenmesi için etiketler arasına `zahit-guide` eklemeyi unutmayın.
- **`translationKey`:** Bir yazının Türkçe ve İngilizce karşılıklarını birbirine bağlayan tamamen benzersiz ortak bir metin anahtarıdır.

---

## 🌐 Akıllı Dil Geçiş Mekanizması Nasıl Çalışır?

Zahit, sayfa üst bilgi alanındaki (`Header.astro`) dil yönlendirmesinde akıllı bir mantık barındırır. Bir ziyaretçi Türkçe bir yazı okurken sağ üstteki **"EN"** butonuna tıkladığında, sistem onu İngilizce ana sayfaya fırlatmaz.

Bunun yerine, tüm içerik havuzunu tarayarak o sırada okunan yazı ile **tamamen aynı** `translationKey` değerine sahip İngilizce yazıyı arar:

- **Eğer eşleşen bir yazı bulunursa:** Ziyaretçiyi doğrudan o yazının İngilizce çeviri sayfasına yönlendirir.
- **Eğer eşleşen bir yazı bulunamazsa:** Ziyaretçiyi güvenli bir şekilde İngilizce arşiv sayfasına (`/en/archive/`) yönlendirir.

### Uygulamalı Örnek:

Örneğin, minimal tasarım üzerine iki dilde bir yazı hazırlamak istiyorsunuz:

1. `src/content/blog/tr/sadelik.md` dosyasını oluşturun ve içine `translationKey: 'simplicity-post'` ekleyin.
2. `src/content/blog/en/simplicity.md` dosyasını oluşturun ve içine `translationKey: 'simplicity-post'` ekleyin.

Bu basit ayar sayesinde, okuyucularınız diledikleri anda hiçbir içerik kaybı veya kopukluk yaşamadan Türkçe ve İngilizce çeviriler arasında geçiş yapabilirler.

---

## Sonraki Adımlar

Artık yazılarınızı nasıl düzenleyeceğinizi ve yayınlayacağınızı biliyorsunuz. Bir sonraki aşamada tasarım şablonlarını, CSS renk tonlarını ve sosyal medya ağınızı nasıl güncelleyeceğinizi öğrenebilirsiniz.

Son rehberimize geçiş yapın: **[Zahit Teması: Gelişmiş Özelleştirme ve Stil Ayarları](/blog/ozellestirme/)**


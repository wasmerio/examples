---
title: 'Zahit Teması: Harici Blog Yazıları Desteği'
description: 'Medium, Substack veya harici platformlardaki makalelerinizi Zahit blogunuza nasıl entegre edeceğinizi öğrenin.'
pubDate: '2026-10-06'
tags: ['zahit-guide', 'kullanim', 'external']
translationKey: 'zahit-external-posts'
---

Zahit, yazılarınızı tek bir merkezde toplamanızı kolaylaştırmak için harici blog yazıları desteği sunar. Medium, Substack, Dev.to veya kurumsal platformlarda yayınladığınız makaleleri, sitenizin minimalist estetiğini bozmadan portföyünüzün bir parçası haline getirebilirsiniz.

Bu rehberde, harici yazıların frontmatter alanlarını nasıl yapılandıracağınızı ve sistemin bu bağlantıları nasıl işlediğini inceleyeceğiz.

---

## 📋 Frontmatter Parametreleri

Bir yazıyı harici bir bağlantıya yönlendirmek için markdown dosyanızın üst bilgi (frontmatter) alanına iki yeni parametre ekleyebilirsiniz:

```markdown
---
title: 'Yapay Zekâ Çağında Sade Kod Yazmak'
description: 'Medium üzerinde yayınlanan, minimalist yazılım mimarileri üzerine detaylı inceleme.'
pubDate: '2026-10-06'
tags: ['yazilim', 'mimari']
external_url: 'https://medium.com/@kullanici/sade-kod-yazmak'
external_source: 'Medium' # Opsiyonel: Tarihin yanında rozet olarak gösterilir
---
```

### Parametrelerin İşlevleri:

- **`external_url` (Zorunlu):** Ziyaretçinin yönlendirileceği harici makalenin geçerli web adresi. Bu alan tanımlandığında içerik kartı harici bir bağlantı olarak davranır.
- **`external_source` (Opsiyonel):** Yazının yayınlandığı platformun adı (örn. *Medium*, *Substack*, *Dev.to*, *AltaySec*). Tanımlandığında, yayın tarihinin yanında şık ve minimal bir rozet (badge) olarak gösterilir.

---

## ⚡ Ekosistem Nasıl Çalışır?

Harici bir bağlantı tanımlandığında, temanın tüm bileşenleri bu duruma otomatik olarak uyum sağlar:

### 1. Liste ve Kart Bileşenleri (Ana Sayfa, Arşiv, Etiketler)
- **Doğrudan Yönlendirme:** Yazı kartına tıklandığında yerel sayfa yerine doğrudan harici hedef adrese gidilir.
- **Güvenli Yeni Sekme:** Harici bağlantılar sitenizi terk ettirmemek adına `target="_blank"` ve `rel="noopener noreferrer"` öznitelikleriyle yeni sekmede açılır.
- **Görsel İpuçları:** Başlığın yanına ince bir dış bağlantı ikonu (`↗`) eklenir; `external_source` belirtilmişse tarih alanının yanında minimal bir rozet belirir.

### 2. Akıllı Fallback & 301 Yönlendirmesi
Ziyaretçiler veya arama motorları yazının yerel slug adresine (`/blog/yazi-adi/`) doğrudan erişmeye çalışırsa, sayfa henüz render edilmeden önce `301 Moved Permanently` durum koduyla harici adrese kalıcı olarak yönlendirilir.

### 3. RSS Akışı Entegrasyonu
Zahit’in `rss.xml` beslemesi harici bağlantıları otomatik tanır. RSS okuyucularınızdaki aboneler yazıya tıkladığında, yerel bir sayfa yerine doğrudan harici platformdaki orijinal makaleye yönlendirilir.

---

## 💡 Pratik Kullanım Tavsiyesi

Harici bir yazı dosyası oluştururken gövde kısmına uzun metinler yazmanıza gerek yoktur; yalnızca frontmatter alanlarını ve kısa bir açıklamayı (`description`) doldurmanız yeterlidir.

Dilerseniz yerel yazılarınızda olduğu gibi iki dilli `translationKey` eşleştirmesi yapabilir veya doğrudan o dildeki harici yayınınızı bağlayabilirsiniz.

---

## Sonraki Adımlar

Temanın diğer yeteneklerini keşfetmek için önceki rehberlerimize göz atabilirsiniz:
- **[Zahit Teması: İçerik Kullanımı ve Çoklu Dil Yapısı](/blog/kullanim/)**
- **[Zahit Teması: Gelişmiş Özelleştirme ve Stil Ayarları](/blog/ozellestirme/)**

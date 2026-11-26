---
title: 'Zahit Teması: Adım Adım Kurulum Rehberi'
description: 'Zahit temasını yerel bilgisayarınıza nasıl kuracağınızı, yapılandıracağınızı ve çalıştıracağınızı öğrenin.'
pubDate: '2026-05-17'
tags: ['zahit-guide', 'kurulum', 'astro']
translationKey: 'zahit-installation'
---

**Zahit** kurulum rehberine hoş geldiniz! Zahit, sadeliğin eksiklik değil derinlik olduğu felsefesiyle üretilmiş, ham ve düz minimalist bir Astro v7 temasıdır. Bu rehberde, depoyu klonlamaktan yerel geliştirme sunucusunu ayağa kaldırmaya kadar tüm kurulum adımlarını öğreneceğiz.

## Gereksinimler

Kuruluma başlamadan önce sisteminizde aşağıdaki araçların kurulu olduğundan emin olun:

- **Node.js:** `22.12.0` veya üzeri bir sürüm tavsiye edilir. Sürümünüzü kontrol etmek için terminalde şu komutu çalıştırabilirsiniz:
  ```bash
  node --version
  ```
- **Git:** Proje kodlarını indirmek ve versiyonlamak için gereklidir.

---

## Adım 1: Projeyi Klonlayın

Zahit temasını kullanmak için öncelikle GitHub deposunu bilgisayarınıza indirmelisiniz. Terminali açın ve aşağıdaki komutu girin:

```bash
git clone https://github.com/kuscadev/Zahit.git
```

Klonlama işlemi tamamlandıktan sonra proje klasörünün içerisine geçiş yapın:

```bash
cd Zahit
```

---

## Adım 2: Bağımlılıkları Yükleyin

Zahit, yazıların işlenmesi için `@astrojs/mdx` ve ikonların yönetimi için `astro-icon` gibi hafif kütüphaneler kullanır. Projenin ana dizininde aşağıdaki komutu çalıştırarak gerekli tüm paketleri yükleyin:

```bash
npm install
```

Bu komut `package.json` dosyasını okuyacak ve yerel `node_modules` klasörünü oluşturacaktır.

---

## Adım 3: Geliştirme Sunucusunu Başlatın

Paket kurulumları tamamlandığına göre Astro'nun hızlı ve dinamik yerel sunucusunu başlatmaya hazırsınız:

```bash
npm run dev
```

Terminal ekranınızda projenin çalıştığı yerel adres görüntülenecektir (genellikle):

```text
  ┃ Local    http://localhost:4321/
```

Tarayıcınızı açıp `http://localhost:4321/` adresine giderek minimalist ve şık sitenizi anında görüntüleyebilirsiniz! Kod üzerinde yapacağınız her değişiklik tarayıcıda anlık olarak yenilenecektir.

---

## Sonraki Adımlar

Tebrikler, Zahit temanız başarıyla kuruldu ve çalışıyor! Artık yazar biyografinizi özelleştirebilir ve ilk iki dilli blog yazınızı kaleme alabilirsiniz.

Yazı oluşturma ve çoklu dil sistemini öğrenmek için bir sonraki rehberimize göz atın: **[Zahit Teması: İçerik Kullanımı ve Çoklu Dil Yapısı](/blog/kullanim/)**


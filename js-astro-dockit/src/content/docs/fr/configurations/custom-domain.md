---
title: "Configurer un domaine personnalisé"
description: Apprenez à configurer un domaine personnalisé pour votre site de documentation Dockit avec des instructions détaillées pour différentes plateformes d'hébergement.
sidebar:
  order: 6
  label: "[information] Configurer un domaine personnalisé"
---

La configuration d'un domaine personnalisé pour votre site de documentation Dockit aide à établir votre identité de marque et assure une apparence professionnelle. Ce guide couvre le processus complet de configuration de domaines personnalisés sur différentes plateformes d'hébergement.

## Aperçu

Un domaine personnalisé vous permet de servir votre documentation depuis votre propre URL de marque au lieu du sous-domaine par défaut du fournisseur d'hébergement. Par exemple:

- **Par défaut**: `your-docs.netlify.app` ou `your-docs.vercel.app`
- **Personnalisé**: `docs.votreentreprise.com` ou `help.votreentreprise.com`

## Prérequis

Avant de configurer un domaine personnalisé, assurez-vous d'avoir:

1. **Propriété du domaine**: Vous possédez ou gérez le domaine que vous souhaitez utiliser
2. **Accès DNS**: Possibilité de modifier les enregistrements DNS pour votre domaine
3. **Site déployé**: Votre site Dockit est déjà déployé et fonctionne
4. **Certificat SSL**: Support HTTPS (généralement fourni automatiquement)

## Options de configuration de domaine

### Configuration de sous-domaine (Recommandé)

L'utilisation d'un sous-domaine est l'approche la plus courante et recommandée:

```
docs.votreentreprise.com
help.votreentreprise.com
support.votreentreprise.com
knowledge.votreentreprise.com
```

### Configuration de domaine racine

Vous pouvez également utiliser votre domaine racine, bien que cela nécessite des considérations supplémentaires:

```
votreentreprise.com
votredocs.com
```

### Configuration basée sur le chemin

Servir la documentation depuis un chemin spécifique:

```
votreentreprise.com/docs
votreentreprise.com/help
```

## Installation spécifique à la plateforme

### Configuration Netlify

#### Étape 1: Ajouter un domaine personnalisé dans Netlify

1. Accédez aux **Site Settings** de votre site dans le tableau de bord Netlify
2. Naviguez vers **Domain management** → **Custom domains**
3. Cliquez sur **Add custom domain**
4. Entrez votre domaine (par ex. `docs.votreentreprise.com`)

#### Étape 2: Configurer les enregistrements DNS

Ajoutez un enregistrement CNAME chez votre fournisseur DNS:

```
Type: CNAME
Nom: docs (ou votre sous-domaine choisi)
Valeur: your-site-name.netlify.app
TTL: 3600 (ou Auto)
```

#### Étape 3: Activer HTTPS

Netlify verstrekt automatisch SSL-certificaten via Let's Encrypt:

1. Wacht op DNS-propagatie (tot 24 uur)
2. SSL-certificaat wordt automatisch uitgegeven
3. Forceer HTTPS-omleiding in **Site Settings** → **HTTPS**

#### Stap 4: _redirects configureren (Optioneel)

Maak een `_redirects` bestand in je `public/` directory:

```
# public/_redirects

# Forceer HTTPS
http://docs.jouwbedrijf.com/* https://docs.jouwbedrijf.com/:splat 301!

# Omleiden oude paden
/old-docs/* /new-docs/:splat 301
/v1/* /latest/:splat 301

# SPA fallback
/*  /index.html  200
```

### Vercel configuratie

#### Stap 1: Domein toevoegen in Vercel

1. Ga naar je project dashboard
2. Navigeer naar **Settings** → **Domains**
3. Voer je aangepaste domein in
4. Kies de deployment branch

#### Stap 2: DNS configureren

Voor subdomeinen, voeg een CNAME-record toe:

```
Type: CNAME
Naam: docs
Waarde: cname.vercel-dns.com
```

Voor root domeinen, voeg A-records toe:

```
Type: A
Naam: @
Waarde: 76.76.19.61

Type: A  
Naam: @
Waarde: 76.76.19.62
```

#### Stap 3: Domein verifiëren

Vercel zal automatisch je domein verifiëren en SSL-certificaten uitgeven.

#### Stap 4: vercel.json configureren

```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### GitHub Pages configuratie

#### Stap 1: Repository-instellingen configureren

1. Ga naar repository **Settings** → **Pages**
2. Selecteer bron (meestal `main` branch)
3. Voeg aangepast domein toe in het **Custom domain** veld

#### Stap 2: CNAME bestand maken

Maak een `CNAME` bestand in je repository root of `public/` directory:

```
docs.jouwbedrijf.com
```

#### Stap 3: DNS configureren

Voeg een CNAME-record toe die wijst naar GitHub Pages:

```
Type: CNAME
Naam: docs
Waarde: jouwgebruikersnaam.github.io
```

#### Stap 4: HTTPS inschakelen

GitHub Pages verstrekt automatisch SSL-certificaten voor aangepaste domeinen.

### Firebase Hosting configuratie

#### Stap 1: firebase.json configureren

```json
{
  "hosting": {
    "public": "dist",
    "site": "your-project-id",
    "cleanUrls": true,
    "trailingSlash": false,
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

#### Stap 2: Aangepast domein toevoegen

```bash
firebase hosting:channel:deploy live --only hosting
firebase hosting:site:get your-project-id
```

Voeg domein toe in Firebase Console:
1. Ga naar **Hosting** sectie
2. Klik op **Add custom domain**
3. Volg de verificatiestappen

#### Stap 3: DNS-configuratie

Voeg de verstrekte DNS-records toe uit Firebase Console.

## DNS Provider voorbeelden

### Cloudflare DNS

```
Type: CNAME
Naam: docs
Content: your-site.netlify.app
Proxy status: Proxied (oranje wolk)
TTL: Auto
```

Aanvullende Cloudflare-instellingen:
- **SSL/TLS**: Full (strict)
- **Always Use HTTPS**: Aan
- **Automatic HTTPS Rewrites**: Aan

### Google Domains

```
Type: CNAME
Naam: docs
Data: your-site.netlify.app.
TTL: 1 uur
```

### Namecheap DNS

```
Type: CNAME Record
Host: docs  
Waarde: your-site.netlify.app
TTL: Automatic
```

### Route 53 (AWS)

```json
{
  "Type": "CNAME",
  "Name": "docs.jouwbedrijf.com",
  "Value": "your-site.netlify.app",
  "TTL": 300
}
```

## SSL-certificaat configuratie

### Automatische SSL (Aanbevolen)

De meeste moderne hosting platforms bieden automatische SSL:

- **Netlify**: Let's Encrypt (automatisch)
- **Vercel**: Automatische SSL-verstrekking
- **GitHub Pages**: Automatisch voor aangepaste domeinen
- **Firebase**: Google-beheerde certificaten

### Handmatige SSL-configuratie

Voor geavanceerde setups heb je mogelijk handmatige SSL-configuratie nodig:

```nginx
server {
    listen 443 ssl http2;
    server_name docs.jouwbedrijf.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Geavanceerde configuratie

### Meerdere domeinen

Configureer meerdere domeinen voor dezelfde site:

```json
// netlify.toml
[[redirects]]
  from = "https://old-docs.com/*"
  to = "https://docs.jouwbedrijf.com/:splat"
  status = 301
  force = true

[[redirects]]
  from = "https://help.jouwbedrijf.com/*"
  to = "https://docs.jouwbedrijf.com/:splat"
  status = 301
  force = true
```

### Internationalisatie domeinen

Stel verschillende domeinen in voor verschillende talen:

```
docs.jouwbedrijf.com (Nederlands)
docs-en.jouwbedrijf.com (Engels)
docs-de.jouwbedrijf.com (Duits)
docs-fr.jouwbedrijf.com (Frans)
```

### CDN integratie

Configureer CDN voor betere prestaties:

```json
// vercel.json
{
  "functions": {
    "app/api/**/*.js": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1", "sfo1", "fra1"],
  "github": {
    "enabled": false
  }
}
```

## Beveiligings beste praktijken

### HSTS configuratie

Schakel HTTP Strict Transport Security in:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Content Security Policy

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; media-src 'self'; object-src 'none'; child-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self';
```

### Aanvullende beveiligingsheaders

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Prestatie-optimalisatie

### DNS-optimalisatie

1. **Gebruik snelle DNS-providers**: Cloudflare, Route 53, of Google DNS
2. **Minimaliseer DNS-lookups**: Verminder externe resource-afhankelijkheden
3. **Schakel DNS prefetching in**: `<link rel="dns-prefetch" href="//example.com">`

### Caching-strategie

```
# Statische assets
Cache-Control: public, max-age=31536000, immutable

# HTML-bestanden
Cache-Control: public, max-age=0, must-revalidate

# API-responsen
Cache-Control: public, max-age=300, s-maxage=600
```

## Monitoring en analytics

### Domein gezondheidsmonitoring

Stel monitoring in voor je aangepaste domein:

```javascript
// Basis uptime monitoring
async function checkDomainHealth() {
  try {
    const response = await fetch('https://docs.jouwbedrijf.com/health');
    if (response.ok) {
      console.log('Domein is gezond');
    } else {
      console.error('Domein gezondheidscheck gefaald');
    }
  } catch (error) {
    console.error('Domein is onbereikbaar:', error);
  }
}

setInterval(checkDomainHealth, 300000); // Check elke 5 minuten
```

### Analytics configuratie

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID', {
    custom_map: {
      'custom_parameter': 'dimension1'
    }
  });
</script>
```

## Probleemoplossing

### Veelvoorkomende problemen

#### DNS-propagatie vertragingen

DNS-wijzigingen kunnen tot 48 uur duren om wereldwijd volledig te propageren:

```bash
# Check DNS-propagatie
dig docs.jouwbedrijf.com
nslookup docs.jouwbedrijf.com
```

Online tools:
- whatsmydns.net
- dnschecker.org

#### SSL-certificaat problemen

Veelvoorkomende SSL-problemen en oplossingen:

1. **Mixed content fouten**: Zorg ervoor dat alle resources HTTPS gebruiken
2. **Certificaat mismatch**: Verifieer dat domeinnamen overeenkomen met certificaat
3. **Verlopen certificaten**: Stel auto-vernieuwing in

#### Omleidingslussen

Voorkom oneindige omleidingen:

```
# Incorrect
https://docs.jouwbedrijf.com → https://docs.jouwbedrijf.com

# Correct  
http://docs.jouwbedrijf.com → https://docs.jouwbedrijf.com
```

#### Prestatieproblemen

Diagnoseer en los prestatieproblemen op:

```bash
# Test site snelheid
curl -w "@curl-format.txt" -o /dev/null -s "https://docs.jouwbedrijf.com"

# Check response headers
curl -I "https://docs.jouwbedrijf.com"
```

### Debug tools

#### DNS debugging

```bash
# Check A-records
dig A docs.jouwbedrijf.com

# Check CNAME-records  
dig CNAME docs.jouwbedrijf.com

# Check MX-records
dig MX jouwbedrijf.com

# Trace DNS-resolutie
dig +trace docs.jouwbedrijf.com
```

#### SSL debugging

```bash
# Check SSL-certificaat
openssl s_client -connect docs.jouwbedrijf.com:443 -servername docs.jouwbedrijf.com

# Test SSL-configuratie
curl -vI https://docs.jouwbedrijf.com
```

## Migratie strategieën

### Zero-downtime migratie

Plan voor naadloze domeinmigratie:

1. **Nieuw domein voorbereiden**: Volledig instellen en testen
2. **DNS bijwerken met lage TTL**: Propagatietijd verkorten
3. **Traffic monitoren**: Letten op eventuele problemen
4. **Omleidingen implementeren**: Gebruikers naar nieuw domein leiden
5. **Interne links bijwerken**: Alle referenties wijzigen
6. **Gebruikers informeren**: De wijziging communiceren

### Migratie checklist

- [ ] Domein eigendom geverifieerd
- [ ] DNS-records geconfigureerd
- [ ] SSL-certificaat actief
- [ ] Omleidingen geïmplementeerd
- [ ] Interne links bijgewerkt
- [ ] Externe referenties geïnformeerd
- [ ] Analytics tracking bijgewerkt
- [ ] SEO-overwegingen aangepakt
- [ ] Monitoring alerts geconfigureerd
- [ ] Rollback plan voorbereid

## Beste praktijken

1. **Kies betekenisvolle subdomeinen**: Gebruik duidelijke, beschrijvende namen
2. **Schakel overal HTTPS in**: Serveer nooit content over HTTP
3. **Monitor domein gezondheid**: Stel uptime monitoring in
4. **Plan voor rampen**: Heb backup domeinen klaar
5. **Documenteer je setup**: Houd configuratierecords bij
6. **Regelmatig onderhoud**: Review en update configuraties
7. **Beveiliging eerst**: Implementeer juiste headers en beleid
8. **Prestaties zijn belangrijk**: Optimaliseer voor snelheid en betrouwbaarheid

## Conclusie

Het instellen van een aangepast domein voor je Dockit documentatiesite verbetert je merkpresentatie en biedt een professionele ervaring voor je gebruikers. Volg de platform-specifieke instructies, implementeer juiste beveiligingsmaatregelen en monitor je domein's gezondheid voor de beste resultaten.

Vergeet niet om grondig te testen in een staging-omgeving voordat je wijzigingen aanbrengt aan productie domeinen, en heb altijd een rollback plan klaar voor het geval van problemen.
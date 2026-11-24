---
title: Badges
---


This page demonstrates the badge integration feature of the Hugo Techie Personal theme. The theme supports displaying professional certifications and badges from multiple platforms:

- **Credly** - Popular badge platform with API integration
- **Accredible** - Professional credential management platform
- **Badgr** - Open Badges platform with API support
- **Bugcrowd** - Bug bounty platform badges and achievements
- **HackerOne** - Bug bounty platform badges and achievements
- **Open Badges** - Standards-based badges (JSON-LD format)
- **Manual/Custom Badges** - User-defined badges via data files

## Badge Display Options

The theme supports three badge sizes:

### Normal Size (Default - 250x250px)

{{< badges size="normal" >}}

### Big Size (500x500px)

{{< badges size="big" >}}

### Small Size (64x64px - Icon Only)

{{< badges size="small" >}}

## Configuration

To display your own badges, configure your `config.toml`:

```toml
[params]
  # Credly badge integration
  credly_username = "your-credly-username"
  credly_image_dir = "images/CredlyBadges"
  
  # Accredible badge integration
  accredible_username = "your-accredible-username"

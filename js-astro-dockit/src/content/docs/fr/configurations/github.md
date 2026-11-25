---
title: "Intégration GitHub"
description: Configurez l'intégration GitHub pour votre site de documentation Dockit
sidebar:
  order: 5
  label: "[github] Intégration GitHub"
---

Connectez votre site de documentation Dockit avec GitHub pour activer les fonctionnalités d'édition collaborative et de contrôle de version.

## Installation rapide

1. **Connexion au dépôt**: Connectez votre dépôt de documentation pour activer les fonctionnalités GitHub
2. **Authentification**: Configurez l'authentification GitHub pour les contributeurs
3. **Gestion des branches**: Configurez les branches à utiliser pour la documentation

## Fonctionnalités

### Éditer sur GitHub
Activez les liens "Modifier cette page" qui redirigent les utilisateurs vers l'édition directe de la documentation sur GitHub.

### Contrôle de version
Suivez les modifications de votre documentation avec l'historique Git complet et le suivi des commits.

### Édition collaborative
Permettez aux membres de l'équipe de contribuer à la documentation via des pull requests GitHub.

### Déploiements automatiques
Configurez des déploiements automatiques lorsque des modifications sont poussées vers votre branche principale.

## Configuration

### Installation de base

```json
{
  "github": {
    "repository": "your-username/your-docs-repo",
    "branch": "main",
    "editLinks": true
  }
}
```

### Authentification

Configurez l'authentification GitHub dans les paramètres de votre site:

```javascript
// Exemple de configuration d'authentification GitHub
const githubConfig = {
  clientId: "your-github-app-id",
  redirectUri: "https://your-docs-site.com/auth/callback"
};
```

## Exemples d'utilisation

### Liens d'édition
Chaque page affiche un lien "Modifier sur GitHub" qui ouvre le fichier correspondant dans l'éditeur de GitHub.

### Workflow de Pull Request
1. Les contributeurs cliquent sur "Modifier sur GitHub"
2. Effectuent des modifications dans l'éditeur web de GitHub
3. Soumettent une pull request
4. Examinent et fusionnent les modifications
5. Le site est automatiquement redéployé

## Meilleures pratiques

- Gardez votre dépôt public pour la documentation open source
- Utilisez des messages de commit clairs pour les modifications de documentation
- Configurez des règles de protection de branche pour le contrôle qualité
- Activez GitHub Pages pour l'hébergement automatique

## Dépannage

### Problèmes courants

**Les liens d'édition ne fonctionnent pas**: Vérifiez la configuration de l'URL du dépôt
**Erreurs d'authentification**: Vérifiez les identifiants de l'application GitHub
**Erreurs de déploiement**: Consultez les journaux GitHub Actions

Pour des options de configuration plus détaillées, consultez la documentation d'intégration GitHub.
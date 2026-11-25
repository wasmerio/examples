---
title: "GitHub Integration"
description: Configure GitHub integration for your Dockit documentation site
sidebar:
  order: 5
  label: "[github] GitHub Integration"
---

Connect your Dockit documentation site with GitHub to enable collaborative editing and version control features.

## Quick Setup

1. **Repository Connection**: Link your documentation repository to enable GitHub features
2. **Authentication**: Set up GitHub authentication for contributors
3. **Branch Management**: Configure which branches to use for documentation

## Features

### Edit on GitHub
Enable "Edit this page" links that direct users to edit documentation directly on GitHub.

### Version Control
Track changes to your documentation with full Git history and commit tracking.

### Collaborative Editing
Allow team members to contribute to documentation through GitHub pull requests.

### Automatic Deployments
Set up automatic deployments when changes are pushed to your main branch.

## Configuration

### Basic Setup

```json
{
  "github": {
    "repository": "your-username/your-docs-repo",
    "branch": "main",
    "editLinks": true
  }
}
```

### Authentication

Configure GitHub authentication in your site settings:

```javascript
// Example GitHub auth configuration
const githubConfig = {
  clientId: "your-github-app-id",
  redirectUri: "https://your-docs-site.com/auth/callback"
};
```

## Usage Examples

### Edit Links
Each page will display an "Edit on GitHub" link that opens the corresponding file in GitHub's editor.

### Pull Request Workflow
1. Contributors click "Edit on GitHub"
2. Make changes in GitHub's web editor
3. Submit pull request
4. Review and merge changes
5. Site automatically redeploys

## Best Practices

- Keep your repository public for open source documentation
- Use clear commit messages for documentation changes
- Set up branch protection rules for quality control
- Enable GitHub Pages for automatic hosting

## Troubleshooting

### Common Issues

**Edit links not working**: Check repository URL configuration
**Authentication errors**: Verify GitHub app credentials
**Deployment failures**: Review GitHub Actions logs

For more detailed configuration options, refer to the GitHub integration documentation.
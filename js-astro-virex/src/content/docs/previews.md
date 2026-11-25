---
title: "Preview Deployments"
description: "Learn how Virex automatically creates preview deployments for every pull request, enabling faster feedback and safer releases."
section: "Features"
order: 10
draft: false
---

Preview deployments are one of Virex's most powerful features. Every time you open a pull request, Virex automatically builds and deploys your changes to a unique URL, allowing you and your team to review changes before they go live.

## How It Works

When you push to a branch with an open pull request:

1. Virex detects the push event via webhook
2. A new build is triggered with your branch's code
3. The build is deployed to a unique preview URL
4. A comment is posted on your PR with the preview link

```
https://your-project-pr-123.virex.app
```

Each preview URL is unique to that specific commit, so you can compare different versions side by side.

## Enabling Preview Deployments

Preview deployments are enabled by default for all projects connected to GitHub, GitLab, or Bitbucket. No configuration required.

To customize behavior, add to your `virex.config.js`:

```javascript
export default {
  previews: {
    enabled: true,
    // Only create previews for PRs targeting these branches
    targetBranches: ['main', 'develop'],
    // Expire previews after 7 days of inactivity
    expiration: '7d',
  },
};
```

## Preview URLs

Preview URLs follow a predictable pattern:

| Type | URL Pattern |
|------|-------------|
| PR Preview | `{project}-pr-{number}.virex.app` |
| Branch Preview | `{project}-{branch}.virex.app` |
| Commit Preview | `{project}-{sha}.virex.app` |

You can also configure custom preview domains:

```javascript
export default {
  previews: {
    domain: 'preview.yourcompany.com',
    // Results in: pr-123.preview.yourcompany.com
  },
};
```

## GitHub Integration

Virex integrates deeply with GitHub to provide a seamless review experience:

### Status Checks

Every preview deployment reports its status back to GitHub:

- **Pending** — Build is in progress
- **Success** — Preview is live and ready
- **Failure** — Build failed (click for logs)

You can require successful preview deployments before merging by enabling branch protection rules.

### PR Comments

Virex automatically comments on your PR with:

- Direct link to the preview
- Build duration and size
- Lighthouse performance scores (if enabled)
- Screenshot comparison (if enabled)

### Deployment Events

Preview deployments appear in GitHub's Deployments tab, giving you a complete history of all previews for a PR.

## Password Protection

For sensitive projects, you can protect preview deployments with a password:

```javascript
export default {
  previews: {
    password: process.env.PREVIEW_PASSWORD,
  },
};
```

Or enable SSO protection for enterprise accounts:

```javascript
export default {
  previews: {
    protection: 'sso', // Requires Virex login
  },
};
```

## Environment Variables

Preview deployments use a separate set of environment variables from production. Configure them in the dashboard under **Settings → Environment Variables → Preview**.

Common patterns:

```bash
# Use a staging API for previews
API_URL=https://api-staging.yourcompany.com

# Disable analytics in previews
ANALYTICS_ENABLED=false

# Use test payment keys
STRIPE_KEY=pk_test_xxx
```

## Collaboration Features

### Sharing Previews

Share preview links with stakeholders who don't have repository access. They can view the preview without needing a Virex account (unless password protected).

### Comments on Previews

Team members can leave comments directly on preview deployments:

```bash
virex comment "The header looks off on mobile" --preview pr-123
```

Comments are synced back to the PR for visibility.

### Visual Regression Testing

Enable automatic screenshot comparison to catch visual regressions:

```javascript
export default {
  previews: {
    visualTesting: {
      enabled: true,
      pages: ['/', '/pricing', '/about'],
      viewports: ['mobile', 'desktop'],
    },
  },
};
```

## Cleanup and Expiration

Preview deployments are automatically cleaned up to save resources:

- **Merged PRs** — Previews are deleted 24 hours after merge
- **Closed PRs** — Previews are deleted immediately
- **Stale previews** — Deleted after the configured expiration period

To keep a preview longer:

```bash
virex preview keep pr-123 --days 30
```

## Best Practices

1. **Use preview-specific environment variables** — Don't accidentally send test data to production services
2. **Enable password protection for sensitive projects** — Especially if previews contain unreleased features
3. **Set up visual regression testing** — Catch CSS bugs before they reach production
4. **Configure expiration policies** — Keep your preview environment clean

## Troubleshooting

### Preview not updating

Make sure your branch is pushed to the remote:

```bash
git push origin your-branch
```

### Preview shows old content

Clear the CDN cache for the preview:

```bash
virex cache clear --preview pr-123
```

### Build failing only in previews

Check that preview environment variables are configured correctly. A common issue is missing API keys that exist in production but not in preview.

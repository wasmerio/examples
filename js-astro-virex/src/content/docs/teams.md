---
title: "Team Collaboration"
description: "Learn how to manage teams, roles, and permissions in Virex for seamless collaboration across your organization."
section: "Features"
order: 14
draft: false
---

Virex is built for teams. Whether you're a small startup or a large enterprise, our collaboration features help your team work together efficiently while maintaining security and control.

## Team Structure

Virex uses a hierarchical structure for organizing teams:

```
Organization
├── Team A
│   ├── Project 1
│   └── Project 2
└── Team B
    ├── Project 3
    └── Project 4
```

- **Organization** — Your company or top-level account
- **Teams** — Groups of people working together
- **Projects** — Individual applications or services

## Inviting Team Members

Invite members via the dashboard or CLI:

### Dashboard

1. Go to **Settings → Team**
2. Click **Invite Member**
3. Enter their email address
4. Select a role
5. Click **Send Invite**

### CLI

```bash
virex team invite user@example.com --role developer
```

Invitees receive an email with a link to join your organization.

## Roles and Permissions

Virex provides predefined roles with different permission levels:

### Owner

Full control over the organization:

- Manage billing and subscription
- Delete the organization
- All Admin permissions

### Admin

Manage team and project settings:

- Invite and remove members
- Create and delete projects
- Manage integrations
- All Developer permissions

### Developer

Day-to-day development access:

- Create deployments
- View logs and analytics
- Manage environment variables
- Trigger rollbacks
- All Viewer permissions

### Viewer

Read-only access:

- View deployments and logs
- View project settings
- Access preview deployments

### Permission Matrix

| Action | Owner | Admin | Developer | Viewer |
|--------|-------|-------|-----------|--------|
| View projects | ✓ | ✓ | ✓ | ✓ |
| View deployments | ✓ | ✓ | ✓ | ✓ |
| View logs | ✓ | ✓ | ✓ | ✓ |
| Create deployments | ✓ | ✓ | ✓ | ✗ |
| Rollback | ✓ | ✓ | ✓ | ✗ |
| Manage env vars | ✓ | ✓ | ✓ | ✗ |
| Manage domains | ✓ | ✓ | ✓ | ✗ |
| Create projects | ✓ | ✓ | ✗ | ✗ |
| Delete projects | ✓ | ✓ | ✗ | ✗ |
| Invite members | ✓ | ✓ | ✗ | ✗ |
| Manage billing | ✓ | ✗ | ✗ | ✗ |

## Custom Roles

Enterprise plans can create custom roles:

```javascript
// Custom role definition
{
  name: "QA Engineer",
  permissions: [
    "deployments:read",
    "deployments:create:preview",
    "logs:read",
    "analytics:read",
    // Cannot deploy to production
  ]
}
```

Contact sales to enable custom roles for your organization.

## Project-Level Permissions

Override organization roles at the project level:

```bash
# Give a viewer deploy access to a specific project
virex project add-member user@example.com --role developer --project my-app
```

This is useful for:

- Contractors who need access to specific projects
- Cross-team collaboration on shared services
- Temporary elevated access

## Deployment Comments

Leave comments on deployments to communicate with your team:

```bash
virex comment "Tested on staging, LGTM" --deployment deployment-abc123
```

Comments appear in:

- The Virex dashboard
- GitHub PR comments (if integrated)
- Slack notifications (if configured)

### Mentioning Team Members

Mention team members in comments:

```bash
virex comment "@sarah can you review the API changes?" --deployment deployment-abc123
```

Mentioned members receive a notification.

## Audit Logs

Track all actions taken in your organization:

```bash
virex audit-log --last 7d

TIMESTAMP            USER                ACTION              RESOURCE
2024-01-15 10:30    john@example.com    deployment.create   my-app
2024-01-15 10:25    sarah@example.com   env.update          my-app
2024-01-15 09:00    admin@example.com   member.invite       org
```

### Filtering Audit Logs

```bash
# Filter by user
virex audit-log --user john@example.com

# Filter by action type
virex audit-log --action deployment.*

# Filter by project
virex audit-log --project my-app

# Export to JSON
virex audit-log --format json > audit.json
```

Audit logs are retained for:

- **Pro plans**: 90 days
- **Enterprise plans**: 1 year (configurable)

## Notifications

Configure how your team receives notifications:

### Per-User Settings

Each team member can configure their preferences:

- **Email** — Deployment success/failure, mentions
- **Slack DM** — Real-time notifications
- **Browser** — Push notifications

### Team Channels

Set up shared notification channels:

```javascript
// virex.config.js
export default {
  notifications: {
    slack: {
      channel: '#deployments',
      events: ['deployment.success', 'deployment.failure', 'rollback'],
    },
    discord: {
      webhook: process.env.DISCORD_WEBHOOK,
      events: ['deployment.failure'],
    },
  },
};
```

## Access Tokens

Create tokens for CI/CD and automation:

```bash
# Create a deploy token
virex tokens create --name "GitHub Actions" --scope deploy

# Create a read-only token
virex tokens create --name "Monitoring" --scope read
```

### Token Scopes

| Scope | Permissions |
|-------|-------------|
| `deploy` | Create deployments, read logs |
| `read` | Read-only access to all resources |
| `admin` | Full API access |

### Token Best Practices

1. **Use descriptive names** — Know what each token is for
2. **Limit scope** — Only grant necessary permissions
3. **Rotate regularly** — Regenerate tokens periodically
4. **Revoke unused tokens** — Clean up tokens that are no longer needed

## SSO Integration

Enterprise plans support Single Sign-On:

- SAML 2.0
- OpenID Connect
- Okta, Azure AD, Google Workspace

See [SSO documentation](/docs/sso) for setup instructions.

## Best Practices

1. **Use the principle of least privilege** — Give users only the access they need
2. **Set up team channels** — Keep everyone informed about deployments
3. **Review audit logs regularly** — Catch unauthorized access early
4. **Use project-level permissions** — Don't give org-wide access unnecessarily
5. **Rotate access tokens** — Especially after team members leave

## Troubleshooting

### Member can't access project

Check their role at both organization and project level:

```bash
virex team list
virex project members my-app
```

### Notifications not working

Verify the integration is configured:

```bash
virex integrations list
```

### Audit log missing events

Ensure you have the appropriate plan. Some events are only logged on Enterprise plans.

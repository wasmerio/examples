---
title: "Role-Based Access Control"
description: "Configure fine-grained permissions with custom roles, approval workflows, and IP restrictions for enterprise security requirements."
section: "Enterprise"
order: 21
draft: false
---

Role-Based Access Control (RBAC) in Virex allows you to define exactly who can do what across your organization. Enterprise plans include advanced RBAC features like custom roles, approval workflows, and IP restrictions.

## Permission Model

Virex uses a hierarchical permission model:

```
Organization
├── Organization-level permissions
│   ├── Billing
│   ├── SSO configuration
│   └── Member management
│
├── Team-level permissions
│   ├── Team settings
│   └── Team membership
│
└── Project-level permissions
    ├── Deployments
    ├── Environment variables
    ├── Domains
    └── Logs
```

Permissions can be granted at any level and cascade down.

## Built-in Roles

Virex includes four built-in roles:

| Role | Description |
|------|-------------|
| **Owner** | Full control, including billing and organization deletion |
| **Admin** | Manage teams, projects, and members |
| **Developer** | Deploy and manage project resources |
| **Viewer** | Read-only access |

See [Team Collaboration](/docs/teams) for the full permission matrix.

## Custom Roles

Enterprise plans can create custom roles tailored to your organization:

### Creating a Custom Role

1. Go to **Settings → Roles → Create Role**
2. Name your role (e.g., "QA Engineer", "Release Manager")
3. Select permissions from the available list
4. Save the role

### Example: QA Engineer Role

```json
{
  "name": "QA Engineer",
  "description": "Can deploy to staging and view production",
  "permissions": [
    "projects:read",
    "deployments:read",
    "deployments:create:preview",
    "deployments:create:staging",
    "logs:read",
    "analytics:read"
  ]
}
```

This role can:
- View all projects
- Create preview and staging deployments
- View logs and analytics

This role cannot:
- Deploy to production
- Modify environment variables
- Manage domains

### Example: Release Manager Role

```json
{
  "name": "Release Manager",
  "description": "Can promote deployments to production",
  "permissions": [
    "projects:read",
    "deployments:read",
    "deployments:promote:production",
    "deployments:rollback",
    "logs:read",
    "analytics:read",
    "notifications:manage"
  ]
}
```

## Permission Reference

### Organization Permissions

| Permission | Description |
|------------|-------------|
| `org:read` | View organization settings |
| `org:update` | Modify organization settings |
| `org:delete` | Delete the organization |
| `billing:read` | View billing information |
| `billing:manage` | Manage subscription and payment |
| `members:read` | View organization members |
| `members:invite` | Invite new members |
| `members:remove` | Remove members |
| `members:update-role` | Change member roles |
| `sso:manage` | Configure SSO settings |
| `audit:read` | View audit logs |

### Project Permissions

| Permission | Description |
|------------|-------------|
| `projects:read` | View project details |
| `projects:create` | Create new projects |
| `projects:update` | Modify project settings |
| `projects:delete` | Delete projects |
| `deployments:read` | View deployments |
| `deployments:create:preview` | Create preview deployments |
| `deployments:create:staging` | Deploy to staging |
| `deployments:create:production` | Deploy to production |
| `deployments:promote:production` | Promote to production |
| `deployments:rollback` | Roll back deployments |
| `env:read` | View environment variables |
| `env:update` | Modify environment variables |
| `domains:read` | View domain configuration |
| `domains:manage` | Add/remove domains |
| `logs:read` | View application logs |
| `analytics:read` | View analytics data |

## Environment-Specific Permissions

Restrict actions to specific environments:

```json
{
  "name": "Staging Developer",
  "permissions": [
    "deployments:create:preview",
    "deployments:create:staging",
    "env:update:preview",
    "env:update:staging"
  ],
  "restrictions": {
    "environments": ["preview", "staging"]
  }
}
```

This user can deploy to preview and staging but not production.

## Approval Workflows

Require approval for sensitive actions:

### Configuring Approval Workflows

1. Go to **Settings → Security → Approval Workflows**
2. Click **Create Workflow**
3. Configure the workflow:

```json
{
  "name": "Production Deployment Approval",
  "trigger": "deployments:create:production",
  "approvers": {
    "type": "role",
    "roles": ["admin", "release-manager"],
    "required": 1
  },
  "timeout": "4h",
  "autoReject": true
}
```

### Approval Flow

1. Developer initiates production deployment
2. Deployment enters "Pending Approval" state
3. Approvers receive notification
4. Approver reviews and approves/rejects
5. If approved, deployment proceeds
6. If rejected or timeout, deployment is cancelled

### Approval via CLI

```bash
# Request deployment (enters pending state)
virex deploy --production

# Approver approves
virex approve deployment-abc123

# Or rejects with reason
virex reject deployment-abc123 --reason "Missing changelog"
```

### Approval via Slack

If Slack integration is enabled, approvers can approve directly from Slack:

```
🚀 Deployment Approval Request

Project: my-app
Environment: production
Requested by: developer@example.com
Commit: abc1234 - "Add new feature"

[Approve] [Reject] [View Details]
```

## IP Restrictions

Limit access based on IP address:

### Organization-Wide IP Allowlist

```json
{
  "ipAllowlist": {
    "enabled": true,
    "addresses": [
      "203.0.113.0/24",
      "198.51.100.50"
    ],
    "enforceFor": ["dashboard", "api", "cli"]
  }
}
```

### Project-Specific Restrictions

```json
{
  "project": "sensitive-app",
  "ipAllowlist": {
    "production": ["203.0.113.0/24"],
    "staging": ["0.0.0.0/0"]
  }
}
```

### Bypass for CI/CD

Allow CI/CD systems to bypass IP restrictions:

```bash
# Create a token with IP bypass
virex tokens create --name "GitHub Actions" --bypass-ip
```

## Time-Based Access

Grant temporary elevated access:

```bash
# Grant admin access for 4 hours
virex access grant user@example.com --role admin --duration 4h --reason "Production incident"
```

Time-based access:
- Automatically expires after the specified duration
- Is logged in the audit trail
- Can be revoked early if needed

## Audit Trail

All RBAC changes are logged:

```bash
virex audit-log --filter rbac

TIMESTAMP            USER                ACTION                  DETAILS
2024-01-15 10:30    admin@example.com   role.create             "QA Engineer"
2024-01-15 10:25    admin@example.com   member.role-change      john@... → developer
2024-01-15 09:00    system              access.expire           temp admin access
```

## Best Practices

1. **Principle of least privilege** — Start with minimal permissions and add as needed
2. **Use custom roles** — Create roles that match your team structure
3. **Require approval for production** — Add a human checkpoint for critical deployments
4. **Enable IP restrictions** — Limit access to known networks
5. **Review permissions regularly** — Audit who has access to what
6. **Use time-based access** — Grant temporary elevated access instead of permanent

## Troubleshooting

### "Permission denied" errors

Check the user's effective permissions:

```bash
virex access check user@example.com --action deployments:create:production
```

### Approval workflow not triggering

Verify the workflow is enabled and matches the action:

```bash
virex workflows list
virex workflows test production-approval --action deployments:create:production
```

### IP restriction blocking legitimate access

Check if the IP is in the allowlist:

```bash
virex ip check 203.0.113.50
```

Add the IP if needed:

```bash
virex ip add 203.0.113.50 --reason "New office IP"
```

---
title: "Instant Rollbacks"
description: "Learn how to instantly roll back to any previous deployment with zero downtime using Virex's deployment history."
section: "Features"
order: 13
draft: false
---

Every deployment on Virex is immutable and stored indefinitely. This means you can instantly roll back to any previous version of your application with a single click—no rebuild required, no downtime.

## How Rollbacks Work

When you deploy to Virex:

1. Your application is built and assigned a unique deployment ID
2. The build artifacts are stored permanently
3. The deployment is activated (traffic is routed to it)
4. Previous deployments remain available for instant rollback

Rolling back simply changes which deployment receives traffic. Since the old deployment already exists, there's no build time—it's instant.

```
Current: deployment-abc123 (v2.1.0)
    ↓ Rollback
Active:  deployment-xyz789 (v2.0.0)  ← Instant switch
```

## Rolling Back via Dashboard

The easiest way to roll back is through the Virex dashboard:

1. Navigate to your project
2. Click **Deployments** in the sidebar
3. Find the deployment you want to restore
4. Click the **⋮** menu and select **Promote to Production**
5. Confirm the rollback

The rollback takes effect immediately—typically under 1 second.

## Rolling Back via CLI

Roll back using the Virex CLI:

```bash
# Roll back to the previous deployment
virex rollback

# Roll back to a specific deployment
virex rollback deployment-xyz789

# Roll back to a deployment by commit SHA
virex rollback --commit abc1234

# Roll back to a deployment by tag
virex rollback --tag v2.0.0
```

### Listing Deployments

View your deployment history:

```bash
virex deployments list

ID              STATUS    CREATED           COMMIT    BRANCH
deployment-abc  Active    2 hours ago       def456    main
deployment-xyz  Ready     1 day ago         abc123    main
deployment-123  Ready     3 days ago        789xyz    main
deployment-456  Ready     1 week ago        456def    main
```

## Rolling Back via API

Automate rollbacks with the Virex API:

```bash
curl -X POST https://api.virex.example.com/v1/deployments/deployment-xyz789/promote \
  -H "Authorization: Bearer $VIREX_TOKEN" \
  -H "Content-Type: application/json"
```

Response:

```json
{
  "id": "deployment-xyz789",
  "status": "active",
  "promotedAt": "2024-01-15T10:30:00Z",
  "previousDeployment": "deployment-abc123"
}
```

## Automatic Rollbacks

Configure automatic rollbacks based on health checks:

```javascript
// virex.config.js
export default {
  rollback: {
    automatic: true,
    triggers: {
      // Roll back if error rate exceeds 5%
      errorRate: 0.05,
      // Roll back if p95 latency exceeds 2 seconds
      latencyP95: 2000,
      // Roll back if health check fails 3 times
      healthCheckFailures: 3,
    },
    // Wait 5 minutes before auto-rollback to avoid flapping
    cooldown: '5m',
  },
};
```

### Health Checks

Define health check endpoints:

```javascript
export default {
  healthCheck: {
    path: '/api/health',
    interval: '30s',
    timeout: '5s',
    expectedStatus: 200,
  },
};
```

When a deployment fails health checks, Virex automatically rolls back to the last healthy deployment.

## Deployment Retention

By default, Virex retains all deployments indefinitely. You can configure retention policies:

```javascript
export default {
  deployments: {
    retention: {
      // Keep all production deployments
      production: 'forever',
      // Keep preview deployments for 30 days
      preview: '30d',
      // Keep at least the last 50 deployments
      minimum: 50,
    },
  },
};
```

## Rollback Notifications

Get notified when rollbacks occur:

```javascript
export default {
  notifications: {
    rollback: {
      slack: '#deployments',
      email: ['ops@yourcompany.com'],
      webhook: 'https://your-webhook.com/rollback',
    },
  },
};
```

Notification payload:

```json
{
  "event": "rollback",
  "project": "your-project",
  "from": {
    "id": "deployment-abc123",
    "commit": "def456",
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "to": {
    "id": "deployment-xyz789",
    "commit": "abc123",
    "createdAt": "2024-01-14T10:00:00Z"
  },
  "reason": "manual", // or "automatic"
  "triggeredBy": "user@example.com"
}
```

## Rollback Strategies

### Instant Rollback (Default)

Traffic immediately switches to the previous deployment:

```
100% traffic → old deployment
```

Best for: Critical issues requiring immediate resolution.

### Gradual Rollback

Slowly shift traffic back to the previous deployment:

```bash
virex rollback deployment-xyz789 --gradual --duration 10m
```

Traffic shift:

```
0m:  100% new → 0% old
2m:  80% new → 20% old
5m:  50% new → 50% old
10m: 0% new → 100% old
```

Best for: Validating the rollback doesn't introduce new issues.

## Database Considerations

Rollbacks only affect your application code, not your database. Consider these patterns:

### Backward-Compatible Migrations

Always write migrations that work with both old and new code:

```sql
-- Good: Add column with default
ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}';

-- Bad: Rename column (breaks old code)
ALTER TABLE users RENAME COLUMN name TO full_name;
```

### Feature Flags

Use feature flags to decouple deployments from feature releases:

```javascript
if (featureFlags.isEnabled('new-checkout')) {
  return <NewCheckout />;
}
return <OldCheckout />;
```

This allows you to roll back the feature without rolling back the deployment.

## Best Practices

1. **Test rollbacks regularly** — Don't wait for an emergency to try your first rollback
2. **Use deployment tags** — Tag important releases for easy identification
3. **Set up automatic rollbacks** — Let Virex catch issues before users do
4. **Monitor after rollback** — Verify the rollback resolved the issue
5. **Document rollback procedures** — Ensure your team knows how to roll back

## Troubleshooting

### Rollback not taking effect

Check that the deployment is in "Ready" status:

```bash
virex deployments get deployment-xyz789
```

### Old deployment missing

Check your retention policy. If the deployment was cleaned up, you'll need to redeploy from that commit:

```bash
virex deploy --commit abc123
```

### Database incompatibility

If the old code is incompatible with the current database schema, you may need to:

1. Roll back the database migration first
2. Then roll back the deployment

Always test rollback scenarios in staging first.

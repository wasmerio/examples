---
title: "Single Sign-On (SSO)"
description: "Configure SAML 2.0 or OpenID Connect SSO for your Virex organization with support for Okta, Azure AD, Google Workspace, and more."
section: "Enterprise"
order: 20
draft: false
---

Single Sign-On (SSO) allows your team to authenticate with Virex using your existing identity provider. This simplifies access management and improves security by centralizing authentication.

## Supported Providers

Virex supports SSO via SAML 2.0 and OpenID Connect (OIDC):

### SAML 2.0

- Okta
- Azure Active Directory
- OneLogin
- PingIdentity
- JumpCloud
- Any SAML 2.0 compliant IdP

### OpenID Connect

- Google Workspace
- Auth0
- Keycloak
- Any OIDC compliant provider

## Prerequisites

Before configuring SSO:

1. **Enterprise plan** — SSO is available on Enterprise plans only
2. **Verified domain** — Your email domain must be verified in Virex
3. **IdP admin access** — You need admin access to your identity provider

## SAML 2.0 Configuration

### Step 1: Get Virex SAML Details

In the Virex dashboard, go to **Settings → Security → SSO** and note:

| Field | Value |
|-------|-------|
| ACS URL | `https://auth.virex.example.com/saml/acs/{org-id}` |
| Entity ID | `https://virex.example.com/saml/{org-id}` |
| Sign-on URL | `https://auth.virex.example.com/saml/login/{org-id}` |

### Step 2: Configure Your IdP

#### Okta

1. In Okta Admin, go to **Applications → Create App Integration**
2. Select **SAML 2.0**
3. Configure:
   - **Single sign-on URL**: Your ACS URL from Step 1
   - **Audience URI**: Your Entity ID from Step 1
   - **Name ID format**: EmailAddress
   - **Application username**: Email

4. Add attribute statements:

| Name | Value |
|------|-------|
| `email` | `user.email` |
| `firstName` | `user.firstName` |
| `lastName` | `user.lastName` |

5. Download the IdP metadata XML

#### Azure AD

1. In Azure Portal, go to **Enterprise Applications → New Application**
2. Select **Create your own application**
3. Choose **Integrate any other application (Non-gallery)**
4. Go to **Single sign-on → SAML**
5. Configure Basic SAML Configuration:
   - **Identifier (Entity ID)**: Your Entity ID
   - **Reply URL (ACS URL)**: Your ACS URL
   - **Sign on URL**: Your Sign-on URL

6. Configure User Attributes & Claims:
   - `emailaddress` → `user.mail`
   - `givenname` → `user.givenname`
   - `surname` → `user.surname`

7. Download **Federation Metadata XML**

### Step 3: Upload IdP Metadata to Virex

1. Go to **Settings → Security → SSO**
2. Click **Configure SAML**
3. Upload your IdP metadata XML file
4. Click **Save Configuration**

### Step 4: Test the Connection

1. Click **Test SSO Connection**
2. You'll be redirected to your IdP
3. Authenticate with your IdP credentials
4. Verify you're redirected back to Virex

## OpenID Connect Configuration

### Step 1: Create OIDC Application

In your identity provider, create a new OIDC application with:

| Field | Value |
|-------|-------|
| Redirect URI | `https://auth.virex.example.com/oidc/callback/{org-id}` |
| Grant Type | Authorization Code |
| Response Type | code |

### Step 2: Configure Virex

1. Go to **Settings → Security → SSO**
2. Click **Configure OIDC**
3. Enter your IdP details:

```
Client ID: your-client-id
Client Secret: your-client-secret
Issuer URL: https://your-idp.com
```

4. Click **Save Configuration**

### Google Workspace Example

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new OAuth 2.0 Client ID
3. Set authorized redirect URI to your Virex callback URL
4. Copy Client ID and Client Secret to Virex

## User Provisioning

### Just-in-Time (JIT) Provisioning

By default, users are created in Virex when they first sign in via SSO:

```javascript
// Default JIT settings
{
  jitProvisioning: true,
  defaultRole: 'developer',
  autoJoinTeams: ['engineering']
}
```

### SCIM Provisioning

For automatic user lifecycle management, enable SCIM:

1. Go to **Settings → Security → SCIM**
2. Generate a SCIM token
3. Configure your IdP with:
   - **SCIM Base URL**: `https://api.virex.example.com/scim/v2`
   - **Bearer Token**: Your generated token

SCIM supports:

- **User creation** — New IdP users are created in Virex
- **User updates** — Profile changes sync automatically
- **User deactivation** — Removed IdP users lose Virex access
- **Group sync** — IdP groups map to Virex teams

## Role Mapping

Map IdP groups or attributes to Virex roles:

```javascript
// Role mapping configuration
{
  roleMapping: {
    // Map IdP groups to Virex roles
    groups: {
      'Engineering': 'developer',
      'DevOps': 'admin',
      'Management': 'viewer'
    },
    // Or map based on attributes
    attributes: {
      'department': {
        'Engineering': 'developer',
        'Operations': 'admin'
      }
    },
    // Default role if no mapping matches
    default: 'viewer'
  }
}
```

## Enforcing SSO

Once SSO is configured, you can enforce it for all users:

1. Go to **Settings → Security → SSO**
2. Enable **Require SSO for all users**
3. Optionally, allow password login for specific users (e.g., service accounts)

When enforced:

- Users must authenticate via SSO
- Password login is disabled
- Existing sessions remain valid until expiry

## Session Management

Configure SSO session behavior:

```javascript
{
  session: {
    // Session duration (max 24 hours with SSO)
    duration: '8h',
    // Require re-authentication for sensitive actions
    reauthForSensitive: true,
    // Idle timeout
    idleTimeout: '1h'
  }
}
```

### Session Termination

When a user is deactivated in your IdP:

- **With SCIM**: Access is revoked immediately
- **Without SCIM**: Access is revoked at next session refresh (within 1 hour)

Force immediate session termination:

```bash
virex users revoke-sessions user@example.com
```

## Troubleshooting

### "Invalid SAML Response"

Common causes:

1. **Clock skew** — Ensure IdP and Virex times are synchronized
2. **Wrong ACS URL** — Verify the URL matches exactly
3. **Certificate expired** — Update the IdP certificate in Virex

### "User not found"

If JIT provisioning is disabled, users must be pre-created:

```bash
virex users create user@example.com --sso-only
```

### "Attribute mapping failed"

Verify your IdP is sending required attributes:

```bash
virex sso debug --last-login user@example.com
```

This shows the raw SAML assertion or OIDC claims received.

### Users can't access after IdP changes

Clear the SSO cache:

```bash
virex sso clear-cache
```

## Security Best Practices

1. **Enable SCIM** — Ensure deactivated users lose access immediately
2. **Use short session durations** — Reduce risk from compromised sessions
3. **Require MFA at IdP** — Virex respects IdP MFA requirements
4. **Monitor SSO logs** — Review authentication events regularly
5. **Test disaster recovery** — Ensure you can access Virex if IdP is down

## Bypass Access

For emergency access when SSO is unavailable:

1. Designate bypass users in **Settings → Security → SSO**
2. These users can log in with email/password
3. Limit bypass users to essential personnel only

```bash
virex sso add-bypass admin@example.com
```

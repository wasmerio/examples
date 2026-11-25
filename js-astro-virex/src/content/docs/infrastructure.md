---
title: "Dedicated Infrastructure"
description: "Learn about Virex's dedicated infrastructure options for enterprise customers requiring isolated compute, private networking, and custom configurations."
section: "Enterprise"
order: 22
draft: false
---

Enterprise customers can deploy on dedicated infrastructure for maximum performance, security, and compliance. This guide covers dedicated compute, private networking, and custom configurations available on Enterprise plans.

## Dedicated vs Shared Infrastructure

| Feature | Shared | Dedicated |
|---------|--------|-----------|
| Build compute | Shared pool | Isolated instances |
| Edge network | Shared CDN | Dedicated edge nodes |
| Database | Multi-tenant | Single-tenant |
| Network | Public internet | Private VPC options |
| Compliance | SOC 2 | SOC 2 + custom audits |
| Support | Standard SLA | Custom SLA |

## Dedicated Build Infrastructure

### Isolated Build Environments

Your builds run on dedicated compute instances, isolated from other customers:

```
┌─────────────────────────────────────┐
│         Your Organization           │
│  ┌─────────┐  ┌─────────┐           │
│  │ Build 1 │  │ Build 2 │  ...      │
│  └─────────┘  └─────────┘           │
│         Dedicated Compute           │
└─────────────────────────────────────┘
```

Benefits:
- **Consistent performance** — No noisy neighbors
- **Security isolation** — Your code never shares resources
- **Custom resources** — Configure CPU, memory, and disk

### Build Instance Types

Choose the right instance type for your workloads:

| Type | vCPU | Memory | Disk | Best For |
|------|------|--------|------|----------|
| Standard | 2 | 4 GB | 20 GB | Most projects |
| Performance | 4 | 8 GB | 50 GB | Large monorepos |
| High Memory | 4 | 16 GB | 50 GB | Memory-intensive builds |
| Compute | 8 | 16 GB | 100 GB | Parallel test suites |

Configure in your project settings:

```javascript
// virex.config.js
export default {
  build: {
    instanceType: 'performance',
    timeout: '30m',
  },
};
```

### Build Caching

Dedicated infrastructure includes enhanced build caching:

```javascript
export default {
  build: {
    cache: {
      // Cache node_modules across builds
      paths: ['node_modules', '.next/cache'],
      // Dedicated cache storage (faster than shared)
      storage: 'dedicated',
      // Cache retention
      retention: '30d',
    },
  },
};
```

## Dedicated Edge Network

### Private Edge Nodes

Deploy to edge nodes dedicated to your organization:

```
┌─────────────────────────────────────────────┐
│              Your Edge Network              │
│                                             │
│   🌐 NYC    🌐 LON    🌐 TYO    🌐 SYD    │
│                                             │
│   Dedicated capacity at each location       │
└─────────────────────────────────────────────┘
```

Benefits:
- **Guaranteed capacity** — No resource contention
- **Custom locations** — Add edge nodes where you need them
- **Dedicated IPs** — Static IPs for firewall rules

### Custom Edge Locations

Request edge nodes in specific locations:

```bash
virex edge request --location "Frankfurt, Germany" --reason "GDPR compliance"
```

We'll provision dedicated capacity within 5 business days.

### Dedicated IP Addresses

Get static IP addresses for your edge nodes:

```bash
virex edge ips list

LOCATION        IP ADDRESS        STATUS
us-east-1       203.0.113.10      Active
eu-west-1       203.0.113.20      Active
ap-northeast-1  203.0.113.30      Active
```

Use these IPs for:
- Firewall allowlisting
- DNS configuration
- Third-party integrations

## Private Networking

### VPC Peering

Connect Virex to your existing cloud infrastructure:

```
┌──────────────┐         ┌──────────────┐
│  Your VPC    │◄───────►│  Virex VPC   │
│              │ Peering │              │
│  Database    │         │  Functions   │
│  Services    │         │  Builds      │
└──────────────┘         └──────────────┘
```

Supported cloud providers:
- AWS VPC Peering
- Google Cloud VPC Peering
- Azure VNet Peering

### Setting Up VPC Peering

1. Go to **Settings → Infrastructure → Private Networking**
2. Click **Add VPC Peering**
3. Enter your VPC details:

```json
{
  "provider": "aws",
  "region": "us-east-1",
  "vpcId": "vpc-abc123",
  "cidrBlock": "10.0.0.0/16",
  "accountId": "123456789012"
}
```

4. Accept the peering request in your cloud console
5. Configure route tables on both sides

### Private Endpoints

Access Virex services via private endpoints (no public internet):

| Service | Private Endpoint |
|---------|------------------|
| API | `api.private.virex.example.com` |
| Git | `git.private.virex.example.com` |
| Registry | `registry.private.virex.example.com` |

### PrivateLink (AWS)

For AWS customers, use PrivateLink for secure connectivity:

```bash
virex privatelink create --region us-east-1

Endpoint Service: com.amazonaws.vpce.us-east-1.vpce-svc-abc123
```

Create a VPC endpoint in your AWS account pointing to this service.

## Data Residency

### Regional Deployment

Keep all data within specific regions:

```javascript
export default {
  infrastructure: {
    regions: {
      // All data stays in EU
      primary: 'eu-west-1',
      // Failover within EU
      failover: 'eu-central-1',
      // No data leaves EU
      dataResidency: 'eu',
    },
  },
};
```

### Available Regions

| Region | Location | Data Residency |
|--------|----------|----------------|
| us-east-1 | Virginia, USA | US |
| us-west-2 | Oregon, USA | US |
| eu-west-1 | Ireland | EU |
| eu-central-1 | Frankfurt | EU |
| ap-northeast-1 | Tokyo | APAC |
| ap-southeast-1 | Singapore | APAC |
| ap-southeast-2 | Sydney | APAC |

### Compliance Certifications

Dedicated infrastructure supports additional compliance requirements:

- **SOC 2 Type II** — Annual audit included
- **ISO 27001** — Information security management
- **GDPR** — EU data protection
- **HIPAA** — Healthcare data (with BAA)
- **PCI DSS** — Payment card data
- **FedRAMP** — US government (in progress)

## Custom Configurations

### Custom Domains for Internal Services

Use your own domains for Virex services:

```
dashboard.internal.yourcompany.com → Virex Dashboard
api.internal.yourcompany.com → Virex API
git.internal.yourcompany.com → Git Integration
```

### Custom SSL Certificates

Upload your own certificates:

```bash
virex certs upload --cert cert.pem --key key.pem --domain "*.yourcompany.com"
```

Or use certificates from your enterprise CA.

### Custom Build Images

Use custom Docker images for builds:

```javascript
export default {
  build: {
    image: 'registry.yourcompany.com/virex-build:latest',
    // Or use our base image with customizations
    baseImage: 'virex/build:node-20',
    packages: ['imagemagick', 'ffmpeg'],
  },
};
```

## High Availability

### Multi-Region Deployment

Deploy across multiple regions for high availability:

```javascript
export default {
  infrastructure: {
    multiRegion: {
      enabled: true,
      primary: 'us-east-1',
      secondary: ['us-west-2', 'eu-west-1'],
      failover: 'automatic',
    },
  },
};
```

### SLA Guarantees

| Tier | Uptime SLA | Support Response |
|------|------------|------------------|
| Standard | 99.9% | 24 hours |
| Enterprise | 99.95% | 4 hours |
| Enterprise+ | 99.99% | 1 hour |

Custom SLAs available for mission-critical workloads.

## Monitoring and Observability

### Dedicated Monitoring

Access dedicated monitoring dashboards:

- Build queue depth and wait times
- Edge network performance
- Resource utilization
- Error rates and latency

### Log Export

Export logs to your SIEM:

```javascript
export default {
  logging: {
    export: {
      destination: 's3://your-bucket/virex-logs',
      // Or Splunk, Datadog, etc.
      format: 'json',
      retention: '90d',
    },
  },
};
```

### Metrics Export

Export metrics to your monitoring system:

```javascript
export default {
  metrics: {
    export: {
      destination: 'datadog',
      apiKey: process.env.DATADOG_API_KEY,
      tags: ['env:production', 'team:platform'],
    },
  },
};
```

## Getting Started

To upgrade to dedicated infrastructure:

1. Contact your account manager or [sales@virex.example.com](mailto:sales@virex.example.com)
2. Discuss your requirements and compliance needs
3. We'll provision your dedicated environment
4. Migration assistance is included

Typical provisioning time: 5-10 business days.

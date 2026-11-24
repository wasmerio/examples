+++
title = 'Deploying with Kubernetes: A Practical Guide'
date = 2023-01-15T09:00:00-07:00
draft = false
tags = ['kubernetes', 'devops']
description = 'A hands-on walkthrough of deploying a containerized service to Kubernetes, from Dockerfile to rollout.'
author = 'Nimbus Team'
+++

Getting a service running reliably on Kubernetes comes down to a handful of
building blocks: a container image, a Deployment, and a Service to expose it.
This walkthrough covers the essentials.

{{< note type="tip" title="Before you start" >}}
You'll need `kubectl` configured against a cluster (Minikube, kind, or a
managed cluster all work fine for this walkthrough).
{{< /note >}}

## 1. Build and tag the image

```bash
docker build -t registry.example.com/api:1.4.0 .
docker push registry.example.com/api:1.4.0
```

## 2. Define the Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:

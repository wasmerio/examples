+++
title = 'Terraform State Management: Lessons from Production'
date = 2023-02-15T10:00:00-07:00
draft = false
tags = ['terraform', 'infrastructure']
description = 'Remote state backends, locking, and the drift-detection habits that keep a Terraform-managed fleet honest.'
author = 'Nimbus Team'
+++

Local Terraform state works fine for a weekend project. It falls apart the
moment a second engineer runs `terraform apply` against the same
infrastructure. Here's the setup we settled on after a state file conflict
took down a staging environment for an afternoon.

{{< note type="warning" title="State files contain secrets" >}}
Terraform state can include plaintext values for anything marked `sensitive`
in your provider — database passwords, API keys, TLS private keys. Treat
your state backend's access controls with the same care as a secrets
manager, not like a build artifact.
{{< /note >}}

## Move to a remote backend

A local `terraform.tfstate` file has no locking and no history. The fix is
a remote backend with state locking built in:

```hcl
terraform {
  backend "s3" {
    bucket         = "acme-terraform-state"
    key            = "prod/network/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

The `dynamodb_table` is what gives you locking — without it, two people
running `apply` at the same time will corrupt state, not just conflict.

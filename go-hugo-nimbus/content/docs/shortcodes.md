+++
title = 'Shortcodes'
description = 'Every content shortcode Nimbus ships, with live examples.'
weight = 30
date = 2024-04-12
+++

## Note boxes

`type` can be `info` (default), `warning`, `success`, or `error`.

```markdown
{{</* note type="tip" title="Pro tip" */>}}
Your content here.
{{</* /note */>}}
```

{{< note type="tip" title="Pro tip" >}}
`type` can also be passed positionally, but not combined with `title=` in the
same call — Hugo rejects mixing positional and named arguments.
{{< /note >}}

## Terminal

```markdown
{{</* terminal command="bash" user="dev" host="prod-01" path="~/app" */>}}
kubectl get pods
{{</* /terminal */>}}
```

{{< terminal command="bash" user="dev" host="prod-01" path="~/app" >}}
kubectl get pods
NAME                   READY   STATUS    RESTARTS   AGE
api-7d8f9c6b5d-x2k9p   1/1     Running   0          3m
{{< /terminal >}}

## Badges

```markdown
{{</* badge "kubernetes" "Kubernetes v1.28" */>}}

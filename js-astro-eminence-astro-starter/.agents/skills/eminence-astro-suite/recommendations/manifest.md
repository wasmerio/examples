# When to add a `manifest.webmanifest`

A manifest is most useful when your site behaves like an app people come back to often. It is not required for every site.

## Add a manifest when

- The site is app-like and task-oriented.
- Users return daily or weekly.
- Installability (home-screen / app-launcher presence) is genuinely useful.
- You will maintain `name`, `short_name`, `start_url`, and icons intentionally.

**Examples:** dashboards, client portals, admin tools, productivity apps, consumer web apps with repeat usage.

## Skip a manifest when

- The site is primarily informational and rarely revisited.
- There is no app-like workflow to resume.
- An install prompt would be noise rather than a useful action.

**Examples:** brochure sites, landing pages, one-off campaign pages, a typical restaurant menu site.

## Rule of thumb

If most users would not pin your site and use it weekly, skip the manifest. Adding one when there is no clear ongoing value turns the install affordance into a "No" moment users have to dismiss.

## How to silence the recommendation when you intentionally skip

Pass `manifest: false` to the integration to disable the feature and suppress the build-time recommendation warning:

```ts
eminence({ manifest: false });
```

## Cross-references

- File generation feature: [../integration/manifest.md](../integration/manifest.md).
- Link tag component: [../components/manifest.md](../components/manifest.md).

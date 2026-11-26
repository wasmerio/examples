---
question: Is this a package or an application?
order: 0
---

An application, not a dependency. Start from it with `laravel new my-sso --using=lauroguedes/laravel-sso`, or clone the repository, and the code is yours from that moment: your routes, your migrations, your deployment. Nothing upgrades the identity layer underneath you, which also means updates are yours to pull in, the way they are for the rest of your application.

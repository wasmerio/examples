---
sections:
  - "4.1 Comments Do Not Make Up for Bad Code"
  - "4.2 Good Comments"
  - "4.3 Bad Comments"
---

## Comments Do Not Make Up for Bad Code

Comments are, at best, a necessary evil. They exist because we fail to express ourselves in code. Rather than spending time writing a comment to explain messy code, spend it **cleaning the code**. Clear code with few comments is far superior to cluttered code with lots of comments.

## Good Comments

Some comments are genuinely useful:

- **Legal comments** — copyright and license headers required by corporate standards.
- **Informative comments** — explaining a regex pattern or clarifying a return value when the code can't speak for itself.
- **TODO comments** — marking known imperfections. Not an excuse to leave bad code, but a reasonable way to track future work.
- **Warning of consequences** — e.g., "this test takes a long time" or "not thread-safe."
- **Javadoc in public APIs** — good documentation for public interfaces is valuable.

## Bad Comments

Most comments fall into this category:

- **Mumbling** — comments written out of obligation with no real thought.
- **Redundant comments** — restating what the code already says clearly.
- **Journal comments** — changelogs at the top of files; that's what version control is for.
- **Noise comments** — `/** The name. */ private String name;` adds nothing.
- **Commented-out code** — delete it. It will live in source control if you need it. Commented-out code accumulates like sediment and no one dares remove it because everyone assumes someone needs it.

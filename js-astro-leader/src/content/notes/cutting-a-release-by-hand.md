---
title: 'Cutting a release by hand'
category: 'build-log'
pubDate: 2026-07-02
description: 'Doing the deploy manually for a month before automating any of it.'
work: pennant
---

When I started rebuilding Pennant's deploy process this spring, I made myself do it by hand for a month before writing a single line of automation. Every release: build, run the smoke test, tag the commit, write the note, push. Roughly a dozen times over four weeks, all typed out, none of it scripted. The checklist I taped above the desk was five lines:

- [ ] Build, and read the output instead of scrolling past it.
- [ ] Run the smoke test against the preview URL.
- [ ] Tag the commit with the date, not a version number.
- [ ] Write the changelog entry while the diff is still open.
- [ ] Push, then load the [status page](https://pennant.example.com) and watch it for two minutes.

This is not the advice I usually give. Automate the boring thing, I tell people, automate it on day one. But I had been burned before by automating a process I did not understand yet, and ending up with a script that encoded my first guess at the steps rather than the steps that actually mattered once I had done it enough times to know.

## What the month taught me

Two things changed between the first manual release and the twelfth. First, I dropped a step. My original checklist had me running the full test suite before every deploy, which took four minutes and, in a month of releases, caught exactly zero problems that the smoke test did not also catch. Second, I added a step nothing on my original checklist mentioned: checking that the previous release's changelog entry actually got written, because twice it silently had not, and I only noticed days later.

Neither of those would have shown up if I had automated the first version of the process. I would have automated the four-minute test I did not need and missed the changelog check I did.

## What got built

By the fifth week I had done the release enough times that the actual sequence was boring and repetitive in a way that felt safe to script, so I wrote a single deploy command that does the build, the smoke test, and the git tag, and then hands off to Halyard for the changelog entry:

```sh
pennant release          # build, smoke test, tag
pennant release --dry    # everything except the push
```

It has run about fifteen times since, with one failure, caused by a flaky smoke test that I have since fixed.

The whole exercise took longer than just automating it on day one would have. I think it was worth the extra weeks anyway. The script I ended up with is shorter than the one I would have written in week one, because it only does the things that turned out to matter.

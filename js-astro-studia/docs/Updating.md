# Updating

You don't have to do this. Your copy is source you own, and nothing breaks if it
never hears from this repository again. If you do want the fixes and features added
since you started, Git can merge them in, once your history and this one are related.

## Which case you are in

- **A GitHub fork** already shares history with this repository. Skip to
  [Merge](#merge).
- **"Use this template" or `degit`** starts a new history with its own first commit.
  A plain merge then refuses with `fatal: refusing to merge unrelated histories`, and
  forcing it with `--allow-unrelated-histories` conflicts in every file. Do the
  one-time step below first.

## Once: relate the histories

Record the upstream commit you started from as a parent of your history, without
changing a single file:

```bash
git remote add upstream https://github.com/dfuchss/astro-studia.git
git fetch upstream
git merge -s ours --allow-unrelated-histories -m "Relate history to upstream <start>" <start>
```

`-s ours` keeps your tree exactly as it is (`git diff HEAD~1` prints nothing). It
only adds `<start>` as a second parent, so later merges have a real base. It's an
ordinary commit, so push it like any other.

`<start>` is the upstream commit you copied. If you didn't write it down, take the
last upstream commit before your own first one:

```bash
git log upstream/main --before="$(git log --reverse --format=%cI | head -1)" -1 --oneline
```

**When in doubt, pick an older commit, never a newer one.** If you pick a commit
that is too new, Git treats every change between your real start and that commit
as already merged, and you never get those changes. If you pick one that is too
old, you only get a few extra conflicts in files you would have had to look at
anyway.

## Merge

```bash
git fetch upstream
git merge upstream/main
```

Only what changed upstream since `<start>`, or since your last merge, comes in.
If you already copied a fix in by hand, it merges cleanly as long as your copy
matches.

### Conflicts

Most of them come from the demo content, which upstream keeps editing and you have
replaced:

| Conflict                                                                 | Resolve with                                                     |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| demo content you rewrote (`src/content/`, `src/data/`, `.github/media/`) | `git checkout --ours -- <path>`, then `git add`                  |
| a file you deleted that upstream changed (`deleted in HEAD`)             | `git rm <path>`                                                  |
| `package-lock.json`                                                      | `git checkout --theirs -- package-lock.json`, then `npm install` |
| code you changed                                                         | by hand: both sides matter                                       |

Then `git commit` to finish the merge.

## Just one fix

To take one commit and nothing else, use `cherry-pick`. It works with or without
the one-time step:

```bash
git fetch upstream
git cherry-pick <sha>
```

## Afterwards

Run what CI runs before you push:

```bash
npm ci && npm run check && npm run docs:check && npm run build && npm run audit
```

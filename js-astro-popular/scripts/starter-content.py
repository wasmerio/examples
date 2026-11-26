#!/usr/bin/env python3
"""starter-content.py -- copy the theme's starter content into a new site.

The companion to setup.py: that writes the config and seed pages, this brings
the sample content (a post, an event, an organizer, a speaker, a venue, the
handbook and runbooks) so a new site has something to look at.

  python3 scripts/starter-content.py --site . --format hugo
  python3 scripts/starter-content.py --site . --format astro
  python3 scripts/starter-content.py --site . --format astro --astro-model package

Existing files are never overwritten, so it is safe to re-run.

Why this is not just `cp -r`: the starter's MDX imports theme components, and
the two Astro models spell that import differently. Since packaging phase 3 the
starter is a package consumer, so its source form is the package specifier
`astro-theme-popular/components/Callout.astro`, served by the export map. A
template-model site has no such dependency but does have `src/components/`, so
in that mode the specifiers are rewritten back to `../../components/…`.
Content stays single-source either way; the rewrite is the only difference.

Stdlib only; ships identically in both repos (see PARITY.md).
"""
import argparse
import os
import re
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, ".."))

PACKAGE_IMPORT_RE = re.compile(
    r"""from\s+(['"])astro-theme-popular/components/([A-Za-z0-9_]+)\.astro\1""")


def fail(msg, code=2):
    sys.stderr.write(f"starter-content.py: {msg}\n")
    sys.exit(code)


def template_imports(text):
    """Rewrite package component specifiers to template-relative paths.

    `../../` is right for every collection because content sits two levels
    under `src/` (`src/content/<collection>/entry.mdx`) and the components sit
    at `src/components/`.
    """
    return PACKAGE_IMPORT_RE.sub(lambda m: f"from {m.group(1)}../../components/"
                                           f"{m.group(2)}.astro{m.group(1)}", text)


def copy_tree(src, dest, transform=None):
    """Copy without overwriting. Returns (written, skipped)."""
    written, skipped = [], []
    for dirpath, _dirs, files in os.walk(src):
        for name in files:
            s = os.path.join(dirpath, name)
            d = os.path.join(dest, os.path.relpath(s, src))
            if os.path.exists(d):
                skipped.append(os.path.relpath(d, os.path.dirname(dest)))
                continue
            os.makedirs(os.path.dirname(d), exist_ok=True)
            if transform and name.endswith((".md", ".mdx")):
                with open(s, encoding="utf-8") as fh:
                    text = fh.read()
                with open(d, "w", encoding="utf-8") as fh:
                    fh.write(transform(text))
            else:
                shutil.copy2(s, d)
            written.append(os.path.relpath(d, os.path.dirname(dest)))
    return written, skipped


def sources(fmt, model):
    """(source, destination) pairs, relative to the theme root and the site."""
    if fmt == "hugo":
        return [(os.path.join(ROOT, "exampleSite", "content"), "content"),
                (os.path.join(ROOT, "exampleSite", "static"), "static")]
    starter = os.path.join(ROOT, "demos", "starter")
    return [(os.path.join(starter, "src", "content"), "src/content"),
            (os.path.join(starter, "public", "images"), "public/images")]


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--site", default=".", help="site directory to write into")
    ap.add_argument("--format", choices=["hugo", "astro"], required=True)
    ap.add_argument("--astro-model", choices=["template", "package"], default="template")
    args = ap.parse_args(argv)

    transform = template_imports if (args.format == "astro" and args.astro_model == "template") else None

    # This script is Tier-1 (identical in both repos), but the starter content
    # is not: Hugo's lives in exampleSite/, Astro's in demos/starter/. Running
    # --format astro from the Hugo checkout would otherwise copy nothing and
    # say so cheerfully.
    pairs = sources(args.format, args.astro_model)
    if not any(os.path.isdir(src) for src, _ in pairs):
        other = "astro-theme-popular" if args.format == "astro" else "hugo-theme-popular"
        fail(f"this checkout has no {args.format} starter content "
             f"({', '.join(os.path.relpath(s, ROOT) for s, _ in pairs)}). "
             f"Run it from the {other} checkout instead.")

    total_written, total_skipped = [], []
    for src, rel in pairs:
        if not os.path.isdir(src):
            continue
        written, skipped = copy_tree(src, os.path.join(args.site, rel), transform)
        total_written += written
        total_skipped += skipped

    print(f"Wrote {len(total_written)} starter file(s)."
          + (f" Left {len(total_skipped)} existing file(s) alone." if total_skipped else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())

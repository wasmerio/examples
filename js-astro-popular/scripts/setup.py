#!/usr/bin/env python3
"""setup.py -- Popular theme setup wizard (Layer 1 of the setup system).

Reads the setup-questions.json schema and writes a site's config, a couple of
seed pages, a DECISIONS.md audit trail, and a .popular-setup.json answer record
-- all by placeholder substitution on templates, never by parsing/re-serializing
the config. Sugar, never a gate: skip every question and you get the clean
starter config. Stdlib only; ships identically in both repos (see PARITY.md).

Usage:
  python3 scripts/setup.py                 # interactive, current dir
  python3 scripts/setup.py --answers a.json # non-interactive (agent / CI path)
  python3 scripts/setup.py --dry-run        # show the diff, write nothing
  python3 scripts/setup.py --site PATH --force

Exit codes: 0 success, 1 refusal/validation error, 2 bad invocation.

i18n: prompts/help live in the schema (the future translation surface); the
wizard's own strings are English-only in v1.
"""
import argparse
import datetime
import difflib
import glob
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


# ---------------------------------------------------------------- schema + fs
def find_schema():
    root = os.path.abspath(os.path.join(HERE, ".."))
    for rel in ("data/setup-questions.json", "src/data/setup-questions.json"):
        p = os.path.join(root, rel)
        if os.path.exists(p):
            with open(p, encoding="utf-8") as fh:
                return json.load(fh)["questions"]
    fail("setup-questions.json not found next to the script")


def detect(site):
    """Hugo vs Astro, mirroring spreadsheet-import.py."""
    if os.path.exists(os.path.join(site, "hugo.toml")) or os.path.exists(os.path.join(site, "config.toml")):
        return "hugo"
    if os.path.exists(os.path.join(site, "src", "content")) or os.path.exists(os.path.join(site, "config.ts")):
        return "astro"
    fail(f"Cannot detect site format in {site} (no hugo.toml or config.ts)", code=2)


def detect_astro_model(site):
    """Astro ships two ways (PACKAGING.md). A site that consumes the npm
    package keeps its theme config in popular.config.ts at the root; one that
    vendored the template repo keeps it in src/config.ts. An empty directory is
    neither, so a generator creating a site from scratch passes the model in."""
    if os.path.exists(os.path.join(site, "popular.config.ts")):
        return "package"
    return "template"


def config_path(site, fmt, model="template"):
    if fmt == "hugo":
        return os.path.join(site, "hugo.toml")
    return os.path.join(site, "popular.config.ts" if model == "package" else "src/config.ts")


def latest_release():
    """The most recent released version from CHANGELOG.md, for the dependency a
    generated consumer pins. Reading it here means a release bumps it, rather
    than someone remembering to edit a template."""
    changelog = os.path.join(os.path.abspath(os.path.join(HERE, "..")), "CHANGELOG.md")
    try:
        with open(changelog, encoding="utf-8") as fh:
            for line in fh:
                m = re.match(r"^## \[(\d+\.\d+\.\d+)\]", line)
                if m:
                    return m.group(1)
    except OSError:
        pass
    return "0.9.1"


def tmpl(name):
    with open(os.path.join(HERE, "templates", name), encoding="utf-8") as fh:
        return fh.read()


def fail(msg, code=1):
    sys.stderr.write(f"setup.py: {msg}\n")
    sys.exit(code)


# ------------------------------------------------------------- answers input
def gather_interactive(questions):
    answers = {}
    print("Popular setup wizard. Press Enter to skip any question.\n")
    for q in questions:
        print(q["prompt"])
        print(f"  {q['help']}")
        if q["handbook_url"]:
            print(f"  handbook: {q['handbook_url']}")
        if q["layer"] == "decision":
            d = input("  Decided? note (or Enter to leave open): ").strip()
            if d:
                answers[q["id"]] = d
        elif q["type"] == "bool":
            v = input("  [y/N]: ").strip().lower()
            if v in ("y", "yes"):
                answers[q["id"]] = True
        elif q["id"] == "social":
            entries = []
            while True:
                label = input("  social label (or Enter to stop): ").strip()
                if not label:
                    break
                url = input(f"    URL for {label}: ").strip()
                if url:
                    entries.append({"label": label, "url": url})
            if entries:
                answers["social"] = entries
        else:
            v = input("  > ").strip()
            if v:
                answers[q["id"]] = validate(q, v)
        print()
    return answers


def load_answers(path, questions):
    with open(path, encoding="utf-8") as fh:
        raw = json.load(fh)
    ids = {q["id"] for q in questions}
    by_id = {q["id"]: q for q in questions}
    for k, v in raw.items():
        if k not in ids:
            fail(f"answers.json has unknown question id: {k}")
        if k != "social" and by_id[k]["layer"] == "config":
            raw[k] = validate(by_id[k], v)
    return raw


EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
COLOR_RE = re.compile(r"^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$")


def validate(q, value):
    t = q["type"]
    if t == "email" and not EMAIL_RE.match(str(value)):
        fail(f"{q['id']}: {value!r} is not a valid email")
    if t == "url" and not re.match(r"^(https?://|/)", str(value)):
        fail(f"{q['id']}: {value!r} is not a URL (http(s):// or /path)")
    if t == "bool" and not isinstance(value, bool):
        fail(f"{q['id']}: expected true/false")
    if t == "color" and not COLOR_RE.match(str(value)):
        fail(f"{q['id']}: {value!r} is not a hex colour (#rgb or #rrggbb)")
    return value


# ------------------------------------------------------------ template render
IF_RE = re.compile(r"^\s*(?:#|//)\s*popular:if\s+(\w+)\s*$")
END_RE = re.compile(r"^\s*(?:#|//)\s*popular:end\s*$")
SOCIAL_RE = re.compile(r"^\s*(?:#|//)\s*popular:social\s*$")
PLACEHOLDER_RE = re.compile(r"\$\{(\w+)(?:\|([^}]*))?\}")


def render(text, answers, fmt):
    """Strip conditional blocks whose id is unanswered, expand the social
    block, then substitute ${id|default} placeholders."""
    out, skip_depth, keep_stack = [], 0, []
    for line in text.splitlines():
        m = IF_RE.match(line)
        if m:
            present = bool(answers.get(m.group(1)))
            keep_stack.append(present)
            if not present:
                skip_depth += 1
            continue
        if END_RE.match(line):
            if keep_stack and not keep_stack.pop():
                skip_depth -= 1
            continue
        if skip_depth:
            continue
        if SOCIAL_RE.match(line):
            out.append(render_social(answers.get("social", []), fmt).rstrip("\n"))
            continue
        out.append(line)
    rendered = "\n".join(out)

    def sub(mo):
        key, default = mo.group(1), mo.group(2) or ""
        val = answers.get(key)
        return str(val) if val is not None and not isinstance(val, (list, dict)) else default

    return PLACEHOLDER_RE.sub(sub, rendered)


def render_social(entries, fmt):
    if not entries:
        return ""
    def icon(label):
        return {"instagram": "fa-brands fa-instagram", "mastodon": "fa-brands fa-mastodon",
                "twitter": "fa-brands fa-x-twitter", "github": "fa-brands fa-github",
                "email": "fa-solid fa-envelope", "rss": "fa-solid fa-rss"}.get(
            label.strip().lower(), "fa-solid fa-link")
    if fmt == "hugo":
        blocks = []
        for e in entries:
            blocks.append(f'  [[params.social]]\n    label = "{e["label"]}"\n'
                          f'    icon  = "{icon(e["label"])}"\n    url   = "{e["url"]}"')
        return "\n".join(blocks)
    items = [f'  {{ label: {json.dumps(e["label"])}, icon: {json.dumps(icon(e["label"]))}, '
             f'url: {json.dumps(e["url"])} }},' for e in entries]
    return "\n".join(items)


# ------------------------------------------------------------------- outputs
BASE_URL_RE = re.compile(r"^(https?://[^/]+)(/.*)?$")


def split_site_base(base_url):
    """Split a deployment URL into Astro's ('site', 'base') pair.

    Hugo derives the subpath from baseURL alone; Astro needs the origin and
    the path as separate keys, and a project page (you.github.io/repo/) is a
    subpath. Returns ('https://you.github.io', '/repo'), or a base of '/' at
    a domain root. An unparseable value falls back to the starter defaults so
    a half-answered site still builds."""
    m = BASE_URL_RE.match((base_url or "").strip())
    if not m:
        return "https://example.com", "/"
    origin, path = m.group(1), m.group(2) or "/"
    return origin, (path.rstrip("/") or "/")


def slugify(text):
    """npm package names are lowercase and URL-safe."""
    slug = re.sub(r"[^a-z0-9]+", "-", str(text).lower()).strip("-")
    return slug or "my-community"


def brand_entries(answers):
    """Astro's BRAND is a single object literal, so its optional keys are built
    here rather than with a conditional block. Empty when nothing is answered,
    which keeps the rendered config byte-identical to the starter."""
    primary = answers.get("brand_primary")
    return f" primary: {json.dumps(primary)} " if primary else ""


def build_outputs(site, fmt, questions, answers, model="template"):
    """Return {relpath: content} for every file the wizard would write.

    `model` applies to Astro only (PACKAGING.md): "template" writes into a copy
    of the theme repo, "package" writes a small site that consumes the npm
    package. The content model and every answer are identical either way; only
    the file layout differs."""
    files = {}
    values = {**answers, "__brand_entries": brand_entries(answers)}
    files[config_path(site, fmt, model).replace(site + os.sep, "").replace(site + "/", "")] = \
        render(tmpl("hugo.toml.tmpl" if fmt == "hugo" else "config.ts.tmpl"), values, fmt).rstrip("\n") + "\n"

    if fmt == "astro":
        # Astro's site/base live in astro.config.mjs, not in the theme config,
        # and nothing else writes them: a project-page site without `base`
        # 404s every internal link. Derived, never asked (one URL answer).
        astro_site, astro_base = split_site_base(answers.get("base_url"))
        cfg_tmpl = "astro.config.package.mjs.tmpl" if model == "package" else "astro.config.mjs.tmpl"
        files["astro.config.mjs"] = render(
            tmpl(cfg_tmpl),
            {**answers, "__astro_site": astro_site, "__astro_base": astro_base}, fmt)

    if fmt == "astro" and model == "package":
        # A consumer repo is its own npm project: it depends on the theme
        # rather than containing it, and adopts the content model in one line.
        repo_name = slugify(answers.get("community_name") or "my-community")
        files["package.json"] = render(
            tmpl("package.json.tmpl"),
            {**answers, "__repo_name": repo_name, "__theme_version": latest_release()}, fmt)
        files["src/content.config.ts"] = render(tmpl("content.config.ts.tmpl"), answers, fmt)

    # Deploy workflow, parameterless by design (URL and subpath live in the
    # config above). Skipped when the site already has workflows of its own,
    # so this never fights an existing deployment.
    if not os.path.isdir(os.path.join(site, ".github", "workflows")):
        files[".github/workflows/deploy.yml"] = render(
            tmpl("deploy-hugo.yml.tmpl" if fmt == "hugo" else "deploy-astro.yml.tmpl"), answers, fmt)

    if answers.get("coc_contact"):
        coc_rel = "content/code-of-conduct.md" if fmt == "hugo" else "src/content/pages/code-of-conduct.mdx"
        # MDX rejects HTML comments; Hugo markdown renders JSX comments literally.
        comment = ("<!-- seeded by setup.py, edit freely -->" if fmt == "hugo"
                   else "{/* seeded by setup.py, edit freely */}")
        files[coc_rel] = render(tmpl("coc.md.tmpl"), {**answers, "__seed_comment": comment}, fmt)

    files["DECISIONS.md"] = build_decisions(questions, answers)
    files[".popular-setup.json"] = json.dumps(answers, indent=2, sort_keys=True) + "\n"
    return files


def build_decisions(questions, answers, revisit=False):
    today = os.environ.get("POPULAR_SETUP_DATE") or datetime.date.today().isoformat()
    lines = ["# Setup decisions", "",
             "Written by `scripts/setup.py`. The next organizer's answer to "
             '"why is it set up this way?" -- with citations.', ""]
    if revisit:
        lines += [f"## Revisited {today}", ""]
    answered, still_open = [], []
    for q in questions:
        a = answers.get(q["id"])
        cite = f" ([handbook]({q['handbook_url']}))" if q["handbook_url"] else ""
        if a is not None:
            shown = ", ".join(e["label"] for e in a) if isinstance(a, list) else a
            answered.append(f"- **{q['prompt']}** {shown}{cite}")
        else:
            still_open.append(f"- {q['prompt']}{cite}")
    lines += [f"## Decided ({today})", ""] + answered + ["", "## Still open", ""] + still_open + [""]
    return "\n".join(lines)


# --------------------------------------------------------- pristine adoption
def pristine_map(fmt):
    """For each file the wizard writes, the set of theme-shipped starter/demo
    contents that count as 'pristine'. A site file whose current bytes are in
    this set was shipped by the theme, not written by the organizer, so the
    wizard may adopt (overwrite) it on a first run without --force. The instant
    someone edits it, the byte-match breaks and the file is protected again.

    Located relative to the script, so it works from an installed theme
    (Hugo: themes/popular/; Astro: the template repo itself)."""
    root = os.path.abspath(os.path.join(HERE, ".."))

    def contents(paths):
        out = set()
        for p in paths:
            try:
                with open(p, encoding="utf-8") as fh:
                    out.add(fh.read())
            except OSError:
                pass
        return out

    if fmt == "hugo":
        return {
            "hugo.toml": contents(
                [os.path.join(root, "exampleSite", "hugo.toml")]
                + glob.glob(os.path.join(root, "demos", "*", "hugo.toml"))),
            "content/code-of-conduct.md": contents(
                [os.path.join(root, "exampleSite", "content", "code-of-conduct.md")]
                + glob.glob(os.path.join(root, "demos", "*", "content", "code-of-conduct.md"))),
        }
    # Since packaging phase 3 a demo is a package consumer, so its config is
    # `popular.config.ts` and its content sits under `src/`. The template-model
    # copies in the theme root are fingerprints too, and stay so until the
    # cutover removes them.
    return {
        "src/config.ts": contents(
            [os.path.join(root, "src", "config.ts")]
            + glob.glob(os.path.join(root, "demos", "*", "popular.config.ts"))),
        "src/content/pages/code-of-conduct.mdx": contents(
            [os.path.join(root, "src", "content", "pages", "code-of-conduct.mdx")]
            + glob.glob(os.path.join(root, "demos", "*", "src", "content", "pages",
                                     "code-of-conduct.mdx"))),
        # The template repo ships a runnable astro.config.mjs; an unedited one
        # is the theme's, not the organizer's, so the wizard may write site/base
        # into it on a first run.
        "astro.config.mjs": contents([os.path.join(root, "astro.config.mjs")]),
    }


# ------------------------------------------------------------- write contract
def apply(site, files, force, dry_run, adopt=None):
    adopt = adopt or {}
    diffs, refused, adopted = [], [], []
    for rel, content in sorted(files.items()):
        path = os.path.join(site, rel)
        old = ""
        if os.path.exists(path):
            with open(path, encoding="utf-8") as fh:
                old = fh.read()
        if old == content:
            continue
        # A file whose current content is exactly what the theme shipped as a
        # starter/demo is not the organizer's work: adopt it without --force.
        pristine = os.path.exists(path) and old in adopt.get(rel, ())
        # DECISIONS.md is append-friendly; never refuse on it.
        protected = os.path.exists(path) and rel != "DECISIONS.md" and not force and not pristine
        if protected:
            refused.append(rel)
        elif pristine and not force:
            adopted.append(rel)
        diff = "".join(difflib.unified_diff(old.splitlines(True), content.splitlines(True),
                                            f"a/{rel}", f"b/{rel}"))
        diffs.append(diff)
    print("".join(diffs) if diffs else "No changes.")
    if dry_run:
        print("\n(--dry-run: nothing written)")
        return 0
    if refused:
        sys.stderr.write("\nsetup.py: refusing to overwrite existing files: "
                         + ", ".join(refused) + "\n  re-run with --force to overwrite.\n")
        return 1
    for rel, content in files.items():
        path = os.path.join(site, rel)
        os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(content)
    if adopted:
        print("Adopted unedited starter file(s): " + ", ".join(sorted(adopted)) + ".")
    print(f"\nWrote {len(files)} file(s). See DECISIONS.md for what was decided and what's still open.")
    return 0


# ----------------------------------------------------------------------- main
def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--site", default=".", help="target site directory (default: .)")
    ap.add_argument("--answers", help="JSON {id: value} file; non-interactive")
    ap.add_argument("--format", choices=["hugo", "astro"], help="override format detection")
    ap.add_argument("--astro-model", choices=["template", "package"],
                    help="Astro only: 'template' vendors the theme repo, 'package' consumes the "
                         "npm package (default: detected, 'template' for an unknown site)")
    ap.add_argument("--dry-run", action="store_true", help="print the diff, write nothing")
    ap.add_argument("--force", action="store_true",
                    help="overwrite files you have customized (unedited starter files are adopted automatically)")
    args = ap.parse_args(argv)

    site = os.path.abspath(args.site)
    if not os.path.isdir(site):
        fail(f"--site {args.site} is not a directory", code=2)
    fmt = args.format or detect(site)
    model = args.astro_model or (detect_astro_model(site) if fmt == "astro" else "template")
    questions = find_schema()

    if args.answers:
        answers = load_answers(args.answers, questions)
    elif sys.stdin.isatty():
        answers = gather_interactive(questions)
    else:
        fail("no --answers file and not a TTY; nothing to do", code=2)

    files = build_outputs(site, fmt, questions, answers, model)
    return apply(site, files, args.force, args.dry_run, pristine_map(fmt))


if __name__ == "__main__":
    sys.exit(main())

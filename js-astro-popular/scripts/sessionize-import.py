#!/usr/bin/env python3
"""Import Sessionize sessions & speakers into Popular's content model.

Sessionize (sessionize.com) exposes a public JSON endpoint per event once the
organizer creates one under "API / Embeds": no authentication needed. This
script converts that JSON into the theme's `events/` and `speakers/` content
types, in Hugo (TOML) or Astro (YAML) front matter.

Usage:
  python3 scripts/sessionize-import.py --url https://sessionize.com/api/v2/<embed-id>/view/All --site path/to/site
  python3 scripts/sessionize-import.py --id <embed-id> --site .
  python3 scripts/sessionize-import.py --site .   # reads popular-import.toml
  python3 scripts/sessionize-import.py --file all.json --site . --dry-run

Store your event's endpoint once in <site>/popular-import.toml and drop the
flag entirely:

  [sessionize]
  id = "<embed-id>"        # or: url = "https://sessionize.com/api/v2/.../view/All"

Options:
  --url URL        Sessionize "view/All" endpoint
  --id EMBED_ID    Sessionize API/Embeds id (shorthand; builds the URL)
  --file PATH      read the JSON from disk instead of the network
  --site PATH      site root to write into (default: current directory).
                   Format is auto-detected: hugo.toml → Hugo TOML under
                   content/; a src/content/ dir → Astro YAML there; a root
                   config.ts (a demo source dir) → Astro YAML under content/.
                   Override with --format.
  --format hugo|astro
  --rsvp URL       rsvp link to stamp on every imported event (optional)
  --force          overwrite existing files (default: skip, so your edits are safe)
  --dry-run        print what would be written without touching anything

Existing files are never overwritten unless --force: import once, then edit
freely. Speaker photos use Sessionize's hosted URLs. This file ships
identically in hugo-theme-popular and astro-theme-popular (see PARITY.md Tier 1).
"""
import argparse
import json
import pathlib
import re
import sys
import tomllib
import unicodedata
import urllib.request
from datetime import datetime

SOCIAL_ICONS = {
    "Twitter": "fa-brands fa-x-twitter",
    "X": "fa-brands fa-x-twitter",
    "LinkedIn": "fa-brands fa-linkedin",
    "Instagram": "fa-brands fa-instagram",
    "Facebook": "fa-brands fa-facebook",
    "YouTube": "fa-brands fa-youtube",
    "Mastodon": "fa-brands fa-mastodon",
    "Bluesky": "fa-brands fa-bluesky",
    "GitHub": "fa-brands fa-github",
}
WEBSITE_TYPES = {"Blog", "Company_Website", "Other"}


def slugify(text, fallback="untitled"):
    """Unicode-preserving slug, mirroring the theme's tagSlug (src/lib/slugs.ts):
    lowercase, quotes dropped, runs of non-letter/number become hyphens.
    Latin accents fold to ASCII; other scripts (한글, кириллица) are kept."""
    text = unicodedata.normalize("NFKC", str(text)).lower()
    folded = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    if any(ch.isalnum() for ch in folded):
        text = folded
    text = re.sub(r"['\"]+", "", text)
    text = re.sub(r"[\W_]+", "-", text, flags=re.UNICODE).strip("-")
    return text or fallback


def unique_slug(text, seen, fallback="untitled"):
    """Slugify with -2/-3 suffixes so two names never share a file."""
    base = slugify(text, fallback)
    slug, n = base, 1
    while slug in seen:
        n += 1
        slug = f"{base}-{n}"
    seen.add(slug)
    return slug


def q(s):
    """JSON string quoting is valid in both TOML and YAML."""
    return json.dumps(s or "", ensure_ascii=False)


def clock(iso):
    t = datetime.fromisoformat(iso)
    return f"{(t.hour % 12) or 12}:{t.minute:02d}", "AM" if t.hour < 12 else "PM"


def time_range(starts, ends):
    if not starts:
        return ""
    s, s_ap = clock(starts)
    if not ends:
        return f"{s} {s_ap}"
    e, e_ap = clock(ends)
    return f"{s} – {e} {e_ap}" if s_ap == e_ap else f"{s} {s_ap} – {e} {e_ap}"


def first_para(text, limit=200):
    para = (text or "").strip().split("\n")[0].strip()
    return para if len(para) <= limit else para[: limit - 1].rsplit(" ", 1)[0] + "…"


def sessionize_url(embed_id):
    return f"https://sessionize.com/api/v2/{embed_id}/view/All"


def stored_source(site):
    """The site's stored Sessionize endpoint, from <site>/popular-import.toml
    ([sessionize] url = "..." or id = "..."), or None."""
    cfg = site / "popular-import.toml"
    if not cfg.exists():
        return None
    section = tomllib.loads(cfg.read_text()).get("sessionize") or {}
    if section.get("url"):
        return section["url"]
    if section.get("id"):
        return sessionize_url(section["id"])
    return None


def detect(site):
    if (site / "hugo.toml").exists() or (site / "config.toml").exists():
        return "hugo", site / "content"
    if (site / "src" / "content").exists():
        return "astro", site / "src" / "content"
    if (site / "config.ts").exists():  # an Astro demo source dir
        return "astro", site / "content"
    sys.exit(f"Cannot detect site format in {site}; pass --format explicitly.")


def speaker_page(s, fmt):
    name, tagline = s.get("fullName") or "", s.get("tagLine") or ""
    bio_full = (s.get("bio") or "").strip()
    website, socials = "", []
    for link in s.get("links") or []:
        icon = SOCIAL_ICONS.get(link.get("linkType") or link.get("title"))
        if icon:
            socials.append((link.get("title") or link["linkType"], icon, link["url"]))
        elif not website and (link.get("linkType") in WEBSITE_TYPES or link.get("url")):
            website = link["url"]
    if fmt == "hugo":
        lines = ["+++", f"title = {q(name)}"]
        if tagline: lines.append(f"role = {q(tagline)}")
        if s.get("profilePicture"): lines.append(f"photo = {q(s['profilePicture'])}")
        if bio_full: lines.append(f"bio = {q(first_para(bio_full))}")
        if website: lines.append(f"website = {q(website)}")
        for label, icon, url in socials:
            lines += ["[[social]]", f"  label = {q(label)}", f"  icon = {q(icon)}", f"  url = {q(url)}"]
        lines.append("+++")
    else:
        lines = ["---", f"title: {q(name)}"]
        if tagline: lines.append(f"role: {q(tagline)}")
        if s.get("profilePicture"): lines.append(f"photo: {q(s['profilePicture'])}")
        if bio_full: lines.append(f"bio: {q(first_para(bio_full))}")
        if website: lines.append(f"website: {q(website)}")
        if socials:
            lines.append("social:")
            for label, icon, url in socials:
                lines.append(f"  - {{ label: {q(label)}, icon: {q(icon)}, url: {q(url)} }}")
        lines.append("---")
    return "\n".join(lines) + "\n\n" + bio_full + "\n"


def event_page(sess, rooms, speaker_slugs, fmt, rsvp):
    desc_full = (sess.get("description") or "").strip()
    room = rooms.get(sess.get("roomId"), "")
    slugs = [speaker_slugs[i] for i in sess.get("speakers") or [] if i in speaker_slugs]
    fields = [
        ("title", q(sess.get("title") or "Untitled session")),
        ("date", sess.get("startsAt") or ""),
        ("description", q(first_para(desc_full))),
        ("time", q(time_range(sess.get("startsAt"), sess.get("endsAt")))),
    ]
    if fmt == "hugo":
        lines = ["+++"] + [f"{k} = {v}" for k, v in fields if v not in ("", '""')]
        if room: lines.append(f"venue = {q(room)}")
        if slugs: lines.append(f"speakers = {json.dumps(slugs)}")
        if rsvp: lines.append(f"rsvp = {q(rsvp)}")
        lines.append("+++")
    else:
        lines = ["---"] + [f"{k}: {v}" for k, v in fields if v not in ("", '""')]
        if room: lines.append(f"venue: {q(room)}")
        if slugs: lines.append(f"speakers: {json.dumps(slugs)}")
        if rsvp: lines.append(f"rsvp: {q(rsvp)}")
        lines.append("---")
    return "\n".join(lines) + "\n\n" + desc_full + "\n"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    src = ap.add_mutually_exclusive_group()
    src.add_argument("--url")
    src.add_argument("--id", help="Sessionize API/Embeds id")
    src.add_argument("--file")
    ap.add_argument("--site", default=".")
    ap.add_argument("--format", choices=["hugo", "astro"])
    ap.add_argument("--rsvp", default="")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    url = args.url or (sessionize_url(args.id) if args.id else None) \
        or stored_source(pathlib.Path(args.site))
    if args.file:
        data = json.loads(pathlib.Path(args.file).read_text())
    elif url:
        with urllib.request.urlopen(url) as resp:
            data = json.loads(resp.read())
    else:
        sys.exit("No source: pass --url/--id/--file, or store the endpoint in "
                 "popular-import.toml ([sessionize] id = \"<embed-id>\").")

    site = pathlib.Path(args.site).resolve()
    if args.format:
        fmt = args.format
        content = site / ("content" if fmt == "hugo" or (site / "content").exists() else "src/content")
    else:
        fmt, content = detect(site)

    rooms = {r["id"]: r["name"] for r in data.get("rooms") or []}
    speaker_slugs, written, skipped = {}, 0, 0

    def emit(path, text):
        nonlocal written, skipped
        if path.exists() and not args.force:
            print(f"skip (exists): {path}")
            skipped += 1
            return
        print(f"{'would write' if args.dry_run else 'write'}: {path}")
        if not args.dry_run:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)
        written += 1

    seen_speakers = set()
    for s in data.get("speakers") or []:
        slug = unique_slug(s.get("fullName") or "", seen_speakers, fallback=str(s["id"]))
        speaker_slugs[s["id"]] = slug
        emit(content / "speakers" / f"{slug}.md", speaker_page(s, fmt))

    seen_events = set()
    for sess in data.get("sessions") or []:
        if sess.get("isServiceSession"):
            continue
        slug = unique_slug(sess.get("title") or "", seen_events, fallback=str(sess["id"]))
        emit(content / "events" / f"{slug}.md",
             event_page(sess, rooms, speaker_slugs, fmt, args.rsvp))

    print(f"done ({fmt}): {written} written, {skipped} skipped. Review the files, then build.")


if __name__ == "__main__":
    main()

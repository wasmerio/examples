#!/usr/bin/env python3
"""Import speakers, venues, sponsors, organizers and events from a spreadsheet
into Popular's content model, for communities that don't use Sessionize.

One workbook, one tab per content type (any subset is fine):
  Speakers   Name, Role, Bio, Photo, Website, Mastodon, LinkedIn, GitHub
  Venues     Name, Address, Notes, Accessibility, Website, Photo
  Sponsors   Name, Level, Description, Logo, Website
  Organizers Name, Weight, Role, Photo, Description, Website
  Events     Title, Date, Time, Venue, Speakers, Checkin, Venue Notes, RSVP, Tags, Description

The Events tab cross-references the others by name: a Venue matching a Venues
row becomes a `venueRef` (unknown names stay as a plain venue string), and the
comma-separated Speakers column becomes `speakers = ["slug"]` references.

No dependencies: .xlsx files are read (and the sample is written) with the
standard library only. CSVs exported one-per-tab work too.

Usage:
  python3 scripts/spreadsheet-import.py --make-sample community.xlsx   # starter workbook
  python3 scripts/spreadsheet-import.py --xlsx community.xlsx --site .
  python3 scripts/spreadsheet-import.py --csv-dir exported/ --site .   # speakers.csv, events.csv, …
Options: --format hugo|astro (auto-detected), --force, --dry-run.

Existing files are never overwritten unless --force: import once, edit freely.
This file ships identically in hugo-theme-popular and astro-theme-popular (PARITY.md).
"""
import argparse
import csv
import io
import json
import pathlib
import re
import sys
import unicodedata
import zipfile
from datetime import datetime, timedelta
from xml.etree import ElementTree as ET
from xml.sax.saxutils import escape

TABS = ("speakers", "venues", "sponsors", "organizers", "events")
SOCIAL_COLS = {"mastodon": "fa-brands fa-mastodon", "linkedin": "fa-brands fa-linkedin", "github": "fa-brands fa-github"}
NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
REL = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"

SAMPLE = {
    "Speakers": [
        ["Name", "Role", "Bio", "Photo", "Website", "Mastodon", "LinkedIn", "GitHub"],
        ["Jordan Rivera", "Community wrangler at Example Co.", "Jordan has organized meetups on three continents.", "https://example.com/jordan.jpg", "https://example.com/jordan", "https://example.com/@jordan", "", ""],
        ["Sasha Chen", "First-time speaker, long-time lurker", "Sasha runs the door table and tells everyone it is the best job.", "", "", "", "https://example.com/in/sasha", ""],
    ],
    "Venues": [
        ["Name", "Address", "Notes", "Accessibility", "Wheelchair", "Transit", "Parking", "Access", "Website", "Photo"],
        ["Community Hall", "123 Your Street", "Buzz 204 at the side door; elevator to level 2.", "Step-free access via the main entrance; accessible washroom on site.", "Yes", "Two blocks from Central station.", "Free street parking after 6pm.", "Gender-neutral washrooms on level 2; quiet room on request.", "https://example.com", ""],
    ],
    "Sponsors": [
        ["Name", "Level", "Description", "Logo", "Website"],
        ["Example Coffee Co.", "Snack sponsor", "Keeps the welcome table caffeinated.", "", "https://example.com"],
    ],
    "Organizers": [
        ["Name", "Weight", "Role", "Photo", "Description", "Website"],
        ["Sam Example", "10", "Lead organizer", "", "Replace with a short, friendly bio.", "https://example.com"],
    ],
    "Events": [
        ["Title", "Date", "Time", "Venue", "Speakers", "Checkin", "Venue Notes", "RSVP", "Tags", "Description"],
        ["Community Kickoff", "2026-09-19T18:00:00", "6:00 – 8:30 PM", "Community Hall", "Jordan Rivera, Sasha Chen", "Bring your registration email (print or phone) and photo ID.", "", "https://example.com/rsvp", "meetup, social", "Describe the event in a sentence or two."],
    ],
}


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
    return json.dumps(str(s or ""), ensure_ascii=False)


# ---------- minimal xlsx read/write (stdlib only) ----------

def col_index(ref):
    n = 0
    for ch in ref:
        if ch.isalpha():
            n = n * 26 + (ord(ch.upper()) - 64)
        else:
            break
    return n - 1


def read_xlsx(path):
    z = zipfile.ZipFile(path)
    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        root = ET.fromstring(z.read("xl/sharedStrings.xml"))
        for si in root.findall(f"{NS}si"):
            shared.append("".join(t.text or "" for t in si.iter(f"{NS}t")))
    wb = ET.fromstring(z.read("xl/workbook.xml"))
    rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
    targets = {r.get("Id"): r.get("Target").lstrip("/") for r in rels}
    sheets = {}
    for sh in wb.find(f"{NS}sheets"):
        target = targets[sh.get(f"{REL}id")]
        if not target.startswith("xl/"):
            target = "xl/" + target
        rows = []
        ws = ET.fromstring(z.read(target))
        for row in ws.iter(f"{NS}row"):
            cells = {}
            for c in row.iter(f"{NS}c"):
                idx = col_index(c.get("r", "A"))
                t = c.get("t")
                if t == "inlineStr":
                    val = "".join(x.text or "" for x in c.iter(f"{NS}t"))
                else:
                    v = c.find(f"{NS}v")
                    val = v.text if v is not None else ""
                    if t == "s" and val != "":
                        val = shared[int(val)]
                cells[idx] = val or ""
            if cells:
                width = max(cells) + 1
                rows.append([cells.get(i, "") for i in range(width)])
        sheets[sh.get("name").strip().lower()] = rows
    return sheets


def write_xlsx(path, sheets):
    ct = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
          '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
          '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
          '<Default Extension="xml" ContentType="application/xml"/>',
          '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>']
    wb, wbrels = [], []
    files = {}
    for i, (name, rows) in enumerate(sheets.items(), start=1):
        ct.append(f'<Override PartName="/xl/worksheets/sheet{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>')
        wb.append(f'<sheet name="{escape(name)}" sheetId="{i}" r:id="rId{i}"/>')
        wbrels.append(f'<Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{i}.xml"/>')
        xml_rows = []
        for r, row in enumerate(rows, start=1):
            cells = "".join(
                f'<c r="{chr(65 + ci)}{r}" t="inlineStr"><is><t>{escape(str(v))}</t></is></c>'
                for ci, v in enumerate(row))
            xml_rows.append(f'<row r="{r}">{cells}</row>')
        files[f"xl/worksheets/sheet{i}.xml"] = (
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            f'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>{"".join(xml_rows)}</sheetData></worksheet>')
    ct.append("</Types>")
    files["[Content_Types].xml"] = "".join(ct)
    files["_rels/.rels"] = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>')
    files["xl/workbook.xml"] = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        f'<sheets>{"".join(wb)}</sheets></workbook>')
    files["xl/_rels/workbook.xml.rels"] = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        f'{"".join(wbrels)}</Relationships>')
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        for name, text in files.items():
            z.writestr(name, text)


# ---------- table helpers ----------

def to_records(rows):
    if not rows:
        return []
    headers = [str(h).strip().lower() for h in rows[0]]
    out = []
    for row in rows[1:]:
        rec = {headers[i]: str(row[i]).strip() if i < len(row) else "" for i in range(len(headers))}
        if any(rec.values()):
            out.append(rec)
    return out


def excel_serial_to_iso(value):
    try:
        serial = float(value)
    except (TypeError, ValueError):
        return value
    dt = datetime(1899, 12, 30) + timedelta(days=serial)
    return dt.strftime("%Y-%m-%dT%H:%M:%S")


def fm(fmt, pairs, socials=(), arrays=()):
    """pairs: [(key, value)]; arrays: [(key, [items])]; socials: [(label, icon, url)]."""
    if fmt == "hugo":
        lines = ["+++"] + [f"{k} = {v if k in ('date', 'weight', 'wheelchair') else q(v)}" for k, v in pairs if v]
        for k, items in arrays:
            if items:
                lines.append(f"{k} = {json.dumps(items)}")
        for label, icon, url in socials:
            lines += ["[[social]]", f"  label = {q(label)}", f"  icon = {q(icon)}", f"  url = {q(url)}"]
        lines.append("+++")
    else:
        lines = ["---"] + [f"{k}: {v if k in ('date', 'weight', 'wheelchair') else q(v)}" for k, v in pairs if v]
        for k, items in arrays:
            if items:
                lines.append(f"{k}: {json.dumps(items)}")
        if socials:
            lines.append("social:")
            for label, icon, url in socials:
                lines.append(f"  - {{ label: {q(label)}, icon: {q(icon)}, url: {q(url)} }}")
        lines.append("---")
    return "\n".join(lines) + "\n"


def detect(site):
    if (site / "hugo.toml").exists() or (site / "config.toml").exists():
        return "hugo", site / "content"
    if (site / "src" / "content").exists():
        return "astro", site / "src" / "content"
    if (site / "config.ts").exists():
        return "astro", site / "content"
    sys.exit(f"Cannot detect site format in {site}; pass --format explicitly.")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--xlsx")
    src.add_argument("--csv-dir")
    src.add_argument("--make-sample", metavar="PATH")
    ap.add_argument("--site", default=".")
    ap.add_argument("--format", choices=["hugo", "astro"])
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if args.make_sample:
        write_xlsx(args.make_sample, SAMPLE)
        print(f"sample workbook written: {args.make_sample}")
        return

    if args.xlsx:
        sheets = read_xlsx(args.xlsx)
    else:
        sheets = {}
        for f in pathlib.Path(args.csv_dir).glob("*.csv"):
            sheets[f.stem.strip().lower()] = list(csv.reader(io.StringIO(f.read_text())))

    site = pathlib.Path(args.site).resolve()
    if args.format:
        fmt = args.format
        content = site / ("content" if (site / "content").exists() or fmt == "hugo" else "src/content")
    else:
        fmt, content = detect(site)

    tabs = {t: to_records(sheets.get(t, [])) for t in TABS}
    seen_v, seen_s = set(), set()
    venue_slugs = {r["name"]: unique_slug(r["name"], seen_v) for r in tabs["venues"] if r.get("name")}
    speaker_slugs = {r["name"]: unique_slug(r["name"], seen_s) for r in tabs["speakers"] if r.get("name")}
    written = skipped = 0

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

    for r in tabs["speakers"]:
        socials = [(k.title(), icon, r[k]) for k, icon in SOCIAL_COLS.items() if r.get(k)]
        emit(content / "speakers" / f"{speaker_slugs[r['name']]}.md",
             fm(fmt, [("title", r.get("name")), ("role", r.get("role")), ("photo", r.get("photo")),
                      ("bio", r.get("bio")), ("website", r.get("website"))], socials=socials))

    for r in tabs["venues"]:
        emit(content / "venues" / f"{venue_slugs[r['name']]}.md",
             fm(fmt, [("title", r.get("name")), ("address", r.get("address")), ("photo", r.get("photo")),
                      ("notes", r.get("notes")), ("accessibility", r.get("accessibility")),
                      ("wheelchair", "true" if str(r.get("wheelchair", "")).strip().lower() in ("yes", "true", "1") else None),
                      ("transit", r.get("transit")), ("parking", r.get("parking")),
                      ("access", r.get("access")), ("website", r.get("website"))]))

    if tabs["sponsors"] and fmt == "astro":
        print("note: skipping Sponsors tab for Astro (sponsors are a Hugo directory-trick "
              "section; see the content-model docs to add a sponsors collection).")
        tabs["sponsors"] = []
    if tabs["sponsors"]:
        # sponsors reuse the organizers layout via a typed section (see docs)
        idx = content / "sponsors" / "_index.md"
        if not idx.exists():
            emit(idx, '+++\ntitle = "Our sponsors"\ntype = "organizers"\neyebrow = "Sponsors"\nlead = "The organizations that keep our events free."\n+++\n')
    seen_sp = set()
    for i, r in enumerate(tabs["sponsors"], start=1):
        emit(content / "sponsors" / f"{unique_slug(r['name'], seen_sp)}.md",
             fm(fmt, [("title", r.get("name")), ("weight", str(i * 10)), ("role", r.get("level")),
                      ("photo", r.get("logo")), ("description", r.get("description")),
                      ("website", r.get("website"))]))

    seen_o = set()
    for i, r in enumerate(tabs["organizers"], start=1):
        emit(content / "organizers" / f"{unique_slug(r['name'], seen_o)}.md",
             fm(fmt, [("title", r.get("name")), ("weight", r.get("weight") or str(i * 10)),
                      ("role", r.get("role")), ("photo", r.get("photo")),
                      ("description", r.get("description")), ("website", r.get("website"))]))

    seen_e = set()
    for r in tabs["events"]:
        date = excel_serial_to_iso(r.get("date", ""))
        venue = r.get("venue", "")
        pairs = [("title", r.get("title")), ("date", date), ("description", r.get("description")),
                 ("time", r.get("time"))]
        arrays = []
        if venue in venue_slugs:
            pairs.append(("venueRef", venue_slugs[venue]))
        elif venue:
            pairs.append(("venue", venue))
        names = [n.strip() for n in (r.get("speakers") or "").split(",") if n.strip()]
        known = [speaker_slugs[n] for n in names if n in speaker_slugs]
        unknown = [n for n in names if n not in speaker_slugs]
        if known:
            arrays.append(("speakers", known))
        if unknown:
            pairs.append(("speaker", ", ".join(unknown)))
        pairs += [("checkin", r.get("checkin")), ("venueNotes", r.get("venue notes")),
                  ("rsvp", r.get("rsvp"))]
        tags = [t.strip() for t in (r.get("tags") or "").split(",") if t.strip()]
        if tags:
            arrays.append(("tags", tags))
        body = (r.get("description") or "") + "\n"
        emit(content / "events" / f"{unique_slug(r['title'], seen_e)}.md", fm(fmt, pairs, arrays=arrays) + "\n" + body)

    print(f"done ({fmt}): {written} written, {skipped} skipped. Review the files, then build.")


if __name__ == "__main__":
    main()

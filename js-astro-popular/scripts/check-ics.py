#!/usr/bin/env python3
"""Validate iCalendar (.ics) feeds in a built site.

Usage: python3 scripts/check-ics.py <built-dir> [<built-dir> ...]

Checks, per feed: CRLF line endings, every line <= 75 octets (folded),
required VCALENDAR/VEVENT properties, UID present + absolute + unique, and
that the escaped text properties (PRODID, X-WR-CALNAME, SUMMARY, LOCATION,
DESCRIPTION) contain no bare `;` or `,` and no stray backslash (RFC 5545
section 3.3.11).
Shared between both repos (PARITY Tier 1)."""
import sys
import pathlib

# The properties both templates run through their escape helper
# (ics-escape.html / icsEscape): the per-event text plus the two header values
# built from the site title. URL, UID and the date properties are not TEXT
# values and legitimately contain unescaped delimiters.
ESCAPED_TEXT_PROPERTIES = ("PRODID", "X-WR-CALNAME", "SUMMARY", "LOCATION", "DESCRIPTION")

# What may follow a backslash in a TEXT value (RFC 5545 section 3.3.11).
ESCAPABLE = frozenset(r"\;,nN")


def text_escape_problem(value):
    """Return a description of the first escaping fault in a TEXT value, or
    None when it is well-formed. A bare `;` or `,` is the bug this catches:
    a calendar client reads it as a delimiter and truncates the value."""
    i = 0
    while i < len(value):
        ch = value[i]
        if ch == "\\":
            if i + 1 >= len(value) or value[i + 1] not in ESCAPABLE:
                return f"stray backslash at offset {i}"
            i += 2
            continue
        if ch in ";,":
            return f"unescaped {ch!r} at offset {i}"
        i += 1
    return None


def check_feed(path):
    raw = path.read_bytes()
    errors = []
    # CRLF: every line must end CRLF; no bare LF
    if b"\r\n" not in raw:
        errors.append(f"{path}: no CRLF line endings")
    text = raw.decode("utf-8")
    lines = text.split("\r\n")
    for ln in lines:
        if len(ln.encode("utf-8")) > 75:
            errors.append(f"{path}: line exceeds 75 octets: {ln[:40]!r}...")
    # unfold (continuation lines start with a space) for property checks
    unfolded = []
    for ln in lines:
        if ln.startswith(" ") and unfolded:
            unfolded[-1] += ln[1:]
        else:
            unfolded.append(ln)
    props = [l.split(":", 1)[0].split(";", 1)[0] for l in unfolded if l]
    for req in ("BEGIN", "VERSION", "PRODID", "END"):
        if req not in props:
            errors.append(f"{path}: missing {req}")
    uids = [l.split(":", 1)[1] for l in unfolded if l.startswith("UID:")]
    for uid in uids:
        if not (uid.startswith("http://") or uid.startswith("https://")):
            errors.append(f"{path}: UID not absolute: {uid!r}")
    if len(uids) != len(set(uids)):
        errors.append(f"{path}: duplicate UIDs")
    # escaping, checked on the unfolded line so a `\;` split across a fold
    # boundary is still read as one escape sequence
    for ln in unfolded:
        name, sep, value = ln.partition(":")
        if not sep:
            continue
        prop = name.split(";", 1)[0]
        if prop in ESCAPED_TEXT_PROPERTIES:
            problem = text_escape_problem(value)
            if problem:
                errors.append(f"{path}: {prop} {problem}: {value[:40]!r}")
    vevents = props.count("BEGIN") - 1  # minus VCALENDAR
    return errors, len(uids), vevents


def main(dirs):
    errors = []
    feeds = 0
    for d in dirs:
        for ics in pathlib.Path(d).rglob("*.ics"):
            feeds += 1
            errs, uids, ve = check_feed(ics)
            errors += errs
    if errors:
        print("\n".join(errors))
        print(f"FAIL: {len(errors)} problem(s) across {feeds} feed(s)")
        return 1
    print(f"OK: {feeds} iCalendar feed(s) valid")
    return 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("usage: check-ics.py <built-dir> [...]")
    sys.exit(main(sys.argv[1:]))

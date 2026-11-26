"""The event `time` -> startDate parsing contract (PARITY.md).

Pure re-implementation of the rule shared by partials/jsonld-event.html and
src/lib/eventld.ts; both must agree with this table."""
import re
import unittest

VECTORS = [
    ("6:00 PM", "18:00"),
    ("18:30", "18:30"),
    ("12:00 AM", "00:00"),
    ("12:00 PM", "12:00"),
    ("6:00 PM · doors 5:30", "18:00"),
    ("doors at 5:30", None),
    (None, None),
    ("25:00", None),
    ("9:99", None),
]


def parse_time(raw):
    m = re.match(r"^(\d{1,2}):(\d{2})\s*(am|pm)?", (raw or "").strip(), re.I)
    if not m:
        return None
    h, minute, mer = int(m.group(1)), int(m.group(2)), (m.group(3) or "").lower()
    if mer:
        if h < 1 or h > 12:
            return None
        if mer == "pm" and h < 12:
            h += 12
        if mer == "am" and h == 12:
            h = 0
    elif h > 23:
        return None
    if minute > 59:
        return None
    return f"{h:02d}:{minute:02d}"


class EventTime(unittest.TestCase):
    def test_vectors(self):
        for raw, expected in VECTORS:
            self.assertEqual(parse_time(raw), expected, f"time={raw!r}")


if __name__ == "__main__":
    unittest.main()

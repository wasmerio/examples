"""check-ics.py: the built-feed validator, with the text-escaping check that
guards the `\\;` / `\\,` contract both templates must honor (PARITY.md,
"iCalendar feed"). The feeds here are built inline, CRLF-terminated, so the
tests need no fixtures and no site build."""
import pathlib
import tempfile
import unittest

from helpers import load_script, run_script

check_ics = load_script("check-ics.py")

HEADER = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Your Community//Popular theme//EN",
    "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
]
FOOTER = ["END:VCALENDAR"]


def event(*extra):
    return [
        "BEGIN:VEVENT",
        "UID:https://example.com/events/first-meetup/",
        "DTSTAMP:20260101T000000Z",
        "DTSTART;VALUE=DATE:20260301",
        *extra,
        "URL:https://example.com/events/first-meetup/",
        "END:VEVENT",
    ]


def feed(*lines):
    return ("\r\n".join([*HEADER, *lines, *FOOTER]) + "\r\n").encode("utf-8")


class CheckFeed(unittest.TestCase):
    def check(self, content):
        with tempfile.TemporaryDirectory() as d:
            path = pathlib.Path(d) / "calendar.ics"
            path.write_bytes(content)
            errors, uids, vevents = check_ics.check_feed(path)
        return errors, uids, vevents

    def test_well_formed_feed_passes(self):
        errors, uids, vevents = self.check(feed(*event(
            "SUMMARY:Workshop\\; bring a laptop",
            "LOCATION:Community Hall\\, 1 Main St",
            "DESCRIPTION:Line one\\nLine two \\\\ backslash",
        )))
        self.assertEqual(errors, [])
        self.assertEqual((uids, vevents), (1, 1))

    def test_unescaped_semicolon_in_summary(self):
        errors, _, _ = self.check(feed(*event("SUMMARY:Workshop; bring a laptop")))
        self.assertEqual(len(errors), 1)
        self.assertIn("SUMMARY unescaped ';'", errors[0])

    def test_unescaped_comma_in_location(self):
        errors, _, _ = self.check(feed(*event("LOCATION:Community Hall, 1 Main St")))
        self.assertEqual(len(errors), 1)
        self.assertIn("LOCATION unescaped ','", errors[0])

    def test_unescaped_delimiter_in_description(self):
        errors, _, _ = self.check(feed(*event("DESCRIPTION:Doors at 6; talks at 7")))
        self.assertEqual(len(errors), 1)
        self.assertIn("DESCRIPTION unescaped ';'", errors[0])

    def test_stray_backslash(self):
        errors, _, _ = self.check(feed(*event("SUMMARY:C:\\temp")))
        self.assertEqual(len(errors), 1)
        self.assertIn("SUMMARY stray backslash", errors[0])
        errors, _, _ = self.check(feed(*event("SUMMARY:trailing\\")))
        self.assertEqual(len(errors), 1)
        self.assertIn("SUMMARY stray backslash", errors[0])

    def test_escape_split_across_a_fold_is_read_as_one(self):
        # The content line is exactly 75 octets, so the `\` lands at its end
        # and the `;` on the continuation line.
        summary = "SUMMARY:" + "x" * 66 + "\\"
        self.assertEqual(len(summary), 75)
        errors, _, _ = self.check(feed(*event(summary, " ; and more")))
        self.assertEqual(errors, [])

    def test_delimiters_outside_text_properties_are_fine(self):
        # Property parameters (`DTSTART;VALUE=DATE`, `REFRESH-INTERVAL;...`)
        # and non-TEXT values (URL, UID) carry `;` and `,` legitimately.
        errors, _, _ = self.check(feed(*event(
            "SUMMARY:Plain",
            "URL:https://example.com/events/?a=1,2;b=3",
        )))
        self.assertEqual(errors, [])

    def test_site_title_in_header_properties_is_checked(self):
        # PRODID and X-WR-CALNAME are built from the site title, so a title
        # like "PyLadies Vancouver, BC" has to be escaped there too.
        bad = feed(*event("SUMMARY:Plain")).replace(
            b"PRODID:-//Your Community//Popular theme//EN",
            b"PRODID:-//Your Community, BC//Popular theme//EN\r\nX-WR-CALNAME:Your Community, BC events")
        errors, _, _ = self.check(bad)
        self.assertEqual(len(errors), 2)
        self.assertIn("PRODID unescaped ','", errors[0])
        self.assertIn("X-WR-CALNAME unescaped ','", errors[1])
        good = feed(*event("SUMMARY:Plain")).replace(
            b"PRODID:-//Your Community//Popular theme//EN",
            b"PRODID:-//Your Community\\, BC//Popular theme//EN\r\nX-WR-CALNAME:Your Community\\, BC events")
        self.assertEqual(self.check(good)[0], [])

    def test_property_parameters_do_not_hide_the_value(self):
        # `SUMMARY;LANGUAGE=en:...` is still a SUMMARY; the check reads past
        # the parameter and inspects the value.
        errors, _, _ = self.check(feed(*event("SUMMARY;LANGUAGE=en:Workshop; bring a laptop")))
        self.assertEqual(len(errors), 1)
        self.assertIn("SUMMARY unescaped ';'", errors[0])
        errors, _, _ = self.check(feed(*event("SUMMARY;LANGUAGE=en:Workshop\\; bring a laptop")))
        self.assertEqual(errors, [])

    def test_first_fault_only_per_property(self):
        errors, _, _ = self.check(feed(*event("SUMMARY:a;b,c")))
        self.assertEqual(len(errors), 1)
        self.assertIn("unescaped ';' at offset 1", errors[0])


class TextEscapeProblem(unittest.TestCase):
    def test_vectors(self):
        vectors = [
            ("", None),
            ("plain text", None),
            ("a\\;b\\,c\\\\d\\ne\\Nf", None),
            ("a;b", "unescaped ';' at offset 1"),
            ("a,b", "unescaped ',' at offset 1"),
            ("a\\xb", "stray backslash at offset 1"),
            ("a\\", "stray backslash at offset 1"),
        ]
        for value, expected in vectors:
            self.assertEqual(check_ics.text_escape_problem(value), expected, f"value={value!r}")


class CommandLine(unittest.TestCase):
    def test_exit_status_reports_escaping_faults(self):
        with tempfile.TemporaryDirectory() as d:
            (pathlib.Path(d) / "calendar.ics").write_bytes(
                feed(*event("SUMMARY:Workshop; bring a laptop")))
            result = run_script("check-ics.py", d)
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("SUMMARY unescaped ';'", result.stdout)
        self.assertIn("FAIL: 1 problem(s) across 1 feed(s)", result.stdout)

    def test_exit_status_clean(self):
        with tempfile.TemporaryDirectory() as d:
            (pathlib.Path(d) / "calendar.ics").write_bytes(
                feed(*event("SUMMARY:Workshop\\; bring a laptop")))
            result = run_script("check-ics.py", d)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("OK: 1 iCalendar feed(s) valid", result.stdout)


if __name__ == "__main__":
    unittest.main()

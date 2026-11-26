"""Hygiene tests for the setup-wizard question schema (setup-questions.json).

The schema is the single source of truth for the worksheet page, scripts/setup.py
and the AGENTS.md interview, so these invariants keep the three surfaces from
drifting. Ships identically in both repos (Tier 1); it locates the schema at the
Hugo path (data/) or the Astro path (src/data/).
"""
import json
import os
import unittest

VALID_LAYERS = {"config", "decision"}
VALID_TYPES = {"string", "url", "email", "bool", "choice", "color"}
REQUIRED_FIELDS = {"id", "layer", "prompt", "help", "type", "target",
                   "content_target", "default", "skippable", "handbook_url"}


def _load_schema():
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    for rel in ("data/setup-questions.json", "src/data/setup-questions.json"):
        path = os.path.join(root, rel)
        if os.path.exists(path):
            with open(path, encoding="utf-8") as fh:
                return json.load(fh)
    raise FileNotFoundError("setup-questions.json not found at data/ or src/data/")


class TestSetupSchema(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.schema = _load_schema()
        cls.questions = cls.schema["questions"]

    def test_has_questions(self):
        self.assertTrue(self.questions, "schema has at least one question")

    def test_unique_ids(self):
        ids = [q["id"] for q in self.questions]
        self.assertEqual(len(ids), len(set(ids)), "question ids must be unique")

    def test_required_fields_present(self):
        for q in self.questions:
            missing = REQUIRED_FIELDS - set(q)
            self.assertFalse(missing, f"{q.get('id')} missing fields: {missing}")

    def test_valid_layer_and_type(self):
        for q in self.questions:
            self.assertIn(q["layer"], VALID_LAYERS, f"{q['id']}: bad layer")
            self.assertIn(q["type"], VALID_TYPES, f"{q['id']}: bad type")
            self.assertIsInstance(q["skippable"], bool, f"{q['id']}: skippable must be bool")

    def test_config_questions_have_both_targets(self):
        for q in self.questions:
            if q["layer"] == "config":
                t = q["target"]
                self.assertIsInstance(t, dict, f"{q['id']}: config target must be an object")
                for fw in ("hugo", "astro"):
                    self.assertTrue(t.get(fw), f"{q['id']}: missing {fw} target")

    def test_decision_questions_have_null_target(self):
        for q in self.questions:
            if q["layer"] == "decision":
                self.assertIsNone(q["target"], f"{q['id']}: decision questions write no config")

    def test_choice_questions_have_options(self):
        for q in self.questions:
            if q["type"] == "choice":
                self.assertTrue(q.get("options"), f"{q['id']}: choice type needs options")

    def test_content_target_is_string_or_null(self):
        for q in self.questions:
            ct = q["content_target"]
            self.assertTrue(ct is None or isinstance(ct, str), f"{q['id']}: bad content_target")


if __name__ == "__main__":
    unittest.main()

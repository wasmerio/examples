"""Tests for the setup wizard (scripts/setup.py). Stdlib only; Tier-1 (runs in
both repos). Covers rendering, the write contract, format detection, validation
and DECISIONS.md."""
import importlib.util
import io
import json
import os
import tempfile
import unittest
from contextlib import redirect_stdout

_HERE = os.path.dirname(__file__)
_SPEC = importlib.util.spec_from_file_location(
    "setup", os.path.join(_HERE, "..", "setup.py"))
setup = importlib.util.module_from_spec(_SPEC)
_SPEC.loader.exec_module(setup)

FULL = {
    "community_name": "PyLadies Vancouver", "tagline": "Python, together",
    "base_url": "https://example.com/pyl/", "logo": "images/logo.png",
    "coc_contact": "coc@pyl.example", "chat": "https://discord.gg/xyz",
    "rsvp_home": "https://meetup.com/pyl", "speakers_invite": True,
    "social": [{"label": "Mastodon", "url": "https://m.example/@pyl"}],
    "repo_home": "github.com/pyl/site", "coc_choice": "PSF Code of Conduct",
}


class TestRender(unittest.TestCase):
    def test_full_skip_omits_optional_blocks(self):
        for fmt, tpl in (("hugo", "hugo.toml.tmpl"), ("astro", "config.ts.tmpl")):
            out = setup.render(setup.tmpl(tpl), {}, fmt)
            self.assertNotIn("popular:", out, f"{fmt}: markers must be stripped")
            self.assertNotIn("${", out, f"{fmt}: no unsubstituted placeholders")
        # the chat block is conditional -- absent when the question is skipped
        hugo = setup.render(setup.tmpl("hugo.toml.tmpl"), {}, "hugo")
        self.assertNotIn("[params.community.chat]", hugo)

    def test_defaults_used_when_skipped(self):
        out = setup.render(setup.tmpl("hugo.toml.tmpl"), {}, "hugo")
        self.assertIn('title = "Your Community"', out)

    def test_answers_substitute_and_include_blocks(self):
        out = setup.render(setup.tmpl("hugo.toml.tmpl"), FULL, "hugo")
        self.assertIn('title = "PyLadies Vancouver"', out)
        self.assertIn("[params.community.chat]", out)
        self.assertIn("https://discord.gg/xyz", out)
        self.assertIn("[params.coc]", out)
        self.assertIn("Mastodon", out)
        self.assertNotIn("${", out)

    def test_social_omitted_when_empty(self):
        out = setup.render(setup.tmpl("hugo.toml.tmpl"), {}, "hugo")
        self.assertNotIn("[[params.social]]", out)


class TestValidate(unittest.TestCase):
    def test_email(self):
        q = {"id": "coc_contact", "type": "email"}
        self.assertEqual(setup.validate(q, "a@b.co"), "a@b.co")
        with self.assertRaises(SystemExit):
            setup.validate(q, "not-an-email")

    def test_url(self):
        q = {"id": "chat", "type": "url"}
        self.assertEqual(setup.validate(q, "https://x.io"), "https://x.io")
        self.assertEqual(setup.validate(q, "/rel"), "/rel")
        with self.assertRaises(SystemExit):
            setup.validate(q, "ftp://x")


class TestDetect(unittest.TestCase):
    def test_hugo_and_astro(self):
        with tempfile.TemporaryDirectory() as d:
            open(os.path.join(d, "hugo.toml"), "w").close()
            self.assertEqual(setup.detect(d), "hugo")
        with tempfile.TemporaryDirectory() as d:
            os.makedirs(os.path.join(d, "src", "content"))
            self.assertEqual(setup.detect(d), "astro")
        with tempfile.TemporaryDirectory() as d:
            with self.assertRaises(SystemExit):
                setup.detect(d)


class TestWriteContract(unittest.TestCase):
    def _site(self, d):
        open(os.path.join(d, "hugo.toml"), "w").write("old\n")
        return d

    def test_dry_run_writes_nothing(self):
        with tempfile.TemporaryDirectory() as d:
            self._site(d)
            before = sorted(os.listdir(d))
            files = setup.build_outputs(d, "hugo", setup.find_schema(), FULL)
            with redirect_stdout(io.StringIO()):
                rc = setup.apply(d, files, force=False, dry_run=True)
            self.assertEqual(rc, 0)
            self.assertEqual(sorted(os.listdir(d)), before, "dry-run wrote files")

    def test_refuse_then_force(self):
        with tempfile.TemporaryDirectory() as d:
            self._site(d)  # hugo.toml exists and differs
            files = setup.build_outputs(d, "hugo", setup.find_schema(), FULL)
            with redirect_stdout(io.StringIO()):
                rc = setup.apply(d, files, force=False, dry_run=False)
            self.assertEqual(rc, 1, "must refuse to overwrite existing config")
            self.assertEqual(open(os.path.join(d, "hugo.toml")).read(), "old\n")
            with redirect_stdout(io.StringIO()):
                rc = setup.apply(d, files, force=True, dry_run=False)
            self.assertEqual(rc, 0)
            self.assertIn("PyLadies Vancouver", open(os.path.join(d, "hugo.toml")).read())

    def test_writes_all_outputs(self):
        with tempfile.TemporaryDirectory() as d:
            open(os.path.join(d, "hugo.toml"), "w").close()  # empty, differs
            files = setup.build_outputs(d, "hugo", setup.find_schema(), FULL)
            with redirect_stdout(io.StringIO()):
                setup.apply(d, files, force=True, dry_run=False)
            for rel in ("hugo.toml", "content/code-of-conduct.md",
                        "DECISIONS.md", ".popular-setup.json"):
                self.assertTrue(os.path.exists(os.path.join(d, rel)), rel)
            self.assertEqual(json.load(open(os.path.join(d, ".popular-setup.json")))["community_name"],
                             "PyLadies Vancouver")


class TestBrandColour(unittest.TestCase):
    """Optional by design: skipping it has to leave the config byte-identical to
    the starter, or the wizard loses its no---force first run."""

    def test_validate_accepts_hex(self):
        q = {"id": "brand_primary", "type": "color"}
        for value in ("#fa023c", "#FA023C", "#abc"):
            self.assertEqual(setup.validate(q, value), value)

    def test_validate_rejects_anything_else(self):
        q = {"id": "brand_primary", "type": "color"}
        for value in ("red", "fa023c", "#12345", "rgb(1,2,3)"):
            with self.assertRaises(SystemExit):
                setup.validate(q, value)

    def test_answered_writes_the_brand_key(self):
        with tempfile.TemporaryDirectory() as d:
            answers = {**FULL, "brand_primary": "#fa023c"}
            hugo = setup.build_outputs(d, "hugo", setup.find_schema(), answers)["hugo.toml"]
            astro = setup.build_outputs(d, "astro", setup.find_schema(), answers)["src/config.ts"]
        self.assertIn("[params.brand]", hugo)
        self.assertIn('primary = "#fa023c"', hugo)
        self.assertIn('BRAND: Record<string, string> = { primary: "#fa023c" };', astro)

    def test_skipped_leaves_the_starter_untouched(self):
        with tempfile.TemporaryDirectory() as d:
            hugo = setup.build_outputs(d, "hugo", setup.find_schema(), FULL)["hugo.toml"]
            astro = setup.build_outputs(d, "astro", setup.find_schema(), FULL)["src/config.ts"]
        self.assertNotIn("[params.brand]", hugo)
        self.assertIn("BRAND: Record<string, string> = {};", astro)


class TestAstroSiteAndBase(unittest.TestCase):
    """Astro needs origin and subpath as separate config keys; Hugo derives
    both from baseURL. Getting this wrong 404s every link on a project page."""

    def test_split_project_page(self):
        self.assertEqual(setup.split_site_base("https://you.github.io/my-community/"),
                         ("https://you.github.io", "/my-community"))

    def test_split_domain_root(self):
        self.assertEqual(setup.split_site_base("https://popular.example/"),
                         ("https://popular.example", "/"))
        self.assertEqual(setup.split_site_base("https://popular.example"),
                         ("https://popular.example", "/"))

    def test_split_falls_back_when_unanswered(self):
        for value in (None, "", "not a url"):
            self.assertEqual(setup.split_site_base(value), ("https://example.com", "/"))

    def test_astro_outputs_carry_site_and_base(self):
        with tempfile.TemporaryDirectory() as d:
            files = setup.build_outputs(d, "astro", setup.find_schema(),
                                        {**FULL, "base_url": "https://you.github.io/pyl/"})
            cfg = files["astro.config.mjs"]
            self.assertIn("site: 'https://you.github.io'", cfg)
            self.assertIn("base: '/pyl'", cfg)

    def test_hugo_gets_no_astro_config(self):
        with tempfile.TemporaryDirectory() as d:
            self.assertNotIn("astro.config.mjs",
                             setup.build_outputs(d, "hugo", setup.find_schema(), FULL))


class TestAstroPackageModel(unittest.TestCase):
    """Astro ships two ways (PACKAGING.md): a copy of the template repo, or a
    small site that depends on the npm package. Same answers, same content
    model, different layout."""

    def _files(self, model):
        with tempfile.TemporaryDirectory() as d:
            return setup.build_outputs(d, "astro", setup.find_schema(), FULL, model)

    def test_config_lands_in_the_right_place(self):
        self.assertIn("src/config.ts", self._files("template"))
        self.assertIn("popular.config.ts", self._files("package"))
        self.assertNotIn("src/config.ts", self._files("package"))

    def test_consumer_gets_its_own_npm_project(self):
        files = self._files("package")
        pkg = json.loads(files["package.json"])
        self.assertEqual(pkg["name"], "pyladies-vancouver")
        self.assertIn("astro-theme-popular", pkg["dependencies"])
        self.assertTrue(pkg["dependencies"]["astro-theme-popular"].startswith("^"))
        self.assertIn("astro-theme-popular/schemas", files["src/content.config.ts"])

    def test_consumer_config_uses_the_integration(self):
        cfg = self._files("package")["astro.config.mjs"]
        self.assertIn("import popular from 'astro-theme-popular'", cfg)
        # popular-markdown.mjs only exists in the template repo; the package
        # integration registers those hooks itself
        self.assertNotIn("popular-markdown", cfg)

    def test_template_config_keeps_the_local_hook(self):
        self.assertIn("popular-markdown", self._files("template")["astro.config.mjs"])

    def test_pinned_version_tracks_the_changelog(self):
        pkg = json.loads(self._files("package")["package.json"])
        self.assertEqual(pkg["dependencies"]["astro-theme-popular"], "^" + setup.latest_release())

    def test_model_detection(self):
        with tempfile.TemporaryDirectory() as d:
            self.assertEqual(setup.detect_astro_model(d), "template")
            open(os.path.join(d, "popular.config.ts"), "w").close()
            self.assertEqual(setup.detect_astro_model(d), "package")


class TestDeployWorkflow(unittest.TestCase):
    def test_emitted_per_format(self):
        with tempfile.TemporaryDirectory() as d:
            hugo = setup.build_outputs(d, "hugo", setup.find_schema(), FULL)[".github/workflows/deploy.yml"]
            astro = setup.build_outputs(d, "astro", setup.find_schema(), FULL)[".github/workflows/deploy.yml"]
        self.assertIn("peaceiris/actions-hugo", hugo)
        self.assertIn("npm run build", astro)
        for content in (hugo, astro):
            self.assertIn("actions/deploy-pages@v4", content)
            # parameterless: no inputs, and the URL lives in the site config
            self.assertNotIn("workflow_call", content)
            self.assertIn("${{ steps.deployment.outputs.page_url }}", content)

    def test_left_alone_when_the_site_already_has_workflows(self):
        with tempfile.TemporaryDirectory() as d:
            os.makedirs(os.path.join(d, ".github", "workflows"))
            files = setup.build_outputs(d, "hugo", setup.find_schema(), FULL)
            self.assertNotIn(".github/workflows/deploy.yml", files)


class TestPristineAdoption(unittest.TestCase):
    """Tier-1, so it runs in both repos: exercise whichever framework's starters
    this repo actually ships (Hugo theme -> hugo, Astro template -> astro)."""

    def _native(self):
        root = os.path.abspath(os.path.join(_HERE, "..", ".."))
        if os.path.exists(os.path.join(root, "exampleSite", "hugo.toml")):
            return "hugo", "hugo.toml", "content/code-of-conduct.md"
        return "astro", "src/config.ts", "src/content/pages/code-of-conduct.mdx"

    def _write(self, d, rel, text):
        p = os.path.join(d, rel)
        os.makedirs(os.path.dirname(p) or ".", exist_ok=True)
        with open(p, "w", encoding="utf-8") as fh:
            fh.write(text)

    def test_map_finds_starter_files(self):
        fmt, cfg, coc = self._native()
        m = setup.pristine_map(fmt)
        self.assertTrue(m.get(cfg), "no starter configs discovered")
        self.assertTrue(m.get(coc), "no starter CoC pages discovered")

    def test_adopts_unedited_starter_config(self):
        fmt, cfg, _ = self._native()
        adopt = setup.pristine_map(fmt)
        with tempfile.TemporaryDirectory() as d:
            self._write(d, cfg, sorted(adopt[cfg])[0])  # an unedited, theme-shipped config
            files = setup.build_outputs(d, fmt, setup.find_schema(), FULL)
            with redirect_stdout(io.StringIO()):
                rc = setup.apply(d, files, force=False, dry_run=False, adopt=adopt)
            self.assertEqual(rc, 0, "an unedited starter config is adopted without --force")
            self.assertIn("PyLadies Vancouver", open(os.path.join(d, cfg)).read())

    def test_adopts_unedited_starter_coc(self):
        fmt, cfg, coc = self._native()
        adopt = setup.pristine_map(fmt)
        with tempfile.TemporaryDirectory() as d:
            self._write(d, cfg, sorted(adopt[cfg])[0])
            self._write(d, coc, sorted(adopt[coc])[0])
            files = setup.build_outputs(d, fmt, setup.find_schema(), FULL)
            with redirect_stdout(io.StringIO()):
                rc = setup.apply(d, files, force=False, dry_run=False, adopt=adopt)
            self.assertEqual(rc, 0, "an unedited starter CoC page is adopted too")

    def test_refuses_customized_config(self):
        fmt, cfg, _ = self._native()
        adopt = setup.pristine_map(fmt)
        with tempfile.TemporaryDirectory() as d:
            self._write(d, cfg, "// I have edited this by hand\n")  # not pristine
            files = setup.build_outputs(d, fmt, setup.find_schema(), FULL)
            with redirect_stdout(io.StringIO()):
                rc = setup.apply(d, files, force=False, dry_run=False, adopt=adopt)
            self.assertEqual(rc, 1, "a customized config is still protected")


class TestDecisions(unittest.TestCase):
    def test_answered_and_open(self):
        os.environ["POPULAR_SETUP_DATE"] = "2026-08-03"
        md = setup.build_decisions(setup.find_schema(), FULL)
        self.assertIn("## Decided (2026-08-03)", md)
        self.assertIn("PyLadies Vancouver", md)
        self.assertIn("PSF Code of Conduct", md)  # decision-layer note recorded
        self.assertIn("## Still open", md)
        self.assertIn("handbook", md)  # citation present on a coc question

    def test_skips_listed_as_open(self):
        md = setup.build_decisions(setup.find_schema(), {})
        self.assertIn("## Still open", md)
        self.assertIn("What is your community called?", md)


if __name__ == "__main__":
    unittest.main()

# Pandoc Converter (pypandoc) + Wasmer

This demo shows how to use **pypandoc** (a Python wrapper around Pandoc) to convert text between markup formats. The program provides a small web UI, but the focus here is on how `pypandoc.convert_text(...)` is used.

## Demo

https://pandoc-converter-example.wasmer.app/

## How it Works (sections from `app.py`)

All logic lives in one file. Here are the **relevant code sections** related to pypandoc:

### Supported formats

A list of markup formats is declared. These are passed directly to `pypandoc`:

```python
SUPPORTED_FORMATS = [
    ("markdown", "Markdown"),
    ("rst", "reStructuredText"),
    ("html", "HTML"),
    ("latex", "LaTeX"),
    ("mediawiki", "MediaWiki"),
    ("docbook", "DocBook"),
    ("org", "Org Mode"),
]
```

### Conversion call

The actual conversion happens in the POST request handler. The work is run in a background thread to avoid blocking the server:

```python
converted = await asyncio.to_thread(
    pypandoc.convert_text,
    text,
    to=target_format,
    format=source_format,
)
```

Key details:

* `format` specifies the **source format**.
* `to` specifies the **target format**.
* The return value is the converted text, ready to display or save.

### Error handling

If Pandoc raises an error, it is caught and safely escaped for display:

```python
except (RuntimeError, OSError) as exc:
    escaped_error = html.escape(str(exc))
    return ERROR_TEMPLATE.replace("{escaped_error}", escaped_error)
```

This ensures that unsupported conversions or missing executables don’t crash the app.

---

## Running Locally

1. Create a `requirements.txt`:

```
fastapi
uvicorn
pypandoc
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the server:

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

4. Convert via API (example without UI):

```bash
curl -X POST http://localhost:8000/api/hx/convert \
  -F 'source_format=markdown' \
  -F 'target_format=rst' \
  -F 'text=# Hello **world**'
```

The response will contain the converted text wrapped in HTML.

API endpoints:

- GET `/api/pandoc-convert?from=markdown&to=html&text=...` returns converted content as plain text.
- POST `/api/pandoc-convert?from=markdown&to=html` with form field `text` returns converted content as plain text.

On failure, endpoints return JSON `{ "error": "<msg>" }` with status 400.


---

## Deploying to Wasmer (Overview)

1. Include `app.py` and `requirements.txt`.
2. Deploy to Wasmer or point the web process to run Uvicorn (e.g., `uvicorn app:app --host 0.0.0.0 --port $PORT`).
3. Open `https://<your-subdomain>.wasmer.app/` and try converting text between formats.

# FastAPI + SQLAlchemy starter for Wasmer Edge

A FastAPI todo app with SQLAlchemy 2. It has an HTML page with a form and a JSON API with interactive docs at `/docs`.

[Deploy this template](https://wasmer.io/templates/fastapi-sqlalchemy) from the Wasmer templates page.

## How it works

- Everything is in `main.py`: the `Todo` model, the HTML page and the `/api/todos` endpoints.
- Tables are created on startup.
- Wasmer detects FastAPI and runs `uvicorn main:app`.

## Configuration

Without configuration the app uses SQLite in `/tmp`, which is fine for trying it but is not shared between instances or kept across deploys. Attach a MySQL database to the app (its `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME` and `DB_PASSWORD` variables are picked up automatically) or set `DATABASE_URL` to any SQLAlchemy URL.

## Run it locally

```bash
uv sync
uv run uvicorn main:app --reload
```

Then open http://localhost:8000/.

Run the tests with `uv run pytest`.

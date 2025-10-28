# FastAPI + Wasmer

This example shows how to run a minimal **FastAPI** app on **Wasmer Edge**.

## Demo

https://fastapi-template.wasmer.app/

## How it Works

Your FastAPI application exposes a module-level **ASGI** application named `app` in `main.py`:

```python
# main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

Key points:

* The `app` variable is the ASGI application that Wasmer Edge runs (e.g., `main:app`).
* A single `GET /` route returns JSON: `{"message": "Hello World"}`.
* When executed directly (`python main.py`), it serves via Uvicorn on port `8000`.

This example uses **ASGI** with FastAPI to handle requests on Wasmer Edge.

## Running Locally

Choose one of the following:

```bash
# Option 1: Run the file directly (uses the __main__ block)
python main.py
```

```bash
# Option 2: Use uvicorn explicitly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Your FastAPI application is now available at `http://localhost:8000`.

## Routing Overview

* `GET /` → returns:

  ```json
  { "message": "Hello World" }
  ```

## Deploying to Wasmer (Overview)

1. Ensure your project exposes `main:app`.
2. Deploy to Wasmer
3. Visit `https://<your-subdomain>.wasmer.app/` to test.

> Tip: Keep the app entrypoint as `main:app` (module\:variable) so the platform can discover it easily.

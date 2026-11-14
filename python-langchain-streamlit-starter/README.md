# LangChain + Streamlit chat starter for Wasmer Edge

A Streamlit chat app that streams answers from OpenAI through LangChain, running on Wasmer Edge.

After catalog registration, [deploy this template](https://wasmer.io/templates/langchain-streamlit-starter) from the Wasmer templates page.

## How it works

- `streamlit_app.py` is the whole app: a sidebar for the key and model, the chat history and a streaming reply.
- `.streamlit/config.toml` sets the theme and binds to IPv4 for the Wasmer runtime.
- Wasmer detects Streamlit and runs `streamlit run streamlit_app.py`.
- Streamlit is pinned to 1.56, the last release served by Tornado; later releases use a socket setup the Wasmer runtime does not support yet.

## Configuration

Set an `OPENAI_API_KEY` secret on your app so visitors can chat right away, or paste a key in the sidebar. The sidebar sends the key to the app server and keeps it in server-side session memory; use a deployment you trust. This app does not write the key to disk. Set usage limits on any shared server key in your OpenAI account.

## Run it locally

```bash
uv sync
uv run streamlit run streamlit_app.py
```

Then open http://localhost:8501/.

Catalog registration follows source merge; this PR does not publish the catalog entry. Direct dependencies are pinned, and build tools generate dependency resolutions; transitive dependencies can change between builds.

## Shared UI

This app uses Streamlit’s supported sidebar, text input, select box, buttons, alerts and chat widgets. The supported theme configuration uses Wasmer’s canonical neutral colors; no page-local CSS replaces framework components.

## Verification

Run `uv run python -m unittest discover -s tests`. Tests use synthetic keys and a fake model; no paid model requests are sent.

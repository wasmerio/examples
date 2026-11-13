# LangChain + Streamlit chat starter for Wasmer Edge

A Streamlit chat app that streams answers from OpenAI through LangChain, running on Wasmer Edge.

[Deploy this template](https://wasmer.io/templates/langchain-streamlit-starter) from the Wasmer templates page.

## How it works

- `streamlit_app.py` is the whole app: a sidebar for the key and model, the chat history and a streaming reply.
- `.streamlit/config.toml` sets the theme and binds to IPv4 for the Wasmer runtime.
- Wasmer detects Streamlit and runs `streamlit run streamlit_app.py`.
- Streamlit is pinned to 1.56, the last release served by Tornado; later releases use a socket setup the Wasmer runtime does not support yet.

## Configuration

Set an `OPENAI_API_KEY` secret on your app so visitors can chat right away, or paste a key in the sidebar. A key typed in the sidebar stays in that browser session.

## Run it locally

```bash
uv sync
uv run streamlit run streamlit_app.py
```

Then open http://localhost:8501/.

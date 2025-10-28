# LangChain + Streamlit Chat (OpenAI) + Wasmer

This example shows how to run a **LangChain** chat app with **Streamlit** on **Wasmer Edge**, streaming assistant tokens to the UI as they’re generated.

## Demo

https://langchain-starter-template.wasmer.app/

## How it Works

All logic lives in **`app.py`**, but you can think of it in sections.

### Sidebar (API Key input)

The sidebar captures the user’s OpenAI API key:

```python
with st.sidebar:
    openai_api_key = st.text_input("OpenAI API Key", type="password")
```

### Session State (chat history)

We persist a running conversation using LangChain’s `ChatMessage`:

```python
if "messages" not in st.session_state:
    st.session_state["messages"] = [ChatMessage(role="assistant", content="How can I help you?")]
```

Existing messages are rendered with Streamlit’s chat components.

### Streaming Callback

A custom callback handler streams tokens into the UI as they arrive:

```python
class StreamHandler(BaseCallbackHandler):
    def __init__(self, container, initial_text=""):
        self.container = container
        self.text = initial_text
    def on_llm_new_token(self, token: str, **kwargs):
        self.text += token
        self.container.markdown(self.text)
```

### Chat Loop + Model Call

On each user prompt, we:

1. Append the user message to history
2. Validate the API key
3. Create `ChatOpenAI` with `streaming=True` and our `StreamHandler`
4. Invoke the model with the full `st.session_state.messages`
5. Append the assistant response to history

```python
llm = ChatOpenAI(openai_api_key=openai_api_key, streaming=True, callbacks=[stream_handler])
response = llm.invoke(st.session_state.messages)
```

## Running Locally

1. Create a `requirements.txt`:

```
streamlit
langchain
langchain-openai
openai
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the app:

```bash
streamlit run app.py
```

4. Open your browser at the local URL shown by Streamlit, enter your **OpenAI API key** in the sidebar, and start chatting.

> Tip: You can also set `OPENAI_API_KEY` in your environment and default to it in code if you like, but this demo reads the key from the sidebar field.

## Routes & Behavior

* **GET /** → Renders the Streamlit chat UI.
* Messages are streamed token-by-token using the callback so users see responses typing out live.

## Deploying to Wasmer (Overview)

1. Include `app.py` and `requirements.txt` in your project.
2. Deploy to Wasmer and point the web process/entrypoint to run Streamlit (e.g., `streamlit run app.py --server.port=$PORT --server.address=0.0.0.0`).
3. Visit `https://<your-subdomain>.wasmer.app/` and provide your OpenAI API key in the sidebar.

---

⚠️ **Security note:** Never hardcode API keys in source control. Prefer runtime input (as in the sidebar), environment variables, or platform secrets.

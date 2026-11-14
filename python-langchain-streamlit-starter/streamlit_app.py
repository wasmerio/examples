"""A Streamlit chat app powered by LangChain, running on Wasmer Edge.

Set an OPENAI_API_KEY secret on the app to chat with no setup, or paste a key in the sidebar.
The sidebar sends the key to this app server and keeps it in server-side session memory.
Only use a deployment you trust; the app does not persist keys to disk.
"""

import os

import streamlit as st
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

st.set_page_config(page_title="LangChain chat on Wasmer Edge", page_icon="💬")

with st.sidebar:
    st.header("Settings")
    server_key = os.environ.get("OPENAI_API_KEY", "")
    typed_key = st.text_input(
        "OpenAI API key",
        type="password",
        placeholder="Using the app's secret" if server_key else "sk-...",
        help="Leave empty to use the OPENAI_API_KEY secret set on the app.",
    )
    model = st.selectbox("Model", ["gpt-4o-mini", "gpt-4.1-mini", "gpt-4o"], index=0)
    if st.button("Clear chat"):
        st.session_state.messages = []

api_key = typed_key or server_key

st.title("💬 LangChain chat on Wasmer Edge")
st.caption("A Streamlit app streaming answers from OpenAI through LangChain. Edit `streamlit_app.py` and push to redeploy.")

if "messages" not in st.session_state:
    st.session_state.messages = []

if not st.session_state.messages:
    st.chat_message("assistant").write("Hi! Ask me anything.")

for message in st.session_state.messages:
    st.chat_message("user" if isinstance(message, HumanMessage) else "assistant").write(message.content)

if prompt := st.chat_input("Ask a question"):
    if not api_key:
        st.info("Add an OpenAI API key in the sidebar, or set the OPENAI_API_KEY secret on your app, to start chatting.")
        st.stop()
    st.session_state.messages.append(HumanMessage(prompt))
    st.chat_message("user").write(prompt)
    history = [SystemMessage("You are a helpful, concise assistant.")] + st.session_state.messages
    try:
        llm = ChatOpenAI(model=model, api_key=api_key, streaming=True)
        with st.chat_message("assistant"):
            answer = st.write_stream(chunk.content for chunk in llm.stream(history))
        st.session_state.messages.append(AIMessage(answer))
    except Exception:
        st.error("The model request failed. Check your API key, model access and account credit, then try again.")

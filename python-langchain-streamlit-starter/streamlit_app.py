"""A Streamlit chat app powered by LangChain, running on Wasmer Edge.

Each visitor pastes their own OpenAI key in the sidebar. The sidebar sends the key to this app server
and keeps it in server-side session memory; the app does not log or persist keys.
The OPENAI_API_KEY secret is used only when ALLOW_SHARED_OPENAI_KEY=true, which lets anyone who can open
the app spend that key.
"""

import os

import streamlit as st
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

st.set_page_config(page_title="LangChain chat on Wasmer Edge", page_icon="💬")

with st.sidebar:
    st.header("Settings")
    shared_key_allowed = os.environ.get("ALLOW_SHARED_OPENAI_KEY", "").lower() == "true"
    server_key = os.environ.get("OPENAI_API_KEY", "") if shared_key_allowed else ""
    typed_key = st.text_input(
        "OpenAI API key",
        type="password",
        placeholder="Using the app's secret" if server_key else "sk-...",
        help="Leave empty to use the app's shared key." if server_key else "Your key stays in this session only.",
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
        st.info("Add your OpenAI API key in the sidebar to start chatting.")
        st.stop()
    user_message = HumanMessage(prompt)
    st.chat_message("user").write(prompt)
    history = [SystemMessage("You are a helpful, concise assistant."), *st.session_state.messages, user_message]
    try:
        llm = ChatOpenAI(model=model, api_key=api_key, streaming=True)
        with st.chat_message("assistant"):
            answer = st.write_stream(chunk.content for chunk in llm.stream(history))
        st.session_state.messages.extend((user_message, AIMessage(answer)))
    except Exception:
        st.error("The model request failed. Check your API key, model access and account credit, then try again.")

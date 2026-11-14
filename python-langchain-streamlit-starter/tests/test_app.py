import os
from pathlib import Path
import unittest
from unittest.mock import patch

from langchain_core.messages import AIMessageChunk
from streamlit.testing.v1 import AppTest

APP = Path(__file__).resolve().parents[1] / 'streamlit_app.py'


class ChatTests(unittest.TestCase):
    def test_missing_key_does_not_call_model(self):
        with patch.dict(os.environ, {'OPENAI_API_KEY': ''}), patch('langchain_openai.ChatOpenAI') as model:
            app = AppTest.from_file(str(APP), default_timeout=30).run()
            app.chat_input[0].set_value('Hello').run()
            self.assertEqual(len(app.info), 1)
            self.assertEqual(app.session_state.messages, [])
            model.assert_not_called()
            self.assertEqual(len(app.exception), 0)

    def test_streamed_reply_and_clear(self):
        with patch.dict(os.environ, {'OPENAI_API_KEY': 'synthetic-test-key'}), patch('langchain_openai.ChatOpenAI') as model:
            model.return_value.stream.return_value = iter([AIMessageChunk(content='Hello '), AIMessageChunk(content='world')])
            app = AppTest.from_file(str(APP), default_timeout=30).run()
            app.chat_input[0].set_value('Hi').run()
            self.assertEqual(app.session_state.messages[-1].content, 'Hello world')
            self.assertEqual(len(app.session_state.messages), 2)
            model.assert_called_once_with(model='gpt-4o-mini', api_key='synthetic-test-key', streaming=True)
            app.button[0].click().run()
            self.assertEqual(app.session_state.messages, [])
            self.assertEqual(len(app.exception), 0)

    def test_provider_failure_is_safe_and_visible(self):
        with patch.dict(os.environ, {'OPENAI_API_KEY': 'synthetic-test-key'}), patch('langchain_openai.ChatOpenAI', side_effect=RuntimeError('private-provider-detail')):
            app = AppTest.from_file(str(APP), default_timeout=30).run()
            app.chat_input[0].set_value('Hi').run()
            self.assertEqual(len(app.error), 1)
            self.assertNotIn('private-provider-detail', app.error[0].value)
            self.assertEqual(len(app.exception), 0)


if __name__ == '__main__':
    unittest.main()

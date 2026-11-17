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
            self.assertEqual(app.session_state.messages, [])
            self.assertEqual(len(app.exception), 0)

    def test_failed_stream_is_not_replayed_on_the_next_prompt(self):
        def interrupted_stream():
            yield AIMessageChunk(content='Unfinished reply')
            raise RuntimeError('synthetic stream interruption')

        with patch.dict(os.environ, {'OPENAI_API_KEY': 'synthetic-test-key'}), patch('langchain_openai.ChatOpenAI') as model:
            stream = model.return_value.stream
            stream.side_effect = [
                iter([AIMessageChunk(content='First reply')]),
                interrupted_stream(),
                iter([AIMessageChunk(content='Next reply')]),
            ]
            app = AppTest.from_file(str(APP), default_timeout=30).run()
            app.chat_input[0].set_value('First prompt').run()
            app.chat_input[0].set_value('Interrupted prompt').run()

            self.assertEqual(len(app.error), 1)
            first_turn = [('human', 'First prompt'), ('ai', 'First reply')]
            self.assertEqual([(m.type, m.content) for m in app.session_state.messages], first_turn)

            app.chat_input[0].set_value('Next prompt').run()
            next_turn = [('human', 'Next prompt'), ('ai', 'Next reply')]
            self.assertEqual([(m.type, m.content) for m in app.session_state.messages], first_turn + next_turn)
            self.assertEqual(len(app.error), 0)
            self.assertEqual(len(app.exception), 0)

            sent_messages = [[(m.type, m.content) for m in call.args[0]] for call in stream.call_args_list]
            system = [('system', 'You are a helpful, concise assistant.')]
            self.assertEqual(sent_messages, [
                system + [('human', 'First prompt')],
                system + first_turn + [('human', 'Interrupted prompt')],
                system + first_turn + [('human', 'Next prompt')],
            ])


if __name__ == '__main__':
    unittest.main()

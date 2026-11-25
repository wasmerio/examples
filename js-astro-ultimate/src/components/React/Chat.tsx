import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'assistant';
}

const InteractiveShowcase: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hi",
      sender: "assistant"
    },
    {
      id: 2,
      content: "Hey, who are you?",
      sender: "user"
    },
    {
      id: 3,
      content: "AI version of developer Ibrahim Elkamali",
      sender: "assistant"
    },
    {
      id: 4,
      content: "Sick,let's chat, I'm starting",
      sender: "user"
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [hasRespondedToFirstMessage, setHasRespondedToFirstMessage] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }

    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = chatContainerRef.current;
      const isScrolledToBottom = scrollHeight - clientHeight <= scrollTop + 100;
      
      if (isScrolledToBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: newMessage,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Only send the prepared message once after the first user input
    if (!hasRespondedToFirstMessage) {
      setTimeout(() => {
        const assistantMessage: Message = {
          id: messages.length + 2,
          content: "Ha, I think I'm too lazy to implement AI chat bot but if you want to chat - take a look on GitHub.",
          sender: 'assistant'
        };
        setMessages(prev => [...prev, assistantMessage]);
        setHasRespondedToFirstMessage(true);
      }, 1000);
    }
  };

  return (
    <div id="chat-section" className="w-full bg-gradient-to-br p-4 md:p-8">
      <div className="w-full max-w-2xl mx-auto backdrop-blur-xl bg-gray-900/70 rounded-2xl shadow-xl border border-white/10">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-700/30 bg-gray-800/40 rounded-t-2xl backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <img
                  className="aspect-square h-full w-full"
                  alt="Ibrahim Elkamali"
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23a855f7'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='40' fill='white' text-anchor='middle' dominant-baseline='middle'%3EI%3C/text%3E%3C/svg%3E"
                />
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="font-semibold text-gray-100">Ibrahim Elkamali</h3>
              <p className="text-xs text-gray-400">@astroisthebest</p>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div ref={chatContainerRef} className="p-4 h-[400px] overflow-auto bg-gradient-to-b from-transparent to-black/5 scroll-smooth">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-[80%] shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white'
                        : 'bg-gradient-to-r from-gray-800/80 via-gray-800/80 to-gray-800/80 backdrop-blur-sm border border-white/10'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700/30 bg-gray-800/40 rounded-b-2xl backdrop-blur-lg">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              className="flex h-10 w-full rounded-xl border border-gray-700/50 bg-gray-900/50 backdrop-blur-sm px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              className="inline-flex items-center justify-center rounded-xl text-sm font-medium h-10 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              type="submit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M22 2 11 13" />
                <path d="m22 2-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InteractiveShowcase;
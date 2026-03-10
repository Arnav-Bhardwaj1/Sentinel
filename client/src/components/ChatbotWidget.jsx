import React, { useState, useRef, useEffect } from 'react';
import ollamaService from '../services/ollamaService';

const ChatbotWidget = ({ campaignData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState('checking'); // 'checking' | 'online' | 'offline'
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: `Hi! 👋 I'm your 24/7 campaign assistant. Ask me anything about "${campaignData?.title}"!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    ollamaService.clearCache();
    ollamaService.checkHealth().then(({ online, modelReady }) => {
      setOllamaStatus(online && modelReady ? 'online' : online ? 'no-model' : 'offline');
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      type: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await ollamaService.answerDonorQuestion(input, campaignData);
      
      const botMessage = {
        type: 'bot',
        text: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const msg = error.message ?? '';
      const text = msg.includes('memory')
        ? "The AI model doesn't have enough system memory to run. Try a smaller model in Ollama."
        : msg.includes('model')
        ? `Model error: ${msg}`
        : "Something went wrong. Please try again in a moment.";
      setMessages((prev) => [...prev, { type: 'bot', text, timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#f97316] to-[#fb923c] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110 active:scale-95"
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <span className="text-white text-2xl">✕</span>
        ) : (
          <span className="text-white text-2xl">💬</span>
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-2 sm:right-6 left-2 sm:left-auto w-auto sm:w-96 max-w-[calc(100vw-1rem)] sm:max-w-none h-[calc(100vh-120px)] sm:h-[500px] max-h-[600px] bg-white dark:bg-[#1c1c24] rounded-2xl shadow-2xl flex flex-col z-50 animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#f97316] to-[#fb923c] p-4 rounded-t-2xl">
            <h3 className="font-epilogue font-bold text-white text-lg">
              Campaign Assistant 🤖
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  ollamaStatus === 'online'
                    ? 'bg-green-300 animate-pulse'
                    : ollamaStatus === 'checking'
                    ? 'bg-yellow-200 animate-pulse'
                    : 'bg-red-300'
                }`}
              />
              <p className="font-epilogue text-white/80 text-xs">
                {ollamaStatus === 'online'
                  ? 'AI online · powered by Ollama'
                  : ollamaStatus === 'no-model'
                  ? 'Ollama running — model not found'
                  : ollamaStatus === 'checking'
                  ? 'Connecting to AI…'
                  : 'AI offline — run: ollama serve'}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-[#f97316] text-white'
                      : 'bg-[#f2f2f2] dark:bg-[#2c2f32] text-black dark:text-white'
                  }`}
                >
                  <p className="font-epilogue text-sm whitespace-pre-wrap">
                    {message.text}
                  </p>
                  <span className="font-epilogue text-xs opacity-60 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#f2f2f2] dark:bg-[#2c2f32] p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#f97316] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-[#f97316] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-[#f97316] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#e5e5e5] dark:border-[#3a3a43]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about the campaign..."
                className="flex-1 px-4 py-2 bg-[#f2f2f2] dark:bg-[#2c2f32] text-black dark:text-white rounded-lg font-epilogue text-sm outline-none focus:ring-2 focus:ring-[#f97316]"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-[#f97316] text-white rounded-lg font-epilogue font-semibold text-sm hover:bg-[#c2410c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </>
  );
};

export default ChatbotWidget;

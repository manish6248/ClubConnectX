import { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import ChatSuggestions from './ChatSuggestions';

const ChatInterface = () => {
  const { messages, handleNewMessage, isLoading } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => scrollToBottom(), [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await handleNewMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
      {/* Chat Header */}
      <div className="p-4 bg-blue-600 text-white rounded-t-xl">
        <h2 className="text-xl font-bold">Event Planning Assistant</h2>
        <p className="text-sm">Ask me about event organization, logistics, or promotion!</p>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <ChatSuggestions onSelect={setInput} />
        
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[80%] p-3 rounded-lg ${
              message.isBot 
                ? 'bg-gray-100 text-gray-800'
                : 'bg-blue-600 text-white'
            }`}>
              <p className="whitespace-pre-wrap">{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-pulse">⚡</div>
            <span>Generating response...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about event planning..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
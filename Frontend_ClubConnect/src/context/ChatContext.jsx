import { createContext, useContext, useState } from 'react';
import { generateResponse } from '../services/geminiService.js';
const ChatContext = createContext();


export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  

  const handleNewMessage = async (input) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add user message
      setMessages(prev => [...prev, { 
        text: input, 
        isBot: false, 
        timestamp: new Date().toISOString() 
      }]);

      // Get bot response
      const response = await generateResponse(input);
      
      // Add bot message
      setMessages(prev => [...prev, { 
        text: response, 
        isBot: true, 
        timestamp: new Date().toISOString() 
      }]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, handleNewMessage, isLoading, error }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
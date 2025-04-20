import { ChatProvider } from '../context/ChatContext';
import ChatInterface from '../components/ChatInterface';

function ChatRoom() {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            University Event Planner Assistant
          </h1>
          <ChatInterface />
        </div>
      </div>
    </ChatProvider>
  );
}
export default ChatRoom;

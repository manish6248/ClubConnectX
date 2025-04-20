const ChatSuggestions = ({ onSelect }) => {
    const suggestions = [
      "List the topic of top 3 events this week",
      "which is event is good for coder",
      "What are the upcoming events?",
      "List the events in this week",
    ];
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        {suggestions.map((text) => (
          <button
            key={text}
            onClick={() => onSelect(text)}
            className="p-2 text-sm text-left bg-white border rounded-lg hover:bg-blue-50 transition-colors text-blue-800"
          >
            {text}
          </button>
        ))}
      </div>
    );
  };
  
  export default ChatSuggestions;
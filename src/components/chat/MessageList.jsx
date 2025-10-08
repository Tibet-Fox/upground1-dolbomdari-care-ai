import AIMessage from './AIMessage';

function MessageList({ messages, isLoading, onSuggestionClick, onPdfDownload }) {
  return (
    <div className="h-[500px] overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className="flex flex-col">
            <div
              className={`max-w-xs lg:max-w-lg xl:max-w-2xl px-4 py-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-50 text-gray-800'
              }`}
            >
              {message.sender === 'ai' ? (
                <AIMessage 
                  message={message} 
                  onSuggestionClick={onSuggestionClick}
                  onPdfDownload={onPdfDownload}
                />
              ) : (
                <div className="whitespace-pre-line leading-relaxed text-sm">
                  {message.text}
                </div>
              )}
            </div>
            <div className={`text-xs text-gray-500 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
              {message.timestamp}
            </div>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex flex-col">
            <div className="bg-blue-50 text-gray-800 px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-left">
              {new Date().toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageList;


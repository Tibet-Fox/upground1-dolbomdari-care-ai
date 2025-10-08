import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatContainer({ 
  messages, 
  isLoading, 
  isLoggedIn,
  onSendMessage,
  onSuggestionClick,
  onPdfDownload
}) {
  return (
    <div>
      {/* 채팅 메시지 영역 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🤖</span>
              </div>
              <span className="text-sm font-medium text-gray-800">돌봄다리 AI</span>
            </div>
            <div className="text-xs text-gray-500">
              {new Date().toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </div>
          </div>
          
          {/* 날짜와 면책 조항 */}
          <div className="text-xs text-gray-500">
            <div className="mb-1">
              {new Date().toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                weekday: 'long' 
              })}
            </div>
            <div>
              * 돌봄다리 AI는 공단 기준에 기반해 안내하나, 일부 오류가 발생할 수 있습니다.
            </div>
          </div>
        </div>
        
        <MessageList 
          messages={messages}
          isLoading={isLoading}
          onSuggestionClick={onSuggestionClick}
          onPdfDownload={onPdfDownload}
        />
      </div>

      {/* 입력 영역 */}
      <MessageInput 
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}

export default ChatContainer;


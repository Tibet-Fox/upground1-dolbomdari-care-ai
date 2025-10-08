import { useState } from 'react';

function MessageInput({ onSendMessage, isLoading, isLoggedIn = true, placeholder }) {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim() || isLoading || !isLoggedIn) return;
    
    onSendMessage(inputText);
    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl border-2 border-gray-200 p-4 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder || (isLoggedIn ? "무엇이든 궁금한 점이 있다면 편하게 말씀해주세요." : "채팅은 로그인 후 이용하실 수 있습니다.")}
          className="flex-1 border-none outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
          disabled={!isLoggedIn}
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || isLoading || !isLoggedIn}
          className={`p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 ${
            isLoggedIn 
              ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none' 
              : 'bg-gradient-to-b from-gray-400 to-gray-500 text-white cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default MessageInput;


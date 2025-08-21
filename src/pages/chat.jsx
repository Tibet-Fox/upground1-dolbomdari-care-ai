import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  // Dashboard에서 전달받은 초기 메시지 처리
  useEffect(() => {
    if (location.state?.initialMessage) {
      const initialMessage = location.state.initialMessage;
      setMessages([
        {
          id: 1,
          text: initialMessage,
          sender: 'user',
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }
  }, [location.state]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages([...messages, newMessage]);
      setInputText('');

      // AI 응답 시뮬레이션 (실제로는 API 호출)
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          text: "안녕하세요! 돌봄이입니다. 😊 질문해주신 내용에 대해 답변드리겠습니다. 더 자세한 정보가 필요하시면 언제든 말씀해주세요!",
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  const goToMain = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex h-screen bg-white font-sans">
      {/* 사이드바 */}
      <aside className="w-16 bg-gray-50 border-r flex flex-col items-center py-4 space-y-6 relative">
        <div className="absolute -right-3 top-4 bg-white border rounded-full p-1 shadow-sm">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <img src="/new.png" alt="new" className="w-6 h-6" />
        <img src="/menu.png" alt="menu" className="w-6 h-6" />
        <img src="/bookmark.png" alt="bookmark" className="w-6 h-6" />
        <div className="flex-grow" />
        <img src="/settings.png" alt="settings" className="w-5 h-5" />
      </aside>

      {/* 본문 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <header className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">돌봄다리</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span className="flex items-center gap-1">
              <span>💬</span>
              <span>채팅</span>
            </span>
            <span className="flex items-center gap-1">
              <span>🔔</span>
              <span>내 알림</span>
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">32</span>
            </span>
            <span className="flex items-center gap-1">
              <span>👤</span>
              <span>마이페이지</span>
            </span>
            <span className="text-gray-700">
              행복나눔재가복지센터 <strong>김사회 님</strong>
            </span>
          </div>
        </header>

        {/* 채팅 영역 */}
        <div className="flex flex-1">
          {/* 왼쪽 채팅 영역 */}
          <div className="flex-1 flex flex-col">
            {/* 메시지 목록 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <p className="text-lg font-semibold mb-2">돌봄이 AI와 대화를 시작해보세요!</p>
                  <p className="text-sm">복지 현장에서 궁금한 점을 편하게 물어보세요.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.sender === 'ai' && (
                          <span className="text-sm">🤖 돌봄이</span>
                        )}
                        <span className="text-xs opacity-70">{message.timestamp}</span>
                      </div>
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 입력 영역 */}
            <div className="border-t p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="무엇이든 궁금한 점이 있다면 편하게 말씀해주세요."
                  className="flex-1 border border-gray-300 rounded-full px-6 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                  aria-label="메시지 전송"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* 오른쪽 사이드바 */}
          <aside className={`bg-gray-50 border-l transition-all duration-300 ${isRightSidebarOpen ? 'w-64' : 'w-12'} relative`}>
            <button
              onClick={toggleRightSidebar}
              className="absolute -left-3 top-4 bg-white border rounded-full p-1 shadow-sm hover:bg-gray-50"
            >
              <svg 
                className={`w-4 h-4 text-gray-600 transition-transform ${isRightSidebarOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {isRightSidebarOpen ? (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">{'>>'}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">📁</span>
                  <span className="font-semibold text-gray-800">돌봄다리 자료실</span>
                </div>
                <div className="space-y-2">
                  <a href="#" className="block text-blue-600 text-sm hover:underline">2025 최신 고시 업데이트</a>
                  <a href="#" className="block text-blue-600 text-sm hover:underline">서식 다운로드</a>
                  <a href="#" className="block text-blue-600 text-sm hover:underline">FAQ 바로가기</a>
                  <a href="#" className="block text-blue-600 text-sm hover:underline">사용법 안내</a>
                  <a href="#" className="block text-blue-600 text-sm hover:underline">돌봄다리 전용 자료</a>
                </div>
              </div>
            ) : (
              <div className="p-2">
                <div className="flex flex-col items-center space-y-4">
                  <span className="text-lg">📁</span>
                  <span className="text-lg">📄</span>
                  <span className="text-lg">❓</span>
                  <span className="text-lg">📖</span>
                  <span className="text-lg">📚</span>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Chat;

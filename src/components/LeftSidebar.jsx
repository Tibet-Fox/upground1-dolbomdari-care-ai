import React, { useState, useEffect } from 'react';
import { getConversations } from '../api/chat';

function LeftSidebar({ 
  isOpen,
  onToggle,
  onNewChat,
  onSelectChat,
  selectedChatId
}) {
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 채팅 내역 불러오기
  const fetchChatHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 채팅 내역 조회 시작...');
      
      // 인증 토큰 확인
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      console.log('🔑 인증 토큰 존재:', !!token);
      
      const response = await getConversations(1, 20); // 최근 20개 대화
      console.log('📊 API 응답 전체:', response);
      console.log('📊 응답 타입:', typeof response);
      console.log('📊 응답 키들:', Object.keys(response || {}));
      
      // API 응답에서 대화 목록 추출
      const conversations = response.data || response.conversations || response;
      console.log('💬 추출된 대화 목록:', conversations);
      console.log('💬 대화 목록 타입:', typeof conversations);
      console.log('💬 대화 목록 길이:', Array.isArray(conversations) ? conversations.length : '배열이 아님');
      
      if (Array.isArray(conversations)) {
        setChatHistory(conversations);
        console.log('✅ 채팅 내역 설정 완료:', conversations.length, '개');
      } else {
        console.warn('⚠️ 예상과 다른 응답 형식:', response);
        setChatHistory([]);
      }
    } catch (error) {
      console.error('❌ 채팅 내역 조회 실패:', error);
      console.error('❌ 에러 상세:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setError(`채팅 내역을 불러올 수 없습니다: ${error.message}`);
      setChatHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChatHistory = () => {
    if (!isChatHistoryOpen && chatHistory.length === 0 && !isLoading) {
      // 처음 열 때만 데이터 로드
      fetchChatHistory();
    }
    setIsChatHistoryOpen(!isChatHistoryOpen);
  };

  // 새 채팅 생성 시 채팅 내역 새로고침
  const handleNewChat = () => {
    onNewChat();
    // 새 채팅 생성 후 채팅 내역 새로고침
    if (isChatHistoryOpen) {
      fetchChatHistory();
    }
  };

  // 채팅 내역을 강제로 새로고침하는 함수 (디버깅용)
  const refreshChatHistory = () => {
    console.log('🔄 채팅 내역 강제 새로고침');
    fetchChatHistory();
  };
  if (!isOpen) {
    return (
      <aside className="bg-white w-16 flex flex-col min-h-screen border-r border-gray-200">
        {/* 접힌 상태 - 토글 버튼만 표시 */}
        <div className="p-4 border-b border-gray-200">
          <button 
            onClick={onToggle}
            className="w-full bg-gradient-to-b from-white to-gray-100 border-2 border-blue-400 text-black font-bold px-4 py-2 rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 focus:outline-none transform hover:-translate-y-1 active:translate-y-0 hover:bg-gradient-to-b hover:from-blue-50 hover:to-blue-100 focus:border-blue-400"
          >
            <span>☰</span>
          </button>
        </div>
        
        {/* 접힌 상태 아이콘들 */}
        <div className="flex-1 p-4 space-y-2">
          <button className="w-full p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
            📄
          </button>
          <button className="w-full p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
            ✏️
          </button>
          <button className="w-full p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
            📋
          </button>
          <button className="w-full p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
            🔖
          </button>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button className="w-full p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="bg-white w-64 flex flex-col min-h-screen border-r border-gray-200">
      {/* 새 채팅 버튼 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button 
            onClick={handleNewChat}
            className="flex-1 bg-gradient-to-b from-white to-gray-100 border-2 border-blue-400 text-black font-bold px-4 py-2 rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 focus:outline-none transform hover:-translate-y-1 active:translate-y-0 hover:bg-gradient-to-b hover:from-blue-50 hover:to-blue-100 focus:border-blue-400"
          >
            <span>💬</span>
            <span>새 채팅</span>
          </button>
          <button 
            onClick={onToggle}
            className="ml-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            ◀
          </button>
        </div>
      </div>
      
      {/* 네비게이션 메뉴 */}
      <div className="flex-1 p-4 space-y-2">
        {/* 채팅 내역 버튼 */}
        <button 
          onClick={toggleChatHistory}
          className={`w-full text-left py-2 px-3 rounded-lg transition-colors flex items-center justify-between ${
            isChatHistoryOpen 
              ? 'bg-blue-50 text-blue-600' 
              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
          }`}
        >
          <span className="font-medium">채팅 내역</span>
          <svg 
            className={`w-4 h-4 transition-transform ${isChatHistoryOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* 채팅 내역 목록 */}
        {isChatHistoryOpen && (
          <div className="ml-4 space-y-1">
            {isLoading ? (
              <div className="py-2 px-3 text-sm text-gray-500 text-center">
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  로딩 중...
                </div>
              </div>
            ) : error ? (
              <div className="py-2 px-3 text-sm text-red-500 text-center">
                <div className="mb-2">{error}</div>
                <button 
                  onClick={refreshChatHistory}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  🔄 다시 시도
                </button>
              </div>
            ) : chatHistory.length === 0 ? (
              <div className="py-2 px-3 text-sm text-gray-500 text-center">
                <div className="mb-2">채팅 내역이 없습니다</div>
                <button 
                  onClick={refreshChatHistory}
                  className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  🔄 새로고침
                </button>
              </div>
            ) : (
              chatHistory.map((chat) => (
                <button
                  key={chat.id || chat.conversation_id}
                  className={`w-full text-left py-2 px-3 text-sm rounded-lg transition-colors ${
                    selectedChatId === (chat.id || chat.conversation_id)
                      ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    const chatId = chat.id || chat.conversation_id;
                    if (onSelectChat && chatId) {
                      onSelectChat(chatId);
                    }
                  }}
                >
                  <div className="font-medium truncate">
                    {chat.title || chat.conversation_title || `대화 ${chat.id || chat.conversation_id}`}
                  </div>
                  <div className="text-xs text-gray-400">
                    {chat.created_at ? new Date(chat.created_at).toLocaleDateString('ko-KR') : 
                     chat.date ? chat.date : '날짜 없음'}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
        
        <button className="w-full bg-gradient-to-b from-white to-gray-100 border-2 border-blue-400 text-black font-bold px-4 py-2 rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 focus:outline-none transform hover:-translate-y-1 active:translate-y-0 hover:bg-gradient-to-b hover:from-blue-50 hover:to-blue-100 focus:border-blue-400">
          <span>🔖</span>
          <span>북마크한 답변</span>
        </button>
      </div>
      
      {/* 설정 */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full bg-gradient-to-b from-white to-gray-100 border-2 border-blue-400 text-black font-bold px-4 py-2 rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 focus:outline-none transform hover:-translate-y-1 active:translate-y-0 hover:bg-gradient-to-b hover:from-blue-50 hover:to-blue-100 focus:border-blue-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>설정</span>
        </button>
      </div>
    </aside>
  );
}

export default LeftSidebar;

import React, { useState } from 'react';

function LeftSidebar({ 
  isChatHistoryOpen, 
  onNewChatClick, 
  onChatHistoryClick,
  isOpen,
  onToggle
}) {
  const toggleLeftSidebar = () => {
    onToggle(!isOpen);
  };

  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} flex flex-col min-h-0 flex-shrink-0 shadow-sm`}>
              {isOpen ? (
        // 펼쳐진 상태
        <div className="p-4 flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📋</span>
            </div>
            <button onClick={toggleLeftSidebar} className="w-6 h-6 hover:bg-gray-100 rounded p-1">
              <span className="text-gray-600">◀</span>
            </button>
          </div>

          {/* 네비게이션 메뉴 */}
          <div className="space-y-3">
            <button 
              onClick={onNewChatClick}
              className={`w-full text-left p-3 rounded-lg text-sm transition-all duration-200 flex items-center gap-3 ${
                !isChatHistoryOpen 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="text-lg">✏️</span>
              <span>새 채팅</span>
            </button>
            <button 
              onClick={onChatHistoryClick}
              className={`w-full text-left p-3 rounded-lg text-sm transition-all duration-200 flex items-center gap-3 ${
                isChatHistoryOpen 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="text-lg">📋</span>
              <span>채팅 내역</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-all duration-200 flex items-center gap-3">
              <span className="text-lg">🔖</span>
              <span>북마크한 답변</span>
            </button>
          </div>

          {/* 설정 버튼 - 최하단에 배치 */}
          <div className="mt-auto pt-4">
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-all duration-200 flex items-center gap-3">
              <span className="text-lg">⚙️</span>
              <span>설정</span>
            </button>
          </div>
        </div>
      ) : (
        // 접힌 상태
        <div className="flex flex-col items-center py-4 h-full space-y-4">
          <button onClick={toggleLeftSidebar} className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-600 text-sm">▶</span>
          </button>
          <button onClick={onNewChatClick} className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">✏️</span>
          </button>
          <button onClick={onChatHistoryClick} className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">📋</span>
          </button>
          <div className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">🔖</span>
          </div>
          <div className="flex-grow" />
          <div className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">⚙️</span>
          </div>
        </div>
      )}
    </aside>
  );
}

export default LeftSidebar;

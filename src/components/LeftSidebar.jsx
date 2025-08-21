import React from 'react';

function LeftSidebar({ 
  isOpen,
  onToggle,
  onNewChat
}) {
  if (!isOpen) {
    return (
      <aside className="bg-white w-16 flex flex-col min-h-screen border-r border-gray-200">
        {/* 접힌 상태 - 토글 버튼만 표시 */}
        <div className="p-4 border-b border-gray-200">
          <button 
            onClick={onToggle}
            className="w-full bg-blue-600 text-white py-3 px-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            ☰
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
            onClick={onNewChat}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            새 채팅
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
        <a href="#" className="block text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
          채팅 내역
        </a>
        <a href="#" className="block text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
          북마크한 답변
        </a>
      </div>
      
      {/* 설정 */}
      <div className="p-4 border-t border-gray-200">
        <a href="#" className="flex items-center text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          설정
        </a>
      </div>
    </aside>
  );
}

export default LeftSidebar;

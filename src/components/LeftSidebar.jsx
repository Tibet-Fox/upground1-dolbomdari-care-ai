import React from 'react';

function LeftSidebar({ 
  isOpen,
  onToggle
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
            💬
          </button>
          <button className="w-full p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
            🔖
          </button>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button className="w-full p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
            ⚙️
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
          <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
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
          <span className="mr-2">⚙️</span>
          설정
        </a>
      </div>
    </aside>
  );
}

export default LeftSidebar;

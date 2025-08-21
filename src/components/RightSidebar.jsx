import React from 'react';

function RightSidebar({ onFaqClick, isOpen, onToggle }) {
  if (!isOpen) {
    return (
      <aside className="bg-white w-16 flex flex-col min-h-screen border-l border-gray-200">
        {/* 접힌 상태 - 토글 버튼만 표시 */}
        <div className="p-4 border-b border-gray-200">
          <button 
            onClick={onToggle}
            className="w-full bg-blue-600 text-white py-3 px-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            📁
          </button>
        </div>
        
        {/* 접힌 상태 아이콘들 */}
        <div className="flex-1 p-4 space-y-3">
          <button className="w-full p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
            📅
          </button>
          <button className="w-full p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
            📄
          </button>
          <button 
            onClick={onFaqClick}
            className="w-full p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            ❓
          </button>
          <button className="w-full p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
            📖
          </button>
          <button className="w-full p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
            📚
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="bg-white w-64 flex flex-col min-h-screen border-l border-gray-200">
      {/* 제목 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="mr-2 text-blue-600">📁</span>
            돌봄다리 자료실
          </h3>
          <button 
            onClick={onToggle}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            ▶
          </button>
        </div>
      </div>
      
      {/* 자료실 메뉴 */}
      <div className="flex-1 p-4 space-y-3">
        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-left">
          2025 최신 고시 업데이트
        </button>
        
        <button className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors font-medium text-left">
          서식 다운로드
        </button>
        
        <button 
          onClick={onFaqClick}
          className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors font-medium text-left"
        >
          FAQ 바로가기
        </button>
        
        <button className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors font-medium text-left">
          사용법 안내
        </button>
        
        <button className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors font-medium text-left">
          돌봄다리 전용 자료
        </button>
      </div>
    </aside>
  );
}

export default RightSidebar;

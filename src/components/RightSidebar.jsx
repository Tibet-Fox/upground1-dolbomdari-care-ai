import React, { useState } from 'react';

function RightSidebar({ onFaqPopupOpen, isOpen, onToggle }) {
  const toggleRightSidebar = () => {
    onToggle(!isOpen);
  };

  return (
    <aside className={`bg-white border-l border-gray-200 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} relative min-h-0 flex-shrink-0 shadow-sm`} style={{ width: isOpen ? '256px' : '64px' }}>
      <button
        onClick={toggleRightSidebar}
        className="p-2 hover:bg-gray-100 rounded-lg m-2"
      >
        <span className={`text-gray-600 text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? '◀' : '▶'}
        </span>
      </button>
      
      {isOpen ? (
        <div className="p-4">
          <div className="flex items-center justify-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">도구</h3>
          </div>
          
          {/* 메뉴 아이템들 */}
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-all duration-200 flex items-center gap-3">
              <span className="text-lg">📁</span>
              <span>돌봄다리 자료실</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-all duration-200 flex items-center gap-3">
              <span className="text-lg">📜</span>
              <span>2025 최신 고시 업데이트</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-all duration-200 flex items-center gap-3">
              <span className="text-lg">📄</span>
              <span>서식 다운로드</span>
            </button>
            <button 
              onClick={onFaqPopupOpen}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-all duration-200 flex items-center gap-3"
            >
              <span className="text-lg">❓</span>
              <span>FAQ 바로가기</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-all duration-200 flex items-center gap-3">
              <span className="text-lg">📖</span>
              <span>사용법 안내</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-all duration-200 flex items-center gap-3">
              <span className="text-lg">💎</span>
              <span>돌봄다리 전용 자료</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-2">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">📁</span>
            </div>
            <div className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">📜</span>
            </div>
            <div className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">📄</span>
            </div>
            <div className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">❓</span>
            </div>
            <div className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">📖</span>
            </div>
            <div className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">💎</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default RightSidebar;

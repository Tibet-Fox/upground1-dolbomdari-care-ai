import React from 'react';

function RightSidebar({ onFaqClick, isOpen, onToggle }) {
  return (
    <aside className="bg-gray-100 w-16 flex flex-col items-center py-4 min-h-screen">
      {/* 확장 버튼 */}
      <button 
        onClick={onToggle}
        className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-50 cursor-pointer"
      >
        <span className="text-gray-600 text-sm">◀◀</span>
      </button>
    </aside>
  );
}

export default RightSidebar;

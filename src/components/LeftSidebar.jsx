import React from 'react';

function LeftSidebar({ 
  isOpen,
  onToggle
}) {
  return (
    <aside className="bg-gray-100 w-16 flex flex-col items-center py-4 space-y-4 min-h-screen">
      {/* 문서 아이콘 */}
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-50 cursor-pointer">
        <span className="text-gray-600">📄</span>
      </div>
      
      {/* 편집 아이콘 */}
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-50 cursor-pointer">
        <span className="text-gray-600">✏️</span>
      </div>
      
      {/* 메뉴 아이콘 */}
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-50 cursor-pointer">
        <span className="text-gray-600">☰</span>
      </div>
      
      {/* 북마크 아이콘 */}
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-50 cursor-pointer">
        <span className="text-gray-600">🔖</span>
      </div>
    </aside>
  );
}

export default LeftSidebar;

// src/components/LoginHeader.jsx
import { Link } from 'react-router-dom';

function LoginHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 w-full shadow-sm sticky top-0 z-50">
      {/* 로고 - Dashboard Header와 동일한 크기 */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">U</span>
        </div>
        <span className="text-xl font-bold text-gray-800">돌봄다리</span>
      </div>
      
      <nav className="flex gap-4 sm:gap-6 text-sm text-gray-700 items-center">
        <a href="#" className="hover:text-blue-600 transition-colors">돌봄다리 소개</a>
        <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1">
          채팅 <span>💬</span>
        </a>
        <Link to="/signup/step1" className="hover:text-blue-600 transition-colors">회원가입</Link>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
          로그인
        </button>
      </nav>
    </header>
  );
}

export default LoginHeader;

// src/components/LoginHeader.jsx
import { Link, useNavigate } from 'react-router-dom';

function LoginHeader() {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 w-full shadow-sm sticky top-0 z-50">
      {/* 로고 */}
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/')}
          className="hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none p-0"
        >
          <img src="/logo.png" alt="로고" className="w-40 h-10" />
        </button>
      </div>
      
      <nav className="flex gap-4 sm:gap-6 text-sm text-gray-700 items-center">
        <a href="#" className="hover:text-blue-600 transition-colors">돌봄다리 소개</a>
        <Link to="/signup/step1" className="hover:text-blue-600 transition-colors">회원가입</Link>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
          로그인
        </button>
      </nav>
    </header>
  );
}

export default LoginHeader;

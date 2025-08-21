// src/components/Header.jsx
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    console.log('로고 클릭됨!');
    
    // Dashboard로 이동
    navigate('/dashboard');
    
    // 약간의 지연 후 메인 화면으로 리셋하는 이벤트 발생
    setTimeout(() => {
      console.log('resetDashboard 이벤트 발생');
      window.dispatchEvent(new CustomEvent('resetDashboard'));
    }, 100);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 w-full shadow-sm sticky top-0 z-50">
      {/* 로고 */}
      <div className="flex items-center gap-2">
        <button 
          onClick={handleLogoClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none p-0"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">U</span>
          </div>
          <span className="text-xl font-bold text-gray-800">돌봄다리</span>
        </button>
      </div>
      
      {/* 네비게이션 링크 */}
      <div className="flex items-center gap-6">
        <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
          돌봄다리 소개
        </a>
        <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1">
          <span>💬</span>
          채팅
        </a>
        <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
          회원가입
        </a>
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          로그인
        </button>
      </div>
    </header>
  );
}

export default Header;

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
    <header className="flex items-center justify-between px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-white border-b border-gray-200 w-full shadow-sm">
      <div className="flex items-center gap-2">
        <button 
          onClick={handleLogoClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none p-0"
        >
          <img src="/logo.png" alt="로고" className="w-20 h-15 sm:w-24 h-18 lg:w-28 h-21 object-contain" />
        </button>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <span>💬</span>
            <span>채팅</span>
          </span>
          <span className="flex items-center gap-1">
            <span>🔔</span>
            <span>내 알림 32</span>
          </span>
          <span className="flex items-center gap-1">
            <span>👤</span>
            <span>마이페이지</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="hidden sm:inline">🏢</span>
          <span className="hidden sm:inline">행복나눔재가복지센터</span>
          <span className="font-medium">김사회 님</span>
        </div>
      </div>
    </header>
  );
}

export default Header;

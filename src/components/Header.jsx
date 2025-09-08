// src/components/Header.jsx
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Header() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  // 사용자 정보 로드
  useEffect(() => {
    const loadUserInfo = () => {
      try {
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          setUserInfo(userData);
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      }
    };

    loadUserInfo();

    // 로그인 상태 변경 이벤트 리스너
    const handleLoginStatusChange = () => {
      loadUserInfo();
    };

    window.addEventListener('loginStatusChanged', handleLoginStatusChange);
    
    return () => {
      window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
    };
  }, []);

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
      <div className="flex items-center">
        <button 
          onClick={handleLogoClick}
          className="hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none p-0"
        >
          <img src="/logo.png" alt="로고" className="w-40 h-10" />
        </button>
      </div>
      
      {/* 네비게이션 링크 */}
      <div className="flex items-center gap-6">
        <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1">
          <span>💬</span>
          채팅
        </a>
        <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1 relative">
          <span>🔔</span>
          내 알림
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            32
          </span>
        </a>
        <button 
          onClick={() => navigate('/mypage')}
          className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer"
        >
          <span>👤</span>
          마이페이지
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <span>🏢</span>
            <span>
              {userInfo ? (
                <>
                  {userInfo.organization || userInfo.center_name || '기관명'} 
                  {userInfo.name && ` ${userInfo.name} 님`}
                </>
              ) : (
                '사용자 정보 로딩 중...'
              )}
            </span>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('current_conversation_id');
              window.dispatchEvent(new CustomEvent('loginStatusChanged'));
              navigate('/');
            }}
            className="text-gray-600 hover:text-red-600 transition-colors text-sm"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

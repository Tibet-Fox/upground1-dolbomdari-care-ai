import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import FaqPopup from '../components/FaqPopup';
import CategoryGrid from '../components/category/CategoryGrid';
import MessageInput from '../components/chat/MessageInput';
import { useCategoryData } from '../hooks/useCategoryData';
import { getConversationDetails } from '../api/chat';

function DashboardSimple() {
  const navigate = useNavigate();
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isFaqPopupOpen, setIsFaqPopupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const { categories } = useCategoryData();

  // 새 대화 시작
  const handleNewChat = () => {
    console.log('새 대화 시작');
    navigate('/dashboard');
  };

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const isLoggedInStatus = !!token;
      setIsLoggedIn(isLoggedInStatus);
    };

    checkLoginStatus();

    const handleLoginStatusChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('loginStatusChanged', handleLoginStatusChange);
    window.addEventListener('focus', checkLoginStatus);

    return () => {
      window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
      window.removeEventListener('focus', checkLoginStatus);
    };
  }, []);

  // resetDashboard 이벤트 리스너
  useEffect(() => {
    const handleResetDashboard = () => {
      console.log('Dashboard 리셋 이벤트 수신');
      setIsLeftSidebarOpen(false);
      setIsRightSidebarOpen(false);
      setIsFaqPopupOpen(false);
      setSelectedCategory(null);
    };

    window.addEventListener('resetDashboard', handleResetDashboard);

    return () => {
      window.removeEventListener('resetDashboard', handleResetDashboard);
    };
  }, []);

  const handleSendMessage = (text) => {
    if (!text.trim() || !isLoggedIn) return;
    
    // 일반 채팅 페이지로 이동
    navigate('/chat/general', { state: { initialMessage: text } });
  };

  // 대화 선택 핸들러
  const handleSelectChat = async (chatId) => {
    try {
      console.log('대화 선택:', chatId);
      navigate(`/chat/history/${chatId}`);
    } catch (error) {
      console.error('대화 로드 실패:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        <LeftSidebar 
          isOpen={isLeftSidebarOpen} 
          onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          selectedChatId={null}
        />
        
        <div className="flex-1">
          <div className="max-w-6xl mx-auto p-8">
            {/* 메인 제목 */}
            <div className="text-center mb-12 mt-16 flex flex-col items-center">
              <h1 className="text-4xl font-bold text-blue-600 mb-4 text-center">
                돌봄다리 AI 전문가의 24시간 상담 서비스
              </h1>
              <p className="text-lg text-gray-700 text-center max-w-2xl">
                실무에 꼭 맞는 공단 기준 상담, 365일 24시간 답해드립니다.
              </p>
            </div>

            {/* AI 캐릭터와 콘텐츠 영역 */}
            <div className="flex items-start justify-center gap-12 mb-12">
              {/* AI 캐릭터 */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <img 
                    src="/chatcharacter.png" 
                    alt="돌봄이 AI 캐릭터" 
                    className="w-48 h-48 object-contain"
                  />
                </div>
              </div>

              {/* 콘텐츠 영역 */}
              <div className="flex-1 max-w-4xl">
                <div className="text-blue-600 text-lg mb-4 font-bold">
                  아래 선택지 중에서 궁금한 걸 골라보세요.
                </div>
                <div className="text-blue-600 text-lg mb-8 font-bold">
                  돌봄이가 빠르게 답해드릴게요!
                </div>

                {/* 카테고리 그리드 */}
                <CategoryGrid 
                  categories={categories}
                  selectedCategory={selectedCategory}
                />

                {/* 채팅 입력 영역 */}
                <MessageInput 
                  onSendMessage={handleSendMessage}
                  isLoading={false}
                  isLoggedIn={isLoggedIn}
                />
              </div>
            </div>
          </div>
        </div>
        
        <RightSidebar 
          isOpen={isRightSidebarOpen} 
          onToggle={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          onFaqClick={() => setIsFaqPopupOpen(true)}
        />
      </div>

      {isFaqPopupOpen && (
        <FaqPopup onClose={() => setIsFaqPopupOpen(false)} />
      )}
    </div>
  );
}

export default DashboardSimple;


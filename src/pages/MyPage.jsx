import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';

function MyPage() {
  const navigate = useNavigate();
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    emailId: '',
    emailDomain: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // 사용자 정보 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        // 1. localStorage에서 먼저 확인
        console.log('localStorage의 모든 키:', Object.keys(localStorage));
        
        const user = localStorage.getItem('user');
        console.log('localStorage에서 가져온 user 데이터:', user);
        
        if (user) {
          const userData = JSON.parse(user);
          console.log('파싱된 userData:', userData);
          setUserInfo(userData);
          
          // 폼 데이터 설정
          const email = userData.email || '';
          const [emailId, emailDomain] = email.split('@');
          
          const newFormData = {
            name: userData.name || '',
            birthDate: userData.birthDate || '',
            emailId: emailId || '',
            emailDomain: emailDomain || '',
            phone: userData.phone || '',
            password: '',
            confirmPassword: ''
          };
          
          console.log('설정할 폼 데이터:', newFormData);
          setFormData(newFormData);
        } else {
          // 2. localStorage에 없으면 API에서 가져오기
          console.log('localStorage에 user 데이터가 없습니다. API에서 가져옵니다.');
          
          const token = localStorage.getItem('token') || localStorage.getItem('access_token');
          if (token) {
            try {
              const { getUserInfo } = await import('../api/auth');
              const apiUserData = await getUserInfo();
              console.log('API에서 가져온 사용자 정보:', apiUserData);
              
              // localStorage에 저장
              localStorage.setItem('user', JSON.stringify(apiUserData));
              
              setUserInfo(apiUserData);
              
              // 폼 데이터 설정
              const email = apiUserData.email || '';
              const [emailId, emailDomain] = email.split('@');
              
              const newFormData = {
                name: apiUserData.name || '',
                birthDate: apiUserData.birthDate || '',
                emailId: emailId || '',
                emailDomain: emailDomain || '',
                phone: apiUserData.phone || '',
                password: '',
                confirmPassword: ''
              };
              
              setFormData(newFormData);
            } catch (apiError) {
              console.error('API에서 사용자 정보 가져오기 실패:', apiError);
              // API 실패 시 빈 폼으로 초기화
              setFormData({
                name: '',
                birthDate: '',
                emailId: '',
                emailDomain: '',
                phone: '',
                password: '',
                confirmPassword: ''
              });
            }
          }
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      }
    };

    loadUserInfo();
  }, []);

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_conversation_id');
    window.dispatchEvent(new CustomEvent('loginStatusChanged'));
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        <LeftSidebar 
          isOpen={isLeftSidebarOpen} 
          onToggle={toggleLeftSidebar}
          onNewChat={() => navigate('/dashboard')}
          onSelectChat={() => {}}
          selectedChatId={null}
        />
        
        <div className="flex-1">
          <div className="max-w-4xl mx-auto p-8">
            {/* 페이지 제목 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">계정 관리</h1>
              </div>
              
              {/* 탭 메뉴 */}
              <div className="flex gap-8 border-b border-gray-200">
                <button className="pb-3 border-b-2 border-blue-600 text-blue-600 font-medium">
                  계정 관리
                </button>
                <button className="pb-3 text-gray-500 hover:text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  고객 지원
                </button>
              </div>
            </div>

            {/* 회원 정보 조회 섹션 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                회원 정보
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                회원가입 시 입력하신 정보입니다.
              </p>

              <div className="grid grid-cols-1 gap-8">
                {/* 사용자 정보 표시 */}
                <div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 성명 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        성명
                      </label>
                      <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                        {formData.name || '정보 없음'}
                      </div>
                    </div>

                    {/* 이메일 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이메일
                      </label>
                      <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                        {formData.emailId && formData.emailDomain ? `${formData.emailId}@${formData.emailDomain}` : '정보 없음'}
                      </div>
                    </div>

                    {/* 전화번호 */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        전화번호
                      </label>
                      <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                        {formData.phone || '정보 없음'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full bg-white text-gray-700 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;

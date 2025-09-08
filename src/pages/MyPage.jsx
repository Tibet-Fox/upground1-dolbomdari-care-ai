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
    const loadUserInfo = () => {
      try {
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          setUserInfo(userData);
          
          // 폼 데이터 설정
          const email = userData.email || '';
          const [emailId, emailDomain] = email.split('@');
          
          setFormData({
            name: userData.name || '',
            birthDate: userData.birthDate || '1959/03/18',
            emailId: emailId || 'carebridge',
            emailDomain: emailDomain || 'gmail.com',
            phone: userData.phone || '010-1234-5678',
            password: 'carebridge',
            confirmPassword: 'carebridge'
          });
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // 폼 데이터 검증
    if (!formData.name || !formData.birthDate || !formData.emailId || !formData.emailDomain || !formData.phone || !formData.password) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 사용자 정보 업데이트
    const updatedUserInfo = {
      ...userInfo,
      name: formData.name,
      birthDate: formData.birthDate,
      email: `${formData.emailId}@${formData.emailDomain}`,
      phone: formData.phone
    };

    localStorage.setItem('user', JSON.stringify(updatedUserInfo));
    setUserInfo(updatedUserInfo);
    
    alert('프로필이 수정되었습니다.');
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

            {/* 프로필 수정 섹션 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                프로필 수정
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                <span className="text-red-500">*</span>표시는 필수 입력 사항
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 프로필 사진 */}
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    프로필 사진
                  </label>
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      등록
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                      삭제
                    </button>
                  </div>
                </div>

                {/* 사용자 정보 폼 */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 성명 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        성명<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        성명은 꼭 실명으로 입력해 주시기 바랍니다.
                      </p>
                    </div>

                    {/* 생년월일 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        생년월일<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        placeholder="ex. 2000/01/01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* 이메일 */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이메일<span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={formData.emailId}
                          onChange={(e) => handleInputChange('emailId', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <span className="text-gray-500">@</span>
                        <input
                          type="text"
                          value={formData.emailDomain}
                          onChange={(e) => handleInputChange('emailDomain', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* 전화번호 */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        전화번호<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* 비밀번호 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        비밀번호<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* 비밀번호 확인 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        비밀번호 확인<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  수정
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-white text-gray-700 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
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

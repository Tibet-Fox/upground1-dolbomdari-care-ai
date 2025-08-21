// src/pages/signup/Step2.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/auth';

function Step2() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    emailId: '',
    emailDomain: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = async () => {
    // 간단한 유효성 검사
    if (!formData.name || !formData.emailId || !formData.emailDomain || !formData.password || !formData.confirmPassword) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 이메일 형식 검사
    const email = `${formData.emailId}@${formData.emailDomain}`;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 회원가입 API 호출
      const userData = {
        name: formData.name,
        email: email,
        password: formData.password,
        username: email // 로그인 시 사용할 username
      };

      console.log('회원가입 데이터:', userData);
      console.log('API URL:', import.meta.env.VITE_API_BASE_URL || 'https://api.carebridges.o-r.kr');
      
      const response = await registerUser(userData);
      console.log('회원가입 성공:', response);
      
      // 성공 시 Step3로 이동
      navigate('/signup/step3');
    } catch (error) {
      console.error('회원가입 실패 - 전체 에러:', error);
      console.error('에러 타입:', error.name);
      console.error('에러 메시지:', error.message);
      console.error('에러 코드:', error.code);
      
      if (error.response) {
        console.error('응답 상태:', error.response.status);
        console.error('응답 데이터:', error.response.data);
        console.error('응답 헤더:', error.response.headers);
      } else if (error.request) {
        console.error('요청은 보냈지만 응답을 받지 못함');
        console.error('요청:', error.request);
      } else {
        console.error('요청 설정 중 오류 발생');
      }
      
      const errorMessage = error.response?.data?.message || error.message || '회원가입 중 오류가 발생했습니다.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/signup/step1');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <div className="text-gray-500 text-sm">회원가입_회원정보 입력 중1</div>
          <img src="/logo.png" alt="로고" className="w-7 h-7" />
          <span className="text-blue-600 font-semibold">돌봄다리</span>
        </div>
        <nav className="flex gap-6 text-sm text-gray-700 items-center">
          <a href="#" className="hover:text-blue-600">돌봄다리 소개</a>
          <a href="#" className="hover:text-blue-600">채팅 💬</a>
          <a href="#" className="hover:text-blue-600">회원가입</a>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">로그인</button>
        </nav>
      </header>

      {/* 진행 단계 */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex justify-between text-sm border-b pb-4">
          <div className="text-blue-600 font-semibold flex items-center gap-2">
            <span>👤</span>
            STEP 01. 회원정보 입력
            <div className="w-full h-1 bg-blue-600 mt-2"></div>
          </div>
          <div className="text-gray-400 flex items-center gap-2">
            <span>✅</span>
            STEP 02. 회원가입 완료
          </div>
        </div>
      </div>

      {/* 메인 폼 */}
      <main className="max-w-2xl mx-auto px-6 py-8">
        <form className="space-y-6">
          {/* 개인정보 입력 섹션 */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              개인정보 입력 <span className="text-red-500 text-sm">*표시는 필수 입력 사항</span>
            </h3>
            
            {/* 성명 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                성명<span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="성명을 입력해주세요"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="text-xs text-gray-500 self-center whitespace-nowrap">
                  성명은 꼭 실명으로 입력해 주시기 바랍니다.
                </div>
              </div>
            </div>

            {/* 이메일 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일<span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.emailId}
                  onChange={(e) => handleInputChange('emailId', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="이메일 ID"
                />
                <span className="text-gray-500 font-medium">@</span>
                <input
                  type="text"
                  value={formData.emailDomain}
                  onChange={(e) => handleInputChange('emailDomain', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="도메인"
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호<span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 비밀번호 확인 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인<span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-center gap-4 pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="px-8 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              이전
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="px-8 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? '처리중...' : '다음'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Step2;

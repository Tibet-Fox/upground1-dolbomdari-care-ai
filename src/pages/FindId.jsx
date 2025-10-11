// src/pages/FindId.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findEmail } from '../api/auth';
import LoginHeader from '../components/LoginHeader';

function FindId() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [foundEmail, setFoundEmail] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // 입력 시 에러 메시지 초기화
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!formData.name || !formData.phone) {
      setError('이름과 전화번호를 모두 입력해주세요.');
      return;
    }

    // 전화번호 형식 검사 (010-1234-5678 형식)
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('전화번호는 010-1234-5678 형식으로 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await findEmail(formData.name, formData.phone);
      console.log('이메일 찾기 성공:', response);
      
      // API 응답에서 이메일 추출
      const email = response.email || response.data?.email;
      
      if (email) {
        setFoundEmail(email);
        setShowResult(true);
      } else {
        setError('일치하는 회원 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('이메일 찾기 실패:', error);
      
      if (error.response?.status === 404) {
        setError('일치하는 회원 정보를 찾을 수 없습니다.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('이메일 찾기 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', phone: '' });
    setFoundEmail('');
    setShowResult(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      <LoginHeader />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md">
          {!showResult ? (
            // 이메일 찾기 폼
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 text-center">이메일 찾기</h1>
              <p className="text-gray-600 text-sm sm:text-base mb-8 text-center">
                회원가입 시 입력한 이름과 전화번호를 입력해주세요.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 이름 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="이름을 입력하세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  />
                </div>

                {/* 전화번호 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전화번호<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="010-1234-5678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    하이픈(-)을 포함하여 입력해주세요
                  </p>
                </div>

                {/* 버튼 영역 */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    disabled={isLoading}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isLoading ? '확인 중...' : '확인'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // 이메일 찾기 결과
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">이메일을 찾았습니다!</h1>
                <p className="text-gray-600 text-sm mb-6">
                  입력하신 정보와 일치하는 이메일입니다.
                </p>
              </div>

              {/* 찾은 이메일 표시 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">회원님의 이메일</p>
                <p className="text-xl font-bold text-blue-600 break-all">
                  {foundEmail}
                </p>
              </div>

              {/* 버튼 영역 */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  다시 찾기
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  로그인하기
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default FindId;

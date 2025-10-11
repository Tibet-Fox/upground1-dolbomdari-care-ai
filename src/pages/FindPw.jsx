// src/pages/FindPw.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findPassword } from '../api/auth';
import LoginHeader from '../components/LoginHeader';

function FindPw() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await findPassword(email);
      console.log('비밀번호 찾기 성공:', response);
      
      // 성공 시 결과 화면 표시
      setShowResult(true);
    } catch (error) {
      console.error('비밀번호 찾기 실패:', error);
      
      if (error.response?.status === 404) {
        setError('등록되지 않은 이메일입니다.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('비밀번호 찾기 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setShowResult(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      <LoginHeader />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md">
          {!showResult ? (
            // 비밀번호 찾기 폼
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 text-center">비밀번호 찾기</h1>
              <p className="text-gray-600 text-sm sm:text-base mb-8 text-center">
                가입하신 이메일 주소를 입력해주세요.<br />
                비밀번호 재설정 링크를 보내드립니다.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 이메일 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(''); // 입력 시 에러 메시지 초기화
                    }}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    회원가입 시 사용한 이메일을 입력해주세요
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
                    {isLoading ? '전송 중...' : '확인'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // 비밀번호 찾기 결과
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">이메일을 전송했습니다!</h1>
                <p className="text-gray-600 text-sm mb-6">
                  비밀번호 재설정 링크를 이메일로 보내드렸습니다.
                </p>
              </div>

              {/* 전송된 이메일 표시 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">전송된 이메일</p>
                <p className="text-lg font-bold text-blue-600 break-all mb-4">
                  {email}
                </p>
                <div className="text-sm text-gray-700 text-left space-y-2">
                  <p className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">📌</span>
                    <span>이메일이 도착하지 않으면 스팸 메일함을 확인해주세요.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">⏰</span>
                    <span>링크는 발송 후 30분 동안 유효합니다.</span>
                  </p>
                </div>
              </div>

              {/* 버튼 영역 */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  다시 보내기
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

export default FindPw;

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoginHeader from '../components/LoginHeader';
import { resetPassword } from '../api/auth';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    // URL에서 토큰 추출
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl && tokenFromUrl.length > 0) {
      setToken(tokenFromUrl);
      console.log('토큰 추출 완료:', tokenFromUrl);
    } else {
      setError('유효하지 않은 링크입니다. 토큰이 없거나 잘못된 형식입니다.');
    }
  }, [searchParams]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword.trim()) {
      setError('새 비밀번호를 입력해주세요.');
      return;
    }

    if (newPassword.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      setError('비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, newPassword);
      setShowResult(true);
    } catch (err) {
      console.error('비밀번호 재설정 실패:', err);
      console.error('에러 응답:', err.response?.data);
      
      if (err.response?.status === 400) {
        setError('유효하지 않은 토큰이거나 만료된 링크입니다. 새로운 링크를 요청해주세요.');
      } else if (err.response?.status === 422) {
        setError('비밀번호 형식이 올바르지 않습니다.');
      } else if (err.response?.status === 404) {
        setError('토큰을 찾을 수 없습니다. 링크가 만료되었거나 잘못되었습니다.');
      } else {
        setError(`비밀번호 재설정 중 오류가 발생했습니다. (${err.response?.status || '네트워크 오류'})`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      <LoginHeader />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md lg:max-w-lg text-center bg-gray-50 p-8 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">비밀번호 재설정</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!showResult ? (
            // 비밀번호 재설정 폼
            <div className="space-y-6">
              <p className="text-gray-600 text-sm mb-4">새로운 비밀번호를 입력해주세요.</p>
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 text-left mb-2">
                    새 비밀번호<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호를 입력하세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-left">
                    영문, 숫자, 특수문자 포함 8자 이상
                  </p>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-left mb-2">
                    비밀번호 확인<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호를 다시 입력하세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  />
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
                    disabled={isLoading || !token}
                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isLoading ? '재설정 중...' : '비밀번호 재설정'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // 재설정 완료 결과
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">비밀번호가 재설정되었습니다!</h2>
              <p className="text-gray-700 text-sm mb-6">새로운 비밀번호로 로그인해주세요.</p>

              {/* 버튼 영역 */}
              <div className="flex gap-3">
                <button
                  onClick={handleGoToLogin}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
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

export default ResetPassword;

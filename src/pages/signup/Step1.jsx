// src/pages/signup/Step1.jsx
import { useNavigate } from 'react-router-dom';

function Step1() {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/signup/step2');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <div className="text-gray-500 text-sm">회원가입_직무선택</div>
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

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-6 py-12 text-center">
        {/* 메인 메시지 */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          모든 사회복지사를 위한 AI 실무 파트너
        </h1>
        <p className="text-xl text-blue-600 font-semibold mb-12">
          지금, 돌봄다리와 연결되세요
        </p>

        {/* 직무 선택 카드 */}
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
            {/* AI 캐릭터 */}
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto mb-4 relative">
                <img 
                  src="/dolbom_sign.png" 
                  alt="AI 캐릭터" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* 직무 설명 */}
            <div className="mb-6">
              <p className="text-gray-800 text-lg mb-2">
                기관에서 근무 중인 요양기관 종사자라면
              </p>
              <p className="text-blue-600 text-xl font-semibold">
                장기요양기관 종사자
              </p>
            </div>

            {/* 회원가입 버튼 */}
            <button
              onClick={handleSignup}
              className="w-full bg-blue-500 text-white py-4 px-6 rounded-lg hover:bg-blue-600 transition-colors font-semibold text-lg"
            >
              1분만에 회원가입 하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Step1;

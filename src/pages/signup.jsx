import { Outlet, useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();

  const handleJoin = () => {
    // 첫 단계로 이동
    navigate('/signup/step1');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="로고" className="w-7 h-7" />
        </div>
        <nav className="hidden md:flex gap-6 text-sm text-gray-700 items-center">
          <a href="#">돌봄다리 소개</a>
          <a href="#">고객지원센터</a>
          <a href="#">마이페이지</a>
          <a href="#">회원가입</a>
          <button className="px-4 py-1 bg-blue-500 text-white rounded">로그인</button>
        </nav>
      </header>

      {/* 본문 */}
      <main className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-gray-700 text-sm md:text-base font-medium">
          모든 사회복지사를 위한 AI 실무 파트너
        </p>
        <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mt-1 mb-8">
          지금, 돌봄다리와 연결되세요
        </h2>

        <div className="border rounded-xl p-8 max-w-xs w-full shadow-sm">
          <img src="/profile-placeholder.png" alt="회원" className="w-20 h-20 mx-auto mb-4" />
          <p className="text-xs text-gray-500">
            기관에서 근무 중인 요양 기관 종사자라면
          </p>
          <p className="text-sm font-semibold text-blue-600 mb-5">
            장기요양 기관 종사자
          </p>
          <button
            onClick={handleJoin}
            className="w-full py-2 bg-blue-500 text-white text-sm font-semibold rounded hover:bg-blue-600 transition"
          >
            1분만에 회원가입하기
          </button>
        </div>

        {/* 하위 라우트가 있으면 이 자리에서 렌더링됨 */}
        <div className="mt-12 w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Signup;

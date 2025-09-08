// src/pages/signup/Step3.jsx
import { useNavigate } from 'react-router-dom';
import LoginHeader from '../../components/LoginHeader';

function Step3() {
  const navigate = useNavigate();

  const handleGoMain = () => {
    navigate('/'); // 또는 원하는 메인 페이지 경로
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* 헤더 */}
      <LoginHeader />

      {/* 상단 진행 단계 표시 */}
      <div className="flex justify-center gap-6 text-sm border-b pb-4 mt-6">
        <div className="text-gray-400">STEP 01. 약관동의</div>
        <div className="text-gray-400">STEP 02. 회원정보 입력</div>
        <div className="text-blue-600 font-semibold border-b-2 border-blue-500 pb-1">
          STEP 03. 회원가입 완료
        </div>
      </div>

      {/* 본문 */}
      <main className="max-w-3xl mx-auto text-center py-20 px-4">
        <img src="/icon-check.png" alt="완료" className="w-16 h-16 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-blue-600 mb-4">돌봄다리 회원가입을 환영합니다.</h2>
        <p className="text-gray-700 text-sm mb-2">
          돌봄다리 AI 어시스턴트가 장기요양 실무의 든든한 도우미가 되어드릴게요.
          <br />
          지금 바로 돌봄다리 AI와 대화해보세요.
        </p>
        <p className="text-sm mt-6 text-gray-500">
          ※ 회원가입 내역 확인 및 수정은 <span className="text-blue-600 font-semibold">마이페이지 {'>'} 회원정보 수정</span>에서 가능합니다.
        </p>

        <button
          onClick={handleGoMain}
          className="mt-10 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded text-base font-bold"
        >
          메인으로
        </button>
      </main>
    </div>
  );
}

export default Step3;

import { useNavigate } from 'react-router-dom'; // ✅ 추가

function Chat() {
  const navigate = useNavigate(); // ✅ 네비게이션 훅

  const goToMain = () => {
    navigate('/'); // ✅ Main 페이지로 이동
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white dark:bg-gray-900 text-center">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
        🧠 여기는 돌봄 챗봇 화면입니다
      </h2>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6">
        여기에 챗봇 UI가 들어갈 예정입니다.
      </p>
      <button
        onClick={goToMain}
        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        처음으로
      </button>
    </div>
  );
}

export default Chat;

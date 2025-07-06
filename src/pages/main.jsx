function Main() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white dark:bg-gray-900">
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        돌봄 챗봇에 오신 걸 환영합니다 😊
      </h1>

      <div className="flex flex-col gap-3">
        <button className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
          🔐 로그인
        </button>
        <button className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
          📝 회원가입
        </button>
      </div>
    </div>
  );
}

export default Main;

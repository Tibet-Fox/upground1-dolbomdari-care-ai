function Signup() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 dark:text-white">📝 회원가입</h2>

      <input
        type="text"
        placeholder="이름"
        className="w-full max-w-xs sm:max-w-sm px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="email"
        placeholder="이메일"
        className="w-full max-w-xs sm:max-w-sm px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="password"
        placeholder="비밀번호"
        className="w-full max-w-xs sm:max-w-sm px-4 py-2 mb-5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md text-base font-medium">
        회원가입
      </button>
    </div>
  );
}

export default Signup;

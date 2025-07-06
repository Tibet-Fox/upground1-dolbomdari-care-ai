function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white dark:bg-gray-900">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-6">
        🔐 로그인
      </h2>
      <input
        type="email"
        placeholder="이메일"
        className="w-full max-w-xs px-4 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="password"
        placeholder="비밀번호"
        className="w-full max-w-xs px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button className="w-full max-w-xs py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
        로그인
      </button>
    </div>
  );
}

export default Login;

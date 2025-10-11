// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Dashboard from '/src/pages/Dashboard.jsx';
import ChatPage from '/src/pages/chat/ChatPage.jsx';
import Login from '/src/pages/Login.jsx';
import Signup from '/src/pages/Signup.jsx';
import FindId from '/src/pages/FindId.jsx';
import FindPw from '/src/pages/FindPw.jsx';
import ResetPassword from '/src/pages/ResetPassword.jsx';
import SignupStep1 from '/src/pages/signup/Step1.jsx';
import SignupStep2 from '/src/pages/signup/Step2.jsx';
import SignupStep3 from '/src/pages/signup/Step3.jsx';
import MyPage from '/src/pages/MyPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      {/* 메인 대시보드 - 리팩토링된 버전 */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* 카테고리별 채팅 페이지 */}
      <Route path="/chat/:category" element={<ChatPage />} />
      <Route path="/chat/history/:chatId" element={<ChatPage />} />
      
      {/* 회원가입 및 로그인 */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/find-id" element={<FindId />} />
      <Route path="/find-pw" element={<FindPw />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/signup/step1" element={<SignupStep1 />} />
      <Route path="/signup/step2" element={<SignupStep2 />} />  
      <Route path="/signup/step3" element={<SignupStep3 />} />
      
      {/* 마이페이지 */}
      <Route path="/mypage" element={<MyPage />} />
    </Routes>
  );
}

export default App;
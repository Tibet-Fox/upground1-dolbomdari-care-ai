// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import ChatPage from './pages/chat/ChatPage.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import FindId from './pages/FindId.jsx';
import FindPw from './pages/FindPw.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import SignupStep1 from './pages/signup/Step1.jsx';
import SignupStep2 from './pages/signup/Step2.jsx';
import SignupStep3 from './pages/signup/Step3.jsx';
import MyPage from './pages/MyPage.jsx';

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
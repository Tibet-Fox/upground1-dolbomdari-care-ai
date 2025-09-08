// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FindId from './pages/FindId';
import FindPw from './pages/FindPw';
import SignupStep1 from './pages/signup/Step1';
import SignupStep2 from './pages/signup/Step2';
import SignupStep3 from './pages/signup/Step3';
import MyPage from './pages/MyPage';
import Header from './components/Header';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/find-id" element={<FindId />} />
      <Route path="/find-pw" element={<FindPw />} />
      <Route path="/signup/step1" element={<SignupStep1 />} />
      <Route path="/signup/step2" element={<SignupStep2 />} />  
      <Route path="/signup/step3" element={<SignupStep3 />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/header" element={<Header />} />
    </Routes>
  );
}

export default App;
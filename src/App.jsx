// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Main from './pages/main';
import Chat from './pages/chat';
import Login from './pages/login';
import Signup from './pages/signup';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
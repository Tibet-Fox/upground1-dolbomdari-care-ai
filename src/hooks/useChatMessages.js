import { useState } from 'react';
import { askChatbot } from '../api/chat';

export const useChatMessages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await askChatbot(text);
      
      console.log('챗봇 응답 데이터:', response);
      
      // askChatbot API 응답 형식 처리: { bot_message, suggestions, conversation_id }
      let botMessageText;
      let suggestions = [];
      
      if (response.bot_message) {
        botMessageText = response.bot_message;
      } else {
        botMessageText = "죄송합니다. 응답을 생성하는 중에 오류가 발생했습니다.";
      }
      
      // suggestions 배열 처리
      if (response.suggestions && Array.isArray(response.suggestions)) {
        suggestions = response.suggestions;
      }
      
      // AI 메시지 객체 구성
      const botMessage = {
        id: Date.now() + 1,
        text: botMessageText,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        suggestions: suggestions,
        conversation_id: response.conversation_id
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      
      let errorMessage = "죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.";
      
      if (error.message) {
        if (error.message.includes('로그인이 필요합니다')) {
          errorMessage = "로그인이 필요합니다. 다시 로그인해주세요.";
          
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        } else if (error.message.includes('대화 접근 권한이 없습니다') || error.message.includes('새 대화를 시작합니다')) {
          errorMessage = "대화 접근 권한이 없습니다. 새 대화를 시작합니다.";
          localStorage.removeItem('current_conversation_id');
        } else if (error.message.includes('네트워크 오류')) {
          errorMessage = "서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.";
        } else {
          errorMessage = error.message;
        }
      }
      
      const errorBotMessage = {
        id: Date.now() + 1,
        text: errorMessage,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    setMessages,
    isLoading,
    sendMessage,
    clearMessages
  };
};


import instance from './axios';

// 1. 대화 생성
export const createConversation = async () => {
  try {
    console.log('새 대화 생성 요청');
    const response = await instance.post('/chat/conversations', {}, {
      withCredentials: false
    });
    console.log('대화 생성 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('대화 생성 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 2. 사용자 메시지 → AI 응답 저장 (사용!) - 명세에 따라 프론트엔드에서 사용
export const sendMessageWithAI = async (conversationId, userMessage) => {
  try {
    console.log('AI 응답과 함께 메시지 전송:', { conversationId, userMessage });
    
    const response = await instance.post('/chat/messages/with-ai', {
      conversation_id: conversationId,
      user_message: userMessage
    }, {
      withCredentials: false
    });
    
    console.log('AI 응답 메시지 전송 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('AI 응답 메시지 전송 오류:', error.response?.data || error.message);
    
    // 인증 오류인지 확인
    if (error.response?.status === 401) {
      console.log('인증 오류 감지 - 로그인이 필요합니다.');
      throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
    }
    
    throw error;
  }
};

// 3. 내 대화 목록 조회
export const getConversations = async (page = 1, limit = 20) => {
  try {
    console.log('대화 목록 조회:', { page, limit });
    
    const response = await instance.get('/chat/conversations', {
      params: { page, limit },
      withCredentials: false
    });
    
    console.log('대화 목록 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('대화 목록 조회 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 4. 대화 상세 조회 (메시지 포함)
export const getConversationDetails = async (conversationId) => {
  try {
    console.log('대화 상세 조회:', conversationId);
    
    const response = await instance.get(`/chat/conversations/${conversationId}`, {
      withCredentials: false
    });
    
    console.log('대화 상세 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('대화 상세 조회 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 5. 대화 삭제 (추가 기능)
export const deleteConversation = async (conversationId) => {
  try {
    console.log('대화 삭제:', conversationId);
    
    const response = await instance.delete(`/chat/conversations/${conversationId}`, {
      withCredentials: false
    });
    
    console.log('대화 삭제 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('대화 삭제 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 6. 대화 제목 업데이트 (추가 기능)
export const updateConversationTitle = async (conversationId, title) => {
  try {
    console.log('대화 제목 업데이트:', { conversationId, title });
    
    const response = await instance.put(`/chat/conversations/${conversationId}`, {
      title: title
    }, {
      withCredentials: false
    });
    
    console.log('대화 제목 업데이트 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('대화 제목 업데이트 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 7. 메시지 삭제 (추가 기능)
export const deleteMessage = async (messageId) => {
  try {
    console.log('메시지 삭제:', messageId);
    
    const response = await instance.delete(`/chat/messages/${messageId}`, {
      withCredentials: false
    });
    
    console.log('메시지 삭제 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('메시지 삭제 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 8. 메시지 수정 (추가 기능)
export const updateMessage = async (messageId, newContent) => {
  try {
    console.log('메시지 수정:', { messageId, newContent });
    
    const response = await instance.put(`/chat/messages/${messageId}`, {
      message: newContent
    }, {
      withCredentials: false
    });
    
    console.log('메시지 수정 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('메시지 수정 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 9. 대화 내보내기 (추가 기능)
export const exportConversation = async (conversationId, format = 'json') => {
  try {
    console.log('대화 내보내기:', { conversationId, format });
    
    const response = await instance.get(`/chat/conversations/${conversationId}/export`, {
      params: { format },
      withCredentials: false
    });
    
    console.log('대화 내보내기 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('대화 내보내기 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 메시지 저장 함수 제거 - 명세에 따라 프론트엔드에서 사용하지 않음
// 대신 sendMessageWithAI를 통해 자동으로 저장됨

// 기존 API들 (하위 호환성을 위해 유지)
// 챗봇에게 질문하기 - 명세에 따라 올바른 API 사용
export const askChatbot = async (userMessage) => {
  try {
    if (!userMessage || typeof userMessage !== 'string') {
      throw new Error('유효하지 않은 메시지입니다.');
    }

    console.log('챗봇 질문:', userMessage);
    
    // 1. 대화 생성 또는 기존 대화 사용
    let conversationId = localStorage.getItem('current_conversation_id');
    
    if (!conversationId) {
      try {
        console.log('새 대화를 생성합니다.');
        const conversation = await createConversation();
        conversationId = conversation.id || conversation.conversation_id;
        
        if (conversationId) {
          localStorage.setItem('current_conversation_id', conversationId);
          console.log('새 대화 생성 완료, ID:', conversationId);
        } else {
          throw new Error('대화 ID를 받지 못했습니다.');
        }
      } catch (error) {
        console.error('대화 생성 실패:', error);
        throw new Error('대화를 시작할 수 없습니다. 잠시 후 다시 시도해주세요.');
      }
    }
    
    // 2. 명세에 따라 sendMessageWithAI 사용 (사용자 메시지 → AI 응답 저장)
    console.log('AI 응답을 요청합니다. 대화 ID:', conversationId);
    const response = await sendMessageWithAI(conversationId, userMessage);
    console.log('AI 응답 수신:', response);
    
    // 3. 응답 데이터 구조화
    const responseData = {
      bot_message: response.bot_message || response.message || response.ai_response || "응답을 받지 못했습니다.",
      suggestions: response.suggestions || null
    };
    
    return responseData;
  } catch (error) {
    console.error('챗봇 API 오류:', error.response?.data || error.message);
    
    // 인증 오류 처리
    if (error.response?.status === 401) {
      console.log('인증 오류 감지 - 로그인이 필요합니다.');
      throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
    }
    
    // 404 오류 처리 (API 엔드포인트 없음)
    if (error.response?.status === 404) {
      console.log('채팅 API 엔드포인트를 찾을 수 없습니다.');
      throw new Error('채팅 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.');
    }
    
    // 기타 오류 처리
    throw error;
  }
};

// 전체 대화 조회 (기존)
export const getChatLogs = async (page = 1, limit = 20) => {
  try {
    const response = await instance.get('/chat/logs', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('대화 로그 조회 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 최근 대화 조회 (기존)
export const getRecentChats = async (limit = 10) => {
  try {
    const response = await instance.get('/chat/logs/recent', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('최근 대화 조회 오류:', error.response?.data || error.message);
    throw error;
  }
};

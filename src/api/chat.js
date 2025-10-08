import instance from './axios';

// 1. 대화 생성
export const createConversation = async () => {
  try {
    console.log('새 대화 생성 요청');
    
    // API 명세서에 따른 대화 생성 요청
    const requestData = {
      title: `대화 ${new Date().toLocaleString('ko-KR')}`,
      created_at: new Date().toISOString()
    };
    
    const response = await instance.post('/chat/conversations', requestData, {
      withCredentials: false
    });
    console.log('대화 생성 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('대화 생성 오류:', error);
    console.error('오류 응답 데이터:', error.response?.data);
    console.error('오류 상태 코드:', error.response?.status);
    
    // 401 오류 (인증 실패) 처리
    if (error.response?.status === 401) {
      console.log('401 오류 - 인증이 필요합니다.');
      throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
    }
    
    // 403 오류 (접근 권한 없음) 처리
    if (error.response?.status === 403) {
      console.log('403 오류 - 대화 생성 권한이 없습니다.');
      console.log('서버 응답:', error.response.data);
      throw new Error('대화 생성 권한이 없습니다. 다시 로그인해주세요.');
    }
    
    // 422 오류 (유효성 검사 실패) 처리
    if (error.response?.status === 422) {
      console.log('422 오류 - 대화 생성 요청 데이터 형식이 올바르지 않습니다.');
      console.log('서버 응답:', error.response.data);
      
      // errors 배열을 표 형태로 출력
      if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
        console.table(error.response.data.errors);
      }
      
      throw new Error('대화 생성 요청 데이터 형식이 올바르지 않습니다. 다시 시도해주세요.');
    }
    
    // 네트워크 오류 처리
    if (!error.response) {
      console.log('네트워크 오류 - 서버에 연결할 수 없습니다.');
      throw new Error('서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
    }
    
    throw error;
  }
};

// 2. 사용자 메시지 → AI 응답 저장 (프론트에서 반드시 사용)
export const sendMessageWithAI = async (conversationId, userMessage) => {
  try {
    console.log('AI 응답과 함께 메시지 전송:', { conversationId, userMessage });
    
    // 입력값 검증
    if (!conversationId || !userMessage) {
      throw new Error('대화 ID와 메시지가 필요합니다.');
    }
    
    // API 명세서에 따른 요청 데이터 형식 (content 필드 사용)
    const requestData = {
      conversation_id: Number(conversationId), // snake_case로 변경
      content: String(userMessage).trim(), // content 필드로 변경
      sender: 'user', // sender 필드
      timestamp: new Date().toISOString() // ISO 형식 타임스탬프
    };
    
    // 요청 데이터 검증
    if (!requestData.conversation_id || requestData.conversation_id <= 0) {
      throw new Error('유효하지 않은 대화 ID입니다.');
    }
    
    if (!requestData.content || requestData.content.length === 0) {
      throw new Error('메시지 내용이 없습니다.');
    }
    
    console.log('요청 데이터:', requestData);
    console.log('Request Payload 검증:');
    console.log('- conversation_id 타입:', typeof requestData.conversation_id, '값:', requestData.conversation_id);
    console.log('- content 타입:', typeof requestData.content, '값:', requestData.content);
    console.log('- sender 타입:', typeof requestData.sender, '값:', requestData.sender);
    console.log('- timestamp 타입:', typeof requestData.timestamp, '값:', requestData.timestamp);
    
    const response = await instance.post('/chat/messages/with-ai', requestData, {
      withCredentials: false
    });
    
    console.log('AI 응답 메시지 전송 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('AI 응답 메시지 전송 오류:', error);
    console.error('오류 응답 데이터:', error.response?.data);
    console.error('오류 상태 코드:', error.response?.status);
    
    // 인증 오류인지 확인
    if (error.response?.status === 401) {
      console.log('401 오류 - 인증이 필요합니다.');
      throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
    }
    
    // 403 오류 (접근 권한 없음) 처리
    if (error.response?.status === 403) {
      console.log('403 오류 - 해당 대화에 접근할 수 없습니다.');
      console.log('서버 응답:', error.response.data);
      
      // 대화 ID 초기화하고 새 대화 생성 시도
      localStorage.removeItem('current_conversation_id');
      throw new Error('대화 접근 권한이 없습니다. 새 대화를 시작합니다.');
    }
    
    // 422 오류 (유효성 검사 실패) 처리
    if (error.response?.status === 422) {
      console.log('422 오류 - 요청 데이터 형식이 올바르지 않습니다.');
      console.log('서버 응답:', error.response.data);
      
      // errors 배열을 표 형태로 출력
      if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
        console.table(error.response.data.errors);
      }
      
      throw new Error('요청 데이터 형식이 올바르지 않습니다. 다시 시도해주세요.');
    }
    
    // 네트워크 오류 처리
    if (!error.response) {
      console.log('네트워크 오류 - 서버에 연결할 수 없습니다.');
      throw new Error('서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
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

// 카테고리별 초기 답변 API
export const getCategoryInitialResponse = async (categoryName) => {
  try {
    if (!categoryName || typeof categoryName !== 'string') {
      throw new Error('유효하지 않은 카테고리입니다.');
    }

    console.log('카테고리 초기 답변 요청:', categoryName);
    
    // 인증 상태 확인
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    if (!token) {
      throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
    }

    const response = await instance.post('/chat/category-initial', {
      category: categoryName
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: false
    });

    console.log('카테고리 초기 답변 응답:', response.data);
    
    // 응답 형식: { greeting, suggestions }
    return response.data;
  } catch (error) {
    console.error('카테고리 초기 답변 API 오류:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
    }
    
    if (error.response?.status === 404) {
      throw new Error('카테고리 답변 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.');
    }
    
    throw error;
  }
};

// 새로운 AI 답변 API (message_id, content, sources 형식)
export const askAI = async (userMessage) => {
  try {
    if (!userMessage || typeof userMessage !== 'string') {
      throw new Error('유효하지 않은 메시지입니다.');
    }

    console.log('AI 질문:', userMessage);
    
    // 인증 상태 확인
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    if (!token) {
      throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
    }

    const response = await instance.post('/chat/ask', {
      message: userMessage
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: false
    });

    console.log('AI 응답 수신:', response.data);
    
    // 응답 형식: { message_id, content, sources }
    return response.data;
  } catch (error) {
    console.error('AI API 오류:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
    }
    
    if (error.response?.status === 404) {
      throw new Error('AI 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.');
    }
    
    throw error;
  }
};

// 챗봇에게 질문하기 - 명세에 따라 올바른 API 사용
export const askChatbot = async (userMessage) => {
  try {
    if (!userMessage || typeof userMessage !== 'string') {
      throw new Error('유효하지 않은 메시지입니다.');
    }

    console.log('챗봇 질문:', userMessage);
    
    // 인증 상태 확인
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    if (!token) {
      throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
    }
    
    // 1. 대화 생성 또는 기존 대화 사용
    let conversationId = localStorage.getItem('current_conversation_id');
    console.log('기존 대화 ID:', conversationId);
    
    // 기존 대화 ID가 있더라도 새로 생성 (접근 권한 문제 해결)
    try {
      console.log('새 대화를 생성합니다.');
      const conversation = await createConversation();
      console.log('대화 생성 응답:', conversation);
      
      conversationId = conversation.id || conversation.conversation_id || conversation.conversationId || conversation.data?.id;
      console.log('추출된 대화 ID:', conversationId);
      
      if (conversationId) {
        localStorage.setItem('current_conversation_id', conversationId);
        console.log('새 대화 생성 완료, ID:', conversationId);
      } else {
        console.error('대화 응답에서 ID를 찾을 수 없습니다:', conversation);
        throw new Error('대화 ID를 받지 못했습니다.');
      }
    } catch (error) {
      console.error('대화 생성 실패:', error);
      throw new Error('대화를 시작할 수 없습니다. 잠시 후 다시 시도해주세요.');
    }
    
    // 2. 명세에 따라 sendMessageWithAI 사용 (사용자 메시지 → AI 응답 저장)
    console.log('AI 응답을 요청합니다. 대화 ID:', conversationId);
    console.log('사용자 메시지:', userMessage);
    const response = await sendMessageWithAI(conversationId, userMessage);
    console.log('AI 응답 수신:', response);
    
    // 3. 응답 데이터 구조화 (API 명세서에 따른 필드명 사용)
    console.log('원본 응답 데이터:', response);
    
    // 응답에서 content 필드 추출
    const botMessage = response.content || response.bot_message || response.ai_message || response.message || response.data?.message || response.data?.content;
    
    console.log('추출된 bot_message:', botMessage);
    
    const responseData = {
      bot_message: botMessage || "응답을 받지 못했습니다.",
      suggestions: response.suggestions || response.data?.suggestions || null,
      conversation_id: response.conversation_id || response.data?.conversation_id || conversationId
    };
    
    console.log('구조화된 응답 데이터:', responseData);
    
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

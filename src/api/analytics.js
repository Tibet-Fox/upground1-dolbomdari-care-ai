import instance from './axios';

// 사용자 활동 통계 조회
export const getUserAnalytics = async (period = 'month') => {
  try {
    console.log('사용자 활동 통계 조회:', period);
    
    const response = await instance.get('/analytics/user', {
      params: { period },
      withCredentials: false
    });
    
    console.log('사용자 활동 통계 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('사용자 활동 통계 조회 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 채팅 통계 조회
export const getChatAnalytics = async (period = 'month') => {
  try {
    console.log('채팅 통계 조회:', period);
    
    const response = await instance.get('/analytics/chat', {
      params: { period },
      withCredentials: false
    });
    
    console.log('채팅 통계 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('채팅 통계 조회 오류:', error.response?.data || error.message);
    throw error;
  }
};

// FAQ 사용 통계 조회
export const getFaqAnalytics = async (period = 'month') => {
  try {
    console.log('FAQ 사용 통계 조회:', period);
    
    const response = await instance.get('/analytics/faq', {
      params: { period },
      withCredentials: false
    });
    
    console.log('FAQ 사용 통계 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('FAQ 사용 통계 조회 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 인기 질문 조회
export const getPopularQuestions = async (limit = 10) => {
  try {
    console.log('인기 질문 조회:', limit);
    
    const response = await instance.get('/analytics/popular-questions', {
      params: { limit },
      withCredentials: false
    });
    
    console.log('인기 질문 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('인기 질문 조회 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 사용자 만족도 조회
export const getUserSatisfaction = async (period = 'month') => {
  try {
    console.log('사용자 만족도 조회:', period);
    
    const response = await instance.get('/analytics/satisfaction', {
      params: { period },
      withCredentials: false
    });
    
    console.log('사용자 만족도 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('사용자 만족도 조회 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 시스템 성능 통계 조회
export const getSystemPerformance = async (period = 'day') => {
  try {
    console.log('시스템 성능 통계 조회:', period);
    
    const response = await instance.get('/analytics/performance', {
      params: { period },
      withCredentials: false
    });
    
    console.log('시스템 성능 통계 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('시스템 성능 통계 조회 오류:', error.response?.data || error.message);
    throw error;
  }
};

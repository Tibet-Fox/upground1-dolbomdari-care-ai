import instance from './axios';

// FAQ 카테고리 전체 목록 조회
export const getFaqCategories = async () => {
  try {
    console.log('FAQ 카테고리 조회 API 호출');
    const response = await instance.get('/faq/categories', {
      withCredentials: false
    });
    console.log('FAQ 카테고리 응답:', response.data);
    return response.data || [];
  } catch (error) {
    console.error('FAQ 카테고리 조회 실패:', error);
    // 404 오류인 경우 빈 배열 반환
    if (error.response?.status === 404) {
      console.log('FAQ 카테고리 API 엔드포인트를 찾을 수 없습니다. 빈 배열을 반환합니다.');
      return [];
    }
    return [];
  }
};

// 카테고리별 질문 목록 조회
export const getFaqQuestions = async (categoryId) => {
  try {
    if (!categoryId) {
      console.warn('카테고리 ID가 없습니다.');
      return [];
    }

    console.log('FAQ 질문 목록 조회 API 호출 - 카테고리 ID:', categoryId);
    console.log('카테고리 ID 타입:', typeof categoryId);
    console.log('API 요청 URL:', `/faq/questions?category_id=${categoryId}`);
    console.log('API Base URL:', instance.defaults.baseURL);
    console.log('전체 요청 URL:', `${instance.defaults.baseURL}/faq/questions?category_id=${categoryId}`);
    
    const response = await instance.get('/faq/questions', {
      params: { category_id: categoryId },
      withCredentials: false
    });
    console.log('FAQ 질문 목록 응답:', response.data);
    return response.data || [];
  } catch (error) {
    console.error('FAQ 질문 목록 조회 실패:', error);
    console.error('에러 상세 정보:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers
    });
    
    // 404 오류인 경우 빈 배열 반환
    if (error.response?.status === 404) {
      console.log('FAQ 질문 목록 API 엔드포인트를 찾을 수 없습니다. 빈 배열을 반환합니다.');
      return [];
    }
    return [];
  }
};

// 질문 상세 조회 (로그인한 사용자만) - 명세에 따라 인증 필요
export const getFaqQuestionDetail = async (questionId) => {
  try {
    if (!questionId) {
      console.warn('질문 ID가 없습니다.');
      return null;
    }

    console.log('FAQ 질문 상세 조회 API 호출 - 질문 ID:', questionId);
    
    // 로그인 상태 확인 (localStorage에서 토큰 확인)
    const token = localStorage.getItem('access_token');
    const headers = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log('인증 토큰이 포함된 요청을 보냅니다.');
    } else {
      console.log('인증 토큰이 없습니다. 로그인이 필요할 수 있습니다.');
    }
    
    const response = await instance.get(`/faq/questions/${questionId}`, {
      headers,
      withCredentials: false
    });
    
    console.log('FAQ 질문 상세 응답 상태:', response.status);
    console.log('FAQ 질문 상세 응답 데이터:', response.data);
    
    // 응답 데이터 구조 확인
    if (response.data) {
      console.log('응답 데이터 필드들:', Object.keys(response.data));
      if (response.data.answer) {
        console.log('answer 필드:', response.data.answer);
      }
      if (response.data.reference_title) {
        console.log('reference_title 필드:', response.data.reference_title);
      }
      if (response.data.reference_url) {
        console.log('reference_url 필드:', response.data.reference_url);
      }
    }
    
    return response.data || null;
  } catch (error) {
    console.error('FAQ 질문 상세 조회 실패:', error);
    
    // 401 Unauthorized 오류 처리
    if (error.response?.status === 401) {
      console.log('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
      return null;
    }
    
    // 404 오류 처리
    if (error.response?.status === 404) {
      console.log('FAQ 질문 상세 API 엔드포인트를 찾을 수 없습니다. null을 반환합니다.');
      return null;
    }
    
    return null;
  }
};

// FAQ 검색 (선택사항) - 명세에 없는 기능이므로 제거하거나 주석 처리
/*
export const searchFaq = async (keyword) => {
  try {
    if (!keyword || typeof keyword !== 'string') {
      console.warn('유효하지 않은 검색 키워드:', keyword);
      return [];
    }

    console.log('FAQ 검색 API 호출 - 키워드:', keyword);
    const response = await instance.get('/faq/search', {
      params: { q: keyword },
      withCredentials: false
    });
    console.log('FAQ 검색 응답:', response.data);
    return response.data || [];
  } catch (error) {
    console.error('FAQ 검색 실패:', error);
    // 404 오류인 경우 빈 배열 반환
    if (error.response?.status === 404) {
      console.log('FAQ 검색 API 엔드포인트를 찾을 수 없습니다. 빈 배열을 반환합니다.');
      return [];
    }
    return [];
  }
};
*/

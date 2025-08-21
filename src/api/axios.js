// src/api/axios.js
import axios from "axios";

// 환경변수에서 API URL 가져오기 (개발/프로덕션 환경 분리)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.carebridges.o-r.kr";

// 토큰 유효성 검사 함수
const isTokenValid = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  try {
    // JWT 토큰 형식 검증
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('JWT 토큰 형식이 올바르지 않습니다.');
      return false;
    }
    
    // JWT 토큰 디코딩 (페이로드 부분만)
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    
    // 토큰 만료 시간 확인
    if (payload.exp && payload.exp < currentTime) {
      console.log('토큰이 만료되었습니다. 만료시간:', new Date(payload.exp * 1000));
      return false;
    }
    
    console.log('토큰이 유효합니다. 만료시간:', new Date(payload.exp * 1000));
    return true;
  } catch (error) {
    console.log('토큰 파싱 오류:', error);
    return false;
  }
};

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // CORS 오류 해결을 위해 false로 변경
  timeout: 10000, // 10초 타임아웃
});

// 요청 인터셉터 - 토큰 자동 추가
instance.interceptors.request.use(
  (config) => {
    try {
      // 여러 토큰 키를 확인 (하위 호환성)
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      
      if (token && isTokenValid(token)) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Authorization 헤더 추가됨:', `Bearer ${token.substring(0, 20)}...`);
      } else if (token && !isTokenValid(token)) {
        console.log('토큰이 만료되어 Authorization 헤더를 추가하지 않음');
        // 만료된 토큰 제거
        localStorage.removeItem("access_token");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      } else {
        console.log('토큰이 없어 Authorization 헤더를 추가하지 않음');
      }
      
      console.log('요청 URL:', config.url);
      console.log('요청 메서드:', config.method);
      console.log('요청 헤더:', config.headers);
      
      return config;
    } catch (error) {
      console.error('요청 인터셉터 오류:', error);
      return config;
    }
  },
  (error) => {
    console.error('요청 인터셉터 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리 및 토큰 갱신
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    try {
      const originalRequest = error.config;

      // 401 에러 (토큰 만료) 처리
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        console.log('401 오류 감지 - 토큰 갱신 시도');
        
        try {
          // 토큰 갱신 시도 (리프레시 토큰이 있는 경우)
          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            console.log('리프레시 토큰으로 토큰 갱신 시도');
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refresh_token: refreshToken,
            }, {
              withCredentials: false // CORS 오류 해결
            });
            
            const { access_token } = response.data;
            localStorage.setItem("access_token", access_token);
            console.log('토큰 갱신 성공');
            
            // 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return instance(originalRequest);
          } else {
            console.log('리프레시 토큰이 없음 - 로그아웃 처리');
            // 리프레시 토큰이 없으면 로그아웃 처리
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            // 루트 페이지로 리다이렉트
            window.location.href = "/";
          }
        } catch (refreshError) {
          console.log('토큰 갱신 실패:', refreshError);
          // 토큰 갱신 실패 시 로그아웃 처리
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          
                      // 루트 페이지로 리다이렉트
            window.location.href = "/";
        }
      }

      return Promise.reject(error);
    } catch (interceptorError) {
      console.error('응답 인터셉터 오류:', interceptorError);
      return Promise.reject(error);
    }
  }
);

export default instance;

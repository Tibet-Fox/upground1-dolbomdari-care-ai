// src/api/axios.js
import axios from "axios";

// 환경변수에서 API URL 가져오기 (개발/프로덕션 환경 분리)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.carebridges.o-r.kr";

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
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리 및 토큰 갱신
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 (토큰 만료) 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 토큰 갱신 시도 (리프레시 토큰이 있는 경우)
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          }, {
            withCredentials: false // CORS 오류 해결
          });
          
          const { access_token } = response.data;
          localStorage.setItem("access_token", access_token);
          
          // 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return instance(originalRequest);
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;

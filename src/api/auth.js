import instance from './axios';

// 로그인 API
export const loginUser = async (email, password) => {
  try {
    // form-urlencoded 형식으로 전송
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await instance.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      withCredentials: false // CORS 오류 해결
    });
    
    // 토큰 저장
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    if (response.data.refresh_token) {
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    
    // 사용자 정보 저장 (응답에 사용자 정보가 포함된 경우)
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 회원가입 API
export const registerUser = async (userData) => {
  try {
    // 백엔드 API 형식에 맞게 데이터 변환 (이미지 형식에 맞춤)
    const apiData = {
      email: userData.email,
      name: userData.name,
      password1: userData.password, // password1으로 변경
      password2: userData.password, // password2로 변경 (확인용)
      phone: userData.phone
    };
    
    console.log('회원가입 API 호출:', apiData);
    const response = await instance.post('/auth/register', apiData, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: false // CORS 오류 해결
    });
    console.log('회원가입 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('회원가입 API 에러:', error.response?.data || error.message);
    throw error;
  }
};

// 로그인 사용자 정보 조회 API
export const getUserInfo = async () => {
  try {
    const response = await instance.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 로그아웃 API
export const logoutUser = async () => {
  try {
    await instance.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // 로컬 스토리지에서 모든 토큰과 사용자 정보 제거
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('current_conversation_id');
    
    // 로그인 상태 변경 이벤트 발생
    window.dispatchEvent(new CustomEvent('loginStatusChanged'));
  }
};

// 비밀번호 찾기 API
export const findPassword = async (email) => {
  try {
    const response = await instance.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 비밀번호 재설정 API
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await instance.post('/auth/reset-password', {
      token,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 이메일 인증 API
export const verifyEmail = async (token) => {
  try {
    const response = await instance.post('/auth/verify-email', { token });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 토큰 갱신 API
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await instance.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

import instance from './axios';

// 사용자 설정 조회
export const getUserSettings = async () => {
  try {
    console.log('사용자 설정 조회');
    
    const response = await instance.get('/settings/user', {
      withCredentials: false
    });
    
    console.log('사용자 설정 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('사용자 설정 조회 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 사용자 설정 업데이트
export const updateUserSettings = async (settings) => {
  try {
    console.log('사용자 설정 업데이트:', settings);
    
    const response = await instance.put('/settings/user', settings, {
      withCredentials: false
    });
    
    console.log('사용자 설정 업데이트 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('사용자 설정 업데이트 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 채팅 설정 조회
export const getChatSettings = async () => {
  try {
    console.log('채팅 설정 조회');
    
    const response = await instance.get('/settings/chat', {
      withCredentials: false
    });
    
    console.log('채팅 설정 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('채팅 설정 조회 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 채팅 설정 업데이트
export const updateChatSettings = async (settings) => {
  try {
    console.log('채팅 설정 업데이트:', settings);
    
    const response = await instance.put('/settings/chat', settings, {
      withCredentials: false
    });
    
    console.log('채팅 설정 업데이트 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('채팅 설정 업데이트 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 테마 설정 조회
export const getThemeSettings = async () => {
  try {
    console.log('테마 설정 조회');
    
    const response = await instance.get('/settings/theme', {
      withCredentials: false
    });
    
    console.log('테마 설정 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('테마 설정 조회 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 테마 설정 업데이트
export const updateThemeSettings = async (theme) => {
  try {
    console.log('테마 설정 업데이트:', theme);
    
    const response = await instance.put('/settings/theme', { theme }, {
      withCredentials: false
    });
    
    console.log('테마 설정 업데이트 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('테마 설정 업데이트 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 언어 설정 조회
export const getLanguageSettings = async () => {
  try {
    console.log('언어 설정 조회');
    
    const response = await instance.get('/settings/language', {
      withCredentials: false
    });
    
    console.log('언어 설정 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('언어 설정 조회 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 언어 설정 업데이트
export const updateLanguageSettings = async (language) => {
  try {
    console.log('언어 설정 업데이트:', language);
    
    const response = await instance.put('/settings/language', { language }, {
      withCredentials: false
    });
    
    console.log('언어 설정 업데이트 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('언어 설정 업데이트 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 개인정보 설정 조회
export const getPrivacySettings = async () => {
  try {
    console.log('개인정보 설정 조회');
    
    const response = await instance.get('/settings/privacy', {
      withCredentials: false
    });
    
    console.log('개인정보 설정 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('개인정보 설정 조회 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 개인정보 설정 업데이트
export const updatePrivacySettings = async (privacySettings) => {
  try {
    console.log('개인정보 설정 업데이트:', privacySettings);
    
    const response = await instance.put('/settings/privacy', privacySettings, {
      withCredentials: false
    });
    
    console.log('개인정보 설정 업데이트 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('개인정보 설정 업데이트 오류:', error.response?.data || error.message);
    throw error;
  }
};

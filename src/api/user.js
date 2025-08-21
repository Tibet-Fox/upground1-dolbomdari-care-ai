import instance from './axios';

// 사용자 프로필 조회
export const getUserProfile = async () => {
  try {
    const response = await instance.get('/user/profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 사용자 프로필 업데이트
export const updateUserProfile = async (profileData) => {
  try {
    const response = await instance.put('/user/profile', profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 사용자 비밀번호 변경
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await instance.put('/user/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 사용자 계정 삭제
export const deleteUserAccount = async () => {
  try {
    const response = await instance.delete('/user/account');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 사용자 활동 내역 조회
export const getUserActivity = async (page = 1, limit = 10) => {
  try {
    const response = await instance.get('/user/activity', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

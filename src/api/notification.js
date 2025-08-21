import instance from './axios';

// 알림 목록 조회
export const getNotifications = async (page = 1, limit = 20) => {
  try {
    console.log('알림 목록 조회:', { page, limit });
    
    const response = await instance.get('/notifications', {
      params: { page, limit },
      withCredentials: false
    });
    
    console.log('알림 목록 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('알림 목록 조회 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 알림 읽음 처리
export const markNotificationAsRead = async (notificationId) => {
  try {
    console.log('알림 읽음 처리:', notificationId);
    
    const response = await instance.put(`/notifications/${notificationId}/read`, {}, {
      withCredentials: false
    });
    
    console.log('알림 읽음 처리 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('알림 읽음 처리 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 모든 알림 읽음 처리
export const markAllNotificationsAsRead = async () => {
  try {
    console.log('모든 알림 읽음 처리');
    
    const response = await instance.put('/notifications/read-all', {}, {
      withCredentials: false
    });
    
    console.log('모든 알림 읽음 처리 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('모든 알림 읽음 처리 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 알림 삭제
export const deleteNotification = async (notificationId) => {
  try {
    console.log('알림 삭제:', notificationId);
    
    const response = await instance.delete(`/notifications/${notificationId}`, {
      withCredentials: false
    });
    
    console.log('알림 삭제 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('알림 삭제 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 읽지 않은 알림 개수 조회
export const getUnreadNotificationCount = async () => {
  try {
    console.log('읽지 않은 알림 개수 조회');
    
    const response = await instance.get('/notifications/unread-count', {
      withCredentials: false
    });
    
    console.log('읽지 않은 알림 개수 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('읽지 않은 알림 개수 조회 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 알림 설정 조회
export const getNotificationSettings = async () => {
  try {
    console.log('알림 설정 조회');
    
    const response = await instance.get('/notifications/settings', {
      withCredentials: false
    });
    
    console.log('알림 설정 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('알림 설정 조회 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 알림 설정 업데이트
export const updateNotificationSettings = async (settings) => {
  try {
    console.log('알림 설정 업데이트:', settings);
    
    const response = await instance.put('/notifications/settings', settings, {
      withCredentials: false
    });
    
    console.log('알림 설정 업데이트 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('알림 설정 업데이트 오류:', error.response?.data || error.message);
    throw error;
  }
};

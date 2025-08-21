import { useState, useCallback } from 'react';

// API 호출을 위한 커스텀 훅
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    callApi,
    clearError,
  };
};

// 특정 API 함수를 위한 전용 훅
export const useAuth = () => {
  const { loading, error, callApi, clearError } = useApi();
  const { loginUser, registerUser, logoutUser, getUserInfo } = require('../api/auth');

  return {
    loading,
    error,
    clearError,
    login: (email, password) => callApi(loginUser, email, password),
    register: (userData) => callApi(registerUser, userData),
    logout: () => callApi(logoutUser),
    getUserInfo: () => callApi(getUserInfo),
  };
};

export const useUser = () => {
  const { loading, error, callApi, clearError } = useApi();
  const { getUserProfile, updateUserProfile, changePassword } = require('../api/user');

  return {
    loading,
    error,
    clearError,
    getProfile: () => callApi(getUserProfile),
    updateProfile: (profileData) => callApi(updateUserProfile, profileData),
    changePassword: (currentPassword, newPassword) => 
      callApi(changePassword, currentPassword, newPassword),
  };
};

export const useChat = () => {
  const { loading, error, callApi, clearError } = useApi();
  const { 
    saveChatQuestionResponse, 
    saveChatMessage, 
    getAllChatLogs, 
    getRecentChatLogs 
  } = require('../api/chat');

  return {
    loading,
    error,
    clearError,
    saveQuestionResponse: (question, response) => callApi(saveChatQuestionResponse, question, response),
    saveMessage: (messageData) => callApi(saveChatMessage, messageData),
    getAllLogs: () => callApi(getAllChatLogs),
    getRecentLogs: (limit) => callApi(getRecentChatLogs, limit),
  };
};

export const useFaq = () => {
  const { loading, error, callApi, clearError } = useApi();
  const { 
    getFaqCategories, 
    getFaqQuestions, 
    getFaqQuestionDetail 
  } = require('../api/faq');

  return {
    loading,
    error,
    clearError,
    getCategories: () => callApi(getFaqCategories),
    getQuestions: (categoryId) => callApi(getFaqQuestions, categoryId),
    getQuestionDetail: (questionId) => callApi(getFaqQuestionDetail, questionId),
  };
};

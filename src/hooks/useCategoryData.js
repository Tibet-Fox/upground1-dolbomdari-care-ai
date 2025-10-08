import { useState, useEffect } from 'react';
import { getFaqCategories, getFaqQuestions, getFaqQuestionDetail } from '../api/faq';

export const useCategoryData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // 카테고리 ID에 따른 아이콘 매핑 함수
  const getCategoryIcon = (categoryId) => {
    const iconMap = {
      1: '👤', // 요양보호사 입·퇴사
      2: '💰', // 급여 계산
      3: '📝', // 제공계획서 작성
      4: '📜', // 2025 고시 변경
      5: '💬', // 상담일지 작성
      6: '💡'  // AI 상담 사용법
    };
    return iconMap[categoryId] || '📋';
  };

  // API에서 카테고리 목록 로드
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const apiCategories = await getFaqCategories();
        console.log('API에서 받은 카테고리:', apiCategories);
        
        if (apiCategories && apiCategories.length > 0) {
          // API 응답이 있으면 API 데이터 사용 (백엔드 응답 형식에 맞춰 매핑)
          const mappedCategories = apiCategories.map(category => ({
            id: category.category_id,  // 백엔드: category_id
            name: category.title,      // 백엔드: title
            icon: getCategoryIcon(category.category_id),  // ID 기반으로 아이콘 설정
            path: `/chat/${category.title}`  // title을 URL에 사용
          }));
          console.log('백엔드에서 받은 카테고리:', apiCategories);
          console.log('매핑된 카테고리:', mappedCategories);
          setCategories(mappedCategories);
        } else {
          // API 응답이 없으면 기본 카테고리 사용 (fallback)
          const defaultCategories = [
            { id: 1, name: '요양보호사 입·퇴사', icon: '👤', path: '/chat/caregiver-onboarding' },
            { id: 2, name: '급여 계산', icon: '💰', path: '/chat/salary' },
            { id: 3, name: '제공계획서 작성', icon: '📝', path: '/chat/plan' },
            { id: 4, name: '2025 고시 변경', icon: '📜', path: '/chat/regulation' },
            { id: 5, name: '상담일지 작성', icon: '💬', path: '/chat/log' },
            { id: 6, name: 'AI 상담 사용법', icon: '💡', path: '/chat/guide' }
          ];
          setCategories(defaultCategories);
          console.log('API 응답 없음, 기본 카테고리 사용');
        }
      } catch (error) {
        console.error('카테고리 로드 실패:', error);
        // 오류 발생 시 기본 카테고리 사용
        const defaultCategories = [
          { id: 1, name: '요양보호사 입·퇴사', icon: '👤', path: '/chat/caregiver-onboarding' },
          { id: 2, name: '급여 계산', icon: '💰', path: '/chat/salary' },
          { id: 3, name: '제공계획서 작성', icon: '📝', path: '/chat/plan' },
          { id: 4, name: '2025 고시 변경', icon: '📜', path: '/chat/regulation' },
          { id: 5, name: '상담일지 작성', icon: '💬', path: '/chat/log' },
          { id: 6, name: 'AI 상담 사용법', icon: '💡', path: '/chat/guide' }
        ];
        console.log('API 오류로 인해 기본 카테고리 사용');
        setCategories(defaultCategories);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const getCategoryById = (id) => {
    return categories.find(cat => cat.id === id);
  };

  const getCategoryByName = (name) => {
    return categories.find(cat => cat.name === name);
  };

  const getCategoryQuestions = async (categoryId) => {
    console.log('=== useCategoryData.getCategoryQuestions 호출 ===');
    console.log('받은 categoryId:', categoryId);
    console.log('categoryId 타입:', typeof categoryId);
    console.log('categoryId가 유효한가?', categoryId && categoryId > 0);
    
    if (!categoryId || categoryId <= 0) {
      console.error('유효하지 않은 categoryId:', categoryId);
      return [];
    }
    
    setIsLoading(true);
    try {
      console.log('getFaqQuestions 호출 시작...');
      const questions = await getFaqQuestions(categoryId);
      console.log('getFaqQuestions 응답:', questions);
      console.log('응답 타입:', typeof questions);
      console.log('배열인가?', Array.isArray(questions));
      console.log('길이:', questions ? questions.length : 'null/undefined');
      return questions;
    } catch (error) {
      console.error('카테고리 질문 조회 실패:', error);
      console.error('에러 상세:', error.response?.data);
      console.error('에러 상태:', error.response?.status);
      return [];
    } finally {
      setIsLoading(false);
      console.log('=== useCategoryData.getCategoryQuestions 완료 ===');
    }
  };

  // 질문 상세 조회 (로그인한 사용자만)
  const getQuestionDetail = async (questionId) => {
    setIsLoading(true);
    try {
      const questionDetail = await getFaqQuestionDetail(questionId);
      return questionDetail;
    } catch (error) {
      console.error('질문 상세 조회 실패:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };


  return {
    categories,
    getCategoryById,
    getCategoryByName,
    getCategoryQuestions,
    getQuestionDetail,
    isLoading
  };
};


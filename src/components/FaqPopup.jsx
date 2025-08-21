import { useState, useEffect } from 'react';
import { getFaqCategories, getFaqQuestions } from '../api/faq';

function FaqPopup({ isOpen, onClose, onQuestionClick }) {
  const [activeTab, setActiveTab] = useState('category');
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);



  // 개발용 임시 데이터
  const mockData = {
    categories: [
      { category_id: 1, title: "요양보호사 입·퇴사" },
      { category_id: 2, title: "급여 계산" },
      { category_id: 3, title: "제공계획서 작성" },
      { category_id: 4, title: "2025 고시 변경" },
      { category_id: 5, title: "상담일지 작성" },
      { category_id: 6, title: "AI 상담 사용법" }
    ],
    questions: [
      {
        question_id: 1,
        category_id: 1,
        question: "요양보호사 퇴사 시 4대보험은 언제까지 정리해야 하나요?"
      },
      {
        question_id: 2,
        category_id: 1,
        question: "입사 전 건강검진은 필수인가요?"
      },
      {
        question_id: 3,
        category_id: 1,
        question: "퇴사 시 연차수당은 어떻게 계산하나요?"
      },
      {
        question_id: 4,
        category_id: 1,
        question: "신규 입사자 인사기록카드는 어떤 항목까지 작성해야 하나요?"
      },
      {
        question_id: 5,
        category_id: 2,
        question: "요양보호사 야간근무 수당은 어떻게 계산하나요?"
      },
      {
        question_id: 6,
        category_id: 2,
        question: "방문요양 1시간 서비스 시 실 급여는 얼마인가요?"
      }
    ]
  };

  // FAQ 데이터 로드
  const loadFaqData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 개발 모드에서는 임시 데이터 사용
      const isDevelopment = import.meta.env.DEV;
      if (isDevelopment) {
        console.log('개발 모드: FAQ 임시 데이터 사용');
        setCategories(mockData.categories);
        setQuestions(mockData.questions);
        return;
      }

      // 실제 API 호출
      console.log('FAQ API 호출 중...');
      const categoriesResponse = await getFaqCategories();
      setCategories(categoriesResponse || mockData.categories);
      
      // 첫 번째 카테고리의 질문들 로드
      if (categoriesResponse && categoriesResponse.length > 0) {
        const firstCategory = categoriesResponse[0];
        setSelectedCategory(firstCategory);
        const questionsResponse = await getFaqQuestions(firstCategory.category_id);
        setQuestions(questionsResponse || mockData.questions);
      } else {
        setQuestions(mockData.questions);
      }
      
    } catch (error) {
      console.error('FAQ 데이터 로드 실패:', error);
      setError('FAQ 데이터를 불러오는데 실패했습니다.');
      // 에러 시 임시 데이터 사용
      setCategories(mockData.categories);
      setQuestions(mockData.questions);
    } finally {
      setIsLoading(false);
    }
  };

  // 카테고리 선택 시 질문 로드
  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setIsLoading(true);
    
    try {
      const isDevelopment = import.meta.env.DEV;
      if (isDevelopment) {
        // 개발 모드에서는 해당 카테고리의 질문들만 필터링
        const filteredQuestions = mockData.questions.filter(q => q.category_id === category.category_id);
        setQuestions(filteredQuestions);
        return;
      }

      const response = await getFaqQuestions(category.category_id);
      setQuestions(response || []);
    } catch (error) {
      console.error('카테고리별 질문 로드 실패:', error);
      setError('질문을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 팝업이 열릴 때 데이터 로드
  useEffect(() => {
    if (isOpen) {
      loadFaqData();
    }
  }, [isOpen]);

  const handleQuestionClick = (question) => {
    onQuestionClick(question);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-white flex items-center justify-center z-50"
      style={{ backgroundColor: 'white' }}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl border border-gray-200"
        style={{ backgroundColor: 'white' }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <h2 className="text-xl font-bold text-gray-800">FAQ 빠른 질문</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* 설명 */}
        <div className="px-6 py-4 bg-gray-50">
          <p className="text-sm text-gray-600">
            자주 묻는 질문을 클릭하면, 자동으로 AI 돌봄이 채팅창에 질문이 입력되고 답변을 받을 수 있습니다.
          </p>
        </div>

        {/* 탭 */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('category')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'category'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            카테고리
          </button>
          <button
            onClick={() => setActiveTab('question')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'question'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            질문 내용
          </button>
        </div>

        {/* FAQ 목록 */}
        <div className="p-6 overflow-y-auto max-h-96">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">데이터를 불러오는 중...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">
              <p>{error}</p>
              <button 
                onClick={loadFaqData}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {activeTab === 'category' ? (
                // 카테고리 탭
                                 categories.map((category) => (
                   <div
                     key={category.category_id}
                     onClick={() => handleCategorySelect(category)}
                     className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                       selectedCategory?.category_id === category.category_id
                         ? 'border-blue-500 bg-blue-50'
                         : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                     }`}
                   >
                     <div className="mb-2">
                       <h3 className="font-semibold text-gray-800 text-sm">
                         {category.title}
                       </h3>
                     </div>
                     <p className="text-xs text-gray-600">
                       {questions.filter(q => q.category_id === category.category_id).length}개의 질문
                     </p>
                   </div>
                 ))
              ) : (
                // 질문 내용 탭
                                 questions.map((faq) => (
                   <div
                     key={faq.question_id}
                     onClick={() => handleQuestionClick(faq.question)}
                     className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                   >
                     <div className="mb-2">
                       <h3 className="font-semibold text-gray-800 text-sm">
                         {faq.question}
                       </h3>
                     </div>
                     <p className="text-xs text-gray-600 line-clamp-2">
                       질문을 클릭하면 AI 돌봄이에게 자동으로 질문됩니다.
                     </p>
                   </div>
                 ))
              )}
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center items-center gap-2 p-4 border-t">
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FaqPopup;

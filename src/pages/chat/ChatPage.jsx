import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import LeftSidebar from '../../components/LeftSidebar';
import RightSidebar from '../../components/RightSidebar';
import FaqPopup from '../../components/FaqPopup';
import ChatContainer from '../../components/chat/ChatContainer';
import QuickQuestions from '../../components/chat/QuickQuestions';
import { useChatMessages } from '../../hooks/useChatMessages';
import { useCategoryData } from '../../hooks/useCategoryData';

function ChatPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isFaqPopupOpen, setIsFaqPopupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const { messages, setMessages, isLoading, sendMessage, clearMessages } = useChatMessages();
  const { categories, getCategoryById, getCategoryByName, getCategoryQuestions, getQuestionDetail } = useCategoryData();

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const isLoggedInStatus = !!token;
      setIsLoggedIn(isLoggedInStatus);
    };

    checkLoginStatus();

    const handleLoginStatusChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('loginStatusChanged', handleLoginStatusChange);
    window.addEventListener('focus', checkLoginStatus);

    return () => {
      window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
      window.removeEventListener('focus', checkLoginStatus);
    };
  }, []);

  // 카테고리 변경 시 초기 메시지 로드
  useEffect(() => {
    if (category) {
      console.log('URL에서 받은 카테고리 파라미터:', category);
      console.log('카테고리 파라미터 타입:', typeof category);
      console.log('카테고리 파라미터 길이:', category.length);
      loadCategoryMessages(category);
    }
  }, [category]);

  const loadCategoryMessages = async (categoryParam) => {
    clearMessages();
    
    // URL 파라미터가 카테고리 ID인지 이름인지 확인
    const categoryId = parseInt(categoryParam);
    const isNumeric = !isNaN(categoryId);
    
    console.log('받은 카테고리 파라미터:', categoryParam);
    console.log('파싱된 카테고리 ID:', categoryId);
    console.log('숫자인가?', isNumeric);
    
    let categoryName = categoryParam;
    let finalCategoryId = categoryId;
    
    // 숫자가 아니라면 카테고리 이름에서 ID 찾기
    if (!isNumeric) {
      categoryName = categoryParam;
      const categoryData = getCategoryByName(categoryParam);
      finalCategoryId = categoryData?.id;
      console.log('카테고리 이름으로 찾은 ID:', finalCategoryId);
    } else {
      // 숫자라면 카테고리 ID로 이름 찾기
      const categoryData = getCategoryById(categoryId);
      categoryName = categoryData?.name || categoryParam;
      finalCategoryId = categoryId;
      console.log('카테고리 ID로 찾은 이름:', categoryName);
    }
    
    setSelectedCategory(categoryName);

    const userMessage = {
      id: Date.now(),
      text: categoryName,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([userMessage]);

    try {
      // 백엔드 FAQ API에서 카테고리별 질문 목록 가져오기
      console.log('카테고리 질문 목록 요청 - ID:', finalCategoryId, '이름:', categoryName);
      
      if (finalCategoryId) {
        console.log('=== API 호출 시작 ===');
        console.log('호출할 카테고리 ID:', finalCategoryId);
        console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || "https://api.carebridges.o-r.kr");
        
        const questions = await getCategoryQuestions(finalCategoryId);
        console.log('=== API 응답 받음 ===');
        console.log('백엔드에서 받은 질문 목록:', questions);
        console.log('질문 개수:', questions ? questions.length : 0);
        console.log('질문 배열인가?', Array.isArray(questions));
        
        if (questions && questions.length > 0) {
          console.log('=== 제안 질문 생성 시작 ===');
          // 백엔드 응답 형식에 맞춰 제안 질문 생성
          const suggestions = questions.map((q, index) => {
            console.log(`질문 ${index + 1}:`, q);
            return `Q${index + 1}. ${q.question}`;
          });
          console.log('생성된 제안 질문:', suggestions);
          
          const botMessage = {
            id: Date.now() + 1,
            text: `${categoryName}에 대해 궁금하셨군요! 아래에서 자주 묻는 질문을 선택해 보시면, 더 정확히 도와드릴게요 😊`,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString(),
            suggestions: suggestions
          };

          console.log('=== 메시지 설정 시작 ===');
          console.log('설정할 botMessage:', botMessage);
          setMessages([userMessage, botMessage]);
          console.log('=== 메시지 설정 완료 ===');
        } else {
          // 질문 목록이 없는 경우 기본 메시지 표시
          console.log('질문 목록 없음, 기본 메시지 사용');
          const botMessage = {
            id: Date.now() + 1,
            text: `${categoryName}에 대해 궁금하신 점을 자유롭게 질문해주세요.`,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString()
          };

          setMessages([userMessage, botMessage]);
        }
      } else {
        // 카테고리 ID를 찾을 수 없는 경우
        console.log('카테고리 ID를 찾을 수 없음:', categoryName);
        const botMessage = {
          id: Date.now() + 1,
          text: `${categoryName}에 대해 궁금하신 점을 자유롭게 질문해주세요.`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        };

        setMessages([userMessage, botMessage]);
      }
    } catch (error) {
      console.error('카테고리 초기 답변 로드 실패:', error);
      
      // API 오류 발생 시 기본 메시지 표시
      const fallbackMessage = {
        id: Date.now() + 1,
        text: `${categoryName}에 대해 궁금하셨군요! 아래에서 자주 묻는 질문을 선택해 보시면, 더 정확히 도와드릴게요 😊`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        suggestions: [
          `Q1. ${categoryName} 관련 질문 1`,
          `Q2. ${categoryName} 관련 질문 2`,
          `Q3. ${categoryName} 관련 질문 3`
        ]
      };

      setMessages([userMessage, fallbackMessage]);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/chat/${category.name}`);
  };

  const handleSuggestionClick = async (suggestion) => {
    if (!suggestion) return;

    const newMessage = {
      id: Date.now(),
      text: suggestion,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, newMessage]);

     try {
       // 질문에서 ID 추출 (Q1. 질문내용 -> 1)
       const questionIdMatch = suggestion.match(/Q(\d+)\./);
       if (questionIdMatch) {
         const questionId = parseInt(questionIdMatch[1]);
         console.log('질문 ID 추출:', questionId);
         
         // 질문 상세 조회 API 호출
         const questionDetail = await getQuestionDetail(questionId);
         
         if (questionDetail) {
           console.log('질문 상세 정보:', questionDetail);
           
           // API 응답 형식에 맞춰 답변 구성
           const botResponse = {
             greeting: questionDetail.answer || '답변을 찾을 수 없습니다.',
             summary: questionDetail.reference_title || '',
             explanation: questionDetail.reference_url || '',
             references: questionDetail.reference_url ? [{
               title: questionDetail.reference_title || '관련 문서',
               url: questionDetail.reference_url
             }] : []
           };

           const botMessage = {
             id: Date.now() + 1,
             text: botResponse,
             sender: 'ai',
             timestamp: new Date().toLocaleTimeString()
           };

           setMessages(prev => [...prev, botMessage]);
         } else {
           // 질문 상세 조회 실패 시 일반 채팅으로 처리
           console.log('질문 상세 조회 실패, 일반 채팅으로 처리');
           await sendMessage(suggestion);
         }
       } else {
         // 질문 ID를 추출할 수 없는 경우 일반 채팅으로 처리
         console.log('질문 ID 추출 실패, 일반 채팅으로 처리');
         await sendMessage(suggestion);
       }
     } catch (error) {
       console.error('질문 처리 실패:', error);
       // 오류 발생 시 일반 채팅으로 처리
       await sendMessage(suggestion);
     }
  };

  const handlePdfDownload = (ref) => {
    try {
      if (ref.url.startsWith('http')) {
        window.open(ref.url, '_blank');
      } else {
        const link = document.createElement('a');
        link.href = ref.url;
        link.download = ref.title + '.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('PDF 다운로드 오류:', error);
      alert('PDF 다운로드 중 오류가 발생했습니다.');
    }
  };

  const handleSelectChat = async (chatId) => {
    try {
      console.log('채팅 선택:', chatId);
      const { getConversationDetails } = await import('../../api/chat');
      const response = await getConversationDetails(chatId);
      
      const loadedMessages = response.messages || response.data?.messages || [];
      setMessages(loadedMessages);
    } catch (error) {
      console.error('채팅 로드 실패:', error);
      setMessages([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        <LeftSidebar 
          isOpen={isLeftSidebarOpen} 
          onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          onNewChat={() => navigate('/dashboard')}
          onSelectChat={handleSelectChat}
          selectedChatId={null}
        />
        
        <div className="flex-1">
          <div className="max-w-6xl mx-auto p-6">
            {/* 빠른 질문 섹션 */}
            <QuickQuestions 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
            />

            {/* 채팅 컨테이너 */}
            <ChatContainer 
              messages={messages}
              isLoading={isLoading}
              isLoggedIn={isLoggedIn}
              onSendMessage={sendMessage}
              onSuggestionClick={handleSuggestionClick}
              onPdfDownload={handlePdfDownload}
            />
          </div>
        </div>
        
        <RightSidebar 
          isOpen={isRightSidebarOpen} 
          onToggle={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          onFaqClick={() => setIsFaqPopupOpen(true)}
        />
      </div>

      {isFaqPopupOpen && (
        <FaqPopup onClose={() => setIsFaqPopupOpen(false)} />
      )}
    </div>
  );
}

export default ChatPage;


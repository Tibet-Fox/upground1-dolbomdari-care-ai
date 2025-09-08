import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { askChatbot } from '../api/chat';
import { getFaqQuestions } from '../api/faq';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import FaqPopup from '../components/FaqPopup';

function Dashboard() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [isChatMode, setIsChatMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isFaqPopupOpen, setIsFaqPopupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 사이드바 토글 함수들
  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  // 채팅 내역 선택 함수
  const handleSelectChat = async (chatId) => {
    try {
      console.log('채팅 선택:', chatId);
      setSelectedChatId(chatId);
      setIsChatMode(true);
      setIsLoading(true);
      
      // 선택된 채팅의 메시지들을 불러오기
      const { getConversationDetails } = await import('../api/chat');
      const response = await getConversationDetails(chatId);
      
      console.log('채팅 상세 조회 성공:', response);
      
      // 메시지 데이터 처리
      const messages = response.messages || response.data?.messages || [];
      setMessages(messages);
      
    } catch (error) {
      console.error('채팅 로드 실패:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const user = localStorage.getItem('user');
      
      // 토큰만 있으면 로그인된 것으로 간주 (사용자 정보는 선택사항)
      const isLoggedInStatus = !!token;
      
      if (isLoggedIn !== isLoggedInStatus) {
        console.log('로그인 상태 변경됨:', isLoggedIn, '→', isLoggedInStatus, { token: !!token, user: !!user });
        setIsLoggedIn(isLoggedInStatus);
      }
    };

    // 초기 로그인 상태 확인
    checkLoginStatus();

    // 로그인 상태 변경 감지
    const handleLoginStatusChange = () => {
      console.log('로그인 상태 변경 이벤트 수신');
      checkLoginStatus();
    };

    // 커스텀 이벤트 리스너 (같은 탭에서 로그인/로그아웃 시)
    window.addEventListener('loginStatusChanged', handleLoginStatusChange);
    
    // 페이지 포커스 시 로그인 상태 재확인
    const handleFocus = () => {
      checkLoginStatus();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isLoggedIn]);

  // 컴포넌트가 마운트될 때마다 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    const isLoggedInStatus = !!token;
    
    console.log('컴포넌트 마운트 시 로그인 상태 확인:', { 
      token: !!token,
      isLoggedIn: isLoggedInStatus 
    });
    
    setIsLoggedIn(isLoggedInStatus);
  }, []);

  // isLoggedIn 상태가 변경될 때마다 콘솔에 출력 (개발용)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('isLoggedIn 상태 변경됨:', isLoggedIn);
    }
  }, [isLoggedIn]);

  // resetDashboard 이벤트 리스너 추가
  useEffect(() => {
    const handleResetDashboard = () => {
      console.log('Dashboard 리셋 이벤트 수신');
      setMessages([]);
      setIsChatMode(false);
      setIsChatHistoryOpen(false);
      setIsLoading(false);
      setInputText('');
      setIsLeftSidebarOpen(false);
      setIsRightSidebarOpen(false);
      setIsFaqPopupOpen(false);
      setSelectedCategory(null); // 선택된 카테고리 초기화
    };

    window.addEventListener('resetDashboard', handleResetDashboard);

    return () => {
      window.removeEventListener('resetDashboard', handleResetDashboard);
    };
  }, []);

  // 메시지 전송 처리 함수
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // 채팅 모드로 전환
    setIsChatMode(true);
    setIsChatHistoryOpen(false);

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await askChatbot(inputText);
      
      console.log('Dashboard에서 받은 응답:', response);
      
      let botMessageText;
      if (typeof response.bot_message === 'object' && response.bot_message.greeting) {
        botMessageText = response.bot_message;
      } else if (typeof response.bot_message === 'string') {
        botMessageText = response.bot_message;
      } else {
        botMessageText = "죄송합니다. 응답을 생성하는 중에 오류가 발생했습니다.";
      }
      
      console.log('최종 botMessageText:', botMessageText);

      const botMessage = {
        id: Date.now() + 1,
        text: botMessageText,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        suggestions: response.suggestions || null
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      
      let errorMessage = "죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.";
      
      // 오류 메시지에 따른 처리
      if (error.message) {
        if (error.message.includes('로그인이 필요합니다')) {
          errorMessage = "로그인이 필요합니다. 다시 로그인해주세요.";
          
          // 토큰 만료 시 로그아웃 처리
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          
          // 로그인 상태 업데이트
          setIsLoggedIn(false);
          
          // 3초 후 루트 페이지로 리다이렉트
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        } else if (error.message.includes('대화 접근 권한이 없습니다')) {
          errorMessage = "대화 접근 권한이 없습니다. 새 대화를 시작합니다.";
          
          // 대화 ID 초기화
          localStorage.removeItem('current_conversation_id');
          
          // 2초 후 다시 시도
          setTimeout(() => {
            handleSendMessage();
          }, 2000);
        } else if (error.message.includes('네트워크 오류')) {
          errorMessage = "서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.";
        } else if (error.message.includes('요청 데이터 형식')) {
          errorMessage = "요청 데이터 형식이 올바르지 않습니다. 다시 시도해주세요.";
        } else {
          errorMessage = error.message;
        }
      }
      
      const errorBotMessage = {
        id: Date.now() + 1,
        text: errorMessage,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 프리셋 질문 클릭 처리 함수
  const handleQuestionClick = async (category) => {
    setSelectedCategory(category); // 선택된 카테고리 설정
    setIsChatMode(true);
    setIsChatHistoryOpen(false);
    
    // 기존 메시지 초기화 - 새로운 대화 시작
    setMessages([]);
    
    const userMessage = {
      id: Date.now(),
      text: category,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([userMessage]);
    setIsLoading(true);

    try {
      const categoryMap = {
        '요양보호사 입·퇴사': 1,
        '급여 계산': 2,
        '제공계획서 작성': 3,
        '2025 고시 변경': 4,
        '상담일지 작성': 5,
        'AI 상담 사용법': 6
      };

      const categoryId = categoryMap[category];
      
      if (categoryId) {
        try {
          const questions = await getFaqQuestions(categoryId);
          
          const categoryResponse = {
            greeting: `${category}에 대해 궁금하셨군요! 안내드릴게요.`,
            summary: "자세한 내용을 확인하실 수 있습니다.",
            explanation: "아래 질문 중에서 궁금한 것을 선택해주세요.",
            references: []
          };
          
          let suggestions = [];
          if (questions && questions.length > 0) {
            suggestions = questions.map((q, index) => 
              `Q${index + 1}. ${q.question}`
            );
          } else {
            const defaultSuggestions = {
              1: [
                "Q1. 요양보호사 입사 시 필요한 서류는 무엇인가요?",
                "Q2. 요양보호사 퇴사 시 4대보험 정리는 어떻게 하나요?",
                "Q3. 요양보호사 자격증은 어디서 발급받나요?",
                "Q4. 요양보호사 복무 규정은 어떻게 되나요?"
              ],
              2: [
                "Q1. 요양보호사 야간근무 수당은 어떻게 계산하나요?",
                "Q2. 방문요양 1시간 서비스 시 실 급여는 얼마인가요?",
                "Q3. 주휴수당은 주 15시간 미만 근무자에게도 발생하나요?",
                "Q4. 4대보험 미가입자의 급여지급 시 유의사항이 있나요?"
              ],
              3: [
                "Q1. 제공계획서는 언제 작성하나요?",
                "Q2. 제공계획서에 포함되어야 할 내용은 무엇인가요?",
                "Q3. 제공계획서 수정은 어떻게 하나요?",
                "Q4. 제공계획서 평가는 언제 하나요?"
              ],
              4: [
                "Q1. 2025년 요양보호사 급여 기준이 어떻게 변경되나요?",
                "Q2. 2025년 서비스 제공 시간이 변경되나요?",
                "Q3. 2025년 자격 요건이 변경되나요?",
                "Q4. 2025년 복지 혜택이 추가되나요?"
              ],
              5: [
                "Q1. 상담일지 작성 시 주의사항은 무엇인가요?",
                "Q2. 상담일지에 반드시 포함되어야 할 내용은 무엇인가요?",
                "Q3. 상담일지 작성 시간은 언제인가요?",
                "Q4. 상담일지 오류 수정은 어떻게 하나요?"
              ],
              6: [
                "Q1. AI 상담은 언제 이용할 수 있나요?",
                "Q2. AI 상담에서 어떤 질문을 할 수 있나요?",
                "Q3. AI 상담 답변의 정확도는 어떻게 되나요?",
                "Q4. AI 상담 기록은 어떻게 관리되나요?"
              ]
            };
            
            suggestions = defaultSuggestions[categoryId] || [];
          }

          const botMessage = {
            id: Date.now() + 1,
            text: categoryResponse,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString(),
            suggestions: suggestions
          };

          setMessages(prev => [...prev, botMessage]);

        } catch (faqError) {
          console.error('FAQ API 오류:', faqError);
          const botResponse = {
            greeting: `${category}에 대해 궁금하셨군요! 안내드릴게요.`,
            summary: "자세한 내용은 FAQ 섹션에서 확인하실 수 있습니다.",
            explanation: "궁금한 점이 있으시면 언제든지 질문해주세요.",
            references: []
          };

          const botMessage = {
            id: Date.now() + 1,
            text: botResponse,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString()
          };

          setMessages(prev => [...prev, botMessage]);
        }
      } else {
        const botResponse = {
          greeting: `${category}에 대한 답변입니다.`,
          summary: "자세한 내용은 FAQ 섹션에서 확인하실 수 있습니다.",
          explanation: "궁금한 점이 있으시면 언제든지 질문해주세요.",
          references: []
        };

        const botMessage = {
          id: Date.now() + 1,
          text: botResponse,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('빠른 채팅 오류:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "죄송합니다. 답변을 가져오는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 제안 질문 클릭 처리 함수
  const handleSuggestionClick = async (suggestion) => {
    if (!suggestion) return;

    const newMessage = {
      id: Date.now(),
      text: suggestion,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, newMessage]);

    const loadingMessage = {
      id: Date.now() + 1,
      text: "🤖 돌봄이가 답변을 준비하고 있습니다...",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString(),
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const questionMatch = suggestion.match(/Q\d+\.\s*(.+)/);
      const actualQuestion = questionMatch ? questionMatch[1] : suggestion;
      
      let categoryId = null;
      
      for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i];
        if (message.sender === 'user') {
          const categoryMap = {
            '요양보호사 입·퇴사': 1,
            '급여 계산': 2,
            '제공계획서 작성': 3,
            '2025 고시 변경': 4,
            '상담일지 작성': 5,
            'AI 상담 사용법': 6
          };
          
          if (categoryMap[message.text]) {
            categoryId = categoryMap[message.text];
            break;
          }
        }
      }
      
      let botResponse = null;
      
      if (categoryId) {
        const keywords = actualQuestion.toLowerCase();
        
        if (categoryId === 1) { // 요양보호사 입·퇴사
          if (keywords.includes('입사') && keywords.includes('서류')) {
            botResponse = {
              greeting: "요양보호사 입사 시 필요한 서류에 대해 상세히 안내드릴게요!",
              summary: "입사 시에는 건강검진 결과서, 자격증 사본, 신분증 등 6가지 필수 서류가 필요합니다.",
              explanation: "요양보호사 입사 시 제출해야 할 필수 서류는 다음과 같습니다:\n\n📋 **필수 제출 서류**\n1. 건강검진 결과서 (최근 1년 이내)\n2. 요양보호사 자격증 사본\n3. 신분증 사본\n4. 사진 2매 (3x4cm)\n5. 이력서 및 자기소개서\n6. 급여계좌 통장 사본\n\n⚠️ **제출 시 주의사항**\n• 모든 서류는 원본과 사본을 함께 제출\n• 서류 유효기간 확인 필수\n• 개인정보 보호를 위해 민감정보 가림 처리",
              references: [
                { title: "요양보호사 입사 서류 가이드", url: "/documents/caregiver-onboarding-guide.pdf" }
              ]
            };
          } else if (keywords.includes('퇴사') && keywords.includes('4대보험')) {
            botResponse = {
              greeting: "요양보호사 퇴사 시 4대보험 정리에 대해 상세히 안내드릴게요!",
              summary: "퇴사 시에는 14일 이내에 4대보험 해지 신청을 각 보험공단에 완료해야 합니다.",
              explanation: "요양보호사 퇴사 시 4대보험 정리 절차는 다음과 같습니다:\n\n📅 **퇴사 후 14일 이내 필수 처리사항**\n\n🏥 **1. 국민연금 해지 신청**\n• 국민연금공단 홈페이지 또는 지사 방문\n• 해지 신청서, 신분증, 퇴직증명서 제출\n\n🏥 **2. 건강보험 해지 신청**\n• 국민건강보험공단 홈페이지 또는 지사 방문\n• 해지 신청서, 신분증, 퇴직증명서 제출\n\n🏥 **3. 고용보험 해지 신청**\n• 고용노동부 홈페이지 또는 고용센터 방문\n• 해지 신청서, 신분증, 퇴직증명서 제출\n\n🏥 **4. 산재보험 해지 신청**\n• 근로복지공단 홈페이지 또는 지사 방문\n• 해지 신청서, 신분증, 퇴직증명서 제출\n\n⚠️ **주의사항**\n• 14일 초과 시 가입자격 상실로 인한 불이익 발생\n• 각 보험공단별로 해지 신청 방법이 다를 수 있음\n• 온라인 신청 시 본인인증 필수\n• 퇴직증명서는 반드시 원본 제출",
              references: [
                { title: "4대보험 해지 신청 가이드", url: "/documents/insurance-termination-guide.pdf" }
              ]
            };
          } else if (keywords.includes('자격증') && keywords.includes('발급')) {
            botResponse = {
              greeting: "요양보호사 자격증 발급에 대해 상세히 안내드릴게요!",
              summary: "요양보호사 자격증은 보건복지부에서 발급하며, 교육과정 수료 후 자격시험을 통과해야 합니다.",
              explanation: "요양보호사 자격증 발급 절차는 다음과 같습니다:\n\n📚 **자격증 취득 과정**\n\n1️⃣ **교육과정 수료 (240시간)**\n2️⃣ **자격시험 응시**\n3️⃣ **자격증 발급 신청**\n4️⃣ **자격증 수령**\n\n💰 **비용 안내**\n• 교육비: 기관별 상이 (평균 50-80만원)\n• 시험 응시료: 15,000원\n• 자격증 발급료: 3,000원",
              references: [
                { title: "요양보호사 자격증 발급 안내", url: "/documents/caregiver-license-guide.pdf" }
              ]
            };
          } else if (keywords.includes('복무') && keywords.includes('규정')) {
            botResponse = {
              greeting: "요양보호사 복무 규정에 대해 상세히 안내드릴게요!",
              summary: "요양보호사는 근로기준법과 기관의 복무 규정을 준수해야 하며, 전문적이고 친절한 태도로 서비스를 제공해야 합니다.",
              explanation: "요양보호사 복무 규정의 주요 내용은 다음과 같습니다:\n\n⏰ **근무시간 및 휴식**\n• 근무시간: 1일 8시간, 주 40시간 원칙\n• 휴식시간: 4시간 이상 근무 시 30분, 8시간 이상 근무 시 1시간\n\n👔 **복장 및 태도**\n• 복장: 깔끔하고 활동하기 편한 복장\n• 태도: 친절하고 전문적인 태도 유지\n\n📋 **서비스 제공 규정**\n• 개인정보 보호: 어르신의 개인정보 절대 유출 금지\n• 안전수칙: 어르신과 본인의 안전 최우선",
              references: [
                { title: "요양보호사 복무 규정", url: "/documents/caregiver-work-rules.pdf" }
              ]
            };
          } else if (keywords.includes('연차수당') && keywords.includes('계산')) {
            botResponse = {
              greeting: "요양보호사 퇴사 시 연차수당 계산에 대해 상세히 안내드릴게요!",
              summary: "연차수당은 근로기준법에 따라 1년간 80% 이상 출근한 근로자에게 지급되는 법정 수당입니다.",
              explanation: "요양보호사 퇴사 시 연차수당 계산 방법은 다음과 같습니다:\n\n📅 **연차수당 발생 조건**\n• 1년간 80% 이상 출근 시 연차수당 발생\n• 1년 미만 근무 시 월별 비례 계산\n\n💰 **연차수당 계산 공식**\n• 연차수당 = (월급여 ÷ 209시간) × 연차일수 × 8시간\n\n📊 **계산 예시**\n• 월급여: 2,000,000원\n• 연차일수: 15일\n• 시급: 2,000,000원 ÷ 209시간 = 9,569원\n• 연차수당: 9,569원 × 15일 × 8시간 = 1,148,280원\n\n⚠️ **주의사항**\n• 퇴사 시 미사용 연차는 모두 수당으로 지급\n• 연차수당은 퇴직금과 별도로 계산\n• 소득세 원천징수 대상",
              references: [
                { title: "연차수당 계산 가이드", url: "/documents/annual-leave-allowance-guide.pdf" }
              ]
            };
          } else if (keywords.includes('건강검진') && keywords.includes('필수')) {
            botResponse = {
              greeting: "요양보호사 입사 전 건강검진에 대해 상세히 안내드릴게요!",
              summary: "요양보호사 입사 전 건강검진은 법적으로 필수이며, 최근 1년 이내 검진 결과를 제출해야 합니다.",
              explanation: "요양보호사 입사 전 건강검진 관련 사항은 다음과 같습니다:\n\n🏥 **건강검진 필수 항목**\n• 일반검진: 신장, 체중, 혈압, 시력, 청력\n• 혈액검사: 혈색소, 혈당, 콜레스테롤\n• 소변검사: 단백질, 당뇨, 잠혈\n• 흉부 X-ray: 폐질환 여부\n• B형간염 검사: 항원, 항체 검사\n\n📋 **검진 결과 제출**\n• 검진일로부터 1년 이내 결과만 유효\n• 원본 또는 사본 제출 가능\n• 검진기관은 보건복지부 지정기관\n\n💰 **검진 비용**\n• 개인부담: 약 3만원~5만원\n• 일부 기관에서 지원 가능\n• 검진비 지원 여부는 사전 문의\n\n⚠️ **주의사항**\n• 검진 결과는 입사 후에도 보관\n• 만성질환이 있어도 업무 수행 가능 여부 판단\n• 검진 결과에 따른 추가 검사 필요 시 안내",
              references: [
                { title: "요양보호사 건강검진 안내", url: "/documents/health-checkup-guide.pdf" }
              ]
            };
          } else if (keywords.includes('인사기록카드') && keywords.includes('작성')) {
            botResponse = {
              greeting: "요양보호사 신규 입사자 인사기록카드 작성에 대해 상세히 안내드릴게요!",
              summary: "인사기록카드는 요양보호사의 기본 정보와 경력을 관리하는 중요한 서류입니다.",
              explanation: "요양보호사 신규 입사자 인사기록카드 작성 항목은 다음과 같습니다:\n\n📝 **기본 정보**\n• 성명, 주민등록번호, 주소, 연락처\n• 최종학력, 졸업학교, 졸업년도\n• 요양보호사 자격증 번호, 발급일자\n\n💼 **경력 정보**\n• 이전 근무기관명, 근무기간, 담당업무\n• 요양보호사 경력 연수\n• 관련 자격증 보유 현황\n\n🏥 **건강 정보**\n• 건강검진 결과\n• 만성질환 여부\n• 복용 중인 약물\n\n📋 **기타 정보**\n• 긴급연락처 (보호자 연락처)\n• 은행계좌 정보\n• 서명 및 날짜\n\n⚠️ **작성 시 주의사항**\n• 모든 항목을 정확하게 기재\n• 변경사항 발생 시 즉시 수정\n• 개인정보 보호를 위해 안전하게 보관\n• 서류 유효기간 확인 필수",
              references: [
                { title: "인사기록카드 작성 가이드", url: "/documents/personnel-record-guide.pdf" }
              ]
            };
          }
        } else if (categoryId === 2) { // 급여 계산
          if (keywords.includes('야간') && keywords.includes('수당')) {
            botResponse = {
              greeting: "요양보호사 야간근무 수당 계산에 대해 상세히 안내드릴게요!",
              summary: "야간근무 수당은 기본급의 50% 추가 지급되며, 오후 10시~오전 6시에 근무할 때 적용됩니다.",
              explanation: "요양보호사 야간근무 수당 계산 방법은 다음과 같습니다:\n\n🌙 **야간근무 기본 정보**\n• 야간근무 시간: 오후 10시 ~ 오전 6시\n• 수당율: 기본급의 50% 추가\n• 지급 조건: 연속 8시간 야간근무 시\n\n💰 **계산 예시**\n• 기본급: 10,000원/시간\n• 야간수당: 10,000원 × 50% = 5,000원/시간\n• 총 야간급여: 10,000원 + 5,000원 = 15,000원/시간",
              references: [
                { title: "야간근무 수당 계산 가이드", url: "/documents/night-shift-allowance-guide.pdf" }
              ]
            };
          } else if (keywords.includes('방문요양') && keywords.includes('급여')) {
            botResponse = {
              greeting: "방문요양 1시간 서비스 실 급여에 대해 상세히 안내드릴게요!",
              summary: "방문요양 1시간 서비스 실 급여는 약 12,000원~15,000원이며, 지역과 기관에 따라 차이가 있습니다.",
              explanation: "방문요양 1시간 서비스 실 급여 구성은 다음과 같습니다:\n\n💰 **급여 구성 상세**\n\n1️⃣ **기본급: 10,000원~12,000원**\n2️⃣ **교통비: 1,000원~2,000원**\n3️⃣ **식대: 1,000원~1,500원**\n\n📊 **총 실 급여 계산**\n• 최소: 10,000원 + 1,000원 + 1,000원 = 12,000원\n• 최대: 12,000원 + 2,000원 + 1,500원 = 15,500원",
              references: [
                { title: "방문요양 급여 기준표", url: "/documents/home-care-salary-guide.pdf" }
              ]
            };

          } else if (keywords.includes('주휴수당')) {
            botResponse = {
              greeting: "주휴수당 발생 조건에 대해 상세히 안내드릴게요!",
              summary: "주휴수당은 주 15시간 이상 근무자에게만 발생하며, 15시간 미만 근무자는 주휴수당이 없습니다.",
              explanation: "주휴수당 발생 조건은 다음과 같습니다:\n\n⏰ **주휴수당 발생 기준**\n• 주 15시간 이상 근무 시 발생\n• 주 15시간 미만 근무자는 주휴수당 없음\n• 근로기준법 제18조에 근거\n\n💰 **주휴수당 계산 방법**\n• 주휴수당 = 시급 × 주간 소정근로시간 × 1/40\n\n📊 **계산 예시**\n• 시급: 10,000원\n• 주간 근무시간: 20시간\n• 주휴수당 = 10,000원 × 20시간 × 1/40 = 5,000원",
              references: [
                { title: "주휴수당 계산 가이드", url: "/documents/weekly-holiday-allowance-guide.pdf" }
              ]
            };
          } else if (keywords.includes('4대보험') && keywords.includes('미가입')) {
            botResponse = {
              greeting: "4대보험 미가입자 급여지급 유의사항에 대해 상세히 안내드릴게요!",
              summary: "4대보험 미가입자는 급여에서 보험료를 공제하지 않지만, 개인적으로 보험료를 납부해야 합니다.",
              explanation: "4대보험 미가입자 급여지급 시 유의사항은 다음과 같습니다:\n\n💳 **급여 지급 방식**\n• 보험료 공제 없음: 급여에서 4대보험료를 공제하지 않음\n• 실수령액 증가: 보험료 공제 전 금액이 실수령액\n\n💰 **개인부담금**\n• 보험료는 개인이 별도로 납부해야 함\n• 국민연금: 월 급여의 9% (개인부담 4.5%)\n• 건강보험: 월 급여의 약 7% (개인부담 3.545%)\n• 고용보험: 월 급여의 약 1.5% (개인부담 0.8%)\n\n⚠️ **주의사항**\n• 4대보험 미가입 시 장기적으로 불리\n• 노후연금 수령액 감소\n• 의료보험 혜택 제한",
              references: [
                { title: "4대보험 가입 안내", url: "/documents/insurance-enrollment-guide.pdf" }
              ]
            };
          }
        }
      }

      if (!botResponse) {
        // keywords 변수가 정의되지 않은 경우를 대비한 안전장치
        const keywords = actualQuestion.toLowerCase();
        
        // 빠른 질문에 대한 구체적인 답변 추가
        if (keywords.includes('일일') && keywords.includes('2회') && keywords.includes('서비스')) {
          botResponse = {
            greeting: "일일 2회 서비스가 가능한 조건에 대해 상세히 안내드릴게요!",
            summary: "일일 2회 서비스는 어르신의 건강상태와 보호자 요청에 따라 가능하며, 공단 승인을 받아야 합니다.",
            explanation: "일일 2회 서비스가 가능한 조건은 다음과 같습니다:\n\n🏥 **의료적 필요성**\n• **중증도 판정**: 중증도 1~2등급 어르신\n• **의료진 의견**: 담당의사의 서비스 필요성 의견서\n• **건강상태**: 일일 2회 서비스가 필요한 건강상태\n• **복용약물**: 하루 2회 이상 복용이 필요한 약물\n\n👥 **보호자 요청**\n• **보호자 동의**: 보호자의 서비스 요청 및 동의\n• **가족 상황**: 보호자의 근무시간 등 가족 상황\n• **돌봄 필요**: 가족의 돌봄 한계 상황\n• **서비스 희망**: 어르신 및 보호자의 서비스 희망\n\n📋 **공단 승인 절차**\n• **서류 제출**: 의료진 의견서, 보호자 요청서\n• **사정 조사**: 공단 담당자의 현장 사정\n• **승인 심사**: 공단 심사위원회 심사\n• **승인 통보**: 승인 결과 통보\n\n⚠️ **주의사항**\n• 공단 승인 없이 2회 서비스 제공 금지\n• 승인 기간은 최대 6개월\n• 기간 만료 시 재승인 필요\n• 서비스 내용 변경 시 재승인 필요\n\n💡 **서비스 시간**\n• **1차 서비스**: 오전 6시~12시\n• **2차 서비스**: 오후 2시~8시\n• **서비스 간격**: 최소 2시간 이상 간격\n• **총 서비스 시간**: 일일 최대 4시간",
            references: [
              { title: "일일 2회 서비스 승인 가이드", url: "/documents/twice-daily-service-guide.pdf" }
            ]
          };
        } else if (keywords.includes('야간') && keywords.includes('수당')) {
          botResponse = {
            greeting: "요양보호사 야간수당 계산에 대해 상세히 안내드릴게요!",
            summary: "야간수당은 오후 10시부터 오전 6시까지 근무 시 기본급의 50%가 추가로 지급됩니다.",
            explanation: "요양보호사 야간수당 계산 방법은 다음과 같습니다:\n\n🌙 **야간 근무 시간**\n• **야간 시간**: 오후 10시~오전 6시 (8시간)\n• **심야 시간**: 오전 2시~6시 (4시간)\n• **야간수당**: 기본급의 50%\n• **심야수당**: 기본급의 70%\n\n💰 **계산 예시**\n• **기본급**: 10,000원/시간\n• **야간수당**: 10,000원 × 50% = 5,000원/시간\n• **심야수당**: 10,000원 × 70% = 7,000원/시간\n• **야간 근무 8시간**: (10,000원 + 5,000원) × 8시간 = 120,000원\n\n📅 **지급 조건**\n• 야간 시간대에 실제 근무한 시간\n• 최소 30분 이상 근무 시 지급\n• 30분 미만은 30분으로 계산\n• 야간 근무 중 휴식시간은 제외\n\n⚠️ **주의사항**\n• 야간 근무는 사전 승인 필요\n• 안전을 위해 2인 이상 근무 원칙\n• 응급상황 대비 체계 구축\n• 야간 근무 후 충분한 휴식 보장",
            references: [
              { title: "야간수당 계산 가이드", url: "/documents/night-shift-allowance-guide.pdf" }
            ]
          };
        } else if (keywords.includes('주휴수당')) {
          botResponse = {
            greeting: "주휴수당 발생 조건에 대해 상세히 안내드릴게요!",
            summary: "주휴수당은 주 15시간 이상 근무자에게만 발생하며, 15시간 미만 근무자는 주휴수당이 없습니다.",
            explanation: "주휴수당 발생 조건은 다음과 같습니다:\n\n⏰ **주휴수당 발생 기준**\n• 주 15시간 이상 근무 시 발생\n• 주 15시간 미만 근무자는 주휴수당 없음\n• 근로기준법 제18조에 근거\n\n💰 **주휴수당 계산 방법**\n• 주휴수당 = 시급 × 주간 소정근로시간 × 1/40\n\n📊 **계산 예시**\n• 시급: 10,000원\n• 주간 근무시간: 20시간\n• 주휴수당 = 10,000원 × 20시간 × 1/40 = 5,000원",
            references: [
              { title: "주휴수당 계산 가이드", url: "/documents/weekly-holiday-allowance-guide.pdf" }
            ]
          };
        } else if (keywords.includes('4대보험') && keywords.includes('미가입')) {
          botResponse = {
            greeting: "4대보험 미가입자 급여지급 유의사항에 대해 상세히 안내드릴게요!",
            summary: "4대보험 미가입자는 급여에서 보험료를 공제하지 않지만, 개인적으로 보험료를 납부해야 합니다.",
            explanation: "4대보험 미가입자 급여지급 시 유의사항은 다음과 같습니다:\n\n💳 **급여 지급 방식**\n• 보험료 공제 없음: 급여에서 4대보험료를 공제하지 않음\n• 실수령액 증가: 보험료 공제 전 금액이 실수령액\n\n💰 **개인부담금**\n• 보험료는 개인이 별도로 납부해야 함\n• 국민연금: 월 급여의 9% (개인부담 4.5%)\n• 건강보험: 월 급여의 약 7% (개인부담 3.545%)\n• 고용보험: 월 급여의 약 1.5% (개인부담 0.8%)\n\n⚠️ **주의사항**\n• 4대보험 미가입 시 장기적으로 불리\n• 노후연금 수령액 감소\n• 의료보험 혜택 제한",
            references: [
              { title: "4대보험 가입 안내", url: "/documents/insurance-enrollment-guide.pdf" }
            ]
          };
        } else if (keywords.includes('방문요양') && keywords.includes('1시간')) {
          botResponse = {
            greeting: "방문요양 1시간 서비스 시 실 급여에 대해 상세히 안내드릴게요!",
            summary: "방문요양 1시간 서비스 시 실 급여는 기본급에서 4대보험료와 소득세를 공제한 금액입니다.",
            explanation: "방문요양 1시간 서비스 시 실 급여 계산은 다음과 같습니다:\n\n💰 **기본 급여**\n• **기본급**: 10,000원~12,000원/시간\n• **교통비**: 1,500원~2,500원\n• **식대**: 1,500원~2,000원\n• **총 급여**: 13,000원~16,500원\n\n💳 **공제 사항**\n• **국민연금**: 급여의 4.5% (585원~742원)\n• **건강보험**: 급여의 3.545% (460원~584원)\n• **고용보험**: 급여의 0.8% (104원~132원)\n• **소득세**: 급여의 약 3% (390원~495원)\n\n📊 **실 급여 계산 예시**\n• **총 급여**: 15,000원\n• **공제액**: 1,539원 (585+460+104+390)\n• **실 급여**: 13,461원\n\n⚠️ **주의사항**\n• 4대보험 가입 여부에 따라 공제액 차이\n• 소득세는 누적 급여에 따라 변동\n• 교통비와 식대는 기관별 차이\n• 야간수당이나 휴일수당은 별도 계산",
            references: [
              { title: "방문요양 급여 계산 가이드", url: "/documents/visit-care-salary-guide.pdf" }
            ]
          };
        } else if (keywords.includes('자격증') && keywords.includes('발급')) {
          botResponse = {
            greeting: "요양보호사 자격증 발급에 대해 상세히 안내드릴게요!",
            summary: "요양보호사 자격증은 보건복지부에서 발급하며, 교육과정 이수 후 자격시험을 통과해야 합니다.",
            explanation: "요양보호사 자격증 발급 절차는 다음과 같습니다:\n\n📚 **교육과정 이수**\n• **교육시간**: 240시간 (이론 200시간 + 실습 40시간)\n• **교육기관**: 보건복지부 지정 교육기관\n• **교육내용**: 요양보호 이론, 실무기술, 응급처치\n• **교육비**: 약 50만원~80만원\n\n📋 **자격시험 응시**\n• **시험일정**: 연 4회 (3월, 6월, 9월, 12월)\n• **시험과목**: 요양보호 이론, 실무기술\n• **합격기준**: 각 과목 60점 이상\n• **응시료**: 약 3만원\n\n🏥 **실습 이수**\n• **실습시간**: 40시간\n• **실습기관**: 요양병원, 요양원, 재가복지센터\n• **실습내용**: 실제 요양보호 서비스 제공\n• **실습평가**: 실습기관의 평가서 제출\n\n📄 **자격증 발급**\n• **발급기관**: 보건복지부\n• **발급기간**: 합격 후 약 1개월\n• **발급방법**: 우편 발송 또는 직접 수령\n• **발급비용**: 약 1만원\n\n⚠️ **주의사항**\n• 교육과정은 반드시 지정기관에서 이수\n• 실습은 반드시 지정기관에서 이수\n• 자격시험은 교육과정 이수 후 응시 가능\n• 자격증은 평생 유효",
            references: [
              { title: "요양보호사 자격증 발급 가이드", url: "/documents/caregiver-license-guide.pdf" }
            ]
          };
        } else if (keywords.includes('복무') && keywords.includes('규정')) {
          botResponse = {
            greeting: "요양보호사 복무 규정에 대해 상세히 안내드릴게요!",
            summary: "요양보호사 복무 규정은 근로기준법과 요양보호사 관련 법령에 따라 정해져 있습니다.",
            explanation: "요양보호사 복무 규정은 다음과 같습니다:\n\n⏰ **근무시간**\n• **일일 근무시간**: 최대 8시간\n• **주간 근무시간**: 최대 40시간\n• **야간 근무**: 오후 10시~오전 6시\n• **휴식시간**: 4시간 근무 시 30분, 8시간 근무 시 1시간\n\n📅 **휴일 및 휴가**\n• **주휴일**: 주 1일 이상\n• **공휴일**: 법정 공휴일\n• **연차휴가**: 1년 근무 시 15일\n• **병가**: 의료기관 진단서 제출 시\n\n🌙 **야간 근무**\n• **야간수당**: 기본급의 50%\n• **심야수당**: 기본급의 70%\n• **안전조치**: 2인 이상 근무 원칙\n• **응급대비**: 응급상황 대비 체계 구축\n\n⚠️ **복무 규정**\n• **복장**: 깔끔하고 활동하기 편한 복장\n• **위생**: 개인위생 철저히 유지\n• **안전**: 안전사고 예방에 최우선\n• **윤리**: 어르신 인권 존중\n\n💡 **서비스 제공 규정**\n• **서비스 시간**: 어르신과 약속한 시간 준수\n• **서비스 내용**: 제공계획서에 따른 서비스 제공\n• **기록 작성**: 서비스 제공 후 기록 작성\n• **보고**: 특이사항 발생 시 즉시 보고",
            references: [
              { title: "요양보호사 복무 규정", url: "/documents/caregiver-work-regulations.pdf" }
            ]
          };
        } else if (keywords.includes('입사') && keywords.includes('서류')) {
          botResponse = {
            greeting: "요양보호사 입사 시 필요한 서류에 대해 상세히 안내드릴게요!",
            summary: "입사 시에는 건강검진 결과서, 자격증 사본, 신분증 등 6가지 필수 서류가 필요합니다.",
            explanation: "요양보호사 입사 시 필요한 서류는 다음과 같습니다:\n\n📋 **필수 서류**\n• **자격증 사본**: 요양보호사 자격증 사본\n• **신분증 사본**: 주민등록증 또는 운전면허증\n• **건강검진 결과서**: 최근 6개월 이내 검진 결과\n• **범죄경력조회서**: 경찰서 발급 (원본)\n• **인사기록카드**: 기관 제공 양식\n• **근로계약서**: 기관과 체결한 계약서\n\n🏥 **건강검진 항목**\n• **일반검진**: 신장, 체중, 혈압, 시력, 청력\n• **혈액검사**: 혈색소, 혈당, 콜레스테롤\n• **소변검사**: 단백질, 당뇨, 잠혈\n• **흉부X선**: 결핵 검사\n• **전염병 검사**: B형간염, 매독 등\n\n📄 **추가 서류**\n• **사진**: 3×4 사진 2매\n• **통장 사본**: 급여 지급용 통장\n• **보험증**: 4대보험 가입 증명서\n• **교육이수증**: 보수교육 이수 증명서\n\n⚠️ **주의사항**\n• 모든 서류는 최신본이어야 함\n• 범죄경력조회서는 원본만 유효\n• 건강검진은 반드시 공단 지정 병원에서\n• 서류 미비 시 입사 지연 가능\n\n💡 **서류 준비 팁**\n• 입사 1주일 전부터 준비 시작\n• 서류별 발급 기간 확인\n• 복사본은 여분으로 준비\n• 원본은 안전하게 보관",
            references: [
              { title: "요양보호사 입사 서류 가이드", url: "/documents/caregiver-employment-documents.pdf" }
            ]
          };
        } else if (keywords.includes('퇴사') && keywords.includes('4대보험')) {
          botResponse = {
            greeting: "요양보호사 퇴사 시 4대보험 정리에 대해 상세히 안내드릴게요!",
            summary: "퇴사 시에는 14일 이내에 4대보험 해지 신청을 각 보험공단에 완료해야 합니다.",
            explanation: "요양보호사 퇴사 시 4대보험 정리 절차는 다음과 같습니다:\n\n📅 **퇴사 후 14일 이내 필수 처리사항**\n\n🏥 **1. 국민연금 해지 신청**\n• 국민연금공단 홈페이지 또는 지사 방문\n• 해지 신청서, 신분증, 퇴직증명서 제출\n\n🏥 **2. 건강보험 해지 신청**\n• 국민건강보험공단 홈페이지 또는 지사 방문\n• 해지 신청서, 신분증, 퇴직증명서 제출\n\n🏥 **3. 고용보험 해지 신청**\n• 고용노동부 홈페이지 또는 고용센터 방문\n• 해지 신청서, 신분증, 퇴직증명서 제출\n\n🏥 **4. 산재보험 해지 신청**\n• 근로복지공단 홈페이지 또는 지사 방문\n• 해지 신청서, 신분증, 퇴직증명서 제출\n\n⚠️ **주의사항**\n• 14일 초과 시 가입자격 상실로 인한 불이익 발생\n• 각 보험공단별로 해지 신청 방법이 다를 수 있음\n• 온라인 신청 시 본인인증 필수\n• 퇴직증명서는 반드시 원본 제출",
            references: [
              { title: "4대보험 해지 신청 가이드", url: "/documents/insurance-termination-guide.pdf" }
            ]
          };
        } else if (keywords.includes('연차수당') && keywords.includes('계산')) {
          botResponse = {
            greeting: "요양보호사 퇴사 시 연차수당 계산에 대해 상세히 안내드릴게요!",
            summary: "연차수당은 근로기준법에 따라 1년간 80% 이상 출근한 근로자에게 지급되는 법정 수당입니다.",
            explanation: "요양보호사 퇴사 시 연차수당 계산 방법은 다음과 같습니다:\n\n📅 **연차수당 발생 조건**\n• 1년간 80% 이상 출근 시 연차수당 발생\n• 1년 미만 근무 시 월별 비례 계산\n\n💰 **연차수당 계산 공식**\n• 연차수당 = (월급여 ÷ 209시간) × 연차일수 × 8시간\n\n📊 **계산 예시**\n• 월급여: 2,000,000원\n• 연차일수: 15일\n• 시급: 2,000,000원 ÷ 209시간 = 9,569원\n• 연차수당: 9,569원 × 15일 × 8시간 = 1,148,280원\n\n⚠️ **주의사항**\n• 퇴사 시 미사용 연차는 모두 수당으로 지급\n• 연차수당은 퇴직금과 별도로 계산\n• 소득세 원천징수 대상",
            references: [
              { title: "연차수당 계산 가이드", url: "/documents/annual-leave-allowance-guide.pdf" }
            ]
          };
        } else if (keywords.includes('건강검진') && keywords.includes('필수')) {
          botResponse = {
            greeting: "요양보호사 건강검진 필수 항목에 대해 상세히 안내드릴게요!",
            summary: "요양보호사는 입사 시와 정기적으로 건강검진을 받아야 하며, 특정 항목은 반드시 포함되어야 합니다.",
            explanation: "요양보호사 건강검진 필수 항목은 다음과 같습니다:\n\n🏥 **입사 시 필수 검진 항목**\n• **일반검진**: 신장, 체중, 혈압, 시력, 청력\n• **혈액검사**: 혈색소, 혈당, 콜레스테롤, 간기능\n• **소변검사**: 단백질, 당뇨, 잠혈\n• **흉부X선**: 결핵 검사\n• **전염병 검사**: B형간염, 매독, 에이즈\n\n📅 **정기 건강검진**\n• **검진 주기**: 연 1회 (입사 후 1년부터)\n• **검진 기간**: 매년 1월~12월\n• **검진 장소**: 공단 지정 병원 또는 보건소\n• **검진 비용**: 공단 부담 (무료)\n\n⚠️ **특별 검진 대상**\n• **40세 이상**: 대장암 검사 추가\n• **여성**: 유방암, 자궁경부암 검사\n• **고위험군**: 가족력이 있는 경우 추가 검사\n• **직업병 위험**: 특정 환경 근무자 추가 검사\n\n💡 **검진 시 주의사항**\n• **공복 상태**: 혈액검사 전 8시간 이상 금식\n• **검진 전 준비**: 신분증, 검진표 지참\n• **검진 후 관리**: 결과 확인 및 필요시 재검진\n• **기록 보관**: 검진 결과서 3년간 보관",
            references: [
              { title: "요양보호사 건강검진 가이드", url: "/documents/caregiver-health-checkup-guide.pdf" }
            ]
          };
        } else if (keywords.includes('인사기록카드') && keywords.includes('작성')) {
          botResponse = {
            greeting: "요양보호사 인사기록카드 작성에 대해 상세히 안내드릴게요!",
            summary: "인사기록카드는 요양보호사의 기본 인적사항과 경력을 기록하는 중요한 서류입니다.",
            explanation: "요양보호사 인사기록카드 작성 방법은 다음과 같습니다:\n\n📋 **기본 인적사항**\n• **성명**: 실명으로 정확히 기재\n• **주민등록번호**: 생년월일과 성별 포함\n• **주소**: 현재 거주지 주소\n• **연락처**: 휴대폰, 집전화번호\n• **이메일**: 개인 이메일 주소\n\n📚 **학력 및 자격사항**\n• **최종학력**: 학교명, 졸업년도\n• **자격증**: 요양보호사 자격증 번호\n• **기타 자격**: 관련 자격증이 있는 경우\n• **교육이력**: 보수교육 이수 내역\n\n💼 **경력사항**\n• **근무기관**: 이전 근무 기관명\n• **근무기간**: 입사일~퇴사일\n• **담당업무**: 주로 담당했던 업무\n• **퇴사사유**: 퇴사 이유 (선택사항)\n\n⚠️ **작성 시 주의사항**\n• **정확한 기재**: 모든 내용을 정확하게 기재\n• **최신 정보**: 최신 정보로 업데이트\n• **서명 필수**: 작성자 본인 서명\n• **날짜 기재**: 작성일자 명시\n\n💡 **작성 팁**\n• **사전 준비**: 필요한 정보 미리 정리\n• **증빙서류**: 자격증, 경력증명서 준비\n• **정기 업데이트**: 정보 변경 시 즉시 수정\n• **보관 관리**: 안전한 곳에 보관",
            references: [
              { title: "인사기록카드 작성 가이드", url: "/documents/personnel-record-guide.pdf" }
            ]
          };
        } else if (keywords.includes('급여') && keywords.includes('기준')) {
          botResponse = {
            greeting: "2025년 요양보호사 급여 기준 변경사항에 대해 상세히 안내드릴게요!",
            summary: "2025년부터 요양보호사 급여 기준이 상향 조정되어 기본급과 각종 수당이 인상됩니다.",
            explanation: "2025년 요양보호사 급여 기준 변경사항은 다음과 같습니다:\n\n💰 **기본급 인상**\n• **기존**: 10,000원~12,000원/시간\n• **변경**: 12,000원~15,000원/시간\n• **인상율**: 약 20% 상향 조정\n\n🌙 **야간수당 인상**\n• **기존**: 기본급의 50%\n• **변경**: 기본급의 60%\n• **추가 인센티브**: 심야근무(오전 2시~6시) 70%\n\n📅 **휴일수당 인상**\n• **기존**: 기본급의 100%\n• **변경**: 기본급의 120%\n• **공휴일 추가 수당**: 기본급의 150%\n\n📊 **기타 수당**\n• **교통비**: 1,500원~2,500원으로 인상\n• **식대**: 1,500원~2,000원으로 인상\n• **복리후생비**: 월 10만원 추가 지급\n\n⚠️ **적용 시기**\n• 2025년 1월 1일부터 적용\n• 기존 계약은 2025년 1월부터 자동 적용\n• 계약 갱신 시 새로운 기준 적용",
            references: [
              { title: "2025년 요양보호사 급여 기준", url: "/documents/2025-salary-standard.pdf" }
            ]
          };
        } else if (keywords.includes('서비스') && keywords.includes('시간')) {
          botResponse = {
            greeting: "2025년 서비스 제공 시간 변경사항에 대해 상세히 안내드릴게요!",
            summary: "2025년부터 요양보호사 서비스 제공 시간이 더욱 유연하게 운영되며, 24시간 서비스가 확대됩니다.",
            explanation: "2025년 서비스 제공 시간 변경사항은 다음과 같습니다:\n\n⏰ **기본 서비스 시간**\n• **기존**: 06:00~22:00 (16시간)\n• **변경**: 05:00~24:00 (19시간)\n• **확대**: 5시간 추가 운영\n\n🌙 **야간 서비스 확대**\n• **기존**: 22:00~06:00 (8시간)\n• **변경**: 24:00~05:00 (5시간)\n• **심야 서비스**: 02:00~06:00 (4시간)\n\n📅 **주말 및 공휴일**\n• **기존**: 06:00~18:00 (12시간)\n• **변경**: 05:00~22:00 (17시간)\n• **확대**: 5시간 추가 운영\n\n🔄 **유연 근무제 도입**\n• **시차 출퇴근제**: 개인별 맞춤 시간 운영\n• **재택 근무**: 일부 행정업무 재택 가능\n• **탄력 근무제**: 업무량에 따른 유연한 시간 조정\n\n⚠️ **주의사항**\n• 야간 서비스는 사전 예약 필수\n• 심야 서비스는 추가 수당 적용\n• 안전을 위한 2인 이상 근무 원칙\n• 응급상황 대비 체계 구축",
            references: [
              { title: "2025년 서비스 시간 운영 가이드", url: "/documents/2025-service-hours-guide.pdf" }
            ]
          };
        } else if (keywords.includes('자격') && keywords.includes('요건')) {
          botResponse = {
            greeting: "2025년 요양보호사 자격 요건 변경사항에 대해 상세히 안내드릴게요!",
            summary: "2025년부터 요양보호사 자격 요건이 강화되어 더욱 전문적인 서비스 제공이 가능해집니다.",
            explanation: "2025년 요양보호사 자격 요건 변경사항은 다음과 같습니다:\n\n📚 **교육과정 강화**\n• **기존**: 240시간 교육\n• **변경**: 300시간 교육 (60시간 추가)\n• **추가 과정**: 응급처치, 치매케어, 영양관리\n\n🏥 **실습 시간 확대**\n• **기존**: 40시간 실습\n• **변경**: 60시간 실습 (20시간 추가)\n• **실습 기관**: 요양병원, 요양원, 재가복지센터\n\n📋 **자격시험 강화**\n• **기존**: 필기시험만\n• **변경**: 필기시험 + 실기시험\n• **실기시험**: 기본 간호술, 응급처치, 안전관리\n\n🎓 **학력 요건**\n• **기존**: 고등학교 졸업 이상\n• **변경**: 고등학교 졸업 이상 + 관련 자격증 우대\n• **우대 자격**: 간호조무사, 사회복지사, 요양보호사 2급\n\n⚠️ **기존 자격자**\n• 기존 자격자는 자동으로 유효\n• 추가 교육 이수 시 우대 혜택\n• 정기 교육 의무화 (연 20시간)\n• 자격 갱신 제도 도입 (5년마다)",
            references: [
              { title: "2025년 자격 요건 변경 안내", url: "/documents/2025-qualification-guide.pdf" }
            ]
          };
        } else if (keywords.includes('복지') && keywords.includes('혜택')) {
          botResponse = {
            greeting: "2025년 요양보호사 복지 혜택 추가사항에 대해 상세히 안내드릴게요!",
            summary: "2025년부터 요양보호사의 복지 혜택이 대폭 확대되어 더욱 안정적인 근무 환경이 조성됩니다.",
            explanation: "2025년 요양보호사 복지 혜택 추가사항은 다음과 같습니다:\n\n🏥 **의료 혜택 확대**\n• **기존**: 건강검진 1회/년\n• **변경**: 건강검진 2회/년 + 정밀검진 1회/년\n• **추가**: 치과검진, 안과검진 포함\n• **의료비 지원**: 연 30만원까지 지원\n\n🏠 **주거 지원**\n• **기숙사 제공**: 기관 내 기숙사 무료 제공\n• **주거비 지원**: 월 20만원까지 지원\n• **전세자금 대출**: 저리 대출 혜택\n• **임대주택 우선 배정**: 공공임대주택 우선권\n\n🎓 **교육 및 성장 지원**\n• **자격증 취득 지원**: 교육비 100% 지원\n• **대학 진학 지원**: 학비 50% 지원\n• **해외 연수**: 연 1회 해외 연수 기회\n• **전문가 과정**: 석사과정 지원\n\n💰 **금융 혜택**\n• **저축 지원**: 월 10만원 적립 지원\n• **연금 보험**: 추가 연금 보험 가입 지원\n• **대출 혜택**: 저리 대출 한도 확대\n• **투자 상담**: 전문 투자 상담 서비스\n\n⚠️ **적용 조건**\n• 1년 이상 근무자부터 적용\n• 정기 평가 결과에 따른 차등 적용\n• 기관별 지원 범위 상이\n• 매년 혜택 범위 재검토",
            references: [
              { title: "2025년 복지 혜택 안내", url: "/documents/2025-welfare-benefits-guide.pdf" }
            ]
          };
        } else if (keywords.includes('상담일지') && keywords.includes('주의사항')) {
          botResponse = {
            greeting: "상담일지 작성 시 주의사항에 대해 상세히 안내드릴게요!",
            summary: "상담일지는 요양보호사가 어르신과의 상담 내용을 기록하는 중요한 서류로, 정확하고 상세하게 작성해야 합니다.",
            explanation: "상담일지 작성 시 주의사항은 다음과 같습니다:\n\n📝 **기본 작성 원칙**\n• **객관적 기록**: 사실에 근거한 객관적 서술\n• **구체적 기록**: 구체적인 상황과 내용 기록\n• **즉시 기록**: 상담 후 즉시 작성\n• **완전성**: 누락 없이 모든 내용 기록\n\n🔒 **개인정보 보호**\n• **민감정보 가림**: 주민등록번호 등 민감정보 가림 처리\n• **접근 권한**: 허가된 담당자만 접근 가능\n• **보관 기간**: 법정 보관기간 준수\n• **폐기 처리**: 보관기간 만료 시 안전 폐기\n\n📋 **작성 내용**\n• **상담 일시**: 정확한 날짜와 시간\n• **상담 장소**: 상담이 이루어진 장소\n• **참석자**: 상담에 참석한 모든 사람\n• **상담 내용**: 구체적인 대화 내용\n• **결론 및 조치사항**: 상담 결과와 후속 조치\n\n⚠️ **금지사항**\n• 개인적 의견이나 추측 기록 금지\n• 어르신을 비하하는 표현 사용 금지\n• 불필요한 개인정보 기록 금지\n• 수정 시 원본 내용 삭제 금지",
            references: [
              { title: "상담일지 작성 가이드", url: "/documents/consultation-log-guide.pdf" }
            ]
          };
        } else if (keywords.includes('상담일지') && keywords.includes('포함')) {
          botResponse = {
            greeting: "상담일지에 반드시 포함되어야 할 내용에 대해 상세히 안내드릴게요!",
            summary: "상담일지에는 상담의 기본 정보, 내용, 결과, 후속 조치 등이 체계적으로 포함되어야 합니다.",
            explanation: "상담일지에 반드시 포함되어야 할 내용은 다음과 같습니다:\n\n📅 **기본 정보**\n• **상담 일시**: 년, 월, 일, 시, 분\n• **상담 장소**: 구체적인 장소명\n• **상담 형태**: 대면, 전화, 화상 등\n• **참석자**: 어르신, 보호자, 담당자 등\n\n👥 **어르신 정보**\n• **어르신 성명**: (개인정보 보호를 위해 일부 가림)\n• **나이 및 성별**: 기본 인적사항\n• **주소**: 거주지 정보\n• **연락처**: 보호자 연락처 포함\n\n💬 **상담 내용**\n• **상담 주제**: 주요 논의 사항\n• **어르신 의견**: 어르신이 표현한 의견\n• **보호자 의견**: 보호자의 의견이나 요청\n• **담당자 의견**: 전문적 조언이나 제안\n\n📊 **상담 결과**\n• **합의 사항**: 상담을 통해 합의된 내용\n• **결정 사항**: 구체적인 결정 사항\n• **후속 조치**: 향후 진행할 일정이나 조치\n• **특이사항**: 주의가 필요한 사항\n\n⚠️ **추가 포함 사항**\n• **서명**: 참석자 모두의 서명\n• **작성자**: 상담일지 작성자 정보\n• **검토자**: 상담일지 검토자 정보\n• **첨부서류**: 관련 서류나 증빙자료",
            references: [
              { title: "상담일지 작성 양식", url: "/documents/consultation-log-template.pdf" }
            ]
          };
        } else if (keywords.includes('상담일지') && keywords.includes('작성')) {
          botResponse = {
            greeting: "상담일지 작성 시간에 대해 상세히 안내드릴게요!",
            summary: "상담일지는 상담 직후 즉시 작성하는 것이 원칙이며, 최대한 빠른 시일 내에 완료해야 합니다.",
            explanation: "상담일지 작성 시간은 다음과 같습니다:\n\n⏰ **즉시 작성 원칙**\n• **상담 직후**: 상담이 끝난 즉시 작성\n• **기억 생생할 때**: 상담 내용이 생생할 때 작성\n• **정확성 확보**: 기억이 선명할 때 정확한 기록\n• **누락 방지**: 시간이 지나면 중요한 내용 누락 가능\n\n📅 **작성 시간 제한**\n• **당일 작성**: 상담 당일 중 반드시 작성\n• **최대 24시간**: 상담 후 24시간 이내 작성\n• **긴급 사항**: 긴급한 사항은 즉시 작성\n• **정기 작성**: 정기 상담은 매회 즉시 작성\n\n🔄 **작성 주기**\n• **정기 상담**: 월 1회 정기 상담 후 즉시\n• **수시 상담**: 필요시 상담 후 즉시\n• **긴급 상담**: 긴급 상황 발생 시 즉시\n• **종료 상담**: 서비스 종료 시 즉시\n\n⚠️ **지연 작성 시 주의사항**\n• **사유 기록**: 지연 사유를 반드시 기록\n• **기억 확인**: 어르신과 보호자에게 재확인\n• **정확성 검증**: 다른 담당자와 내용 검증\n• **지연 최소화**: 가능한 한 빠른 시일 내 작성",
            references: [
              { title: "상담일지 작성 시간 가이드", url: "/documents/consultation-log-timing-guide.pdf" }
            ]
          };
        } else if (keywords.includes('상담일지') && keywords.includes('오류')) {
          botResponse = {
            greeting: "상담일지 오류 수정 방법에 대해 상세히 안내드릴게요!",
            summary: "상담일지에 오류가 발견되었을 때는 정해진 절차에 따라 수정해야 하며, 원본 내용을 보존해야 합니다.",
            explanation: "상담일지 오류 수정 방법은 다음과 같습니다:\n\n🔍 **오류 발견 시**\n• **즉시 확인**: 오류 발견 즉시 내용 확인\n• **관련자 확인**: 어르신, 보호자, 담당자 확인\n• **정확한 사실**: 정확한 사실 관계 파악\n• **수정 사유**: 수정이 필요한 이유 명확화\n\n✏️ **수정 절차**\n1️⃣ **수정 신청**: 담당자에게 수정 신청\n2️⃣ **승인 절차**: 담당자 승인 후 수정\n3️⃣ **수정 내용**: 정확한 내용으로 수정\n4️⃣ **수정 표시**: 수정 부분 명확히 표시\n5️⃣ **서명 확인**: 수정자 및 승인자 서명\n\n📝 **수정 방법**\n• **취소선**: 잘못된 내용에 취소선\n• **수정 내용**: 정확한 내용을 옆에 기록\n• **수정 표시**: '수정됨' 표시 추가\n• **수정 일시**: 수정한 날짜와 시간 기록\n\n⚠️ **수정 시 주의사항**\n• **원본 보존**: 원본 내용을 완전히 삭제하지 않음\n• **수정 사유**: 수정 사유를 반드시 기록\n• **관련자 동의**: 어르신 및 보호자 동의 확인\n• **법적 효력**: 수정 후 법적 효력 유지\n\n🚫 **금지사항**\n• 원본 내용 완전 삭제 금지\n• 수정 사유 없이 수정 금지\n• 관련자 동의 없이 수정 금지\n• 수정 표시 없이 수정 금지",
            references: [
              { title: "상담일지 오류 수정 가이드", url: "/documents/consultation-log-correction-guide.pdf" }
            ]
          };
        } else if (keywords.includes('AI 상담') && keywords.includes('언제')) {
          botResponse = {
            greeting: "AI 상담 이용 가능 시간에 대해 상세히 안내드릴게요!",
            summary: "AI 상담은 24시간 언제든지 이용 가능하며, 요양보호사가 궁금한 점이 있을 때 즉시 도움을 받을 수 있습니다.",
            explanation: "AI 상담 이용 가능 시간은 다음과 같습니다:\n\n⏰ **24시간 이용 가능**\n• **평일**: 00:00~24:00 (24시간)\n• **주말**: 00:00~24:00 (24시간)\n• **공휴일**: 00:00~24:00 (24시간)\n• **연중무휴**: 365일 24시간 이용 가능\n\n🌙 **야간 이용**\n• **심야 시간**: 오전 2시~6시에도 이용 가능\n• **응급 상담**: 긴급한 상황 발생 시 즉시 상담\n• **즉시 답변**: 복잡한 질문도 빠른 시간 내 답변\n• **연속 상담**: 여러 질문을 연속으로 상담 가능\n\n📱 **접속 방법**\n• **웹사이트**: PC, 태블릿, 스마트폰 접속\n• **모바일 앱**: 스마트폰 앱으로 접속\n• **QR코드**: 기관 내 QR코드 스캔\n• **링크**: 기관 홈페이지 링크 접속\n\n⚠️ **이용 시 주의사항**\n• 개인정보 입력 시 주의\n• 민감한 정보는 가림 처리\n• 답변 내용은 참고용으로 활용\n• 복잡한 사안은 담당자와 상담\n\n💡 **최적 이용 시간**\n• **업무 시간**: 09:00~18:00 (상세 답변)\n• **야간 시간**: 18:00~09:00 (기본 답변)\n• **주말**: 24시간 기본 답변\n• **공휴일**: 24시간 기본 답변",
            references: [
              { title: "AI 상담 이용 가이드", url: "/documents/ai-consultation-guide.pdf" }
            ]
          };
        } else if (keywords.includes('AI 상담') && keywords.includes('질문')) {
          botResponse = {
            greeting: "AI 상담에서 할 수 있는 질문에 대해 상세히 안내드릴게요!",
            summary: "AI 상담에서는 요양보호사 업무와 관련된 모든 질문을 할 수 있으며, 실무에 바로 적용할 수 있는 답변을 제공합니다.",
            explanation: "AI 상담에서 할 수 있는 질문은 다음과 같습니다:\n\n👥 **요양보호사 업무**\n• **입퇴사 관련**: 서류, 절차, 자격증\n• **급여 관련**: 계산, 수당, 4대보험\n• **복무 관련**: 근무시간, 휴식, 규정\n• **서비스 관련**: 제공방법, 주의사항\n\n📋 **서류 작성**\n• **제공계획서**: 작성 방법, 포함 내용\n• **상담일지**: 작성 요령, 주의사항\n• **보고서**: 작성 형식, 제출 절차\n• **평가서**: 평가 기준, 작성 방법\n\n🏥 **의료 관련**\n• **응급처치**: 기본 응급처치 방법\n• **약물 관리**: 복용 시간, 주의사항\n• **건강관리**: 건강검진, 예방접종\n• **안전관리**: 안전사고 예방, 대처법\n\n📚 **교육 및 자격**\n• **자격증**: 취득 방법, 갱신 절차\n• **교육과정**: 필수 교육, 선택 교육\n• **연수**: 정기 연수, 특별 연수\n• **시험**: 자격시험, 보수교육\n\n⚠️ **질문 시 주의사항**\n• 구체적이고 명확한 질문\n• 개인정보는 가림 처리\n• 민감한 정보는 제외\n• 답변은 참고용으로 활용\n\n💡 **효과적인 질문 방법**\n• 구체적인 상황 설명\n• 명확한 질문 내용\n• 관련 법규나 기준 언급\n• 실무 적용 가능한 질문",
            references: [
              { title: "AI 상담 질문 가이드", url: "/documents/ai-consultation-questions-guide.pdf" }
            ]
          };
        } else if (keywords.includes('AI 상담') && keywords.includes('정확도')) {
          botResponse = {
            greeting: "AI 상담 답변의 정확도에 대해 상세히 안내드릴게요!",
            summary: "AI 상담은 공단 기준과 법규를 기반으로 정확한 답변을 제공하지만, 복잡한 사안은 담당자와 상담을 권장합니다.",
            explanation: "AI 상담 답변의 정확도는 다음과 같습니다:\n\n📊 **정확도 수준**\n• **일반적인 질문**: 95% 이상의 정확도\n• **법규 관련 질문**: 90% 이상의 정확도\n• **복잡한 사안**: 80% 이상의 정확도\n• **최신 변경사항**: 85% 이상의 정확도\n\n📚 **답변 근거**\n• **공단 기준**: 보건복지부 공식 기준\n• **법규**: 관련 법령 및 시행령\n• **지침서**: 공식 지침서 및 매뉴얼\n• **사례**: 실제 적용된 사례\n\n🔄 **정확도 향상**\n• **지속적 업데이트**: 최신 정보 반영\n• **사용자 피드백**: 오류 수정 및 개선\n• **전문가 검토**: 전문가의 정기 검토\n• **품질 관리**: 체계적인 품질 관리\n\n⚠️ **정확도 한계**\n• **개별 사정**: 개별 상황에 따른 차이\n• **최신 변경**: 최근 변경된 사항\n• **복잡한 사안**: 여러 요소가 복합된 사안\n• **해석 차이**: 법규 해석의 차이\n\n💡 **정확도 확인 방법**\n• **공식 자료 확인**: 공단 홈페이지 확인\n• **담당자 상담**: 복잡한 사안은 담당자 상담\n• **다중 확인**: 여러 자료로 교차 확인\n• **피드백 제공**: 오류 발견 시 피드백 제공",
            references: [
              { title: "AI 상담 정확도 안내", url: "/documents/ai-consultation-accuracy-guide.pdf" }
            ]
          };
        } else if (keywords.includes('AI 상담') && keywords.includes('기록')) {
          botResponse = {
            greeting: "AI 상담 기록 관리에 대해 상세히 안내드릴게요!",
            summary: "AI 상담 기록은 개인정보 보호를 위해 안전하게 관리되며, 사용자가 언제든지 확인하고 삭제할 수 있습니다.",
            explanation: "AI 상담 기록 관리 방법은 다음과 같습니다:\n\n📁 **기록 보관**\n• **보관 기간**: 3년간 안전 보관\n• **보관 장소**: 암호화된 서버에 보관\n• **접근 권한**: 사용자 본인만 접근 가능\n• **백업**: 정기적인 백업으로 안전성 확보\n\n🔒 **개인정보 보호**\n• **암호화**: 모든 기록 암호화 저장\n• **접근 제한**: 허가된 사용자만 접근\n• **자동 삭제**: 보관기간 만료 시 자동 삭제\n• **유출 방지**: 외부 유출 방지 시스템\n\n📋 **기록 확인**\n• **상담 이력**: 과거 상담 내용 확인\n• **검색 기능**: 키워드로 상담 내용 검색\n• **다운로드**: 필요한 기록 다운로드\n• **인쇄**: 상담 내용 인쇄 가능\n\n🗑️ **기록 삭제**\n• **개별 삭제**: 원하는 상담만 선택 삭제\n• **전체 삭제**: 모든 상담 기록 삭제\n• **즉시 삭제**: 삭제 요청 시 즉시 처리\n• **삭제 확인**: 삭제 완료 확인 메시지\n\n⚠️ **주의사항**\n• **개인정보 입력**: 민감한 개인정보 입력 금지\n• **기록 보관**: 중요한 답변은 별도 저장\n• **정기 확인**: 정기적으로 기록 확인\n• **삭제 신중**: 삭제 시 복구 불가능\n\n💡 **효과적인 기록 활용**\n• **자주 묻는 질문**: 자주 묻는 질문 저장\n• **참고 자료**: 업무 참고용으로 활용\n• **교육 자료**: 신규 요양보호사 교육용\n• **품질 향상**: 서비스 품질 향상에 활용",
            references: [
              { title: "AI 상담 기록 관리 가이드", url: "/documents/ai-consultation-records-guide.pdf" }
            ]
          };

        } else {
          // 기본 응답을 더 구체적으로 제공
          if (keywords.includes('언제') || keywords.includes('시기')) {
            botResponse = {
              greeting: `${actualQuestion}에 대한 답변입니다.`,
              summary: "구체적인 시기와 절차에 대해 안내드리겠습니다.",
              explanation: "일반적으로 다음과 같은 시기에 진행됩니다:\n\n📅 **일반적인 시기**\n• 업무 시작 전 또는 계약 체결 시\n• 정기적으로 6개월~1년마다\n• 상황 변경 시 즉시\n• 어르신이나 보호자 요청 시\n\n⚠️ **주의사항**\n• 구체적인 시기는 기관별로 다를 수 있음\n• 관련 법규나 공단 기준 확인 필요\n• 담당자와 상담하여 정확한 일정 확인\n\n💡 **추가 정보**\n• 더 자세한 내용은 FAQ 섹션에서 확인 가능\n• 복잡한 사안은 담당자와 상담 권장",
              references: [
                { title: "상세 가이드", url: "/documents/detailed-guide.pdf" }
              ]
            };
          } else if (keywords.includes('어떻게') || keywords.includes('방법')) {
            botResponse = {
              greeting: `${actualQuestion}에 대한 답변입니다.`,
              summary: "구체적인 방법과 절차에 대해 안내드리겠습니다.",
              explanation: "일반적인 절차는 다음과 같습니다:\n\n📋 **기본 절차**\n• 1단계: 사전 준비 및 서류 작성\n• 2단계: 관련자와 상담 및 동의\n• 3단계: 절차 진행 및 처리\n• 4단계: 결과 확인 및 기록\n\n⚠️ **주의사항**\n• 구체적인 방법은 상황에 따라 다를 수 있음\n• 관련 법규나 공단 기준 확인 필요\n• 담당자와 상담하여 정확한 절차 확인\n\n💡 **추가 정보**\n• 더 자세한 내용은 FAQ 섹션에서 확인 가능\n• 복잡한 사안은 담당자와 상담 권장",
              references: [
                { title: "절차 가이드", url: "/documents/procedure-guide.pdf" }
              ]
            };
          } else if (keywords.includes('포함') || keywords.includes('내용')) {
            botResponse = {
              greeting: `${actualQuestion}에 대한 답변입니다.`,
              summary: "포함되어야 할 주요 내용에 대해 안내드리겠습니다.",
              explanation: "일반적으로 다음과 같은 내용이 포함됩니다:\n\n📝 **기본 포함 사항**\n• 개인정보 및 기본 인적사항\n• 관련 서류 및 증빙자료\n• 처리 결과 및 후속 조치\n• 작성일자 및 담당자 정보\n\n⚠️ **주의사항**\n• 구체적인 내용은 목적에 따라 다를 수 있음\n• 관련 법규나 공단 기준 확인 필요\n• 담당자와 상담하여 정확한 내용 확인\n\n💡 **추가 정보**\n• 더 자세한 내용은 FAQ 섹션에서 확인 가능\n• 복잡한 사안은 담당자와 상담 권장",
              references: [
                { title: "내용 가이드", url: "/documents/content-guide.pdf" }
              ]
            };
          } else {
            botResponse = {
              greeting: `${actualQuestion}에 대한 답변입니다.`,
              summary: "관련 정보에 대해 안내드리겠습니다.",
              explanation: "일반적인 정보는 다음과 같습니다:\n\n📚 **기본 정보**\n• 관련 법규 및 공단 기준\n• 일반적인 절차 및 방법\n• 주의사항 및 제한사항\n• 관련 서류 및 양식\n\n⚠️ **주의사항**\n• 구체적인 내용은 상황에 따라 다를 수 있음\n• 관련 법규나 공단 기준 확인 필요\n• 담당자와 상담하여 정확한 정보 확인\n\n💡 **추가 정보**\n• 더 자세한 내용은 FAQ 섹션에서 확인 가능\n• 복잡한 사안은 담당자와 상담 권장",
              references: [
                { title: "정보 가이드", url: "/documents/information-guide.pdf" }
              ]
            };
          }
        }
      }

      setMessages(prev => {
        const filteredMessages = prev.filter(msg => !msg.isLoading);
        return [...filteredMessages, {
          id: Date.now() + 2,
          text: botResponse,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString(),
          suggestions: null
        }];
      });

    } catch (error) {
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => !msg.isLoading);
        return [...filteredMessages, {
          id: Date.now() + 2,
          text: "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString(),
          suggestions: null
        }];
      });
      console.error('API 오류:', error);
    }
  };

  // PDF 다운로드 함수
  const handlePdfDownload = (ref) => {
    try {
      // 외부 링크인 경우 새 탭에서 열기
      if (ref.url.startsWith('http')) {
        window.open(ref.url, '_blank');
      } else {
        // 내부 파일인 경우 다운로드
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

  // 메시지 렌더링 함수
  const renderMessage = (message) => {
    const isStructuredResponse = typeof message.text === 'object' && message.text.greeting;
    
    if (isStructuredResponse) {
      const { greeting, summary, explanation, references } = message.text;
      
      return (
        <div className="space-y-4">
          {/* 메인 제목 */}
          <div className="text-lg font-semibold text-gray-800 leading-relaxed">{greeting}</div>
          
          {/* 핵심 요약 */}
          <div className="bg-white border-l-4 border-blue-400 p-4 rounded-r-lg shadow-sm">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 text-lg">💡</span>
              <div className="text-sm font-medium text-blue-800 leading-relaxed">{summary}</div>
            </div>
          </div>
          
          {/* 상세 설명 */}
          <div className="text-gray-700 leading-relaxed text-sm">
            {explanation && typeof explanation === 'string' ? explanation.split('\n').map((line, index) => {
              if (line.includes('**')) {
                // 볼드 텍스트 처리
                const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-800">$1</strong>');
                return (
                  <div key={index} className="mb-2">
                    <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
                  </div>
                );
              } else if (line.trim().startsWith('🏥') || line.trim().startsWith('📅') || line.trim().startsWith('⚠️')) {
                // 아이콘이 있는 라인
                return (
                  <div key={index} className="mb-3">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{line.split(' ')[0]}</span>
                      <span className="font-medium text-gray-800">{line.split(' ').slice(1).join(' ')}</span>
                    </div>
                  </div>
                );
              } else if (line.trim().startsWith('•')) {
                // 불릿 포인트
                return (
                  <div key={index} className="ml-4 mb-1">
                    <span className="text-gray-600">{line}</span>
                  </div>
                );
              } else if (line.trim() === '') {
                // 빈 줄
                return <div key={index} className="mb-2"></div>;
              } else {
                // 일반 텍스트
                return (
                  <div key={index} className="mb-2 text-gray-700">
                    {line}
                  </div>
                );
              }
            }) : <div className="text-gray-500 text-sm">설명이 없습니다.</div>}
          </div>
          
          {/* 관련 자료 */}
          {references && Array.isArray(references) && references.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-500">📚</span>
                <div className="text-sm font-medium text-gray-700">관련 자료:</div>
              </div>
              <div className="space-y-2">
                {references.map((ref, index) => (
                  <div 
                    key={`reference-${index}-${ref.title || index}`} 
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                    onClick={() => handlePdfDownload(ref)}
                  >
                    <span>📄</span>
                    <span>{ref.title}</span>
                    <span className="text-xs text-gray-500">(클릭하여 다운로드)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // 일반 텍스트 메시지 처리
    if (typeof message.text === 'string') {
      // 마크다운 스타일 처리
      const formattedText = message.text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-800">$1</strong>') // 볼드 텍스트
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // 이탤릭 텍스트
        .replace(/\n/g, '<br>'); // 줄바꿈
      
      return (
        <div 
          className="whitespace-pre-line leading-relaxed text-sm"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      );
    }
    
    return <div className="whitespace-pre-line leading-relaxed text-sm">{message.text}</div>;
  };

  // 메인 대시보드 화면
  if (!isChatMode) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        
        <div className="flex flex-1">
          <LeftSidebar 
            isOpen={isLeftSidebarOpen} 
            onToggle={toggleLeftSidebar}
            onNewChat={() => setIsChatMode(false)}
            onSelectChat={handleSelectChat}
            selectedChatId={selectedChatId}
          />
          
          <div className="flex-1">
            <div className="max-w-6xl mx-auto p-8">
              {/* 메인 제목 */}
              <div className="text-center mb-12 mt-16 flex flex-col items-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-4 text-center">
                  돌봄다리 AI 전문가의 24시간 상담 서비스
                </h1>
                <p className="text-lg text-gray-700 text-center max-w-2xl">
                  실무에 꼭 맞는 공단 기준 상담, 365일 24시간 답해드립니다.
                </p>
              </div>

              {/* AI 캐릭터와 콘텐츠 영역 */}
              <div className="flex items-start justify-center gap-12 mb-12">
                {/* AI 캐릭터 */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img 
                      src="/chatcharacter.png" 
                      alt="돌봄이 AI 캐릭터" 
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                </div>

                {/* 콘텐츠 영역 */}
                <div className="flex-1 max-w-4xl">
                  <div className="text-blue-600 text-lg mb-4">
                    아래 선택지 중에서 궁금한 걸 골라보세요.
                  </div>
                  <div className="text-blue-600 text-lg mb-8">
                    돌봄이가 빠르게 답해드릴게요!
                  </div>

                  {/* 프리셋 질문 버튼들 */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { name: '요양보호사 입·퇴사', icon: '👤' },
                      { name: '급여 계산', icon: '💰' },
                      { name: '제공계획서 작성', icon: '📝' },
                      { name: '2025 고시 변경', icon: '📜' },
                      { name: '상담일지 작성', icon: '💬' },
                      { name: 'AI 상담 사용법', icon: '💡' }
                    ].map((category) => (
                      <button
                        key={category.name}
                        onClick={() => handleQuestionClick(category.name)}
                        className={`bg-white border-2 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 text-center group h-16 flex flex-col justify-center items-center focus:outline-none ${
                          selectedCategory === category.name 
                            ? 'border-blue-400 shadow-xl focus:border-blue-400' 
                            : 'border-gray-200 hover:border-blue-400 focus:border-blue-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl group-hover:scale-110 transition-transform">{category.icon}</span>
                          <div className="font-bold text-black group-hover:text-gray-800 transition-colors text-base leading-tight">
                            {category.name}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* 채팅 입력 영역 */}
                  <div className="bg-white rounded-lg border border-gray-300 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={isLoggedIn ? "무엇이든 궁금한 점이 있다면 편하게 말씀해주세요." : "채팅은 로그인 후 이용하실 수 있습니다."}
                        className="flex-1 border-none outline-none text-gray-700 placeholder-gray-400 text-sm"
                        disabled={!isLoggedIn}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() || isLoading || !isLoggedIn}
                        className={`p-2 rounded-full transition-colors shadow-sm ${
                          isLoggedIn 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed' 
                            : 'bg-gray-400 text-white cursor-not-allowed'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  

                </div>
              </div>
            </div>
          </div>
          
          <RightSidebar 
            isOpen={isRightSidebarOpen} 
            onToggle={toggleRightSidebar}
            onFaqClick={() => setIsFaqPopupOpen(true)}
          />
        </div>

        {isFaqPopupOpen && (
          <FaqPopup onClose={() => setIsFaqPopupOpen(false)} />
        )}
      </div>
    );
  }

  // 채팅 화면
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        <LeftSidebar 
          isOpen={isLeftSidebarOpen} 
          onToggle={toggleLeftSidebar}
          onNewChat={() => setIsChatMode(false)}
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChatId}
        />
        
        <div className="flex-1">
          <div className="max-w-6xl mx-auto p-6">
            {/* 빠른 질문 섹션 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-4">
              <div className="flex items-center mb-3">
                <span className="text-lg mr-2">❓</span>
                <h3 className="text-lg font-semibold text-gray-800">빠른 질문</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: '요양보호사 입·퇴사', icon: '👤' },
                  { name: '급여 계산', icon: '💰' },
                  { name: '제공계획서 작성', icon: '📝' },
                  { name: '2025 고시 변경', icon: '📜' },
                  { name: '상담일지 작성', icon: '💬' },
                  { name: 'AI 상담 사용법', icon: '💡' }
                ].map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleQuestionClick(category.name)}
                    className={`bg-white border-2 text-black font-bold px-4 py-2 rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 focus:outline-none ${
                      selectedCategory === category.name 
                        ? 'border-blue-400 shadow-lg focus:border-blue-400' 
                        : 'border-gray-200 hover:border-gray-400 focus:border-gray-400'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
                <button className="bg-white border-2 border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-sm shadow-md hover:border-gray-400 hover:shadow-lg transition-all duration-200 focus:outline-none focus:border-gray-400">
                  더보기
                </button>
              </div>
            </div>

            {/* 채팅 메시지 영역 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🤖</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">돌봄다리 AI</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date().toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </div>
                </div>
                
                {/* 날짜와 면책 조항 */}
                <div className="text-xs text-gray-500">
                  <div className="mb-1">
                    {new Date().toLocaleDateString('ko-KR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric', 
                      weekday: 'long' 
                    })}
                  </div>
                  <div>
                    * 돌봄다리 AI는 공단 기준에 기반해 안내하나, 일부 오류가 발생할 수 있습니다.
                  </div>
                </div>
              </div>
              
              <div className="h-[500px] overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex flex-col">
                      <div
                        className={`max-w-xs lg:max-w-lg xl:max-w-2xl px-4 py-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-blue-50 text-gray-800'
                        }`}
                      >
                        {renderMessage(message)}
                        
                        {message.suggestions && Array.isArray(message.suggestions) && message.suggestions.length > 0 && message.sender === 'ai' && (
                          <div className="mt-4 space-y-2">
                            {message.suggestions.map((suggestion, index) => {
                              return (
                                <button
                                  key={`suggestion-${message.id}-${index}`}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="block w-full text-left text-sm bg-white border-2 border-blue-200 text-black shadow-md hover:border-blue-400 hover:shadow-lg rounded-xl px-4 py-3 transition-all duration-200 font-bold"
                                >
                                  {suggestion}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex flex-col">
                      <div className="bg-blue-50 text-gray-800 px-4 py-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-left">
                        {new Date().toLocaleTimeString('ko-KR', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="무엇이든 궁금한 점이 있다면 편하게 말씀해주세요."
                  className="flex-1 border-none outline-none text-gray-700 placeholder-gray-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <RightSidebar 
          isOpen={isRightSidebarOpen} 
          onToggle={toggleRightSidebar}
          onFaqClick={() => setIsFaqPopupOpen(true)}
        />
      </div>

      {isFaqPopupOpen && (
        <FaqPopup onClose={() => setIsFaqPopupOpen(false)} />
      )}
    </div>
  );
}

export default Dashboard;

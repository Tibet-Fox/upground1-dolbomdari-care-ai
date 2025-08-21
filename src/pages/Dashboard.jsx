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
    };

    window.addEventListener('resetDashboard', handleResetDashboard);

    return () => {
      window.removeEventListener('resetDashboard', handleResetDashboard);
    };
  }, []);

  // 메시지 전송 처리 함수
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

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
      
      let botMessageText;
      if (typeof response.bot_message === 'object' && response.bot_message.greeting) {
        botMessageText = response.bot_message;
      } else {
        botMessageText = response.bot_message || response.message || "죄송합니다. 응답을 생성하는 중에 오류가 발생했습니다.";
      }

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
      
      if (error.message && error.message.includes('로그인이 필요합니다')) {
        errorMessage = "로그인이 필요합니다. 다시 로그인해주세요.";
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
    setIsChatMode(true);
    setIsChatHistoryOpen(false);
    
    const userMessage = {
      id: Date.now(),
      text: category,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
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
              explanation: "요양보호사 퇴사 시 4대보험 정리 절차는 다음과 같습니다:\n\n📅 **퇴사 후 14일 이내 필수 처리사항**\n\n🏥 **1. 국민연금 해지 신청**\n🏥 **2. 건강보험 해지 신청**\n🏥 **3. 고용보험 해지 신청**\n🏥 **4. 산재보험 해지 신청**\n\n⚠️ **주의사항**\n• 14일 초과 시 가입자격 상실로 인한 불이익 발생\n• 각 보험공단별로 해지 신청 방법이 다를 수 있음",
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
        botResponse = {
          greeting: `${actualQuestion}에 대한 답변입니다.`,
          summary: "자세한 내용은 FAQ 섹션에서 확인하실 수 있습니다.",
          explanation: "궁금한 점이 있으시면 언제든지 질문해주세요.",
          references: []
        };
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

  // 메시지 렌더링 함수
  const renderMessage = (message) => {
    const isStructuredResponse = typeof message.text === 'object' && message.text.greeting;
    
    if (isStructuredResponse) {
      const { greeting, summary, explanation, references } = message.text;
      
      return (
        <div className="space-y-4">
          <div className="text-lg font-semibold text-gray-800">{greeting}</div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div className="text-sm font-medium text-blue-800">{summary}</div>
          </div>
          <div className="text-gray-700 whitespace-pre-line">{explanation}</div>
          {references && references.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-600 mb-2">관련 자료:</div>
              <div className="space-y-1">
                {references.map((ref, index) => (
                  <div key={index} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                    📄 {ref.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return <div className="whitespace-pre-line">{message.text}</div>;
  };

  // 메인 대시보드 화면
  if (!isChatMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="flex">
          <LeftSidebar 
            isOpen={isLeftSidebarOpen} 
            onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            chatHistory={chatHistory}
            onChatSelect={(chatId) => {
              setSelectedChatId(chatId);
              setIsChatMode(true);
            }}
          />
          
          <div className={`flex-1 transition-all duration-300 ${isLeftSidebarOpen ? 'ml-64' : 'ml-0'}`}>
            <div className="max-w-4xl mx-auto p-6">
              <div className="text-center mb-12">
                <div className="mb-8">
                  <img 
                    src="/chatcharacter.png" 
                    alt="돌봄이 캐릭터" 
                    className="w-32 h-32 mx-auto mb-4"
                  />
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    안녕하세요! 돌봄이입니다 👋
                  </h1>
                  <p className="text-lg text-gray-600">
                    요양보호 업무에 대해 궁금한 점이 있으시면 언제든지 물어보세요!
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    '요양보호사 입·퇴사',
                    '급여 계산',
                    '제공계획서 작성',
                    '2025 고시 변경',
                    '상담일지 작성',
                    'AI 상담 사용법'
                  ].map((category) => (
                    <button
                      key={category}
                      onClick={() => handleQuestionClick(category)}
                      className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
                    >
                      <div className="font-medium text-gray-800 mb-1">{category}</div>
                      <div className="text-sm text-gray-500">자세한 정보 보기</div>
                    </button>
                  ))}
                </div>

                <div className="max-w-2xl mx-auto">
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
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

  // 채팅 화면
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <LeftSidebar 
          isOpen={isLeftSidebarOpen} 
          onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          chatHistory={chatHistory}
          onChatSelect={(chatId) => {
            setSelectedChatId(chatId);
            setIsChatMode(true);
          }}
        />
        
        <div className={`flex-1 transition-all duration-300 ${isLeftSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">돌봄이와의 대화</h2>
                  <button
                    onClick={() => setIsChatMode(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {renderMessage(message)}
                      
                      {message.suggestions && message.sender === 'ai' && (
                        <div className="mt-3 space-y-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left text-sm bg-white bg-opacity-20 hover:bg-opacity-30 rounded px-3 py-2 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        <span>답변을 준비하고 있습니다...</span>
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
                  className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

export default Dashboard;

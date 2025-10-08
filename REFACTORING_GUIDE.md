# 🎯 Dashboard 리팩토링 가이드

## 📁 새로운 프로젝트 구조

```
src/
├── hooks/
│   ├── useChatMessages.js      # 채팅 메시지 관리 훅
│   └── useCategoryData.js      # 카테고리 데이터 관리 훅
│
├── components/
│   ├── chat/
│   │   ├── ChatContainer.jsx   # 채팅 컨테이너 (메시지 + 입력)
│   │   ├── MessageList.jsx     # 메시지 목록
│   │   ├── MessageInput.jsx    # 메시지 입력 영역
│   │   ├── QuickQuestions.jsx  # 빠른 질문 버튼
│   │   └── AIMessage.jsx       # AI 메시지 렌더링
│   │
│   └── category/
│       └── CategoryGrid.jsx    # 카테고리 그리드
│
└── pages/
    ├── Dashboard.jsx           # 기존 Dashboard (호환성 유지)
    ├── DashboardSimple.jsx     # 새로운 메인 화면
    └── chat/
        └── ChatPage.jsx        # 카테고리별 채팅 페이지
```

## 🚀 주요 개선 사항

### 1. **관심사의 분리 (Separation of Concerns)**
- **비즈니스 로직**: 커스텀 훅으로 분리
- **UI 컴포넌트**: 재사용 가능한 작은 컴포넌트로 분리
- **페이지 라우팅**: 카테고리별 독립적인 페이지

### 2. **코드 가독성 향상**
- Dashboard.jsx: 1280줄 → DashboardSimple.jsx: 150줄
- 각 컴포넌트가 단일 책임 원칙을 따름
- 명확한 파일 구조와 네이밍

### 3. **유지보수성 향상**
- 컴포넌트 재사용성 증가
- 테스트 용이성 향상
- 버그 수정 및 기능 추가가 쉬워짐

## 🔄 라우팅 구조

### 새로운 라우팅
```
/dashboard-new                    → 메인 선택 화면
/chat/요양보호사 입·퇴사           → 요양보호사 입·퇴사 채팅
/chat/급여 계산                   → 급여 계산 채팅
/chat/제공계획서 작성             → 제공계획서 작성 채팅
/chat/2025 고시 변경              → 2025 고시 변경 채팅
/chat/상담일지 작성               → 상담일지 작성 채팅
/chat/AI 상담 사용법              → AI 상담 사용법 채팅
/chat/general                     → 일반 채팅 (자유 질문)
/chat/history/:chatId             → 채팅 내역 보기
```

### 기존 라우팅 (호환성 유지)
```
/dashboard                        → 기존 Dashboard (모든 기능 포함)
```

## 💡 사용 방법

### 1. 새로운 구조 사용하기
```jsx
// 메인 화면에서 카테고리 클릭 시
navigate('/chat/요양보호사 입·퇴사');

// 일반 채팅 시작 시
navigate('/chat/general', { state: { initialMessage: '질문 내용' } });
```

### 2. 커스텀 훅 사용하기
```jsx
import { useChatMessages } from '../hooks/useChatMessages';
import { useCategoryData } from '../hooks/useCategoryData';

function MyComponent() {
  const { messages, sendMessage, isLoading } = useChatMessages();
  const { categories, getCategoryById } = useCategoryData();
  
  // 사용 예시
  const handleSend = () => {
    sendMessage('안녕하세요');
  };
}
```

### 3. 컴포넌트 재사용하기
```jsx
import ChatContainer from '../components/chat/ChatContainer';
import MessageInput from '../components/chat/MessageInput';

function MyPage() {
  return (
    <div>
      <ChatContainer 
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSend}
      />
    </div>
  );
}
```

## 🎨 컴포넌트 설명

### 1. **useChatMessages** (Hook)
채팅 메시지 상태와 전송 로직을 관리합니다.
```jsx
const { 
  messages,        // 메시지 배열
  setMessages,     // 메시지 설정
  isLoading,       // 로딩 상태
  sendMessage,     // 메시지 전송
  clearMessages    // 메시지 초기화
} = useChatMessages();
```

### 2. **useCategoryData** (Hook)
카테고리 데이터와 FAQ 질문을 관리합니다.
```jsx
const { 
  categories,              // 전체 카테고리 목록
  getCategoryById,         // ID로 카테고리 조회
  getCategoryByName,       // 이름으로 카테고리 조회
  getCategoryQuestions,    // 카테고리 질문 조회
  getDefaultQuestions      // 기본 질문 조회
} = useCategoryData();
```

### 3. **ChatContainer** (Component)
채팅 UI 전체를 담당하는 컨테이너 컴포넌트입니다.
```jsx
<ChatContainer 
  messages={messages}
  isLoading={isLoading}
  isLoggedIn={isLoggedIn}
  onSendMessage={handleSend}
  onSuggestionClick={handleSuggestion}
  onPdfDownload={handlePdf}
/>
```

### 4. **CategoryGrid** (Component)
카테고리 선택 그리드를 렌더링합니다.
```jsx
<CategoryGrid 
  categories={categories}
  selectedCategory={selectedCategory}
/>
```

## 📊 성능 개선

### Before (기존 Dashboard.jsx)
- **파일 크기**: 1280줄
- **복잡도**: 매우 높음
- **재사용성**: 낮음
- **테스트 용이성**: 어려움

### After (리팩토링 후)
- **파일 크기**: 평균 150줄
- **복잡도**: 낮음
- **재사용성**: 높음
- **테스트 용이성**: 쉬움

## 🔧 마이그레이션 가이드

### 기존 코드를 새로운 구조로 전환하기

1. **Dashboard 경로 변경**
```jsx
// Before
navigate('/dashboard');

// After
navigate('/dashboard-new');
```

2. **카테고리 클릭 처리**
```jsx
// Before
handleQuestionClick('요양보호사 입·퇴사');

// After
navigate('/chat/요양보호사 입·퇴사');
```

3. **채팅 메시지 관리**
```jsx
// Before
const [messages, setMessages] = useState([]);
const handleSend = async () => { /* 복잡한 로직 */ };

// After
const { messages, sendMessage } = useChatMessages();
```

## ⚠️ 주의사항

1. **기존 Dashboard는 유지됩니다**
   - `/dashboard` 경로는 여전히 작동합니다
   - 점진적으로 새로운 구조로 전환할 수 있습니다

2. **카테고리 이름 변경 시**
   - `useCategoryData.js`의 `categories` 배열 수정
   - 라우팅 경로도 함께 업데이트 필요

3. **API 응답 형식**
   - 기존 API 응답 형식과 호환됩니다
   - 추가 수정 없이 사용 가능합니다

## 🚀 다음 단계

1. **테스트 코드 작성**
   - 각 훅과 컴포넌트에 대한 단위 테스트
   - 통합 테스트 추가

2. **추가 최적화**
   - React.memo를 사용한 불필요한 리렌더링 방지
   - 코드 스플리팅으로 초기 로딩 속도 개선

3. **문서화**
   - 각 컴포넌트에 JSDoc 주석 추가
   - Storybook으로 컴포넌트 문서화

## 📝 변경 이력

- **2025-01-08**: 초기 리팩토링 완료
  - 커스텀 훅 생성 (useChatMessages, useCategoryData)
  - 채팅 컴포넌트 분리 (ChatContainer, MessageList, MessageInput, QuickQuestions, AIMessage)
  - 카테고리 컴포넌트 생성 (CategoryGrid)
  - ChatPage 컴포넌트 생성
  - DashboardSimple 생성 (메인 화면만)
  - 라우팅 설정 업데이트

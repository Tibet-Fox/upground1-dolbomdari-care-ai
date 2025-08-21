# API Documentation

이 문서는 돌봄다리 애플리케이션의 모든 API 엔드포인트와 사용법을 설명합니다.

## 📁 API 모듈 구조

```
src/api/
├── axios.js          # Axios 인스턴스 설정
├── auth.js           # 인증 관련 API
├── user.js           # 사용자 관련 API
├── chat.js           # 채팅 관련 API
├── faq.js            # FAQ 관련 API
├── notification.js   # 알림 관련 API
├── analytics.js      # 분석 및 통계 API
├── settings.js       # 설정 관련 API
└── index.js          # 모든 API export
```

## 🔐 인증 API (Auth)

### 로그인
```javascript
import { loginUser } from '../api/auth';

const response = await loginUser('user@example.com', 'password');
```

### 회원가입
```javascript
import { registerUser } from '../api/auth';

const userData = {
  name: '홍길동',
  email: 'user@example.com',
  password: 'password123'
};
const response = await registerUser(userData);
```

### 사용자 정보 조회
```javascript
import { getUserInfo } from '../api/auth';

const userInfo = await getUserInfo();
```

### 로그아웃
```javascript
import { logoutUser } from '../api/auth';

await logoutUser();
```

### 토큰 갱신
```javascript
import { refreshToken } from '../api/auth';

const newTokens = await refreshToken();
```

## 👤 사용자 API (User)

### 프로필 조회
```javascript
import { getUserProfile } from '../api/user';

const profile = await getUserProfile();
```

### 프로필 업데이트
```javascript
import { updateUserProfile } from '../api/user';

const profileData = {
  name: '새로운 이름',
  phone: '010-1234-5678'
};
await updateUserProfile(profileData);
```

### 비밀번호 변경
```javascript
import { changePassword } from '../api/user';

await changePassword('현재비밀번호', '새비밀번호');
```

### 계정 삭제
```javascript
import { deleteUserAccount } from '../api/user';

await deleteUserAccount();
```

## 💬 채팅 API (Chat)

### 새 대화 생성
```javascript
import { createConversation } from '../api/chat';

const conversation = await createConversation();
```

### AI와 메시지 전송
```javascript
import { sendMessageWithAI } from '../api/chat';

const response = await sendMessageWithAI(conversationId, '안녕하세요');
```

### 대화 목록 조회
```javascript
import { getConversations } from '../api/chat';

const conversations = await getConversations(1, 20);
```

### 대화 상세 조회
```javascript
import { getConversationDetails } from '../api/chat';

const details = await getConversationDetails(conversationId);
```

### 대화 삭제
```javascript
import { deleteConversation } from '../api/chat';

await deleteConversation(conversationId);
```

### 대화 제목 업데이트
```javascript
import { updateConversationTitle } from '../api/chat';

await updateConversationTitle(conversationId, '새로운 제목');
```

### 메시지 추가 (저장 전용)
```javascript
import { addMessage } from '../api/chat';

const messageData = {
  message: '사용자 메시지',
  sender: 'user',
  timestamp: new Date().toISOString()
};
await addMessage(conversationId, messageData);
```

### 메시지 삭제
```javascript
import { deleteMessage } from '../api/chat';

await deleteMessage(messageId);
```

### 메시지 수정
```javascript
import { updateMessage } from '../api/chat';

await updateMessage(messageId, '수정된 메시지');
```

### 대화 내보내기
```javascript
import { exportConversation } from '../api/chat';

const exportedData = await exportConversation(conversationId, 'json');
```

## ❓ FAQ API (FAQ)

### 카테고리 조회
```javascript
import { getFaqCategories } from '../api/faq';

const categories = await getFaqCategories();
```

### 질문 목록 조회
```javascript
import { getFaqQuestions } from '../api/faq';

const questions = await getFaqQuestions(categoryId);
```

### 질문 상세 조회
```javascript
import { getFaqQuestionDetail } from '../api/faq';

const questionDetail = await getFaqQuestionDetail(questionId);
```

### FAQ 검색
```javascript
import { searchFaq } from '../api/faq';

const searchResults = await searchFaq('검색어');
```

## 🔔 알림 API (Notification)

### 알림 목록 조회
```javascript
import { getNotifications } from '../api/notification';

const notifications = await getNotifications(1, 20);
```

### 알림 읽음 처리
```javascript
import { markNotificationAsRead } from '../api/notification';

await markNotificationAsRead(notificationId);
```

### 모든 알림 읽음 처리
```javascript
import { markAllNotificationsAsRead } from '../api/notification';

await markAllNotificationsAsRead();
```

### 알림 삭제
```javascript
import { deleteNotification } from '../api/notification';

await deleteNotification(notificationId);
```

### 읽지 않은 알림 개수 조회
```javascript
import { getUnreadNotificationCount } from '../api/notification';

const count = await getUnreadNotificationCount();
```

### 알림 설정 조회
```javascript
import { getNotificationSettings } from '../api/notification';

const settings = await getNotificationSettings();
```

### 알림 설정 업데이트
```javascript
import { updateNotificationSettings } from '../api/notification';

const settings = {
  email: true,
  push: false,
  sms: true
};
await updateNotificationSettings(settings);
```

## 📊 분석 API (Analytics)

### 사용자 활동 통계
```javascript
import { getUserAnalytics } from '../api/analytics';

const analytics = await getUserAnalytics('month');
```

### 채팅 통계
```javascript
import { getChatAnalytics } from '../api/analytics';

const chatStats = await getChatAnalytics('month');
```

### FAQ 사용 통계
```javascript
import { getFaqAnalytics } from '../api/analytics';

const faqStats = await getFaqAnalytics('month');
```

### 인기 질문 조회
```javascript
import { getPopularQuestions } from '../api/analytics';

const popularQuestions = await getPopularQuestions(10);
```

### 사용자 만족도 조회
```javascript
import { getUserSatisfaction } from '../api/analytics';

const satisfaction = await getUserSatisfaction('month');
```

### 시스템 성능 통계
```javascript
import { getSystemPerformance } from '../api/analytics';

const performance = await getSystemPerformance('day');
```

## ⚙️ 설정 API (Settings)

### 사용자 설정 조회
```javascript
import { getUserSettings } from '../api/settings';

const settings = await getUserSettings();
```

### 사용자 설정 업데이트
```javascript
import { updateUserSettings } from '../api/settings';

const settings = {
  displayName: '새로운 표시명',
  timezone: 'Asia/Seoul'
};
await updateUserSettings(settings);
```

### 채팅 설정 조회
```javascript
import { getChatSettings } from '../api/settings';

const chatSettings = await getChatSettings();
```

### 채팅 설정 업데이트
```javascript
import { updateChatSettings } from '../api/settings';

const settings = {
  autoSave: true,
  messageHistory: 100,
  typingIndicator: true
};
await updateChatSettings(settings);
```

### 테마 설정 조회
```javascript
import { getThemeSettings } from '../api/settings';

const theme = await getThemeSettings();
```

### 테마 설정 업데이트
```javascript
import { updateThemeSettings } from '../api/settings';

await updateThemeSettings('dark');
```

### 언어 설정 조회
```javascript
import { getLanguageSettings } from '../api/settings';

const language = await getLanguageSettings();
```

### 언어 설정 업데이트
```javascript
import { updateLanguageSettings } from '../api/settings';

await updateLanguageSettings('ko');
```

### 개인정보 설정 조회
```javascript
import { getPrivacySettings } from '../api/settings';

const privacy = await getPrivacySettings();
```

### 개인정보 설정 업데이트
```javascript
import { updatePrivacySettings } from '../api/settings';

const privacySettings = {
  dataSharing: false,
  analytics: true,
  marketing: false
};
await updatePrivacySettings(privacySettings);
```

## 🔧 에러 처리

모든 API 함수는 에러 처리를 포함하고 있습니다:

```javascript
try {
  const response = await loginUser(email, password);
  console.log('로그인 성공:', response);
} catch (error) {
  console.error('로그인 실패:', error.message);
  
  if (error.response?.status === 401) {
    // 인증 오류 처리
    console.log('로그인이 필요합니다.');
  } else if (error.response?.status === 422) {
    // 유효성 검증 오류 처리
    console.log('입력 데이터가 올바르지 않습니다.');
  }
}
```

## 🔒 인증 토큰

API 호출 시 자동으로 인증 토큰이 포함됩니다:

```javascript
// axios.js에서 자동으로 토큰을 헤더에 추가
const token = localStorage.getItem('access_token');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

## 📝 로깅

모든 API 호출은 콘솔에 로그가 출력됩니다:

```javascript
console.log('API 호출:', { endpoint, data });
console.log('API 응답:', response.data);
console.error('API 오류:', error.message);
```

## 🚀 사용 예시

### 완전한 채팅 플로우 예시

```javascript
import { 
  createConversation, 
  sendMessageWithAI, 
  getConversations,
  getConversationDetails 
} from '../api/chat';

// 1. 새 대화 생성
const conversation = await createConversation();
console.log('새 대화 생성됨:', conversation.id);

// 2. AI와 메시지 전송
const response = await sendMessageWithAI(conversation.id, '안녕하세요');
console.log('AI 응답:', response);

// 3. 대화 목록 조회
const conversations = await getConversations();
console.log('대화 목록:', conversations);

// 4. 특정 대화 상세 조회
const details = await getConversationDetails(conversation.id);
console.log('대화 상세:', details);
```

이제 모든 API가 완전히 연결되어 있으며, 필요에 따라 추가 기능을 구현할 수 있습니다! 🎉

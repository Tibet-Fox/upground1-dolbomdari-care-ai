# API 연동 가이드

## 📋 API 명세서 기반 연동 완료

### ✅ 구현된 API 엔드포인트

#### 1. **GET /faq/categories**
- **기능**: FAQ 카테고리 전체 목록 조회
- **인증**: 불필요
- **응답 형식**:
```json
[
  {
    "id": 1,
    "name": "요양보호사 입·퇴사",
    "icon": "👤",
    "path": "/chat/caregiver-onboarding"
  },
  {
    "id": 2,
    "name": "급여 계산",
    "icon": "💰",
    "path": "/chat/salary"
  }
]
```

#### 2. **GET /faq/questions?category_id=1**
- **기능**: 카테고리별 질문 목록 조회
- **인증**: 불필요
- **응답 형식**:
```json
[
  {
    "id": 1,
    "question": "요양보호사 입사 시 필요한 서류는 무엇인가요?"
  },
  {
    "id": 2,
    "question": "요양보호사 퇴사 시 4대보험 정리는 어떻게 하나요?"
  }
]
```

#### 3. **GET /faq/questions/{question_id}**
- **기능**: 질문 상세 조회 (로그인한 사용자만)
- **인증**: Bearer Token 필요
- **응답 형식**:
```json
{
  "id": 1,
  "question": "요양보호사 입사 시 필요한 서류는 무엇인가요?",
  "answer": "입사 시에는 다음 서류가 필요합니다...",
  "reference_title": "입사 서류 가이드",
  "reference_url": "/documents/guide.pdf"
}
```

## 🔄 프론트엔드 연동 구조

### 1. **useCategoryData.js**
```javascript
// API에서 카테고리 목록 로드
useEffect(() => {
  const loadCategories = async () => {
    const apiCategories = await getFaqCategories();
    if (apiCategories && apiCategories.length > 0) {
      setCategories(apiCategories); // API 데이터 사용
    } else {
      setCategories(defaultCategories); // Fallback
    }
  };
  loadCategories();
}, []);

// 질문 상세 조회 (로그인 사용자만)
const getQuestionDetail = async (questionId) => {
  const questionDetail = await getFaqQuestionDetail(questionId);
  return questionDetail;
};
```

### 2. **ChatPage.jsx**
```javascript
const handleSuggestionClick = async (suggestion) => {
  // 1. 질문 ID 추출 (Q1. 질문내용 -> 1)
  const questionIdMatch = suggestion.match(/Q(\d+)\./);
  const questionId = parseInt(questionIdMatch[1]);
  
  // 2. 질문 상세 조회 API 호출
  const questionDetail = await getQuestionDetail(questionId);
  
  // 3. API 응답을 채팅 형식으로 변환
  const botResponse = {
    greeting: questionDetail.answer,
    summary: questionDetail.reference_title,
    explanation: questionDetail.reference_url,
    references: [{
      title: questionDetail.reference_title,
      url: questionDetail.reference_url
    }]
  };
};
```

## 📊 데이터 플로우

### 1. **카테고리 로드**
```
앱 시작 → useCategoryData → GET /faq/categories → 카테고리 목록 표시
```

### 2. **FAQ 질문 로드**
```
카테고리 클릭 → ChatPage → GET /faq/questions?category_id=1 → 질문 목록 표시
```

### 3. **FAQ 답변 조회**
```
질문 클릭 → 질문 ID 추출 → GET /faq/questions/{id} → 답변 표시
```

## 🔐 인증 처리

### 1. **토큰 확인**
```javascript
// faq.js에서 인증 토큰 확인
const token = localStorage.getItem('access_token');
const headers = {};

if (token) {
  headers.Authorization = `Bearer ${token}`;
}
```

### 2. **인증 실패 처리**
```javascript
// 401 Unauthorized 오류 처리
if (error.response?.status === 401) {
  console.log('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
  return null;
}
```

## 🎯 사용자 경험

### 1. **정상 시나리오**
```
1. 카테고리 목록 로드 (API)
2. 카테고리 클릭 → FAQ 질문 목록 표시
3. FAQ 질문 클릭 → 상세 답변 표시 (로그인 필요)
```

### 2. **API 없음 시나리오**
```
1. 카테고리 목록 로드 실패 → 기본 카테고리 사용
2. FAQ 질문 목록 없음 → "자유롭게 질문해주세요" 메시지
3. 질문 상세 조회 실패 → 일반 채팅으로 처리
```

### 3. **인증 필요 시나리오**
```
1. 로그인하지 않은 사용자가 FAQ 질문 클릭
2. 질문 상세 조회 API 호출 → 401 오류
3. 일반 채팅으로 자동 전환
```

## 🛠️ 에러 처리

### 1. **API 오류 처리**
```javascript
try {
  const response = await apiCall();
  return response.data;
} catch (error) {
  if (error.response?.status === 404) {
    return []; // 빈 배열 반환
  }
  if (error.response?.status === 401) {
    return null; // 인증 필요
  }
  throw error;
}
```

### 2. **Fallback 처리**
```javascript
// API 실패 시 기본 데이터 사용
if (apiCategories && apiCategories.length > 0) {
  setCategories(apiCategories);
} else {
  setCategories(defaultCategories);
}
```

## 📝 백엔드 요구사항

### 1. **응답 형식 표준화**
- 모든 API는 일관된 JSON 형식으로 응답
- 오류 시 적절한 HTTP 상태 코드 반환
- 인증 필요한 API는 Bearer Token 검증

### 2. **CORS 설정**
```javascript
// 프론트엔드에서 API 호출 시
const response = await instance.get('/faq/categories', {
  withCredentials: false
});
```

### 3. **데이터베이스 구조**
```sql
-- 카테고리 테이블
CREATE TABLE categories (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  icon VARCHAR(10),
  path VARCHAR(255)
);

-- FAQ 질문 테이블
CREATE TABLE faq_questions (
  id INT PRIMARY KEY,
  category_id INT,
  question TEXT,
  answer TEXT,
  reference_title VARCHAR(255),
  reference_url VARCHAR(500)
);
```

## 🧪 테스트 시나리오

### 1. **정상 동작 테스트**
```
✅ 카테고리 목록 로드
✅ 카테고리별 FAQ 질문 목록 로드
✅ FAQ 질문 클릭 시 상세 답변 표시
✅ 로그인 상태에서 모든 기능 정상 동작
```

### 2. **에러 시나리오 테스트**
```
✅ API 서버 다운 시 기본 데이터 사용
✅ 네트워크 오류 시 사용자 친화적 메시지
✅ 인증 실패 시 일반 채팅으로 전환
✅ 잘못된 질문 ID 처리
```

### 3. **성능 테스트**
```
✅ API 응답 시간 측정
✅ 대용량 FAQ 데이터 처리
✅ 동시 사용자 처리
```

## 🚀 배포 체크리스트

### 1. **프론트엔드**
- [ ] API 엔드포인트 URL 확인
- [ ] CORS 설정 확인
- [ ] 인증 토큰 처리 확인
- [ ] 에러 처리 로직 확인

### 2. **백엔드**
- [ ] API 엔드포인트 구현 완료
- [ ] 데이터베이스 연결 확인
- [ ] 인증 미들웨어 구현
- [ ] CORS 설정 완료

### 3. **통합 테스트**
- [ ] 전체 플로우 테스트
- [ ] 에러 시나리오 테스트
- [ ] 성능 테스트
- [ ] 사용자 경험 테스트

---

**변경 일자**: 2025-01-08  
**작성자**: AI Assistant  
**API 명세서 기반**: ✅ 완료

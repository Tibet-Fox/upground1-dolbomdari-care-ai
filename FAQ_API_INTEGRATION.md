# FAQ API 연동 가이드

## 🎯 변경 사항 요약

하드코딩된 FAQ 답변을 모두 제거하고, 백엔드 API에서만 데이터를 받아오도록 수정했습니다.

## ✅ 제거된 하드코딩 부분

### 1. **useCategoryData.js**
- ❌ `getDefaultQuestions()` 함수 완전 제거
- ❌ 하드코딩된 60개 이상의 FAQ 질문 제거

### 2. **ChatPage.jsx**
- ✅ API 우선 방식으로 변경
- ✅ API 응답이 있을 때만 제안 질문 표시
- ✅ API 오류 시 사용자 친화적인 메시지 표시

## 📊 현재 동작 방식

### 1. **FAQ 질문 로드 (ChatPage.jsx)**

```javascript
const loadCategoryMessages = async (categoryName) => {
  // 1. 카테고리 데이터 조회
  const categoryData = getCategoryByName(categoryName);
  
  // 2. API에서 FAQ 질문 목록 가져오기
  const questions = await getCategoryQuestions(categoryData.id);
  
  // 3-1. API 응답이 있을 경우
  if (questions && questions.length > 0) {
    // 제안 질문 표시
    const suggestions = questions.map((q, index) => `Q${index + 1}. ${q.question}`);
  }
  
  // 3-2. API 응답이 없을 경우
  else {
    // "자유롭게 질문해주세요" 메시지 표시
  }
  
  // 3-3. API 오류 발생 시
  catch (error) {
    // "질문 목록을 불러오는데 실패했습니다" 메시지 표시
  }
};
```

### 2. **FAQ 답변 로드**

제안 질문 클릭 시:
```javascript
const handleSuggestionClick = async (suggestion) => {
  // useChatMessages의 sendMessage 사용
  // → askChatbot API 호출
  // → 백엔드에서 답변 받아오기
  await sendMessage(suggestion);
};
```

## 🔌 API 연동 포인트

### 1. **FAQ 질문 목록 API**
- **파일**: `src/api/faq.js`
- **함수**: `getFaqQuestions(categoryId)`
- **용도**: 카테고리별 FAQ 질문 목록 조회

```javascript
// src/hooks/useCategoryData.js
const getCategoryQuestions = async (categoryId) => {
  const questions = await getFaqQuestions(categoryId);
  return questions;
};
```

### 2. **FAQ 답변 API**
- **파일**: `src/api/chat.js`
- **함수**: `askChatbot(message)`
- **용도**: 질문에 대한 AI 답변 조회

```javascript
// src/hooks/useChatMessages.js
const sendMessage = async (text) => {
  const response = await askChatbot(text);
  // 답변 처리
};
```

## 📝 백엔드 API 요구사항

### 1. **GET /faq/questions/:categoryId**
카테고리별 FAQ 질문 목록 반환

**응답 예시:**
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

### 2. **POST /chat/ask**
질문에 대한 AI 답변 반환

**요청 예시:**
```json
{
  "message": "Q1. 요양보호사 입사 시 필요한 서류는 무엇인가요?"
}
```

**응답 예시:**
```json
{
  "bot_message": {
    "greeting": "요양보호사 입사 시 필요한 서류에 대해 안내드릴게요!",
    "summary": "입사 시에는 건강검진 결과서, 자격증 사본 등이 필요합니다.",
    "explanation": "상세 설명...",
    "references": [
      {
        "title": "입사 서류 가이드",
        "url": "/documents/guide.pdf"
      }
    ]
  },
  "suggestions": [
    "Q1. 추가 질문 1",
    "Q2. 추가 질문 2"
  ]
}
```

## 🔄 사용자 플로우

### 1. **카테고리 선택**
```
사용자: "요양보호사 입·퇴사" 버튼 클릭
  ↓
시스템: GET /faq/questions/1 호출
  ↓
API 응답 있음: FAQ 질문 목록 표시
API 응답 없음: "자유롭게 질문해주세요" 메시지
API 오류: "질문 목록 불러오기 실패" 메시지
```

### 2. **FAQ 질문 선택**
```
사용자: "Q1. 입사 서류는?" 클릭
  ↓
시스템: POST /chat/ask 호출
  ↓
API 응답: AI 답변 + 추가 제안 질문 표시
```

### 3. **자유 질문 입력**
```
사용자: 직접 질문 입력
  ↓
시스템: POST /chat/ask 호출
  ↓
API 응답: AI 답변 표시
```

## 🎨 UI 변경 사항

### 이전 (하드코딩)
- ❌ 항상 동일한 FAQ 질문 표시
- ❌ API 실패해도 기본 질문 표시
- ❌ 백엔드 데이터와 불일치 가능

### 현재 (API 연동)
- ✅ API에서 받은 질문만 표시
- ✅ API 실패 시 사용자에게 명확한 안내
- ✅ 백엔드 데이터와 항상 일치

## 🧪 테스트 가이드

### 1. **정상 시나리오**
```
1. 카테고리 클릭 → FAQ 질문 목록 표시 확인
2. FAQ 질문 클릭 → AI 답변 표시 확인
3. 추가 질문 클릭 → 연속 대화 확인
```

### 2. **API 없음 시나리오**
```
1. 카테고리 클릭
2. API 응답 없음 (빈 배열)
3. "자유롭게 질문해주세요" 메시지 확인
```

### 3. **API 오류 시나리오**
```
1. 카테고리 클릭
2. API 오류 발생
3. "질문 목록 불러오기 실패" 메시지 확인
4. 직접 입력은 여전히 가능한지 확인
```

## 📌 주의사항

1. **API 응답 형식 확인**
   - FAQ 질문 목록: `[{ id, question }]` 배열 형식
   - AI 답변: `{ bot_message, suggestions }` 형식

2. **에러 처리**
   - API 오류 시에도 사용자가 직접 질문 입력 가능
   - 사용자에게 명확한 오류 메시지 표시

3. **로딩 상태**
   - API 호출 중 로딩 표시
   - 중복 호출 방지

## 🚀 다음 단계

1. **백엔드 API 개발**
   - GET /faq/questions/:categoryId
   - POST /chat/ask

2. **API 문서화**
   - Swagger/OpenAPI 문서 작성
   - 응답 형식 명확히 정의

3. **테스트**
   - API 연동 테스트
   - 에러 시나리오 테스트
   - 성능 테스트

---

**변경 일자**: 2025-01-08
**작성자**: AI Assistant


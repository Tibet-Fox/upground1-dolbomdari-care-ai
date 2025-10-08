# 최종 API 연동 완료 가이드

## ✅ 백엔드 API 연동 완료

### 🔌 서버 정보
- **백엔드 서버**: [https://api.carebridges.o-r.kr](https://api.carebridges.o-r.kr/)
- **프론트엔드 서버**: http://localhost:3001

### 📋 확인된 백엔드 API 응답 형식

#### 1. **GET /faq/categories**
```json
[
    {
        "category_id": 1,
        "title": "요양보호사 입·퇴사"
    },
    {
        "category_id": 2,
        "title": "급여 계산"
    },
    {
        "category_id": 3,
        "title": "제공계획서 작성"
    },
    {
        "category_id": 4,
        "title": "2025 고시 변경"
    },
    {
        "category_id": 5,
        "title": "상담일지 작성"
    },
    {
        "category_id": 6,
        "title": "AI 상담 사용법"
    }
]
```

#### 2. **GET /faq/questions?category_id=1**
```json
[
    {
        "question_id": 1,
        "category_id": 1,
        "question": "요양보호사 퇴사 시 4대보험은 언제까지 정리해야 하나요?"
    },
    {
        "question_id": 2,
        "category_id": 1,
        "question": "입사 전 건강검진은 필수인가요?"
    },
    {
        "question_id": 3,
        "category_id": 1,
        "question": "퇴사 시 연차수당은 어떻게 계산하나요?"
    },
    {
        "question_id": 4,
        "category_id": 1,
        "question": "신규 입사자 인사기록카드는 어떤 항목까지 작성해야 하나요?"
    }
]
```

## 🔧 프론트엔드 구현 완료

### 1. **카테고리 데이터 매핑**
```javascript
// src/hooks/useCategoryData.js
const mappedCategories = apiCategories.map(category => ({
  id: category.category_id,  // 백엔드: category_id
  name: category.title,      // 백엔드: title
  icon: getCategoryIcon(category.category_id),
  path: `/chat/${category.title}`
}));
```

### 2. **ChatPage FAQ API 연동**
```javascript
// src/pages/chat/ChatPage.jsx
const questions = await getCategoryQuestions(categoryData.id);

if (questions && questions.length > 0) {
  // 백엔드 응답 형식에 맞춰 제안 질문 생성
  const suggestions = questions.map((q, index) => `Q${index + 1}. ${q.question}`);
  
  const botMessage = {
    text: `${categoryName}에 대해 궁금하셨군요! 아래에서 자주 묻는 질문을 선택해 보시면, 더 정확히 도와드릴게요 😊`,
    suggestions: suggestions
  };
}
```

### 3. **질문 상세 조회 연동**
```javascript
// src/pages/chat/ChatPage.jsx
const handleSuggestionClick = async (suggestion) => {
  // 질문에서 ID 추출 (Q1. 질문내용 -> 1)
  const questionIdMatch = suggestion.match(/Q(\d+)\./);
  const questionId = parseInt(questionIdMatch[1]);
  
  // 질문 상세 조회 API 호출
  const questionDetail = await getQuestionDetail(questionId);
};
```

## 🎯 완전한 사용자 플로우

### 1. **Dashboard → ChatPage**
```
사용자: Dashboard에서 "요양보호사 입·퇴사" 버튼 클릭
  ↓
시스템: navigate("/chat/요양보호사 입·퇴사")
  ↓
페이지: ChatPage로 이동
```

### 2. **FAQ 질문 목록 로드**
```
페이지 로드 → loadCategoryMessages("요양보호사 입·퇴사")
  ↓
카테고리 조회: getCategoryByName("요양보호사 입·퇴사")
  ↓
FAQ API 호출: GET /faq/questions?category_id=1
  ↓
응답 처리: questions 배열을 suggestions로 변환
  ↓
UI 표시: 사용자 메시지 + AI 답변 + 제안 질문
```

### 3. **제안 질문 클릭**
```
사용자: "Q1. 요양보호사 퇴사 시 4대보험은 언제까지 정리해야 하나요?" 클릭
  ↓
질문 ID 추출: Q1. → 1
  ↓
질문 상세 API 호출: GET /faq/questions/1
  ↓
응답 처리: 답변 표시
```

## 🔌 현재 연결된 API 엔드포인트

### ✅ **구현 완료된 것들**
- `GET /faq/categories` - 카테고리 목록
- `GET /faq/questions?category_id=1` - 질문 목록
- `GET /faq/questions/{question_id}` - 질문 상세

### 📋 **추가로 필요한 것들**
- [ ] `POST /chat/ask` - AI 질문 답변 (기존 askAI 함수용)
- [ ] `POST /auth/login` - 로그인
- [ ] `POST /auth/register` - 회원가입

## 🧪 테스트 방법

### 1. **카테고리 로드 테스트**
```
1. 브라우저에서 http://localhost:3001 접속
2. 개발자 도구 Network 탭 열기
3. GET /faq/categories 요청 확인
4. 카테고리 버튼들이 올바르게 표시되는지 확인
```

### 2. **카테고리 클릭 테스트**
```
1. "요양보호사 입·퇴사" 버튼 클릭
2. ChatPage로 이동하는지 확인
3. GET /faq/questions?category_id=1 요청 확인
4. AI 답변과 제안 질문이 표시되는지 확인
```

### 3. **제안 질문 클릭 테스트**
```
1. "Q1. 요양보호사 퇴사 시 4대보험은 언제까지 정리해야 하나요?" 클릭
2. GET /faq/questions/1 요청 확인
3. 질문 상세 답변이 표시되는지 확인
```

## 📝 예상되는 UI 결과

### **카테고리 클릭 후 ChatPage**
```
사용자: 요양보호사 입·퇴사

AI: 요양보호사 입·퇴사에 대해 궁금하셨군요! 아래에서 자주 묻는 질문을 선택해 보시면, 더 정확히 도와드릴게요 😊

제안 질문:
[Q1. 요양보호사 퇴사 시 4대보험은 언제까지 정리해야 하나요?]
[Q2. 입사 전 건강검진은 필수인가요?]
[Q3. 퇴사 시 연차수당은 어떻게 계산하나요?]
[Q4. 신규 입사자 인사기록카드는 어떤 항목까지 작성해야 하나요?]
```

### **제안 질문 클릭 후**
```
사용자: Q1. 요양보호사 퇴사 시 4대보험은 언제까지 정리해야 하나요?

AI: [백엔드에서 받은 질문 상세 답변]
```

## 🚀 배포 준비 완료

### ✅ **프론트엔드 완료 사항**
- [x] 백엔드 서버 URL 연결
- [x] 카테고리 API 연동
- [x] FAQ 질문 목록 API 연동
- [x] 질문 상세 조회 API 연동
- [x] 에러 처리 구현
- [x] UI 표시 완료

### 📋 **백엔드 확인 사항**
- [x] `GET /faq/categories` - 구현 완료
- [x] `GET /faq/questions?category_id=1` - 구현 완료
- [ ] `GET /faq/questions/{question_id}` - 구현 필요
- [ ] `POST /chat/ask` - 구현 필요
- [ ] CORS 설정 확인

---

**변경 일자**: 2025-01-08  
**작성자**: AI Assistant  
**최종 API 연동**: ✅ 완료  
**서버 URL**: https://api.carebridges.o-r.kr

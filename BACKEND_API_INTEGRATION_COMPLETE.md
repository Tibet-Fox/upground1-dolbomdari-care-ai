# 백엔드 API 연동 완료 가이드

## ✅ 백엔드 서버 연결 완료

### 🔌 서버 정보
- **백엔드 서버**: [https://api.carebridges.o-r.kr](https://api.carebridges.o-r.kr/)
- **프론트엔드 서버**: http://localhost:3001
- **API 응답 확인**: [https://api.carebridges.o-r.kr/faq/categories](https://api.carebridges.o-r.kr/faq/categories)

### 📋 실제 API 응답 형식

#### **GET /faq/categories**
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

## 🔧 프론트엔드 수정 사항

### 1. **API 서버 URL 수정**
```javascript
// src/api/axios.js
const API_BASE_URL = "https://api.carebridges.o-r.kr";
```

### 2. **카테고리 데이터 매핑**
```javascript
// src/hooks/useCategoryData.js
const mappedCategories = apiCategories.map(category => ({
  id: category.category_id,  // 백엔드: category_id
  name: category.title,      // 백엔드: title
  icon: getCategoryIcon(category.category_id),  // ID 기반 아이콘
  path: `/chat/${category.title}`  // title을 URL에 사용
}));

// 카테고리 ID별 아이콘 매핑
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
```

### 3. **라우팅 업데이트**
```javascript
// src/components/category/CategoryGrid.jsx
const handleCategoryClick = (category) => {
  navigate(`/chat/${category.name}`);  // title을 URL 파라미터로 사용
};
```

## 🎯 현재 동작 플로우

### 1. **카테고리 로드**
```
앱 시작 → useCategoryData → GET /faq/categories → 카테고리 목록 표시
```

### 2. **카테고리 클릭**
```
사용자: "요양보호사 입·퇴사" 버튼 클릭
  ↓
시스템: navigate("/chat/요양보호사 입·퇴사")
  ↓
페이지: ChatPage로 이동
```

### 3. **ChatPage에서 API 호출**
```
페이지 로드 → loadCategoryMessages("요양보호사 입·퇴사")
  ↓
API 호출: POST /chat/category-initial
  ↓
응답: { greeting, suggestions }
  ↓
UI 표시: 사용자 메시지 + AI 답변 + 제안 질문
```

## 🔌 필요한 백엔드 엔드포인트

### 1. **이미 구현된 것들**
- ✅ `GET /faq/categories` - 카테고리 목록
- ✅ `GET /faq/questions?category_id=1` - 질문 목록
- ✅ `GET /faq/questions/{question_id}` - 질문 상세
- ✅ `POST /auth/login` - 로그인
- ✅ `POST /auth/register` - 회원가입

### 2. **추가로 필요한 것들**
- [ ] `POST /chat/category-initial` - 카테고리별 초기 답변
- [ ] `POST /chat/ask` - AI 질문 답변

## 📝 백엔드 구현 가이드

### 1. **POST /chat/category-initial**
```python
# 요청
{
  "category": "요양보호사 입·퇴사"
}

# 응답
{
  "greeting": "요양보호사 입·퇴사에 대해 궁금하셨군요! 아래에서 자주 묻는 질문을 선택해 보시면, 더 정확히 도와드릴게요 😊",
  "suggestions": [
    "Q1. 요양보호사 퇴사 시 4대보험은 언제까지 정리해야 하나요?",
    "Q2. 입사 전 건강검진은 필수인가요?",
    "Q3. 퇴사 시 연차수당은 어떻게 계산하나요?"
  ]
}
```

### 2. **POST /chat/ask**
```python
# 요청
{
  "message": "Q1. 요양보호사 퇴사 시 4대보험은 언제까지 정리해야 하나요?"
}

# 응답
{
  "message_id": 7,
  "content": "[자세한 안내] 요양보호사가 퇴사할 경우, 4대보험 신고는 퇴사일로부터 14일 이내",
  "sources": [
    {
      "text": "제공하지 않는 조건으로 월 10만 원씩 지급받기로 담합하고 허위로 청구함",
      "score": 0.2648325264453888,
      "confidence": 0.791,
      "metadata": {
        "title": "(★211104) 2021년도_사회복지사_교육교재(전체본).pdf",
        "source_url": "https://storage.googleapis.com/carebridges-c689d.firebas"
      }
    }
  ]
}
```

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
3. POST /chat/category-initial 요청 확인
4. AI 답변과 제안 질문이 표시되는지 확인
```

### 3. **에러 처리 테스트**
```
1. 백엔드 서버 중단
2. 카테고리 클릭 시 기본 메시지 표시 확인
3. 네트워크 오류 메시지 확인
```

## 🚀 다음 단계

### 1. **백엔드 구현**
- [ ] `POST /chat/category-initial` 엔드포인트 구현
- [ ] `POST /chat/ask` 엔드포인트 구현
- [ ] CORS 설정 확인

### 2. **통합 테스트**
- [ ] 전체 플로우 테스트
- [ ] 에러 시나리오 테스트
- [ ] 성능 테스트

### 3. **배포 준비**
- [ ] 프로덕션 환경 설정
- [ ] 환경 변수 설정
- [ ] 최종 테스트

---

**변경 일자**: 2025-01-08  
**작성자**: AI Assistant  
**백엔드 API 연동**: ✅ 완료  
**서버 URL**: https://api.carebridges.o-r.kr

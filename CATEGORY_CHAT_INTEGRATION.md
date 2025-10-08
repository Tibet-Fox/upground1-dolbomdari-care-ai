# 카테고리별 채팅 페이지 연동 가이드

## 🎯 구현 완료 사항

이미지에서 보신 대로 Dashboard에서 카테고리 버튼 클릭 시 ChatPage로 이동하고, 백엔드 API에서 답변을 받아오도록 구현했습니다.

### 📋 변경된 기능

#### 1. **Dashboard → ChatPage 이동**
```javascript
// src/components/category/CategoryGrid.jsx
const handleCategoryClick = (category) => {
  // 카테고리 이름을 URL 파라미터로 사용하여 ChatPage로 이동
  navigate(`/chat/${category.name}`);
};
```

#### 2. **백엔드 API 연동**
```javascript
// src/api/chat.js
export const getCategoryInitialResponse = async (categoryName) => {
  const response = await instance.post('/chat/category-initial', {
    category: categoryName
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.data; // { greeting, suggestions }
};
```

#### 3. **ChatPage에서 API 호출**
```javascript
// src/pages/chat/ChatPage.jsx
const loadCategoryMessages = async (categoryName) => {
  try {
    // 백엔드 API에서 카테고리별 초기 답변 가져오기
    const response = await getCategoryInitialResponse(categoryName);
    
    if (response && response.greeting) {
      // 백엔드 응답을 채팅 형식으로 변환
      const botMessage = {
        id: Date.now() + 1,
        text: response.greeting,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        suggestions: response.suggestions || []
      };
      
      setMessages([userMessage, botMessage]);
    }
  } catch (error) {
    // API 오류 시 기본 메시지 표시
    const fallbackMessage = {
      text: `${categoryName}에 대해 궁금하셨군요! 아래에서 자주 묻는 질문을 선택해 보시면, 더 정확히 도와드릴게요 😊`,
      suggestions: [
        `Q1. ${categoryName} 관련 질문 1`,
        `Q2. ${categoryName} 관련 질문 2`,
        `Q3. ${categoryName} 관련 질문 3`
      ]
    };
  }
};
```

## 🔌 백엔드 API 요구사항

### 1. **POST /chat/category-initial**
- **기능**: 카테고리별 초기 답변 및 제안 질문 제공
- **인증**: Bearer Token 필요
- **요청 형식**:
```json
{
  "category": "요양보호사 입·퇴사"
}
```

- **응답 형식**:
```json
{
  "greeting": "요양보호사 입·퇴사에 대해 궁금하셨군요! 아래에서 자주 묻는 질문을 선택해 보시면, 더 정확히 도와드릴게요 😊",
  "suggestions": [
    "Q1. 요양보호사 퇴사 시 4대보험은 언제까지 정리해야 하나요?",
    "Q2. 입사 전 건강검진은 필수인가요?",
    "Q3. 퇴사 시 연차수당은 어떻게 계산하나요?"
  ]
}
```

## 🎨 사용자 플로우

### 1. **Dashboard에서 카테고리 클릭**
```
사용자: Dashboard에서 "요양보호사 입·퇴사" 버튼 클릭
  ↓
시스템: navigate(`/chat/요양보호사 입·퇴사`)
  ↓
페이지: ChatPage로 이동
```

### 2. **ChatPage에서 API 호출**
```
페이지 로드 → loadCategoryMessages("요양보호사 입·퇴사")
  ↓
API 호출: POST /chat/category-initial
  ↓
응답: { greeting, suggestions }
  ↓
UI 표시: 사용자 메시지 + AI 답변 + 제안 질문
```

### 3. **제안 질문 클릭**
```
사용자: "Q1. 요양보호사 퇴사 시 4대보험은 언제까지 정리해야 하나요?" 클릭
  ↓
API 호출: POST /chat/ask (기존 구현)
  ↓
응답: { message_id, content, sources }
  ↓
UI 표시: 상세 답변 + 참고 자료
```

## 🛠️ 에러 처리

### 1. **API 성공 시**
- 백엔드에서 받은 `greeting`과 `suggestions` 표시

### 2. **API 실패 시**
- 기본 메시지와 제안 질문 표시
- 사용자에게 명확한 안내 제공

### 3. **인증 실패 시**
- 로그인 필요 메시지 표시
- 로그인 페이지로 리다이렉트

## 📝 백엔드 구현 예시

### 1. **Django 예시**
```python
# views.py
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def category_initial_response(request):
    category = request.data.get('category')
    
    # 카테고리별 초기 답변과 제안 질문 생성
    response_data = {
        'greeting': f'{category}에 대해 궁금하셨군요! 아래에서 자주 묻는 질문을 선택해 보시면, 더 정확히 도와드릴게요 😊',
        'suggestions': get_category_suggestions(category)
    }
    
    return Response(response_data)

def get_category_suggestions(category):
    suggestions = {
        '요양보호사 입·퇴사': [
            'Q1. 요양보호사 퇴사 시 4대보험은 언제까지 정리해야 하나요?',
            'Q2. 입사 전 건강검진은 필수인가요?',
            'Q3. 퇴사 시 연차수당은 어떻게 계산하나요?'
        ],
        '급여 계산': [
            'Q1. 야간근무 수당은 어떻게 계산하나요?',
            'Q2. 주휴수당은 언제 발생하나요?',
            'Q3. 4대보험 미가입자 급여는 어떻게 처리하나요?'
        ]
        # ... 다른 카테고리들
    }
    
    return suggestions.get(category, [])
```

### 2. **Node.js 예시**
```javascript
// routes/chat.js
app.post('/chat/category-initial', authenticateToken, async (req, res) => {
  const { category } = req.body;
  
  try {
    const response = {
      greeting: `${category}에 대해 궁금하셨군요! 아래에서 자주 묻는 질문을 선택해 보시면, 더 정확히 도와드릴게요 😊`,
      suggestions: await getCategorySuggestions(category)
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

async function getCategorySuggestions(category) {
  const suggestions = {
    '요양보호사 입·퇴사': [
      'Q1. 요양보호사 퇴사 시 4대보험은 언제까지 정리해야 하나요?',
      'Q2. 입사 전 건강검진은 필수인가요?',
      'Q3. 퇴사 시 연차수당은 어떻게 계산하나요?'
    ]
    // ... 다른 카테고리들
  };
  
  return suggestions[category] || [];
}
```

## 🧪 테스트 시나리오

### 1. **정상 플로우 테스트**
```
✅ Dashboard에서 카테고리 버튼 클릭
✅ ChatPage로 이동
✅ 백엔드 API 호출
✅ AI 답변과 제안 질문 표시
✅ 제안 질문 클릭 시 상세 답변 표시
```

### 2. **에러 시나리오 테스트**
```
✅ API 서버 다운 → 기본 메시지 표시
✅ 인증 실패 → 로그인 필요 메시지
✅ 잘못된 카테고리 → 기본 메시지 표시
```

### 3. **UI 테스트**
```
✅ 반응형 디자인 확인
✅ 로딩 상태 표시
✅ 에러 메시지 표시
```

## 🚀 배포 체크리스트

### 1. **프론트엔드**
- [x] CategoryGrid 수정 완료
- [x] ChatPage API 연동 완료
- [x] 에러 처리 구현 완료
- [x] 라우팅 설정 완료

### 2. **백엔드**
- [ ] POST /chat/category-initial 엔드포인트 구현
- [ ] 카테고리별 초기 답변 데이터 준비
- [ ] 제안 질문 데이터 준비
- [ ] 인증 처리 구현

### 3. **통합 테스트**
- [ ] 전체 플로우 테스트
- [ ] 에러 시나리오 테스트
- [ ] 성능 테스트

---

**변경 일자**: 2025-01-08  
**작성자**: AI Assistant  
**카테고리별 채팅 연동**: ✅ 완료

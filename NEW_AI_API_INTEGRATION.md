# 새로운 AI API 연동 가이드

## 🎯 JSON 응답 형식 기반 연동 완료

이미지에서 보신 JSON 응답 형식에 맞춰서 API 연동을 구현했습니다.

### 📋 새로운 API 엔드포인트

#### **POST /chat/ask**
- **기능**: AI에게 질문하고 구조화된 답변 받기
- **인증**: Bearer Token 필요
- **요청 형식**:
```json
{
  "message": "요양보호사 퇴사 시 4대보험 정리는 어떻게 하나요?"
}
```

- **응답 형식**:
```json
{
  "message_id": 7,
  "content": "[자세한 안내] 요양보호사가 퇴사할 경우, 4대보험 신고는 퇴사일로부터 14일 이내",
  "sources": [
    {
      "text": "제공하지 않는 조건으로 월 10만 원씩 지급받기로 담합하고 허위로 청구함",
      "score": 0.2648325264453888,
      "confidence": 0.791,
      "metadata": {
        "producer": "ezPDF Builder Supreme",
        "creator": "PyPDF",
        "creationdate": "2021-11-04T00:08:00+09:00",
        "moddate": "2021-11-04T09:12:22+09:00",
        "source": "/tmp/tmpdjdnyxgz.pdf",
        "total_pages": 221,
        "page": 23,
        "page_label": "24",
        "title": "(★211104) 2021년도_사회복지사_교육교재(전체본).pdf",
        "gs_path": "(★211104) 2021년도_사회복지사_교육교재(전체본).pdf",
        "score": 0.2648325264453888,
        "confidence": 0.791,
        "source_url": "https://storage.googleapis.com/carebridges-c689d.firebas"
      }
    }
  ]
}
```

## 🔧 구현된 기능

### 1. **새로운 API 함수**
```javascript
// src/api/chat.js
export const askAI = async (userMessage) => {
  const response = await instance.post('/chat/ask', {
    message: userMessage
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.data; // { message_id, content, sources }
};
```

### 2. **useChatMessages 훅 업데이트**
```javascript
// src/hooks/useChatMessages.js
const response = await askAI(text);

// sources 배열 처리
if (response.sources && Array.isArray(response.sources)) {
  sources = response.sources.map(source => ({
    title: source.metadata?.title || '관련 문서',
    url: source.metadata?.source_url || source.metadata?.source || '#',
    text: source.text || '',
    score: source.score || 0,
    confidence: source.confidence || 0
  }));
}

const botMessage = {
  id: response.message_id || Date.now() + 1,
  text: response.content,
  sender: 'ai',
  timestamp: new Date().toLocaleTimeString(),
  sources: sources
};
```

### 3. **AIMessage 컴포넌트 업데이트**
```javascript
// src/components/chat/AIMessage.jsx
const renderSources = () => {
  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-gray-500">📚</span>
        <div className="text-sm font-medium text-gray-700">참고 자료:</div>
      </div>
      <div className="space-y-2">
        {message.sources.map((source, index) => (
          <div key={`source-${message.id}-${index}`}>
            <div className="text-sm font-medium text-gray-800 mb-1">
              {source.title}
            </div>
            <div className="text-xs text-gray-600 mb-2">
              {source.text.substring(0, 100)}...
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>신뢰도: {Math.round((source.confidence || 0) * 100)}%</span>
              <span>•</span>
              <span>관련도: {Math.round((source.score || 0) * 100)}%</span>
            </div>
            <button onClick={() => onPdfDownload && onPdfDownload(source)}>
              문서 보기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 🎨 UI 표시 형식

### 1. **메인 답변**
- `content` 필드의 내용을 메인 답변으로 표시
- 마크다운 형식 지원 (굵게, 기울임 등)

### 2. **참고 자료 섹션**
- 📚 아이콘과 함께 "참고 자료:" 제목
- 각 소스별로 카드 형태로 표시
- 제목, 텍스트 미리보기, 신뢰도, 관련도 점수 표시
- "문서 보기" 버튼으로 PDF 다운로드 가능

### 3. **소스 정보 표시**
- **제목**: `source.metadata.title`
- **텍스트**: `source.text` (100자 미리보기)
- **신뢰도**: `source.confidence * 100` (%)
- **관련도**: `source.score * 100` (%)
- **URL**: `source.metadata.source_url`

## 🔄 데이터 플로우

### 1. **사용자 질문**
```
사용자 입력 → useChatMessages.sendMessage() → askAI() → POST /chat/ask
```

### 2. **AI 응답 처리**
```
API 응답 → { message_id, content, sources } → 메시지 객체 생성 → UI 표시
```

### 3. **소스 표시**
```
sources 배열 → 참고 자료 섹션 → 각 소스별 카드 표시
```

## 🛠️ 백엔드 요구사항

### 1. **API 엔드포인트**
```
POST /chat/ask
Content-Type: application/json
Authorization: Bearer {token}

{
  "message": "사용자 질문"
}
```

### 2. **응답 형식**
```json
{
  "message_id": 7,
  "content": "AI 답변 내용",
  "sources": [
    {
      "text": "소스 텍스트",
      "score": 0.26,
      "confidence": 0.79,
      "metadata": {
        "title": "문서 제목",
        "source_url": "https://example.com/document.pdf",
        "page": 23,
        "total_pages": 221
      }
    }
  ]
}
```

### 3. **인증 처리**
- Bearer Token 검증
- 401 오류 시 로그인 필요 메시지

## 🧪 테스트 시나리오

### 1. **정상 응답 테스트**
```
✅ 질문 입력 → AI 답변 표시
✅ 참고 자료 섹션 표시
✅ 신뢰도/관련도 점수 표시
✅ 문서 다운로드 버튼 동작
```

### 2. **에러 처리 테스트**
```
✅ 인증 실패 → 로그인 필요 메시지
✅ API 오류 → 오류 메시지 표시
✅ 소스 없음 → 참고 자료 섹션 숨김
```

### 3. **UI 테스트**
```
✅ 긴 텍스트 → 100자 미리보기
✅ 점수 표시 → 퍼센트 변환
✅ 반응형 → 모바일/데스크톱 대응
```

## 📝 사용 예시

### 1. **질문**: "요양보호사 퇴사 시 4대보험 정리는 어떻게 하나요?"

### 2. **AI 답변**: 
```
[자세한 안내] 요양보호사가 퇴사할 경우, 4대보험 신고는 퇴사일로부터 14일 이내
```

### 3. **참고 자료**:
```
📚 참고 자료:
📄 (★211104) 2021년도_사회복지사_교육교재(전체본).pdf
   제공하지 않는 조건으로 월 10만 원씩 지급받기로 담합하고 허위로 청구함...
   신뢰도: 79% • 관련도: 26%
   [문서 보기]
```

## 🚀 배포 체크리스트

### 1. **프론트엔드**
- [x] askAI API 함수 구현
- [x] useChatMessages 훅 업데이트
- [x] AIMessage 컴포넌트 업데이트
- [x] 소스 표시 UI 구현

### 2. **백엔드**
- [ ] POST /chat/ask 엔드포인트 구현
- [ ] JSON 응답 형식 구현
- [ ] 인증 처리 구현
- [ ] 소스 데이터 처리 구현

### 3. **통합 테스트**
- [ ] API 연동 테스트
- [ ] UI 표시 테스트
- [ ] 에러 처리 테스트
- [ ] 성능 테스트

---

**변경 일자**: 2025-01-08  
**작성자**: AI Assistant  
**새로운 AI API 형식**: ✅ 완료

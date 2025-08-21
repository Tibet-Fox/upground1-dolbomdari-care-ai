# carebridges-frontend
업그라운더 1기 돌봄다리 AI 챗봇 프론트엔드

## 프로젝트 개요
돌봄다리 AI 챗봇의 프론트엔드 애플리케이션입니다. 요양보호사들이 업무 관련 질문을 할 수 있는 인터랙티브한 채팅 인터페이스를 제공합니다.

## 주요 기능
- 🤖 AI 챗봇과의 실시간 대화
- 📋 프리셋 질문 (요양보호사 입·퇴사, 급여 계산 등)
- 💬 채팅 히스토리 관리
- ❓ FAQ 팝업 시스템
- 📱 반응형 디자인
- 🔐 사용자 인증 시스템

## 기술 스택
- React 18
- Vite
- Tailwind CSS
- Axios (API 통신)
- React Router DOM

## 설치 및 실행
```bash
npm install
npm run dev
```

## API 연동
- 백엔드 API: https://api.carebridges.o-r.kr
- 채팅 API: `/chat/messages/with-ai`
- FAQ API: `/faq/categories`, `/faq/questions`
- 인증 API: `/auth/login`, `/auth/register`

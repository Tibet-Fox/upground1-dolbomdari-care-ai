// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 외부 접속 허용
    allowedHosts: ['.ngrok-free.app'], // ngrok 주소 허용 (도메인 끝 부분 기준)
  },
})

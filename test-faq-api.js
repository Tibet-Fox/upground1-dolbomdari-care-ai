import axios from 'axios';

const API_BASE_URL = 'https://api.carebridges.o-r.kr';

// FAQ API 테스트 함수
async function testFaqAPI() {
  console.log('=== FAQ API 테스트 시작 ===\n');
  
  try {
    // 1. FAQ 카테고리 조회 테스트
    console.log('1. FAQ 카테고리 조회 테스트');
    console.log('요청: GET /faq/categories');
    
    const categoriesResponse = await axios.get(`${API_BASE_URL}/faq/categories`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ 카테고리 조회 성공');
    console.log('응답 데이터:', categoriesResponse.data);
    console.log('카테고리 개수:', categoriesResponse.data?.length || 0);
    
    // 2. 첫 번째 카테고리의 질문들 조회 테스트
    if (categoriesResponse.data && categoriesResponse.data.length > 0) {
      const firstCategory = categoriesResponse.data[0];
      console.log(`\n2. 카테고리 "${firstCategory.name}" (ID: ${firstCategory.id}) 질문 조회 테스트`);
      console.log(`요청: GET /faq/questions?category_id=${firstCategory.id}`);
      
      const questionsResponse = await axios.get(`${API_BASE_URL}/faq/questions`, {
        params: { category_id: firstCategory.id },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ 질문 조회 성공');
      console.log('응답 데이터:', questionsResponse.data);
      console.log('질문 개수:', questionsResponse.data?.length || 0);
      
      // 3. 첫 번째 질문의 상세 조회 테스트
      if (questionsResponse.data && questionsResponse.data.length > 0) {
        const firstQuestion = questionsResponse.data[0];
        console.log(`\n3. 질문 "${firstQuestion.question}" (ID: ${firstQuestion.id}) 상세 조회 테스트`);
        console.log(`요청: GET /faq/questions/${firstQuestion.id}`);
        
        const detailResponse = await axios.get(`${API_BASE_URL}/faq/questions/${firstQuestion.id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('✅ 상세 조회 성공');
        console.log('응답 데이터:', detailResponse.data);
      }
    }
    
  } catch (error) {
    console.log('❌ FAQ API 호출 실패');
    console.log('에러:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('인증이 필요합니다. 로그인이 필요할 수 있습니다.');
    }
  }
  
  console.log('\n=== FAQ API 테스트 완료 ===');
}

// 테스트 실행
testFaqAPI().catch(console.error);

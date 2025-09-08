import { useNavigate } from 'react-router-dom';

function SignupPopup({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleSignup = () => {
    onClose();
    navigate('/signup/step1');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* 팝업 */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 overflow-hidden relative">
          {/* 닫기 버튼 */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 팝업 내용 */}
          <div className="px-8 py-8 text-center">
            {/* 캐릭터 이미지 */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img 
                  src="/dolbom_sign.png" 
                  alt="돌봄 캐릭터" 
                  className="w-24 h-24 object-contain"
                  onError={(e) => {
                    console.log('이미지 로드 실패:', e.target.src);
                    e.target.src = '/svc.png'; // fallback 이미지
                  }}
                />
                {/* Wi-Fi 신호 아이콘 */}
                <div className="absolute -top-2 -right-2">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* 메시지 */}
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              앗! 아직 회원가입되지 않았어요!
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              로그인은 회원가입 후 이용하실 수 있어요
            </p>
            
            {/* 회원가입 버튼 */}
            <button
              onClick={handleSignup}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignupPopup;

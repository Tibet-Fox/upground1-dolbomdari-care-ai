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
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
          {/* 닫기 버튼 */}
          <div className="flex justify-end p-4">
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
          <div className="px-6 pb-6">
            <div className="flex items-start gap-4">
              {/* AI 캐릭터 이미지 */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <img 
                    src="/svc.png" 
                    alt="AI 캐릭터" 
                    className="w-20 h-20 object-contain"
                  />
                  {/* Wi-Fi 신호 끊김 표시 */}
                  <div className="absolute -top-1 -right-1">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 텍스트 내용 */}
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-800 mb-2">
                  앗! 아직 회원가입되지 않았어요!
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  로그인은 회원가입 후 이용하실 수 있어요
                </p>
                
                {/* 회원가입 버튼 */}
                <button
                  onClick={handleSignup}
                  className="w-full bg-blue-500 text-white py-2.5 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium text-sm"
                >
                  회원가입
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignupPopup;

function AIMessage({ message, onSuggestionClick, onPdfDownload }) {
  const isStructuredResponse = typeof message.text === 'object' && message.text.greeting;
  
  const renderStructuredMessage = () => {
    const { greeting, summary, explanation, references } = message.text;
    
    return (
      <div className="space-y-4">
        {/* 메인 답변 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <span className="text-blue-600 text-xl">🤖</span>
            <div className="flex-1">
              <div className="text-base font-semibold text-gray-800 leading-relaxed mb-2">
                답변
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">
                {greeting}
              </div>
            </div>
          </div>
        </div>
        
        {/* 핵심 요약 */}
        {summary && (
          <div className="bg-white border border-blue-200 p-4 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-blue-500 text-lg">💡</span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-blue-800 mb-2">핵심 요약</div>
                <div className="text-sm text-gray-700 leading-relaxed">{summary}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* 상세 설명 */}
        {explanation && (
          <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <span className="text-gray-600 text-lg">📋</span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-800 mb-2">상세 정보</div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  {explanation}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 관련 자료 */}
        {references && Array.isArray(references) && references.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-amber-600 text-lg">📚</span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-amber-800 mb-3">관련 자료</div>
                <div className="space-y-2">
                  {references.map((ref, index) => (
                    <div 
                      key={`reference-${index}-${ref.title || index}`} 
                      className="flex items-center gap-3 p-2 bg-white rounded border border-amber-200 hover:border-amber-300 cursor-pointer transition-all duration-200 hover:shadow-sm"
                      onClick={() => onPdfDownload && onPdfDownload(ref)}
                    >
                      <span className="text-amber-600">📄</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">{ref.title}</div>
                        <div className="text-xs text-gray-500">클릭하여 다운로드</div>
                      </div>
                      <span className="text-xs text-amber-600">→</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSimpleMessage = () => {
    if (typeof message.text === 'string') {
      // 텍스트를 문단으로 나누고 구조화
      const paragraphs = message.text.split('\n\n').filter(p => p.trim());
      
      return (
        <div className="space-y-3">
          {paragraphs.map((paragraph, index) => {
            // 숫자로 시작하는 문단 (예: 1., 2., 3.)
            if (/^\d+\./.test(paragraph.trim())) {
              return (
                <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                  <div className="text-sm text-gray-800 leading-relaxed">{paragraph}</div>
                </div>
              );
            }
            
            // 중요한 정보가 포함된 문단 (예: "필수", "주의", "중요")
            if (paragraph.includes('필수') || paragraph.includes('주의') || paragraph.includes('중요') || paragraph.includes('주의사항')) {
              return (
                <div key={index} className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 text-lg">⚠️</span>
                    <div className="text-sm text-gray-800 leading-relaxed">{paragraph}</div>
                  </div>
                </div>
              );
            }
            
            // 금액이나 수치가 포함된 문단
            if (paragraph.includes('원') || paragraph.includes('%') || /\d+시간/.test(paragraph) || /\d+일/.test(paragraph)) {
              return (
                <div key={index} className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 text-lg">💰</span>
                    <div className="text-sm text-gray-800 leading-relaxed">{paragraph}</div>
                  </div>
                </div>
              );
            }
            
            // 일반 문단
            return (
              <div key={index} className="text-sm text-gray-700 leading-relaxed">
                {paragraph.split('\n').map((line, lineIndex) => (
                  <div key={lineIndex} className="mb-1">
                    {line.trim().startsWith('•') ? (
                      <div className="flex items-start gap-2 ml-2">
                        <span className="text-blue-500 text-xs mt-1">•</span>
                        <span>{line.trim().substring(1)}</span>
                      </div>
                    ) : (
                      <span>{line}</span>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      );
    }
    
    return (
      <div className="bg-gray-50 border-l-4 border-gray-300 p-3 rounded-r-lg">
        <div className="text-sm text-gray-700 leading-relaxed">{message.text}</div>
      </div>
    );
  };

  const renderSources = () => {
    if (!message.sources || !Array.isArray(message.sources) || message.sources.length === 0) {
      return null;
    }

    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-500">📚</span>
          <div className="text-sm font-medium text-gray-700">참고 자료:</div>
        </div>
        <div className="space-y-2">
          {message.sources.map((source, index) => (
            <div 
              key={`source-${message.id}-${index}`} 
              className="flex items-start gap-3 p-2 bg-white rounded border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <span className="text-blue-500 text-sm">📄</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800 mb-1">
                  {source.title}
                </div>
                {source.text && (
                  <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {source.text.substring(0, 100)}...
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>신뢰도: {Math.round((source.confidence || 0) * 100)}%</span>
                  <span>•</span>
                  <span>관련도: {Math.round((source.score || 0) * 100)}%</span>
                </div>
                {source.url && source.url !== '#' && (
                  <button
                    onClick={() => onPdfDownload && onPdfDownload(source)}
                    className="mt-1 text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    문서 보기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {isStructuredResponse ? renderStructuredMessage() : renderSimpleMessage()}
      
      {/* 참고 자료 */}
      {renderSources()}
      
      {/* 제안 질문 */}
      {message.suggestions && Array.isArray(message.suggestions) && message.suggestions.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gray-600 text-lg">💬</span>
            <div className="text-sm font-semibold text-gray-700">추천 질문</div>
          </div>
          <div className="space-y-2">
            {message.suggestions.map((suggestion, index) => (
              <button
                key={`suggestion-${message.id}-${index}`}
                onClick={() => onSuggestionClick && onSuggestionClick(suggestion)}
                className="block w-full text-left bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-800 shadow-sm hover:shadow-md rounded-lg px-4 py-3 transition-all duration-200 group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 text-sm font-bold mt-0.5">
                    Q{index + 1}
                  </span>
                  <span className="text-sm leading-relaxed group-hover:text-blue-800 transition-colors">
                    {suggestion.replace(/^Q\d+\.\s*/, '')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AIMessage;


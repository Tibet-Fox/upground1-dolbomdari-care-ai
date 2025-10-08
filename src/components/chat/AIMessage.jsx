function AIMessage({ message, onSuggestionClick, onPdfDownload }) {
  const isStructuredResponse = typeof message.text === 'object' && message.text.greeting;
  
  const renderStructuredMessage = () => {
    const { greeting, summary, explanation, references } = message.text;
    
    return (
      <div className="space-y-4">
        {/* 메인 제목 */}
        <div className="text-lg font-semibold text-gray-800 leading-relaxed">{greeting}</div>
        
        {/* 핵심 요약 */}
        <div className="bg-white border-l-4 border-blue-400 p-4 rounded-r-lg shadow-sm">
          <div className="flex items-start gap-2">
            <span className="text-blue-500 text-lg">💡</span>
            <div className="text-sm font-medium text-blue-800 leading-relaxed">{summary}</div>
          </div>
        </div>
        
        {/* 상세 설명 */}
        <div className="text-gray-700 leading-relaxed text-sm">
          {explanation && typeof explanation === 'string' ? explanation.split('\n').map((line, index) => {
            if (line.includes('**')) {
              const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-800">$1</strong>');
              return (
                <div key={index} className="mb-2">
                  <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
                </div>
              );
            } else if (line.trim().startsWith('🏥') || line.trim().startsWith('📅') || line.trim().startsWith('⚠️')) {
              return (
                <div key={index} className="mb-3">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{line.split(' ')[0]}</span>
                    <span className="font-medium text-gray-800">{line.split(' ').slice(1).join(' ')}</span>
                  </div>
                </div>
              );
            } else if (line.trim().startsWith('•')) {
              return (
                <div key={index} className="ml-4 mb-1">
                  <span className="text-gray-600">{line}</span>
                </div>
              );
            } else if (line.trim() === '') {
              return <div key={index} className="mb-2"></div>;
            } else {
              return (
                <div key={index} className="mb-2 text-gray-700">
                  {line}
                </div>
              );
            }
          }) : <div className="text-gray-500 text-sm">설명이 없습니다.</div>}
        </div>
        
        {/* 관련 자료 */}
        {references && Array.isArray(references) && references.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-500">📚</span>
              <div className="text-sm font-medium text-gray-700">관련 자료:</div>
            </div>
            <div className="space-y-2">
              {references.map((ref, index) => (
                <div 
                  key={`reference-${index}-${ref.title || index}`} 
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                  onClick={() => onPdfDownload && onPdfDownload(ref)}
                >
                  <span>📄</span>
                  <span>{ref.title}</span>
                  <span className="text-xs text-gray-500">(클릭하여 다운로드)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSimpleMessage = () => {
    if (typeof message.text === 'string') {
      const formattedText = message.text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-800">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
      
      return (
        <div 
          className="whitespace-pre-line leading-relaxed text-sm"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      );
    }
    
    return <div className="whitespace-pre-line leading-relaxed text-sm">{message.text}</div>;
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
        <div className="mt-4 space-y-2">
          {message.suggestions.map((suggestion, index) => (
            <button
              key={`suggestion-${message.id}-${index}`}
              onClick={() => onSuggestionClick && onSuggestionClick(suggestion)}
              className="block w-full text-left text-sm bg-white border-2 border-blue-200 text-black shadow-md hover:border-blue-400 hover:shadow-lg rounded-xl px-4 py-3 transition-all duration-200 font-bold"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AIMessage;


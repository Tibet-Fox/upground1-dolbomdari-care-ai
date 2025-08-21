import React, { useState } from 'react';

const InlineStyleExample = () => {
  const [isHovered, setIsHovered] = useState(false);

  // 스타일 객체 정의
  const containerStyle = {
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    margin: '10px',
    transition: 'all 0.3s ease'
  };

  const titleStyle = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '15px'
  };

  const buttonStyle = {
    backgroundColor: isHovered ? '#0056b3' : '#007bff',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>인라인 스타일 예시</h1>
      <button 
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        호버 효과 버튼
      </button>
    </div>
  );
};

export default InlineStyleExample;

import React from 'react';

const ChatMessage = ({ message, isAI }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isAI ? 'flex-start' : 'flex-end',
        marginBottom: '10px',
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          padding: '10px 15px',
          borderRadius: '15px',
          backgroundColor: isAI ? '#f0f2f5' : '#0084ff',
          color: isAI ? '#333' : '#fff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          lineHeight: '1.4',
          fontSize: '14px',
          position: 'relative',
        }}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;

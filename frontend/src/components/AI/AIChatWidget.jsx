import React, { useState, useEffect, useRef } from 'react';
import aiService from '../../services/aiService';
import ChatMessage from './ChatMessage';

const AIChatWidget = ({ productId = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { text: "Hello! I'm your MarketBridge AI Advisor. How can I help you today?", isAI: true }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMsg = message.trim();
    setMessage('');
    setChatHistory(prev => [...prev, { text: userMsg, isAI: false }]);
    setIsLoading(true);

    try {
      const response = await aiService.sendMessage(userMsg, productId);
      setChatHistory(prev => [...prev, { text: response.response, isAI: true }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now. Please try again later.", isAI: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, fontFamily: 'Arial, sans-serif' }}>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#0084ff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            right: '0',
            width: '350px',
            height: '450px',
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '15px',
              backgroundColor: '#0084ff',
              color: 'white',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>MarketBridge AI Advisor</span>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>Online</div>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              padding: '15px',
              overflowY: 'auto',
              backgroundColor: '#f9f9f9',
            }}
          >
            {chatHistory.map((msg, index) => (
              <ChatMessage key={index} message={msg.text} isAI={msg.isAI} />
            ))}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
                <div style={{ backgroundColor: '#f0f2f5', padding: '10px 15px', borderRadius: '15px', fontSize: '12px', color: '#666' }}>
                  AI is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '10px',
              borderTop: '1px solid #eee',
              display: 'flex',
              gap: '10px',
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '20px',
                border: '1px solid #ddd',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              style={{
                backgroundColor: '#0084ff',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                cursor: 'pointer',
                opacity: isLoading || !message.trim() ? 0.5 : 1,
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatWidget;

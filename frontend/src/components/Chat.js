import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import { socketEvents } from '../utils/socket';
import './Chat.css';

function Chat({ socket, userName, roomId }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.on(socketEvents.NEW_MESSAGE, (data) => {
      setMessages(prev => [...prev, {
        sender: data.sender,
        message: data.message,
        timestamp: new Date(data.timestamp),
        isOwn: false
      }]);
    });

    return () => {
      socket.off(socketEvents.NEW_MESSAGE);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !socket) return;

    const message = {
      sender: userName,
      message: inputMessage,
      timestamp: new Date(),
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    socket.emit(socketEvents.CHAT_MESSAGE, {
      roomId,
      senderName: userName,
      message: inputMessage
    });
    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat</h3>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.isOwn ? 'own' : 'other'}`}
          >
            <div className="message-sender">{msg.sender}</div>
            <div className="message-content">{msg.message}</div>
            <div className="message-time">
              {msg.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-wrapper">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="chat-input"
          rows="2"
        />
        <button
          onClick={handleSendMessage}
          className="send-btn"
          disabled={!inputMessage.trim()}
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
}

export default Chat;

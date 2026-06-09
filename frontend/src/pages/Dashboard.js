import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import './Dashboard.css';

function Dashboard() {
  const [roomId, setRoomId] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const createRoom = () => {
    const newRoomId = uuidv4();
    setRoomId(newRoomId);
  };

  const joinRoom = () => {
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }
    navigate(`/room/${roomId}`);
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Video Conferencing App</h1>
        <div className="user-section">
          {user && <span>Welcome, {user.userName}!</span>}
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="room-card">
          <h2>Create or Join a Room</h2>
          
          {error && <div className="error">{error}</div>}

          <div className="action-section">
            <div>
              <h3>Create New Room</h3>
              <p>Start a new video conference</p>
              <button onClick={createRoom} className="primary-btn">
                Create Room
              </button>
            </div>

            <div>
              <h3>Join Existing Room</h3>
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => {
                  setRoomId(e.target.value);
                  setError('');
                }}
              />
              <button onClick={joinRoom} className="primary-btn">
                Join Room
              </button>
            </div>
          </div>

          {roomId && (
            <div className="room-info">
              <h3>Room Created!</h3>
              <p>Room ID: <strong>{roomId}</strong></p>
              <p>Share this ID with others to join</p>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(roomId);
                  alert('Room ID copied to clipboard!');
                }}
                className="copy-btn"
              >
                Copy Room ID
              </button>
              <button 
                onClick={() => navigate(`/room/${roomId}`)}
                className="primary-btn"
              >
                Enter Room
              </button>
            </div>
          )}
        </div>

        <div className="features-card">
          <h2>Features</h2>
          <ul>
            <li>✓ Multi-user Video Calling with WebRTC</li>
            <li>✓ Screen Sharing Capability</li>
            <li>✓ Real-time File Sharing</li>
            <li>✓ Collaborative Whiteboard</li>
            <li>✓ Encrypted Communication</li>
            <li>✓ Real-time Chat</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

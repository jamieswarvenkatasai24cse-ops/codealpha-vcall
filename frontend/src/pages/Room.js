import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { createSocket, socketEvents } from '../utils/socket';
import { useWebRTC } from '../hooks/useWebRTC';
import { useLocalMedia } from '../hooks/useLocalMedia';
import VideoContainer from '../components/VideoContainer';
import ScreenShare from '../components/ScreenShare';
import FileSharing from '../components/FileSharing';
import Whiteboard from '../components/Whiteboard';
import Chat from '../components/Chat';
import './Room.css';

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [screenSharing, setScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState('video');
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const {
    localStream,
    videoEnabled,
    audioEnabled,
    startLocalMedia,
    toggleVideo,
    toggleAudio,
    stopLocalMedia
  } = useLocalMedia();

  const webrtc = useWebRTC(socket, roomId, user.id);

  // Initialize socket and media
  useEffect(() => {
    const initializeRoom = async () => {
      try {
        // Start local media
        await startLocalMedia();

        // Create socket connection
        const token = Cookies.get('authToken');
        const newSocket = createSocket(token);

        newSocket.on(socketEvents.CONNECT, () => {
          console.log('Connected to server');
          newSocket.emit('join-room', roomId, user.id, user.userName);
        });

        newSocket.on(socketEvents.ROOM_USERS, (roomUsers) => {
          setUsers(roomUsers);
          // Create offer for each user in the room
          roomUsers.forEach(u => {
            if (u.userId !== user.id && !webrtc.peerConnections.has(u.userId)) {
              webrtc.createOffer(u.userId, localStream);
            }
          });
        });

        newSocket.on(socketEvents.OFFER, (data) => {
          webrtc.handleOffer(data, localStream);
        });

        newSocket.on(socketEvents.ANSWER, (data) => {
          webrtc.handleAnswer(data);
        });

        newSocket.on(socketEvents.ICE_CANDIDATE, (data) => {
          webrtc.handleIceCandidate(data);
        });

        newSocket.on('stream-data', (data) => {
          // Handle incoming streams
          const peerConnection = webrtc.peerConnections.get(data.from);
          if (peerConnection) {
            peerConnection.ontrack = (event) => {
              setRemoteStreams(prev => {
                const newStreams = new Map(prev);
                newStreams.set(data.from, event.streams[0]);
                return newStreams;
              });
            };
          }
        });

        newSocket.on(socketEvents.USER_LEFT, (data) => {
          webrtc.closePeerConnection(data.userId);
          setRemoteStreams(prev => {
            const newStreams = new Map(prev);
            newStreams.delete(data.userId);
            return newStreams;
          });
        });

        setSocket(newSocket);
      } catch (err) {
        setError('Failed to initialize room');
        console.error(err);
      }
    };

    initializeRoom();

    return () => {
      stopLocalMedia();
      webrtc.closeAllConnections();
      if (socket) {
        socket.disconnect();
      }
    };
  }, [roomId, user.id, user.userName]);

  const handleLeaveRoom = () => {
    stopLocalMedia();
    webrtc.closeAllConnections();
    if (socket) {
      socket.disconnect();
    }
    navigate('/dashboard');
  };

  const handleScreenShare = async () => {
    try {
      if (screenSharing) {
        setScreenSharing(false);
        socket.emit(socketEvents.SCREEN_SHARE_STOP);
      } else {
        setScreenSharing(true);
        socket.emit(socketEvents.SCREEN_SHARE_START, { userName: user.userName });
      }
    } catch (err) {
      setError('Screen sharing failed');
    }
  };

  return (
    <div className="room-container">
      <div className="room-header">
        <h1>Video Conference - {roomId}</h1>
        <button className="leave-btn" onClick={handleLeaveRoom}>Leave Room</button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="room-content">
        <div className="video-section">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'video' ? 'active' : ''}`}
              onClick={() => setActiveTab('video')}
            >
              Video
            </button>
            <button
              className={`tab ${activeTab === 'screen' ? 'active' : ''}`}
              onClick={() => setActiveTab('screen')}
            >
              Screen Share
            </button>
            <button
              className={`tab ${activeTab === 'whiteboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('whiteboard')}
            >
              Whiteboard
            </button>
            <button
              className={`tab ${activeTab === 'files' ? 'active' : ''}`}
              onClick={() => setActiveTab('files')}
            >
              Files
            </button>
          </div>

          {activeTab === 'video' && (
            <VideoContainer
              localStream={localStream}
              remoteStreams={remoteStreams}
              users={users}
              videoEnabled={videoEnabled}
              audioEnabled={audioEnabled}
              onToggleVideo={toggleVideo}
              onToggleAudio={toggleAudio}
              onScreenShare={handleScreenShare}
              screenSharing={screenSharing}
            />
          )}

          {activeTab === 'screen' && (
            <ScreenShare
              socket={socket}
              userName={user.userName}
              screenSharing={screenSharing}
              onToggleScreenShare={handleScreenShare}
            />
          )}

          {activeTab === 'whiteboard' && (
            <Whiteboard socket={socket} userId={user.id} />
          )}

          {activeTab === 'files' && (
            <FileSharing socket={socket} roomId={roomId} userName={user.userName} />
          )}
        </div>

        <Chat socket={socket} userName={user.userName} roomId={roomId} />
      </div>
    </div>
  );
}

export default Room;

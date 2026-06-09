import React, { useRef, useEffect, useState } from 'react';
import { FiMonitor, FiX } from 'react-icons/fi';
import { getDisplayStream, replaceTrack } from '../utils/webrtc';
import './ScreenShare.css';

function ScreenShare({ socket, userName, screenSharing, onToggleScreenShare }) {
  const screenVideoRef = useRef(null);
  const screenStreamRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (screenSharing) {
      startScreenShare();
    } else {
      stopScreenShare();
    }
  }, [screenSharing]);

  const startScreenShare = async () => {
    try {
      const stream = await getDisplayStream();
      screenStreamRef.current = stream;
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = stream;
      }

      stream.getVideoTracks()[0].onended = () => {
        onToggleScreenShare();
      };

      socket?.emit('screen-share-start', { userName });
    } catch (err) {
      setError('Failed to start screen sharing');
      onToggleScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    socket?.emit('screen-share-stop');
  };

  return (
    <div className="screen-share-container">
      {error && <div className="error">{error}</div>}

      {screenSharing ? (
        <div className="screen-sharing-active">
          <video
            ref={screenVideoRef}
            autoPlay
            playsInline
            className="screen-video"
          />
          <div className="screen-info">
            <p>🔴 Screen Sharing Active</p>
            <button onClick={() => onToggleScreenShare()} className="stop-btn">
              <FiX /> Stop Sharing
            </button>
          </div>
        </div>
      ) : (
        <div className="screen-share-prompt">
          <FiMonitor size={48} />
          <h3>Screen Sharing</h3>
          <p>Share your screen with other participants</p>
          <button onClick={() => onToggleScreenShare()} className="start-btn">
            Start Screen Share
          </button>
        </div>
      )}
    </div>
  );
}

export default ScreenShare;

import React, { useRef, useEffect } from 'react';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiMonitor, FiX } from 'react-icons/fi';
import './VideoContainer.css';

function VideoContainer({
  localStream,
  remoteStreams,
  users,
  videoEnabled,
  audioEnabled,
  onToggleVideo,
  onToggleAudio,
  onScreenShare,
  screenSharing
}) {
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});

  // Set up local video stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Set up remote video streams
  useEffect(() => {
    remoteStreams.forEach((stream, userId) => {
      if (remoteVideoRefs.current[userId]) {
        remoteVideoRefs.current[userId].srcObject = stream;
      }
    });
  }, [remoteStreams]);

  return (
    <div className="video-container">
      <div className="videos-grid">
        <div className="local-video">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="video-element"
          />
          <div className="video-label">You</div>
        </div>

        {Array.from(remoteStreams.entries()).map(([userId, stream]) => (
          <div key={userId} className="remote-video">
            <video
              ref={(ref) => {
                if (ref) remoteVideoRefs.current[userId] = ref;
              }}
              autoPlay
              playsInline
              className="video-element"
            />
            <div className="video-label">
              {users.find(u => u.userId === userId)?.userName || 'User'}
            </div>
          </div>
        ))}
      </div>

      <div className="controls">
        <button
          className={`control-btn ${audioEnabled ? 'active' : ''}`}
          onClick={() => onToggleAudio(!audioEnabled)}
          title="Toggle Microphone"
        >
          {audioEnabled ? <FiMic size={20} /> : <FiMicOff size={20} />}
        </button>

        <button
          className={`control-btn ${videoEnabled ? 'active' : ''}`}
          onClick={() => onToggleVideo(!videoEnabled)}
          title="Toggle Camera"
        >
          {videoEnabled ? <FiVideo size={20} /> : <FiVideoOff size={20} />}
        </button>

        <button
          className={`control-btn ${screenSharing ? 'active' : ''}`}
          onClick={onScreenShare}
          title="Share Screen"
        >
          <FiMonitor size={20} />
        </button>
      </div>
    </div>
  );
}

export default VideoContainer;

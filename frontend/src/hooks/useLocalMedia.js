import { useRef, useCallback, useState } from 'react';
import { getMediaStream, replaceTrack } from '../utils/webrtc';

export const useLocalMedia = () => {
  const localStreamRef = useRef(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [error, setError] = useState(null);

  const startLocalMedia = useCallback(async () => {
    try {
      const stream = await getMediaStream();
      localStreamRef.current = stream;
      return stream;
    } catch (err) {
      setError('Unable to access camera/microphone');
      throw err;
    }
  }, []);

  const toggleVideo = useCallback(async (enable) => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = enable;
      });
      setVideoEnabled(enable);
    }
  }, []);

  const toggleAudio = useCallback(async (enable) => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = enable;
      });
      setAudioEnabled(enable);
    }
  }, []);

  const stopLocalMedia = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
  }, []);

  return {
    localStream: localStreamRef.current,
    videoEnabled,
    audioEnabled,
    startLocalMedia,
    toggleVideo,
    toggleAudio,
    stopLocalMedia,
    error
  };
};

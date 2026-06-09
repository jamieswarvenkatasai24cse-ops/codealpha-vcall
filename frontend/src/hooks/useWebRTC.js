import { useRef, useCallback } from 'react';
import {
  createPeerConnection,
  createOffer,
  createAnswer,
  addIceCandidate,
  getMediaStream,
  replaceTrack
} from '../utils/webrtc';

export const useWebRTC = (socket, roomId, userId) => {
  const peerConnections = useRef(new Map());
  const dataChannels = useRef(new Map());

  const createPeerConnectionForUser = useCallback(async (peerId, stream) => {
    try {
      const peerConnection = createPeerConnection();
      peerConnections.current.set(peerId, peerConnection);

      // Add local stream tracks
      if (stream) {
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            to: peerId,
            candidate: event.candidate
          });
        }
      };

      // Create data channel for chat/metadata
      const dataChannel = peerConnection.createDataChannel('chat');
      setupDataChannel(dataChannel, peerId);
      dataChannels.current.set(peerId, dataChannel);

      // Handle incoming data channels
      peerConnection.ondatachannel = (event) => {
        setupDataChannel(event.channel, peerId);
      };

      return peerConnection;
    } catch (error) {
      console.error('Error creating peer connection:', error);
      throw error;
    }
  }, [socket]);

  const setupDataChannel = (dataChannel, peerId) => {
    dataChannel.onopen = () => console.log('Data channel opened with:', peerId);
    dataChannel.onerror = (error) => console.error('Data channel error:', error);
    dataChannel.onclose = () => console.log('Data channel closed with:', peerId);
  };

  const createOffer_ = useCallback(async (peerId, stream) => {
    try {
      const peerConnection = await createPeerConnectionForUser(peerId, stream);
      const offer = await createOffer(peerConnection);
      socket.emit('offer', {
        to: peerId,
        offer: offer
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }, [socket, createPeerConnectionForUser]);

  const handleOffer = useCallback(async (data, stream) => {
    try {
      let peerConnection = peerConnections.current.get(data.from);
      if (!peerConnection) {
        peerConnection = await createPeerConnectionForUser(data.from, stream);
      }

      const answer = await createAnswer(peerConnection, data.offer);
      socket.emit('answer', {
        to: data.from,
        answer: answer
      });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }, [socket, createPeerConnectionForUser]);

  const handleAnswer = useCallback(async (data) => {
    try {
      const peerConnection = peerConnections.current.get(data.from);
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }, []);

  const handleIceCandidate = useCallback(async (data) => {
    try {
      const peerConnection = peerConnections.current.get(data.from);
      if (peerConnection && data.candidate) {
        await addIceCandidate(peerConnection, data.candidate);
      }
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }, []);

  const sendMessage = useCallback((peerId, message) => {
    const dataChannel = dataChannels.current.get(peerId);
    if (dataChannel && dataChannel.readyState === 'open') {
      dataChannel.send(JSON.stringify(message));
    }
  }, []);

  const closePeerConnection = useCallback((peerId) => {
    const peerConnection = peerConnections.current.get(peerId);
    if (peerConnection) {
      peerConnection.close();
      peerConnections.current.delete(peerId);
    }

    const dataChannel = dataChannels.current.get(peerId);
    if (dataChannel) {
      dataChannel.close();
      dataChannels.current.delete(peerId);
    }
  }, []);

  const closeAllConnections = useCallback(() => {
    peerConnections.current.forEach((pc) => pc.close());
    peerConnections.current.clear();
    dataChannels.current.forEach((dc) => dc.close());
    dataChannels.current.clear();
  }, []);

  return {
    peerConnections: peerConnections.current,
    dataChannels: dataChannels.current,
    createOffer: createOffer_,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    sendMessage,
    closePeerConnection,
    closeAllConnections
  };
};

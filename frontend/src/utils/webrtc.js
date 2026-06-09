const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ]
};

export const createPeerConnection = () => {
  return new RTCPeerConnection({
    iceServers: ICE_SERVERS.iceServers
  });
};

export const createOffer = async (peerConnection) => {
  try {
    const offer = await peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    await peerConnection.setLocalDescription(offer);
    return offer;
  } catch (error) {
    console.error('Error creating offer:', error);
    throw error;
  }
};

export const createAnswer = async (peerConnection, offer) => {
  try {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return answer;
  } catch (error) {
    console.error('Error creating answer:', error);
    throw error;
  }
};

export const addIceCandidate = async (peerConnection, candidate) => {
  try {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (error) {
    console.error('Error adding ICE candidate:', error);
  }
};

export const getMediaStream = async (constraints = {
  audio: true,
  video: { width: { ideal: 1280 }, height: { ideal: 720 } }
}) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    console.error('Error getting media stream:', error);
    throw error;
  }
};

export const getDisplayStream = async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { cursor: 'always' },
      audio: false
    });
    return stream;
  } catch (error) {
    console.error('Error getting display stream:', error);
    throw error;
  }
};

export const replaceTrack = async (peerConnection, newStream, trackType = 'video') => {
  try {
    const newTrack = newStream.getTracks().find(t => t.kind === trackType);
    const sender = peerConnection.getSenders().find(s => s.track?.kind === trackType);
    
    if (sender && newTrack) {
      await sender.replaceTrack(newTrack);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error replacing track:', error);
    throw error;
  }
};

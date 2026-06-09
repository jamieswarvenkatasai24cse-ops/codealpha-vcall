import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';

export const createSocket = (token) => {
  return io(SOCKET_SERVER_URL, {
    auth: {
      token
    }
  });
};

export const socketEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  ROOM_USERS: 'room-users',
  OFFER: 'offer',
  ANSWER: 'answer',
  ICE_CANDIDATE: 'ice-candidate',
  SCREEN_SHARE_START: 'screen-share-start',
  SCREEN_SHARE_STOP: 'screen-share-stop',
  WHITEBOARD_DRAW: 'whiteboard-draw',
  WHITEBOARD_UPDATE: 'whiteboard-update',
  WHITEBOARD_CLEAR: 'whiteboard-clear',
  WHITEBOARD_CLEARED: 'whiteboard-cleared',
  FILE_SHARED: 'file-shared',
  FILE_RECEIVED: 'file-received',
  CHAT_MESSAGE: 'chat-message',
  NEW_MESSAGE: 'new-message'
};

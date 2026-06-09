# System Architecture - Video Conferencing App

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                             │
├─────────────────────────────────────────────────────────────────┤
│                     React Frontend (Port 3000)                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Pages: Login, Register, Dashboard, Room              │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Components: Video, ScreenShare, Files, Whiteboard    │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  WebRTC: Peer Connections, Media Streams              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            │                                     │
│        Socket.io           │           HTTP/REST               │
│       (Real-time)          │         (API Calls)               │
│                            │                                     │
└────────────────┬───────────┼────────────────────────────────────┘
                 │           │
         ┌───────▼───────────▼────────────┐
         │   Node.js Backend (Port 5000)  │
         ├────────────────────────────────┤
         │  Express Server + Socket.io    │
         │  - Authentication (JWT)        │
         │  - Room Management             │
         │  - WebRTC Signaling            │
         │  - File Handling               │
         │  - User Management             │
         └────────────────────────────────┘
```

## Component Architecture

### Frontend Components

```
App.js
├── AuthPages
│   ├── Login.js         - User login interface
│   └── Register.js      - User registration
├── Dashboard.js         - Room creation/joining
└── Room.js              - Main conference interface
    ├── VideoContainer.js     - Video streams & controls
    ├── ScreenShare.js        - Screen sharing feature
    ├── FileSharing.js        - File upload/download
    ├── Whiteboard.js         - Drawing canvas
    └── Chat.js               - Real-time messaging
```

### Custom Hooks

**useWebRTC** - Manages WebRTC peer connections
```
├── createPeerConnectionForUser()
├── createOffer()
├── handleOffer()
├── handleAnswer()
├── handleIceCandidate()
├── sendMessage()
├── closePeerConnection()
└── closeAllConnections()
```

**useLocalMedia** - Manages camera and microphone
```
├── startLocalMedia()      - Initialize camera/mic
├── toggleVideo()          - Enable/disable video
├── toggleAudio()          - Enable/disable audio
├── stopLocalMedia()       - Stop all streams
└── error handling
```

### Utility Modules

**socket.js** - Socket.io connection management
- Creates socket instance
- Defines event constants
- Event types: join-room, offer, answer, ice-candidate, etc.

**webrtc.js** - WebRTC helpers
- Peer connection creation
- Offer/Answer creation
- ICE candidate handling
- Media stream management
- Screen sharing utilities

**crypto.js** - Encryption/Decryption
- AES encryption for messages
- SHA256 hashing
- Message serialization

**api.js** - HTTP API client
- Axios instance with token injection
- Auth endpoints (register, login)
- User endpoints (profile, list)
- File endpoints (upload, download)

## Backend Architecture

```
server.js (Main Entry Point)
├── Express App Setup
├── CORS Configuration
├── Routes Mounting
│   ├── /api/auth       → authRoutes
│   ├── /api/users      → userRoutes
│   └── /api/files      → fileRoutes
└── Socket.io Server
    └── Event Handlers (see below)
```

### Backend Routes

```
auth.js (routes/auth.js)
├── POST /register      → authController.register()
├── POST /login         → authController.login()
└── POST /logout        → authController.logout()

users.js (routes/users.js)
├── GET /profile        → Get user profile
└── GET /list           → Get all users

files.js (routes/files.js)
├── POST /upload        → Upload file
└── GET /download/:id   → Download file
```

### WebRTC Signaling Flow

```
User A                              User B
   │                                   │
   ├─ createOffer() ─────Socket.io──→ │
   │                                   │
   │ ← createAnswer() ──Socket.io─ ────┤
   │                                   │
   ├─ ICE Candidate ──Socket.io──────→ │
   │                                   │
   ├─ ICE Candidate ──Socket.io──────→ │
   │                                   │
   └─────── WebRTC P2P Connection ────→
         (Video/Audio Streams)
         (Encrypted by default)
```

### Socket.io Events

**Connection Management:**
- `connect` - Client connects to server
- `disconnect` - Client disconnects
- `join-room` - User joins conference room
- `user-joined` - Broadcast when user joins
- `user-left` - Broadcast when user leaves
- `room-users` - List of users in room

**WebRTC Signaling:**
- `offer` - WebRTC offer for new connection
- `answer` - WebRTC answer response
- `ice-candidate` - ICE candidate for NAT traversal

**Feature Events:**
- `screen-share-start` - Screen sharing started
- `screen-share-stop` - Screen sharing stopped
- `file-shared` - File shared notification
- `whiteboard-draw` - Drawing update
- `whiteboard-clear` - Canvas cleared
- `chat-message` - Chat message sent
- `new-message` - Chat message received

## Data Flow Diagrams

### Authentication Flow

```
1. User enters credentials
2. Frontend sends POST /auth/register
3. Backend hashes password with bcryptjs
4. Backend creates JWT token
5. Frontend stores token in cookie/localStorage
6. Token sent in Authorization header for future requests
```

### Video Call Flow

```
1. User A joins room → emits "join-room"
2. Server broadcasts user A to others
3. User B receives notification
4. User B calls createOffer()
5. Offer sent via Socket.io to User A
6. User A calls createAnswer()
7. Answer sent back via Socket.io
8. Both exchange ICE candidates
9. WebRTC P2P connection established
10. Media streams flow directly between peers
```

### Screen Sharing Flow

```
1. User clicks "Start Screen Share"
2. navigator.mediaDevices.getDisplayMedia() prompts user
3. User selects screen/window
4. New video track obtained
5. sender.replaceTrack() swaps camera with screen
6. "screen-share-start" event sent to others
7. Other users receive notification
8. When stopped, camera track restored via replaceTrack()
```

### File Sharing Flow

```
1. User selects file
2. FileReader reads file as Base64
3. POST /api/files/upload with Base64 data
4. Backend stores file temporarily
5. Returns download URL
6. File info broadcast to other users
7. Users can download via GET /api/files/download/:id
8. Download stream sent to browser
```

### Whiteboard Flow

```
1. User draws on canvas
2. onMouseMove captures coordinates
3. Local canvas draws immediately
4. "whiteboard-draw" event sent with coordinates, color, size
5. Server broadcasts to other users
6. Other users' canvas updates via received event
7. Real-time synchronization across all participants
```

## Security Architecture

### Authentication
```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ Enter credentials
       ▼
┌─────────────────────────────┐
│  Backend Auth Controller    │
├─────────────────────────────┤
│ 1. Validate input          │
│ 2. Find user in DB         │
│ 3. bcryptjs.compare()      │
│    └─ Hash password        │
│    └─ Compare with stored  │
│ 4. If match: Create JWT    │
│    └─ Sign with secret     │
│    └─ Expires in 7 days    │
└──────┬──────────────────────┘
       │ Return token
       ▼
┌─────────────┐
│   Frontend  │
├─────────────┤
│ Store token │
│ Attach to   │
│ requests    │
└─────────────┘
```

### Encryption Flow
```
Message → AES-256-GCM Encryption → Encrypted String
                                    ↓
                              Socket.io Event
                                    ↓
Encrypted String → AES-256-GCM Decryption → Original Message
```

### WebRTC Security
```
Peer A ←─── DTLS-SRTP ───→ Peer B
(Encrypts media stream)
```
- DTLS: Encrypts control data
- SRTP: Encrypts audio/video

## Scalability Considerations

### Current Implementation
- In-memory storage (Map objects)
- Single server instance
- Direct peer connections (P2P)

### To Scale:
```
Frontend Layer:
├── Load Balancer
├── Multiple Node.js instances
└── Session store (Redis)

Backend Layer:
├── Database (MongoDB)
├── Redis for caching
├── WebSocket scaling (Socket.io adapter)
└── Microservices (Authentication, Files, etc.)

Media Layer:
├── TURN servers for NAT traversal
├── Media relay servers
└── Recording/Transcoding services
```

## Environment & Configuration

```
Frontend:
- React development server (port 3000)
- Configuration via environment variables
- API base URL points to backend

Backend:
- Express server (port 5000)
- Socket.io on same port
- Configuration via .env file
  ├── PORT
  ├── CLIENT_URL
  ├── JWT_SECRET
  └── NODE_ENV
```

## Error Handling Strategy

```
Frontend Errors:
├── Network errors → Retry with exponential backoff
├── WebRTC errors → Fallback to video-only or audio-only
├── Permission errors → User guidance
└── Validation errors → Form feedback

Backend Errors:
├── Authentication → 401 Unauthorized
├── Validation → 400 Bad Request
├── Not found → 404 Not Found
├── Server errors → 500 Internal Server Error
└── Socket errors → Event fallback
```

## Performance Optimization

```
1. WebRTC Optimization:
   - Bitrate adaptation
   - VP9/H.264 codec selection
   - Resolution scaling

2. Socket.io Optimization:
   - Binary protocols
   - Message compression
   - Connection pooling

3. React Optimization:
   - useMemo for expensive calculations
   - useCallback for event handlers
   - Code splitting
   - Lazy loading

4. Network Optimization:
   - STUN server caching
   - Message batching
   - Bandwidth monitoring
```

---

This architecture supports the core features while maintaining security, performance, and scalability for future enhancements.

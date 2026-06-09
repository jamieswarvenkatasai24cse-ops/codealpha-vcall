# Real-Time Video Conferencing & Collaboration App

A full-stack web application for real-time video conferencing with advanced collaboration features including screen sharing, file sharing, and collaborative whiteboarding.

## 🚀 Features

### Core Communication
- **Multi-user Video Calling** - WebRTC-based peer-to-peer video conferencing for multiple participants
- **Screen Sharing** - Share your screen or specific applications with other participants
- **Real-time Chat** - Text-based communication during video calls with Socket.io
- **Data Encryption** - End-to-end encryption for secure communication

### Collaboration Tools
- **Collaborative Whiteboard** - Draw, write, and collaborate on a shared canvas in real-time
- **File Sharing** - Upload and share files with all conference participants
- **User Management** - Create accounts, manage profiles, and user authentication

### Technical Features
- **Secure Authentication** - JWT-based authentication with bcryptjs password hashing
- **Real-time Synchronization** - Socket.io for instant updates across all participants
- **Browser Compatibility** - Works on modern browsers with WebRTC support
- **Responsive Design** - Optimized for desktop and tablet use

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Socket.io Client** - Real-time bidirectional communication
- **WebRTC** - Peer-to-peer media streaming
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **crypto-js** - Client-side encryption
- **React Icons** - UI icon library

### Backend
- **Node.js & Express** - Server framework
- **Socket.io** - Real-time communication server
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Prerequisites

- Node.js v14+ and npm
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Webcam and microphone for video calling

## 🔧 Installation & Setup

### 1. Clone and Navigate
```bash
cd CodeAlpha-vcall
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```
PORT=5000
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🚀 Usage

1. **Register Account**
   - Navigate to http://localhost:3000
   - Click "Register" and create a new account
   - Enter username, email, and password

2. **Create or Join a Room**
   - After login, you'll see the dashboard
   - Click "Create Room" to start a new conference
   - Or enter a Room ID to join an existing room
   - Share the Room ID with other participants

3. **Video Conference**
   - Once in a room, your video will start automatically
   - Use controls to toggle camera/microphone
   - Click "Screen Share" to share your screen
   - Switch tabs to access other features

4. **Features During Call**
   - **Video Tab** - See all participant videos and control your camera/mic
   - **Screen Share Tab** - Share your screen with participants
   - **Whiteboard Tab** - Collaborate on a shared drawing canvas
   - **Files Tab** - Upload and download files with participants
   - **Chat** - Send and receive text messages

## 🏗️ Project Structure

```
CodeAlpha-vcall/
├── frontend/                    # React application
│   ├── public/                 # Static files
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── VideoContainer.js
│   │   │   ├── ScreenShare.js
│   │   │   ├── FileSharing.js
│   │   │   ├── Whiteboard.js
│   │   │   └── Chat.js
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useWebRTC.js
│   │   │   └── useLocalMedia.js
│   │   ├── pages/              # Page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   └── Room.js
│   │   ├── utils/              # Utility functions
│   │   │   ├── socket.js
│   │   │   ├── webrtc.js
│   │   │   ├── crypto.js
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/                     # Node.js/Express server
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── files.js
│   ├── controllers/            # Request handlers
│   │   └── authController.js
│   ├── middleware/             # Express middleware
│   │   └── auth.js
│   ├── utils/                  # Utility functions
│   │   └── encryption.js
│   ├── server.js              # Main server file
│   ├── .env                   # Environment variables
│   └── package.json
│
└── .github/
    └── copilot-instructions.md
```

## 🔐 Security Features

1. **Authentication**
   - User registration with email and password
   - JWT-based session management
   - Secure password hashing with bcryptjs

2. **Data Encryption**
   - AES-256-GCM encryption for messages
   - Secure WebRTC peer-to-peer communication
   - HTTPS recommended for production

3. **Privacy**
   - End-to-end encryption for calls
   - No data stored on servers during calls
   - User control over camera/microphone

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/list` - List all users

### Files
- `POST /api/files/upload` - Upload a file
- `GET /api/files/download/:fileId` - Download a file

## 🔌 Socket.io Events

### Room Management
- `join-room` - Join a video conference room
- `user-joined` - Notification when user joins
- `user-left` - Notification when user leaves
- `room-users` - List of users in room

### WebRTC Signaling
- `offer` - WebRTC offer exchange
- `answer` - WebRTC answer exchange
- `ice-candidate` - ICE candidate for connectivity

### Features
- `screen-share-start` - Screen sharing started
- `screen-share-stop` - Screen sharing stopped
- `file-shared` - File shared notification
- `whiteboard-draw` - Whiteboard drawing update
- `whiteboard-clear` - Clear whiteboard
- `chat-message` - Chat message sent
- `new-message` - Chat message received

## 🐛 Troubleshooting

### Camera/Microphone Not Working
- Check browser permissions for camera and microphone
- Ensure you're using HTTPS in production
- Try a different browser if issues persist

### Video Not Displaying
- Check that WebRTC is supported in your browser
- Verify STUN servers are accessible
- Check browser console for errors

### Connection Issues
- Ensure backend server is running on port 5000
- Check firewall settings for port 5000
- Verify CLIENT_URL in backend .env matches frontend URL

### Socket Connection Failed
- Restart backend server
- Clear browser cache
- Check console for specific error messages

## 📱 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome  | ✅ Full | Best experience |
| Firefox | ✅ Full | Full support |
| Safari  | ✅ Full | 11+ required |
| Edge    | ✅ Full | Chromium-based |
| IE      | ❌ Not | Not supported |

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the build folder
```

### Backend (Heroku/Railway)
```bash
# Update .env with production values
git push heroku main
```

## 📚 Learning Outcomes

By working with this project, you'll gain experience in:

- **Frontend Development**: React hooks, state management, real-time UI updates
- **Backend Development**: Node.js, Express, real-time communication
- **WebRTC**: Peer-to-peer communication, media handling
- **Real-time Communication**: Socket.io, event-driven architecture
- **Authentication & Security**: JWT, password hashing, data encryption
- **Responsive Design**: CSS Grid, Flexbox, media queries
- **Error Handling**: Client and server-side error management
- **DevOps**: Environment configuration, deployment

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs and issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is licensed under the MIT License.

## 🎯 Future Enhancements

- [ ] Recording video conferences
- [ ] Virtual backgrounds
- [ ] Hand-raising feature
- [ ] Meeting scheduling
- [ ] Advanced permissions control
- [ ] Mobile app versions
- [ ] Analytics dashboard
- [ ] Custom themes

## 📞 Support

For issues, questions, or suggestions:
- Check the troubleshooting section
- Review browser console for errors
- Ensure all prerequisites are met
- Check that ports 3000 and 5000 are available

---

**Happy Coding! 🎉** This project demonstrates modern web development practices and real-time communication technologies used in production applications.

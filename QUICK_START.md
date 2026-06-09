# 🚀 Quick Start Guide - Video Conferencing App

## Prerequisites
- Node.js v14+ and npm installed
- Modern browser (Chrome, Firefox, Safari, Edge)
- Webcam and microphone
- Two terminal windows

## Step 1: Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

**Expected Output:**
```
Server running on port 5000
```

✅ Backend is now running at `http://localhost:5000`

## Step 2: Start the Frontend Application

Open a **new terminal window** and run:

```bash
cd frontend
npm install
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view vcall-frontend in the browser.
Local: http://localhost:3000
```

✅ Frontend will automatically open at `http://localhost:3000`

## Step 3: Create an Account

1. Click **"Register"** on the login page
2. Fill in:
   - Username: (choose any name)
   - Email: (any email format)
   - Password: (any password)
   - Confirm Password: (same password)
3. Click **"Register"** button
4. You'll be logged in automatically

## Step 4: Create Your First Video Room

1. You'll see the Dashboard
2. Click **"Create Room"** button
3. A Room ID will be generated (e.g., `12345-abcde-67890`)
4. Click **"Copy Room ID"** to copy it
5. Click **"Enter Room"** to join

## Step 5: Test the Features

### Test Video
- Your camera feed appears in the main video area
- Click the microphone 🎤 button to toggle audio
- Click the camera 📹 button to toggle video

### Test Screen Sharing
1. Click the **"Screen Share"** tab
2. Click **"Start Screen Share"** button
3. Select the screen/window you want to share
4. Your screen will be displayed

### Test File Sharing
1. Click the **"Files"** tab
2. Drag and drop files or click **"Select Files"**
3. Wait for upload to complete
4. Files will appear in the "Shared Files" list
5. Click **"Download"** to save files

### Test Whiteboard
1. Click the **"Whiteboard"** tab
2. Select a color using the color picker
3. Adjust brush size with the slider
4. Draw on the canvas
5. Click **"Clear Board"** to reset

### Test Chat
1. Type a message in the chat box (right side)
2. Press Enter or click Send
3. Messages appear with timestamp and sender name

## Step 6: Add More Participants (Multi-user Test)

To test with multiple participants:

1. **In the same room with browser DevTools open:**
   - Open Browser DevTools: Press F12
   - Open another tab (Ctrl+T or Cmd+T)
   - Navigate to `http://localhost:3000`
   - Register/Login with a different account
   - Join the same room using the Room ID
   - Now you have 2 participants!

2. **Or use a different device:**
   - Replace `localhost:3000` with your computer's IP
   - Example: `http://192.168.1.100:3000`
   - Join the same room from the other device
   - Both devices will see each other's video

## 🎮 Interactive Testing Scenarios

### Scenario 1: Basic Video Call
1. Open Room with User A
2. Add User B
3. Both should see each other's video
4. Toggle audio/video on both sides
5. Verify controls work correctly

### Scenario 2: Screen Sharing
1. User A starts screen sharing
2. User B should see User A's screen
3. User A stops screen sharing
4. Video should resume

### Scenario 3: File Transfer
1. User A uploads a file
2. File appears in User B's file list
3. User B downloads the file
4. Verify file integrity

### Scenario 4: Collaborative Drawing
1. User A draws on whiteboard
2. User B should see drawing in real-time
3. User B draws - User A should see it
4. Clear and verify both see cleared canvas

### Scenario 5: Chat Communication
1. User A sends message
2. User B receives immediately
3. Both can see message history with timestamps
4. Works independently of video state

## ⚙️ Configuration

### Change Ports (if needed)

**Backend (.env):**
```
PORT=5001  # Change from 5000
```
Then update frontend Client URL

**Frontend (.env):**
```
REACT_APP_SERVER_URL=http://localhost:5001
```

### Change JWT Secret (IMPORTANT for production)

**Backend (.env):**
```
JWT_SECRET=your-super-secret-key-here-change-this
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 already in use | Kill the process or use a different port |
| Port 5000 already in use | Kill the process or change PORT in backend .env |
| Camera permission denied | Allow camera in browser settings |
| "Can't connect to backend" | Verify backend is running on port 5000 |
| No video display | Ensure another app isn't using camera |
| Socket connection error | Clear cache (Ctrl+Shift+Delete), restart backend |
| WebRTC failure | Disable VPN, check firewall |

## 📊 Key Endpoints

### Authentication
- `POST /api/auth/register` → Create account
- `POST /api/auth/login` → Login
- `POST /api/auth/logout` → Logout

### File Sharing
- `POST /api/files/upload` → Upload file
- `GET /api/files/download/:fileId` → Download file

### Users
- `GET /api/users/profile` → Get user info
- `GET /api/users/list` → List all users

## 🎓 Learning Points

By using this app, you'll learn:
- ✅ How WebRTC establishes P2P connections
- ✅ How Socket.io enables real-time features
- ✅ JWT-based authentication flow
- ✅ React hooks and state management
- ✅ HTML5 Canvas for drawing
- ✅ Media stream handling (camera, screen)
- ✅ Binary file handling and encryption
- ✅ Error handling in async operations

## 🚀 Next Steps

1. **Explore the code:**
   - Check `Room.js` for main conference logic
   - Review `useWebRTC.js` hook for WebRTC handling
   - Study Socket.io event flow in `socket.js`

2. **Extend features:**
   - Add user presence indicators
   - Implement recording functionality
   - Add virtual backgrounds
   - Create meeting history

3. **Optimize performance:**
   - Add connection quality monitoring
   - Implement adaptive bitrate
   - Cache static assets
   - Optimize re-renders

4. **Deploy:**
   - Deploy frontend to Vercel/Netlify
   - Deploy backend to Heroku/Railway
   - Set up HTTPS (required for production)
   - Configure custom domain

## ❓ Common Questions

**Q: Can I use this on my phone?**
A: Currently optimized for desktop/tablet. Mobile support requires UI adjustments.

**Q: How many users can join a room?**
A: Theoretically unlimited, but practically 4-6 for decent performance (depends on bandwidth).

**Q: Is my data encrypted?**
A: WebRTC streams are encrypted by default. Messages use AES-256-GCM encryption.

**Q: Do I need HTTPS for this to work locally?**
A: No, HTTP works for local development. HTTPS required for production.

**Q: Can I record calls?**
A: Not built-in currently. You can add recording with MediaRecorder API.

---

🎉 **You're all set!** Start by creating a room and exploring the features. Happy coding!

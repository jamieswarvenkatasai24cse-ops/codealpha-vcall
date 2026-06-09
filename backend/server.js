import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import fileRoutes from './routes/files.js';
import { authenticate } from './middleware/auth.js';
import { createTestUsers } from './seed.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:3000'];
if (process.env.NODE_ENV === 'development') {
  allowedOrigins.push(/http:\/\/localhost:\d+/);
}

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true
};

const io = new Server(server, {
  cors: corsOptions
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/files', authenticate, fileRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Socket.io connection
const users = new Map();
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User joins
  socket.on('user-join', (userData) => {
    users.set(socket.id, {
      id: socket.id,
      ...userData
    });
    socket.broadcast.emit('user-joined', {
      userId: socket.id,
      userData
    });
  });

  // Create or join room
  socket.on('join-room', (roomId, userId, userName) => {
    socket.join(roomId);
    if (!rooms.has(roomId)) {
      rooms.set(roomId, []);
    }
    rooms.get(roomId).push({
      userId,
      userName,
      socketId: socket.id
    });
    
    io.to(roomId).emit('room-users', rooms.get(roomId));
  });

  // Relay WebRTC offer
  socket.on('offer', (data) => {
    io.to(data.to).emit('offer', {
      from: socket.id,
      offer: data.offer
    });
  });

  // Relay WebRTC answer
  socket.on('answer', (data) => {
    io.to(data.to).emit('answer', {
      from: socket.id,
      answer: data.answer
    });
  });

  // Relay ICE candidates
  socket.on('ice-candidate', (data) => {
    io.to(data.to).emit('ice-candidate', {
      from: socket.id,
      candidate: data.candidate
    });
  });

  // Screen sharing started
  socket.on('screen-share-start', (data) => {
    socket.broadcast.emit('screen-share-started', {
      userId: socket.id,
      userName: data.userName
    });
  });

  // Screen sharing stopped
  socket.on('screen-share-stop', () => {
    socket.broadcast.emit('screen-share-stopped', {
      userId: socket.id
    });
  });

  // File upload notification
  socket.on('file-shared', (data) => {
    io.to(data.roomId).emit('file-received', {
      fileName: data.fileName,
      fileSize: data.fileSize,
      sender: data.senderName,
      downloadUrl: data.downloadUrl,
      timestamp: new Date()
    });
  });

  // Whiteboard drawing
  socket.on('whiteboard-draw', (data) => {
    socket.broadcast.emit('whiteboard-update', data);
  });

  // Whiteboard clear
  socket.on('whiteboard-clear', (data) => {
    socket.broadcast.emit('whiteboard-cleared', data);
  });

  // Chat message
  socket.on('chat-message', (data) => {
    io.to(data.roomId).emit('new-message', {
      sender: data.senderName,
      message: data.message,
      timestamp: new Date()
    });
  });

  // User disconnects
  socket.on('disconnect', () => {
    users.delete(socket.id);
    
    // Remove user from all rooms
    rooms.forEach((roomUsers, roomId) => {
      const index = roomUsers.findIndex(u => u.socketId === socket.id);
      if (index !== -1) {
        const removedUser = roomUsers.splice(index, 1)[0];
        io.to(roomId).emit('user-left', {
          userId: socket.id,
          userName: removedUser.userName
        });
        io.to(roomId).emit('room-users', roomUsers);
      }
    });
    
    console.log('User disconnected:', socket.id);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Initialize test users
(async () => {
  await createTestUsers();
  
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();

export default app;

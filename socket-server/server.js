const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let connectedClients = 0;
let userSockets = new Map(); 
app.post('/webhook/task-event', (req, res) => {
  const { event, data } = req.body;
  
  if (connectedClients > 0) {
    if (event === 'task.deleted' && data.deletedBy) {
      const excludeSocketId = userSockets.get(parseInt(data.deletedBy));
      
      if (excludeSocketId) {
        io.except(excludeSocketId).emit(event, data);
      } else {
        io.emit(event, data);
      }
    } else {
      io.emit(event, data);
    }
  } else {
    console.log('No clients connected');
  }
  
  res.json({ success: true, clients: connectedClients });
});

io.on('connection', (socket) => {
  connectedClients++;
  console.log('🔗 Client connected:', socket.id, '| Total:', connectedClients);
  
  socket.on('join', (data) => {
    const { userId } = data;
    console.log('📥 Join request:', data);
    if (userId) {
      const userIdInt = parseInt(userId);
      userSockets.set(userIdInt, socket.id);
      console.log(`👤 User ${userIdInt} mapped to socket ${socket.id}`);
      console.log('👥 Current mappings:', Array.from(userSockets.entries()));
    }
  });
  
  socket.on('disconnect', () => {
    connectedClients--;
    // Remove user from mapping
    for (let [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`👤 User ${userId} removed from mapping`);
        break;
      }
    }
    console.log('🔌 Client disconnected:', socket.id, '| Total:', connectedClients);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Socket.io server running on http://localhost:${PORT}`);
});
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io('http://localhost:3001', {
        transports: ['websocket', 'polling'],
        cors: {
          origin: 'http://localhost:5173',
          credentials: true
        }
      });

      this.socket.on('connect', () => {
        console.log('Connected to Socket.io server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from Socket.io server');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
    
    return this.socket;
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();
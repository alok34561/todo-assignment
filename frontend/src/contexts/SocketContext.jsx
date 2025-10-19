import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL);
    
    newSocket.on('connect', () => {
      console.log('Connected to Socket.io server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinRoom = () => {
    const userId = localStorage.getItem('userId');
    console.log('Joining with userId:', userId);
    if (socket && userId && connected) {
      socket.emit('join', { userId: parseInt(userId) });
    }
  };

  useEffect(() => {
    if (connected && socket) {
      joinRoom();
    }
  }, [connected, socket]);

  return (
    <SocketContext.Provider value={{ socket, connected, joinRoom }}>
      {children}
    </SocketContext.Provider>
  );
};
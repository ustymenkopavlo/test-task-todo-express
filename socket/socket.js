import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const connectedUsers = new Map();

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*', // Change this in production
      methods: ['GET', 'POST'],
    },
  });

  // Authenticate users via JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  // Handle socket connections
  io.on('connection', (socket) => {
    const userId = socket.userId;
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} connected`);

    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    });
  });

  return { io, connectedUsers };
};

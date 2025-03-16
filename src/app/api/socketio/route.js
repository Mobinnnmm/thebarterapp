import { NextResponse } from 'next/server';
import { createServer } from 'http';
import { Server } from 'socket.io';

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const httpServer = createServer();
    const io = new Server(httpServer, {
      path: '/api/socketio',
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    // Socket.IO event handlers
    io.on('connection', (socket) => {
      const { userId, roomId } = socket.handshake.query;
      console.log("New client connected", userId, roomId);

      socket.join(roomId);

      socket.on('sendMessage', async (message) => {
        io.to(roomId).emit('receiveMessage', message);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export const GET = ioHandler;
export const POST = ioHandler; 
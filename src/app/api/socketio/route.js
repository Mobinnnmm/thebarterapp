import { NextResponse } from 'next/server';
import { createServer } from 'http';
import { Server } from 'socket.io';

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server in Next.js API route");
    
    const httpServer = createServer();
    const io = new Server(httpServer, {
      path: '/api/socketio',
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      addTrailingSlash: false
    });

    // Socket.IO event handlers
    io.on('connection', (socket) => {
      const { userId, roomId } = socket.handshake.query;
      console.log("New client connected", userId, roomId);

      socket.join(roomId);

      socket.on('sendMessage', async (message) => {
        console.log("Message received:", message);
        io.to(roomId).emit('receiveMessage', message);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.IO server already running");
  }

  res.end();
};

export const GET = ioHandler;
export const POST = ioHandler; 
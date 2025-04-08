import { NextResponse } from 'next/server';

export const GET = (req) => {
  // Redirect to the actual Socket.IO server
  const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;
  
  // Return a response indicating that connections should go to the external server
  return new NextResponse(
    JSON.stringify({ 
      message: 'Socket.IO server is running at a separate URL',
      socketServerUrl 
    }),
    { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );
};

export const POST = GET; 
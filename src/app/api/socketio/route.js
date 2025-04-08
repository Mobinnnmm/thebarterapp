import { NextResponse } from 'next/server';

export const GET = (req) => {
  // Get the Socket.IO server URL from environment variables
  const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;
  
  // Return a response with CORS headers to allow the connection
  return new NextResponse(
    JSON.stringify({ 
      message: 'Socket.IO server is running at a separate URL',
      socketServerUrl 
    }),
    { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
};

export const POST = GET;

export const OPTIONS = (req) => {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}; 
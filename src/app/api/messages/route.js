import { NextResponse } from 'next/server';
import { connectToDB } from '../../../../lib/mongodb';
import Message from '../../../../models/Message';
import User from '../../../../models/User';

export async function POST(request) {
  try {
    await connectToDB();
    const messageData = await request.json();
    
    // Create the message
    const message = await Message.create(messageData);
    
    // Populate sender information before returning
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'username');
    
    return NextResponse.json(populatedMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');
    
    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
    }
    
    const messages = await Message.find({ chatId })
      .sort({ timestamp: 1 })
      .populate('senderId', ['_id', 'username']);
      
    return NextResponse.json(messages || []);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
} 
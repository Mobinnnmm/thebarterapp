import { NextResponse } from 'next/server';
import { connectToDB } from '../../../../../lib/mongodb';
import Chat from '../../../../../models/Chat';

export async function POST(request) {
  try {
    await connectToDB();
    
    const { proposerId, proposeeId, listingId } = await request.json();
    
    // Check if chat already exists
    let chat = await Chat.findOne({
      $or: [
        { proposer: proposerId, proposee: proposeeId, listingId },
        { proposer: proposeeId, proposee: proposerId, listingId }
      ]
    });

    if (!chat) {
      // Create new chat if it doesn't exist
      chat = await Chat.create({
        roomId: `${proposerId}-${proposeeId}-${listingId}`,
        proposer: proposerId,
        proposee: proposeeId,
        listingId
      });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json(
      { error: 'Failed to create chat' },
      { status: 500 }
    );
  }
} 
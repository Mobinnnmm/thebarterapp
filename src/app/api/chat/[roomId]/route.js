import { NextResponse } from 'next/server';

import { connectToDB } from '../../../../../lib/mongodb';

import Chat from '../../../../../models/Chat';
import User from '../../../../../models/User';
import ItemListing from '../../../../../models/ItemListing';

export async function GET(request, { params }) {
  try {
    await connectToDB();
    
    const { roomId } = params;
    
    const chat = await Chat.findOne({ roomId })
      .populate('proposer', 'username')
      .populate('proposee', 'username')
      .populate('listingId', { title: 1 });

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat' },
      { status: 500 }
    );
  }
} 
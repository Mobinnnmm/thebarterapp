import { NextResponse } from 'next/server';
import { connectToDB } from '../../../../../lib/mongodb';
import Chat from '../../../../../models/Chat';
import User from '../../../../../models/User';
import ItemListing from '../../../../../models/ItemListing';

export async function GET(request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Find all chats where the user is either proposer or proposee
    const chats = await Chat.find({
      $or: [
        { proposer: userId },
        { proposee: userId }
      ]
    })
    .populate('proposer', 'username')
    .populate('proposee', 'username')
    .populate('listingId', 'title')
    .sort({ updatedAt: -1 }); // Most recent chats first

    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching user chats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chats' },
      { status: 500 }
    );
  }
} 
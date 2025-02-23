import { connectToDB } from '../../../../../../lib/mongodb';
import Trade from '../../../../../../models/Trade';
import ItemListing from '../../../../../../models/ItemListing';
import User from '../../../../../../models/User';
import { NextResponse } from 'next/server';

export async function GET(request, props) {
  const params = await props.params;
  try {
    await connectToDB();
    
    if (!params?.id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const userId = params.id;

    // Find completed trades where user was either proposer or target
    const completedTrades = await Trade.find({
      $and: [
        { status: 'completed' },
        {
          $or: [
            { proposerId: userId },
            { targetUserId: userId }
          ]
        }
      ]
    })
    .populate('proposedItemId')
    .populate('targetItemId')
    .populate('proposerId', 'username profilePicture')
    .populate('targetUserId', 'username profilePicture')
    .sort({ updatedAt: -1 });
    
    return NextResponse.json({ success: true, trades: completedTrades });

  } catch (error) {
    console.error('Error fetching completed trades:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch completed trades' },
      { status: 500 }
    );
  }
}

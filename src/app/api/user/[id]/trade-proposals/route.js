import { connectToDB } from '../../../../../../lib/mongodb';
import Trade from '../../../../../../models/Trade';
import ItemListing from '../../../../../../models/ItemListing';
import User from '../../../../../../models/User';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectToDB();
    
    if (!params?.id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const userId = params.id;
    
    // Only fetch pending trades where the user is the proposer
    const trades = await Trade.find({
      proposerId: userId,
      status: 'pending'  // Only get pending trades
    })
      .populate('proposedItemId')
      .populate('targetItemId')
      .populate('targetUserId', 'username profilePicture')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, trades });

  } catch (error) {
    console.error('Error fetching trade proposals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trade proposals' },
      { status: 500 }
    );
  }
}

// todo:

// fetch all the trade proposals that were sent by the user 



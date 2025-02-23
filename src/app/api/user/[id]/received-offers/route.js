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
    
    // Only fetch trades that are pending or under negotiation
    const trades = await Trade.find({ 
      targetUserId: userId,
      status: 'pending'  // Only get pending trades, remove 'negotiating'
    })
      .populate('proposedItemId')
      .populate('targetItemId')
      .populate('proposerId', 'username profilePicture')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, trades });

  } catch (error) {
    console.error('Error fetching received trade offers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch received trade offers' },
      { status: 500 }
    );
  }
}

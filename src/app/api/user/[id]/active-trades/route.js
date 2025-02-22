import { connectToDB } from '../../../../../../lib/mongodb';
import Trade from '../../../../../../models/Trade';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    
    if (!params?.id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const userId = params.id;

    // Find trades where the user is either proposer or target and status is 'negotiating'
    const trades = await Trade.find({
      $and: [
        { $or: [{ proposerId: userId }, { targetUserId: userId }] },
        { status: 'negotiating' }
      ]
    })
    .populate('proposerId')
    .populate('targetUserId')
    .populate('proposedItemId')
    .populate('targetItemId')
    .sort({ updatedAt: -1 });
    
    return NextResponse.json({
      success: true,
      trades
    });

  } catch (error) {
    console.error('Error fetching active trades:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch active trades" 
    }, { status: 500 });
  }
}

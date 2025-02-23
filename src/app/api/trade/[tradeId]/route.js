import { connectToDB } from '../../../../../lib/mongodb';
import Trade from '../../../../../models/Trade';
import { NextResponse } from 'next/server';

export async function GET(request, props) {
  const params = await props.params;
  try {
    await connectToDB();
    
    if (!params?.tradeId) {
      return NextResponse.json(
        { success: false, error: 'Trade ID is required' },
        { status: 400 }
      );
    }

    const trade = await Trade.findById(params.tradeId)
      .populate('proposedItemId')
      .populate('targetItemId')
      .populate('proposerId', 'username profilePicture')
      .populate('targetUserId', 'username profilePicture')
      .populate({
        path: 'negotiationHistory',
        populate: {
          path: 'proposedBy',
          select: 'username profilePicture'
        }
      });
    
    if (!trade) {
      return NextResponse.json(
        { success: false, error: 'Trade not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, trade });

  } catch (error) {
    console.error('Error fetching trade:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trade details' },
      { status: 500 }
    );
  }
}

export async function PUT(request, props) {
  const params = await props.params;
  try {
    await connectToDB();
    
    if (!params?.tradeId) {
      return NextResponse.json(
        { success: false, error: 'Trade ID is required' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const { status } = data;

    const trade = await Trade.findByIdAndUpdate(
      params.tradeId,
      { status },
      { new: true }
    )
    .populate('proposedItemId')
    .populate('targetItemId')
    .populate('proposerId', 'username profilePicture')
    .populate('targetUserId', 'username profilePicture');

    if (!trade) {
      return NextResponse.json(
        { success: false, error: 'Trade not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, trade });

  } catch (error) {
    console.error('Error updating trade:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update trade' },
      { status: 500 }
    );
  }
}

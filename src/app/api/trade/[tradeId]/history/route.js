import { connectToDB } from '../../../../../../lib/mongodb';
import Trade from '../../../../../../models/Trade';
import { NextResponse } from 'next/server';
export async function GET(request, props) {
    const params = await props.params;
    try {
        // Get the authorization token from the request header
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized - No token provided' },
                { status: 401 }
            );
        }

        await connectToDB();
        
        const trade = await Trade.findById(params.tradeId)
            .populate('negotiationHistory.proposedBy', 'username')
            .select('status negotiationHistory proposerId targetUserId');

        if (!trade) {
            return NextResponse.json(
                { success: false, error: 'Trade not found' },
                { status: 404 }
            );
        }

        // Get user ID from the token
        const tokenData = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const userId = tokenData._id || tokenData.userId;

        // Verify user is part of the trade
        if (trade.proposerId.toString() !== userId && 
            trade.targetUserId.toString() !== userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized - User not part of trade' },
                { status: 403 }
            );
        }

        // Only return history for completed trades
        if (trade.status !== 'completed') {
            return NextResponse.json(
                { success: false, error: 'History only available for completed trades' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            history: trade.negotiationHistory
        });

    } catch (error) {
        console.error('Error fetching trade history:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch trade history' },
            { status: 500 }
        );
    }
} 
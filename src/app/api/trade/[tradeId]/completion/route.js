// Trade completion api endpoint

import { connectToDB } from "../../../../../../lib/mongodb";
import Trade from "../../../../../../models/Trade";
import { NextResponse } from "next/server";

export async function POST(req, props) {
    const params = await props.params;
    try {
        // Get the authorization header
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();

        const trade = await Trade.findById(params.tradeId)
            .populate('proposerId')
            .populate('targetUserId');

        if (!trade) {
            return NextResponse.json({ success: false, error: "Trade not found" }, { status: 404 });
        }

        // Update trade status to completed
        trade.status = 'completed';
        
        // Update the current proposal status to accepted
        if (trade.currentProposal) {
            trade.currentProposal.status = 'accepted';
        }

        // Update the last negotiation history entry to accepted
        if (trade.negotiationHistory.length > 0) {
            trade.negotiationHistory[trade.negotiationHistory.length - 1].status = 'accepted';
        }

        await trade.save();

        return NextResponse.json({ 
            success: true, 
            message: "Trade completed successfully" 
        });

    } catch (error) {
        console.error('Error in completion route:', error);
        return NextResponse.json({ 
            success: false, 
            error: "Failed to complete trade" 
        }, { status: 500 });
    }
}

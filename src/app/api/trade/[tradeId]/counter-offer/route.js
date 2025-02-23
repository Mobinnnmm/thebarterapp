// Trade counter offer api endpoint

import { connectToDB } from "../../../../../../lib/mongodb";
import Trade from "../../../../../../models/Trade";
import { NextResponse } from "next/server";

export async function POST(req, props) {
    const params = await props.params;
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { meetingDetails } = await req.json();
        
        await connectToDB();

        const trade = await Trade.findById(params.tradeId)
            .populate('proposerId')
            .populate('targetUserId');

        if (!trade) {
            return NextResponse.json({ success: false, error: "Trade not found" }, { status: 404 });
        }

        // Add to negotiation history
        trade.negotiationHistory.push({
            proposedBy: trade.currentProposal.proposedBy._id, // Current user making counter offer
            meetingDetails,
            status: 'pending'
        });

        // Update current proposal
        trade.currentProposal = {
            proposedBy: trade.currentProposal.proposedBy._id,
            meetingDetails,
            status: 'pending'
        };

        await trade.save();

        return NextResponse.json({ 
            success: true, 
            message: "Counter offer submitted successfully",
            trade
        });

    } catch (error) {
        console.error('Error in counter-offer route:', error);
        return NextResponse.json({ 
            success: false, 
            error: "Failed to submit counter offer" 
        }, { status: 500 });
    }
}

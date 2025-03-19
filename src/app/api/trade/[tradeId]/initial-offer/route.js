// Trade initial offer api endpoint

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

        // Get the request body - note we're expecting meetingDetails object directly
        const { meetingDetails } = await req.json();
        
        // Validate required fields
        if (!meetingDetails || !meetingDetails.date || !meetingDetails.location) {
            return NextResponse.json({ 
                success: false, 
                error: "Meeting date and location are required" 
            }, { status: 400 });
        }
        
        await connectToDB();

        const trade = await Trade.findById(params.tradeId)
            .populate('proposerId')
            .populate('targetUserId');

        if (!trade) {
            return NextResponse.json({ success: false, error: "Trade not found" }, { status: 404 });
        }

        // Update trade status
        trade.status = 'negotiating';
        
        // Add to negotiation history
        // fixed
        trade.negotiationHistory.push({
            proposedBy: trade.targetUserId._id, // Since this is the initial offer from target user
            meetingDetails: {
                date: meetingDetails.date,
                location: meetingDetails.location,
                instructions: meetingDetails.instructions || ''
            },
            status: 'pending'
        });

        // Set as current proposal
        trade.currentProposal = {
            proposedBy: trade.targetUserId._id,
            meetingDetails: {
                date: meetingDetails.date,
                location: meetingDetails.location,
                instructions: meetingDetails.instructions || ''
            },
            status: 'pending'
        };

        await trade.save();

        return NextResponse.json({ 
            success: true, 
            message: "Initial offer submitted successfully" 
        });

    } catch (error) {
        console.error('Error in initial-offer route:', error);
        return NextResponse.json({ 
            success: false, 
            error: "Failed to submit initial offer" 
        }, { status: 500 });
    }
}

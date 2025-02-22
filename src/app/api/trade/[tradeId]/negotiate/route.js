import { connectToDB } from '../../../../../../lib/mongodb';
import Trade from '../../../../../../models/Trade';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req, { params }) {
    try {
        await connectToDB();

        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, error: 'No authorization token provided' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id;
        const { tradeId } = params;
        const { meetingDetails } = await req.json();

        // Validate meeting details
        if (!meetingDetails?.date || !meetingDetails?.time || !meetingDetails?.location) {
            return NextResponse.json(
                { success: false, error: 'Missing required meeting details' },
                { status: 400 }
            );
        }

        // Find and populate trade
        const trade = await Trade.findById(tradeId)
            .populate('proposerId', 'username profilePicture')
            .populate('targetUserId', 'username profilePicture')
            .populate('proposedItemId')
            .populate('targetItemId')
            .populate('currentProposal.proposedBy', 'username profilePicture');

        if (!trade) {
            return NextResponse.json(
                { success: false, error: 'Trade not found' },
                { status: 404 }
            );
        }

        // Verify user is part of the trade
        if (trade.proposerId._id.toString() !== userId && trade.targetUserId._id.toString() !== userId) {
            return NextResponse.json(
                { success: false, error: 'You are not part of this trade' },
                { status: 403 }
            );
        }

        // Check if it's user's turn
        const isUsersTurn = trade.currentProposal ? 
            trade.currentProposal.proposedBy._id.toString() !== userId :
            trade.targetUserId._id.toString() === userId;

        if (!isUsersTurn) {
            return NextResponse.json(
                { success: false, error: "It's not your turn to make a proposal" },
                { status: 400 }
            );
        }

        // Update trade with new proposal
        const updatedTrade = await Trade.findByIdAndUpdate(
            tradeId,
            {
                $set: {
                    currentProposal: {
                        proposedBy: userId,
                        meetingDetails: {
                            date: meetingDetails.date,
                            time: meetingDetails.time,
                            location: meetingDetails.location,
                            instructions: meetingDetails.instructions || ''
                        },
                        createdAt: new Date()
                    },
                    status: 'negotiating'
                }
            },
            { 
                new: true,
                runValidators: true 
            }
        )
        .populate('proposerId', 'username profilePicture')
        .populate('targetUserId', 'username profilePicture')
        .populate('proposedItemId')
        .populate('targetItemId')
        .populate('currentProposal.proposedBy', 'username profilePicture');

        return NextResponse.json({
            success: true,
            message: 'Counter offer submitted successfully',
            trade: updatedTrade
        });

    } catch (error) {
        console.error('Error in negotiate route:', error);
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json(
                { success: false, error: 'Invalid token' },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

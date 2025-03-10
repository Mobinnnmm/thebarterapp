// Trade completion api endpoint

import { connectToDB } from "../../../../../../lib/mongodb";
import Trade from "../../../../../../models/Trade";
import ItemListing from "../../../../../../models/ItemListing";
import Notification from "../../../../../../models/Notifications";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req, props) {
    const params = await props.params;
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

        // Find and update trade status
        const trade = await Trade.findById(tradeId)
            .populate('proposedItemId')
            .populate('targetItemId')
            .populate('proposerId', 'username')    // Add username for notification
            .populate('targetUserId', 'username'); // Add username for notification

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

        // Update both items' status to "Traded"
        await Promise.all([
            ItemListing.findByIdAndUpdate(
                trade.proposedItemId._id,
                { status: 'Traded' }
            ),
            ItemListing.findByIdAndUpdate(
                trade.targetItemId._id,
                { status: 'Traded' }
            )
        ]);

        // Update trade status to completed
        trade.status = 'completed';
        await trade.save();

        // Create notifications for both users
        try {
            // Create notification for proposer
            await Notification.create({
                userID: trade.proposerId._id,
                type: 'TRADE_COMPLETED',
                content: `Your trade for "${trade.proposedItemId.title}" with ${trade.targetUserId.username} has been completed successfully!`,
                dateSent: new Date(),
                isRead: false
            });

            // Create notification for target user
            await Notification.create({
                userID: trade.targetUserId._id,
                type: 'TRADE_COMPLETED',
                content: `Your trade for "${trade.targetItemId.title}" with ${trade.proposerId.username} has been completed successfully!`,
                dateSent: new Date(),
                isRead: false
            });

            console.log('Trade completion notifications created successfully');
        } catch (notificationError) {
            console.error('Error creating notifications:', notificationError);
            // Don't throw the error, just log it, as we don't want to fail the trade completion
        }

        return NextResponse.json({
            success: true,
            message: 'Trade completed successfully',
            trade
        });

    } catch (error) {
        console.error('Error in trade completion:', error);
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

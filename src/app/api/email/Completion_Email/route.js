// This route sends the trade completion email to both users

import CompletedTradeEmail from "../../../../../emails/complete";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        // Parse the request body
        const { 
            email1, 
            email2, 
            proposedItem, 
            targetItem, 
            proposer, 
            recipient, 
            tradeID, 
            meetingDetails 
        } = await request.json();

        if (!email1 || !email2) {
            return Response.json({
                error: "Both users' emails are needed"
            }, {status: 400});
        }

        if (!proposedItem || !targetItem) {
            console.error("Either of the two items are empty or NULL");
            return Response.json({
                error: "Item information is required"
            }, {status: 400});
        }

        const tradeInfo = {
            proposedItem,
            targetItem,
            proposer,
            recipient,
            tradeID,
            meetingDetails
        };

        // Debug the constructed tradeInfo
        console.log('Trade completion info constructed:', JSON.stringify(tradeInfo));

        // Send the email to the first user
        const data1 = await resend.emails.send({
            from: 'The Barter App <onboarding@thebarterapp.info>',
            to: email1,
            subject: 'Your Trade Has Been Completed!',
            react: CompletedTradeEmail(tradeInfo)
        });

        // Send the email to the second user
        const data2 = await resend.emails.send({
            from: 'The Barter App <onboarding@thebarterapp.info>',
            to: email2,
            subject: 'Your Trade Has Been Completed!',
            react: CompletedTradeEmail(tradeInfo)
        });

        return Response.json({
            success: true,
            message: "Completion emails sent successfully",
            ids: [data1.id, data2.id]
        });
    } catch (error) {
        console.error('Email sending error:', error);
        return Response.json({
            error: error.message || "Failed to send completion emails"
        }, {status: 500});
    }
}
import ReceiveTradeOfferEmail from '../../../../../emails/offerrReceived';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const { email, item1, item2, proposer, tradeID } = await request.json();
        
       

        if (!email) {
            return Response.json({
                error: "Proposee's email is needed"
            }, {status: 400} );
        }

        if (!item1 || !item2){
            console.error("Either of the two items are empty or NULL")
        }

       
        const tradeInfo = {

            proposedItem: item1,
            targetItem: item2,
            proposer: proposer,
            tradeID: tradeID
        };

        // Debug the constructed tradeInfo
        console.log('Trade info constructed:', JSON.stringify(tradeInfo));

        // Send the email to the proposee
        const data = await resend.emails.send({
            from: 'The Barter App <onboarding@thebarterapp.info>',
            to: email,
            subject: ` ${proposer} wants to trade with you!`,
            react: ReceiveTradeOfferEmail(tradeInfo)
        });

        return Response.json({
            success: true,
            message: "Trade offer received email sent successfully",
            id: data.id
        });
    } catch (error) {
        console.error('Email sending error:', error);
        return Response.json({
            error: error.message || "Failed to send received email"
        }, {status: 500 });
    }
}
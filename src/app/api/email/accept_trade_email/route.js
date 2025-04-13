import AcceptEmail from "../../../../../emails/accept";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        // parse the request body
        const { proposerEmail, item1, item2, tradeID, currentUser } = await request.json();

        if (!proposerEmail) {
            return Response.json({
                error: "Proposer's email is needed"
            }, {status: 400} );
        }

        if (!item1 || !item2) {
            return Response.json({
                error: "Both items are required"
            }, {status: 400} );
        }

        if (!tradeID || !currentUser) {
            return Response.json({
                error: "Trade ID and current user are required"
            }, {status: 400} );
        }

        // send the email to the proposer
        const data = await resend.emails.send({
            from: 'The Barter App <onboarding@thebarterapp.info>',
            to: proposerEmail,
            subject: `${currentUser} has accepted your trade proposal`,
            react: AcceptEmail({
                proposedItem: item1,
                targetItem: item2,
                tradeID: tradeID
            })
        });

        return Response.json({
            success: true,
            message: "Acceptance email sent successfully",
            id: data.id
        });
    } catch (error) {
        console.error('Email sending error:', error);
        return Response.json({
            error: error.message || "Failed to send verification email"
        }, {status: 500} );
    }
}
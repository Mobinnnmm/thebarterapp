import ReceiveTradeOfferEmail from '../../../../../emails/offerrReceived';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        // parse the request body
        const { email } = await request.json();

        if (!email) {
            return Response.json({
                error: "Proposee's email is needed"
            }, {status: 400} );
        }

        // send the email to the proposer
        const data = await resend.emails.send({
            from: 'Barter <onboarding@resend.dev>',
            to: email,
            subject: 'Your have received a trade proposal for one of your items',
            react: ReceiveTradeOfferEmail()
        });

        return Response.json({
            success: true,
            message: " Trade offer received email sent successfully ",
            id: data.id
        });
    } catch (error) {
        console.error('Email sending error:', error);
        return Response.json({
            error: error.message || "Failed to send verification email"
        }, {status: 500 });
    }
}
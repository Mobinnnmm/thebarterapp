// This route sends the trade completion email to both users

import CompletedTradeEmail from "../../../../../emails/complete";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        // parse the request body
        const { email1, email2 } = await request.json();

        if (!email1 || !email2) {
            return Response.json({
                error: "Both user's email is needed"
            }, {status: 400} );
        }

        // send the email to the proposer
        const e1 = await resend.emails.send({
            from: 'Barter <onboarding@resend.dev>',
            to: email1,
            subject: 'Your Trade Proposal has been accepted',
            react: CompletedTradeEmail()
        });


        // send the email to the proposer
        const e2 = await resend.emails.send({
            from: 'Barter <onboarding@resend.dev>',
            to: email1,
            subject: 'Your Trade Proposal has been accepted',
            react: CompletedTradeEmail()
        });

        return Response.json({
            success: true,
            message: "Completion email sent successfully ",
            id: e1.id
        });
    } catch (error) {
        console.error('Email sending error:', error);
        return Response.json({
            error: error.message || "Failed to send verification email"
        }, {status: 500 });
    }
}
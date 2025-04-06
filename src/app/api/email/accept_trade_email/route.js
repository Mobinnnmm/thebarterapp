import AcceptEmail from "../../../../../emails/accept";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        // parse the request body
        const { email } = await request.json();

        if (!email) {
            return Response.json({
                error: "Proper's email is needed"
            }, {status: 400} );
        }

        // send the email to the proposer
        const data = await resend.emails.send({
            from: 'Barter <onboarding@resend.dev>',
            to: email,
            subject: 'Your Trade Proposal has been accepted',
            react: AcceptEmail()
        });

        return Response.json({
            success: true,
            message: "Acceptance email sent successfully ",
            id: data.id
        });
    } catch (error) {
        console.error('Email sending error:', error);
        return Response.json({
            error: error.message || "Failed to send verification email"
        }, {status: 500 });
    }
}
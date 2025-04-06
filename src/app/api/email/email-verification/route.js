import LinearLoginCodeEmail from "../../../../../emails/verification";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        // Parse the request body
        const { email, code } = await request.json();
        
        if (!email || !code) {
            return Response.json({ 
                error: "Email and verification code are required" 
            }, { status: 400 });
        }
        
        // Send the email with verification code
        const data = await resend.emails.send({
            from: 'Barter <onboarding@resend.dev>',
            to: email,
            subject: 'Verify your email for Barter',
            react: LinearLoginCodeEmail({ validationCode: code }),
        });
        
        return Response.json({ 
            success: true, 
            message: "Verification email sent successfully",
            id: data.id 
        });
        
    } catch (error) {
        console.error('Email sending error:', error);
        return Response.json({ 
            error: error.message || "Failed to send verification email" 
        }, { status: 500 });
    }
}
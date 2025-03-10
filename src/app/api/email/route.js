import AcceptEmail from '../../../../emails/accept';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['labdulmobin@gmail.com'], // Static email for testing
      subject: 'New Trade Offer Received!',
      react: AcceptEmail({
        year: 2024,
        minutesSpentOnDocs: 1234,
        uploadedDocuments: 25,
        sharedLinks: 50,
        receivedViews: 500,
        topDocumentName: 'Q4 Financial Report',
        topDocumentViews: 150,
        mostActiveMonth: 'September',
        mostActiveMonthViews: 200,
        sharerPercentile: 95,
        viewingLocations: ['United States', 'United Kingdom', 'Germany', 'Japan'],
      }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
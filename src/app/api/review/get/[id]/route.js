import { connectToDB } from '../../../../../../lib/mongodb';
import Review from '../../../../../../models/Review';

export async function GET(req, { params }) {
  try {
    await connectToDB();

    const { id } = params; // Get user ID from route parameters
    if (!id) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    const reviews = await Review.find({ reviewedId: id }) // Fetch reviews where user is reviewed
      .populate('reviewerId', 'username') // Get reviewer username
      .exec();

    return new Response(JSON.stringify({ reviews }), { status: 200 });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

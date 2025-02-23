import Review from '../../../../../../models/Review';
import { connectToDB } from '../../../../../../lib/mongodb';

// DELETE a review by ID
export async function DELETE(req) {
  try {
    await connectToDB();
    
    const id = req.query;
    
    await Review.findByIdAndDelete(id);

    return new Response(JSON.stringify({ message: 'Review deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting review:', error);
    return new Response(JSON.stringify({ error: 'Error deleting review', details: error.message }), { status: 500 });
  }
}
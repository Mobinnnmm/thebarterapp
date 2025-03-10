// Delete review api endpoint

import { NextResponse } from 'next/server';
import Review from '../../../../../models/Review';
import { connectToDB } from '../../../../../lib/mongodb';

export async function DELETE(request) {
  try {
    await connectToDB();
    
    // Get the review ID from the URL or request body
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Review deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Error deleting review', details: error.message },
      { status: 500 }
    );
  }
}

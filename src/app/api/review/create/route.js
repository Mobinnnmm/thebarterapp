// Create review api endpoint

import { connectToDB } from '../../../../../lib/mongodb';
import Review from '../../../../../models/Review';
import { AuthProvider, useAuth } from '../../../../../context/AuthContext';
import User from '../../../../../models/User';
export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { reviewerId, reviewedId, rating, notes } = body;

    console.log("Create Review Body:", body);

    // Validate required fields
    if (!reviewerId || !reviewedId || !rating || !notes) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Validate reviewer user exists
    const reviewerUser = await User.findById(reviewerId);
    if (!reviewerUser) {
      return new Response(JSON.stringify({ error: "Reviewer user not found" }), { status: 404 });
    }

    // Validate reviewed user exists
    const reviewedUser = await User.findById(reviewedId);
    if (!reviewedUser) {
      return new Response(JSON.stringify({ error: "User being reviewed not found" }), { status: 404 });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return new Response(JSON.stringify({ error: "Rating must be between 1 and 5" }), { status: 400 });
    }

    // Check if the user has already reviewed the same person
    const existingReview = await Review.findOne({ reviewerId, reviewedId });
    if (existingReview) {
      return new Response(JSON.stringify({ error: "You have already reviewed this user" }), { status: 400 });
    }

    // Create and save the new review
    const newReview = new Review({
      reviewerId,
      reviewedId,
      rating,
      notes
    });

    await newReview.save();

    // Return success with the new review
    return new Response(
      JSON.stringify({ message: 'Review created', review: newReview }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Create review error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500
    });
  }
}

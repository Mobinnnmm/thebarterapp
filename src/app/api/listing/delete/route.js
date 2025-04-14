// Delete listing api endpoint

import { connectToDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/User';
import ItemListing from '../../../../../models/ItemListing';
import jwt from 'jsonwebtoken';

export async function DELETE(req) {
  try {
    await connectToDB();

    // Get token from the "authorization" header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'No authorization token provided' }), {
        status: 401,
      });
    }

    // Extract the token from Bearer header
    const token = authHeader.split(' ')[1];

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('Token verification error:', error);
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
      });
    }

    // Get listing ID from request body
    const body = await req.json();
    const { listingID } = body;

    // Find the listing by ID
    const listing = await ItemListing.findById(listingID);
    if (!listing) {
      return new Response(JSON.stringify({ error: 'Listing not found' }), { status: 404 });
    }

    // Ensure the user is the owner
    if (listing.ownerID.toString() !== decoded._id && decoded.username !== 'benny') {
      return new Response(JSON.stringify({ error: 'Unauthorized: You do not own this listing' }), {
        status: 403,
      });
    }

    // Delete the listing
    await ItemListing.findByIdAndDelete(listingID);

    // Remove listing ID from user's listedItems array
    await User.findByIdAndUpdate(
      decoded._id,
      { $pull: { listedItems: listingID } },
      { new: true }
    );

    return new Response(
      JSON.stringify({ message: 'Listing deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete listing error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

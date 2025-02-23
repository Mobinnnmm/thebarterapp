// User listings api endpoint

import ItemListing from "../../../../../../models/ItemListing";

import { connectToDB } from "../../../../../../lib/mongodb";

export async function GET(request, context) {
  try {
    await connectToDB();

    const params = await context.params;
    const userId = params.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "No user ID provided" }), { status: 400 });
    }

    // Find all listings by ownerID
    const listings = await ItemListing.find({ ownerID: userId });

    // Sanitize the listings
    const sanitizedListings = listings.map(listing => ({
      id: listing._id,
      title: listing.title,
      description: listing.description,
      images: listing.images,
      ownerID: listing.ownerID,
      // Add other non-sensitive fields as needed
    }));

    return new Response(JSON.stringify(sanitizedListings), { status: 200 });
  } catch (error) {
    console.error("Error fetching user listings:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
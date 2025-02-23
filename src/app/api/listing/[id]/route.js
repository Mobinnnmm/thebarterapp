// Listing api endpoint
import ItemListing from "../../../../../models/ItemListing";
import { connectToDB } from "../../../../../lib/mongodb";

export async function GET(request, context) {
  try {
    await connectToDB();

    const params = await context.params;
    const listingId = params.id;

    if (!listingId) {
      return new Response(JSON.stringify({ error: "No listing ID provided" }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }

    // Find the item by _id
    const listing = await ItemListing.findById(listingId);
    
    if (!listing) {
      return new Response(JSON.stringify({ error: "Item not found" }), { 
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }

    return new Response(JSON.stringify(listing), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error("Error fetching listing by ID:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}

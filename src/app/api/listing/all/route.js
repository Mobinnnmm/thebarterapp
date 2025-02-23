// all listings api endpoint
import { connectToDB } from "../../../../../lib/mongodb";
import ItemListing from "../../../../../models/ItemListing";

export async function GET() {
  try {
    await connectToDB();
    // Fetch all listings
    const listings = await ItemListing.find().sort({ datePosted: -1 });
    return new Response(JSON.stringify(listings), { status: 200 });
  } catch (error) {
    console.error("Error fetching all listings:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
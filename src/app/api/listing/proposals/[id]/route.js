// Listing proposals api endpoint

import { connectToDB } from "../../../../../../lib/mongodb";
import User from "../../../../../../models/User";
import ItemListing from "../../../../../../models/ItemListing";
import Trade from "../../../../../../models/Trade";

export async function GET(req, props) {
  const params = await props.params;
  const { id } = params;

  try {
    await connectToDB();

    if (!id) {
      return new Response(JSON.stringify({ error: "No listing ID provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Find the item by _id
    const listing = await ItemListing.findById(id);

    if (!listing) {
      return new Response(JSON.stringify({ error: "Item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const proposals = await Trade.find({
      _id: { $in: listing.tradeProposals },
    }).populate("proposedItemId", "title description images")
    .populate("targetItemId", "title description images")
    .populate("targetUserId", "username")
    .populate("proposerId", "username");

    return new Response(JSON.stringify(proposals), { status: 200 });
  } catch (error) {
    console.error("Error fetching listing proposals:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

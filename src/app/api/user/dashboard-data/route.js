import User from "../../../../../models/User";
import ItemListing from "../../../../../models/ItemListing";
import { connectToDB } from "../../../../../lib/mongodb";

// GET route that fetches user + their items
export async function GET(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return new Response(JSON.stringify({ error: "No userId provided" }), { status: 400 });
    }

    // Find the user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const items = await ItemListing.find({ _id: { $in: user.listedItems } });

    return new Response(
      JSON.stringify({
        user,
        items, // full item docs
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

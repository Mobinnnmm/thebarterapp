import { connectToDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import ItemListing from "../../../../../models/ItemListing";
import jwt from "jsonwebtoken";

export async function DELETE(request) {
  try {
    await connectToDB();

    // Get token from the "authorization" header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "No authorization token provided" }), {
        status: 401,
      });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("Token verification error:", error);
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 401,
      });
    }

    // Find the user
    const user = await User.findById(decoded._id);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Check if the user has any active listings
    const userListings = await ItemListing.find({ ownerID: user._id });
    if (userListings.length > 0) {
      return new Response(
        JSON.stringify({ error: "Cannot delete profile. You must delete all listings first." }),
        { status: 400 }
      );
    }

    // Delete the user
    await User.findByIdAndDelete(user._id);

    return new Response(
      JSON.stringify({ message: "Profile deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting profile:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

import { connectToDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/User';
import { Types } from "mongoose";

export async function GET(req, { params }) {
  try {
    // const { id } =  params;
    const id = await params.id;

    // Check if id exists
    if (!id) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }), 
        { status: 400 }
      );
    }

    // Validate if id is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ error: "Invalid user ID format" }), 
        { status: 400 }
      );
    }

    await connectToDB();

    const user = await User.findById(id).select("-password");
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }), 
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(user), { status: 200 });

  } catch (error) {
    console.error("User fetch error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch user" }), 
      { status: 500 }
    );
  }
}

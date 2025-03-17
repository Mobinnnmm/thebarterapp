
import { connectToDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
export async function POST(request) {
  try {
    await connectToDB();
    const { userId, phoneNumber, address, aboutMe, profilePicture, email } = await request.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "No userId provided" }), { status: 400 });
    }

    // Check if the email already exists (if uniqueness is required)
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return new Response(JSON.stringify({ error: "Email already in use" }), { status: 400 });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { phoneNumber, address, aboutMe, profilePicture, email },
      { new: true } // return updated doc
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ message: "Profile updated successfully", user: updatedUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

import { connectToDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function PUT(request) {
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

    // Get request body
    const { oldPassword, newPassword } = await request.json();

    if (!oldPassword || !newPassword) {
      return new Response(JSON.stringify({ error: "Both old and new passwords are required" }), {
        status: 400,
      });
    }

    // Find the user
    const user = await User.findById(decoded._id);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Check if the old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: "Incorrect old password" }), { status: 400 });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return new Response(
      JSON.stringify({ message: "Password updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
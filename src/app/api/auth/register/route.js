// Register api endpoint

import User from "../../../../../models/User";
import { connectToDB } from "../../../../../lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await connectToDB();

    // We expect { username, email, password } from the client
    const { username, email, password } = await request.json();

    // If any is missing or empty, return 400
    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({ error: "All fields (username, email, password) are required." }),
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Username or email already exists. Try a different one." }),
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: true,
    });
    await newUser.save();



    // sign JWT
    const token = jwt.sign(
      {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        userId: newUser._id,
        token,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
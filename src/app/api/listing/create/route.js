// Create listing api endpoint

import { connectToDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/User';
import ItemListing from '../../../../../models/ItemListing';
import jwt from 'jsonwebtoken';
import cloudinary from '../../../cloudinary';  // Default import

export async function POST(req) {
  try {
    await connectToDB();

    // 1) Get token from the "authorization" header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'No authorization token provided' }), {
        status: 401,
      });
    }

    // Extract the token from Bearer header
    const token = authHeader.split(' ')[1];

    // 2) verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('Token verification error:', error);
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
      });
    }

    const body = await req.json();
    const {
      title,
      description,
      images,
      selectedCategory,
      selectedTags, 
      location,
    } = body;

    // Upload images to Cloudinary and store URLs
    const imageUrls = [];
    for (const image of images) {
      try {
        const uploadResponse = await cloudinary.v2.uploader.upload(image, {
          folder: "barter_listings",
          resource_type: "image",
        });
        imageUrls.push(uploadResponse.secure_url);
      } catch (err) {
        console.error("Image upload error:", err);
        return new Response(JSON.stringify({ error: "Image upload failed" }), { status: 500 });
      }
    }

    // For debugging, console.log what the server received:
    console.log("Create Listing Body:", body);
    
    // 1. Create the new listing in the DB
    const newListing = new ItemListing({
      ownerID: decoded._id,
      title,
      description,
      images: imageUrls, // Store Cloudinary URLs
      category: selectedCategory, // Using selectedCategory
      tags: selectedTags, // Using selectedTags
      location
    });

    await newListing.save();

    // 2. Also push the listing ID to the user's listedItems array
    await User.findByIdAndUpdate(
      decoded._id,
      { $push: { listedItems: newListing._id.toString() } },
      { new: true }
    );

    // Return success with the new listing
    return new Response(
      JSON.stringify({ message: 'Item listing created', listing: newListing }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Create listing error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500
    });
  }
}

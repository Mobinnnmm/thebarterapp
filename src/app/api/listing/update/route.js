import { connectToDB } from '../../../../../lib/mongodb';
import ItemListing from '../../../../../models/ItemListing';
import jwt from 'jsonwebtoken';

export async function PUT(req) {
    try {
        await connectToDB();

        // Get token from the "authorization" header
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: 'No authorization token provided' }), {
                status: 401,
            });
        }

        // Extract the token from Bearer header
        const token = authHeader.split(' ')[1];

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            console.error('Token verification error: ', error);
            return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
                status: 401,
            });
        }

        // Parse request body
        const body = await req.json();
        const { title, description, category, tags } = body;

        // For debugging
        console.log("Edit Listing Body:", body);

        const listingID = body._id;

        // Find the listing by ID
        const existingListing = await ItemListing.findById(listingID);
        if (!existingListing) {
            return new Response(JSON.stringify({ error: 'Listing not found' }), { status: 404 });
        }

        // Ensure the user is the owner
        if (existingListing.ownerID.toString() !== decoded._id) {
            return new Response(JSON.stringify({ error: 'Unauthorized: You do not own this listing' }), {
                status: 403,
            });
        }

        // Update the listing fields
        existingListing.title = title || existingListing.title;
        existingListing.description = description || existingListing.description;
        existingListing.category = category || existingListing.category;
        existingListing.tags = tags || existingListing.tags;

        // Save the updated listing
        await existingListing.save();

        return new Response(
            JSON.stringify({ message: 'Listing updated successfully', listing: existingListing }),
            { status: 200 }
        );

    } catch (error) {
        console.error('Edit listing error: ', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

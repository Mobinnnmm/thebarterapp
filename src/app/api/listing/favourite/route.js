import { connectToDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/User';
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
        const listingId = await req.json();

        if (!listingId) {
            return new Response(JSON.stringify({ error: 'Listing ID is required' }), {
                status: 400,
            });
        }

        // Find the user by ID
        const user = await User.findById(decoded._id);
        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
            });
        }

        // Check if the listing is already in the favorites list
        const isFavourite = user.favourites.includes(listingId);

        if (isFavourite) {
            // Remove the listing from favorites
            user.favourites = user.favourites.filter(favorite => favorite !== listingId);
        } else {
            // Add the listing to favorites
            user.favourites.push(listingId);
        }

        // Save the updated user
        await user.save();

        return new Response(
            JSON.stringify({message: 'User favourites updated', favourite: !isFavourite }),
            { status: 200 }
        );

    } catch (error) {
        console.error('Toggle favorite error: ', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
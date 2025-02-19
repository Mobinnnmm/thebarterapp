// create a report and save it to the database

import { connectToDB } from '../../../../../lib/mongodb';
import Report from '../../../../../models/Report'; // Assuming you have a Report model
import jwt from 'jsonwebtoken';

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

    // 2) Verify the token
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
      reportType, // 'user' or 'item'
      description,
      targetItem,
      targetUserId,
    } = body;

    // For debugging, console.log what the server received:
    console.log("Create Report Body:", body);

    // 3. Create the new report in the DB
    const newReport = new Report({
      reportType,
      description,
      reportedByUserId: decoded._id, // ID of the user who is reporting
      targetItem, // The item being reported (if applicable)
      targetUserId, // The user being reported (if applicable)
      timestamp: new Date().toISOString(),
    });

    await newReport.save();

    // Return success with the new report
    return new Response(
      JSON.stringify({ message: 'Report created successfully', report: newReport }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Create report error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500
    });
  }
}

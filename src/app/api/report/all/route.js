import { connectToDB } from '../../../../../lib/mongodb';
import Report from '../../../../../models/Report';
import User from "../../../../../models/User"; // or the correct relative path
import ItemListing from "../../../../../models/ItemListing"; // if targetItem refers to this

export async function GET() {
  try {
    await connectToDB();

    // Fetch all reports and populate the related fields
    const reports = await Report.find()
      .sort({ timestamp: -1 }) // Sort by most recent first
      .populate('reportedByUserId', 'username email') // Populate the reportedByUserId field with username and email from the User collection
      .populate('targetItem', 'name description price') // Populate targetItem with fields like name, description, and price from the ItemListing collection
      .populate('targetUserId', 'username email') // Populate targetUserId with username and email from the User collection

    return new Response(JSON.stringify({ reports }), {
      status: 200,
    });
  } catch (error) {
    console.error('Get reports error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

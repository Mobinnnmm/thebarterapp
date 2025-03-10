import { connectToDB } from "../../../../../lib/mongodb";
import Notification from "../../../../../models/Notifications";

export async function GET(request) {
  try {
    await connectToDB();
    
    // Get userID and pagination from query parameters
    const { searchParams } = new URL(request.url);
    const userID = searchParams.get('userID');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = parseInt(searchParams.get('skip')) || 0;

    if (!userID) {
      return new Response(
        JSON.stringify({ error: "No user ID provided" }), 
        { status: 400 }
      );
    }

    // Find notifications for the user with pagination
    const notifications = await Notification.find({ userID })
      .sort({ dateSent: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Notification.countDocuments({ userID });

    return new Response(
      JSON.stringify({
        notifications,
        total,
        hasMore: skip + notifications.length < total
      }), 
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching notifications:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500 }
    );
  }
}

// Mark notifications as read
export async function PUT(request) {
  try {
    await connectToDB();
    
    const body = await request.json();
    const { notificationIds } = body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return new Response(
        JSON.stringify({ error: "Invalid notification IDs" }), 
        { status: 400 }
      );
    }

    // Update multiple notifications
    await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { $set: { isRead: true } }
    );

    return new Response(
      JSON.stringify({ success: true }), 
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating notifications:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500 }
    );
  }
}

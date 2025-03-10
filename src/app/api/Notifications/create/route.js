import { connectToDB } from "../../../../../lib/mongodb";
import Notification from "../../../../../models/Notifications";

export async function POST(request) {
  try {
    await connectToDB();

    const body = await request.json();
    const { userID, type, content } = body;

    // Validate required fields
    if (!userID || !type || !content) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }), 
        { status: 400 }
      );
    }

    // Create new notification
    const notification = await Notification.create({
      userID,
      type,
      content,
      dateSent: new Date(),
      isRead: false
    });

    return new Response(
      JSON.stringify(notification), 
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating notification:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500 }
    );
  }
}

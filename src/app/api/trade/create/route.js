import { connectToDB } from "../../../../../lib/mongodb";
import Trade from "../../../../../models/Trade";
import User from "../../../../../models/User";
import ItemListing from "../../../../../models/ItemListing";
import { NextResponse } from "next/server";
export async function POST(request) {
  try {
    await connectToDB();
    const body = await request.json();
    const { proposerId, targetUserId, proposedItemId, targetItemId } = body;

    const proposedItem = await ItemListing.findById(proposedItemId);
    const targetItem = await ItemListing.findById(targetItemId);
    const proposerUser = await User.findById(proposerId);

    // Create the trade
    const trade = await Trade.create({
      proposerId,
      targetUserId,
      proposedItemId,
      targetItemId,
      status: 'pending'
    });

    return NextResponse.json({ 
      message: "Trade offer created successfully",
      trade 
    });

  } catch (error) {
    console.error('Error creating trade:', error);
    return NextResponse.json(
      { error: "Failed to create trade offer" },
      { status: 500 }
    );
  }
} 
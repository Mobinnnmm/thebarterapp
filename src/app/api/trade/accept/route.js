import { emailService } from '@/services/emailService';

export async function POST(request) {
  try {
    // Your trade acceptance logic...
    
    // Send notification to the trade initiator
    await emailService.sendTradeAcceptedNotification(
      trade.initiatorEmail,
      trade.itemName,
      trade.id
    );
    
    return Response.json({ message: "Trade accepted" });
  } catch (error) {
    console.error('Trade acceptance error:', error);
    return Response.json({ error: "Failed to accept trade" }, { status: 500 });
  }
} 
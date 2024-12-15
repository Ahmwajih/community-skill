import Pusher from 'pusher';
import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/db";
import Conversation from "@/models/Conversation";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export async function POST(request: NextRequest) {
  await db();

  const { conversationId, senderId, content } = await request.json();

  if (!conversationId || !senderId || !content) {
    return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 });
    }

    const message = {
      senderId,
      content,
      timestamp: new Date(),
    };

    conversation.messages.push(message);
    await conversation.save();

    pusher.trigger(`conversation-${conversationId}`, 'receive_message', message);

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ success: false, error: "Error sending message" }, { status: 500 });
  }
}
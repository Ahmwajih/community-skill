import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import Conversation from "@/models/Conversation";
import Pusher from 'pusher';

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
});

export async function POST(req: NextRequest) {
  await db();

  try {
    const { conversationId, senderId, content } = await req.json();

    if (!conversationId || !senderId || !content) {
      return NextResponse.json({ success: false, error: "Conversation ID, Sender ID, and Content are required" }, { status: 400 });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 });
    }

    const newMessage = { senderId, content, timestamp: new Date() };
    conversation.messages.push(newMessage);
    await conversation.save();

    pusher.trigger('conversation-channel', 'new-message', { conversationId, message: newMessage });

    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
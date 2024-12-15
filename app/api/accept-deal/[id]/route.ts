import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await db();
  const { id } = params; 

  const { searchParams } = new URL(req.url);
  const providerEmail = searchParams.get('providerEmail');
  const providerName = searchParams.get('providerName');
  const seekerEmail = searchParams.get('seekerEmail');
  const seekerName = searchParams.get('seekerName');
  const seekerId = searchParams.get('seekerId');

  if (!providerEmail || !providerName || !seekerEmail || !seekerName || !seekerId) {
    return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 });
  }

  try {
    // Create or update the conversation in the database
    const conversation = await Conversation.findOneAndUpdate(
      {
        $or: [
          { providerId: seekerId, seekerId: id },
          { providerId: id, seekerId: seekerId },
        ],
      },
      {
        $setOnInsert: {
          providerId: id,
          seekerId: seekerId,
        },
        $push: {
          messages: {
            senderId: seekerId,
            content: `${providerName} has accepted the deal.`,
            timestamp: new Date(),
          },
        },
      },
      { new: true, upsert: true }
    );

    pusher.trigger('conversation-channel', 'deal-accepted', { providerEmail, providerName, seekerEmail, seekerName });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return NextResponse.redirect(`${baseUrl}/chat?providerEmail=${providerEmail}&providerName=${providerName}&seekerEmail=${seekerEmail}&seekerName=${seekerName}&id=${id}`);
  } catch (error) {
    console.error("Error creating or updating conversation:", error);
    return NextResponse.json({ success: false, error: "Error handling conversation" }, { status: 500 });
  }
}
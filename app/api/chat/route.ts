import { Server } from "socket.io";
import { NextRequest, NextResponse } from "next/server";
import db from '@/lib/db';
import Chat from '@/models/Chat';
import User from '@/models/User'; // Ensure User model is imported
import { sendMail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  await db();

  const { seekerId, providerId, dealDetails, messages, status, attachments } = await req.json();

  const chat = new Chat({
    seekerId,
    providerId,
    dealDetails,
    status: "pending",
    messages: [],
    attachments: [],
  });

  await chat.save();

  const provider = await User.findById(providerId);
  if (provider) {
    await sendMail(provider.email, 'New Deal Proposal', `
      <p>You have received a new deal proposal.</p>
      <p><a href="${process.env.BASE_URL}/chat/${chat._id}">View Deal</a></p>
    `);
  }

  return NextResponse.json({ success: true, chat });
}
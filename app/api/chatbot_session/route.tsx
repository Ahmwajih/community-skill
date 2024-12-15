import { NextResponse } from 'next/server';
import db from '@/lib/db';
import ChatbotSession from '@/models/ChatbotSession';

// GET handler
export async function GET() {
  await db();

  try {
    const chatbotSession = await ChatbotSession.find({});
    return NextResponse.json({ success: true, data: chatbotSession });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

// POST handler
export async function POST(req: Request) {
  await db();

  try {
    const body = await req.json();
    const chatbotSession = await ChatbotSession.create(body);
    return NextResponse.json({ success: true, data: chatbotSession }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
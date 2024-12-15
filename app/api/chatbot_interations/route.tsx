import { NextResponse } from 'next/server';
import db from '@/lib/db';
import ChatbotInteraction from '@/models/ChatbotInteraction';

export async function GET() {
  await db();

  try {
    const chatbot = await ChatbotInteraction.find({});
    return NextResponse.json({ success: true, data: chatbot });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function POST(req: Request) {
  await db();

  try {
    const body = await req.json();
    const chatbot = await ChatbotInteraction.create(body);
    return NextResponse.json({ success: true, data: chatbot }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
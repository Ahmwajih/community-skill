import { NextResponse } from 'next/server';
import db from '@/lib/db';
import ChatbotSession from '@/models/ChatbotSession';

// GET handler
export async function GET(req: Request) {
  await db();

  try {
    const { id } = req.query;
    const chatbot = await ChatbotSession.findById(id);

    if (!chatbot) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: chatbot });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

// PUT handler
export async function PUT(req: Request) {
  await db();

  try {
    const { id } = req.query;
    const body = await req.json();

    if (!id) {
      throw new Error('ID is required');
    }

    const chatbot = await ChatbotSession.findByIdAndUpdate(id, body, { new: true });

    if (!chatbot) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: chatbot });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

// DELETE handler
export async function DELETE(req: Request) {
  await connectDB();

  try {
    const { id } = req.query;

    if (!id) {
      throw new Error('ID is required');
    }

    const chatbot = await ChatbotSession.findByIdAndDelete(id);

    if (!chatbot) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: chatbot });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
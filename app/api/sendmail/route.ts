import { NextResponse, NextRequest } from 'next/server';
import { sendMail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html } = await req.json();
    await sendMail(to, subject, html);
    return NextResponse.json({ success: true, message: 'Email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email.' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Contact from '@/models/Contact';
import db from '@/lib/db';
import { sendMail } from "@/lib/mailer"; 

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: NextRequest) {
    await db();
  try {
    const body = await req.json();
    const { fullName, email, message } = body;

    // Validate input
    if (!fullName || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Save the contact message to the database
    const newContact = new Contact({ fullName, email, message });
    await newContact.save();

    // Send acknowledgment email to the user
    const emailTemplate = await generateContactEmail(fullName, message);
    await sendMail(email, 'Thank You for Contacting Us', emailTemplate);

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for contacting us. Please check your email for confirmation.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

const getLogoUrlFromDb = async () => {
  try {
    await db();
    const result = await mongoose.connection.collection('settings').findOne({ key: 'logoUrl' });
    if (!result) {
      throw new Error('Logo URL not found in the database.');
    }
    return result.value;
  } catch (error) {
    console.error('Error fetching logo URL:', error.message);
    console.error(error.stack);
    throw error;
  }
};

const generateContactEmail = async (fullName: string, userMessage: string) => {
  const logoUrl = await getLogoUrlFromDb();
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="text-align: center; padding: 20px;">
        <a href="${BASE_URL}" style="text-decoration: none; color: #333;">
          <img  src="${logoUrl}" alt="skill Logo" style="max-width: 150px; margin-bottom: 20px;">
        </a>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
        <h2 style="color: #333;">Hello ${fullName},</h2>
        <p>Thank you for reaching out to us. We have received your message:</p>
        <blockquote style="font-style: italic; background-color: #fff; padding: 15px; border-left: 5px solid #618eca;">${userMessage}</blockquote>
        <p>Our team will review your message and take the necessary actions as soon as possible.</p>
        <p>If you have further questions or need immediate assistance, feel free to contact us again.</p>
      </div>
      <div style="text-align: center; padding: 20px; margin-top: 20px; border-top: 1px solid #ddd;">
        <p style="margin: 0;">Best regards,</p>
        <p style="margin: 0;">The Company Team of Community Skill Exchange</p>
      </div>
    </div>
  `;
};
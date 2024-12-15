import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Newsletter from '@/models/Newsletter';
import db from '@/lib/db';
import { sendMail } from "@/lib/mailer";
import Logo from "@/app/public/Logo.svg";
import { toast } from 'react-toastify';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: NextRequest) {
    await db();
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required.' },
        { status: 400 }
      );
    }

    const existingSubscription = await Newsletter.findOne({ email });
    if (existingSubscription) {

      return NextResponse.json(
        { success: false, error: 'Email is already subscribed.' },
        { status: 400 }      );
    }

    const newSubscription = new Newsletter({ email });
    await newSubscription.save();

    const logoUrl = await getLogoUrlFromDb();
    const emailTemplate = generateNewsletterEmail(logoUrl);
    await sendMail(email, 'Thank You for Subscribing to Our Newsletter', emailTemplate);

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for subscribing to our newsletter. Please check your email for confirmation.',
      },
      { status: 201 }    );
  } catch (error) {
    console.error('Error handling newsletter subscription:', error);
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
        return result ? result.value : null;
    } catch (error) {
        console.error('Error fetching logo URL:', error.message);
        console.error(error.stack);
        throw error;
    }
};

const generateNewsletterEmail = (logoUrl: string) => {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="text-align: center; padding: 20px;">
          <a href="${BASE_URL}" style="text-decoration: none; color: #333;">
            <img src="${logoUrl}" alt="Skill Logo" style="max-width: 150px; margin-bottom: 20px;">
          </a>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <h2 style="color: #333;">Welcome to Our Newsletter!</h2>
          <p>Thank you for subscribing to our newsletter. We're excited to keep you updated with the latest news, insights, and exclusive content.</p>
          <p>Stay tuned for upcoming updates and feel free to explore more on our website:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${BASE_URL}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #618eca; text-decoration: none; border-radius: 5px;">Visit Our Website</a>
          </div>
          <p>If you have any questions, feel free to reach out to us anytime.</p>
        </div>
        <div style="text-align: center; padding: 20px; margin-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 0;">The Company Team of Community Skill Exchange</p>
        </div>
      </div>
    `;
};

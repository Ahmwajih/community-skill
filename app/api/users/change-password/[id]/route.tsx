import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendMail } from "@/lib/mailer";
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await db();

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Authorization token is required' },
      { status: 401 }
    );
  }

  if (!JWT_SECRET) {
    return NextResponse.json(
      { success: false, error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const { id: userId } = decoded;

    if (userId !== params.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    user.password = newPassword;
    await user.save();

    // Send notification email
    const logoUrl = await getLogoUrlFromDb();
    await sendMail(user.email, 'Password Changed Successfully', generatePasswordChangeEmail(user.name, logoUrl));

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { success: false, error: 'Error changing password' },
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

const generatePasswordChangeEmail = (userName: string, logoUrl: string) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="text-align: center; padding: 20px;">
        <a href="${BASE_URL}" style="text-decoration: none; color: #333;">
          <img src="${logoUrl}" alt="skill Logo" style="max-width: 150px; margin-bottom: 20px;">
        </a>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
        <h2 style="color: #333;">Hello ${userName},</h2>
        <p>Your password has been changed successfully. If you did not make this change, please contact our support team immediately.</p>
      </div>
      <div style="text-align: center; padding: 20px; margin-top: 20px; border-top: 1px solid #ddd;">
        <p style="margin: 0;">Best regards,</p>
        <p style="margin: 0;">The Company Team of Community Skill Exchange</p>
      </div>
    </div>
  `;
};

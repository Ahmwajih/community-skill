import { NextResponse, NextRequest } from "next/server";
import db from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { paginationMiddleware } from "@/middleware/pagination";
import { sendMail } from "@/lib/mailer"; 
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(req: NextRequest) {
  await db();

  try {
    const paginationData = await paginationMiddleware(req);

    const users = await User.aggregate([
      { $skip: paginationData.skip },
      { $limit: paginationData.limit },
      { $lookup: { from: 'skills', localField: 'skills', foreignField: '_id', as: 'skills' } },
      { $lookup: { from: 'reviews', localField: 'reviews', foreignField: '_id', as: 'reviews' } },
      { $project: { password: 0 } }, // Exclude password
    ]);

const totalUsers = await User.countDocuments();
    return NextResponse.json({
      success: true,
      data: users,
      Details: {
        total: totalUsers,
        page: paginationData.page,
        limit: paginationData.limit,
        pages: Math.ceil(totalUsers / paginationData.limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Error fetching users" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await db();

  try {
    const body = await req.json();
    const { name, email, password, country, photo, provider, role, skills, skillsLookingFor, bio, languages, Github, LinkedIn, availability, isVacationMode } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }

    const newUser = new User({
      name,
      email,
      password,
      country,
      role,
      isActive: false, 
      isAdmin: false,
      skillsLookingFor,
      bio,
      skills,
      photo,
      provider,
      languages,
      Github,
      LinkedIn,
      availability,
      isVacationMode, // Add vacation mode status
    });
    const savedUser = await newUser.save();

    const activationToken = jwt.sign(
      { id: savedUser._id, email: savedUser.email },
      JWT_SECRET,
      { expiresIn: "1h" } 
    );

    // Send activation email
    const activationLink = `${BASE_URL}/api/auth/activate?token=${activationToken}`;
    const logoUrl = await getLogoUrlFromDb();
    await sendMail(email, 'Activate Your Account', generateActivationEmail(activationLink, logoUrl));   
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully. Please check your email to activate your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: "Error creating user" },
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

const generateActivationEmail = (activationLink: string, logoUrl: string) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="text-align: center; padding: 20px;">
        <a href="${BASE_URL}" style="text-decoration: none; color: #333;">
          <img src="${logoUrl}" alt="skill Logo" style="max-width: 150px; margin-bottom: 20px;">
        </a>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
        <h2 style="color: #333;">Welcome to Our Community!</h2>
        <p>Thank you for registering. Please activate your account by clicking the link below:</p>
        <p style="text-align: center;">
          <a href="${activationLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #618eca; text-decoration: none; border-radius: 5px;">Activate Account</a>
        </p>
        <p>If the button above doesn't work, please copy and paste the following link into your web browser:</p>
        <p style="word-break: break-all;">${activationLink}</p>
      </div>
      <div style="text-align: center; padding: 20px; margin-top: 20px; border-top: 1px solid #ddd;">
        <p style="margin: 0;">Best regards,</p>
        <p style="margin: 0;">The Company Team of Community Skill Exchange</p>
        <p style="margin: 0;">
        </p>
      </div>
    </div>
  `;
};
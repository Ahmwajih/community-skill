import db from "@/lib/db";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import 'react-toastify/dist/ReactToastify.css';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  await db();

  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables");
    return NextResponse.json(
      { success: false, error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please enter both email and password" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User does not exist" },
        { status: 400 }
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("Password mismatch");
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    const res = NextResponse.json(
      {
        success: true,
        token,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: "User logged in successfully",
      },
      { status: 200 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res;
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Authentication failed" },
      { status: 400 }
    );
  }
}
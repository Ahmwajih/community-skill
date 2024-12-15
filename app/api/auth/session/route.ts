import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

// Define a type for your JWT payload (update this based on your actual payload)
interface JwtPayload {
  userId: string;
  email: string;
  // other fields in your JWT payload
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  
  if (!token) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; // Casting to JwtPayload type
    return NextResponse.json({ authenticated: true, user: decoded });
  } catch (error) {
    console.error('Error verifying JWT:', error);
    return NextResponse.json({ authenticated: false, user: null });
  }
}

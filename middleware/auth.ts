// middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User'; // Import the User model
import db from '@/lib/db'; // Import the database connection

const JWT_SECRET = process.env.JWT_SECRET;

export async function authMiddleware(req: NextRequest) {
  await db(); 

  const token = req.cookies.get('token');
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (!user.isActive) {
      return NextResponse.json({ success: false, error: 'User is not active' }, { status: 403 });
    }

    if (!user.isAdmin) {
      return NextResponse.json({ success: false, error: 'User is not an admin' }, { status: 403 });
    }

    req.user = user; // Attach user info to the request object
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
  }
}
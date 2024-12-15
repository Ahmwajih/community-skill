import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import User from '@/models/User';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await db();

  const { id } = params;

  if (!id) {
    return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const populatedUser = await User.aggregate([
      { $match: { _id: user._id } },
      {
        $lookup: {
          from: "skills",
          localField: "skills",
          foreignField: "_id",
          as: "skills",
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviews",
        },
      },
      {
        $project: {
          password: 0, // Remove password field
        },
      },
    ]);

    if (!populatedUser || populatedUser.length === 0) {
      return NextResponse.json({ success: false, error: "Error populating user data" }, { status: 500 });
    }

    // Validate response structure
    const userData = populatedUser[0];
    return NextResponse.json({ success: true, data: userData });
  } catch (error) {
    console.error("Error fetching user with populate:", error);
    return NextResponse.json({ success: false, error: "Error fetching user" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await db();

  const { id } = params;

  if (!id) {
    return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const user = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ success: false, error: 'Error updating user' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await db();

  const { id } = params;

  if (!id) {
    return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
  }

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: user, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ success: false, error: 'Error deleting user' }, { status: 500 });
  }
}



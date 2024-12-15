import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  await db();

  try {
    // Parse the JSON body
    const { userId, currentUserId, action }: { userId: string; currentUserId: string; action: string } = await req.json();

    // Validate input IDs
    if (!currentUserId || !mongoose.Types.ObjectId.isValid(currentUserId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, error: 'Invalid user IDs' }, { status: 400 });
    }

    // Prevent self-follow/unfollow
    if (currentUserId === userId) {
      return NextResponse.json({ success: false, error: 'You cannot follow/unfollow yourself' }, { status: 400 });
    }

    // Fetch users
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(userId);

    if (!currentUser || !targetUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Initialize following and followers arrays if they are undefined
    if (!currentUser.following) {
      currentUser.following = [];
    }
    if (!targetUser.followers) {
      targetUser.followers = [];
    }

    // Handle follow/unfollow logic
    if (action === 'follow') {
      if (currentUser.following.includes(userId)) {
        return NextResponse.json({ success: false, error: 'Already following this user' }, { status: 400 });
      }
      currentUser.following.push(userId);
      targetUser.followers.push(currentUserId);
    } else if (action === 'unfollow') {
      currentUser.following = currentUser.following.filter((id) => id.toString() !== userId);
      targetUser.followers = targetUser.followers.filter((id) => id.toString() !== currentUserId);
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    // Save the updated users
    await currentUser.save();
    await targetUser.save();

    return NextResponse.json({ success: true, message: `User ${action}ed successfully` });
  } catch (error) {
    console.error('Error updating follow/unfollow:', error);
    return NextResponse.json({ success: false, error: 'Error updating follow/unfollow' }, { status: 500 });
  }
}
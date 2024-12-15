import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import Review from '@/models/Review';
import User from '@/models/User';
import mongoose from 'mongoose';
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await db();

  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Valid ID is required' }, { status: 400 });
  }

  try {
    const review = await Review.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'users', 
          localField: 'user', 
          foreignField: '_id', 
          as: 'userDetails',
        },
      },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          content: 1,
          rating: 1,
          'userDetails.name': 1,
          'userDetails.email': 1,
          'userDetails.reviewedBy': 1, 
        },
      },
    ]);

    if (!review || review.length === 0) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: review[0] });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json({ success: false, error: 'Error fetching review' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await db();

  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Valid ID is required' }, { status: 400 });
  }

  try {
    const { rating, comments } = await req.json();

    const review = await Review.findByIdAndUpdate(
      id,
      { rating, comments },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ success: false, error: 'Error updating review' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await db();

  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Valid ID is required' }, { status: 400 });
  }

  try {
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    await User.findByIdAndUpdate(review.user, { $pull: { reviews: review._id } });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ success: false, error: 'Error deleting review' }, { status: 500 });
  }
}
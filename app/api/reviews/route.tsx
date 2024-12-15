import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import Review from '@/models/Review';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  await db();

  const userId = req.nextUrl.searchParams.get('userId');
  const skillId = req.nextUrl.searchParams.get('skillId'); // Added skillId

  try {
    let query = {};
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ success: false, error: 'Invalid user ID' }, { status: 400 });
      }
      query = { user: userId };
    } else if (skillId) { // Added skillId condition
      if (!mongoose.Types.ObjectId.isValid(skillId)) {
        return NextResponse.json({ success: false, error: 'Invalid skill ID' }, { status: 400 });
      }
      query = { skill: skillId };
    }

    const reviews = await Review.find(query).populate('user', 'name email').populate('reviewedBy', 'name email'); // Added populate for reviewedBy
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: 'Error fetching reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await db();

  try {
    const { rating, comments, userId, skillId, reviewedBy } = await req.json();

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, error: 'Valid user ID is required' }, { status: 400 });
    }

    const newReview = new Review({
      rating,
      comments,
      user: userId,
      skill: skillId,
      reviewedBy: reviewedBy, // Use the provided reviewedBy ID
    });

    await newReview.save();
    await User.findByIdAndUpdate(userId, { $push: { reviews: newReview._id } });

    const populatedReview = await Review.findById(newReview._id).populate('user', 'name email').populate('reviewedBy', 'name email'); // Added populate for reviewedBy

    return NextResponse.json({ success: true, data: populatedReview }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ success: false, error: 'Error creating review' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await db();

  try {
    const { reviewId, rating, comments } = await req.json();

    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json({ success: false, error: 'Valid review ID is required' }, { status: 400 });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comments },
      { new: true }
    );

    if (!updatedReview) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    const reviewWithUser = await Review.aggregate([
      { $match: { _id: updatedReview._id } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          'user.password': 0 // Exclude password
        }
      }
    ]);

    return NextResponse.json({ success: true, data: reviewWithUser[0] });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ success: false, error: 'Error updating review' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await db();

  try {
    const { reviewId } = await req.json();

    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json({ success: false, error: 'Valid review ID is required' }, { status: 400 });
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    await User.findByIdAndUpdate(deletedReview.user, { $pull: { reviews: deletedReview._id } });

    return NextResponse.json({ success: true, data: deletedReview });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ success: false, error: 'Error deleting review' }, { status: 500 });
  }
}
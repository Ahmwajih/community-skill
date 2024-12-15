import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import Skill from '@/models/Skill';
import User from '@/models/User';
import mongoose from 'mongoose';
// import admin from '@/lib/firebaseAdmin'; // Import Firebase Admin SDK


export async function GET(req: NextRequest) {
  await db();

  const userId = req.nextUrl.searchParams.get('userId');

  try {
    let query = {};
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ success: false, error: 'Invalid user ID' }, { status: 400 });
      }
      query = { user: userId };
    }

    const skills = await Skill.find(query).populate('user', 'name email country bio photo');
    return NextResponse.json({ success: true, data: skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ success: false, error: 'Error fetching skills' }, { status: 500 });
  }
}

// export async function POST(req: NextRequest) {
//   await db();

//   try {
//     const { title, description, category, photo, idToken } = await req.json();

//     if (!idToken) {
//       return NextResponse.json({ success: false, error: 'ID token is required' }, { status: 400 });
//     }

//     // Verify the Firebase ID token
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     const userId = decodedToken.uid; // Get user ID from the token

//     // Find or create the user in the database
//     let user = await User.findOne({ firebaseUid: userId });
//     console.log(user)

//     if (!user) {
//       user = new User({
//         firebaseUid: userId,
//         email: decodedToken.email,
//         name: decodedToken.name,
//         // role: 'provider', // Set the default role
//         photo: photo || '', 
//       });
//       await user.save();
//     }

//     // Create the skill and associate it with the user
//     const newSkill = new Skill({
//       title,
//       description,
//       category,
//       photo,
//       user: user._id, // Use the MongoDB user ID
//     });

//     await newSkill.save();
//     await User.findByIdAndUpdate(user._id, { $push: { skills: newSkill._id } });

//     const populatedSkill = await Skill.findById(newSkill._id).populate('user', 'name email');

//     return NextResponse.json({ success: true, data: populatedSkill });
//   } catch (error) {
//     console.error('Error creating skill:', error);
//     return NextResponse.json({ success: false, error: 'Error creating skill' }, { status: 500 });
//   }
// }

export async function POST(req: NextRequest) {
  await db();

  try {
    const { title, description, category, photo, userId } = await req.json();

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, error: 'Valid user ID is required' }, { status: 400 });
    }

    const newSkill = new Skill({
      title,
      description,
      category,
      photo,
      user: userId,
    });

    await newSkill.save();
    await User.findByIdAndUpdate(userId, { $push: { skills: newSkill._id } });

    const populatedSkill = await Skill.findById(newSkill._id).populate('user', 'name email');

    return NextResponse.json({ success: true, data: populatedSkill });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ success: false, error: 'Error creating skill' }, { status: 500 });
  }
}
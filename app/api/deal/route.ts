import { NextResponse, NextRequest } from "next/server";
import db from "@/lib/db";
import User from "@/models/User";
import Deal from "@/models/Deal";
import { sendMail } from "@/lib/mailer";
import mongoose from "mongoose";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: NextRequest) {
  await db();

  try {
    const body = await req.json();
    const { providerId, seekerId, timeFrame, skillOffered, numberOfSessions, selectedAvailabilities, message, status } = body;

    let parsedAvailabilities;
    if (typeof selectedAvailabilities === 'string') {
      parsedAvailabilities = JSON.parse(selectedAvailabilities);
    } else {
      parsedAvailabilities = selectedAvailabilities;
    }



    // Validate parsedAvailabilities
    if (!Array.isArray(parsedAvailabilities) || !parsedAvailabilities.every(a => typeof a === 'string')) {
      throw new Error('Invalid selectedAvailabilities format');
    }

    // Validate `status` (if provided)
    const validStatuses = ['pending', 'accepted', 'declined'];
    if (status && !validStatuses.includes(status)) {
      throw new Error(`Invalid status value: ${status}`);
    }

    // Validate the request body
    if (!providerId || !seekerId) {
      return NextResponse.json({ success: false, error: "Provider and Seeker IDs are required" }, { status: 400 });
    }

    const provider = await User.findById(providerId);
    const seeker = await User.findById(seekerId);

    if (!provider || !seeker) {
      return NextResponse.json({ success: false, error: "Provider or Seeker not found" }, { status: 404 });
    }

    const newDeal = new Deal({
      providerId,
      seekerId,
      timeFrame,
      skillOffered,
      numberOfSessions,
      selectedAvailabilities: parsedAvailabilities,
      status: status || 'pending',
    });

    await newDeal.save();

    // Prepare and send email content
    const logoUrl = await getLogoUrlFromDb();
    const acceptDealLink = `${BASE_URL}/api/accept-deal/${providerId}?providerEmail=${provider.email}&providerName=${provider.name}&seekerEmail=${seeker.email}&seekerName=${seeker.name}&seekerId=${seeker.id}`;
    const emailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <div style="text-align: center; padding: 20px; border-bottom: 1px solid #ddd;">
            <a href="${BASE_URL}" style="text-decoration: none; color: #333;">
              <img src="${logoUrl}" alt="Skill Logo" style="max-width: 150px;">
            </a>
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #333;">${seeker.name} has sent you a proposal:</h2>
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${seeker.photo}" alt="${seeker.name}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
              <p style="margin-top: 10px;"><strong>${seeker.name}</strong><br>${seeker.country}</p>
            </div>
            <p><strong>New Proposal Received</strong></p>
            <p>${message}</p>
            <p><strong>Proposed Deal:</strong><br>Time Frame: ${timeFrame}<br>Skills Offered: ${skillOffered}<br>Number of Sessions: ${numberOfSessions}</p>
            <p><strong>Selected Availability:</strong><br>${selectedAvailabilities.join("<br>")}</p>
            <p style="text-align: center;">
              <a href="${acceptDealLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Accept/Decline</a>
            </p>
          </div>
          <div style="text-align: center; padding: 20px; background-color: #f9f9f9; border-top: 1px solid #ddd;">
            <p style="margin-bottom: 5px;">Please add us to your address book to ensure you don’t miss any messages.</p>
            <p style="margin-bottom: 0;">Best regards,<br>The Community Skill Exchange Team</p>
          </div>
        </div>
      </div>
    `;

    await sendMail(provider.email, `Community Skill Exchange New Message from ${seeker.name}`, emailContent);

    return NextResponse.json(
      {
        success: true,
        data: newDeal,
        message: "Deal created successfully",
      },
      { status: 201 }
    );
  }
    catch (error: any) {
      console.error("Error creating deal:", error.message);
      console.error(error.stack);
      return NextResponse.json(
          { success: false, error: error.message || "Error creating deal" },
          { status: 500 }
      );
  }
}

const getLogoUrlFromDb = async () => {
  try {
    await db();
    const result = await mongoose.connection.collection('settings').findOne({ key: 'logoUrl' });
    if (!result) {
      throw new Error('Logo URL not found in the database.');
    }
    return result.value;
  } catch (error) {
    console.error('Error fetching logo URL:', error.message);
    console.error(error.stack);
    throw error;
  }
};
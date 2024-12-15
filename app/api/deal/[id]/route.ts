import { NextResponse, NextRequest } from 'next/server';
import Deal from '@/models/Deal';
import db from '@/lib/db';

// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     await db();
//     const deal = await Deal.findById(params.id);
//     if (!deal) {
//       return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
//     }
//     return NextResponse.json({ data: deal }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching deal:", error);
//     return NextResponse.json({ error: 'Error fetching deal' }, { status: 500 });
//   }
// }



// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     await db();
//     // Search the deal by the id of the user who created the deal by seeker id or provider id
//     const deal = await Deal.findOne({ $or: [{ seekerId: params.id }, { providerId: params.id }] });
//     if (!deal) {
//       return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
//     }
//     return NextResponse.json({ data: deal }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching deal:", error);
//     return NextResponse.json({ error: 'Error fetching deal' }, { status: 500 });
//   }
// }

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db();
    // Search for all deals by the id of the user who created the deal by seeker id or provider id
    const deals = await Deal.find({ $or: [{ seekerId: params.id }, { providerId: params.id }] });
    if (deals.length === 0) {
      return NextResponse.json({ error: 'No deals found' }, { status: 404 });
    }
    return NextResponse.json({ data: deals }, { status: 200 });
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json({ error: 'Error fetching deals' }, { status: 500 });
  }
}

// Fetch the most recent deal for a specific user
export async function GET_LAST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db();
    // Search for the most recent deal by the id of the user who created the deal by seeker id or provider id
    const deal = await Deal.findOne({ $or: [{ seekerId: params.id }, { providerId: params.id }] })
      .sort({ createdAt: -1 });
    if (!deal) {
      return NextResponse.json({ error: 'No deals found' }, { status: 404 });
    }
    return NextResponse.json({ data: deal }, { status: 200 });
  } catch (error) {
    console.error("Error fetching the most recent deal:", error);
    return NextResponse.json({ error: 'Error fetching the most recent deal' }, { status: 500 });
  }
}


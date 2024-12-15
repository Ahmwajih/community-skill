import { NextRequest, NextResponse } from 'next/server';
import { saveLogoUrl } from '@/models/Logo';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
    await db();
    try {
        const { logoUrl } = await req.json();

        if (!logoUrl) {
            return NextResponse.json(
                { success: false, error: 'Logo URL is required.' },
                { status: 400 }
            );
        }

        await saveLogoUrl(logoUrl);

        return NextResponse.json(
            { success: true, message: 'Logo URL saved successfully.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error saving logo URL:', error.message);
        console.error(error.stack);
        return NextResponse.json(
            { success: false, error: 'Internal server error.' },
            { status: 500 }
        );
    }
}
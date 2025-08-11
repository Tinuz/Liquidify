import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    // Check if user is authenticated
    if (!session.connected || !session.mbAccessToken) {
      return NextResponse.json(
        { error: 'Not authenticated with Moneybird' },
        { status: 401 }
      );
    }

    const { administrationId, administrationName } = await request.json();

    if (!administrationId || !administrationName) {
      return NextResponse.json(
        { error: 'Administration ID and name are required' },
        { status: 400 }
      );
    }

    // Store selected administration in session
    session.mbAdministrationId = administrationId;
    session.mbAdministrationName = administrationName;
    await session.save();

    return NextResponse.json({
      success: true,
      administrationId,
      administrationName,
    });
  } catch (error) {
    console.error('Error selecting administration:', error);
    return NextResponse.json(
      { error: 'Failed to select administration' },
      { status: 500 }
    );
  }
}

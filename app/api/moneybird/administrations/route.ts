import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { moneybirdApi } from '@/lib/moneybird';

export async function GET() {
  try {
    const session = await getSession();

    // Check if user is authenticated
    if (!session.connected || !session.mbAccessToken) {
      return NextResponse.json(
        { error: 'Not authenticated with Moneybird' },
        { status: 401 }
      );
    }

    // Fetch administrations from Moneybird
    const administrations = await moneybirdApi.getAdministrations();

    return NextResponse.json(administrations);
  } catch (error) {
    console.error('Error fetching administrations:', error);

    if (
      error instanceof Error &&
      error.message.includes('please re-authenticate')
    ) {
      return NextResponse.json(
        { error: 'Authentication expired, please reconnect' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch administrations' },
      { status: 502 }
    );
  }
}

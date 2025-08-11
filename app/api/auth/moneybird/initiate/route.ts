import { NextResponse } from 'next/server';
import { moneybirdApi } from '@/lib/moneybird';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(2);

    // Store state in session for verification in callback
    const session = await getSession();
    session.oauthState = state;
    await session.save();

    // Get the authorization URL from Moneybird API helper
    const authUrl = moneybirdApi.getAuthorizationUrl(state);

    // Redirect to Moneybird OAuth
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Moneybird OAuth initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Moneybird authentication' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { moneybirdApi } from '@/lib/moneybird';

export async function GET() {
  try {
    // Generate a random state for security (in production, store this in session)
    const state = Math.random().toString(36).substring(2);

    // Get the authorization URL from Moneybird API helper
    const authUrl = moneybirdApi.getAuthorizationUrl(state);

    // TODO: In real implementation, store state in session for verification

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

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { moneybirdApi } from '@/lib/moneybird';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL(`/connect?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/connect?error=missing_code', request.url)
      );
    }

    // TODO: Verify state parameter in production

    // Exchange code for access token (mock implementation)
    const tokenResponse = await moneybirdApi.exchangeCodeForToken(code);

    // Store tokens in session
    const session = await getSession();
    session.mbAccessToken = tokenResponse.access_token;
    session.mbAdministrationId = tokenResponse.administration_id;
    await session.save();

    // Redirect to invoices page
    return NextResponse.redirect(new URL('/invoices', request.url));
  } catch (error) {
    console.error('Moneybird OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/connect?error=authentication_failed', request.url)
    );
  }
}

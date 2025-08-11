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

    // Get session and verify state parameter for CSRF protection
    const session = await getSession();
    if (!state || state !== session.oauthState) {
      return NextResponse.redirect(
        new URL('/connect?error=invalid_state', request.url)
      );
    }

    // Clear the state
    session.oauthState = undefined;

    try {
      // Exchange code for access token
      const tokenResponse = await moneybirdApi.exchangeCodeForToken(code);

      // Store tokens in session
      // Moneybird tokens currently don't expire, but prepare for future changes
      const expiresAt = tokenResponse.expires_in
        ? Math.floor(Date.now() / 1000) + tokenResponse.expires_in
        : Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // 1 year from now as fallback

      session.mbAccessToken = tokenResponse.access_token;
      session.mbRefreshToken = tokenResponse.refresh_token;
      session.mbTokenExpiresAt = expiresAt;
      session.connected = true;

      console.log('Token exchange successful:', {
        hasAccessToken: !!tokenResponse.access_token,
        hasRefreshToken: !!tokenResponse.refresh_token,
        expiresIn: tokenResponse.expires_in,
        expiresAt,
      });

      await session.save();

      // Redirect to connect page for administration selection
      return NextResponse.redirect(
        new URL('/connect?step=select-admin', request.url)
      );
    } catch (tokenError) {
      console.error('Token exchange error:', tokenError);
      return NextResponse.redirect(
        new URL('/connect?error=token_exchange_failed', request.url)
      );
    }
  } catch (error) {
    console.error('Moneybird OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/connect?error=authentication_failed', request.url)
    );
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    clientId: process.env.MONEYBIRD_CLIENT_ID || 'NOT_SET',
    clientSecret: process.env.MONEYBIRD_CLIENT_SECRET ? 'SET' : 'NOT_SET',
    redirectUri: process.env.MONEYBIRD_REDIRECT_URI || 'NOT_SET',
    baseUrl: process.env.MONEYBIRD_BASE_URL || 'NOT_SET',
    nodeEnv: process.env.NODE_ENV || 'NOT_SET',
  };

  return NextResponse.json(config);
}

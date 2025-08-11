import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // This endpoint is not yet implemented - returning 501 Not Implemented
  return NextResponse.json(
    {
      error: 'Not Implemented',
      message: 'Tokenization feature will be implemented in a future sprint',
    },
    { status: 501 }
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { getDatabaseStatus } from '@/lib/db';

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = verifySessionToken(cookie);
  const dbStatus = getDatabaseStatus();

  if (!session.valid) {
    return NextResponse.json({
      authenticated: false,
      dbStatus,
    });
  }

  return NextResponse.json({
    authenticated: true,
    email: session.email,
    dbStatus,
  });
}

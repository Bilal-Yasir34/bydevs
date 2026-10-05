import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, createSessionToken, getAdminConfig } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const config = getAdminConfig();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const inputEmail = email.trim().toLowerCase();
    const isEmailValid = inputEmail === config.email;
    const isPasswordValid = password === config.password;

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = createSessionToken(config.email);

    const response = NextResponse.json({
      success: true,
      email: config.email,
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error during admin login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

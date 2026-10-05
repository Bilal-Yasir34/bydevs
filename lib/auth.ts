import crypto from 'crypto';
import { NextRequest } from 'next/server';

export const ADMIN_COOKIE_NAME = 'bydevs_admin_session';

export function getAdminConfig() {
  const email = (process.env.ADMIN_EMAIL || 'admin@bydevs.com').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'adminbydevs2026!';
  const secret = process.env.ADMIN_SESSION_SECRET || 'bydevs-jwt-secret-salt-2026-production-key';
  return { email, password, secret };
}

export function createSessionToken(email: string): string {
  const { secret } = getAdminConfig();
  const timestamp = Date.now().toString();
  const payload = `${email}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

export function verifySessionToken(token: string | undefined | null): { valid: boolean; email?: string } {
  if (!token) return { valid: false };

  try {
    const { secret, email: validEmail } = getAdminConfig();
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return { valid: false };

    const [email, timestampStr, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);

    // 7 days expiration (in ms)
    const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
    if (isNaN(timestamp) || Date.now() - timestamp > MAX_AGE) {
      return { valid: false };
    }

    // Verify signature
    const payload = `${email}:${timestampStr}`;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const providedBuffer = Buffer.from(signature, 'hex');

    if (expectedBuffer.length !== providedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, providedBuffer)) {
      return { valid: false };
    }

    if (email.toLowerCase() !== validEmail) {
      return { valid: false };
    }

    return { valid: true, email };
  } catch {
    return { valid: false };
  }
}

export function verifyAdminRequest(req: NextRequest): boolean {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (cookie) {
    const res = verifySessionToken(cookie);
    if (res.valid) return true;
  }

  // Also check Authorization header Bearer token
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const res = verifySessionToken(token);
    if (res.valid) return true;
  }

  return false;
}

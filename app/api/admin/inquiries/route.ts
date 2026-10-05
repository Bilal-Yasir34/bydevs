import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';
import { getDatabaseStatus, getInquiries } from '@/lib/db';
import { InquiryStats } from '@/lib/types';

export async function GET(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { inquiries, source } = await getInquiries();
    const dbStatus = getDatabaseStatus();

    const stats: InquiryStats = {
      total: inquiries.length,
      new: inquiries.filter(i => i.status === 'new').length,
      called: inquiries.filter(i => i.status === 'called').length,
      in_progress: inquiries.filter(i => i.status === 'in_progress').length,
      completed: inquiries.filter(i => i.status === 'completed').length,
      cancelled: inquiries.filter(i => i.status === 'cancelled').length,
    };

    return NextResponse.json({
      inquiries,
      stats,
      source,
      dbStatus,
    });
  } catch (error) {
    console.error('Error fetching inquiries for admin:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

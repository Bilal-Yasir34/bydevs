import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';
import { deleteInquiry, updateInquiry } from '@/lib/db';
import { InquiryStatus, UpdateInquiryInput } from '@/lib/types';

interface RouteContext {
  params: {
    id: string;
  };
}

const VALID_STATUSES: InquiryStatus[] = ['new', 'called', 'in_progress', 'completed', 'cancelled'];

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const updates: UpdateInquiryInput = {};

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: `Invalid status. Valid values: ${VALID_STATUSES.join(', ')}` }, { status: 400 });
      }
      updates.status = body.status;
    }

    if (body.notes !== undefined) {
      updates.notes = typeof body.notes === 'string' ? body.notes : '';
    }

    const updated = await updateInquiry(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 });
  }

  try {
    const success = await deleteInquiry(id);
    if (!success) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}

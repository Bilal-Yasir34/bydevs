import { NextRequest, NextResponse } from 'next/server';
import { createInquiry } from '@/lib/db';
import { CreateInquiryInput } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, company, email, country, country_code, phone, service, budget, message } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    if (!country || typeof country !== 'string' || !country.trim()) {
      return NextResponse.json({ error: 'Country selection is required' }, { status: 400 });
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return NextResponse.json({ error: 'Phone number is mandatory' }, { status: 400 });
    }

    if (!service || typeof service !== 'string' || !service.trim()) {
      return NextResponse.json({ error: 'Please select a service' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Project message is required' }, { status: 400 });
    }

    const input: CreateInquiryInput = {
      name: name.trim(),
      company: typeof company === 'string' ? company.trim() : '',
      email: email.trim().toLowerCase(),
      country: country.trim(),
      country_code: (country_code || '').trim(),
      phone: phone.trim(),
      service: service.trim(),
      budget: typeof budget === 'string' ? budget.trim() : 'Not specified',
      message: message.trim(),
    };

    const created = await createInquiry(input);

    return NextResponse.json({
      success: true,
      id: created.id,
      message: 'Your inquiry has been received. Our engineering team will contact you shortly.',
    });
  } catch (error) {
    console.error('Error handling inquiry submission:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while saving your inquiry. Please try again or email us directly.' },
      { status: 500 }
    );
  }
}

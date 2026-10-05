import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateInquiryInput, Inquiry, UpdateInquiryInput } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'inquiries.json');

// Ensure data directory and file exist for local fallback
function ensureLocalStore(): Inquiry[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as Inquiry[];
  } catch (err) {
    console.error('Error reading local inquiries store:', err);
    return [];
  }
}

function writeLocalStore(inquiries: Inquiry[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to local inquiries store:', err);
  }
}

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim();

  if (url && key && !url.includes('your-project') && !key.includes('your-anon-key')) {
    try {
      supabaseClient = createClient(url, key, {
        auth: {
          persistSession: false,
        },
      });
      return supabaseClient;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return null;
}

export function getDatabaseStatus(): { configured: boolean; provider: 'supabase' | 'local'; url?: string } {
  const sb = getSupabaseClient();
  if (sb) {
    return {
      configured: true,
      provider: 'supabase',
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    };
  }
  return {
    configured: false,
    provider: 'local',
  };
}

export async function createInquiry(input: CreateInquiryInput): Promise<Inquiry> {
  const now = new Date().toISOString();
  const id = crypto.randomUUID ? crypto.randomUUID() : `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const full_phone = `${input.country_code} ${input.phone.replace(/^[0\s]+/, '')}`.trim();

  const newInquiry: Inquiry = {
    id,
    created_at: now,
    updated_at: now,
    name: input.name.trim(),
    company: input.company?.trim() || '',
    email: input.email.trim().toLowerCase(),
    country: input.country.trim(),
    country_code: input.country_code.trim(),
    phone: input.phone.trim(),
    full_phone,
    service: input.service.trim(),
    budget: input.budget?.trim() || 'Not specified',
    message: input.message.trim(),
    status: 'new',
    notes: '',
  };

  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('inquiries')
        .insert([newInquiry])
        .select()
        .single();

      if (!error && data) {
        return data as Inquiry;
      }
      console.warn('Supabase insert warning/fallback:', error?.message);
    } catch (err) {
      console.warn('Supabase insert failed, falling back to local storage:', err);
    }
  }

  // Fallback to local storage
  const list = ensureLocalStore();
  list.unshift(newInquiry);
  writeLocalStore(list);
  return newInquiry;
}

export async function getInquiries(): Promise<{ inquiries: Inquiry[]; source: 'supabase' | 'local' }> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return { inquiries: data as Inquiry[], source: 'supabase' };
      }
      console.warn('Supabase select warning/fallback:', error?.message);
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local store:', err);
    }
  }

  const list = ensureLocalStore();
  // Sort descending by created_at
  list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return { inquiries: list, source: 'local' };
}

export async function getInquiryById(id: string): Promise<Inquiry | null> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('inquiries')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return data as Inquiry;
      }
    } catch (err) {
      console.warn('Supabase getById failed, checking local:', err);
    }
  }

  const list = ensureLocalStore();
  return list.find(item => item.id === id) || null;
}

export async function updateInquiry(id: string, updates: UpdateInquiryInput): Promise<Inquiry | null> {
  const now = new Date().toISOString();
  const sb = getSupabaseClient();

  if (sb) {
    try {
      const updatePayload: Record<string, unknown> = {
        updated_at: now,
      };
      if (updates.status !== undefined) updatePayload.status = updates.status;
      if (updates.notes !== undefined) updatePayload.notes = updates.notes;

      const { data, error } = await sb
        .from('inquiries')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as Inquiry;
      }
      console.warn('Supabase update warning/fallback:', error?.message);
    } catch (err) {
      console.warn('Supabase update failed, falling back to local:', err);
    }
  }

  const list = ensureLocalStore();
  const index = list.findIndex(item => item.id === id);
  if (index === -1) return null;

  const current = list[index];
  const updated: Inquiry = {
    ...current,
    status: updates.status !== undefined ? updates.status : current.status,
    notes: updates.notes !== undefined ? updates.notes : current.notes,
    updated_at: now,
  };

  list[index] = updated;
  writeLocalStore(list);
  return updated;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { error } = await sb
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (!error) return true;
    } catch (err) {
      console.warn('Supabase delete failed, trying local:', err);
    }
  }

  const list = ensureLocalStore();
  const filtered = list.filter(item => item.id !== id);
  if (filtered.length === list.length) return false;

  writeLocalStore(filtered);
  return true;
}

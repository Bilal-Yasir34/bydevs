import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateInquiryInput, Inquiry, UpdateInquiryInput } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'inquiries.json');

// In-memory cache for serverless environments where disk writes may be ephemeral or read-only
let memoryCache: Inquiry[] = [];
let cacheLoaded = false;

// Ensure data directory and file exist for local storage
function ensureLocalStore(): Inquiry[] {
  if (cacheLoaded && memoryCache.length > 0) {
    return memoryCache;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
      memoryCache = [];
      cacheLoaded = true;
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Inquiry[];
    memoryCache = Array.isArray(parsed) ? parsed : [];
    cacheLoaded = true;
    return memoryCache;
  } catch (err) {
    console.error('Local inquiries storage read warning:', err);
    cacheLoaded = true;
    return memoryCache;
  }
}

function writeLocalStore(inquiries: Inquiry[]) {
  memoryCache = [...inquiries];
  cacheLoaded = true;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Local inquiries storage write warning (using memory cache):', err);
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

  // 1. Guaranteed local persistence (never lose an inquiry)
  const list = ensureLocalStore();
  const existingIdx = list.findIndex(item => item.id === newInquiry.id);
  if (existingIdx === -1) {
    list.unshift(newInquiry);
    writeLocalStore(list);
  }

  // 2. Dual-write to Supabase if client is available
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
      if (error) {
        console.warn('Supabase insert note (inquiry saved locally):', error.message);
      }
    } catch (err) {
      console.warn('Supabase insert failed, safely saved to local store:', err);
    }
  }

  return newInquiry;
}

export async function getInquiries(): Promise<{ inquiries: Inquiry[]; source: 'supabase' | 'local' }> {
  const localList = ensureLocalStore();
  const sb = getSupabaseClient();

  if (sb) {
    try {
      const { data, error } = await sb
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        // Seamlessly merge Supabase + Local records so no inquiries are ever dropped
        const map = new Map<string, Inquiry>();

        // Add local records first
        for (const item of localList) {
          map.set(item.id, item);
        }

        // Add or overwrite with Supabase records
        for (const item of data as Inquiry[]) {
          map.set(item.id, item);
        }

        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        // Update local store with merged data
        writeLocalStore(merged);

        return { inquiries: merged, source: 'supabase' };
      }
      if (error) {
        console.warn('Supabase select note (using local store):', error.message);
      }
    } catch (err) {
      console.warn('Supabase query failed, falling back to local store:', err);
    }
  }

  // Fallback / Local return
  localList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return { inquiries: localList, source: 'local' };
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
      console.warn('Supabase getById check:', err);
    }
  }

  const list = ensureLocalStore();
  return list.find(item => item.id === id) || null;
}

export async function updateInquiry(id: string, updates: UpdateInquiryInput): Promise<Inquiry | null> {
  const now = new Date().toISOString();

  // 1. Update local storage
  const list = ensureLocalStore();
  const index = list.findIndex(item => item.id === id);
  let updated: Inquiry | null = null;

  if (index !== -1) {
    const current = list[index];
    updated = {
      ...current,
      status: updates.status !== undefined ? updates.status : current.status,
      notes: updates.notes !== undefined ? updates.notes : current.notes,
      updated_at: now,
    };
    list[index] = updated;
    writeLocalStore(list);
  }

  // 2. Sync to Supabase
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
    } catch (err) {
      console.warn('Supabase update check:', err);
    }
  }

  return updated;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  // 1. Delete from local storage
  const list = ensureLocalStore();
  const filtered = list.filter(item => item.id !== id);
  const deletedFromLocal = filtered.length !== list.length;
  if (deletedFromLocal) {
    writeLocalStore(filtered);
  }

  // 2. Delete from Supabase
  let deletedFromSb = false;
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { error } = await sb
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (!error) deletedFromSb = true;
    } catch (err) {
      console.warn('Supabase delete check:', err);
    }
  }

  return deletedFromLocal || deletedFromSb;
}

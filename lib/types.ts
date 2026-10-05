export type InquiryStatus = 'new' | 'called' | 'in_progress' | 'completed' | 'cancelled';

export interface Inquiry {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  company?: string;
  email: string;
  country: string;
  country_code: string;
  phone: string;
  full_phone: string;
  service: string;
  budget?: string;
  message: string;
  status: InquiryStatus;
  notes?: string;
}

export interface CreateInquiryInput {
  name: string;
  company?: string;
  email: string;
  country: string;
  country_code: string;
  phone: string;
  service: string;
  budget?: string;
  message: string;
}

export interface UpdateInquiryInput {
  status?: InquiryStatus;
  notes?: string;
}

export interface InquiryStats {
  total: number;
  new: number;
  called: number;
  in_progress: number;
  completed: number;
  cancelled: number;
}

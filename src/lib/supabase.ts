import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Document = {
  id: string;
  filename: string;
  content: string;
  summary: string;
  suggestions: string[];
  created_at: string;
  file_type: 'pdf' | 'image';
  summary_length: 'short' | 'medium' | 'long';
  user_id?: string;
};
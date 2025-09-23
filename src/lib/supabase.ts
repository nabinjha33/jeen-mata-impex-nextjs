import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any) {
  if (error) {
    // If it's a table not found error, provide graceful fallback
    if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
      console.warn('Database tables not yet created. Please run the SQL schema first.');
      return; // Don't throw error, let the calling code handle empty data
    }
    console.error('Supabase error:', error);
    throw new Error(error.message || 'Database operation failed');
  }
}
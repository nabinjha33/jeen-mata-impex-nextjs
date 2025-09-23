import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Create client with graceful fallback
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL &&
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
}

// Helper function to handle Supabase errors
export function handleSupabaseError(error: unknown) {
  if (error) {
    // If it's a table not found error, provide graceful fallback
    const errorMessage = (error as { message?: string })?.message;
    if (errorMessage?.includes('relation') && errorMessage.includes('does not exist')) {
      console.warn('Database tables not yet created. Please run the SQL schema first.');
      return; // Don't throw error, let the calling code handle empty data
    }
    console.error('Supabase error:', error);
    throw new Error(errorMessage || 'Database operation failed');
  }
}
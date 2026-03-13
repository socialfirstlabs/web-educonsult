import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'

export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock or handle missing env vars during build/prerender
    // Note: In real production usage, these MUST be set in Vercel.
    return null; 
  }

  return createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey)
}

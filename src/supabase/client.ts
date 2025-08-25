import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sftxrzqdmgaushcvvdli.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmdHhyenFkbWdhdXNoY3Z2ZGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDMzOTYsImV4cCI6MjA3MTY3OTM5Nn0.TrdYyqcROCR3HIS_1QB56WI2J5sgyAGRmJ415-bd2fM'

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
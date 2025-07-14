import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY


console.log("Checking Supabase credentials...");
if (supabaseUrl) {
  console.log("Supabase URL: Loaded");
} else {
  console.log("Supabase URL: Not Found!");
}
if (supabaseAnonKey) {
  console.log("Supabase Key: Loaded");
} else {
  console.log("Supabase Key: Not Found!");
}


let supabase

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please create a .env file with:')
  console.warn('VITE_SUPABASE_URL=your_supabase_project_url')
  console.warn('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key')
  
  // Create a mock client for development
  supabase = {
    from: () => ({
      insert: () => Promise.resolve({ data: null, error: null }),
      select: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null })
    })
  }
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }

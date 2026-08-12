import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://amoayribokcajpmqmgea.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtb2F5cmlib2tjYWpwbXFtZ2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxODgzMDcsImV4cCI6MjEwMTc2NDMwN30.DBnRF4yNzOy2vAOVIy2G8ChGOX68G5iW3SFMQB0oUtU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

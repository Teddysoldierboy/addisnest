import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_https://hoowlauzvmnipsdrcxkz.supabase.co/rest/v1/!,
  process.env.NEXT_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhvb3dsYXV6dm1uaXBzZHJjeGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzEyMzEsImV4cCI6MjA5NTE0NzIzMX0.g6UrHSJJWakwF8EI00Z-xc9EH_bSoHsNzzspBQ5D1iQ!
)
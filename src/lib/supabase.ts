import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wpfscjcchrtjfmjgnwda.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwZnNjamNjaHJ0amZtamdud2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NDkwNDcsImV4cCI6MjA5NzMyNTA0N30.GhyZtLYRIPKBUzMNOzViydJtVL6LjBlvrJUwGIKyl-w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

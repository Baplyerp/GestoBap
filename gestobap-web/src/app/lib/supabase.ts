import { createBrowserClient } from '@supabase/ssr'

// Essa função cria o "túnel" de comunicação com o Supabase
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
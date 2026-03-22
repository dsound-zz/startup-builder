import { createClient as createNeonClient, SupabaseAuthAdapter } from '@neondatabase/neon-js'

export async function createClient() {
  return createNeonClient({
    auth: {
      url: process.env.NEXT_PUBLIC_NEON_AUTH_URL!,
      adapter: SupabaseAuthAdapter(),
    },
    dataApi: {
      url: process.env.NEXT_PUBLIC_NEON_DATA_API_URL!,
    },
  })
}
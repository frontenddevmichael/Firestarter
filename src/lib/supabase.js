import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
}

// Intercept auth callback URL before Supabase client initializes.
// GotRue tries to parse #access_token=... from the hash and crashes with
// "querySelector is not a valid selector" when the hash contains special chars,
// or rejects the session due to minor clock skew.
let __pendingAuthTokens = null
if (typeof window !== 'undefined') {
  const hash = window.location.hash
  if (hash && hash.length > 1) {
    try {
      if (hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        if (accessToken && refreshToken) {
          __pendingAuthTokens = { access_token: accessToken, refresh_token: refreshToken }
          window.history.replaceState(null, '', window.location.pathname + window.location.search)
        }
      } else if (hash.includes('error=')) {
        const params = new URLSearchParams(hash.substring(1))
        const desc = params.get('error_description') || 'Link expired or invalid'
        sessionStorage.setItem('auth_error', desc)
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
      }
    } catch (_) { /* let Supabase handle it normally */ }
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// If we intercepted tokens from a confirmation redirect, set the session now
if (__pendingAuthTokens) {
  supabase.auth.setSession(__pendingAuthTokens).then(() => {
    if (!window.location.pathname.startsWith('/prize')) {
      window.location.replace('/prize/auth')
    }
  }).catch(() => {})
}

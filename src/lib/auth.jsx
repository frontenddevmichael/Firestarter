/* @react-refresh-ignore */
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) {
        console.error('fetchProfile error:', error.message)
        return null
      }
      setProfile(data)
      return data
    } catch (e) {
      console.error('fetchProfile exception:', e)
      return null
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        await fetchProfile(session.user.id)
      }
      setLoading(false)
    }).catch(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => subscription?.unsubscribe()
  }, [fetchProfile])

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error }
      return { data }
    } catch {
      return { error: { message: 'Network error — check your connection and try again.' } }
    }
  }

  const signUp = async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/prize/auth`,
        },
      })
      if (error) return { error }
      return { data }
    } catch {
      return { error: { message: 'Network error — check your connection and try again.' } }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) return { error }
    } catch {
      return { error: { message: 'Network error during sign out.' } }
    }
    setUser(null)
    setProfile(null)
  }

  const resetPassword = async (email) => {
    try {
      return await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/prize/reset-password`,
      })
    } catch {
      return { error: { message: 'Network error — check your connection and try again.' } }
    }
  }

  const updatePassword = async (password) => {
    try {
      return await supabase.auth.updateUser({ password })
    } catch {
      return { error: { message: 'Network error — check your connection and try again.' } }
    }
  }

  const deleteAccount = async () => {
    try {
      const { error } = await supabase.rpc('delete_user')
      if (!error) {
        setUser(null)
        setProfile(null)
      }
      return { error }
    } catch {
      return { error: { message: 'Network error — check your connection and try again.' } }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    deleteAccount,
    fetchProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

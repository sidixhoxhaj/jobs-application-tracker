import { useEffect, useState } from 'react'
import { supabase, isSupabaseAvailable } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If Supabase is not available (demo mode), skip auth
    if (!isSupabaseAvailable) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string) => {
    if (!isSupabaseAvailable) {
      console.warn('Supabase not available - sign in disabled in demo mode')
      return { error: new Error('Authentication not available in demo mode') }
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })
    return { error }
  }

  const signOut = async () => {
    if (!isSupabaseAvailable) {
      console.warn('Supabase not available - sign out disabled in demo mode')
      return { error: new Error('Authentication not available in demo mode') }
    }

    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
  }
}

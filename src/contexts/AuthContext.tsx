import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types'

interface AuthContextType {
  user: User | null; profile: Profile | null; session: Session | null;
  loading: boolean; error: string | null;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session); setUser(session?.user ?? null)
      if (session?.user) await fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    if (error) console.error('Error fetching profile:', error)
    setProfile(data); setLoading(false)
  }

  async function signUp(email: string, password: string, fullName?: string): Promise<{ error: string | null }> {
    setError(null); setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
    if (error) {
      setLoading(false)
      const message = error.message.includes('already registered') ? 'This email is already registered.' : error.message
      setError(message); return { error: message }
    }
    return { error: null }
  }

  async function signIn(email: string, password: string): Promise<{ error: string | null }> {
    setError(null); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoading(false)
      const message = error.message.includes('Invalid login credentials') ? 'Invalid email or password.' : error.message
      setError(message); return { error: message }
    }
    return { error: null }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null); setProfile(null); setSession(null)
  }

  async function updateProfile(updates: Partial<Profile>): Promise<{ error: string | null }> {
    if (!user) return { error: 'Not authenticated' }
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
    if (error) return { error: error.message }
    setProfile(prev => prev ? { ...prev, ...updates } : null)
    return { error: null }
  }

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, error, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

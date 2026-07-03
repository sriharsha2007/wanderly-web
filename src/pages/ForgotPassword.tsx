import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email) { setError('Please enter your email'); return }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` })
    setLoading(false)
    if (error) setError('Failed to send reset email.')
    else setSuccess(true)
  }

  return (
    <div className="pt-20 min-h-[80vh] flex items-center justify-center bg-sand-50 dark:bg-sand-950 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card p-8">
          {success ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
              <h1 className="text-2xl font-serif font-semibold text-sand-900 dark:text-white mb-2">Check your email</h1>
              <p className="text-sand-500 mb-6">We've sent a password reset link to <strong className="text-sand-700">{email}</strong></p>
              <Link to="/login" className="btn-outline w-full"><ArrowLeft className="w-4 h-4 mr-2" />Back to Sign In</Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mx-auto mb-4"><MapPin className="w-8 h-8 text-white" /></div>
                <h1 className="text-2xl font-serif font-semibold text-sand-900 dark:text-white">Forgot your password?</h1>
                <p className="text-sand-500 mt-2">Enter your email and we'll send you reset instructions.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && <div className="p-3 bg-red-50 dark:bg-red-950 text-red-600 rounded-lg text-sm">{error}</div>}
                <div>
                  <label className="label">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input pl-10" required />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary">{loading ? 'Sending...' : 'Send Reset Link'}</button>
              </form>
              <p className="mt-6 text-center text-sm text-sand-600 dark:text-sand-400">Remember your password? <Link to="/login" className="text-primary-600 font-medium">Sign in</Link></p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Signup() {
  const navigate = useNavigate()
  const { signUp, error, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    if (!email || !password || !confirmPassword) { setLocalError('Please fill in all fields'); return }
    if (password !== confirmPassword) { setLocalError('Passwords do not match'); return }
    if (password.length < 6) { setLocalError('Password must be at least 6 characters'); return }
    const { error } = await signUp(email, password, fullName || undefined)
    if (!error) navigate('/')
  }

  const displayError = localError || error

  return (
    <div className="pt-20 min-h-[80vh] flex items-center justify-center bg-sand-50 dark:bg-sand-950 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mx-auto mb-4"><MapPin className="w-8 h-8 text-white" /></div>
            <h1 className="text-2xl font-serif font-semibold text-sand-900 dark:text-white">Create your account</h1>
            <p className="text-sand-500 mt-2">Start your travel journey today</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {displayError && <div className="p-3 bg-red-50 dark:bg-red-950 text-red-600 rounded-lg text-sm">{displayError}</div>}
            <div>
              <label className="label">Full Name (optional)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="input pl-10" />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input pl-10" required />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className="input pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
              <p className="text-xs text-sand-500 mt-1">Minimum 6 characters</p>
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
                <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className="input pl-10" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary">{loading ? 'Creating account...' : 'Create Account'}</button>
          </form>
          <p className="mt-6 text-center text-sm text-sand-600 dark:text-sand-400">Already have an account? <Link to="/login" className="text-primary-600 font-medium">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}

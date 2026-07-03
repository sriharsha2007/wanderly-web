import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { MapPin, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, error, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await signIn(email, password)
    if (!error) navigate(from, { replace: true })
  }

  return (
    <div className="pt-20 min-h-[80vh] flex items-center justify-center bg-sand-50 dark:bg-sand-950 px-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mx-auto mb-4"><MapPin className="w-8 h-8 text-white" /></div>
            <h1 className="text-2xl font-serif font-semibold text-sand-900 dark:text-white">Welcome back</h1>
            <p className="text-sand-500 mt-2">Sign in to your Wanderly account</p>
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
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="input pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /><span className="text-sm text-sand-600 dark:text-sand-400">Remember me</span></label>
              <Link to="/forgot-password" className="text-sm text-primary-600">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary">{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>
          <p className="mt-6 text-center text-sm text-sand-600 dark:text-sand-400">Don't have an account? <Link to="/signup" className="text-primary-600 font-medium">Sign up</Link></p>
        </div>
      </div>
    </div>
  )
}

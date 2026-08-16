import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import BrandLogo from '../components/BrandLogo'

export default function Register() {
  const auth = useContext(AuthContext)!
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      await auth.register(name, email, password, 'CUSTOMER')
      navigate('/')
    } catch (err: any) {
      setErrorMsg(err.message || err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto my-12 bg-slate-900 border border-cyan-500/20 p-8 rounded-3xl shadow-2xl space-y-6 font-sans">
      {/* Brand Logo & Header */}
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        <BrandLogo size="lg" />
        <p className="text-xs font-semibold text-slate-400">Create your Fish Mart customer account</p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-bold rounded-xl text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">Full Name</label>
          <input
            type="text"
            required
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
            placeholder="John Doe"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">Email Address</label>
          <input
            type="email"
            required
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
            placeholder="you@example.com"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">Password</label>
          <input
            type="password"
            required
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
            placeholder="••••••••"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="w-full py-3.5 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform active:scale-95 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 shadow-cyan-500/20"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
        Already have an account?{' '}
        <Link to="/login" className="text-cyan-400 font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  )
}

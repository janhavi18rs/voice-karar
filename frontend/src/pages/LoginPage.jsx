import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, Mic } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((c) => ({ ...c, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await login({ email: form.email, password: form.password })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fffaf7] text-[#1a1210] overflow-x-hidden">
      {/* subtle grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#e8ddd810_1px,transparent_1px),linear-gradient(to_bottom,#e8ddd810_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-40 px-6 py-5 bg-[#fffaf7]/95 border-b border-[#eadbd4]/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button onClick={() => navigate('/')} className="group flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#a33a2f] text-white shadow-lg shadow-[#a33a2f]/20 group-hover:bg-[#92372c] transition-colors">
              <Mic className="h-7 w-7" />
            </div>
            <span className="font-['Source_Serif_4'] text-4xl font-extrabold leading-none text-[#171513] tracking-tight">
              Voice Karar
            </span>
          </button>
          <Link
            to="/signup"
            className="text-[13.5px] font-semibold text-[#92372c] hover:underline underline-offset-2 transition-all"
          >
            New here? Create an account →
          </Link>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="relative z-10 flex min-h-[calc(100vh-96px)] items-center px-6 py-12">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.08fr_0.92fr]">

          {/* Left: Headline */}
          <div className="flex max-w-3xl flex-col gap-9 pt-2">
            {/* Label */}
            <p className="text-[14px] font-bold uppercase tracking-[0.24em] text-[#9b493d]">
              Secure Sign In
            </p>

            {/* Heading */}
            <h1 className="font-['Source_Serif_4'] text-[54px] font-extrabold leading-[1.12] text-[#171513] tracking-tight xl:text-[64px]">
              Welcome back to your trusted agreement desk.
            </h1>

            {/* Description */}
            <p className="max-w-2xl text-[20px] leading-9 text-[#736862]">
              Sign in with your registered email and password to continue managing your business agreements.
            </p>

            {/* Clean text badges — no emojis */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#eadbd4]/60">
              {['JWT Secured', 'Works on Mobile', 'Made for India'].map((label) => (
                <span
                  key={label}
                  className="px-3 py-1.5 rounded-full border border-[#e8d5cc] bg-[#faf7f5] text-[12px] font-semibold text-[#8c7e77]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="relative ml-auto w-full max-w-lg">
            {/* glow */}
            <div className="absolute -inset-3 bg-gradient-to-br from-[#ffd8d1]/25 to-[#cae8dd]/15 rounded-[28px] blur-2xl pointer-events-none" />

            <div className="relative rounded-[20px] border border-[#e8d5cc] bg-white shadow-xl overflow-hidden">
              {/* top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-[#92372c] to-[#bc6f62]" />

              <div className="px-8 py-8">
                <h2 className="font-['Source_Serif_4'] text-2xl font-bold text-[#1a1210] mb-10">Sign In</h2>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-[#736862] mb-2">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full rounded-lg border border-[#e8d5cc] bg-[#faf7f5] px-4 py-3 text-[14px] text-[#1a1210] placeholder:text-[#bfada5] outline-none focus:border-[#92372c] focus:ring-2 focus:ring-[#92372c]/10 transition-all"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-[#736862] mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Your password"
                        autoComplete="current-password"
                        className="w-full rounded-lg border border-[#e8d5cc] bg-[#faf7f5] px-4 py-3 pr-11 text-[14px] text-[#1a1210] placeholder:text-[#bfada5] outline-none focus:border-[#92372c] focus:ring-2 focus:ring-[#92372c]/10 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b09488] hover:text-[#92372c] transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 rounded-lg bg-[#92372c] hover:bg-[#7d2e24] disabled:bg-[#92372c]/60 text-white font-bold text-[14px] py-3.5 shadow-md hover:shadow-[0_4px_14px_0_rgba(140,59,46,0.35)] active:scale-[0.99] transition-all duration-200"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in…
                      </span>
                    ) : (
                      <>Sign In <ArrowRight className="h-4 w-4" /></>
                    )}
                  </button>

                  <p className="text-center text-[13px] text-[#8c7e77]">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-[#92372c] font-semibold hover:underline underline-offset-2">
                      Sign up free
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

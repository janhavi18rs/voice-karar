/**
 * frontend/src/pages/LoginPage.jsx
 *
 * Real email + password login wired to:
 *   POST /api/v1/auth/login
 *
 * On success: JWT + user stored in localStorage, navigate to /dashboard.
 * On failure: inline error message shown.
 */

import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import { login } from '../services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
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
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-[var(--ledger-line)] pb-4">
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--ink)]/80">
            <ShieldCheck className="h-4 w-4 text-[var(--seal)]" />
            Voice Karar
          </div>
          <Link to="/signup" className="text-sm text-[var(--seal)] underline">
            New here? Create an account
          </Link>
        </header>

        <main className="flex flex-1 items-center py-8">
          <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <section className="space-y-6">
              <div className="inline-flex items-center gap-2 border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-2 text-sm uppercase tracking-[0.2em]">
                <ShieldCheck className="h-4 w-4 text-[var(--seal)]" />
                Sign in to continue
              </div>
              <div className="space-y-3">
                <h1 className="font-['Source_Serif_4'] text-4xl leading-tight sm:text-5xl">
                  Welcome back to your trusted agreement desk.
                </h1>
                <p className="max-w-xl text-lg text-[var(--ink)]/70">
                  Sign in with your registered email and password to continue into your dashboard.
                </p>
              </div>
            </section>

            <section className="w-full max-w-md">
              <Card tone="stamp" className="border-t-4 border-t-[var(--seal)]">
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <Input
                    label="Email address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />

                  <div className="relative">
                    <Input
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-9 text-[var(--ink)]/50 hover:text-[var(--ink)]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {error && (
                    <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {error}
                    </p>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in…' : 'Sign in'}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>

                <p className="mt-4 text-center text-sm text-[var(--ink)]/60">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-[var(--seal)] underline">
                    Sign up
                  </Link>
                </p>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

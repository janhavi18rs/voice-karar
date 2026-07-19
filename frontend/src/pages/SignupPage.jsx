import { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import { register } from '../services/api'

const businessTypes = ['Manufacturer', 'Trader', 'Retailer', 'Service Provider', 'Other']
const industries = ['Textiles', 'Agriculture', 'Electronics', 'Food', 'Construction', 'Other']
const languages = ['Hindi', 'English', 'Marathi', 'Gujarati', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Other']

function validateEmail(value) {
  return /.+@.+\..+/.test(value)
}

function validateMobile(value) {
  return /^\+?[0-9]{10,12}$/.test(value)
}

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    businessName: '',
    email: '',
    mobile: '+91',
    password: '',
    confirmPassword: '',
    businessType: 'Manufacturer',
    businessCategory: 'Textiles',
    preferredLanguage: 'Hindi',
    acceptedTerms: false
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const passwordScore = useMemo(() => {
    const value = form.password
    if (!value) return 0
    let score = 0
    if (value.length >= 8) score += 1
    if (/[A-Z]/.test(value)) score += 1
    if (/\d/.test(value)) score += 1
    if (/[^A-Za-z0-9]/.test(value)) score += 1
    return score
  }, [form.password])

  const passwordLabel = ['Very weak', 'Weak', 'Fair', 'Strong'][Math.min(passwordScore, 3)] || 'Very weak'

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!form.name.trim()) nextErrors.name = 'Full name is required.'
    if (!form.businessName.trim()) nextErrors.businessName = 'Business name is required.'
    if (!validateEmail(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (!validateMobile(form.mobile)) nextErrors.mobile = 'Enter a valid mobile number.'
    if (form.password.length < 8) nextErrors.password = 'Use at least 8 characters.'
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.'
    if (!form.acceptedTerms) nextErrors.acceptedTerms = 'You must accept the terms.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    setServerError('')
    try {
      await register({
        name: form.name,
        businessName: form.businessName,
        mobile: form.mobile,
        email: form.email,
        password: form.password,
        businessType: form.businessType,
        businessCategory: form.businessCategory,
        preferredLanguage: form.preferredLanguage,
      })
      setSubmitted(true)
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-[var(--ledger-line)] pb-4">
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--ink)]/70">
            <ShieldCheck className="h-4 w-4 text-[var(--seal)]" />
            Voice Karar
          </div>
          <Link to="/login" className="text-sm text-[var(--seal)] underline">Already have an account?</Link>
        </header>

        <main className="flex flex-1 items-center py-8">
          <div className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <section className="space-y-4">
              <div className="inline-flex items-center gap-2 border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-2 text-sm uppercase tracking-[0.2em]">
                <CheckCircle2 className="h-4 w-4 text-[var(--trust-green)]" />
                Create your account
              </div>
              <h1 className="max-w-xl font-['Source_Serif_4'] text-4xl leading-tight sm:text-5xl">
                Set up your account as a business owner.
              </h1>
              <p className="max-w-xl text-lg text-[var(--ink)]/70">
                Your preferred language and business context help every agreement feel natural from the first conversation.
              </p>
            </section>

            <Card tone="stamp" className="border-t-4 border-t-[var(--seal)]">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Asha Mehta" className={errors.name ? 'border-[var(--seal)]' : ''} />
                  <Input label="Business Name" name="businessName" value={form.businessName} onChange={handleChange} placeholder="Mehta Traders" className={errors.businessName ? 'border-[var(--seal)]' : ''} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Email" name="email" value={form.email} onChange={handleChange} placeholder="asha@mehta.co" className={errors.email ? 'border-[var(--seal)]' : ''} />
                  <Input label="Mobile Number" name="mobile" value={form.mobile} onChange={handleChange} placeholder="+919876543210" className={errors.mobile ? 'border-[var(--seal)]' : ''} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" className={errors.password ? 'border-[var(--seal)]' : ''} />
                  <Input label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" className={errors.confirmPassword ? 'border-[var(--seal)]' : ''} />
                </div>

                <div className="rounded-none border border-[var(--ledger-line)] bg-[var(--paper)] p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="uppercase tracking-[0.16em] text-[var(--ink)]/70">Password strength</span>
                    <span className="font-semibold text-[var(--seal)]">{passwordLabel}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className={`h-2 flex-1 ${step <= passwordScore ? 'bg-[var(--trust-green)]' : 'bg-[var(--ledger-line)]'}`} />
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--ink)]/80">
                    <span className="mb-2 block">Business Type</span>
                    <select name="businessType" value={form.businessType} onChange={handleChange} className="w-full border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-3 text-base text-[var(--ink)] outline-none">
                      {businessTypes.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--ink)]/80">
                    <span className="mb-2 block">Business Category</span>
                    <select name="businessCategory" value={form.businessCategory} onChange={handleChange} className="w-full border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-3 text-base text-[var(--ink)] outline-none">
                      {industries.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </label>
                </div>

                <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--ink)]/80">
                  <span className="mb-2 block">Preferred Language</span>
                  <select name="preferredLanguage" value={form.preferredLanguage} onChange={handleChange} className="w-full border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-3 text-base text-[var(--ink)] outline-none">
                    {languages.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>

                <label className="flex items-start gap-3 text-sm text-[var(--ink)]/80">
                  <input type="checkbox" name="acceptedTerms" checked={form.acceptedTerms} onChange={handleChange} className="mt-1 h-4 w-4 border-[var(--ledger-line)] accent-[var(--seal)]" />
                  <span>I agree to the terms and conditions.</span>
                </label>

                {errors.name || errors.businessName || errors.email || errors.mobile || errors.password || errors.confirmPassword || errors.acceptedTerms ? (
                  <div className="rounded-none border border-[var(--seal)]/20 bg-[var(--seal)]/10 p-3 text-sm text-[var(--seal)]">
                    {errors.name && <p>{errors.name}</p>}
                    {errors.businessName && <p>{errors.businessName}</p>}
                    {errors.email && <p>{errors.email}</p>}
                    {errors.mobile && <p>{errors.mobile}</p>}
                    {errors.password && <p>{errors.password}</p>}
                    {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
                    {errors.acceptedTerms && <p>{errors.acceptedTerms}</p>}
                  </div>
                ) : null}

                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? 'Creating account…' : <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>

                {serverError && (
                  <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {serverError}
                  </p>
                )}
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

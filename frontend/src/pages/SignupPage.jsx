import { useMemo, useState } from 'react'
import { ArrowRight, Check, Mic, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/api'

const businessTypes = ['Manufacturer', 'Trader', 'Retailer', 'Service Provider', 'Other']
const industries = ['Textiles', 'Agriculture', 'Electronics', 'Food', 'Construction', 'Other']
const languages = ['Hindi', 'English', 'Marathi', 'Gujarati', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Other']

function validateEmail(v) { return /.+@.+\..+/.test(v) }
function validateMobile(v) { return /^\+?[0-9]{10,15}$/.test(v) }

const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-[#4d9178]']
const strengthLabels = ['Very weak', 'Weak', 'Fair', 'Strong']

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', businessName: '', email: '', mobile: '+91',
    password: '', confirmPassword: '',
    businessType: 'Manufacturer', businessCategory: 'Textiles',
    preferredLanguage: 'Hindi', acceptedTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordScore = useMemo(() => {
    const v = form.password
    if (!v) return 0
    let s = 0
    if (v.length >= 8) s++
    if (/[A-Z]/.test(v)) s++
    if (/\d/.test(v)) s++
    if (/[^A-Za-z0-9]/.test(v)) s++
    return s
  }, [form.password])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((c) => ({ ...c, [name]: type === 'checkbox' ? checked : value }))
    setErrors((c) => ({ ...c, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required.'
    if (!form.businessName.trim()) errs.businessName = 'Business name is required.'
    if (!validateEmail(form.email)) errs.email = 'Enter a valid email address.'
    if (!validateMobile(form.mobile)) errs.mobile = 'Enter a valid mobile number.'
    if (form.password.length < 8) errs.password = 'Use at least 8 characters.'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.'
    if (!form.acceptedTerms) errs.acceptedTerms = 'You must accept the terms.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    setServerError('')
    try {
      await register({
        name: form.name, businessName: form.businessName,
        mobile: form.mobile, email: form.email, password: form.password,
        businessType: form.businessType, businessCategory: form.businessCategory,
        preferredLanguage: form.preferredLanguage,
      })
      navigate('/create-agreement')
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field) =>
    `w-full rounded-lg border ${errors[field] ? 'border-[#92372c] bg-red-50/30' : 'border-[#e8d5cc] bg-[#faf7f5]'} px-4 py-2 text-[14px] text-[#1a1210] placeholder:text-[#bfada5] outline-none focus:border-[#92372c] focus:ring-2 focus:ring-[#92372c]/10 transition-all`

  const selectClass = `w-full rounded-lg border border-[#e8d5cc] bg-[#faf7f5] px-4 py-2 text-[14px] text-[#1a1210] outline-none focus:border-[#92372c] focus:ring-2 focus:ring-[#92372c]/10 transition-all appearance-none`

  const Label = ({ children }) => (
    <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-[#736862] mb-2">{children}</span>
  )

  const anyError = Object.values(errors).some(Boolean)

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
            to="/login"
            className="text-[13.5px] font-semibold text-[#92372c] hover:underline underline-offset-2 transition-all"
          >
            Already have an account? Sign in →
          </Link>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="relative z-10 px-6 py-12">
        <div className="mx-auto grid w-full max-w-7xl items-start gap-16 lg:grid-cols-[1fr_0.96fr]">

          {/* Left: Headline */}
          <div className="max-w-2xl lg:sticky lg:top-24 pt-4 flex flex-col gap-9">
            {/* Badge */}
            <p className="text-[14px] font-bold uppercase tracking-[0.24em] text-[#9b493d]">
              Built for Indian MSMEs
            </p>

            {/* Heading */}
            <h1 className="font-['Source_Serif_4'] text-[54px] font-extrabold leading-[1.12] text-[#171513] tracking-tight xl:text-[62px]">
              Set up your account as a business owner.
            </h1>

            {/* Description */}
            <p className="max-w-2xl text-[20px] leading-9 text-[#736862]">
              Your preferred language and business context help every agreement feel natural — from the very first conversation.
            </p>

            {/* Trust bullets */}
            <ul className="flex flex-col gap-4">
              {[
                'Create agreements from voice or text in minutes',
                'Supports Hindi, Gujarati, Tamil & more',
                'Buyers confirm digitally — no chasing needed',
              ].map((item) => (
                <li key={item} className="flex items-start gap-4 text-[18px] leading-8 text-[#736862]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eef7f3] border border-[#b8dece]">
                    <Check className="h-3 w-3 text-[#4d9178]" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Form Card */}
          <div className="relative ml-auto w-full max-w-[640px]">
            {/* glow */}
            <div className="absolute -inset-3 bg-gradient-to-br from-[#ffd8d1]/20 to-[#cae8dd]/10 rounded-[28px] blur-2xl pointer-events-none" />

            <div className="relative rounded-[20px] border border-[#e8d5cc] bg-white shadow-xl overflow-hidden">
              {/* top accent */}
              <div className="h-1 w-full bg-gradient-to-r from-[#92372c] to-[#bc6f62]" />

              <div className="px-6 py-6">
                <h2 className="font-['Source_Serif_4'] text-2xl font-bold text-[#1a1210] mb-10">Create your account</h2>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Name + Business Name */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Full Name</Label>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="Asha Mehta" className={inputClass('name')} />
                      {errors.name && <p className="mt-1 text-[12px] text-[#92372c]">{errors.name}</p>}
                    </div>
                    <div>
                      <Label>Business Name</Label>
                      <input name="businessName" value={form.businessName} onChange={handleChange} placeholder="Mehta Traders" className={inputClass('businessName')} />
                      {errors.businessName && <p className="mt-1 text-[12px] text-[#92372c]">{errors.businessName}</p>}
                    </div>
                  </div>

                  {/* Email + Mobile */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Email</Label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="asha@mehta.co" className={inputClass('email')} />
                      {errors.email && <p className="mt-1 text-[12px] text-[#92372c]">{errors.email}</p>}
                    </div>
                    <div>
                      <Label>Mobile Number</Label>
                      <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="+919876543210" className={inputClass('mobile')} />
                      {errors.mobile && <p className="mt-1 text-[12px] text-[#92372c]">{errors.mobile}</p>}
                    </div>
                  </div>

                  {/* Password + Confirm */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Password</Label>
                      <div className="relative">
                        <input
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={form.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className={`${inputClass('password')} pr-11`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#92372c]/60 hover:text-[#92372c] transition-colors"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                        </button>
                      </div>
                      {errors.password && <p className="mt-1 text-[12px] text-[#92372c]">{errors.password}</p>}
                    </div>
                    <div>
                      <Label>Confirm Password</Label>
                      <div className="relative">
                        <input
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={form.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className={`${inputClass('confirmPassword')} pr-11`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#92372c]/60 hover:text-[#92372c] transition-colors"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="mt-1 text-[12px] text-[#92372c]">{errors.confirmPassword}</p>}
                    </div>
                  </div>

                  {/* Password strength */}
                  {form.password && (
                    <div className="rounded-xl border border-[#e8d5cc] bg-[#faf7f5] px-4 py-3">
                      <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                        <span className="uppercase tracking-wider text-[#b09488]">Password Strength</span>
                        <span className={`${strengthColors[Math.min(passwordScore - 1, 3)] || 'text-[#b09488]'} font-bold`} style={{ color: ['#f87171','#fb923c','#facc15','#4d9178'][Math.min(passwordScore - 1, 3)] }}>
                          {strengthLabels[Math.min(passwordScore - 1, 3)] || 'Very weak'}
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step <= passwordScore ? strengthColors[Math.min(passwordScore - 1, 3)] : 'bg-[#e8d5cc]'}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Business Type + Category */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Business Type</Label>
                      <select name="businessType" value={form.businessType} onChange={handleChange} className={selectClass}>
                        {businessTypes.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Business Category</Label>
                      <select name="businessCategory" value={form.businessCategory} onChange={handleChange} className={selectClass}>
                        {industries.map((i) => <option key={i}>{i}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Preferred Language */}
                  <div>
                    <Label>Preferred Language</Label>
                    <select name="preferredLanguage" value={form.preferredLanguage} onChange={handleChange} className={selectClass}>
                      {languages.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptedTerms"
                      checked={form.acceptedTerms}
                      onChange={handleChange}
                      className="mt-0.5 h-4 w-4 rounded border-[#e8d5cc] accent-[#92372c] cursor-pointer"
                    />
                    <span className={`text-[13.5px] leading-relaxed ${errors.acceptedTerms ? 'text-[#92372c]' : 'text-[#736862]'}`}>
                      I agree to the{' '}
                      <span className="text-[#92372c] underline underline-offset-2 cursor-pointer hover:text-[#7d2e24]">terms and conditions</span>.
                    </span>
                  </label>

                  {/* Server error */}
                  {serverError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                      {serverError}
                    </div>
                  )}

                  {/* Validation summary */}
                  {anyError && !serverError && (
                    <div className="rounded-lg border border-[#f4d0cb] bg-[#fdf4f3] px-4 py-3 text-[13px] text-[#92372c]">
                      Please fix the errors above before continuing.
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 rounded-lg bg-[#92372c] hover:bg-[#7d2e24] disabled:bg-[#92372c]/60 text-white font-bold text-[14px] py-3 shadow-md hover:shadow-[0_4px_14px_0_rgba(140,59,46,0.35)] active:scale-[0.99] transition-all duration-200"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating account…
                      </span>
                    ) : (
                      <>Create Account <ArrowRight className="h-4 w-4" /></>
                    )}
                  </button>

                  <p className="text-center text-[13px] text-[#8c7e77]">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#92372c] font-semibold hover:underline underline-offset-2">
                      Sign in
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

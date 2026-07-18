import { useEffect, useState } from 'react'
import { Camera, Lock, Save, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import { getCurrentUser, updateProfile } from '../services/api'

const businessTypes = ['Manufacturer', 'Trader', 'Retailer', 'Service Provider', 'Other']
const industries = ['Textiles', 'Agriculture', 'Electronics', 'Food', 'Construction', 'Other']
const languages = ['Hindi', 'English', 'Marathi', 'Gujarati', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Other']

export default function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      const current = await getCurrentUser()
      setUser(current)
    }
    loadUser()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setUser((current) => ({ ...current, [name]: value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    const updated = await updateProfile(user)
    setUser(updated)
    setSaving(false)
    setMessage('Profile saved')
    setTimeout(() => setMessage(''), 1800)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-[var(--ledger-line)] pb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink)]/75">Profile</p>
            <h1 className="font-['Source_Serif_4'] text-3xl sm:text-4xl">Your business profile</h1>
          </div>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
        </header>

        <main className="grid gap-6 py-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card tone="stamp" className="border-t-4 border-t-[var(--seal)]">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[var(--ledger-line)] bg-[var(--seal)]/10 text-[var(--seal)]">
                {user.avatarUrl ? <img src={user.avatarUrl} alt="Profile" className="h-full w-full rounded-full object-cover" /> : <UserRound className="h-10 w-10" />}
              </div>
              <div>
                <h2 className="font-['Source_Serif_4'] text-2xl">{user.name}</h2>
                <p className="text-sm text-[var(--ink)]/80">{user.businessName}</p>
              </div>
              <button className="inline-flex items-center gap-2 border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-2 text-sm uppercase tracking-[0.16em]">
                <Camera className="h-4 w-4" />
                Upload photo
              </button>
            </div>

            <div className="mt-6 grid gap-3 border-t border-[var(--ledger-line)] pt-4 text-sm">
              <div className="flex items-center justify-between border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-3">
                <span className="text-[var(--ink)]/60">Member since</span>
                <span className="font-semibold">{user.memberSince}</span>
              </div>
              <div className="flex items-center justify-between border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-3">
                <span className="text-[var(--ink)]/60">Agreements created</span>
                <span className="font-semibold">{user.totalAgreements ?? 0}</span>
              </div>
            </div>
          </Card>

          <Card>
            <form className="space-y-4" onSubmit={handleSave}>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Full Name" name="name" value={user.name} onChange={handleChange} />
                <Input label="Business Name" name="businessName" value={user.businessName} onChange={handleChange} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Email" name="email" value={user.email} onChange={handleChange} />
                <Input label="Mobile Number" name="mobile" value={user.mobile} onChange={handleChange} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--ink)]/80">
                  <span className="mb-2 block">Business Type</span>
                  <select name="businessType" value={user.businessType} onChange={handleChange} className="w-full border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-3 text-base text-[var(--ink)] outline-none">
                    {businessTypes.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
                <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--ink)]/80">
                  <span className="mb-2 block">Business Category</span>
                  <select name="businessCategory" value={user.businessCategory} onChange={handleChange} className="w-full border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-3 text-base text-[var(--ink)] outline-none">
                    {industries.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
              </div>
              <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--ink)]/80">
                <span className="mb-2 block">Preferred Language</span>
                <select name="preferredLanguage" value={user.preferredLanguage} onChange={handleChange} className="w-full border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-3 text-base text-[var(--ink)] outline-none">
                  {languages.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>

              <div className="rounded-none border border-[var(--ledger-line)] bg-[var(--paper)] p-4">
                <div className="flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-[var(--ink)]/70">
                  <Lock className="h-4 w-4 text-[var(--seal)]" />
                  Change Password
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Input label="Current Password" type="password" />
                  <Input label="New Password" type="password" />
                  <Input label="Confirm Password" type="password" className="md:col-span-2" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" className={saving ? 'stamp-pressed' : ''}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving…' : 'Save Changes'}
                </Button>
                {message ? <span className="text-sm text-[var(--trust-green)]">{message}</span> : null}
              </div>
            </form>
          </Card>
        </main>
      </div>
    </div>
  )
}

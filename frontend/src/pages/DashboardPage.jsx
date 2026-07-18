import { useEffect, useMemo, useState } from 'react'
import { Filter, FolderUp, Mic, Plus, Search, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import MobileBottomNav from '../components/MobileBottomNav'
import Navbar from '../components/Navbar'
import StatusBadge from '../components/StatusBadge'
import { getAgreements, getCurrentUser } from '../services/api'

const stats = [
  { key: 'total', label: 'Total Agreements', value: '3' },
  { key: 'pending', label: 'Pending', value: '2' },
  { key: 'confirmed', label: 'Confirmed', value: '1' },
  { key: 'needs-changes', label: 'Needs Changes', value: '1' }
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const [agreements, setAgreements] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [agreementData, userData] = await Promise.all([getAgreements(), getCurrentUser()])
      setAgreements(agreementData)
      setUser(userData)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    return agreements.filter((agreement) => {
      const matchesStatus = filter === 'all' ? true : agreement.status === filter
      const matchesText = `${agreement.otherPartyName} ${agreement.product}`.toLowerCase().includes(search.toLowerCase())
      return matchesStatus && matchesText
    })
  }, [agreements, filter, search])

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <Navbar />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink)]/75">Voice Karar</p>
              <h1 className="font-['Source_Serif_4'] text-3xl sm:text-4xl">Welcome back, {user?.name?.split(' ')[0] || 'Asha'}</h1>
              <p className="mt-2 text-sm text-[var(--ink)]/80">{user?.businessName || 'Mehta Traders'}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => navigate('/create-agreement')}>
                <Plus className="mr-2 h-4 w-4" /> Create New Agreement
              </Button>
              <div className="relative">
                <button onClick={() => setMenuOpen((value) => !value)} className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--ledger-line)] bg-[var(--paper)] text-[var(--seal)]">
                  {user?.avatarUrl ? <img src={user.avatarUrl} alt="Profile" className="h-full w-full rounded-full object-cover" /> : <UserRound className="h-5 w-5" />}
                </button>
                {menuOpen ? (
                  <div className="absolute right-0 mt-2 w-40 border border-[var(--ledger-line)] bg-[var(--paper)] shadow-sm">
                    <button onClick={() => navigate('/profile')} className="block w-full px-3 py-2 text-left text-sm">Profile</button>
                    <button onClick={() => navigate('/dashboard')} className="block w-full px-3 py-2 text-left text-sm">Settings</button>
                    <button onClick={() => navigate('/login')} className="block w-full px-3 py-2 text-left text-sm">Log Out</button>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.key} className="border-t-4 border-t-[var(--seal)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--ink)]/60">{stat.label}</p>
                    <p className="mt-2 font-['Source_Serif_4'] text-3xl tabular-nums">{stat.value}</p>
                  </div>
                  <div className="rounded-full border border-[var(--ledger-line)] bg-[var(--paper)] p-2 text-[var(--seal)]">
                    {stat.key === 'pending' ? <Mic className="h-4 w-4" /> : stat.key === 'confirmed' ? <FolderUp className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="border-t-4 border-t-[var(--seal)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <label className="flex flex-1 items-center gap-2 border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-2">
                <Search className="h-4 w-4 text-[var(--ink)]/60" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search supplier or product" className="w-full bg-transparent text-sm outline-none" />
              </label>
              <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'confirmed', 'needs-changes'].map((value) => (
                  <button key={value} onClick={() => setFilter(value)} className={`border px-3 py-2 text-sm uppercase tracking-[0.16em] ${filter === value ? 'border-[var(--seal)] bg-[var(--seal)] text-[var(--paper)]' : 'border-[var(--ledger-line)] bg-[var(--paper)] text-[var(--ink)]/70'}`}>
                    {value === 'all' ? 'All' : value === 'needs-changes' ? 'Needs Changes' : value.charAt(0).toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <div className="flex items-center justify-between">
                <h2 className="font-['Source_Serif_4'] text-2xl">Recent Agreements</h2>
                <span className="text-sm text-[var(--ink)]/60">{filtered.length} shown</span>
              </div>
              <div className="mt-4 space-y-3">
                {filtered.map((agreement) => (
                  <div key={agreement.id} className="border border-[var(--ledger-line)] bg-[var(--paper)] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{agreement.otherPartyName}</p>
                          {agreement.source === 'upload' ? <FolderUp className="h-4 w-4 text-[var(--ink)]/60" /> : agreement.source === 'manual' ? <Search className="h-4 w-4 text-[var(--ink)]/60" /> : <Mic className="h-4 w-4 text-[var(--ink)]/60" />}
                        </div>
                        <p className="mt-1 text-sm text-[var(--ink)]/70">{agreement.product}</p>
                      </div>
                      <StatusBadge status={agreement.status} />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--ink)]/70">
                      <span>{agreement.createdAt}</span>
                      <button onClick={() => navigate(`/agreement/${agreement.id}`)} className="text-[var(--seal)] underline">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-t-4 border-t-[var(--seal)]">
              <h2 className="font-['Source_Serif_4'] text-2xl">Pending Actions</h2>
              <p className="mt-3 text-sm text-[var(--ink)]/70">2 agreements waiting for buyer confirmation and 1 agreement needs your review.</p>
              <div className="mt-4 space-y-3">
                <div className="border border-[var(--ledger-line)] bg-[var(--paper)] p-3 text-sm">
                  <p className="font-semibold">2 agreements waiting for buyer confirmation</p>
                </div>
                <div className="border border-[var(--ledger-line)] bg-[var(--paper)] p-3 text-sm">
                  <p className="font-semibold">1 agreement needs your review</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  )
}

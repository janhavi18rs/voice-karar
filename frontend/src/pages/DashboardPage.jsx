import { useEffect, useMemo, useState } from 'react'
import { Filter, FolderUp, Mic, Plus, Search, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import MobileBottomNav from '../components/MobileBottomNav'
import Navbar from '../components/Navbar'
import StatusBadge from '../components/StatusBadge'
import { getDashboard, getAgreements, getStoredUser, clearSession } from '../services/api'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [agreements, setAgreements] = useState([])
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, needsChanges: 0, cancelled: 0 })
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Load user from localStorage (set during login/register)
    setUser(getStoredUser())

    const load = async () => {
      try {
        setLoading(true)
        // Fetch dashboard stats + agreement list in parallel
        const [dashData, agreementsData] = await Promise.all([
          getDashboard(),
          getAgreements({ limit: 50 }),
        ])
        setStats(dashData.stats || { total: 0, pending: 0, confirmed: 0, needsChanges: 0, cancelled: 0 })
        setAgreements(agreementsData.agreements || dashData.recentAgreements || [])
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Map backend status strings to display labels and filter values
  const normalizeStatus = (status) => {
    // Backend uses: 'pending' | 'confirmed' | 'needs_changes' | 'cancelled'
    // UI filter uses: 'pending' | 'confirmed' | 'needs-changes' | 'cancelled'
    return status?.replace('_', '-') || 'pending'
  }

  const filtered = useMemo(() => {
    return agreements.filter((agreement) => {
      const status = normalizeStatus(agreement.status)
      const matchesStatus = filter === 'all' ? true : status === filter
      // Support both backend shape (counterParty.name, agreedTerms.product)
      // and any pre-normalised shape
      const partyName = agreement.counterParty?.name || agreement.otherPartyName || ''
      const product = agreement.agreedTerms?.product || agreement.product || ''
      const matchesText = `${partyName} ${product}`.toLowerCase().includes(search.toLowerCase())
      return matchesStatus && matchesText
    })
  }, [agreements, filter, search])

  const statCards = [
    { key: 'total', label: 'Total Agreements', value: stats.total },
    { key: 'pending', label: 'Pending', value: stats.pending },
    { key: 'confirmed', label: 'Confirmed', value: stats.confirmed },
    { key: 'needs-changes', label: 'Needs Changes', value: stats.needsChanges },
  ]

  const handleLogout = () => {
    clearSession()
    navigate('/login')
  }

  return (
    <div className="min-h-screen border-[6px] border-[#5543d8] bg-[var(--paper)] text-[var(--ink)]">
      <Navbar />
      <div className="px-7 py-9">
        <div className="mx-auto flex max-w-7xl flex-col gap-7">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--seal)]">Voice Karar</p>
              <h1 className="mt-2 font-['Source_Serif_4'] text-4xl font-bold sm:text-5xl">
                Welcome back, {user?.name?.split(' ')[0] || 'there'}
              </h1>
              <p className="mt-2 text-sm text-[var(--ink)]/80">{user?.email || ''}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => navigate('/create-agreement')}>
                <Plus className="mr-2 h-4 w-4" /> Create New Agreement
              </Button>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--ledger-line)] bg-white text-[var(--seal)]"
                >
                  <UserRound className="h-5 w-5" />
                </button>
                {menuOpen ? (
                  <div className="absolute right-0 mt-2 w-40 border border-[var(--ledger-line)] bg-[var(--paper)] shadow-sm">
                    <button onClick={() => navigate('/profile')} className="block w-full px-3 py-2 text-left text-sm">
                      Profile
                    </button>
                    <button onClick={handleLogout} className="block w-full px-3 py-2 text-left text-sm text-[var(--seal)]">
                      Log Out
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          {error && (
            <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => (
              <Card key={stat.key} className="border-t-4 border-t-[var(--seal)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--ink)]/60">{stat.label}</p>
                    <p className="mt-2 font-['Source_Serif_4'] text-3xl tabular-nums">
                      {loading ? '—' : stat.value}
                    </p>
                  </div>
                  <div className="rounded-full border border-[var(--ledger-line)] bg-[var(--paper)] p-2 text-[var(--seal)]">
                    {stat.key === 'pending' ? <Mic className="h-4 w-4" /> : stat.key === 'confirmed' ? <FolderUp className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Filter Bar */}
          <Card className="border-t-4 border-t-[var(--seal)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <label className="flex flex-1 items-center gap-2 border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-2">
                <Search className="h-4 w-4 text-[var(--ink)]/60" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search supplier or product"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center text-[var(--ink)]/60">
                  <Filter className="h-4 w-4" />
                </span>
                {['all', 'pending', 'confirmed', 'needs-changes'].map((value) => (
                  <button
                    key={value}
                    onClick={() => setFilter(value)}
                    className={`rounded-md border px-3 py-2 text-sm uppercase tracking-[0.16em] ${filter === value ? 'border-[var(--seal)] bg-[var(--seal)] text-white' : 'border-[var(--ledger-line)] bg-white text-[var(--ink)]/70'}`}
                  >
                    {value === 'all' ? 'All' : value === 'needs-changes' ? 'Needs Changes' : value.charAt(0).toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Agreement List */}
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <div className="flex items-center justify-between">
                <h2 className="font-['Source_Serif_4'] text-2xl">Agreement History</h2>
                <span className="text-sm text-[var(--ink)]/60">{filtered.length} shown</span>
              </div>
              <div className="mt-4 space-y-3">
                {loading ? (
                  <p className="py-8 text-center text-sm text-[var(--ink)]/60">Loading agreements…</p>
                ) : filtered.length === 0 ? (
                  <p className="py-8 text-center text-sm text-[var(--ink)]/60">No agreements yet. Create your first one!</p>
                ) : (
                  filtered.map((agreement) => {
                    const id = agreement._id || agreement.id
                    const partyName = agreement.counterParty?.name || agreement.otherPartyName || 'Other party'
                    const product = agreement.agreedTerms?.product || agreement.product || 'Business agreement'
                    const status = normalizeStatus(agreement.status)
                    const createdAt = agreement.createdAt
                      ? new Date(agreement.createdAt).toLocaleDateString('en-IN')
                      : ''
                    return (
                      <div key={id} className="rounded-md border border-[var(--ledger-line)] bg-[#fffaf7] p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{partyName}</p>
                            </div>
                            <p className="mt-1 text-sm text-[var(--ink)]/70">{product}</p>
                          </div>
                          <StatusBadge status={status} />
                        </div>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--ink)]/70">
                          <span>{createdAt}</span>
                          <button
                            onClick={() => navigate(`/agreement/${id}`)}
                            className="text-[var(--seal)] underline"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </Card>

            <Card className="border-t-4 border-t-[var(--seal)]">
              <h2 className="font-['Source_Serif_4'] text-2xl">Pending Actions</h2>
              <p className="mt-3 text-sm text-[var(--ink)]/70">
                {stats.pending > 0
                  ? `${stats.pending} agreement${stats.pending > 1 ? 's' : ''} waiting for buyer confirmation.`
                  : 'No pending actions.'}
                {stats.needsChanges > 0
                  ? ` ${stats.needsChanges} agreement${stats.needsChanges > 1 ? 's need' : ' needs'} your review.`
                  : ''}
              </p>
              <div className="mt-4 space-y-3">
                {stats.pending > 0 && (
                    <div className="rounded-md border border-[var(--ledger-line)] bg-[#fffaf7] p-3 text-sm">
                    <p className="font-semibold">{stats.pending} agreement{stats.pending > 1 ? 's' : ''} waiting for buyer confirmation</p>
                  </div>
                )}
                {stats.needsChanges > 0 && (
                    <div className="rounded-md border border-[var(--ledger-line)] bg-[#fffaf7] p-3 text-sm">
                    <p className="font-semibold">{stats.needsChanges} agreement{stats.needsChanges > 1 ? 's need' : ' needs'} your review</p>
                  </div>
                )}
                {stats.pending === 0 && stats.needsChanges === 0 && !loading && (
                  <div className="rounded-md border border-[var(--ledger-line)] bg-[#fffaf7] p-3 text-sm text-[var(--ink)]/60">
                    <p>All agreements are up to date.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  )
}

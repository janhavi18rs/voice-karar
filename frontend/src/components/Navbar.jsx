import { Bell, CircleHelp, LogOut, ShieldCheck, User } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { clearSession } from '../services/api'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/create-agreement', label: 'Agreements' },
  { to: '/agreement-preview', label: 'Templates' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const logout = () => {
    clearSession()
    navigate('/login')
  }

  return (
    <header className="border-b border-[var(--ledger-line)] bg-[var(--paper)]/95 px-7 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-9">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 font-['Source_Serif_4'] text-2xl font-bold text-[var(--seal)] no-underline"
          >
            <ShieldCheck className="h-5 w-5" />
            Voice Karar
          </Link>
          <nav className="hidden items-center gap-8 text-[13px] font-semibold md:flex">
            {navItems.map((item) => {
              const active = location.pathname === item.to || (item.to === '/create-agreement' && location.pathname.includes('agreement'))
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`pb-1 no-underline ${active ? 'border-b-2 border-[var(--seal)] text-[var(--seal)]' : 'text-[#5e5652]'}`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button title="Notifications" className="text-[#5f5550]">
            <Bell className="h-4 w-4" />
          </button>
          <button title="Help" className="text-[#5f5550]">
            <CircleHelp className="h-4 w-4" />
          </button>
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((s) => !s)}
              title="Profile"
              className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-[#d9c8bf] bg-[#efe1d6]"
            >
              <User className="h-4 w-4 text-[var(--seal)]" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 z-20 mt-3 w-44 rounded-md border border-[var(--ledger-line)] bg-white py-2 shadow-lg">
                <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--ink)] no-underline">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[var(--seal)]">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

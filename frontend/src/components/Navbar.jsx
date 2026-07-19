import { Bell, CircleHelp, LogOut, Mic, User } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { clearSession } from '../services/api'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/ai-agent', label: 'AI Agent' },
  { to: '/create-agreement', label: 'Agreements' },
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

  const handleNav = (event, to) => {
    if (to.includes('#')) {
      event.preventDefault()
      const [path, hash] = to.split('#')
      if (location.pathname !== path) {
        navigate(to)
        return
      }
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.replaceState(null, '', to)
    }
  }

  return (
    <header className="border-b border-[var(--ledger-line)] bg-[var(--paper)]/95 px-6 py-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-10">
          <Link
            to="/dashboard"
            className="flex items-center gap-5 no-underline"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#a33a2f] text-white shadow-lg shadow-[#a33a2f]/20">
              <Mic className="h-7 w-7" />
            </span>
            <span className="font-['Source_Serif_4'] text-4xl font-extrabold tracking-tight text-[#171513]">
              Voice Karar
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-[13px] font-semibold md:flex">
            {navItems.map((item) => {
              const active = location.pathname === item.to || (item.to === '/create-agreement' && location.pathname.includes('agreement'))
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={(event) => handleNav(event, item.to)}
                  className={`relative pb-1 no-underline transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--seal)] after:transition-all after:duration-200 hover:text-[var(--seal)] hover:after:w-full ${active ? 'text-[var(--seal)] after:w-full' : 'text-[#5e5652]'}`}
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

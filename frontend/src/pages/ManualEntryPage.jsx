import { useState } from 'react'
import { PenSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Navbar from '../components/Navbar'

export default function ManualEntryPage() {
  const navigate = useNavigate()
  const [text, setText] = useState('I agreed with Ramesh to supply 500 cotton shirts for ₹120 each. Delivery will be on 25 July.')

  return (
    <div className="min-h-screen bg-[#fffaf7] text-[var(--ink)]">
      <Navbar />
      <div className="mx-auto flex min-h-[calc(100vh-104px)] max-w-6xl flex-col px-6 py-8">
        <header className="space-y-2">
          <p className="text-[14px] uppercase tracking-[0.32em] text-[var(--ink)]/75">Manual entry</p>
          <h1 className="font-['Source_Serif_4'] text-4xl font-extrabold leading-tight sm:text-5xl">Write the agreement summary directly.</h1>
        </header>

        <main className="flex flex-1 items-center py-5">
          <Card tone="stamp" className="w-full border-t-4 border-t-[var(--seal)]">
            <div className="flex items-center gap-3 text-base uppercase tracking-[0.24em] text-[var(--ink)]/80">
              <PenSquare className="h-5 w-5 text-[var(--seal)]" />
              Ledger note
            </div>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="mt-5 min-h-[260px] w-full rounded-md border border-[var(--ledger-line)] bg-[var(--paper)] p-6 text-lg leading-8 outline-none"
              style={{ backgroundImage: 'linear-gradient(180deg, transparent 0, transparent 1.4rem, var(--ledger-line) 1.4rem, transparent calc(1.4rem + 1px))', backgroundSize: '100% 2.8rem' }}
              placeholder="I agreed with Ramesh to supply 500 cotton shirts for ₹120 each. Delivery will be on 25 July."
            />
            <div className="mt-5 flex items-center justify-between text-base text-[var(--ink)]/70">
              <span>{text.length} / 1000</span>
              <Button onClick={() => navigate('/processing', { state: { source: 'manual', text } })}>Generate Agreement</Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

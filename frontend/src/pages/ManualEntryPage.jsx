import { useState } from 'react'
import { PenSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'

export default function ManualEntryPage() {
  const navigate = useNavigate()
  const [text, setText] = useState('I agreed with Ramesh to supply 500 cotton shirts for ₹120 each. Delivery will be on 25 July.')

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink)]/75">Manual entry</p>
          <h1 className="font-['Source_Serif_4'] text-3xl sm:text-4xl">Write the agreement summary directly.</h1>
        </header>

        <main className="flex flex-1 items-center py-8">
          <Card tone="stamp" className="w-full border-t-4 border-t-[var(--seal)]">
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--ink)]/80">
              <PenSquare className="h-4 w-4 text-[var(--seal)]" />
              Ledger note
            </div>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="mt-4 min-h-[280px] w-full border border-[var(--ledger-line)] bg-[var(--paper)] p-5 text-base leading-7 outline-none"
              style={{ backgroundImage: 'linear-gradient(180deg, transparent 0, transparent 1.4rem, var(--ledger-line) 1.4rem, transparent calc(1.4rem + 1px))', backgroundSize: '100% 2.8rem' }}
              placeholder="I agreed with Ramesh to supply 500 cotton shirts for ₹120 each. Delivery will be on 25 July."
            />
            <div className="mt-4 flex items-center justify-between text-sm text-[var(--ink)]/70">
              <span>{text.length} / 1000</span>
              <Button onClick={() => navigate('/processing', { state: { source: 'manual', text } })}>Generate Agreement</Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

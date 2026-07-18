import { useMemo, useState } from 'react'
import { CheckCircle2, PenLine, Send } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'

export default function BuyerConfirmationPage() {
  const { agreementLink } = useParams()
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [mode, setMode] = useState('review')

  const summary = useMemo(() => ({
    supplierName: 'Ramesh Textiles',
    product: 'Cotton shirts',
    quantity: '500',
    price: '₹120 each',
    deliveryDate: '25 July',
    paymentTerms: '50% advance',
    specialConditions: 'Packed in branded cartons'
  }), [])

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <main className="flex flex-1 items-center py-8">
            <Card tone="stamp" className="w-full border-t-4 border-t-[var(--seal)]">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[var(--trust-green)] bg-[var(--trust-green)]/10 text-[var(--trust-green)]">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h1 className="font-['Source_Serif_4'] text-3xl">Agreement confirmed</h1>
                <p className="text-sm text-[var(--ink)]/80">The owner has been notified of your response.</p>
                <Button onClick={() => navigate('/login')}>Return home</Button>
              </div>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink)]/75">Buyer confirmation</p>
          <h1 className="font-['Source_Serif_4'] text-3xl sm:text-4xl">Review the agreement before you respond.</h1>
        </header>

        <main className="flex flex-1 flex-col gap-6 py-8">
          <Card tone="stamp" className="border-t-4 border-t-[var(--seal)]">
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(summary).map(([key, value]) => (
                <div key={key} className="border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-3 text-sm">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--ink)]/60">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="mt-1 font-semibold text-[var(--ink)]">{value}</p>
                </div>
              ))}
            </div>
          </Card>

          {mode === 'feedback' ? (
            <Card>
              <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--ink)]/80">
                <span className="mb-2 block">Feedback</span>
                <textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} className="min-h-24 w-full border border-[var(--ledger-line)] bg-[var(--paper)] p-3 outline-none" placeholder="Tell the owner what should change." />
              </label>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button onClick={() => { setSubmitted(true); setMode('review') }}>Submit Feedback</Button>
                <Button variant="secondary" onClick={() => setMode('review')}>Cancel</Button>
              </div>
            </Card>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => { setSubmitted(true); setMode('review') }}>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Accept Agreement
            </Button>
            <Button variant="secondary" onClick={() => setMode('feedback')}>
              <PenLine className="mr-2 h-4 w-4" /> Request Changes
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}

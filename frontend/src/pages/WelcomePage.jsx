import { ArrowRight, FileText, Mic, ShieldCheck, Sparkles, Waves } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import AppIcon from '../components/AppIcon'

const steps = [
  'Talk business as usual',
  'Record or upload a summary',
  'Both sides confirm digitally'
]

const values = [
  'No paperwork mid-conversation.',
  'Works in your language.',
  'Both sides confirm — no he-said-she-said.'
]

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-[var(--ledger-line)] pb-4">
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--ink)]/80">
            <AppIcon size={20} />
            Voice Karar
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate('/login')}>Log In</Button>
            <Button onClick={() => navigate('/signup')}>Get Started</Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center py-8 sm:py-12">
          <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-2 text-sm uppercase tracking-[0.2em]">
                <Sparkles className="h-4 w-4 text-[var(--seal)]" />
                Trusted agreements, spoken simply
              </div>
              <div className="space-y-4">
                <h1 className="max-w-2xl font-['Source_Serif_4'] text-4xl leading-tight sm:text-5xl lg:text-6xl">
                  Turn a spoken agreement into a signed one.
                </h1>
                <p className="max-w-xl text-lg text-[var(--ink)]/80">
                  Voice Karar helps business owners capture a deal in plain language and share it for confirmation without the back-and-forth of paper forms.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate('/signup')}>Get Started</Button>
                <Button variant="secondary" onClick={() => navigate('/login')}>Log In</Button>
              </div>
            </div>

            <Card tone="stamp" className="border-t-4 border-t-[var(--seal)]">
              <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--ink)]/80">
                <Waves className="h-4 w-4 text-[var(--seal)]" />
                Voice becomes record
              </div>
              <div className="mt-6 rounded-none border border-[var(--ledger-line)] bg-[var(--paper)] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink)]/60">Agreement summary</p>
                    <p className="mt-2 font-['Source_Serif_4'] text-2xl">500 shirts · ₹120 each</p>
                  </div>
                  <div className="rounded-full border border-[var(--seal)]/30 bg-[var(--seal)]/10 p-3">
                    <Mic className="h-6 w-6 text-[var(--seal)]" />
                  </div>
                </div>
                <div className="mt-6 flex items-end gap-2">
                  {[18, 40, 28, 52, 35, 60, 32].map((height, index) => (
                    <div key={index} className="flex-1 rounded-full bg-[var(--seal)]/25" style={{ height: `${height}px` }} />
                  ))}
                </div>
                  <div className="mt-6 flex items-center justify-between border-t border-[var(--ledger-line)] pt-4 text-sm text-[var(--ink)]/80">
                  <span>Shared for review</span>
                  <span className="inline-flex border border-[var(--trust-green)]/20 bg-[var(--trust-green)]/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--trust-green)]">
                    Confirmed
                  </span>
                </div>
              </div>
            </Card>
          </section>

          <section className="mt-12 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--ink)]/80">
                <FileText className="h-4 w-4 text-[var(--seal)]" />
                How it works
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {steps.map((step, index) => (
                  <div key={step} className="border border-[var(--ledger-line)] bg-[var(--paper)] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--seal)]">0{index + 1}</p>
                    <p className="mt-2 font-['Source_Serif_4'] text-xl">{step}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--ink)]/80">
                <ShieldCheck className="h-4 w-4 text-[var(--trust-green)]" />
                Why Voice Karar
              </div>
              <div className="mt-6 space-y-3">
                {values.map((value) => (
                  <div key={value} className="border border-[var(--ledger-line)] bg-[var(--paper)] px-4 py-3 text-sm text-[var(--ink)]/80">
                    {value}
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </main>

        <footer className="border-t border-[var(--ledger-line)] pt-4 text-sm text-[var(--ink)]/80">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-['Source_Serif_4'] text-lg text-[var(--ink)]">Voice Karar</span>
            <span>Built for Indian MSMEs</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { ArrowRight, MessageCircleMore, ShieldCheck } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'

export default function LoginPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-[var(--ledger-line)] pb-4">
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--ink)]/80">
            <ShieldCheck className="h-4 w-4 text-[var(--seal)]" />
            Voice Karar
          </div>
          <Link to="/signup" className="text-sm text-[var(--seal)] underline">New here? Create an account</Link>
        </header>

        <main className="flex flex-1 items-center py-8">
          <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <section className="space-y-6">
              <div className="inline-flex items-center gap-2 border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-2 text-sm uppercase tracking-[0.2em]">
                <ShieldCheck className="h-4 w-4 text-[var(--seal)]" />
                Sign in to continue
              </div>
              <div className="space-y-3">
                <h1 className="font-['Source_Serif_4'] text-4xl leading-tight sm:text-5xl">Welcome back to your trusted agreement desk.</h1>
                <p className="max-w-xl text-lg text-[var(--ink)]/70">Use the mock sign-in flow to continue into your dashboard and create a new draft.</p>
              </div>
            </section>

            <section className="w-full max-w-md">
              <Card tone="stamp" className="border-t-4 border-t-[var(--seal)]">
                <div className="mb-6 flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--ink)]/70">
                  <MessageCircleMore className="h-4 w-4 text-[var(--seal)]" />
                  {step === 'phone' ? 'Enter mobile or email' : 'Enter OTP'}
                </div>

                {step === 'phone' ? (
                  <div className="space-y-4">
                    <Input label="Phone number or email" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="98765 43210" />
                    <Button className="w-full" onClick={() => setStep('otp')}>
                      Send code <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                      {['1', '2', '3', '4'].map((digit) => (
                        <input key={digit} className="h-12 border border-[var(--ledger-line)] bg-[var(--paper)] text-center text-lg font-semibold text-[var(--ink)]" defaultValue={digit} />
                      ))}
                    </div>
                    <Button className="w-full" onClick={() => navigate('/dashboard')}>
                      Verify & continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

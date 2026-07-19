import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, PenLine } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import { acceptAgreement, getAgreementByShareToken, requestChanges } from '../services/api'

export default function BuyerConfirmationPage() {
  const { shareToken } = useParams()
  const navigate = useNavigate()
  const [agreement, setAgreement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [email, setEmail] = useState('')
  const [signatureText, setSignatureText] = useState('')
  const [feedback, setFeedback] = useState('')
  const [mode, setMode] = useState('review')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadAgreement = async () => {
      try {
        setLoading(true)
        const data = await getAgreementByShareToken(shareToken)
        setAgreement(data)
        setEmail(data?.counterParty?.email || '')
        setSignatureText(data?.counterParty?.name || '')
      } catch (err) {
        setError(err.message || 'Unable to load this agreement.')
      } finally {
        setLoading(false)
      }
    }

    if (shareToken) {
      loadAgreement()
    } else {
      setError('Share token is missing.')
      setLoading(false)
    }
  }, [shareToken])

  const agreementId = agreement?.id || agreement?._id
  const summary = useMemo(() => ({
    'Other Party': agreement?.counterParty?.name || 'Other party',
    Product: agreement?.agreedTerms?.product || 'Business agreement',
    Quantity: agreement?.agreedTerms?.quantity
      ? `${agreement.agreedTerms.quantity}${agreement.agreedTerms.unit ? ` ${agreement.agreedTerms.unit}` : ''}`
      : '',
    Price: agreement?.agreedTerms?.pricePerUnit || agreement?.agreedTerms?.totalAmount || '',
    'Delivery Date': agreement?.agreedTerms?.deliveryDate
      ? new Date(agreement.agreedTerms.deliveryDate).toLocaleDateString('en-IN')
      : '',
    'Payment Terms': agreement?.agreedTerms?.paymentTerms || '',
    'Special Conditions': agreement?.agreedTerms?.specialConditions || '',
  }), [agreement])

  const visibleSummary = Object.entries(summary).filter(([, value]) => value || value === 0)

  const handleAccept = async () => {
    if (!email.trim() || !signatureText.trim()) {
      setError('Please enter your email and signature name before accepting.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const response = await acceptAgreement({
        agreementId,
        email,
        signatureText,
      })
      setAgreement(response.agreement)
      setResult('accepted')
      setMode('review')
    } catch (err) {
      setError(err.message || 'Unable to accept this agreement.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRequestChanges = async () => {
    if (!email.trim()) {
      setError('Please enter your email before requesting changes.')
      return
    }
    if (feedback.trim().length < 5) {
      setError('Please describe the requested changes.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const response = await requestChanges({
        agreementId,
        email,
        note: feedback,
      })
      setAgreement(response.agreement)
      setResult('changes')
      setMode('review')
    } catch (err) {
      setError(err.message || 'Unable to request changes.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <main className="flex flex-1 items-center py-8">
            <Card tone="stamp" className="w-full border-t-4 border-t-[var(--seal)]">
              <p className="text-center text-sm text-[var(--ink)]/70">Loading agreement...</p>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  if (error && !agreement) {
    return (
      <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <main className="flex flex-1 items-center py-8">
            <Card tone="stamp" className="w-full border-t-4 border-t-[var(--seal)]">
              <div className="flex flex-col items-center gap-4 text-center">
                <AlertCircle className="h-10 w-10 text-[var(--seal)]" />
                <h1 className="font-['Source_Serif_4'] text-3xl">Unable to open agreement</h1>
                <p className="text-sm text-[var(--ink)]/80">{error}</p>
                <Button onClick={() => navigate('/login')}>Return home</Button>
              </div>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  if (result) {
    const accepted = result === 'accepted'
    return (
      <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <main className="flex flex-1 items-center py-8">
            <Card tone="stamp" className="w-full border-t-4 border-t-[var(--seal)]">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[var(--trust-green)] bg-[var(--trust-green)]/10 text-[var(--trust-green)]">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h1 className="font-['Source_Serif_4'] text-3xl">
                  {accepted ? 'Agreement confirmed' : 'Changes requested'}
                </h1>
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
              {visibleSummary.map(([key, value]) => (
                <div key={key} className="border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-3 text-sm">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--ink)]/60">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="mt-1 font-semibold text-[var(--ink)]">{value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Your Email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setError('')
                }}
                placeholder="you@example.com"
              />
              <Input
                label="Signature Name"
                value={signatureText}
                onChange={(event) => {
                  setSignatureText(event.target.value)
                  setError('')
                }}
                placeholder="Your full name"
              />
            </div>
          </Card>

          {mode === 'feedback' ? (
            <Card>
              <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--ink)]/80">
                <span className="mb-2 block">Feedback</span>
                <textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} className="min-h-24 w-full border border-[var(--ledger-line)] bg-[var(--paper)] p-3 outline-none" placeholder="Tell the owner what should change." />
              </label>
              {error ? <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
              <div className="mt-4 flex flex-wrap gap-3">
                <Button onClick={handleRequestChanges} disabled={submitting}>Submit Feedback</Button>
                <Button variant="secondary" onClick={() => setMode('review')}>Cancel</Button>
              </div>
            </Card>
          ) : null}

          {error && mode !== 'feedback' ? (
            <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleAccept} disabled={submitting || agreement?.status === 'confirmed'}>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Accept Agreement
            </Button>
            <Button variant="secondary" onClick={() => setMode('feedback')} disabled={submitting || agreement?.status === 'confirmed'}>
              <PenLine className="mr-2 h-4 w-4" /> Request Changes
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}

/**
 * frontend/src/pages/AgreementPreviewPage.jsx
 *
 * Shows the real AI-extracted agreement draft received from ProcessingScreen.
 * Passes the real shareToken/shareUrl to ShareAgreementPage.
 */

import { useLocation, useNavigate } from 'react-router-dom'
import { PencilLine, Share2 } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'

const fieldConfig = [
  { key: 'supplierName', label: 'Supplier / Other Party' },
  { key: 'product', label: 'Product / Service' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'price', label: 'Price' },
  { key: 'deliveryDate', label: 'Delivery Date' },
  { key: 'paymentTerms', label: 'Payment Terms' },
  { key: 'specialConditions', label: 'Special Conditions' },
]

export default function AgreementPreviewPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // `draft` is the object returned by ai.service.js → toFrontendDraft()
  const draft = location.state?.agreement || {}

  const handleConfirmAndShare = () => {
    navigate('/share-agreement', {
      state: {
        agreementId: draft.id,
        shareToken: draft.shareToken,
        // Build the full share URL using the frontend origin so the buyer
        // gets a link that opens the React app (not the backend)
        shareUrl: `${window.location.origin}/confirm/${draft.shareToken}`,
        draft,
      },
    })
  }

  const handleEdit = () => {
    navigate('/followup-questions', {
      state: {
        agreementId: draft.id,
        missingFields: draft.missingFields || [],
        draft,
      },
    })
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink)]/60">Agreement preview</p>
          <h1 className="font-['Source_Serif_4'] text-3xl sm:text-4xl">
            Your agreement is ready for review.
          </h1>
        </header>

        <main className="flex flex-1 items-center py-8">
          <Card tone="stamp" className="w-full border-t-4 border-t-[var(--seal)]">
            <div className="rounded-none border border-[var(--ledger-line)] bg-[var(--paper)] p-6">
              <div className="flex items-center justify-between gap-4 border-b border-[var(--ledger-line)] pb-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink)]/60">Draft agreement</p>
                  <h2 className="font-['Source_Serif_4'] text-2xl">
                    {draft.supplierName || draft.otherPartyName || 'Agreement Draft'}
                  </h2>
                </div>
                <span className="inline-flex border border-[var(--trust-green)]/20 bg-[var(--trust-green)]/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--trust-green)]">
                  Ready
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {fieldConfig.map((field) => {
                  const value = draft[field.key]
                  if (!value && value !== 0) return null
                  return (
                    <div key={field.key} className="border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-3 text-sm">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--ink)]/60">{field.label}</p>
                      <p className="mt-1 font-semibold text-[var(--ink)]">{String(value)}</p>
                    </div>
                  )
                })}
              </div>

              {/* Show missing fields warning if any */}
              {draft.missingFields?.length > 0 && (
                <div className="mt-4 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <p className="font-semibold">Some details are still missing:</p>
                  <ul className="mt-1 list-inside list-disc">
                    {draft.missingFields.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                </div>
              )}

              {/* Show the agreement text if available */}
              {draft.agreementText && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm uppercase tracking-[0.16em] text-[var(--ink)]/60">
                    View Full Agreement Text
                  </summary>
                  <pre className="mt-3 whitespace-pre-wrap rounded border border-[var(--ledger-line)] bg-[var(--paper)] p-4 text-xs leading-relaxed text-[var(--ink)]/80">
                    {draft.agreementText}
                  </pre>
                </details>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={handleEdit}>
                <PencilLine className="mr-2 h-4 w-4" /> Edit / Fill Missing
              </Button>
              <Button onClick={handleConfirmAndShare}>
                <Share2 className="mr-2 h-4 w-4" /> Confirm &amp; Share
              </Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

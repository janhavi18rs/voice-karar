/**
 * frontend/src/pages/AgreementPreviewPage.jsx
 *
 * Shows the real AI-extracted agreement draft received from ProcessingScreen.
 * Passes the real shareToken/shareUrl to ShareAgreementPage.
 */

import { useLocation, useNavigate } from 'react-router-dom'
import { PencilLine, Save, Share2, Sparkles, MapPin, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import { updateAgreement } from '../services/api'

// ─── Field definitions ────────────────────────────────────────────────────────
const fieldConfig = [
  { key: 'supplierName',     label: 'Supplier / Other Party',       type: 'text',   span: 2 },
  { key: 'product',          label: 'Product / Service',            type: 'text',   span: 2 },
  { key: 'quantity',         label: 'Quantity',                     type: 'number'           },
  { key: 'pricePerUnit',     label: 'Unit Price (₹)',               type: 'number'           },
  { key: 'totalAmount',      label: 'Total Amount (₹)',             type: 'number'           },
  { key: 'deliveryDate',     label: 'Delivery Date',                type: 'date'             },
  { key: 'paymentTerms',     label: 'Payment Terms',                type: 'text',   span: 2 },
  { key: 'deliveryLocation', label: 'Delivery Location',            type: 'text',   span: 2 },
  { key: 'specialConditions',label: 'Special Conditions',           type: 'text',   span: 2 },
]

// ─── Status badge config ──────────────────────────────────────────────────────
const STATUS_MAP = {
  pending:       { label: 'Draft Generated',  color: 'text-amber-700   bg-amber-50   border-amber-200'   },
  needs_changes: { label: 'Ready for Review', color: 'text-blue-700    bg-blue-50    border-blue-200'    },
  confirmed:     { label: 'Confirmed',        color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  cancelled:     { label: 'Cancelled',        color: 'text-red-700     bg-red-50     border-red-200'     },
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AgreementPreviewPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // `draft` is the object returned by ai.service.js → toFrontendDraft()
  const draft = location.state?.agreement || {}

  const [fields, setFields] = useState({
    supplierName:      draft.supplierName      || draft.otherPartyName || '',
    product:           draft.product           || '',
    quantity:          draft.quantity          ?? '',
    pricePerUnit:      draft.pricePerUnit      ?? draft.price ?? '',
    totalAmount:       draft.totalAmount       ?? '',
    deliveryDate:      draft.deliveryDate      || '',
    paymentTerms:      draft.paymentTerms      || '',
    deliveryLocation:  draft.deliveryLocation  || '',
    specialConditions: draft.specialConditions || '',
  })

  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  const updateField = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }))
    setSavedMessage('')
    setError('')
  }

  const buildAgreementUpdate = () => ({
    title: `${fields.product || 'Business agreement'} - ${fields.supplierName || 'Other party'}`.slice(0, 180),
    counterParty: {
      name: fields.supplierName,
      role: 'other',
    },
    agreedTerms: {
      product:          fields.product,
      quantity:         fields.quantity        === '' ? undefined : Number(fields.quantity),
      pricePerUnit:     fields.pricePerUnit    === '' ? undefined : Number(fields.pricePerUnit),
      totalAmount:      fields.totalAmount     === '' ? undefined : Number(fields.totalAmount),
      deliveryDate:     fields.deliveryDate    || undefined,
      paymentTerms:     fields.paymentTerms,
      deliveryLocation: fields.deliveryLocation,
      specialConditions:fields.specialConditions,
    },
  })

  const saveChanges = async () => {
    if (!draft.id) throw new Error('Agreement ID is missing. Please generate the agreement again.')
    setSaving(true)
    setError('')
    const updated = await updateAgreement(draft.id, buildAgreementUpdate())
    setSaving(false)
    setSavedMessage('Changes saved')
    return updated
  }

  const currentDraft = { ...draft, ...fields, otherPartyName: fields.supplierName }

  const handleConfirmAndShare = async () => {
    try {
      await saveChanges()
      navigate('/share-agreement', {
        state: {
          agreementId: currentDraft.id,
          shareToken:  currentDraft.shareToken,
          shareUrl:    `${window.location.origin}/confirm/${currentDraft.shareToken}`,
          draft:       currentDraft,
        },
      })
    } catch (err) {
      setSaving(false)
      setError(err.message || 'Failed to save agreement before sharing.')
    }
  }

  const handleEdit = () => {
    navigate('/followup-questions', {
      state: {
        agreementId:   currentDraft.id,
        missingFields: currentDraft.missingFields || [],
        draft:         currentDraft,
      },
    })
  }

  // Status badge
  const statusKey    = draft.status || 'pending'
  const statusConfig = STATUS_MAP[statusKey] || STATUS_MAP.pending

  // AI summary — only show if the AI actually generated one (not the "Not Specified" placeholder)
  const aiSummary = (draft.summary && draft.summary !== 'Not Specified') ? draft.summary : ''

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">

        {/* Page header */}
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink)]/60">Agreement preview</p>
          <h1 className="font-['Source_Serif_4'] text-3xl sm:text-4xl">
            Your agreement is ready for review.
          </h1>
        </header>

        <main className="flex flex-1 items-start py-8">
          <Card tone="stamp" className="w-full border-t-4 border-t-[var(--seal)]">

            {/* Card header row */}
            <div className="rounded-none border border-[var(--ledger-line)] bg-[var(--paper)] p-6">
              <div className="flex items-start justify-between gap-4 border-b border-[var(--ledger-line)] pb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink)]/60">Draft agreement</p>
                  <h2 className="font-['Source_Serif_4'] text-2xl mt-0.5">
                    {fields.supplierName || fields.product || 'Agreement Draft'}
                  </h2>
                </div>

                {/* Status badge */}
                <span className={`mt-1 inline-flex shrink-0 items-center border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>

              {/* AI Summary strip */}
              {aiSummary && (
                <div className="mt-4 flex gap-3 rounded border border-[var(--seal)]/20 bg-[var(--seal)]/5 px-4 py-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--seal)]" />
                  <p className="text-sm leading-relaxed text-[var(--ink)]/80 italic">
                    {aiSummary}
                  </p>
                </div>
              )}

              {/* Editable fields grid */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {fieldConfig.map((field) => {
                  const value = fields[field.key] ?? ''
                  const isMissing = !value && currentDraft.missingFields?.includes(field.key)
                  return (
                    <div
                      key={field.key}
                      className={field.span === 2 ? 'sm:col-span-2' : ''}
                    >
                      <Input
                        label={field.label}
                        value={value}
                        type={field.type || 'text'}
                        min={field.type === 'number' ? '0' : undefined}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        className={isMissing ? 'border-[var(--seal)]' : ''}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Delivery location quick-tip if empty */}
              {!fields.deliveryLocation && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-[var(--ink)]/40">
                  <MapPin className="h-3 w-3" />
                  <span>Delivery location was not detected — you can fill it in above.</span>
                </div>
              )}

              {/* Missing fields warning */}
              {currentDraft.missingFields?.length > 0 && (
                <div className="mt-4 flex gap-3 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="font-semibold">Some details are still missing:</p>
                    <ul className="mt-1 list-inside list-disc">
                      {currentDraft.missingFields.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  </div>
                </div>
              )}

              {/* Full agreement text (collapsible) */}
              {currentDraft.agreementText && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm uppercase tracking-[0.16em] text-[var(--ink)]/60 hover:text-[var(--ink)]/80">
                    View Full Agreement Text
                  </summary>
                  <pre className="mt-3 whitespace-pre-wrap rounded border border-[var(--ledger-line)] bg-[var(--paper)] p-4 text-xs leading-relaxed text-[var(--ink)]/80">
                    {currentDraft.agreementText}
                  </pre>
                </details>
              )}
            </div>

            {/* Inline messages */}
            {error && (
              <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            {savedMessage && (
              <p className="mt-4 text-sm font-semibold text-[var(--trust-green)]">{savedMessage}</p>
            )}

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => saveChanges().catch((err) => {
                  setSaving(false)
                  setError(err.message || 'Failed to save agreement changes.')
                })}
                disabled={saving}
              >
                <Save className="mr-2 h-4 w-4" /> {saving ? 'Saving…' : 'Save Changes'}
              </Button>
              <Button variant="secondary" onClick={handleEdit}>
                <PencilLine className="mr-2 h-4 w-4" /> Edit / Fill Missing
              </Button>
              <Button onClick={handleConfirmAndShare} disabled={saving}>
                <Share2 className="mr-2 h-4 w-4" /> Confirm &amp; Share
              </Button>
            </div>

          </Card>
        </main>
      </div>
    </div>
  )
}

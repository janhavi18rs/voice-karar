/**
 * frontend/src/pages/FollowUpQuestionsPage.jsx
 *
 * Dynamically shows only the fields that the AI marked as missing.
 * On submit, calls PATCH /api/v1/agreements/:id to fill in the missing fields,
 * then navigates to the Agreement Preview with the updated draft.
 */

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import { updateAgreementWithDraft } from '../services/api'

// Map missing field names (from AI) to user-friendly questions
const FIELD_QUESTIONS = {
  'Party 1': { label: 'What is your name or business name?', type: 'text', structuredDataKey: 'party_1' },
  'Party 2': { label: 'What is the other party\'s name or business name?', type: 'text', counterPartyKey: 'name', structuredDataKey: 'party_2' },
  'Agreement Purpose': { label: 'What is this agreement for? (product or service)', type: 'text', agreedTermsKey: 'product', structuredDataKey: 'agreement_purpose' },
  'Payment Amount': { label: 'What is the total payment amount? (e.g. ₹50,000)', type: 'text', agreedTermsKey: 'totalAmount', structuredDataKey: 'payment_amount' },
  'Payment Terms': { label: 'What are the payment terms? (e.g. 50% advance, 50% on delivery)', type: 'text', agreedTermsKey: 'paymentTerms', structuredDataKey: 'payment_terms' },
  'Agreement Duration': { label: 'What is the delivery/completion date?', type: 'date', agreedTermsKey: 'deliveryDate', structuredDataKey: 'agreement_duration' },
  'Important Dates': { label: 'Are there any important dates to note?', type: 'text', structuredDataKey: 'important_dates', asArray: true },
  'Witnesses': { label: 'Who are the witnesses for this agreement?', type: 'text', structuredDataKey: 'witnesses', asArray: true },
  'Special Conditions': { label: 'Any special conditions or notes?', type: 'text', agreedTermsKey: 'specialConditions', structuredDataKey: 'special_conditions', asArray: true },
  'Location': { label: 'Where is this agreement being made?', type: 'text', structuredDataKey: 'location' },
  'Responsibilities': { label: 'What are the responsibilities of each party?', type: 'text', structuredDataKey: 'responsibilities', asResponsibilities: true },
}

// Fallback questions when missing field name doesn't match our map
const DEFAULT_QUESTION = { label: 'Please provide this detail:', type: 'text', agreedTermsKey: null }

const FIELD_ALIASES = {
  party_1: 'Party 1',
  party1: 'Party 1',
  party_2: 'Party 2',
  party2: 'Party 2',
  supplierName: 'Party 2',
  otherPartyName: 'Party 2',
  agreement_purpose: 'Agreement Purpose',
  agreementPurpose: 'Agreement Purpose',
  product: 'Agreement Purpose',
  payment_amount: 'Payment Amount',
  paymentAmount: 'Payment Amount',
  price: 'Payment Amount',
  totalAmount: 'Payment Amount',
  payment_terms: 'Payment Terms',
  paymentTerms: 'Payment Terms',
  agreement_duration: 'Agreement Duration',
  agreementDuration: 'Agreement Duration',
  deliveryDate: 'Agreement Duration',
  important_dates: 'Important Dates',
  importantDates: 'Important Dates',
  witnesses: 'Witnesses',
  special_conditions: 'Special Conditions',
  specialConditions: 'Special Conditions',
  location: 'Location',
  responsibilities: 'Responsibilities',
}

const toNumber = (value) => {
  const match = String(value || '').replace(/,/g, '').match(/\d+(\.\d+)?/)
  return match ? Number(match[0]) : value
}

const uniqueMissingFields = (fields) => {
  const seen = new Set()
  return fields
    .map((field) => FIELD_ALIASES[field] || field)
    .filter((field) => {
      if (seen.has(field)) return false
      seen.add(field)
      return true
    })
}

export default function FollowUpQuestionsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { agreementId, missingFields = [], draft, source } = location.state || {}

  const [step, setStep] = useState(0)
  const [remainingFields, setRemainingFields] = useState(() => uniqueMissingFields(missingFields))
  const [answers, setAnswers] = useState({})
  const [currentDraft, setCurrentDraft] = useState(draft || {})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Build question list from missingFields
  const questions = useMemo(() => {
    // If there are no missing fields, show a default "confirm" screen
    if (remainingFields.length === 0) {
      return [{ id: 'confirm', label: 'Everything looks good! Click Next to continue.', type: 'info' }]
    }
    return remainingFields.map((fieldName) => ({
      id: fieldName,
      ...(FIELD_QUESTIONS[fieldName] || { ...DEFAULT_QUESTION, label: `What is the ${fieldName}?` }),
    }))
  }, [remainingFields])

  const current = questions[step]
  const progress = useMemo(() => ((step + 1) / questions.length) * 100, [step, questions.length])

  const handleChange = (event) => {
    setAnswers((prev) => ({ ...prev, [current.id]: event.target.value }))
    setError('')
  }

  const buildPatchForAnswer = (question, value) => {
    const updates = {}
    const draftPatch = {}

    if (question.agreedTermsKey) {
      const normalizedValue = question.agreedTermsKey === 'totalAmount' ? toNumber(value) : value
      updates.agreedTerms = { [question.agreedTermsKey]: normalizedValue }

      if (question.agreedTermsKey === 'totalAmount') {
        draftPatch.price = normalizedValue
      } else {
        draftPatch[question.agreedTermsKey] = normalizedValue
      }
    }

    if (question.counterPartyKey) {
      updates.counterParty = { [question.counterPartyKey]: value }
      draftPatch.supplierName = value
      draftPatch.otherPartyName = value
    }

    if (question.structuredDataKey) {
      updates.aiStructuredData = {
        [question.structuredDataKey]: question.asResponsibilities
          ? { party_1: [value], party_2: [] }
          : question.asArray ? [value] : value,
      }
    }

    return { updates, draftPatch }
  }

  const finish = (updatedDraft = currentDraft) => {
    navigate('/agreement-preview', {
      state: {
        agreement: {
          ...updatedDraft,
          missingFields: [],
        },
        source,
      },
    })
  }

  const handleNext = async () => {
    if (current.type === 'info') {
      finish()
      return
    }

    const answer = String(answers[current.id] || '').trim()
    if (!answer) {
      setError('Please answer this question before continuing.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const { updates, draftPatch } = buildPatchForAnswer(current, answer)
      let nextDraft = {
        ...currentDraft,
        ...draftPatch,
      }

      if (agreementId && Object.keys(updates).length > 0) {
        const updateResult = await updateAgreementWithDraft(agreementId, updates)
        const updatedAgreement = updateResult.agreement
        nextDraft = {
          ...(updateResult.draft || nextDraft),
          ...draftPatch,
          status: updatedAgreement.status || nextDraft.status,
        }
      }

      const nextRemainingFields = remainingFields.filter((field) => field !== current.id)
      nextDraft = {
        ...nextDraft,
        missingFields: nextRemainingFields,
      }

      setCurrentDraft(nextDraft)
      setRemainingFields(nextRemainingFields)

      if (nextRemainingFields.length === 0) {
        finish(nextDraft)
      } else if (step >= nextRemainingFields.length) {
        setStep(nextRemainingFields.length - 1)
      }
    } catch (err) {
      setError(err.message || 'Failed to update the agreement. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-[var(--ledger-line)] pb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink)]/75">Follow-up questions</p>
            <h1 className="font-['Source_Serif_4'] text-3xl sm:text-4xl">A few details to finish the draft</h1>
          </div>
          <div className="rounded-none border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-2 text-sm uppercase tracking-[0.16em] text-[var(--ink)]/80">
            Q {step + 1} of {questions.length}
          </div>
        </header>

        <main className="flex flex-1 items-center py-8">
          <Card tone="stamp" className="w-full border-t-4 border-t-[var(--seal)]">
            <div className="h-2 w-full bg-[var(--ledger-line)]">
              <div className="h-2 bg-[var(--trust-green)]" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-8 text-center">
              <h2 className="font-['Source_Serif_4'] text-3xl sm:text-4xl">{current.label}</h2>
              {current.type !== 'info' && (
                <div className="mx-auto mt-6 max-w-xl">
                  {current.type === 'date' ? (
                    <input
                      type="date"
                      value={answers[current.id] || ''}
                      onChange={handleChange}
                      className="w-full border border-[var(--ledger-line)] bg-[var(--paper)] px-4 py-4 text-base outline-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={answers[current.id] || ''}
                      onChange={handleChange}
                      className="w-full border border-[var(--ledger-line)] bg-[var(--paper)] px-4 py-4 text-base outline-none"
                      placeholder="Type your answer"
                    />
                  )}
                </div>
              )}
            </div>

            {error && (
              <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <div className="mt-8 flex flex-wrap justify-between gap-3">
              <Button
                variant="secondary"
                onClick={() => setStep((v) => Math.max(0, v - 1))}
                disabled={step === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={handleNext} disabled={loading}>
                {loading ? 'Saving...' : step === questions.length - 1 ? 'Generate Agreement' : 'Next'}
                {!loading && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

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
import { updateAgreement } from '../services/api'

// Map missing field names (from AI) to user-friendly questions
const FIELD_QUESTIONS = {
  'Party 1': { label: 'What is your name or business name?', type: 'text', agreedKey: null },
  'Party 2': { label: 'What is the other party\'s name or business name?', type: 'text', agreedKey: null },
  'Agreement Purpose': { label: 'What is this agreement for? (product or service)', type: 'text', agreedTermsKey: 'product' },
  'Payment Amount': { label: 'What is the total payment amount? (e.g. ₹50,000)', type: 'text', agreedTermsKey: 'totalAmount' },
  'Payment Terms': { label: 'What are the payment terms? (e.g. 50% advance, 50% on delivery)', type: 'text', agreedTermsKey: 'paymentTerms' },
  'Agreement Duration': { label: 'What is the delivery/completion date?', type: 'date', agreedTermsKey: 'deliveryDate' },
  'Important Dates': { label: 'Are there any important dates to note?', type: 'text', agreedTermsKey: null },
  'Witnesses': { label: 'Who are the witnesses for this agreement?', type: 'text', agreedTermsKey: null },
  'Special Conditions': { label: 'Any special conditions or notes?', type: 'text', agreedTermsKey: 'specialConditions' },
  'Location': { label: 'Where is this agreement being made?', type: 'text', agreedTermsKey: null },
  'Responsibilities': { label: 'What are the responsibilities of each party?', type: 'text', agreedTermsKey: null },
}

// Fallback questions when missing field name doesn't match our map
const DEFAULT_QUESTION = { label: 'Please provide this detail:', type: 'text', agreedTermsKey: null }

export default function FollowUpQuestionsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { agreementId, missingFields = [], draft, source } = location.state || {}

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Build question list from missingFields
  const questions = useMemo(() => {
    // If there are no missing fields, show a default "confirm" screen
    if (missingFields.length === 0) {
      return [{ id: 'confirm', label: 'Everything looks good! Click Next to continue.', type: 'info' }]
    }
    return missingFields.map((fieldName) => ({
      id: fieldName,
      ...(FIELD_QUESTIONS[fieldName] || { ...DEFAULT_QUESTION, label: `What is the ${fieldName}?` }),
    }))
  }, [missingFields])

  const current = questions[step]
  const progress = useMemo(() => ((step + 1) / questions.length) * 100, [step, questions.length])

  const handleChange = (event) => {
    setAnswers((prev) => ({ ...prev, [current.id]: event.target.value }))
    setError('')
  }

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep((v) => v + 1)
      return
    }

    // Last question — submit answers to the backend
    setLoading(true)
    setError('')
    try {
      // Build the agreedTerms update from the answers
      const agreedTermsUpdate = {}
      questions.forEach(({ id, agreedTermsKey }) => {
        const value = answers[id]
        if (value && agreedTermsKey) {
          agreedTermsUpdate[agreedTermsKey] = value
        }
      })

      let updatedDraft = draft

      // Only patch if we have an agreementId and there are term updates
      if (agreementId && Object.keys(agreedTermsUpdate).length > 0) {
        const updatedAgreement = await updateAgreement(agreementId, { agreedTerms: agreedTermsUpdate })
        // Merge the updated fields into the draft for the preview
        updatedDraft = {
          ...draft,
          ...agreedTermsUpdate,
          // Map agreedTermsKey updates back to draft field names
          paymentTerms: agreedTermsUpdate.paymentTerms || draft?.paymentTerms,
          deliveryDate: agreedTermsUpdate.deliveryDate || draft?.deliveryDate,
          specialConditions: agreedTermsUpdate.specialConditions || draft?.specialConditions,
          missingFields: [],
        }
      }

      navigate('/agreement-preview', {
        state: { agreement: updatedDraft, source },
      })
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
                {loading ? 'Saving…' : step === questions.length - 1 ? 'Generate Agreement' : 'Next'}
                {!loading && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

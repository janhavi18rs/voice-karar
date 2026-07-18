import { useMemo, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import { submitFollowUpAnswers } from '../services/api'

const questions = [
  { id: 'deliveryDate', label: 'What is the delivery date?', type: 'date' },
  { id: 'paymentTerms', label: 'How will payment be made?', type: 'text' },
  { id: 'specialConditions', label: 'Any special conditions?', type: 'text' }
]

export default function FollowUpQuestionsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})

  const current = questions[step]
  const progress = useMemo(() => ((step + 1) / questions.length) * 100, [step])

  const handleChange = (event) => {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: event.target.value }))
  }

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep((value) => value + 1)
      return
    }

    await submitFollowUpAnswers(answers)
    navigate('/agreement-preview', { state: { from: location.state?.source || 'manual', answers } })
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
              <div className="mx-auto mt-6 max-w-xl">
                {current.type === 'date' ? (
                  <input type="date" value={answers[current.id] || ''} onChange={handleChange} className="w-full border border-[var(--ledger-line)] bg-[var(--paper)] px-4 py-4 text-base outline-none" />
                ) : (
                  <input type="text" value={answers[current.id] || ''} onChange={handleChange} className="w-full border border-[var(--ledger-line)] bg-[var(--paper)] px-4 py-4 text-base outline-none" placeholder="Type your answer" />
                )}
              </div>
            </div>
            <div className="mt-8 flex flex-wrap justify-between gap-3">
              <Button variant="secondary" onClick={() => setStep((value) => Math.max(0, value - 1))}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={handleNext}>
                {step === questions.length - 1 ? 'Generate Agreement' : 'Next'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

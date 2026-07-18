import { useEffect, useState } from 'react'
import { CheckCircle2, Clock3 } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Navbar from '../components/Navbar'
import { uploadCallRecording } from '../services/api'

const baseSteps = [
  { label: 'Speech to Text', key: 'speech' },
  { label: 'AI Analysis', key: 'analysis' },
  { label: 'Extracting Agreement', key: 'extract' },
  { label: 'Preparing Draft', key: 'draft' }
]

export default function ProcessingScreen() {
  const loc = useLocation()
  const navigate = useNavigate()
  const { audio, source, text } = loc.state || {}
  const [progress, setProgress] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])

  useEffect(() => {
    if (!audio && source !== 'manual') {
      navigate('/create-agreement')
      return
    }

    let mounted = true

    const runSteps = async () => {
      if (source === 'upload') {
        const res = await uploadCallRecording(audio)
        const total = res.estimatedProcessingSeconds || 8
        let elapsed = 0
        const interval = setInterval(() => {
          elapsed += 1
          const nextProgress = Math.min(100, Math.round((elapsed / total) * 100))
          setProgress(nextProgress)
          if (elapsed >= total) {
            clearInterval(interval)
            if (mounted) navigate('/transcript-review', { state: { transcriptId: res.transcriptId, audio, source } })
          }
        }, 1000)
        return () => clearInterval(interval)
      }

      if (source === 'manual') {
        const manualSteps = baseSteps.filter((step) => step.key !== 'speech')
        for (let index = 0; index < manualSteps.length; index += 1) {
          if (!mounted) return
          setCompletedSteps(manualSteps.slice(0, index + 1).map((step) => step.key))
          await new Promise((resolve) => setTimeout(resolve, 700))
        }
        if (mounted) navigate('/followup-questions', { state: { source, text } })
        return
      }

      for (let index = 0; index < baseSteps.length; index += 1) {
        if (!mounted) return
        setCompletedSteps(baseSteps.slice(0, index + 1).map((step) => step.key))
        await new Promise((resolve) => setTimeout(resolve, 700))
      }
      if (mounted) navigate('/transcript-review', { state: { transcriptId: `tx-${Date.now()}`, audio, source } })
    }

    runSteps()

    return () => { mounted = false }
  }, [audio, navigate, source, text])

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <Navbar />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          <Card tone="stamp" className="border-t-4 border-t-[var(--seal)]">
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--ink)]/80">
              <Clock3 className="h-4 w-4 text-[var(--seal)]" />
              Preparing your agreement
            </div>
            <div className="mt-6 space-y-3">
              {(source === 'manual' ? baseSteps.filter((step) => step.key !== 'speech') : baseSteps).map((step) => {
                const done = completedSteps.includes(step.key)
                return (
                  <div key={step.key} className={`flex items-center justify-between border border-[var(--ledger-line)] bg-[var(--paper)] px-4 py-3 ${done ? 'text-[var(--trust-green)]' : 'text-[var(--ink)]/70'}`}>
                    <span>{step.label}</span>
                    {done ? <CheckCircle2 className="h-5 w-5" /> : <Clock3 className="h-5 w-5" />}
                  </div>
                )
              })}
            </div>
            {source === 'upload' ? (
              <div className="mt-6">
                <div className="h-2 w-full bg-[var(--ledger-line)]">
                  <div className="h-2 bg-[var(--trust-green)]" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-sm text-[var(--ink)]/70">Uploading and processing audio • {progress}%</p>
              </div>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  )
}

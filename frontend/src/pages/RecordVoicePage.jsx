import { useEffect, useRef, useState } from 'react'
import { Mic, Square, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Navbar from '../components/Navbar'

const formatTime = (seconds) => {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  return `${mins}:${secs}`
}

export default function RecordVoicePage() {
  const navigate = useNavigate()
  const [isRecording, setIsRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [waveform, setWaveform] = useState(Array.from({ length: 24 }, () => 24))
  const [errorMsg, setErrorMsg] = useState('')
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const analyserRef = useRef(null)
  const animationRef = useRef(null)
  const streamRef = useRef(null)
  const audioContextRef = useRef(null)
  const recognitionRef = useRef(null)
  const transcriptRef = useRef('')

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
      if (audioContextRef.current) audioContextRef.current.close()
      if (window.__voiceTimer) clearInterval(window.__voiceTimer)
    }
  }, [])

  const startVisualization = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    streamRef.current = stream
    const context = new (window.AudioContext || window.webkitAudioContext)()
    const source = context.createMediaStreamSource(stream)
    const analyser = context.createAnalyser()
    analyser.fftSize = 128
    source.connect(analyser)
    analyserRef.current = analyser
    audioContextRef.current = context

    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    const tick = () => {
      analyser.getByteFrequencyData(dataArray)
      const next = Array.from({ length: 24 }, (_, index) => {
        const sample = dataArray[index * 2] || 0
        return Math.max(16, (sample / 255) * 70)
      })
      setWaveform(next)
      animationRef.current = requestAnimationFrame(tick)
    }
    tick()
  }

  const handleStart = async () => {
    setErrorMsg('')
    setIsRecording(true)
    setElapsed(0)
    try {
      await startVisualization()
    } catch (err) {
      console.error('Failed to access microphone:', err)
      setIsRecording(false)
      setErrorMsg(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Microphone access denied. Please check your browser permissions.'
          : 'Could not access microphone. Please make sure a microphone is connected.'
      )
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'
        transcriptRef.current = ''
        recognition.onresult = (event) => {
          let text = ''
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript + ' '
          }
          transcriptRef.current = text.trim()
        }
        recognition.start()
        recognitionRef.current = recognition
      } catch (e) {
        console.warn('SpeechRecognition error:', e)
      }
    }

    const chunks = []
    audioChunksRef.current = chunks
    const recorder = new MediaRecorder(streamRef.current)
    mediaRecorderRef.current = recorder
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data)
    }
    recorder.start()

    const interval = setInterval(() => {
      setElapsed((value) => value + 1)
    }, 1000)
    window.__voiceTimer = interval
  }

  const handleStop = () => {
    if (!mediaRecorderRef.current) return

    mediaRecorderRef.current.onstop = () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (audioContextRef.current) audioContextRef.current.close()
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
      if (recognitionRef.current) {
        try { recognitionRef.current.stop() } catch {}
      }
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
      navigate('/processing', {
        state: {
          audio: blob,
          text: transcriptRef.current || undefined,
          source: 'live',
        },
      })
    }

    mediaRecorderRef.current.stop()
    clearInterval(window.__voiceTimer)
    setIsRecording(false)
  }

  return (
    <div className="min-h-screen bg-[#fffaf7] text-[var(--ink)]">
      <Navbar />
      <div className="mx-auto flex min-h-[calc(100vh-104px)] max-w-6xl flex-col px-6 py-8">
        <header className="space-y-2">
          <p className="text-[14px] uppercase tracking-[0.32em] text-[var(--ink)]/75">Record voice summary</p>
          <h1 className="font-['Source_Serif_4'] text-4xl font-extrabold leading-tight sm:text-5xl">Speak naturally and let the record form itself.</h1>
          <p className="text-base leading-7 text-[var(--ink)]/80">The mic button stays central, and the waveform reacts to your voice in real time.</p>
        </header>

        <main className="flex flex-1 items-center justify-center py-5">
          <Card tone="stamp" className="w-full max-w-4xl border-t-4 border-t-[var(--seal)]">
            <div className="flex min-h-[450px] flex-col items-center justify-center gap-6 text-center">
              {errorMsg && (
                <div className="w-full rounded-none border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {errorMsg}
                </div>
              )}

              <div className={`flex h-28 w-28 items-center justify-center rounded-full border-2 border-[var(--seal)] ${isRecording ? 'bg-[var(--seal)] text-[var(--paper)]' : 'bg-[var(--paper)] text-[var(--seal)]'}`}>
                <Mic className="h-11 w-11" />
              </div>

              <div className="flex h-20 items-end gap-2">
                {waveform.map((height, index) => (
                  <div key={index} className="w-2 rounded-full bg-[var(--seal)]/70" style={{ height: `${height}px` }} />
                ))}
              </div>

              <p className="text-5xl font-bold tabular-nums text-[var(--ink)]">{formatTime(elapsed)}</p>

              <div className="flex flex-wrap justify-center gap-3">
                {!isRecording ? (
                  <Button onClick={handleStart}>Start Recording</Button>
                ) : (
                  <Button onClick={handleStop} className="bg-[var(--seal)]">Stop Recording</Button>
                )}
                <Button variant="secondary" onClick={() => navigate('/create-agreement')}>
                  <XCircle className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

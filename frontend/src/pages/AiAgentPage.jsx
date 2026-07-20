import { useState } from 'react'
import Navbar from '../components/Navbar'

export default function AiAgentPage() {
  const [agentUrl] = useState(
    import.meta.env.VITE_AI_AGENT_URL || 'https://voice-karar-ai-agent.onrender.com'
  )

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#2b2927]">
      <Navbar />
      <main className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between border-b border-[#e5e1d8] pb-3">
          <div>
            <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#2b2927] sm:text-3xl">
              Voice Karar AI Agent
            </h1>
            <p className="text-sm text-[#6e6a64]">
              Multilingual Voice & Audio Legal Agreement Processing Pipeline
            </p>
          </div>
          <a
            href={agentUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-[#943d2c] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#943d2c] hover:bg-[#943d2c] hover:text-white transition"
          >
            Open Standalone Window ↗
          </a>
        </div>

        <div className="h-[calc(100vh-170px)] w-full overflow-hidden rounded-xl border border-[#e5e1d8] bg-white shadow-md">
          <iframe
            src={agentUrl}
            title="Voice Karar AI Agent"
            className="h-full w-full border-none"
            allow="microphone *"
          />
        </div>
      </main>
    </div>
  )
}

import { useState } from 'react'
import { Copy, Share2, Stamp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'

export default function ShareAgreementPage() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const shareLink = 'https://voicekarar.in/confirm/agr-104'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink)]/75">Agreement shared</p>
          <h1 className="font-['Source_Serif_4'] text-3xl sm:text-4xl">Agreement generated successfully.</h1>
        </header>

        <main className="flex flex-1 items-center py-8">
          <Card tone="stamp" className="w-full border-t-4 border-t-[var(--seal)]">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[var(--seal)] bg-[var(--seal)]/10 text-[var(--seal)]">
                <Stamp className="h-10 w-10" />
              </div>
              <p className="max-w-xl text-lg text-[var(--ink)]/80">The other party does not need to install anything. They can open the link in any browser.</p>
              <div className="w-full rounded-none border border-[var(--ledger-line)] bg-[var(--paper)] p-4 text-left">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink)]/60">Share link</p>
                <p className="mt-2 font-mono text-sm tabular-nums">{shareLink}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={handleCopy}>
                  <Copy className="mr-2 h-4 w-4" /> {copied ? 'Copied' : 'Copy Link'}
                </Button>
                <Button variant="secondary" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Please review this agreement: ${shareLink}`)}`)}>
                  <Share2 className="mr-2 h-4 w-4" /> Share via WhatsApp
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

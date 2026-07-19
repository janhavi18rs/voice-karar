import { useState } from 'react'
import { Copy, MessageSquare, Send, Smartphone } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import MobileBottomNav from '../components/MobileBottomNav'
import Navbar from '../components/Navbar'

export default function SharePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const agreement = location.state?.agreement
  const [copied, setCopied] = useState(false)
  const shareToken = agreement?.shareToken
  const link = shareToken ? `${window.location.origin}/confirm/${shareToken}` : ''

  const handleCopy = async () => {
    if (!link) return
    await navigator.clipboard.writeText(link)
    setCopied(true)
  }

  const handleWhatsAppShare = () => {
    if (!link) return
    window.open(`https://wa.me/?text=${encodeURIComponent(`Please review this agreement: ${link}`)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <Navbar />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <header className="space-y-2">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink)]/60">Share agreement</p>
            <h1 className="font-['Source_Serif_4'] text-3xl sm:text-4xl">Send the link to the other party</h1>
          </header>

          <Card tone="stamp" className="border-t-4 border-t-[var(--seal)]">
            <div className="space-y-5">
              <div className="rounded-none border border-[var(--ledger-line)] bg-[var(--paper)] p-4 text-sm text-[var(--ink)]/70">
                <p className="mb-2 text-[11px] uppercase tracking-[0.2em]">Secure link</p>
                <p className="break-all font-semibold text-[var(--ink)]">{link || 'Share token unavailable'}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={handleCopy} disabled={!link}>
                  <Copy className="mr-2 h-4 w-4" /> {copied ? 'Copied' : 'Copy link'}
                </Button>
                <Button variant="secondary" onClick={handleWhatsAppShare} disabled={!link}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Share on WhatsApp
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary">
                  <Send className="mr-2 h-4 w-4" /> SMS
                </Button>
                <Button variant="secondary">
                  <Smartphone className="mr-2 h-4 w-4" /> Email
                </Button>
              </div>
            </div>
          </Card>

          <Button variant="secondary" onClick={() => link && navigate(`/confirm/${shareToken}`)} disabled={!link}>
          Preview public confirmation page
        </Button>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  )
}

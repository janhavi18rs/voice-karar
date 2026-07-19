import { useState } from 'react'
import { Copy, Eye, Share2, Stamp } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'

export default function ShareAgreementPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState('')
  const { agreementId, shareToken, shareUrl, draft } = location.state || {}
  const token = shareToken || draft?.shareToken
  const shareLink = shareUrl || (token ? `${window.location.origin}/confirm/${token}` : '')
  const partyName = draft?.supplierName || draft?.otherPartyName || 'the other party'

  const handleCopy = async () => {
    if (!shareLink) return

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareLink)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = shareLink
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      setCopyError('')
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopyError('Unable to copy automatically. Select and copy the link manually.')
    }
  }

  const handleWhatsAppShare = () => {
    if (!shareLink) return
    const message = `Please review this Voice Karar agreement: ${shareLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  const handlePreview = () => {
    if (token) navigate(`/confirm/${token}`)
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
              {shareLink ? (
                <>
                  <p className="max-w-xl text-lg text-[var(--ink)]/80">
                    Send this link to {partyName}. They can review and confirm the agreement in any browser.
                  </p>
                  <div className="w-full rounded-none border border-[var(--ledger-line)] bg-[var(--paper)] p-4 text-left">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink)]/60">Share link</p>
                    <p className="mt-2 break-all font-mono text-sm tabular-nums">{shareLink}</p>
                    {agreementId ? (
                      <p className="mt-2 text-xs text-[var(--ink)]/50">Agreement ID: {agreementId}</p>
                    ) : null}
                  </div>
                  {copyError ? (
                    <p className="text-sm text-[var(--seal)]">{copyError}</p>
                  ) : null}
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button onClick={handleCopy}>
                      <Copy className="mr-2 h-4 w-4" /> {copied ? 'Copied' : 'Copy Link'}
                    </Button>
                    <Button variant="secondary" onClick={handleWhatsAppShare}>
                      <Share2 className="mr-2 h-4 w-4" /> Share via WhatsApp
                    </Button>
                    <Button variant="secondary" onClick={handlePreview}>
                      <Eye className="mr-2 h-4 w-4" /> Preview Link
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="max-w-xl text-lg text-[var(--ink)]/80">
                    No share token was found for this agreement. Return to the dashboard and open the agreement again.
                  </p>
                  <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
                </>
              )}
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Copy, Download, FileText } from 'lucide-react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'
import MobileBottomNav from '../components/MobileBottomNav'
import Navbar from '../components/Navbar'
import StatusBadge from '../components/StatusBadge'
import Timeline from '../components/Timeline'
import { getAgreementById } from '../services/api'

export default function AgreementDetailPage() {
  const { id } = useParams()
  const [agreement, setAgreement] = useState(null)

  useEffect(() => {
    const load = async () => {
      const data = await getAgreementById(id)
      setAgreement(data)
    }
    load()
  }, [id])

  if (!agreement) return null

  const timeline = [
    { label: agreement.source === 'upload' ? 'Uploaded' : agreement.source === 'manual' ? 'Typed' : 'Recorded', time: agreement.createdAt },
    { label: 'Transcribed', time: agreement.transcriptId ? 'Processed' : 'Pending' },
    { label: 'Reviewed', time: 'Completed' },
    { label: 'Extracted', time: 'Ready' },
    { label: 'Sent', time: agreement.agreementLink ? 'Shared' : 'Pending' },
    { label: agreement.status === 'confirmed' ? 'Confirmed' : agreement.status === 'rejected' ? 'Rejected' : 'Needs response', time: 'Today' }
  ]

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <Navbar />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink)]/75">Agreement detail</p>
              <h1 className="font-['Source_Serif_4'] text-3xl sm:text-4xl">{agreement.product}</h1>
            </div>
            <StatusBadge status={agreement.status} />
          </header>

          <Card tone="stamp" className="border-t-4 border-t-[var(--seal)]">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['Supplier', agreement.otherPartyName],
                ['Quantity', agreement.quantity],
                ['Price', `₹${agreement.price?.toLocaleString?.() || agreement.price}`],
                ['Delivery date', agreement.deliveryDate],
                ['Payment terms', agreement.paymentTerms],
                ['Special conditions', agreement.specialConditions]
              ].map(([label, value]) => (
                <div key={label} className="border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-3 text-sm">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--ink)]/60">{label}</p>
                  <p className="mt-1 font-semibold text-[var(--ink)]">{value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-2 text-sm uppercase tracking-[0.16em]"><Download className="h-4 w-4" /> Download PDF</button>
              <button className="inline-flex items-center gap-2 border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-2 text-sm uppercase tracking-[0.16em]"><Copy className="h-4 w-4" /> Copy Link</button>
            </div>
            <h2 className="mt-6 font-['Source_Serif_4'] text-2xl">Status history</h2>
            <div className="mt-4">
              <Timeline items={timeline} />
            </div>
            {agreement.transcriptId ? (
              <div className="mt-4">
                <a href="#" onClick={(event) => { event.preventDefault(); window.location.href = `/transcript-review?from=detail&tx=${agreement.transcriptId}` }} className="inline-flex items-center gap-2 text-sm text-[var(--seal)] underline">
                  <FileText className="h-4 w-4" /> View original transcript
                </a>
              </div>
            ) : null}
          </Card>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  )
}

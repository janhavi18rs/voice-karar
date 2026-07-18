import { useLocation, useNavigate } from 'react-router-dom'
import { PencilLine, Share2 } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'

const fields = [
  { key: 'supplierName', label: 'Supplier Name' },
  { key: 'product', label: 'Product' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'price', label: 'Price' },
  { key: 'deliveryDate', label: 'Delivery Date' },
  { key: 'paymentTerms', label: 'Payment Terms' },
  { key: 'specialConditions', label: 'Special Conditions' }
]

export default function AgreementPreviewPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const draft = location.state?.agreement || {
    supplierName: 'Ramesh Textiles',
    product: 'Cotton shirts',
    quantity: 500,
    price: '₹120 each',
    deliveryDate: '25 July',
    paymentTerms: '50% advance',
    specialConditions: 'Packed in branded cartons'
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink)]/60">Agreement preview</p>
          <h1 className="font-['Source_Serif_4'] text-3xl sm:text-4xl">Your agreement is ready for review.</h1>
        </header>

        <main className="flex flex-1 items-center py-8">
          <Card tone="stamp" className="w-full border-t-4 border-t-[var(--seal)]">
            <div className="rounded-none border border-[var(--ledger-line)] bg-[var(--paper)] p-6">
              <div className="flex items-center justify-between gap-4 border-b border-[var(--ledger-line)] pb-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink)]/60">Draft agreement</p>
                  <h2 className="font-['Source_Serif_4'] text-2xl">{draft.supplierName}</h2>
                </div>
                <span className="inline-flex border border-[var(--trust-green)]/20 bg-[var(--trust-green)]/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--trust-green)]">Ready</span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {fields.map((field) => (
                  <div key={field.key} className="border border-[var(--ledger-line)] bg-[var(--paper)] px-3 py-3 text-sm">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--ink)]/60">{field.label}</p>
                    <p className="mt-1 font-semibold text-[var(--ink)]">{draft[field.key]}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => navigate('/followup-questions')}>
                <PencilLine className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button onClick={() => navigate('/share-agreement')}>
                <Share2 className="mr-2 h-4 w-4" /> Confirm & Continue
              </Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

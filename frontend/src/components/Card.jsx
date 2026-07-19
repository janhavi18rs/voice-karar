export default function Card({ children, className = '', tone = 'default', ...props }) {
  const styles = {
    default: 'border border-[var(--ledger-line)] bg-white shadow-sm',
    muted: 'border border-[var(--ledger-line)] bg-[var(--soft-panel)] shadow-sm',
    stamp: 'border border-[var(--ledger-line)] bg-white shadow-[0_18px_44px_rgba(75,50,40,0.10)]'
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${styles[tone]} ${className}`} {...props}>
      <div className="absolute inset-x-0 top-0 h-1 bg-[var(--seal)]/90" />
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  )
}

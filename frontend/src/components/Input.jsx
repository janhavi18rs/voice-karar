export default function Input({ label, value, onChange, placeholder, className = '', type = 'text', name, ...props }) {
  return (
    <label className="block text-sm font-bold uppercase tracking-[0.22em] text-[var(--ink)]/85">
      <span className="mb-2 block">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-md border border-[var(--ledger-line)] bg-white px-4 py-4 text-base font-semibold tracking-[0.08em] text-[var(--ink)] outline-none transition focus:border-[var(--seal)] focus:bg-[#f3e1d2]/35 ${className}`}
        {...props}
      />
    </label>
  )
}

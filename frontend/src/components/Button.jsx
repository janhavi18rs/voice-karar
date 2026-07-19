const variants = {
  primary: 'border border-[var(--seal)] bg-[var(--seal)] text-white hover:bg-[#7f2c20]',
  secondary: 'bg-white text-[var(--seal)] border border-[#c78d7e] hover:bg-[#fff4ef]',
  ghost: 'bg-transparent text-[var(--ink)]'
}

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center rounded-md px-5 py-3 text-sm font-bold tracking-[0.14em] uppercase transition-all disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

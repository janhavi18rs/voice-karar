import { useState, useEffect, useRef } from 'react'
import {
  ArrowRight,
  BookOpen,
  FileSignature,
  Globe2,
  Mic,
  PenLine,
  ShieldCheck,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Check,
  FileText,
  Volume2,
  Languages,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const steps = [
  {
    title: 'Talk Business',
    text: 'Have your discussion naturally in Hindi, English, or your local language. No formal scripting required.',
    icon: BookOpen,
  },
  {
    title: 'Record & Sync',
    text: 'Voice Karar captures the key terms of your deal, names, amount, dates, and clauses from the audio.',
    icon: Mic,
  },
  {
    title: 'Digital Confirm',
    text: 'Both parties receive a link to review and provide digital acceptance or request corrections instantly.',
    icon: FileSignature,
  },
]

const trustCards = [
  {
    title: 'No Paperwork mid-deal',
    text: 'Convert verbal commitments to agreements right when business momentum is highest.',
    icon: Sparkles,
  },
  {
    title: 'Language Agnostic',
    text: 'Supports local language business context with clean English legal drafting output.',
    icon: Globe2,
  },
  {
    title: 'Definitive Proof',
    text: 'Each agreement keeps a share link, status, confirmation note, and timestamp trail.',
    icon: PenLine,
    wide: true,
  },
]

export default function WelcomePage() {
  const navigate = useNavigate()

  // Live Demo Simulator State
  const [demoState, setDemoState] = useState('idle') // 'idle' | 'playing' | 'extracting' | 'draft' | 'confirmed'
  const [typewrittenText, setTypewrittenText] = useState('')
  const [activeExtractedIndex, setActiveExtractedIndex] = useState(-1)
  const timerRef = useRef(null)

  const fullSpeechHindi = 'Asha ji, 500 cotton bags bhejna hai, ₹120 per bag. Delivery agle mangalwar tak chahiye, aur payment delivery par cash hoga.'

  const extractedFields = [
    { label: 'Seller Party', value: 'Mehta Textiles (Asha Ji)' },
    { label: 'Product Name', value: 'Cotton Bags' },
    { label: 'Quantity Ordered', value: '500 units' },
    { label: 'Unit Price', value: '₹120 / unit' },
    { label: 'Delivery Deadline', value: 'Next Tuesday' },
    { label: 'Payment Terms', value: 'Cash on Delivery (COD)' },
  ]

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Start the interactive simulation
  const startDemo = () => {
    // Reset state
    setDemoState('playing')
    setTypewrittenText('')
    setActiveExtractedIndex(-1)
    if (timerRef.current) clearInterval(timerRef.current)

    let charIndex = 0
    // Typewrite the speech transcript
    timerRef.current = setInterval(() => {
      if (charIndex < fullSpeechHindi.length) {
        setTypewrittenText(fullSpeechHindi.substring(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(timerRef.current)
        // Transition to extraction after a small pause
        setTimeout(() => {
          setDemoState('extracting')
          simulateExtraction()
        }, 1000)
      }
    }, 35)
  }

  // Simulate AI extraction one by one
  const simulateExtraction = () => {
    let currentFieldIndex = 0
    timerRef.current = setInterval(() => {
      if (currentFieldIndex < extractedFields.length) {
        setActiveExtractedIndex(currentFieldIndex)
        currentFieldIndex++
      } else {
        clearInterval(timerRef.current)
        // Transition to draft ready state
        setTimeout(() => {
          setDemoState('draft')
        }, 1200)
      }
    }, 700)
  }

  const handleConfirmDemo = () => {
    setDemoState('confirmed')
  }

  const resetDemo = () => {
    setDemoState('idle')
    setTypewrittenText('')
    setActiveExtractedIndex(-1)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  return (
    <div className="min-h-screen bg-[#fffaf7] text-[#352b27] overflow-x-hidden selection:bg-[#92372c]/10 relative">
      {/* Visual background decorations */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#ffd8d1]/30 to-transparent rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-[#cae8dd]/20 to-transparent rounded-full filter blur-3xl pointer-events-none" />

      {/* Sticky Header with Modern Styling */}
      <header className="sticky top-0 z-40 border-b border-[#eadbd4] bg-[#fffaf7]/80 backdrop-blur-md px-6 py-4 transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate('/')}
              className="font-['Source_Serif_4'] text-2xl sm:text-3xl font-extrabold tracking-tight text-[#92372c] flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <ShieldCheck className="h-7 w-7 text-[#92372c]" />
              Voice Karar
            </button>
            <nav className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-[#746a65]">
              <a href="#how" className="hover:text-[#92372c] transition-colors relative after:absolute after:bottom-[-22px] after:left-0 after:w-0 after:h-0.5 after:bg-[#92372c] hover:after:w-full after:transition-all">How it works</a>
              <a href="#why" className="hover:text-[#92372c] transition-colors relative after:absolute after:bottom-[-22px] after:left-0 after:w-0 after:h-0.5 after:bg-[#92372c] hover:after:w-full after:transition-all">Why Voice Karar</a>
              <a href="#pricing" className="hover:text-[#92372c] transition-colors relative after:absolute after:bottom-[-22px] after:left-0 after:w-0 after:h-0.5 after:bg-[#92372c] hover:after:w-full after:transition-all">Pricing</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 text-[14px] font-bold text-[#6b4c44] hover:text-[#92372c] transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="rounded-full bg-[#92372c] hover:bg-[#a64034] text-white px-6 py-2.5 text-[14px] font-bold shadow-md shadow-[#92372c]/20 hover:shadow-lg hover:shadow-[#92372c]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 pb-24 pt-20 md:pt-28">
          <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
            {/* Left Hero Column */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#efcfc4]/80 bg-white/70 backdrop-blur-sm px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-[#9b493d] shadow-sm">
                <Sparkles className="h-4 w-4 text-[#bc6f62]" />
                Trusted Agreements, Spoken Simply
              </div>
              <h1 className="font-['Source_Serif_4'] text-5xl sm:text-6xl font-extrabold leading-[1.1] text-[#171513] tracking-tight">
                Turn a spoken <span className="relative inline-block italic text-[#92372c] after:absolute after:bottom-2 after:left-0 after:w-full after:h-2 after:bg-[#ffd8d1]/40 after:-z-10">agreement</span> into a signed one.
              </h1>
              <p className="text-[18px] sm:text-[20px] leading-relaxed text-[#736862] max-w-[620px]">
                Voice Karar helps Indian MSME owners capture every business deal in plain language. Our AI converts your natural conversation into a formal digital contract ready for instant buyer confirmation.
              </p>

              <div className="flex flex-wrap gap-5 pt-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="inline-flex items-center gap-3 rounded-full bg-[#92372c] hover:bg-[#a64034] px-8 py-4.5 text-[15px] font-bold text-white shadow-lg shadow-[#92372c]/20 hover:shadow-xl hover:shadow-[#92372c]/35 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
                >
                  Start Recording Free
                  <ArrowRight className="h-5 w-5" />
                </button>
                <a
                  href="#demo-widget"
                  className="inline-flex items-center justify-center rounded-full border border-[#d2b7ad] bg-white hover:bg-[#fff6f2] px-8 py-4.5 text-[15px] font-bold text-[#4c403b] hover:border-[#92372c] hover:text-[#92372c] transition-all duration-200"
                >
                  Try Live Demo
                </a>
              </div>

              {/* Stats / Proof Points */}
              <div className="flex items-center gap-8 pt-6 border-t border-[#eadbd4]/60">
                {[['5,000+', 'Businesses'], ['10×', 'Faster Deals'], ['0', 'Paperwork']].map(([val, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-extrabold text-[#92372c] leading-none">{val}</p>
                    <p className="text-[11px] text-[#8c7e77] mt-1.5 font-semibold uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Hero Column: Interactive Voice-to-Agreement Simulator */}
            <div id="demo-widget" className="relative group transition-all duration-300">
              {/* Decorative Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#92372c] to-[#cae8dd] rounded-[32px] blur-xl opacity-30 group-hover:opacity-40 transition duration-1000" />

              <div className="relative rounded-[30px] border border-[#dfc6bb] bg-white p-8 sm:p-10 shadow-2xl transition-all duration-300 flex flex-col min-h-[480px]">
                {/* Visual Card Header */}
                <div className="flex items-center justify-between border-b border-[#f4eae5] pb-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 rounded-full bg-[#bc6f62] animate-pulse" />
                    <span className="text-[12px] font-bold uppercase tracking-wider text-[#9b493d] bg-[#ffd8d1]/40 px-3 py-1 rounded-full">
                      Interactive Simulator
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  </div>
                </div>

                {/* State 1: Idle Vibe */}
                {demoState === 'idle' && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-6">
                    <div className="w-20 h-20 rounded-full bg-[#fff3ed] border border-[#f4eae5] flex items-center justify-center text-[#92372c] shadow-inner relative group-hover:scale-105 transition-transform duration-300">
                      <Mic className="h-10 w-10 text-[#92372c]" />
                      <div className="absolute inset-0 rounded-full border-2 border-[#92372c]/10 animate-ping pointer-events-none" />
                    </div>
                    <div className="space-y-2 max-w-[320px]">
                      <h3 className="font-['Source_Serif_4'] text-xl font-bold text-[#352b27]">Hear how simple it is</h3>
                      <p className="text-[14px] text-[#8c7e77]">
                        Listen to a simulated local merchant order and see the AI draft an agreement instantly.
                      </p>
                    </div>
                    <button
                      onClick={startDemo}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#92372c] hover:bg-[#a64034] text-white font-bold text-[13px] uppercase tracking-wider rounded-full shadow-md shadow-[#92372c]/20 hover:scale-[1.03] transition-all"
                    >
                      <Play className="h-4 w-4 fill-white" />
                      Play Spoken Deal
                    </button>
                  </div>
                )}

                {/* State 2: Playing Audio & Typewriting */}
                {demoState === 'playing' && (
                  <div className="flex-1 flex flex-col justify-between py-6">
                    {/* Simulated Voice Playback */}
                    <div className="bg-[#fff3ed] border border-[#f4eae5] rounded-2xl p-5 flex items-center gap-4">
                      <button className="h-10 w-10 rounded-full bg-[#92372c] text-white flex items-center justify-center shrink-0">
                        <Volume2 className="h-5 w-5 animate-bounce" />
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#8c7e77] mb-1.5 uppercase">
                          <span>Speaking (Hindi)</span>
                          <span className="text-[#9b493d]">Analyzing...</span>
                        </div>
                        {/* Audio Wave animation */}
                        <div className="flex items-end gap-1 h-8">
                          {[25, 45, 15, 60, 30, 40, 75, 20, 50, 35, 65, 40, 20, 55, 30].map((h, i) => (
                            <span
                              key={i}
                              className="flex-1 bg-[#bc6f62] rounded-full transition-all duration-300"
                              style={{
                                height: `${Math.max(10, Math.sin((Date.now() + i * 200) / 150) * h)}%`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Speech Transcript */}
                    <div className="space-y-4 my-8">
                      <p className="text-[12px] font-semibold uppercase tracking-wider text-[#9b493d] flex items-center gap-1.5">
                        <Languages className="h-4 w-4" /> Live Voice Transcript:
                      </p>
                      <blockquote className="border-l-2 border-[#92372c] pl-4 italic text-[16px] leading-relaxed font-serif text-[#3b302c]">
                        &ldquo;{typewrittenText}&rdquo;
                      </blockquote>
                    </div>

                    <div className="flex justify-end">
                      <button onClick={resetDemo} className="text-xs font-semibold text-[#8c7e77] hover:text-[#92372c] flex items-center gap-1">
                        <RotateCcw className="h-3 w-3" /> Stop
                      </button>
                    </div>
                  </div>
                )}

                {/* State 3: Extracting Key Fields */}
                {demoState === 'extracting' && (
                  <div className="flex-1 flex flex-col justify-between py-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[12px] font-bold uppercase tracking-wider text-[#736862] flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                          AI Processing Audio
                        </span>
                        <span className="text-[11px] font-semibold text-[#bc6f62]">Extracting fields...</span>
                      </div>

                      {/* Display extracted fields with delightful slide-in entry */}
                      <div className="grid grid-cols-2 gap-3.5">
                        {extractedFields.map((field, idx) => {
                          const isLoaded = idx <= activeExtractedIndex
                          return (
                            <div
                              key={idx}
                              className={`border rounded-xl p-3 transition-all duration-500 ${isLoaded
                                  ? 'border-[#cae8dd] bg-[#e5f1e9]/40 scale-100 opacity-100 shadow-sm'
                                  : 'border-[#f4eae5] bg-gray-50/50 scale-95 opacity-30'
                                }`}
                            >
                              <p className="text-[11px] font-bold text-[#8c7e77] uppercase tracking-wider">
                                {field.label}
                              </p>
                              <p className="text-[13px] font-extrabold text-[#352b27] mt-1 flex items-center gap-1.5">
                                {isLoaded && <Check className="h-3.5 w-3.5 text-[#557b6e]" />}
                                {field.value}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button onClick={resetDemo} className="text-xs font-semibold text-[#8c7e77] hover:text-[#92372c] flex items-center gap-1">
                        <RotateCcw className="h-3 w-3" /> Reset
                      </button>
                    </div>
                  </div>
                )}

                {/* State 4: Draft Document Ready */}
                {demoState === 'draft' && (
                  <div className="flex-1 flex flex-col justify-between py-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[12px] font-bold uppercase text-[#557b6e] bg-[#e5f1e9] px-3.5 py-1 rounded-full self-start w-fit">
                        <CheckCircle2 className="h-3.5 w-3.5" /> AI Draft Complete
                      </div>

                      {/* Contract Preview Wrapper */}
                      <div className="border border-[#eadbd4] rounded-2xl bg-[#fffbf9] p-5 font-serif text-[13px] leading-relaxed text-[#443833] max-h-[220px] overflow-y-auto shadow-inner relative">
                        <div className="text-center font-bold underline mb-3 text-[14px] uppercase tracking-wider text-[#92372c]">
                          DIGITAL PURCHASE AGREEMENT
                        </div>
                        <p className="mb-2">
                          This agreement is entered into on <strong>Next Tuesday</strong>.
                        </p>
                        <p className="mb-2">
                          <strong>Seller Party:</strong> Mehta Textiles (Asha Ji) <br />
                          <strong>Buyer Party:</strong> Custom Textiles Inc.
                        </p>
                        <p className="mb-2">
                          <strong>Product Details:</strong> 500 units of Cotton Bags.
                        </p>
                        <p className="mb-2">
                          <strong>Financial Terms:</strong> ₹120 per unit. Payment structure settled on <strong>Cash on Delivery (COD)</strong>.
                        </p>
                        <p className="text-center border-t border-[#eadbd4] pt-2 mt-4 text-[11px] font-sans uppercase tracking-widest text-[#8c7e77]">
                          Digitally draft signed via Voice Karar
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <button
                        onClick={handleConfirmDemo}
                        className="w-full py-3.5 bg-[#92372c] hover:bg-[#a64034] text-white font-bold text-[14px] rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                      >
                        <FileSignature className="h-4 w-4" /> Sign & Accept Agreement
                      </button>
                      <button onClick={resetDemo} className="w-full text-center text-xs font-semibold text-[#8c7e77] hover:text-[#92372c] py-1.5">
                        Start Over
                      </button>
                    </div>
                  </div>
                )}

                {/* State 5: Confirmed Success State */}
                {demoState === 'confirmed' && (
                  <div className="flex-1 flex flex-col items-center justify-center py-8 space-y-6 text-center animate-stamp-pressed">
                    <div className="w-20 h-20 rounded-full bg-[#e5f1e9] border-2 border-[#557b6e] flex items-center justify-center text-[#557b6e] shadow-lg">
                      <Check className="h-10 w-10 stroke-[3px]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-['Source_Serif_4'] text-2xl font-bold text-[#557b6e]">Agreement Confirmed!</h3>
                      <p className="text-[14px] text-[#736862] max-w-[320px]">
                        The buyer approved the terms. Both parties received a secure shareable link and copy of the legally drafted contract via WhatsApp.
                      </p>
                    </div>

                    <div className="bg-[#fcf7f4] border border-[#eadbd4] p-4 rounded-xl text-[12px] text-left space-y-1.5 w-full">
                      <p className="font-bold text-[#92372c]">What happened behind the scenes?</p>
                      <ul className="list-disc pl-4 text-[#756a65] space-y-1">
                        <li>Voice input transcribed accurately.</li>
                        <li>Key details mapped to legal constraints.</li>
                        <li>Markdown legal draft compiled in seconds.</li>
                        <li>Secure buyer confirmation link dispatched.</li>
                      </ul>
                    </div>

                    <div className="flex gap-4 w-full pt-2">
                      <button
                        onClick={() => navigate('/signup')}
                        className="flex-1 py-3 bg-[#92372c] hover:bg-[#a64034] text-white font-bold text-[13px] rounded-lg shadow"
                      >
                        Create Your Own
                      </button>
                      <button
                        onClick={resetDemo}
                        className="px-4 py-3 border border-[#d2b7ad] rounded-lg text-xs font-bold text-[#4c403b] hover:bg-[#fff3ed]"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Meta info */}
                <div className="mt-auto border-t border-[#eadbd4]/40 pt-4 flex items-center justify-between text-[11px]">
                  <div className="flex -space-x-1.5">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f6ece6] text-[9px] font-bold text-[#92372c] border border-white">AK</span>
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#ffd8d1] text-[9px] font-bold text-[#92372c] border border-white">DM</span>
                  </div>
                  <span className="rounded-full bg-[#e5f1e9] px-3.5 py-1 text-[10px] font-extrabold uppercase text-[#557b6e] tracking-wider">
                    Secured by OTP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process/How it Works Section */}
        <section id="how" className="px-6 py-24 bg-white border-y border-[#eadbd4]/60">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a3d31]">The Voice Karar Process</p>
              <h2 className="font-['Source_Serif_4'] text-4xl font-extrabold text-[#171513]">Digitize in three simple steps</h2>
              <p className="text-sm text-[#756a65] max-w-md mx-auto">
                No complex forms, no lawyer consults needed. Bring contract automation straight to your voice messages.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {steps.map(({ title, text, icon: Icon }, index) => (
                <article
                  key={title}
                  className="relative rounded-2xl border border-[#ead5cc] bg-[#fff3ed]/60 p-8 hover:bg-[#fff3ed] hover:-translate-y-1 transition-all duration-300 hover:shadow-md group"
                >
                  <span className="absolute right-6 top-6 font-['Source_Serif_4'] text-2xl font-bold italic text-[#dfc8be]/70 group-hover:text-[#92372c]/20 transition-colors">
                    0{index + 1}
                  </span>
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#ffd8d1] text-[#9a3d31] shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-8 font-['Source_Serif_4'] text-2xl font-bold text-[#352b27]">{title}</h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-[#756a65]">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Why Voice Karar / Benefits Grid */}
        <section id="why" className="bg-[#fffaf7] px-6 py-24">
          <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-[0.8fr_1.2fr] items-start">
            <div className="space-y-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a3d31]">Why Voice Karar</p>
              <h2 className="font-['Source_Serif_4'] text-4xl font-extrabold leading-tight text-[#171513]">
                Built for the Modern Indian Merchant
              </h2>
              <p className="text-[15px] leading-relaxed text-[#756a65]">
                Indian MSMEs deal with fast turnarounds. Don't break the momentum of a deal to go find a pen, stamp paper, or template. Speak your terms, verify, and seal the bond immediately.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center gap-2 rounded-full border border-[#d2b7ad] hover:border-[#92372c] hover:text-[#92372c] bg-white px-6 py-3 text-[13px] font-bold transition-all"
              >
                Compare Features <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {trustCards.map(({ title, text, icon: Icon, wide }) => (
                <article
                  key={title}
                  className={`rounded-2xl border border-[#ead5cc] bg-white p-7 hover:shadow-md transition-shadow group ${wide ? 'md:col-span-2' : ''
                    }`}
                >
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#fff3ed] text-[#9a3d31] group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-['Source_Serif_4'] text-2xl font-bold text-[#3b302c]">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#756a65]">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing / Call-to-action Section */}
        <section id="pricing" className="px-6 py-20 bg-white">
          <div className="mx-auto max-w-7xl rounded-[32px] bg-[#342d2a] px-8 py-16 text-center text-white sm:px-16 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#bc6f62]/10 rounded-full filter blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#6e9184]/10 rounded-full filter blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <h2 className="font-['Source_Serif_4'] text-4xl sm:text-5xl font-extrabold leading-tight text-white tracking-tight">
                Ready to make your word your bond?
              </h2>
              <p className="text-[16px] leading-relaxed text-white/80 max-w-xl mx-auto">
                Join 5,000+ Indian business owners who have moved their verbal deals from WhatsApp calls to legally structured, secure digital agreements.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="rounded-full bg-[#a24435] hover:bg-[#b74e3e] px-8 py-4 text-[14px] font-bold text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Start Your Free Trial
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="rounded-full bg-white hover:bg-gray-100 px-8 py-4 text-[14px] font-bold text-[#342d2a] shadow transition-all"
                >
                  Schedule a Demo
                </button>
              </div>

              <p className="pt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
                No credit card required &middot; Designed for Indian MSMEs
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#eadbd4] bg-[#fffaf7] px-6 py-16 relative z-10">
        <div className="mx-auto max-w-7xl grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="space-y-4">
            <h2 className="font-['Source_Serif_4'] text-2xl font-extrabold text-[#92372c] flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-[#92372c]" />
              Voice Karar
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-[#756a65]">
              Digitizing everyday Indian business trust with the efficiency of modern Voice AI.
            </p>
            <p className="text-xs text-[#9b8a82]">© 2026 Voice Karar. All rights reserved.</p>
          </div>
          <div className="text-[14px]">
            <p className="font-bold text-[#3f3733] uppercase tracking-wider text-xs mb-4">Platform</p>
            <nav className="flex flex-col gap-3 text-[#756a65]">
              <a href="#how" className="hover:text-[#92372c] transition-colors">How it works</a>
              <a href="#why" className="hover:text-[#92372c] transition-colors">Why Voice Karar</a>
              <a href="#pricing" className="hover:text-[#92372c] transition-colors">Pricing</a>
            </nav>
          </div>
          <div className="text-[14px]">
            <p className="font-bold text-[#3f3733] uppercase tracking-wider text-xs mb-4">Company</p>
            <nav className="flex flex-col gap-3 text-[#756a65]">
              <span className="hover:text-[#92372c] cursor-pointer transition-colors">About Us</span>
              <span className="hover:text-[#92372c] cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-[#92372c] cursor-pointer transition-colors">Terms of Service</span>
            </nav>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[#eadbd4]/40 text-center text-xs text-[#b19d94] font-semibold tracking-wider uppercase">
          Built specifically for Indian MSMEs &middot; Make your word your bond
        </div>
      </footer>
    </div>
  )
}

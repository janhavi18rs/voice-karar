import {
  ArrowRight,
  Bell,
  CheckCircle2,
  CircleHelp,
  FileText,
  Folder,
  Lock,
  Mic,
  PenLine,
  Upload,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const paths = [
  {
    title: 'Record Voice Summary',
    description:
      'Simply speak the terms of your agreement. Our AI will transcribe and draft a formal contract based on your conversation.',
    icon: Mic,
    iconTone: 'bg-[#ffd8d1] text-[#8a2f23]',
    buttonLabel: 'Start Recording',
    route: '/record-voice',
    actionIcon: ArrowRight,
    primary: true,
  },
  {
    title: 'Upload Audio',
    description:
      'Have a pre-recorded meeting or voice note? Upload the file and we will extract the contractual obligations automatically.',
    icon: Folder,
    iconTone: 'bg-[#cae8dd] text-[#3f6f61]',
    buttonLabel: 'Select File',
    route: '/upload-audio',
    actionIcon: Upload,
  },
  {
    title: 'Enter Manually',
    description:
      'Prefer the traditional way? Use our intelligent editor with pre-built MSME templates and legal clauses.',
    icon: PenLine,
    iconTone: 'bg-[#ede1d1] text-[#5b5045]',
    buttonLabel: 'Start Typing',
    route: '/manual-entry',
    actionIcon: PenLine,
  },
]

export default function CreateAgreementPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen border-[6px] border-[#5543d8] bg-[#fffaf7] text-[#3b302c]">
      <header className="border-b border-[#eadbd4] bg-[#fffaf7]/95 px-7 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-9">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-5">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#a33a2f] text-white shadow-lg shadow-[#a33a2f]/20">
                <Mic className="h-7 w-7" />
              </span>
              <span className="font-['Source_Serif_4'] text-4xl font-extrabold tracking-tight text-[#171513]">
                Voice Karar
              </span>
            </button>
            <nav className="hidden items-center gap-8 text-[13px] font-semibold md:flex">
              <button onClick={() => navigate('/dashboard')} className="text-[#5e5652]">
                Dashboard
              </button>
              <button className="border-b-2 border-[#8f2f23] pb-1 text-[#8f2f23]">
                Agreements
              </button>
              <button className="text-[#5e5652]">Templates</button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button title="Notifications" className="text-[#5f5550]">
              <Bell className="h-4 w-4" />
            </button>
            <button title="Help" className="text-[#5f5550]">
              <CircleHelp className="h-4 w-4" />
            </button>
            <button
              title="Profile"
              onClick={() => navigate('/profile')}
              className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-[#d9c8bf] bg-[#efe1d6]"
            >
              <span className="text-sm font-bold text-[#7f3028]">VK</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-7 pb-14 pt-9">
        <section className="text-center">
          <h1 className="font-['Source_Serif_4'] text-4xl font-bold leading-tight text-[#332923] md:text-5xl">
            How would you like to start?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-6 text-[#7b716c]">
            Select your preferred method to create a legally binding agreement. Our AI will
            handle the structure and legal nuances for you.
          </p>
        </section>

        <section className="mt-16 grid gap-7 lg:grid-cols-3">
          {paths.map(({ title, description, icon: Icon, iconTone, buttonLabel, route, actionIcon: ActionIcon, primary }) => (
            <article
              key={title}
              className="flex min-h-[430px] flex-col justify-between rounded-lg border border-[#e4ccc2] bg-white px-8 py-8 shadow-sm"
            >
              <div>
                <div className={`grid h-16 w-16 place-items-center rounded-lg ${iconTone}`}>
                  <Icon className="h-7 w-7" strokeWidth={2.4} />
                </div>
                <h2 className="mt-8 max-w-[12rem] font-['Source_Serif_4'] text-3xl font-bold leading-tight text-[#4a403a]">
                  {title}
                </h2>
                <p className="mt-5 max-w-[17rem] text-[14px] font-medium leading-6 text-[#827873]">
                  {description}
                </p>
              </div>

              <button
                onClick={() => navigate(route)}
                className={`mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border px-5 text-[12px] font-bold tracking-wide transition ${
                  primary
                    ? 'border-[#7f2c20] bg-[#7f2c20] text-white hover:bg-[#6e241a]'
                    : 'border-[#c78d7e] bg-white text-[#9b5548] hover:bg-[#fff4ef]'
                }`}
              >
                {buttonLabel}
                <ActionIcon className="h-3.5 w-3.5" />
              </button>
            </article>
          ))}
        </section>

        <section className="mt-20 rounded-lg border border-[#ead5cc] bg-[#fff3ed] px-10 py-10 shadow-sm">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <span className="rounded-full bg-[#6e9184] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                AI Powered
              </span>
              <h2 className="mt-6 font-['Source_Serif_4'] text-3xl font-bold text-[#51433d]">
                Smart Drafting Technology
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-6 text-[#786e68]">
                Our platform uses state-of-the-art Voice AI to understand context,
                relationship dynamics, and specific deal points, ensuring every agreement
                reflects your true intent.
              </p>
              <div className="mt-8 flex flex-wrap gap-7 text-[13px] font-semibold text-[#6e766d]">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#6d9184]" />
                  Verified Legal Templates
                </span>
                <span className="inline-flex items-center gap-2">
                  <Lock className="h-5 w-5 text-[#6d9184]" />
                  256-bit Encryption
                </span>
              </div>
            </div>

            <div className="relative min-h-[290px] overflow-hidden rounded-md bg-[#d8c7b7] shadow-lg">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.78)_0_18%,rgba(255,255,255,.35)_18%_28%,transparent_28%),linear-gradient(0deg,#b39072_0_23%,#efe8dd_23%_100%)]" />
              <div className="absolute left-[8%] top-[16%] h-28 w-16 rounded-full bg-[#8ba070]/45 blur-sm" />
              <div className="absolute left-[14%] top-[7%] h-44 w-1 bg-[#78664e]" />
              <div className="absolute left-[11%] top-[10%] h-24 w-20 rounded-t-full border-x-8 border-t-8 border-[#6f8063]" />
              <div className="absolute right-[10%] top-[18%] h-28 w-36 rounded-sm bg-[#c9aa87] shadow-md" />
              <div className="absolute right-[13%] top-[23%] h-5 w-20 rounded-sm bg-[#f6efe8]" />
              <div className="absolute right-[13%] top-[35%] h-4 w-24 rounded-sm bg-[#9d7d61]" />
              <div className="absolute bottom-[13%] left-[25%] h-20 w-56 rounded-md bg-[#b69070] shadow-xl" />
              <div className="absolute bottom-[18%] left-[43%] h-40 w-20 rotate-[-8deg] rounded-[1.4rem] border-[7px] border-[#36302e] bg-[#f9f5ef] shadow-2xl">
                <div className="mx-auto mt-2 h-1.5 w-7 rounded-full bg-[#5b5550]" />
                <div className="mx-3 mt-4 h-5 rounded bg-[#c95a3e]" />
                <div className="mx-3 mt-3 space-y-2">
                  <div className="h-2 rounded bg-[#ddd3cb]" />
                  <div className="h-2 rounded bg-[#ddd3cb]" />
                  <div className="h-2 w-8 rounded bg-[#6e9184]" />
                  <div className="h-2 rounded bg-[#ddd3cb]" />
                </div>
              </div>
              <div className="absolute bottom-[15%] right-[15%] h-8 w-40 rounded-full bg-[#8a755f]/30 blur-md" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#eadbd4] bg-[#f6ece6] px-7 py-10">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.18em] text-[#6b5951]">
              <FileText className="h-4 w-4 text-[#9a4a3f]" />
              Legally Compliant & Secure
            </div>
            <p className="mt-3 text-[13px] text-[#7d7069]">
              Aligned with the Information Technology Act and Indian Contract Act.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-12 text-[12px] font-semibold uppercase tracking-wide text-[#9a8a82]">
            <div>
              <p>Support</p>
              <button className="mt-2 normal-case tracking-normal text-[#5f5550]">Help Center</button>
            </div>
            <div>
              <p>Legal</p>
              <button className="mt-2 normal-case tracking-normal text-[#5f5550]">Privacy Policy</button>
            </div>
            <div>
              <p>Enterprise</p>
              <button className="mt-2 normal-case tracking-normal text-[#5f5550]">Tier Plans</button>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-7xl border-t border-[#e4d6cf] pt-7 text-center text-[11px] text-[#a0928a]">
          © 2024 Voice Karar MSME Portal. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

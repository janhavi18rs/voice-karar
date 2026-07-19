import {
  ArrowRight,
  Folder,
  Mic,
  PenLine,
  Upload,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

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
    <div className="min-h-screen bg-[#fffaf7] text-[#3b302c]">
      <Navbar />

      <main className="mx-auto flex min-h-[calc(100vh-104px)] max-w-7xl flex-col justify-center px-7 py-7">
        <section className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <h1 className="w-full font-['Source_Serif_4'] text-3xl font-bold leading-tight text-[#332923] md:text-4xl">
            How would you like to start?
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-center text-[14px] leading-6 text-[#7b716c]">
            Select your preferred method to create a legally binding agreement. Our AI will
            handle the structure and legal nuances for you.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {paths.map(({ title, description, icon: Icon, iconTone, buttonLabel, route, actionIcon: ActionIcon, primary }) => (
            <article
              key={title}
              className="group relative flex min-h-[295px] flex-col justify-between overflow-hidden rounded-xl border border-[#e4ccc2] bg-white px-7 py-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c98b7d] hover:shadow-xl hover:shadow-[#8f382d]/10"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-[#8f382d] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div>
                <div className={`grid h-14 w-14 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${iconTone}`}>
                  <Icon className="h-6 w-6" strokeWidth={2.4} />
                </div>
                <h2 className="mt-5 max-w-[12rem] font-['Source_Serif_4'] text-2xl font-bold leading-tight text-[#4a403a]">
                  {title}
                </h2>
                <p className="mt-3 max-w-[21rem] text-[13px] font-medium leading-6 text-[#756a65]">
                  {description}
                </p>
              </div>

              <button
                onClick={() => navigate(route)}
                className={`mt-5 inline-flex h-11 w-full items-center justify-center gap-3 rounded-md border px-5 text-[13px] font-bold tracking-wide transition ${
                  primary
                    ? 'border-[#7f2c20] bg-[#7f2c20] text-white shadow-md shadow-[#7f2c20]/15 hover:bg-[#6e241a]'
                    : 'border-[#c78d7e] bg-white text-[#9b5548] hover:border-[#8f382d] hover:bg-[#fff4ef] hover:text-[#8f382d]'
                }`}
              >
                {buttonLabel}
                <ActionIcon className="h-3.5 w-3.5" />
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}

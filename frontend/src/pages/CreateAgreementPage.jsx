import { FileText, FolderUp, Mic, PenSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'

const paths = [
  {
    title: 'Record Voice Summary',
    description: 'Record a short summary of your business agreement.',
    icon: Mic,
    buttonLabel: 'Start Recording',
    route: '/record-voice'
  },
  {
    title: 'Upload Audio',
    description: 'Upload an existing voice recording.',
    icon: FolderUp,
    buttonLabel: 'Choose Audio File',
    route: '/upload-audio'
  },
  {
    title: 'Enter Agreement Manually',
    description: 'Type your agreement summary.',
    icon: PenSquare,
    buttonLabel: 'Start Writing',
    route: '/manual-entry'
  }
]

export default function CreateAgreementPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="space-y-2 border-b border-[var(--ledger-line)] pb-4">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink)]/75">Create agreement</p>
          <h1 className="font-['Source_Serif_4'] text-3xl sm:text-4xl">Choose your input path</h1>
          <p className="text-sm text-[var(--ink)]/80">Each path leads to the same trusted agreement draft.</p>
        </header>

        <main className="grid flex-1 gap-4 py-8 lg:grid-cols-3">
          {paths.map(({ title, description, icon: Icon, buttonLabel, route }) => (
            <Card key={title} tone="stamp" className="flex flex-col justify-between border-t-4 border-t-[var(--seal)]">
              <div>
                <div className="flex h-12 w-12 items-center justify-center border border-[var(--ledger-line)] bg-[var(--paper)] text-[var(--seal)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-4 font-['Source_Serif_4'] text-2xl">{title}</h2>
                <p className="mt-3 text-sm text-[var(--ink)]/70">{description}</p>
              </div>
              <div className="mt-6 space-y-3">
                {title === 'Upload Audio' ? <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink)]/60">MP3, WAV, M4A supported</p> : null}
                <Button className="w-full" onClick={() => navigate(route)}>{buttonLabel}</Button>
              </div>
            </Card>
          ))}
        </main>
      </div>
    </div>
  )
}

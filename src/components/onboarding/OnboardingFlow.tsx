import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface OnboardingScreen {
  emoji: string
  title: string
}

const SCREENS: OnboardingScreen[] = [
  { emoji: '💩', title: 'Meet your new bathroom tracker.' },
  { emoji: '📊', title: 'Track bowel movements, gas, duration, and patterns.' },
  { emoji: '🔒', title: 'Your data stays on your device.' },
]

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const isLastStep = step === SCREENS.length - 1
  const screen = SCREENS[step]

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-paper px-6 py-12 text-center">
      <button type="button" onClick={onComplete} className="self-end text-sm text-ink-soft hover:text-ink">
        Skip
      </button>

      <div className="flex flex-col items-center gap-6 max-w-xs">
        <span className="text-6xl" aria-hidden="true">
          {screen.emoji}
        </span>
        <h1 className="font-display text-2xl leading-snug">{screen.title}</h1>
      </div>

      <div className="flex flex-col items-center gap-5 w-full max-w-xs">
        <div className="flex items-center gap-2" role="presentation">
          {SCREENS.map((_, index) => (
            <span
              key={index}
              aria-hidden="true"
              className={`h-1.5 rounded-full transition-all ${
                index === step ? 'w-6 bg-clay' : 'w-1.5 bg-line-strong'
              }`}
            />
          ))}
        </div>

        <Button
          variant="clay"
          size="lg"
          fullWidth
          onClick={() => (isLastStep ? onComplete() : setStep((s) => s + 1))}
        >
          {isLastStep ? 'Start tracking' : 'Next'}
        </Button>
      </div>
    </div>
  )
}

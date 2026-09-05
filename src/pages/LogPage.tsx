import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function LogPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl">Log</h1>
        <p className="text-sm text-ink-soft mt-1">Choose what you want to log.</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <Card variant="flat" className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Bowel movement</p>
            <p className="text-sm text-ink-soft">Duration, type, color, and how it felt.</p>
          </div>
          <Button variant="clay" onClick={() => navigate('/log/poop')}>
            💩 Log
          </Button>
        </Card>

        <Card variant="flat" className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Gas</p>
            <p className="text-sm text-ink-soft">Fast — amount, odor, context.</p>
          </div>
          <Button variant="lavender" onClick={() => navigate('/log/gas')}>
            💨 Log
          </Button>
        </Card>
      </div>
    </div>
  )
}

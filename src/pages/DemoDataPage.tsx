import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Toast } from '@/components/ui/Toast'
import { loadDemoData } from '@/storage/demoData'
import { resetAllData } from '@/storage/backup'

export function DemoDataPage() {
  const [confirmAction, setConfirmAction] = useState<'load' | 'clear' | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  function handleConfirm() {
    if (confirmAction === 'load') {
      loadDemoData()
      setToastMessage('Demo data loaded — 21 days of sample entries.')
    } else if (confirmAction === 'clear') {
      resetAllData()
      setToastMessage('All data cleared.')
    }
    setConfirmAction(null)
  }

  return (
    <div className="flex flex-col gap-6 max-w-md">
      <header>
        <h1 className="font-display text-3xl">Demo data</h1>
        <p className="text-sm text-ink-soft mt-1">
          Internal tool for generating screenshot-ready content. Not linked from the app's navigation — customers
          won't stumble onto this page.
        </p>
      </header>

      <Card variant="tinted">
        <p className="text-sm">
          Loading demo data replaces whatever is currently stored with ~21 days of realistic, synthetic entries —
          useful for populating the Dashboard, Calendar, and Insights before taking product screenshots.
        </p>
      </Card>

      <div className="flex flex-col gap-3">
        <Button variant="clay" onClick={() => setConfirmAction('load')}>
          Load demo data
        </Button>
        <Button variant="quiet" onClick={() => setConfirmAction('clear')}>
          Clear all data
        </Button>
      </div>

      {confirmAction && (
        <ConfirmDialog
          title={confirmAction === 'load' ? 'Load demo data?' : 'Clear all data?'}
          description={
            confirmAction === 'load'
              ? "This replaces whatever is currently stored with synthetic sample data. Anything real you've logged will be lost."
              : "This permanently erases everything currently stored. This can't be undone."
          }
          confirmLabel={confirmAction === 'load' ? 'Load demo data' : 'Clear everything'}
          destructive
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}
    </div>
  )
}

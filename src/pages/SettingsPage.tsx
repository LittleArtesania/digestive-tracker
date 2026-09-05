import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { ChipGroup } from '@/components/ui/ChipGroup'
import { SettingsRow } from '@/components/ui/SettingsRow'
import { Toast } from '@/components/ui/Toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { getSettings, updateSettings, DEFAULT_SETTINGS } from '@/storage/settings'
import { downloadBackup, importBackup, resetAllData } from '@/storage/backup'
import { useThemeContext } from '@/hooks/ThemeContext'
import type { AppSettings, DateFormat, TimeFormat, ThemePreference } from '@/types/tracker'

const DATE_FORMAT_OPTIONS: { value: DateFormat; label: string }[] = [
  { value: 'mdy', label: 'MM/DD/YYYY' },
  { value: 'dmy', label: 'DD/MM/YYYY' },
  { value: 'ymd', label: 'YYYY-MM-DD' },
]

const TIME_FORMAT_OPTIONS: { value: TimeFormat; label: string }[] = [
  { value: '12h', label: '12-hour' },
  { value: '24h', label: '24-hour' },
]

const FIRST_DAY_OPTIONS: { value: 0 | 1; label: string }[] = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
]

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]

export function SettingsPage() {
  const { setThemePreference } = useThemeContext()
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSettings(getSettings())
  }, [])

  function applySettings(patch: Partial<AppSettings>) {
    const updated = updateSettings(patch)
    setSettings(updated)
    if (patch.theme) setThemePreference(patch.theme)
  }

  function handleExport() {
    downloadBackup()
    setToastMessage('Backup downloaded')
  }

  function handleImportClick() {
    setImportError(null)
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = importBackup(String(reader.result))
      if (result.success) {
        setImportError(null)
        setToastMessage('Data imported')
        setSettings(getSettings())
      } else {
        setImportError(result.error)
      }
    }
    reader.onerror = () => setImportError("Couldn't read that file. Please try again.")
    reader.readAsText(file)
  }

  function handleConfirmReset() {
    resetAllData()
    setSettings(DEFAULT_SETTINGS)
    setThemePreference(DEFAULT_SETTINGS.theme)
    setShowResetConfirm(false)
    setToastMessage('All data deleted')
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <header>
        <h1 className="font-display text-3xl">Settings</h1>
        <p className="text-sm text-ink-soft mt-1">Privacy, appearance, and your data.</p>
      </header>

      <section>
        <h2 className="font-display text-lg mb-2">General</h2>
        <Card variant="flat" className="flex flex-col divide-y divide-line">
          <SettingsRow label="Date format" htmlFor="setting-date-format">
            <select
              id="setting-date-format"
              value={settings.dateFormat}
              onChange={(e) => applySettings({ dateFormat: e.target.value as DateFormat })}
              className="border border-line-strong rounded-[var(--radius-chip)] px-2.5 py-1.5 text-sm bg-surface"
            >
              {DATE_FORMAT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </SettingsRow>
          <SettingsRow label="Time format" htmlFor="setting-time-format">
            <select
              id="setting-time-format"
              value={settings.timeFormat}
              onChange={(e) => applySettings({ timeFormat: e.target.value as TimeFormat })}
              className="border border-line-strong rounded-[var(--radius-chip)] px-2.5 py-1.5 text-sm bg-surface"
            >
              {TIME_FORMAT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </SettingsRow>
          <SettingsRow label="First day of week" htmlFor="setting-first-day">
            <select
              id="setting-first-day"
              value={settings.firstDayOfWeek}
              onChange={(e) => applySettings({ firstDayOfWeek: Number(e.target.value) as 0 | 1 })}
              className="border border-line-strong rounded-[var(--radius-chip)] px-2.5 py-1.5 text-sm bg-surface"
            >
              {FIRST_DAY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </SettingsRow>
        </Card>
      </section>

      <section>
        <h2 className="font-display text-lg mb-2">Appearance</h2>
        <Card variant="flat">
          <ChipGroup legend="" options={THEME_OPTIONS} value={settings.theme} onChange={(theme) => applySettings({ theme })} />
        </Card>
      </section>

      <section>
        <h2 className="font-display text-lg mb-2">Privacy</h2>
        <Card variant="flat" className="flex flex-col divide-y divide-line">
          <SettingsRow label="Private mode" description="Shows discreet wording instead of specific counts.">
            <Toggle
              checked={settings.privateMode}
              onChange={(privateMode) => applySettings({ privateMode })}
              label="Private mode"
            />
          </SettingsRow>
          <SettingsRow label="Export data" description="Download everything as a JSON file.">
            <Button variant="quiet" size="sm" onClick={handleExport}>
              Export
            </Button>
          </SettingsRow>
          <SettingsRow label="Import data" description="Restore from a previous backup file.">
            <Button variant="quiet" size="sm" onClick={handleImportClick}>
              Import
            </Button>
            <input ref={fileInputRef} type="file" accept="application/json" onChange={handleFileChange} className="hidden" />
          </SettingsRow>
          {importError && <p className="text-xs text-clay-text pt-2">{importError}</p>}
          <SettingsRow label="Delete all data" description="Permanently erase everything on this device.">
            <Button variant="quiet" size="sm" onClick={() => setShowResetConfirm(true)}>
              Delete
            </Button>
          </SettingsRow>
        </Card>
      </section>

      <section>
        <h2 className="font-display text-lg mb-2">About</h2>
        <Card variant="tinted">
          <p className="text-sm leading-relaxed">
            This app is designed for personal tracking and journaling. It is not intended to diagnose, treat, or
            prevent medical conditions. Your data stays on this device — there's no account and no cloud sync.
          </p>
        </Card>
      </section>

      {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}

      {showResetConfirm && (
        <ConfirmDialog
          title="Delete all data?"
          description="This will permanently delete your digestive tracking data from this device. This can't be undone."
          confirmLabel="Delete everything"
          destructive
          onConfirm={handleConfirmReset}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </div>
  )
}

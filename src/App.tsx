import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ThemeProvider } from '@/hooks/ThemeContext'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import { getSettings, updateSettings } from '@/storage/settings'
import { DashboardPage } from '@/pages/DashboardPage'
import { LogPage } from '@/pages/LogPage'
import { LogPoopPage } from '@/pages/LogPoopPage'
import { LogGasPage } from '@/pages/LogGasPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { CalendarPage } from '@/pages/CalendarPage'
import { InsightsPage } from '@/pages/InsightsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { DemoDataPage } from '@/pages/DemoDataPage'

function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => getSettings().hasCompletedOnboarding)

  return (
    <ThemeProvider>
      {!hasCompletedOnboarding ? (
        <OnboardingFlow
          onComplete={() => {
            updateSettings({ hasCompletedOnboarding: true })
            setHasCompletedOnboarding(true)
          }}
        />
      ) : (
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/log" element={<LogPage />} />
            <Route path="/log/poop" element={<LogPoopPage />} />
            <Route path="/log/poop/:id" element={<LogPoopPage />} />
            <Route path="/log/gas" element={<LogGasPage />} />
            <Route path="/log/gas/:id" element={<LogGasPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/dev/demo-data" element={<DemoDataPage />} />
          </Route>
        </Routes>
      )}
    </ThemeProvider>
  )
}

export default App

import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import { ThemeProvider } from '@/contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 text-slate-900 dark:text-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to="/search" replace />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
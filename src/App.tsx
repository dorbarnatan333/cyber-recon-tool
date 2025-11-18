import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-50">
      <Routes>
        <Route path="/" element={<Navigate to="/search" replace />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </div>
  )
}

export default App
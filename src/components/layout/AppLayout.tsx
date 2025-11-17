import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Dashboard from '@/pages/Dashboard'

const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/targets" element={<div>Targets Page - Coming Soon</div>} />
            <Route path="/scanning" element={<div>Scanning Page - Coming Soon</div>} />
            <Route path="/vulnerabilities" element={<div>Vulnerabilities Page - Coming Soon</div>} />
            <Route path="/reports" element={<div>Reports Page - Coming Soon</div>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default AppLayout
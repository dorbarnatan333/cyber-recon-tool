import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Dashboard from '@/pages/Dashboard'
import Targets from '@/pages/Targets'
import Scanning from '@/pages/Scanning'
import Vulnerabilities from '@/pages/Vulnerabilities'
import MainSearch from '@/pages/MainSearch'
import SearchResults from '@/pages/SearchResults'
import Investigation from '@/pages/Investigation'

const AppLayout: React.FC = () => {
  return (
    <Routes>
      {/* New search interface - standalone pages without sidebar */}
      <Route path="/search" element={<MainSearch />} />
      <Route path="/search/results" element={<SearchResults />} />
      <Route path="/investigate/:deviceId" element={<Investigation />} />
      
      {/* Original layout with sidebar for legacy pages */}
      <Route path="/*" element={
        <div className="flex h-screen bg-gray-950">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/targets" element={<Targets />} />
                <Route path="/scanning" element={<Scanning />} />
                <Route path="/vulnerabilities" element={<Vulnerabilities />} />
                <Route path="/reports" element={<div>Reports Page - Coming Soon</div>} />
              </Routes>
            </main>
          </div>
        </div>
      } />
    </Routes>
  )
}

export default AppLayout
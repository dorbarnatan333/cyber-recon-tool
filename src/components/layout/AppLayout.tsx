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
import CompanyDashboard from '@/pages/CompanyDashboardNew'
import Investigation from '@/pages/Investigation'
import NetworkAnalysis from '@/pages/NetworkAnalysis'
import BrowserAnalysis from '@/pages/BrowserAnalysis'
import FilesAndHash from '@/pages/FilesAndHash'
import SecurityEvents from '@/pages/SecurityEvents'
import DataSourcesCollection from '@/pages/DataSourcesCollection'
import SystemInformation from '@/pages/SystemInformation'

const AppLayout: React.FC = () => {
  return (
    <Routes>
      {/* New search interface - standalone pages without sidebar */}
      <Route path="/search" element={<MainSearch />} />
      <Route path="/search/results" element={<SearchResults />} />
      <Route path="/company-dashboard/:companyName" element={<CompanyDashboard />} />
      <Route path="/investigate/:deviceId" element={<Investigation />} />
      <Route path="/investigate/:deviceId/network" element={<NetworkAnalysis />} />
      <Route path="/investigate/:deviceId/browsers" element={<BrowserAnalysis />} />
      <Route path="/investigate/:deviceId/files" element={<FilesAndHash />} />
      <Route path="/investigate/:deviceId/security" element={<SecurityEvents />} />
      <Route path="/investigate/:deviceId/sources" element={<DataSourcesCollection />} />
      <Route path="/investigate/:deviceId/system-info" element={<SystemInformation />} />
      
      {/* Original layout with sidebar for legacy pages */}
      <Route path="/*" element={
        <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900">
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
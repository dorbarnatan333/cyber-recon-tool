import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Network, HardDrive, Monitor, Building, FileText, Settings, Database, Info } from 'lucide-react'
import { Button, Card, CardHeader, CardContent } from '@/components/ui'
import StickyHeader, { BreadcrumbItem, SystemInfo } from '@/components/StickyHeader'
import { cn } from '@/lib/utils'

const SecurityEvents: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>()
  const navigate = useNavigate()

  // Create system info for StickyHeader
  const systemInfo: SystemInfo = {
    avatar: 'T',
    name: 'Truth',
    context: 'Security Events Analysis'
  }

  // Create breadcrumbs for StickyHeader
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Investigation', link: `/investigate/${deviceId}` },
    { label: 'Security Events', link: null } // Current page
  ]

  // StickyHeader action handlers
  const handleSave = () => {
    console.log('Saving security events for device:', deviceId)
    alert('Security events saved successfully!')
  }

  const handleExport = (format: 'json' | 'pdf' | 'csv' | 'email') => {
    console.log('Exporting security events as:', format, 'for device:', deviceId)
    alert(`Exporting security events as ${format.toUpperCase()}...`)
  }

  const handleRefresh = () => {
    console.log('Refreshing security events data for device:', deviceId)
    window.location.reload()
  }

  const handleSettings = () => {
    console.log('Opening security settings for device:', deviceId)
    alert('Security settings panel would open here')
  }

  return (
    <>
      {/* Sticky Header */}
      <StickyHeader
        systemInfo={systemInfo}
        breadcrumbs={breadcrumbs}
        onSave={handleSave}
        onExport={handleExport}
        onRefresh={handleRefresh}
        onSettings={handleSettings}
        isLoading={false}
      />

      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 pt-16">
        {/* Dedicated Sidebar for Investigation */}
        <div className="w-64 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-r border-slate-200/60 flex flex-col shadow-lg fixed left-0 top-16 bottom-0 overflow-y-auto">

          {/* Navigation */}
          <nav className="flex-1 p-4 pt-6 space-y-2">
            {[
              { name: 'Overview', href: `/investigate/${deviceId}`, icon: Monitor },
              { name: 'Network Analysis', href: `/investigate/${deviceId}/network`, icon: Network },
              { name: 'Files & Hash', href: `/investigate/${deviceId}/files`, icon: HardDrive },
              { name: 'Security Events', href: `/investigate/${deviceId}/security`, icon: Shield, active: true },
              { name: 'Data Sources', href: `/investigate/${deviceId}/sources`, icon: Database },
              { name: 'System Information', href: `/investigate/${deviceId}/system-info`, icon: Info },
              { name: 'Company Context', href: `/investigate/${deviceId}/company`, icon: Building },
              { name: 'Reports', href: `/investigate/${deviceId}/reports`, icon: FileText },
              { name: 'Settings', href: `/investigate/${deviceId}/settings`, icon: Settings },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.name}
                  onClick={() => !item.active && navigate(item.href)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    item.active
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-gray-50 hover:bg-white/60 dark:hover:bg-gray-700/50 hover:backdrop-blur-lg cursor-pointer'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              )
            })}
          </nav>

          {/* Status Footer */}
          <div className="p-4 border-t border-slate-200/60 dark:border-gray-700/60">
            <div className="backdrop-blur-lg bg-blue-50/80 dark:bg-blue-900/30 rounded-xl p-3 border border-blue-200/50 dark:border-blue-700/40">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-slate-700">Investigation Active</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-gray-400">Device: {deviceId}</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden ml-64">
          <main className="flex-1 overflow-auto p-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-heading text-2xl font-bold text-slate-900 dark:text-gray-50 mb-2">
                  Security Events Analysis
                </h1>
                <p className="text-body-sm text-slate-600 dark:text-gray-300">
                  Monitor security events and incidents for device: {deviceId}
                </p>
              </div>

            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default SecurityEvents
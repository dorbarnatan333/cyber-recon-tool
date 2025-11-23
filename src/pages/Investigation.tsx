import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Monitor, Activity, Shield, Network, Globe, Building, FileText, Settings, HardDrive, Database, Info } from 'lucide-react'
import { Button, Card, CardHeader, CardContent } from '@/components/ui'
import StickyHeader, { BreadcrumbItem, SystemInfo } from '@/components/StickyHeader'
import { cn } from '@/lib/utils'

const Investigation: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>()
  const navigate = useNavigate()

  // Create system info for StickyHeader
  const systemInfo: SystemInfo = {
    avatar: 'T',
    name: 'Truth',
    context: 'Investigation Overview'
  }

  // Create breadcrumbs for StickyHeader
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Investigation', link: null } // Current page
  ]

  // StickyHeader action handlers
  const handleSave = () => {
    console.log('Saving investigation for device:', deviceId)
    alert('Investigation saved successfully!')
  }

  const handleExport = (format: 'json' | 'pdf' | 'csv' | 'email') => {
    console.log('Exporting investigation as:', format, 'for device:', deviceId)
    alert(`Exporting investigation as ${format.toUpperCase()}...`)
  }

  const handleRefresh = () => {
    console.log('Refreshing investigation data for device:', deviceId)
    window.location.reload()
  }

  const handleSettings = () => {
    console.log('Opening settings for device:', deviceId)
    alert('Settings panel would open here')
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
            { name: 'Overview', href: `/investigate/${deviceId}`, icon: Monitor, active: true },
            { name: 'Network Analysis', href: `/investigate/${deviceId}/network`, icon: Network },
            { name: 'Browser Analysis', href: `/investigate/${deviceId}/browsers`, icon: Globe },
            { name: 'Files & Hash', href: `/investigate/${deviceId}/files`, icon: HardDrive },
            { name: 'Security Events', href: `/investigate/${deviceId}/security`, icon: Shield },
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
                Device Investigation Overview
              </h1>
              <p className="text-body-sm text-slate-600 dark:text-gray-300">
                Deep analysis and investigation tools for device: {deviceId}
              </p>
            </div>

            {/* Placeholder Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card variant="glass">
                <CardHeader>
                  <h2 className="text-heading text-h4 font-semibold text-slate-900 dark:text-gray-50">
                    🚧 Investigation Tools
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 backdrop-blur-xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-800/40 rounded-xl">
                      <h3 className="text-body font-medium text-blue-700 dark:text-blue-300 mb-2">Coming in Next Phase</h3>
                      <ul className="space-y-2 text-body-sm text-slate-600 dark:text-gray-300">
                        <li>• Real-time system monitoring</li>
                        <li>• Network traffic analysis</li>
                        <li>• File system investigation</li>
                        <li>• Process and service analysis</li>
                        <li>• User activity timeline</li>
                        <li>• Security event correlation</li>
                      </ul>
                    </div>
                    
                    <Button variant="secondary" disabled className="w-full backdrop-blur-lg bg-white/20 dark:bg-gray-800/40 border border-slate-300/50 dark:border-gray-600/50">
                      <Activity className="w-4 h-4 mr-2" />
                      Start Deep Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card variant="glass">
                <CardHeader>
                  <h2 className="text-heading text-h4 font-semibold text-slate-900 dark:text-gray-50">
                    📊 Investigation Scope
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 backdrop-blur-xl bg-white/70 dark:bg-gray-800/60 border border-slate-200/60 dark:border-gray-700/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                        <Monitor className="w-8 h-8 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
                        <p className="text-body-sm font-medium text-slate-700 dark:text-gray-200">System Analysis</p>
                      </div>
                      <div className="text-center p-4 backdrop-blur-xl bg-white/70 dark:bg-gray-800/60 border border-slate-200/60 dark:border-gray-700/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                        <Network className="w-8 h-8 text-green-500 dark:text-green-400 mx-auto mb-2" />
                        <p className="text-body-sm font-medium text-slate-700 dark:text-gray-200">Network Forensics</p>
                      </div>
                      <div className="text-center p-4 backdrop-blur-xl bg-white/70 dark:bg-gray-800/60 border border-slate-200/60 dark:border-gray-700/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                        <Shield className="w-8 h-8 text-red-500 dark:text-red-400 mx-auto mb-2" />
                        <p className="text-body-sm font-medium text-slate-700 dark:text-gray-200">Security Events</p>
                      </div>
                      <div className="text-center p-4 backdrop-blur-xl bg-white/70 dark:bg-gray-800/60 border border-slate-200/60 dark:border-gray-700/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                        <Building className="w-8 h-8 text-purple-500 dark:text-purple-400 mx-auto mb-2" />
                        <p className="text-body-sm font-medium text-slate-700 dark:text-gray-200">Company Context</p>
                      </div>
                    </div>
                    
                    <div className="p-4 backdrop-blur-lg bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-700/40 rounded-xl">
                      <p className="text-body-sm text-amber-700 dark:text-amber-300 text-center font-medium">
                        Comprehensive investigation tools will be available in the next development phase
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <Card variant="solid">
                <CardHeader>
                  <h2 className="text-heading text-h4 font-semibold text-slate-900 dark:text-gray-50">
                    Quick Actions
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Button variant="secondary" disabled>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="secondary" disabled>
                      <Shield className="w-4 h-4 mr-2" />
                      Security Scan
                    </Button>
                    <Button variant="secondary" disabled>
                      <Network className="w-4 h-4 mr-2" />
                      Network Trace
                    </Button>
                    <Button 
                      variant="primary"
                      onClick={() => navigate('/search/results')}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Search Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
    </>
  )
}

export default Investigation
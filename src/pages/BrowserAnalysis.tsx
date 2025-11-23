import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Globe, Network, Monitor, HardDrive, Shield, Database, Info, Building, FileText, Settings, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { cn } from '@/lib/utils'
import StickyHeader, { BreadcrumbItem, EndpointStatus, SystemInfo } from '@/components/StickyHeader'
import { InstalledBrowsers } from '@/components/BrowserAnalysis/InstalledBrowsers'
import { BrowserActivityTimeline } from '@/components/BrowserAnalysis/BrowserActivityTimeline'
import { BrowsingHistory } from '@/components/BrowserAnalysis/BrowsingHistory'
import { TopVisitedPages } from '@/components/BrowserAnalysis/TopVisitedPages'
import { DownloadsHistory } from '@/components/BrowserAnalysis/DownloadsHistory'
import { ExtensionsAddons } from '@/components/BrowserAnalysis/ExtensionsAddons'
import { BookmarksFavorites } from '@/components/BrowserAnalysis/BookmarksFavorites'
import { SavedCredentials } from '@/components/BrowserAnalysis/SavedCredentials'
import { SecurityArtifacts } from '@/components/BrowserAnalysis/SecurityArtifacts'
import { generateBrowserAnalysisMockData, BrowserAnalysisData } from '@/data/mockBrowserData'
import '../styles/design-system.css'

const BrowserAnalysis: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>()
  const navigate = useNavigate()

  const [browserData, setBrowserData] = useState<BrowserAnalysisData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load browser data
  useEffect(() => {
    if (deviceId) {
      setIsLoading(true)
      setError(null)

      setTimeout(() => {
        try {
          const mockData = generateBrowserAnalysisMockData(deviceId)
          setBrowserData(mockData)
          setIsLoading(false)
        } catch (err) {
          console.error('Failed to load browser data:', err)
          setError('Failed to load browser analysis data. Please try again.')
          setIsLoading(false)
        }
      }, 1500)
    }
  }, [deviceId])

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} day${days > 1 ? 's' : ''} ago`
    }
  }

  const systemInfo: SystemInfo = {
    avatar: 'T',
    name: 'Truth',
    context: 'Browser Analysis'
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Investigation', link: `/investigate/${deviceId}` },
    { label: 'Browser Analysis', link: null }
  ]

  const getEndpointStatus = (): EndpointStatus | undefined => {
    if (!browserData?.endpoint) return undefined

    const lastSeenTime = new Date(browserData.endpoint.last_seen)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - lastSeenTime.getTime()) / (1000 * 60))

    if (diffMinutes < 5) {
      return {
        type: 'active',
        label: 'Active',
        lastSeen: formatTimeAgo(browserData.endpoint.last_seen)
      }
    } else if (diffMinutes < 30) {
      return {
        type: 'recent',
        label: 'Recently Active',
        lastSeen: formatTimeAgo(browserData.endpoint.last_seen)
      }
    } else if (diffMinutes < 1440) {
      return {
        type: 'inactive',
        label: 'Inactive',
        lastSeen: formatTimeAgo(browserData.endpoint.last_seen)
      }
    } else {
      return {
        type: 'offline',
        label: 'Offline',
        lastSeen: formatTimeAgo(browserData.endpoint.last_seen)
      }
    }
  }

  const handleSave = () => {
    console.log('Saving investigation for device:', deviceId)
    alert('Investigation saved successfully!')
  }

  const handleExport = (format: 'json' | 'pdf' | 'csv' | 'email') => {
    if (!browserData) {
      alert('No data available to export')
      return
    }

    try {
      if (format === 'json') {
        // Export as JSON
        const dataStr = JSON.stringify(browserData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `browser-analysis-${deviceId}-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        alert('JSON export complete!')
      } else if (format === 'csv') {
        // Export browsing history as CSV
        const csvData = [
          ['Browser', 'Profile', 'Title', 'URL', 'Visit Count', 'Last Visit', 'Flagged'],
          ...browserData.history_entries.map(entry => [
            entry.browser,
            entry.profile,
            entry.title,
            entry.url,
            entry.visit_count.toString(),
            entry.last_visit,
            entry.flagged ? 'Yes' : 'No'
          ])
        ]
        const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
        const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(csvBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `browser-history-${deviceId}-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        alert('CSV export complete!')
      } else if (format === 'pdf') {
        // PDF export would require a library like jsPDF
        alert('PDF export functionality requires jsPDF library integration. Coming soon!')
      } else if (format === 'email') {
        // Email export would open mail client
        const subject = encodeURIComponent(`Browser Analysis Report - ${deviceId}`)
        const body = encodeURIComponent(`Browser Analysis Report for ${browserData.endpoint.hostname}\n\nGenerated: ${new Date().toLocaleString()}\n\nBrowsers: ${browserData.browsers.length}\nHistory Entries: ${browserData.history_entries.length}\nDownloads: ${browserData.downloads.length}\nExtensions: ${browserData.extensions.length}\nSuspicious Activities: ${browserData.suspicious_activities.length}`)
        window.location.href = `mailto:?subject=${subject}&body=${body}`
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  const handleSettings = () => {
    console.log('Opening settings for device:', deviceId)
    alert('Settings panel would open here')
  }

  if (!deviceId) {
    navigate('/search/results')
    return null
  }

  const LoadingContent = () => (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="flex space-x-2 justify-center mb-6">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <h2 className="text-lg font-medium text-slate-900 dark:text-gray-50 mb-2">
          Loading Browser Analysis
        </h2>
        <p className="text-sm text-slate-600 dark:text-gray-400">
          Analyzing browser data for {deviceId}...
        </p>
      </div>
    </div>
  )

  const ErrorContent = () => (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="text-lg font-medium text-slate-900 dark:text-gray-50 mb-2">
          Failed to Load Data
        </h2>
        <p className="text-sm text-slate-600 dark:text-gray-400 mb-6">
          {error || 'An error occurred while loading browser analysis data.'}
        </p>
        <button
          onClick={() => {
            setError(null)
            handleRefresh()
          }}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
          aria-label="Retry loading data"
        >
          Try Again
        </button>
      </div>
    </div>
  )

  return (
    <>
      <StickyHeader
        systemInfo={systemInfo}
        breadcrumbs={breadcrumbs}
        endpointStatus={getEndpointStatus()}
        onSave={handleSave}
        onExport={handleExport}
        onRefresh={handleRefresh}
        onSettings={handleSettings}
        isLoading={isLoading}
      />

      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 pt-16">
        {/* Dedicated Sidebar for Investigation */}
        <div className="w-64 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-r border-slate-200/60 flex flex-col shadow-lg fixed left-0 top-16 bottom-0 overflow-y-auto">
          <nav className="flex-1 p-4 pt-6 space-y-2" aria-label="Investigation navigation">
            {[
              { name: 'Overview', href: `/investigate/${deviceId}`, icon: Monitor },
              { name: 'Network Analysis', href: `/investigate/${deviceId}/network`, icon: Network },
              { name: 'Browser Analysis', href: `/investigate/${deviceId}/browsers`, icon: Globe, active: true },
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
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !item.active) {
                      e.preventDefault()
                      navigate(item.href)
                    }
                  }}
                  role="button"
                  tabIndex={item.active ? -1 : 0}
                  aria-current={item.active ? 'page' : undefined}
                  aria-label={`Navigate to ${item.name}`}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    item.active
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-gray-50 hover:bg-white/60 dark:hover:bg-gray-700/50 hover:backdrop-blur-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  )}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  <span>{item.name}</span>
                </div>
              )
            })}
          </nav>

          <div className="p-4 border-t border-slate-200/60 dark:border-gray-700/60">
            <div className="backdrop-blur-lg bg-blue-50/80 dark:bg-blue-900/30 rounded-xl p-3 border border-blue-200/50 dark:border-blue-700/40">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-slate-700 dark:text-gray-300">Analysis Active</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-gray-400">Device: {deviceId}</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden ml-64">
          <main className="flex-1 overflow-auto p-6 relative min-h-screen" role="main" aria-label="Browser Analysis Content">
            {isLoading ? (
              <LoadingContent />
            ) : error ? (
              <ErrorContent />
            ) : browserData ? (
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Page Header */}
                <div className="mb-8">
                  <h1 className="text-heading text-2xl font-bold text-slate-900 dark:text-gray-50 mb-2">
                    Browser Analysis: {browserData.endpoint.hostname}
                  </h1>
                  <p className="text-body-sm text-slate-600 dark:text-gray-300">
                    Comprehensive browser activity and security analysis for {browserData.endpoint.type.toLowerCase()} endpoint
                  </p>
                </div>

                {/* Endpoint Summary */}
                <Card variant="glass">
                  <CardHeader>
                    <h2 className="text-heading text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center">
                      <Monitor className="w-5 h-5 mr-2 text-blue-500" />
                      Endpoint Summary
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</label>
                        <p className="text-sm font-medium text-slate-900 dark:text-gray-50 mt-1">{browserData.endpoint.type}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hostname</label>
                        <p className="text-sm font-medium text-slate-900 dark:text-gray-50 mt-1">{browserData.endpoint.hostname}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">IP Address</label>
                        <p className="text-sm font-medium text-slate-900 dark:text-gray-50 mt-1">{browserData.endpoint.current_ip}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">OS</label>
                        <p className="text-sm font-medium text-slate-900 dark:text-gray-50 mt-1">{browserData.endpoint.os}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Suspicious Activities Alert (if any) */}
                {browserData.suspicious_activities.length > 0 && (
                  <Card variant="solid" className="border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
                    <CardHeader>
                      <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Suspicious Activities ({browserData.suspicious_activities.length})
                      </h2>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {browserData.suspicious_activities.map((activity) => (
                          <div
                            key={activity.id}
                            className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 border border-red-200 dark:border-red-700"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-red-700 dark:text-red-400">{activity.description}</h3>
                              <span className={cn(
                                'px-2 py-1 rounded-full text-xs font-medium',
                                activity.severity === 'critical'
                                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                  : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                              )}>
                                {activity.severity.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-sm text-slate-600 dark:text-gray-400">
                              <span className="capitalize">{activity.browser}</span> • {formatTimeAgo(activity.timestamp)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Installed Browsers */}
                <InstalledBrowsers browsers={browserData.browsers} />

                {/* Browser Activity Timeline */}
                <BrowserActivityTimeline data={browserData.timeline_data} />

                {/* Browsing History */}
                <BrowsingHistory entries={browserData.history_entries} />

                {/* Top Visited Pages */}
                <TopVisitedPages entries={browserData.history_entries} />

                {/* Downloads History */}
                <DownloadsHistory downloads={browserData.downloads} />

                {/* Extensions & Add-ons */}
                <ExtensionsAddons extensions={browserData.extensions} />

                {/* Bookmarks & Favorites */}
                <BookmarksFavorites bookmarks={browserData.bookmarks} />

                {/* Saved Credentials */}
                <SavedCredentials credentials={browserData.saved_credentials} />

                {/* Security Artifacts */}
                <SecurityArtifacts data={browserData.security_artifacts} />
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-gray-400">
                No data available
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}

export default BrowserAnalysis

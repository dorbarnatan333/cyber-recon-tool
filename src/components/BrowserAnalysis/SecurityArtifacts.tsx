import React, { useState } from 'react'
import { Shield, CreditCard, Cookie, Database, X } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { SecurityArtifacts as SecurityArtifactsType } from '@/data/mockBrowserData'
import { cn } from '@/lib/utils'

interface SecurityArtifactsProps {
  data: SecurityArtifactsType
}

type ModalType = 'autofill' | 'cookies' | 'cache' | null

export const SecurityArtifacts: React.FC<SecurityArtifactsProps> = ({ data }) => {
  const [openModal, setOpenModal] = useState<ModalType>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days < 1) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  // Generate mock detailed data for modals
  const getAutofillMockData = () => [
    { id: 1, type: 'Address', name: 'Home Address', details: '123 Main St, City, State 12345', lastUsed: '2 days ago' },
    { id: 2, type: 'Address', name: 'Work Address', details: '456 Office Blvd, Suite 789, City, State 67890', lastUsed: '5 days ago' },
    { id: 3, type: 'Address', name: 'Shipping Address', details: '789 Delivery Ln, City, State 13579', lastUsed: '12 days ago' },
    { id: 4, type: 'Credit Card', name: 'Visa ****1234', details: 'Expires: 12/2026', lastUsed: '1 day ago' },
    { id: 5, type: 'Credit Card', name: 'Mastercard ****5678', details: 'Expires: 08/2025', lastUsed: '7 days ago' },
    { id: 6, type: 'Phone', name: 'Mobile', details: '(555) 123-4567', lastUsed: '3 days ago' },
    { id: 7, type: 'Phone', name: 'Work', details: '(555) 987-6543', lastUsed: '10 days ago' },
  ]

  const getCookiesMockData = () => [
    { id: 1, domain: 'google.com', name: 'NID', type: 'Persistent', tracking: true, expires: '6 months' },
    { id: 2, domain: 'facebook.com', name: 'fr', type: 'Persistent', tracking: true, expires: '3 months' },
    { id: 3, domain: 'github.com', name: 'user_session', type: 'Session', tracking: false, expires: 'Session' },
    { id: 4, domain: 'linkedin.com', name: 'lidc', type: 'Persistent', tracking: true, expires: '1 day' },
    { id: 5, domain: 'stackoverflow.com', name: 'prov', type: 'Persistent', tracking: false, expires: '1 year' },
    { id: 6, domain: 'youtube.com', name: 'VISITOR_INFO1_LIVE', type: 'Persistent', tracking: true, expires: '6 months' },
    { id: 7, domain: 'twitter.com', name: 'personalization_id', type: 'Persistent', tracking: true, expires: '2 years' },
    { id: 8, domain: 'reddit.com', name: 'session_tracker', type: 'Session', tracking: false, expires: 'Session' },
    { id: 9, domain: 'amazon.com', name: 'session-id', type: 'Session', tracking: false, expires: 'Session' },
    { id: 10, domain: 'netflix.com', name: 'SecureNetflixId', type: 'Persistent', tracking: false, expires: '1 year' },
  ]

  const getCacheMockData = () => [
    { id: 1, url: 'https://cdn.example.com/script.js', type: 'JavaScript', size: '245 KB', cached: '2 hours ago' },
    { id: 2, url: 'https://cdn.example.com/styles.css', type: 'Stylesheet', size: '156 KB', cached: '1 day ago' },
    { id: 3, url: 'https://images.example.com/logo.png', type: 'Image', size: '45 KB', cached: '3 days ago' },
    { id: 4, url: 'https://fonts.googleapis.com/font.woff2', type: 'Font', size: '89 KB', cached: '5 days ago' },
    { id: 5, url: 'https://cdn.example.com/bundle.js', type: 'JavaScript', size: '1.2 MB', cached: '1 hour ago' },
    { id: 6, url: 'https://api.example.com/data.json', type: 'JSON', size: '34 KB', cached: '30 minutes ago' },
    { id: 7, url: 'https://images.example.com/hero.jpg', type: 'Image', size: '678 KB', cached: '2 days ago' },
    { id: 8, url: 'https://cdn.example.com/analytics.js', type: 'JavaScript', size: '123 KB', cached: '4 hours ago' },
  ]

  const renderModal = () => {
    if (!openModal) return null

    let title = ''
    let content = null

    switch (openModal) {
      case 'autofill':
        title = 'Autofill Data Details'
        const autofillData = getAutofillMockData()
        content = (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700 dark:text-gray-300">Type</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700 dark:text-gray-300">Name</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700 dark:text-gray-300">Details</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700 dark:text-gray-300">Last Used</th>
                </tr>
              </thead>
              <tbody>
                {autofillData.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/50">
                    <td className="py-2 px-3 text-sm">
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        item.type === 'Address' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
                        item.type === 'Credit Card' && 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
                        item.type === 'Phone' && 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      )}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-sm text-slate-900 dark:text-gray-50 font-medium">{item.name}</td>
                    <td className="py-2 px-3 text-sm text-slate-600 dark:text-gray-400">{item.details}</td>
                    <td className="py-2 px-3 text-sm text-slate-600 dark:text-gray-400">{item.lastUsed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        break

      case 'cookies':
        title = 'Cookies Details'
        const cookiesData = getCookiesMockData()
        content = (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700 dark:text-gray-300">Domain</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700 dark:text-gray-300">Name</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700 dark:text-gray-300">Type</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700 dark:text-gray-300">Tracking</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700 dark:text-gray-300">Expires</th>
                </tr>
              </thead>
              <tbody>
                {cookiesData.map((cookie) => (
                  <tr key={cookie.id} className="border-b border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/50">
                    <td className="py-2 px-3 text-sm text-slate-900 dark:text-gray-50 font-medium">{cookie.domain}</td>
                    <td className="py-2 px-3 text-sm text-slate-600 dark:text-gray-400 font-mono">{cookie.name}</td>
                    <td className="py-2 px-3 text-sm">
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        cookie.type === 'Session'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                      )}>
                        {cookie.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-sm">
                      {cookie.tracking ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                          Yes
                        </span>
                      ) : (
                        <span className="text-slate-500 dark:text-gray-500">No</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-sm text-slate-600 dark:text-gray-400">{cookie.expires}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        break

      case 'cache':
        title = 'Cache Details'
        const cacheData = getCacheMockData()
        content = (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700 dark:text-gray-300">URL</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700 dark:text-gray-300">Type</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700 dark:text-gray-300">Size</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700 dark:text-gray-300">Cached</th>
                </tr>
              </thead>
              <tbody>
                {cacheData.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/50">
                    <td className="py-2 px-3 text-sm text-slate-900 dark:text-gray-50 truncate max-w-xs">{item.url}</td>
                    <td className="py-2 px-3 text-sm">
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        item.type === 'JavaScript' && 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
                        item.type === 'Stylesheet' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
                        item.type === 'Image' && 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
                        item.type === 'Font' && 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
                        item.type === 'JSON' && 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                      )}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-sm text-slate-600 dark:text-gray-400 font-medium">{item.size}</td>
                    <td className="py-2 px-3 text-sm text-slate-600 dark:text-gray-400">{item.cached}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        break
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setOpenModal(null)}>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-50">{title}</h3>
            <button
              onClick={() => setOpenModal(null)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            {content}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Card variant="glass">
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-500" />
            Security Artifacts
          </h2>
        </CardHeader>
        <CardContent>
          {/* Grid of artifact cards - 1x3 layout */}
          <div className="grid grid-cols-3 gap-4">
            {/* Autofill Data */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-slate-200/60 dark:border-gray-700/60">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-gray-50">Autofill Data</h3>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-gray-400">Addresses:</span>
                  <span className="font-semibold text-slate-900 dark:text-gray-50">
                    {data.autofill_data.addresses}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-gray-400">Credit cards:</span>
                  <span className="font-semibold text-slate-900 dark:text-gray-50">
                    {data.autofill_data.credit_cards}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-gray-400">Phone numbers:</span>
                  <span className="font-semibold text-slate-900 dark:text-gray-50">
                    {data.autofill_data.phone_numbers}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setOpenModal('autofill')}
                className="mt-3 w-full text-center text-xs text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                View Details
              </button>
            </div>

            {/* Cookies */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-slate-200/60 dark:border-gray-700/60">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Cookie className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-gray-50">Cookies</h3>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-gray-400">Total:</span>
                  <span className="font-semibold text-slate-900 dark:text-gray-50">
                    {data.cookies.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-gray-400">Third-party:</span>
                  <span className="font-semibold text-slate-900 dark:text-gray-50">
                    {data.cookies.third_party.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-gray-400">Tracking:</span>
                  <span className={cn(
                    'font-semibold',
                    data.cookies.tracking > 500
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-green-600 dark:text-green-400'
                  )}>
                    {Math.round((data.cookies.tracking / data.cookies.total) * 100)}%
                  </span>
                </div>
              </div>

              <button
                onClick={() => setOpenModal('cookies')}
                className="mt-3 w-full text-center text-xs text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                View Details
              </button>
            </div>

            {/* Cache */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-slate-200/60 dark:border-gray-700/60">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-gray-50">Cache</h3>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-gray-400">Size:</span>
                  <span className="font-semibold text-slate-900 dark:text-gray-50">
                    {formatFileSize(data.cache.total_size)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-gray-400">Entries:</span>
                  <span className="font-semibold text-slate-900 dark:text-gray-50">
                    {data.cache.entries.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-gray-400">Last cleared:</span>
                  <span className="font-semibold text-slate-900 dark:text-gray-50">
                    {formatTimeAgo(data.cache.last_cleared)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setOpenModal('cache')}
                className="mt-3 w-full text-center text-xs text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700 dark:text-blue-400">
                <strong>Privacy Notice:</strong> Actual sensitive data (passwords, credit card numbers) are never displayed.
                Only metadata and security indicators are shown for forensic analysis.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {renderModal()}
    </>
  )
}

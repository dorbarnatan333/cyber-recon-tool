import React, { useState, useMemo } from 'react'
import { Puzzle, Search, AlertTriangle, Shield, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardHeader, CardContent, Badge } from '@/components/ui'
import { Extension } from '@/data/mockBrowserData'
import { cn } from '@/lib/utils'

interface ExtensionsAddonsProps {
  extensions: Extension[]
}

export const ExtensionsAddons: React.FC<ExtensionsAddonsProps> = ({ extensions }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrowser, setSelectedBrowser] = useState<string>('all')
  const [riskFilter, setRiskFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expandedExtension, setExpandedExtension] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter extensions
  const filteredExtensions = useMemo(() => {
    return extensions.filter(ext => {
      const matchesSearch = searchTerm === '' ||
        ext.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ext.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesBrowser = selectedBrowser === 'all' || ext.browser === selectedBrowser
      const matchesRisk = riskFilter === 'all' || ext.risk_level === riskFilter
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'enabled' && ext.enabled) ||
        (statusFilter === 'disabled' && !ext.enabled)

      return matchesSearch && matchesBrowser && matchesRisk && matchesStatus
    })
  }, [extensions, searchTerm, selectedBrowser, riskFilter, statusFilter])

  // Get unique browsers
  const browsers = Array.from(new Set(extensions.map(e => e.browser)))

  // Count enabled/disabled
  const enabledCount = filteredExtensions.filter(e => e.enabled).length
  const disabledCount = filteredExtensions.filter(e => !e.enabled).length

  // Pagination
  const totalPages = Math.ceil(filteredExtensions.length / itemsPerPage)
  const paginatedExtensions = filteredExtensions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getRiskBadge = (riskLevel: string) => {
    if (riskLevel === 'high') {
      return <Badge variant="danger">HIGH RISK</Badge>
    }
    if (riskLevel === 'medium') {
      return <Badge variant="warning">Medium Risk</Badge>
    }
    return <Badge variant="success">Low Risk</Badge>
  }

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const isDangerousPermission = (permission: string): boolean => {
    const dangerous = ['all_urls', 'clipboardRead', 'clipboardWrite', 'downloads', 'management', 'nativeMessaging']
    return dangerous.some(p => permission.includes(p))
  }

  return (
    <Card variant="glass">
      <CardHeader>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center mb-4">
          <Puzzle className="w-5 h-5 mr-2 text-blue-500" />
          Extensions & Add-ons
        </h2>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search extensions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Browser filter */}
            <select
              value={selectedBrowser}
              onChange={(e) => setSelectedBrowser(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Browsers</option>
              {browsers.map(browser => (
                <option key={browser} value={browser}>
                  {browser.charAt(0).toUpperCase() + browser.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Risk and status filters */}
          <div className="flex items-center space-x-3">
            <div className="text-sm text-slate-600 dark:text-gray-400">Risk:</div>
            <div className="flex space-x-2">
              {['all', 'low', 'medium', 'high'].map((risk) => (
                <button
                  key={risk}
                  onClick={() => setRiskFilter(risk)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-medium transition-all duration-200',
                    riskFilter === risk
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'
                  )}
                >
                  {risk.charAt(0).toUpperCase() + risk.slice(1)}
                </button>
              ))}
            </div>

            <div className="text-sm text-slate-600 dark:text-gray-400 ml-4">Status:</div>
            <div className="flex space-x-2">
              {['all', 'enabled', 'disabled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-medium transition-all duration-200',
                    statusFilter === status
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Extensions table */}
        {filteredExtensions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-gray-400">
            No extensions found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-gray-300">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-gray-300">Version</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-gray-300">Browser</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-gray-300">Developer</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-gray-300">Permissions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedExtensions.map((ext) => (
                    <React.Fragment key={ext.id}>
                      <tr
                        className={cn(
                          'border-b border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors',
                          ext.risk_level === 'high' && 'bg-red-50/30 dark:bg-red-900/5'
                        )}
                      >
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900 dark:text-gray-50 text-sm">
                              {ext.name}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-gray-400 truncate max-w-xs">
                              {ext.description}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-gray-300">
                          v{ext.version}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-gray-300 capitalize">
                          {ext.browser}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-gray-300">
                          {ext.developer}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setExpandedExtension(expandedExtension === ext.id ? null : ext.id)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {expandedExtension === ext.id ? 'Hide' : 'View'} ({ext.permissions.length})
                          </button>
                        </td>
                      </tr>
                      {expandedExtension === ext.id && (
                        <tr className={cn(
                          'border-b border-slate-100 dark:border-gray-800',
                          ext.risk_level === 'high' && 'bg-red-50/30 dark:bg-red-900/5'
                        )}>
                          <td colSpan={5} className="py-4 px-4">
                            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-slate-900 dark:text-gray-50 mb-3">
                                Permissions ({ext.permissions.length})
                              </h4>
                              <div className="space-y-2">
                                {ext.permissions.map((permission, idx) => (
                                  <div
                                    key={idx}
                                    className={cn(
                                      'flex items-center space-x-2 text-sm px-3 py-2 rounded',
                                      isDangerousPermission(permission)
                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                        : 'bg-slate-50 dark:bg-gray-700/50 text-slate-700 dark:text-gray-300'
                                    )}
                                  >
                                    {isDangerousPermission(permission) ? (
                                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                    ) : (
                                      <CheckCircle className="w-4 h-4 flex-shrink-0 text-green-500" />
                                    )}
                                    <span className="font-mono">{permission}</span>
                                  </div>
                                ))}
                              </div>
                              {!ext.from_store && ext.risk_level === 'high' && (
                                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-700">
                                  <div className="flex items-start space-x-2">
                                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <div className="font-medium text-red-700 dark:text-red-400 text-sm">
                                        Security Warning
                                      </div>
                                      <div className="text-xs text-red-600 dark:text-red-500 mt-1">
                                        This extension is not from an official store and has dangerous permissions.
                                        It could access sensitive data including passwords, browsing history, and clipboard content.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-slate-600 dark:text-gray-400">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredExtensions.length)} of{' '}
                  {filteredExtensions.length} extensions
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={cn(
                      'px-3 py-1 rounded-md text-sm font-medium transition-all duration-200',
                      currentPage === 1
                        ? 'bg-slate-100 dark:bg-gray-700 text-slate-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'
                    )}
                  >
                    Previous
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            'w-8 h-8 rounded-md text-sm font-medium transition-all duration-200',
                            currentPage === pageNum
                              ? 'bg-blue-500 text-white shadow-md'
                              : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'
                          )}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={cn(
                      'px-3 py-1 rounded-md text-sm font-medium transition-all duration-200',
                      currentPage === totalPages
                        ? 'bg-slate-100 dark:bg-gray-700 text-slate-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'
                    )}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-gray-700">
              <div className="text-sm text-slate-600 dark:text-gray-400">
                Total: {filteredExtensions.length} extensions ({enabledCount} enabled, {disabledCount} disabled)
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

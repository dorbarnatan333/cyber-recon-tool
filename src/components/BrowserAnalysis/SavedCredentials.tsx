import React, { useState, useMemo } from 'react'
import { Key, Search, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardHeader, CardContent, Badge } from '@/components/ui'
import { SavedCredential } from '@/data/mockBrowserData'
import { cn } from '@/lib/utils'

interface SavedCredentialsProps {
  credentials: SavedCredential[]
}

export const SavedCredentials: React.FC<SavedCredentialsProps> = ({ credentials }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [strengthFilter, setStrengthFilter] = useState<string>('all')
  const [browserFilter, setBrowserFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter credentials
  const filteredCredentials = useMemo(() => {
    return credentials.filter(cred => {
      const matchesSearch = searchTerm === '' ||
        cred.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cred.username.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStrength = strengthFilter === 'all' || cred.password_strength === strengthFilter
      const matchesBrowser = browserFilter === 'all' || cred.browser === browserFilter

      return matchesSearch && matchesStrength && matchesBrowser
    })
  }, [credentials, searchTerm, strengthFilter, browserFilter])

  // Pagination
  const totalPages = Math.ceil(filteredCredentials.length / itemsPerPage)
  const paginatedCredentials = filteredCredentials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Get unique browsers
  const browsers = Array.from(new Set(credentials.map(c => c.browser)))

  // Statistics
  const stats = useMemo(() => {
    return {
      total: credentials.length,
      weak: credentials.filter(c => c.password_strength === 'weak').length,
      medium: credentials.filter(c => c.password_strength === 'medium').length,
      strong: credentials.filter(c => c.password_strength === 'strong').length,
      duplicates: credentials.filter(c => c.is_duplicate).length
    }
  }, [credentials])

  const extractDomain = (url: string): string => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname
    } catch {
      return url
    }
  }

  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days < 1) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 30) return `${days} days ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`
    const years = Math.floor(days / 365)
    return `${years} year${years > 1 ? 's' : ''} ago`
  }

  const getStrengthBadge = (strength: 'weak' | 'medium' | 'strong') => {
    switch (strength) {
      case 'weak':
        return <Badge variant="danger">Weak</Badge>
      case 'medium':
        return <Badge variant="warning">Medium</Badge>
      case 'strong':
        return <Badge variant="success">Strong</Badge>
    }
  }

  const getStrengthIcon = (strength: 'weak' | 'medium' | 'strong') => {
    switch (strength) {
      case 'weak':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'strong':
        return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  return (
    <Card variant="glass">
      <CardHeader>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center mb-4">
          <Key className="w-5 h-5 mr-2 text-blue-500" />
          Saved Credentials
        </h2>


        {/* Filters */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative" style={{ width: '300px' }}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by URL or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Strength filter */}
          <select
            value={strengthFilter}
            onChange={(e) => {
              setStrengthFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Strengths</option>
            <option value="weak">Weak</option>
            <option value="medium">Medium</option>
            <option value="strong">Strong</option>
          </select>

          {/* Browser filter */}
          <select
            value={browserFilter}
            onChange={(e) => {
              setBrowserFilter(e.target.value)
              setCurrentPage(1)
            }}
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
      </CardHeader>

      <CardContent>

        {/* Table */}
        {filteredCredentials.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-gray-400">
            No credentials found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-gray-300">Website</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-gray-300">Username</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-gray-300">Password</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-gray-300">Strength</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-gray-300">Browser</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-gray-300">Last Used</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCredentials.map((cred) => (
                    <tr
                      key={cred.id}
                      className={cn(
                        'border-b border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors',
                        cred.password_strength === 'weak' && 'bg-red-50/30 dark:bg-red-900/5'
                      )}
                    >
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900 dark:text-gray-50 text-sm">
                            {extractDomain(cred.url)}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-gray-400 truncate max-w-xs">
                            {cred.url}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-700 dark:text-gray-300">
                        {cred.username}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm text-slate-900 dark:text-gray-50">
                          {cred.password}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getStrengthIcon(cred.password_strength)}
                          {getStrengthBadge(cred.password_strength)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-700 dark:text-gray-300 capitalize">
                        {cred.browser}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-700 dark:text-gray-300">
                        {formatTimeAgo(cred.last_used)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-gray-400">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCredentials.length)} of {filteredCredentials.length} credentials
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={cn(
                      'px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200',
                      currentPage === 1
                        ? 'bg-slate-100 dark:bg-gray-800 text-slate-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    )}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-700 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={cn(
                      'px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200',
                      currentPage === totalPages
                        ? 'bg-slate-100 dark:bg-gray-800 text-slate-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    )}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

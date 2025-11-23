import React, { useState, useMemo } from 'react'
import { History, Search, AlertTriangle, Chrome, Globe, ExternalLink, ChevronDown, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Calendar as CalendarIcon, X } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { HistoryEntry } from '@/data/mockBrowserData'
import { cn } from '@/lib/utils'

interface BrowsingHistoryProps {
  entries: HistoryEntry[]
}

export const BrowsingHistory: React.FC<BrowsingHistoryProps> = ({ entries }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrowser, setSelectedBrowser] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'custom'>('7d')
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [sortColumn, setSortColumn] = useState<'browser' | 'title' | 'url' | 'visits' | 'last_visit' | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const itemsPerPage = 10

  // Filter entries
  const filteredEntries = useMemo(() => {
    let filtered = entries.filter(entry => {
      const matchesSearch = searchTerm === '' ||
        entry.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.title.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesBrowser = selectedBrowser === 'all' || entry.browser === selectedBrowser

      const entryDate = new Date(entry.visit_time)
      const now = new Date()
      const hoursDiff = (now.getTime() - entryDate.getTime()) / (1000 * 60 * 60)

      let matchesTimeRange = true
      if (timeRange === 'custom' && customStartDate && customEndDate) {
        const start = new Date(customStartDate)
        const end = new Date(customEndDate)
        matchesTimeRange = entryDate >= start && entryDate <= end
      } else if (timeRange === '24h') {
        matchesTimeRange = hoursDiff <= 24
      } else if (timeRange === '7d') {
        matchesTimeRange = hoursDiff <= 24 * 7
      } else if (timeRange === '30d') {
        matchesTimeRange = hoursDiff <= 24 * 30
      }

      return matchesSearch && matchesBrowser && matchesTimeRange
    })

    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any
        let bValue: any

        switch (sortColumn) {
          case 'browser':
            aValue = a.browser
            bValue = b.browser
            break
          case 'title':
            aValue = a.title
            bValue = b.title
            break
          case 'url':
            aValue = a.url
            bValue = b.url
            break
          case 'visits':
            aValue = a.visit_count
            bValue = b.visit_count
            break
          case 'last_visit':
            aValue = new Date(a.last_visit).getTime()
            bValue = new Date(b.last_visit).getTime()
            break
          default:
            return 0
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue
      })
    }

    return filtered
  }, [entries, searchTerm, selectedBrowser, timeRange, customStartDate, customEndDate, sortColumn, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage)
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Get unique browsers
  const browsers = Array.from(new Set(entries.map(e => e.browser)))

  const getBrowserIcon = (browser: string) => {
    switch (browser.toLowerCase()) {
      case 'chrome':
        return <Chrome className="w-4 h-4 text-blue-500" />
      case 'edge':
        return <Globe className="w-4 h-4 text-blue-600" />
      case 'firefox':
        return <Globe className="w-4 h-4 text-orange-500" />
      default:
        return <Globe className="w-4 h-4 text-gray-500" />
    }
  }

  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  const toggleRow = (entryId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(entryId)) {
        newSet.delete(entryId)
      } else {
        newSet.add(entryId)
      }
      return newSet
    })
  }

  const handleSort = (column: 'browser' | 'title' | 'url' | 'visits' | 'last_visit') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  const getSortIcon = (column: 'browser' | 'title' | 'url' | 'visits' | 'last_visit') => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />
    }
    return sortDirection === 'asc'
      ? <ArrowUp className="w-3 h-3 ml-1" />
      : <ArrowDown className="w-3 h-3 ml-1" />
  }

  const handleTimeRangeChange = (range: '24h' | '7d' | '30d' | 'custom') => {
    setTimeRange(range)
    if (range === 'custom') {
      setShowCustomPicker(true)
    } else {
      setShowCustomPicker(false)
    }
    setCurrentPage(1)
  }

  const handleApplyCustomRange = () => {
    if (customStartDate && customEndDate) {
      const start = new Date(customStartDate)
      const end = new Date(customEndDate)
      if (start > end) {
        alert('Start date must be before end date')
        return
      }
      setShowCustomPicker(false)
    }
  }

  return (
    <Card variant="glass">
      <CardHeader>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center mb-4">
          <History className="w-5 h-5 mr-2 text-blue-500" />
          Browsing History
        </h2>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative" style={{ width: '300px' }}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search URLs, titles..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Browser filter */}
            <select
              value={selectedBrowser}
              onChange={(e) => {
                setSelectedBrowser(e.target.value)
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

          {/* Time range */}
          <div className="flex space-x-2">
            {(['24h', '7d', '30d', 'custom'] as const).map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={cn(
                  'px-3 py-1 rounded-md text-xs font-medium transition-all duration-200',
                  timeRange === range
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'
                )}
              >
                {range === '24h' ? 'Last 24h' : range === '7d' ? 'Last 7d' : range === '30d' ? 'Last 30d' : 'Custom'}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Custom Date Picker */}
        {showCustomPicker && (
          <div className="mb-4 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-slate-200/60 dark:border-gray-700/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-gray-50">Custom Date Range</h3>
              </div>
              <button
                onClick={() => setShowCustomPicker(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close date picker"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  max={customEndDate || undefined}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-md text-sm text-slate-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  min={customStartDate || undefined}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-md text-sm text-slate-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleApplyCustomRange}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors duration-200"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          {paginatedEntries.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-gray-400">
              No history entries found
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider w-8"></th>
                  <th
                    className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-slate-900 dark:hover:text-gray-50 transition-colors"
                    onClick={() => handleSort('browser')}
                  >
                    <div className="flex items-center">
                      Browser
                      {getSortIcon('browser')}
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-slate-900 dark:hover:text-gray-50 transition-colors"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      Title
                      {getSortIcon('title')}
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-slate-900 dark:hover:text-gray-50 transition-colors"
                    onClick={() => handleSort('url')}
                  >
                    <div className="flex items-center">
                      URL
                      {getSortIcon('url')}
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-slate-900 dark:hover:text-gray-50 transition-colors"
                    onClick={() => handleSort('visits')}
                  >
                    <div className="flex items-center">
                      Visits
                      {getSortIcon('visits')}
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-slate-900 dark:hover:text-gray-50 transition-colors"
                    onClick={() => handleSort('last_visit')}
                  >
                    <div className="flex items-center">
                      Last Visit
                      {getSortIcon('last_visit')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedEntries.map((entry) => (
                  <React.Fragment key={entry.id}>
                    {/* Main row */}
                    <tr
                      className={cn(
                        'border-b border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors',
                        entry.flagged && 'bg-red-50 dark:bg-red-900/20'
                      )}
                    >
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleRow(entry.id)}
                          className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-50"
                          aria-label={expandedRows.has(entry.id) ? 'Collapse row' : 'Expand row'}
                        >
                          {expandedRows.has(entry.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getBrowserIcon(entry.browser)}
                          <span className="text-sm text-slate-900 dark:text-gray-50 capitalize">{entry.browser}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-gray-50 max-w-xs truncate">
                          {entry.title}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1 max-w-md truncate"
                        >
                          <span className="truncate">{entry.url}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-slate-900 dark:text-gray-50">{entry.visit_count}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-slate-600 dark:text-gray-400">{formatTimeAgo(entry.visit_time)}</span>
                      </td>
                    </tr>

                    {/* Expanded row - Visit details */}
                    {expandedRows.has(entry.id) && entry.visit_details && (
                      <tr className={cn(
                        'border-b border-slate-200 dark:border-gray-700',
                        entry.flagged && 'bg-red-50 dark:bg-red-900/20'
                      )}>
                        <td colSpan={6} className="py-4 px-4">
                          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 ml-8">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-gray-50 mb-3">
                              Visit History ({entry.visit_details.length} visits)
                            </h4>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {entry.visit_details.map((visit, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-gray-700/50 rounded text-xs"
                                >
                                  <div className="flex items-center space-x-3">
                                    <span className="text-slate-600 dark:text-gray-400 font-mono">
                                      {new Date(visit.visit_time).toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-slate-700 dark:text-gray-300">
                                      Duration: {formatDuration(visit.duration)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredEntries.length)} of{' '}
              {filteredEntries.length} entries
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
      </CardContent>
    </Card>
  )
}

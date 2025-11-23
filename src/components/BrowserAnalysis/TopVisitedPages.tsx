import React, { useState, useMemo } from 'react'
import { BarChart3, Calendar as CalendarIcon, X } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { HistoryEntry } from '@/data/mockBrowserData'
import { cn } from '@/lib/utils'

interface TopVisitedPagesProps {
  entries: HistoryEntry[]
}

export const TopVisitedPages: React.FC<TopVisitedPagesProps> = ({ entries }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d')
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')

  // Filter entries by date range
  const filteredEntries = useMemo(() => {
    const now = new Date()
    let startDate: Date

    if (timeRange === 'custom' && customStartDate && customEndDate) {
      startDate = new Date(customStartDate)
      const endDate = new Date(customEndDate)
      return entries.filter(entry => {
        const entryDate = new Date(entry.last_visit)
        return entryDate >= startDate && entryDate <= endDate
      })
    } else {
      switch (timeRange) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      }

      return entries.filter(entry => {
        const entryDate = new Date(entry.last_visit)
        return entryDate >= startDate
      })
    }
  }, [entries, timeRange, customStartDate, customEndDate])

  // Calculate top 10 visited pages
  const topPages = useMemo(() => {
    // Group by URL and sum visit counts
    const urlVisits = new Map<string, { url: string; title: string; visitCount: number }>()

    filteredEntries.forEach(entry => {
      const existing = urlVisits.get(entry.url)
      if (existing) {
        existing.visitCount += entry.visit_count
      } else {
        urlVisits.set(entry.url, {
          url: entry.url,
          title: entry.title,
          visitCount: entry.visit_count
        })
      }
    })

    // Convert to array and sort by visit count, take top 10
    const sorted = Array.from(urlVisits.values())
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, 10)

    return sorted
  }, [filteredEntries])

  // Get max visit count for scaling bars
  const maxVisits = topPages.length > 0 ? topPages[0].visitCount : 1

  const extractDomain = (url: string): string => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname
    } catch {
      return url
    }
  }

  const handleTimeRangeChange = (range: '7d' | '30d' | '90d' | 'custom') => {
    setTimeRange(range)
    if (range === 'custom') {
      setShowCustomPicker(true)
    } else {
      setShowCustomPicker(false)
    }
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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            Top 10 Visited Pages
          </h2>
          <div className="flex space-x-2">
            {(['7d', '30d', '90d', 'custom'] as const).map((range) => (
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
                {range === '7d' ? 'Last 7d' : range === '30d' ? 'Last 30d' : range === '90d' ? 'Last 90d' : 'Custom'}
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

        {topPages.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-gray-400">
            No pages visited in this time period
          </div>
        ) : (
          <div className="space-y-3">
            {topPages.map((page, index) => {
              const barWidth = (page.visitCount / maxVisits) * 100
              const domain = extractDomain(page.url)

              return (
                <div key={page.url} className="group">
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-sm font-semibold text-slate-500 dark:text-gray-400 w-6">
                      #{index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-900 dark:text-gray-50 truncate">
                            {page.title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-gray-400 truncate">
                            {domain}
                          </div>
                        </div>
                        <span className="ml-3 text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {page.visitCount.toLocaleString()} visits
                        </span>
                      </div>
                      {/* Bar */}
                      <div className="w-full bg-slate-100 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 flex items-center justify-end px-2"
                          style={{ width: `${barWidth}%` }}
                        >
                          {barWidth > 15 && (
                            <span className="text-xs font-medium text-white">
                              {page.visitCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-gray-400">
              Showing top {topPages.length} of {filteredEntries.length} unique pages
            </span>
            <span className="text-slate-900 dark:text-gray-50 font-medium">
              Total Visits: {topPages.reduce((sum, page) => sum + page.visitCount, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

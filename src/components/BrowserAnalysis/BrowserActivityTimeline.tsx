import React, { useState, useMemo } from 'react'
import { Activity, AlertTriangle, Calendar as CalendarIcon, X } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { TimelineData } from '@/data/mockBrowserData'
import { cn } from '@/lib/utils'

interface BrowserActivityTimelineProps {
  data: TimelineData[]
}

export const BrowserActivityTimeline: React.FC<BrowserActivityTimelineProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'custom'>('24h')
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  // Generate data based on selected time range
  const displayData = useMemo(() => {
    const now = new Date()

    switch (timeRange) {
      case '24h':
        // Generate hourly data for last 24 hours
        return Array.from({ length: 24 }, (_, i) => {
          const hour = i
          const isBusinessHours = hour >= 9 && hour <= 17
          const baseActivity = isBusinessHours
            ? Math.floor(Math.random() * 300) + 200
            : Math.floor(Math.random() * 50)

          return {
            timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0).toISOString(),
            hour: hour,
            activity_count: baseActivity,
            browser: "chrome"
          }
        })

      case '7d':
        // Generate daily data for last 7 days
        return Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now)
          date.setDate(date.getDate() - (6 - i))
          const isWeekday = date.getDay() >= 1 && date.getDay() <= 5
          const baseActivity = isWeekday
            ? Math.floor(Math.random() * 800) + 400
            : Math.floor(Math.random() * 200) + 100

          return {
            timestamp: date.toISOString(),
            hour: date.getDate(), // Use date for day view
            activity_count: baseActivity,
            browser: "chrome"
          }
        })

      case '30d':
        // Generate daily data for last 30 days
        return Array.from({ length: 30 }, (_, i) => {
          const date = new Date(now)
          date.setDate(date.getDate() - (29 - i))
          const isWeekday = date.getDay() >= 1 && date.getDay() <= 5
          const baseActivity = isWeekday
            ? Math.floor(Math.random() * 800) + 400
            : Math.floor(Math.random() * 200) + 100

          return {
            timestamp: date.toISOString(),
            hour: date.getDate(), // Use date for day view
            activity_count: baseActivity,
            browser: "chrome"
          }
        })

      case 'custom':
        // Generate data for custom range
        if (!customStartDate || !customEndDate) {
          // Default to last 7 days if no custom range selected
          const fallbackData = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(now)
            date.setDate(date.getDate() - (6 - i))
            return {
              timestamp: date.toISOString(),
              hour: date.getDate(),
              activity_count: Math.floor(Math.random() * 500) + 200,
              browser: "chrome"
            }
          })
          return fallbackData
        }

        const start = new Date(customStartDate)
        const end = new Date(customEndDate)
        const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

        return Array.from({ length: daysDiff }, (_, i) => {
          const date = new Date(start)
          date.setDate(date.getDate() + i)
          const isWeekday = date.getDay() >= 1 && date.getDay() <= 5
          const baseActivity = isWeekday
            ? Math.floor(Math.random() * 800) + 400
            : Math.floor(Math.random() * 200) + 100

          return {
            timestamp: date.toISOString(),
            hour: date.getDate(),
            activity_count: baseActivity,
            browser: "chrome"
          }
        })

      default:
        return data
    }
  }, [timeRange, customStartDate, customEndDate, data])

  // Find peak activity
  const peakActivity = displayData.reduce((max, curr) => curr.activity_count > max.activity_count ? curr : max, displayData[0] || { hour: 0, activity_count: 0 })
  const maxCount = Math.max(...displayData.map(d => d.activity_count), 1)

  // Detect off-hours activity (11 PM - 6 AM) - only for 24h view
  const offHoursActivity = timeRange === '24h' && displayData.filter(d => d.hour >= 23 || d.hour < 6).some(d => d.activity_count > 50)

  const getBarHeight = (count: number): number => {
    return maxCount > 0 ? (count / maxCount) * 100 : 0
  }

  const getBarColor = (hour: number, count: number): string => {
    const isOffHours = hour >= 23 || hour < 6
    const isHighActivity = count > 200

    if (isOffHours && isHighActivity) {
      return 'bg-red-500 dark:bg-red-600'
    } else if (isOffHours) {
      return 'bg-orange-500 dark:bg-orange-600'
    } else {
      return 'bg-blue-500 dark:bg-blue-600'
    }
  }

  const formatLabel = (item: TimelineData, index: number): string => {
    if (timeRange === '24h') {
      const hour = item.hour
      if (hour === 0) return '12a'
      if (hour < 12) return `${hour}a`
      if (hour === 12) return '12p'
      return `${hour - 12}p`
    } else {
      // For day/date views, show the day of month or abbreviated date
      const date = new Date(item.timestamp)
      if (timeRange === '7d') {
        return date.toLocaleDateString('en-US', { weekday: 'short' })
      }
      return date.getDate().toString()
    }
  }

  const formatTooltip = (item: TimelineData): string => {
    if (timeRange === '24h') {
      const hour = item.hour
      const formatted = hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`
      return `${formatted}: ${item.activity_count} events`
    } else {
      const date = new Date(item.timestamp)
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${item.activity_count} events`
    }
  }

  const handleTimeRangeChange = (range: '24h' | '7d' | '30d' | 'custom') => {
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

  const getXAxisLabel = (): string => {
    switch (timeRange) {
      case '24h':
        return 'Hour of Day'
      case '7d':
        return 'Day of Week (Last 7 Days)'
      case '30d':
        return 'Day of Month (Last 30 Days)'
      case 'custom':
        if (customStartDate && customEndDate) {
          return `Custom Range: ${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()}`
        }
        return 'Custom Date Range'
      default:
        return 'Time'
    }
  }

  return (
    <Card variant="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" />
            Browser Activity Timeline
          </h2>
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

        {/* Chart */}
        <div className="mb-6">
          <div className="flex items-end justify-between h-48 gap-1 bg-white/40 dark:bg-gray-800/40 rounded-lg p-4">
            {displayData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex-1 flex items-end justify-center">
                  <div
                    className={cn(
                      'w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer relative group',
                      getBarColor(item.hour, item.activity_count)
                    )}
                    style={{ height: `${getBarHeight(item.activity_count)}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {formatTooltip(item)}
                    </div>
                  </div>
                </div>
                {(timeRange === '24h' ? index % 2 === 0 : timeRange === '7d' ? true : index % 3 === 0) && (
                  <div className="text-xs text-slate-600 dark:text-gray-400 mt-1">
                    {formatLabel(item, index)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* X-axis label */}
          <div className="text-center text-xs text-slate-600 dark:text-gray-400 mt-2">
            {getXAxisLabel()}
          </div>
        </div>

        {/* Legend - Only show for 24h view */}
        {timeRange === '24h' && (
          <>
            <div className="flex items-center justify-center space-x-6 mb-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-slate-700 dark:text-gray-300">Normal Hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-orange-500"></div>
                <span className="text-slate-700 dark:text-gray-300">Off Hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span className="text-slate-700 dark:text-gray-300">High Off-Hours Activity</span>
              </div>
            </div>

            {/* Off-Hours Alert */}
            {offHoursActivity && (
              <div className="bg-red-50 dark:bg-red-900/20 backdrop-blur-sm rounded-lg p-4 border border-red-200/60 dark:border-red-700/60">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <div className="text-sm text-red-700 dark:text-red-400 font-medium">
                      Off-Hours Activity Detected
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-500 mt-1">
                      Unusual activity between 11 PM - 6 AM
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
